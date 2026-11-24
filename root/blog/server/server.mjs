// ZCode Sites 服务端：静态托管 Vue 构建产物 + 从 GitHub 仓库拉取文章的 API。
// 配置（非密钥，经 start.sh 环境变量注入）：GH_OWNER / GH_REPO / GH_BRANCH
// 设计要点：
//  - 文章列表带内存缓存（TTL 60s），后台保存后调用 /api/purge 立即失效
//  - GitHub 不可达时自动切换 jsDelivr CDN；仍失败则继续返回上一次成功的数据
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve, sep } from 'node:path'

const PORT = Number(process.env.PORT ?? 3000)
const SITE_DIR = resolve(process.argv[2] ?? 'dist')
const GH = {
  owner: process.env.GH_OWNER ?? '',
  repo: process.env.GH_REPO ?? '',
  branch: process.env.GH_BRANCH ?? 'main',
}
// 公网地址：容器收到的 Host 是平台内部域名，RSS/Sitemap 必须用对外域名
const SITE_URL = process.env.SITE_URL || 'https://yanqi-blog-me2z.zai.site'
// 资料服务（用户自己的服务器）
const RES_ORIGIN = (process.env.RES_ORIGIN || 'http://93.177.76.152:3001').replace(/\/$/, '')

const CACHE_TTL = 60_000
let cache = { posts: null, at: 0 } // posts: 上一次成功结果
let cacheDirty = true
let lastPurge = 0
let inflightLoad = null // 进行中的回源请求（并发去重）
let lastFetchInfo = null // 最近一次回源结果，便于排查问题
let resListCache = null // 资料列表缓存（30s）
let musicCache = null // 歌单缓存（60s）
const logRate = new Map() // /api/log 每 IP 限流
let likesCache = null // 点赞缓存（30s）
let linksCache = null // 友链缓存（60s）
let announceCache = null // 公告缓存（60s）
let galleryCache = null // 图片库缓存（60s）

/* ---------- 小工具 ---------- */

async function fetchWithTimeout(url, ms = 8000, extraHeaders = {}) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), ms)
  try {
    return await fetch(url, {
      signal: ctrl.signal,
      headers: {
        'User-Agent': 'yanqi-blog-server',
        Accept: 'application/vnd.github+json',
        ...extraHeaders,
      },
    })
  } finally {
    clearTimeout(timer)
  }
}

// 与前端一致的 frontmatter 解析（服务端独立实现，零依赖）
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return { data: {}, body: raw }
  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([\w$]+)\s*:\s*(.*)$/)
    if (!kv) continue
    const [, key, value] = kv
    if (key === 'tags') {
      data.tags = value
        .replace(/^\[|\]$/g, '')
        .split(/[,，]/)
        .map((t) => t.trim())
        .filter(Boolean)
    } else if (value === 'true' || value === 'false') {
      data[key] = value === 'true'
    } else {
      data[key] = value.trim()
    }
  }
  return { data, body: raw.slice(match[0].length) }
}

/* ---------- 文章目录：GitHub（ETag 条件请求）优先，jsDelivr 兜底 ---------- */

let treeEtag = null // GitHub trees 接口的 ETag；304 响应不消耗限流额度
let lastTreeResult = null // 304 时复用的上次结果

async function listPostPaths() {
  const { owner, repo, branch } = GH
  // 1) GitHub Trees API
  try {
    const headers = { 'User-Agent': 'yanqi-blog-server', Accept: 'application/vnd.github+json' }
    if (treeEtag) headers['If-None-Match'] = treeEtag
    const res = await fetchWithTimeout(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
      8000,
      headers,
    )
    if (res.status === 304 && lastTreeResult) return { ...lastTreeResult, unchanged: true }
    if (res.ok) {
      treeEtag = res.headers.get('etag')
      const tree = (await res.json()).tree || []
      lastTreeResult = {
        paths: tree
          .filter((e) => e.type === 'blob' && e.path.startsWith('posts/') && e.path.endsWith('.md'))
          .map((e) => e.path),
        source: 'github',
      }
      return lastTreeResult
    }
    if (res.status === 404) return { paths: [], source: 'github' } // 仓库还没有任何提交
    throw new Error(`github tree ${res.status}`)
  } catch {
    /* 落到 jsDelivr */
  }
  // 2) jsDelivr 文件清单
  const res = await fetchWithTimeout(
    `https://data.jsdelivr.com/v1/package/gh/${owner}/${repo}@${branch}/flat`,
  )
  if (!res.ok) {
    if (res.status === 404) return { paths: [], source: 'jsdelivr' }
    throw new Error(`jsdelivr flat ${res.status}`)
  }
  const files = (await res.json()).files || []
  return {
    paths: files
      .filter((f) => f.name.startsWith('posts/') && f.name.endsWith('.md'))
      .map((f) => f.name),
    source: 'jsdelivr',
  }
}

// 单篇正文：raw → jsDelivr → GitHub contents API（base64），三源依次回退
async function fetchPostFile(path) {
  const { owner, repo, branch } = GH
  const sources = [
    {
      url: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`,
      text: (res) => res.text(),
    },
    {
      url: `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${path}`,
      text: (res) => res.text(),
    },
    {
      url: `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      text: async (res) => Buffer.from((await res.json()).content, 'base64').toString('utf8'),
    },
  ]
  for (const s of sources) {
    try {
      const res = await fetchWithTimeout(s.url, 8000, {
        'User-Agent': 'yanqi-blog-server',
        Accept: 'application/vnd.github+json',
      })
      if (res.ok) return await s.text(res)
    } catch {
      /* 试下一个源 */
    }
  }
  throw new Error(`fetch failed: ${path}`)
}

async function loadAllPosts() {
  const { paths, source, unchanged } = await listPostPaths()
  // 树未变化（ETag 304）：文件内容必然与缓存一致，直接沿用，零额外请求
  if (unchanged && cache.posts) return { posts: cache.posts, source, unchanged: true }
  const raws = await Promise.all(
    paths.map(async (p) => {
      const raw = await fetchPostFile(p)
      const { data, body } = parseFrontmatter(raw)
      const slug = p.replace(/^posts\//, '').replace(/\.md$/, '')
      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        category: data.category || '未分类',
        tags: data.tags || [],
        summary: data.summary || body.replace(/[#>*`\-!\[\]()]/g, '').trim().slice(0, 80) + '…',
        pinned: !!data.pin,
        series: data.series || '',
        body,
      }
    }),
  )
  raws.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return (b.date || '').localeCompare(a.date || '')
  })
  return { posts: raws, source }
}

/* ---------- 静态文件（与 static-server.mjs 同策略） ---------- */

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.wasm': 'application/wasm',
}

async function fileAt(path) {
  try {
    const info = await stat(path)
    return info.isFile() ? { path, size: info.size } : undefined
  } catch {
    return undefined
  }
}

async function resolveFile(urlPath) {
  const rel = normalize(decodeURIComponent(urlPath)).replace(/^([/\\])+/, '')
  const base = join(SITE_DIR, rel)
  if (base !== SITE_DIR && !base.startsWith(SITE_DIR + sep)) return undefined
  return (
    (await fileAt(base)) ??
    (await fileAt(`${base}.html`)) ??
    (await fileAt(join(base, 'index.html')))
  )
}

function sendFile(req, res, status, file) {
  const type = MIME[extname(file.path).toLowerCase()] ?? 'application/octet-stream'
  const rel = file.path.slice(SITE_DIR.length).split(sep).join('/')
  const immutable = !type.startsWith('text/html') && /^\/(assets|_astro|_next\/static)\//.test(rel)
  res.writeHead(status, {
    'Content-Type': type,
    'Content-Length': file.size,
    'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
  })
  if (req.method === 'HEAD') return res.end()
  createReadStream(file.path).pipe(res)
}

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  })
  res.end(body)
}

function sendXml(res, status, type, xml) {
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'public, max-age=600',
  })
  res.end(xml)
}

/* ---------- 站点错误日志（写往资料服务，每类错误每分钟最多一条） ---------- */

const errLogLast = new Map()
function reportError(key, detail) {
  const now = Date.now()
  const last = errLogLast.get(key) || 0
  if (now - last < 60_000) return
  errLogLast.set(key, now)
  fetch(`${RES_ORIGIN}/log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'err', detail: key + ': ' + String(detail).slice(0, 260) }),
  }).catch(() => {})
}

/* ---------- 回源刷新（并发去重，失败回退旧缓存） ---------- */

function refreshPosts() {
  if (!inflightLoad) {
    inflightLoad = loadAllPosts()
      .then((r) => {
        cache = { posts: r.posts, at: Date.now() }
        cacheDirty = false
        lastFetchInfo = { ok: true, source: r.source, at: new Date().toISOString() }
        return { posts: r.posts, stale: false }
      })
      .catch((err) => {
        console.error('load posts failed:', err.message)
        reportError('文章回源失败', err.message)
        lastFetchInfo = { ok: false, error: err.message, at: new Date().toISOString() }
        if (cache.posts) return { posts: cache.posts, stale: true }
        throw err
      })
      .finally(() => {
        inflightLoad = null
      })
  }
  return inflightLoad
}

/* ---------- RSS / Sitemap ---------- */

function xmlEsc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function baseUrl() {
  return SITE_URL.replace(/\/$/, '')
}

async function buildRss(req) {
  const { posts } = await refreshPosts()
  const base = baseUrl()
  const items = posts
    .map(
      (p) => `    <item>
      <title>${xmlEsc(p.title)}</title>
      <link>${xmlEsc(`${base}/#/post/${p.slug}`)}</link>
      <guid isPermaLink="false">${xmlEsc(p.slug)}</guid>
      <pubDate>${p.date ? new Date(p.date + 'T00:00:00+08:00').toUTCString() : ''}</pubDate>
      <description>${xmlEsc(p.summary)}</description>
      <category>${xmlEsc(p.category)}</category>
    </item>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>岩栖_shard 的博客</title>
    <link>${xmlEsc(base)}</link>
    <description>个人博客 · 技术与生活</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`
}

async function buildSitemap(req) {
  const { posts } = await refreshPosts()
  const base = baseUrl()
  const staticUrls = ['', '/#/archive', '/#/tools', '/#/about'].map(
    (p) => `  <url><loc>${xmlEsc(base + p)}</loc></url>`,
  )
  const postUrls = posts.map(
    (p) =>
      `  <url><loc>${xmlEsc(`${base}/#/post/${p.slug}`)}</loc>${p.date ? `<lastmod>${p.date}</lastmod>` : ''}</url>`,
  )
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...postUrls].join('\n')}
</urlset>`
}

/* ---------- HTTP 服务 ---------- */

createServer(async (req, res) => {
  // 基础安全响应头（对所有响应生效）
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  const pathname = (() => {
    try {
      return new URL(req.url ?? '/', 'http://localhost').pathname
    } catch {
      return null
    }
  })()

  if (!pathname) return sendJson(res, 400, { error: 'bad request' })

  // ---- API ----
  if (pathname === '/api/config' && req.method === 'GET') {
    return sendJson(res, 200, { owner: GH.owner, repo: GH.repo, branch: GH.branch })
  }

  // 并发去重的回源刷新见模块级 refreshPosts()
  if (pathname === '/api/posts' && req.method === 'GET') {
    const q = new URL(req.url || '/', 'http://localhost').searchParams
    const slug = (q.get('slug') || '').replace(/[^a-zA-Z0-9-_]/g, '')
    try {
      const result = await refreshPosts()
      if (slug) {
        // 单篇：带正文（文章页按需拉取，首页不再下载全部全文）
        const post = result.posts.find((p) => p.slug === slug)
        return sendJson(res, 200, { post: post || null, cached: false })
      }
      // 列表：仅元数据（正文剥离），体积从 MB 级降到 KB 级
      const meta = result.posts.map(({ body, ...m }) => m)
      return sendJson(res, 200, { posts: meta, cached: false, lastFetch: lastFetchInfo })
    } catch {
      return sendJson(res, 502, { error: '无法从 GitHub 拉取文章，请稍后再试' })
    }
  }

  // 服务端搜索（客户端不再需要全部正文）
  if (pathname === '/api/search' && req.method === 'GET') {
    const q = new URL(req.url || '/', 'http://localhost').searchParams
    const kw = (q.get('q') || '').trim().toLowerCase().slice(0, 60)
    if (!kw) return sendJson(res, 200, { results: [] })
    try {
      const { posts } = await refreshPosts()
      const results = posts
        .filter((p) =>
          [p.title, p.summary, p.category, ...p.tags, p.body].join('\n').toLowerCase().includes(kw),
        )
        .slice(0, 8)
        .map(({ body, ...m }) => m)
      return sendJson(res, 200, { results })
    } catch {
      return sendJson(res, 502, { error: '搜索暂时不可用' })
    }
  }

  if (pathname === '/rss.xml' && req.method === 'GET') {
    try {
      const xml = await buildRss(req)
      return sendXml(res, 200, 'application/rss+xml; charset=utf-8', xml)
    } catch {
      return sendXml(res, 503, 'text/plain; charset=utf-8', 'RSS 暂不可用')
    }
  }

  if (pathname === '/sitemap.xml' && req.method === 'GET') {
    try {
      const xml = await buildSitemap(req)
      return sendXml(res, 200, 'application/xml; charset=utf-8', xml)
    } catch {
      return sendXml(res, 503, 'text/plain; charset=utf-8', 'Sitemap 暂不可用')
    }
  }

  // ---- 资料服务代理 ----
  if (pathname === '/api/res/list' && req.method === 'GET') {
    if (resListCache && Date.now() - resListCache.at < 30_000) {
      return sendJson(res, 200, resListCache.data)
    }
    try {
      const r = await fetchWithTimeout(`${RES_ORIGIN}/list`, 8000)
      if (!r.ok) throw new Error(`origin ${r.status}`)
      const data = await r.json()
      resListCache = { at: Date.now(), data }
      return sendJson(res, 200, data)
    } catch {
      if (resListCache) return sendJson(res, 200, { ...resListCache.data, stale: true })
      return sendJson(res, 502, { error: '资料服务暂时不可达（需确认服务器 3001 端口已对外放行）' })
    }
  }

  if (pathname.startsWith('/api/res/download/') && req.method === 'GET') {
    const id = pathname.slice('/api/res/download/'.length).replace(/[^a-zA-Z0-9_-]/g, '')
    if (!id) return sendJson(res, 400, { error: 'bad id' })
    try {
      const r = await fetch(`${RES_ORIGIN}/file/${id}`)
      if (!r.ok || !r.body) {
        return sendJson(res, r.status === 404 ? 404 : 502, { error: '文件不存在或服务不可达' })
      }
      res.writeHead(200, {
        'Content-Type': r.headers.get('content-type') || 'application/octet-stream',
        ...(r.headers.get('content-length')
          ? { 'Content-Length': r.headers.get('content-length') }
          : {}),
        'Content-Disposition': r.headers.get('content-disposition') || 'attachment',
        // 文件 id 一次上传永不变更，可永久缓存
        'Cache-Control': 'public, max-age=31536000, immutable',
      })
      // Web 流转 Node 流，边收边发，大文件不占内存
      const { Readable } = await import('node:stream')
      Readable.fromWeb(r.body).pipe(res)
      return
    } catch {
      return sendJson(res, 502, { error: '下载失败：资料服务不可达' })
    }
  }

  // ---- 令牌校验代理 ----
  if (pathname === '/api/res/verify' && req.method === 'GET') {
    try {
      const r = await fetchWithTimeout(`${RES_ORIGIN}/verify`, 8000, {
        Authorization: req.headers.authorization || '',
      })
      if (r.ok) return sendJson(res, 200, { ok: true })
      return sendJson(res, 401, { error: '令牌无效或已失效，请重新登录' })
    } catch {
      return sendJson(res, 502, { error: '资料服务暂时不可达，请稍后再试' })
    }
  }

  // ---- 歌单代理 ----
  if (pathname === '/api/music/playlist' && req.method === 'GET') {
    if (musicCache && Date.now() - musicCache.at < 60_000) {
      return sendJson(res, 200, musicCache.data)
    }
    try {
      const r = await fetchWithTimeout(`${RES_ORIGIN}/playlist`, 8000)
      if (!r.ok) throw new Error(`origin ${r.status}`)
      const data = await r.json()
      musicCache = { at: Date.now(), data }
      return sendJson(res, 200, data)
    } catch {
      if (musicCache) return sendJson(res, 200, musicCache.data)
      return sendJson(res, 502, { tracks: [], error: '歌单暂时不可达' })
    }
  }

  if (pathname === '/api/music/playlist' && req.method === 'PUT') {
    let body = ''
    for await (const c of req) body += c
    try {
      const r = await fetch(`${RES_ORIGIN}/playlist`, {
        method: 'PUT',
        headers: { Authorization: req.headers.authorization || '', 'Content-Type': 'application/json' },
        body,
      })
      musicCache = null
      return sendJson(res, r.status, await r.json())
    } catch {
      return sendJson(res, 502, { error: '保存失败：资料服务不可达' })
    }
  }

  // ---- 图片库 ----
  if (pathname === '/api/gallery' && req.method === 'GET') {
    if (galleryCache && Date.now() - galleryCache.at < 60_000) return sendJson(res, 200, galleryCache.data)
    try {
      const r = await fetchWithTimeout(`${RES_ORIGIN}/gallery-list`, 8000)
      if (!r.ok) throw new Error('origin')
      const data = await r.json()
      galleryCache = { at: Date.now(), data }
      return sendJson(res, 200, data)
    } catch {
      return sendJson(res, 200, galleryCache ? galleryCache.data : { files: [] })
    }
  }

  // ---- 点赞 / 友链 / 公告 代理 ----
  if (pathname === '/api/likes' && req.method === 'GET') {
    if (likesCache && Date.now() - likesCache.at < 30_000) return sendJson(res, 200, likesCache.data)
    try {
      const r = await fetchWithTimeout(`${RES_ORIGIN}/likes`, 8000)
      if (!r.ok) throw new Error('origin')
      const data = await r.json()
      likesCache = { at: Date.now(), data }
      return sendJson(res, 200, data)
    } catch {
      return sendJson(res, 200, likesCache ? likesCache.data : {})
    }
  }

  if (pathname.startsWith('/api/like/') && req.method === 'POST') {
    try {
      const likeQ = new URL(req.url || '/', 'http://localhost').search
      const r = await fetch(`${RES_ORIGIN}${pathname.replace('/api/like', '/like')}${likeQ}`, { method: 'POST' })
      likesCache = null
      return sendJson(res, r.status, await r.json())
    } catch {
      return sendJson(res, 502, { error: '点赞失败，稍后再试' })
    }
  }

  if (pathname === '/api/links' && req.method === 'GET') {
    if (linksCache && Date.now() - linksCache.at < 60_000) return sendJson(res, 200, linksCache.data)
    try {
      const r = await fetchWithTimeout(`${RES_ORIGIN}/links`, 8000)
      if (!r.ok) throw new Error('origin')
      const data = await r.json()
      linksCache = { at: Date.now(), data }
      return sendJson(res, 200, data)
    } catch {
      return sendJson(res, 200, linksCache ? linksCache.data : { links: [] })
    }
  }

  if (pathname === '/api/links' && req.method === 'PUT') {
    let body = ''
    for await (const c of req) body += c
    try {
      const r = await fetch(`${RES_ORIGIN}/links`, {
        method: 'PUT',
        headers: { Authorization: req.headers.authorization || '', 'Content-Type': 'application/json' },
        body,
      })
      linksCache = null
      return sendJson(res, r.status, await r.json())
    } catch {
      return sendJson(res, 502, { error: '保存失败：服务不可达' })
    }
  }

  if (pathname === '/api/announce' && req.method === 'GET') {
    if (announceCache && Date.now() - announceCache.at < 60_000) return sendJson(res, 200, announceCache.data)
    try {
      const r = await fetchWithTimeout(`${RES_ORIGIN}/announce`, 8000)
      if (!r.ok) throw new Error('origin')
      const data = await r.json()
      announceCache = { at: Date.now(), data }
      return sendJson(res, 200, data)
    } catch {
      return sendJson(res, 200, { on: false, text: '' })
    }
  }

  if (pathname === '/api/announce' && req.method === 'PUT') {
    let body = ''
    for await (const c of req) body += c
    try {
      const r = await fetch(`${RES_ORIGIN}/announce`, {
        method: 'PUT',
        headers: { Authorization: req.headers.authorization || '', 'Content-Type': 'application/json' },
        body,
      })
      announceCache = null
      return sendJson(res, r.status, await r.json())
    } catch {
      return sendJson(res, 502, { error: '保存失败：服务不可达' })
    }
  }

  // ---- 文章路径 URL：爬虫给 OG 卡片 meta，普通浏览器 301 跳 hash 路由 ----
  if (pathname.startsWith('/post/') && req.method === 'GET') {
    const slug = pathname.slice(6).replace(/[^a-zA-Z0-9-_]/g, '')
    const ua = String(req.headers['user-agent'] || '').toLowerCase()
    const isCrawler =
      /bot|spider|slurp|crawler|facebookexternalhit|twitterbot|telegrambot|whatsapp|slack|discord|qq\/|wechat|micromessenger|preview|skype|linkedin|napshot/.test(ua)

    if (!isCrawler) {
      res.writeHead(301, { Location: `/#/post/${slug}` }).end()
      return
    }

    let post = null
    try {
      const { posts } = await refreshPosts()
      post = posts.find((p) => p.slug === slug)
    } catch {}
    const esc = (s) =>
      String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    const title = post ? post.title : '岩栖_shard 的博客'
    const desc = post ? String(post.summary || '').replace(/\s+/g, ' ').slice(0, 120) : '个人博客 · 技术与生活'
    // 封面：文章第一张图（本地化过的走同域），否则默认底图
    let img = `${SITE_URL}/og-default.png`
    if (post) {
      const m = String(post.body || '').match(/!\[[^\]]*\]\(([^)\s]+)\)/)
      if (m) img = m[1].startsWith('http') ? m[1] : SITE_URL + m[1]
    }
    const url = `${SITE_URL}/post/${slug}`
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>${esc(title)} · 岩栖_shard</title>
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(img)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:site_name" content="岩栖_shard 的博客">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(img)}">
<script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: title,
  description: desc,
  image: img,
  url,
  author: { '@type': 'Person', name: '岩栖_shard' },
  ...(post?.date ? { datePublished: post.date } : {}),
})}
</script>
</head>
<body>
<script>location.replace('/#/post/${slug}')</script>
<noscript><a href="/#/post/${slug}">打开文章</a></noscript>
</body>
</html>`
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=600' })
    res.end(html)
    return
  }

  // ---- 周期报告（公开）：period=week|month|year，offset=0 本期实时，N 为往前第 N 期 ----
  if (pathname === '/api/report' && req.method === 'GET') {
    const q = new URL(req.url || '/', 'http://localhost').searchParams
    const period = ['week', 'month', 'year'].includes(q.get('period')) ? q.get('period') : 'week'
    const offset = Math.max(0, Math.min(Number(q.get('offset')) || 0, 20))

    // 以东八区计算周期边界（与文章日期的书写习惯一致）
    const now = new Date(Date.now() + 8 * 3600_000)
    const iso = (d) => d.toISOString().slice(0, 10)
    let from, to, label
    if (period === 'week') {
      const dow = (now.getUTCDay() + 6) % 7 // 0 = 周一
      const monday = new Date(now.getTime() - dow * 86400_000 - offset * 7 * 86400_000)
      from = iso(monday)
      to = iso(new Date(monday.getTime() + 6 * 86400_000))
      label = `${from.slice(5).replace('-', '/')} ~ ${to.slice(5).replace('-', '/')}`
    } else if (period === 'month') {
      const y = now.getUTCFullYear()
      const m = now.getUTCMonth() - offset
      const start = new Date(Date.UTC(y, m, 1))
      const end = new Date(Date.UTC(y, m + 1, 0))
      from = iso(start)
      to = iso(end)
      label = `${start.getUTCFullYear()} 年 ${start.getUTCMonth() + 1} 月`
    } else {
      const y = now.getUTCFullYear() - offset
      from = `${y}-01-01`
      to = `${y}-12-31`
      label = `${y} 年`
    }

    try {
      const { posts } = await refreshPosts()

      // 建站日 = 最早一篇文章的日期；此前的周期视为建站前，不再提供
      const siteStart = posts.length ? posts[posts.length - 1].date : ''
      if (siteStart && to < siteStart) {
        return sendJson(res, 200, {
          period, offset, from, to, label, live: false, siteStart,
          beforeSite: true,
          articles: { count: 0, totalWords: 0, byCategory: {}, list: [], longest: null },
          access: { count: 0, top: [] },
          highlights: ['建站之前，还没有故事'],
        })
      }

      // 文章统计
      const inRange = posts.filter((p) => p.date >= from && p.date <= to)
      const wordsOf = (body) => {
        const plain = String(body || '').replace(/[#>*`~!\[\]()|-]/g, '')
        const cjk = (plain.match(/[\u4e00-\u9fff]/g) || []).length
        const en = (plain.replace(/[\u4e00-\u9fff]/g, ' ').match(/[a-zA-Z0-9]+/g) || []).length
        return cjk + en
      }
      let totalWords = 0
      const byCategory = {}
      const list = []
      let longest = null
      for (const p of inRange) {
        const w = wordsOf(p.body)
        totalWords += w
        byCategory[p.category] = (byCategory[p.category] || 0) + 1
        list.push({ slug: p.slug, title: p.title, date: p.date, words: w })
        if (!longest || w > longest.words) longest = { title: p.title, words: w }
      }

      // 访问统计（聚合层）
      let access = { count: 0, top: [] }
      try {
        const ar = await fetchWithTimeout(
          `${RES_ORIGIN}/agg/range?from=${from}&to=${to}`,
          8000,
        )
        if (ar.ok) access = await ar.json()
      } catch {}

      // 创作亮点
      const highlights = []
      if (inRange.length) {
        highlights.push(`本期发布 ${inRange.length} 篇 · 共约 ${totalWords >= 10000 ? (totalWords / 10000).toFixed(1) + ' 万' : totalWords} 字`)
        if (longest) highlights.push(`最长的一篇：《${longest.title}》（约 ${longest.words >= 10000 ? (longest.words / 10000).toFixed(1) + ' 万' : longest.words} 字）`)
        const topCat = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]
        if (topCat && Object.keys(byCategory).length > 1) highlights.push(`主要耕耘「${topCat[0]}」分类（${topCat[1]} 篇）`)
      }
      if (access.count) {
        highlights.push(`博客文章被阅读 ${access.count} 次`)
        if (access.top?.[0]?.title) highlights.push(`最受欢迎：《${access.top[0].title}》（${access.top[0].count} 次）`)
      }
      if (!highlights.length) highlights.push('本期还没有可总结的数据')

      return sendJson(res, 200, {
        period, offset, from, to, label,
        live: offset === 0,
        siteStart: siteStart || undefined,
        articles: { count: inRange.length, totalWords, byCategory, list, longest },
        access: { count: access.count || 0, top: access.top || [] },
        highlights,
      })
    } catch (err) {
      reportError('报告生成失败', err.message)
      return sendJson(res, 502, { error: '报告生成失败：文章数据不可用' })
    }
  }

  // ---- 访问/操作日志写入（公开，每 IP 限流） ----
  if (pathname === '/api/log' && req.method === 'POST') {
    const ip = req.socket.remoteAddress || '?'
    const win = Math.floor(Date.now() / 60_000)
    const rec = logRate.get(ip)
    if (!rec || rec.win !== win) logRate.set(ip, { win, n: 1 })
    else if (++rec.n > 60) return sendJson(res, 429, { error: '请求过于频繁' })
    try {
      let body = ''
      for await (const c of req) body += c
      // 补充真实客户端 IP（平台负载均衡后 socket 地址不是访客）
      try {
        const d = JSON.parse(body || '{}')
        // 从 XFF 链取第一个公网地址（平台会重写 XFF，链里可能混有内网跳数）
        const priv = (ip) =>
          !ip ||
          ip.startsWith('127.') ||
          ip.startsWith('10.') ||
          ip.startsWith('192.168.') ||
          /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
          ip.startsWith('fe80:') ||
          ip === '::1' ||
          /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(ip)
        const chain = String(req.headers['x-forwarded-for'] || '')
          .split(',')
          .map((x) => x.trim().replace(/[^0-9a-fA-F:.]/g, ''))
          .filter(Boolean)
        const ip =
          chain.find((x) => !priv(x)) ||
          chain[0] ||
          String(req.headers['x-real-ip'] || '').replace(/[^0-9a-fA-F:.]/g, '') ||
          (req.socket.remoteAddress || '').replace(/[^0-9a-fA-F:.]/g, '')
        d.ip = ip.slice(0, 45)
        body = JSON.stringify(d)
      } catch {}
      const r = await fetch(`${RES_ORIGIN}/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
      return sendJson(res, r.status, await r.json())
    } catch {
      return sendJson(res, 502, { error: '日志服务不可达' })
    }
  }

  // ---- 日志查询（需资料令牌） ----
  if (pathname === '/api/logs' && req.method === 'GET') {
    try {
      const relayQ = new URL(req.url || '/', 'http://localhost').search
      const r = await fetchWithTimeout(`${RES_ORIGIN}/logs${relayQ}`, 8000, {
        Authorization: req.headers.authorization || '',
      })
      return sendJson(res, r.status, await r.json())
    } catch {
      return sendJson(res, 502, { error: '日志服务不可达' })
    }
  }

  if (pathname === '/api/logs/stats' && req.method === 'GET') {
    try {
      const r = await fetchWithTimeout(`${RES_ORIGIN}/logs/stats`, 8000)
      return sendJson(res, r.status, await r.json())
    } catch {
      return sendJson(res, 502, { error: '日志服务不可达' })
    }
  }

  // ---- 图片本地化：服务端抓取外链图（无 Referer 限制）转存资料服务 ----
  if (pathname === '/api/res/localize' && req.method === 'POST') {
    let body = ''
    for await (const c of req) body += c
    let target
    try {
      target = JSON.parse(body || '{}').url
    } catch {}
    if (typeof target !== 'string' || !/^https?:\/\//.test(target)) {
      return sendJson(res, 400, { error: '无效的图片地址' })
    }
    try {
      const imgRes = await fetch(target, {
        headers: { 'User-Agent': 'yanqi-blog-server' },
        signal: AbortSignal.timeout(15_000),
      })
      const type = imgRes.headers.get('content-type') || ''
      const size = Number(imgRes.headers.get('content-length') || 0)
      if (!imgRes.ok) throw new Error(`图片源返回 ${imgRes.status}`)
      if (!type.startsWith('image/')) throw new Error(`目标不是图片（${type || '未知类型'}）`)
      if (size > 10 * 1024 * 1024) throw new Error('图片超过 10MB')
      if (!imgRes.body) throw new Error('图片源返回空内容')
      // 从 URL 推断扩展名，失败用 png
      let ext = (target.split('?')[0].match(/\.(png|jpe?g|gif|webp|svg|bmp|avif)$/i) || [])[1] || 'png'
      const name = 'img-' + Date.now().toString(36) + '.' + ext.toLowerCase()
      const up = await fetch(`${RES_ORIGIN}/upload?name=${encodeURIComponent(name)}&category=article-image&hidden=1`, {
        method: 'POST',
        headers: {
          Authorization: req.headers.authorization || '',
          'Content-Type': 'application/octet-stream',
        },
        body: imgRes.body,
        duplex: 'half',
      })
      const data = await up.json()
      if (!up.ok) throw new Error(data.error || `转存失败（${up.status}）`)
      return sendJson(res, 200, { ok: true, id: data.file.id, url: '/api/res/download/' + data.file.id })
    } catch (err) {
      return sendJson(res, 502, { error: '本地化失败：' + err.message })
    }
  }

  // ---- 分片上传中转 ----
  if (pathname === '/api/res/chunk' && req.method === 'POST') {
    try {
      const { Readable } = await import('node:stream')
      const relayUrl = new URL(req.url || '/', 'http://localhost')
      const r = await fetch(`${RES_ORIGIN}/chunk${relayUrl.search}`, {
        method: 'POST',
        headers: {
          Authorization: req.headers.authorization || '',
          'Content-Type': 'application/octet-stream',
        },
        body: Readable.toWeb(req),
        duplex: 'half',
      })
      return sendJson(res, r.status, await r.json())
    } catch (err) {
      console.error('res chunk relay failed:', err.message)
      return sendJson(res, 502, { error: '分片传输失败：资料服务不可达' })
    }
  }

  if (pathname === '/api/res/chunk-finish' && req.method === 'POST') {
    try {
      const relayUrl = new URL(req.url || '/', 'http://localhost')
      const r = await fetch(`${RES_ORIGIN}/chunk-finish${relayUrl.search}`, {
        method: 'POST',
        headers: { Authorization: req.headers.authorization || '' },
      })
      resListCache = null
      return sendJson(res, r.status, await r.json())
    } catch (err) {
      console.error('res chunk-finish relay failed:', err.message)
      return sendJson(res, 502, { error: '合并失败：资料服务不可达' })
    }
  }

  // ---- 资料管理中转（HTTPS 页面不能直连 http 源站，统一走同源代理） ----
  if (pathname === '/api/res/upload' && req.method === 'POST') {
    try {
      const { Readable } = await import('node:stream')
      const relayUrl = new URL(req.url || '/', 'http://localhost')
      const r = await fetch(`${RES_ORIGIN}/upload${relayUrl.search}`, {
        method: 'POST',
        headers: {
          Authorization: req.headers.authorization || '',
          'Content-Type': 'application/octet-stream',
        },
        body: Readable.toWeb(req),
        duplex: 'half',
      })
      resListCache = null
      return sendJson(res, r.status, await r.json())
    } catch (err) {
      console.error('res upload relay failed:', err.message)
      return sendJson(res, 502, { error: '上传失败：资料服务不可达' })
    }
  }

  if (pathname.startsWith('/api/res/meta/') && req.method === 'PUT') {
    let body = ''
    for await (const c of req) body += c
    try {
      const r = await fetch(`${RES_ORIGIN}${pathname.replace('/api/res', '')}`, {
        method: 'PUT',
        headers: { Authorization: req.headers.authorization || '', 'Content-Type': 'application/json' },
        body,
      })
      resListCache = null
      return sendJson(res, r.status, await r.json())
    } catch (err) {
      console.error('res meta relay failed:', err.message)
      return sendJson(res, 502, { error: '操作失败：资料服务不可达' })
    }
  }

  if (pathname.startsWith('/api/res/del/') && req.method === 'DELETE') {
    try {
      const r = await fetch(`${RES_ORIGIN}${pathname.replace('/api/res', '')}`, {
        method: 'DELETE',
        headers: { Authorization: req.headers.authorization || '' },
      })
      resListCache = null
      return sendJson(res, r.status, await r.json())
    } catch {
      return sendJson(res, 502, { error: '删除失败：资料服务不可达' })
    }
  }

  if (pathname === '/api/purge' && req.method === 'POST') {
    const now = Date.now()
    if (now - lastPurge < 30_000) return sendJson(res, 200, { ok: true, throttled: true })
    lastPurge = now
    cacheDirty = true // 只标记失效，last-good 数据保留用于容错
    return sendJson(res, 200, { ok: true })
  }

  // ---- 静态文件 ----
  if (req.method === 'GET' || req.method === 'HEAD') {
    const file = await resolveFile(pathname)
    if (file) return sendFile(req, res, 200, file)
    if (!extname(pathname)) {
      const index = await fileAt(join(SITE_DIR, 'index.html'))
      if (index) return sendFile(req, res, 200, index)
    }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not Found')
    return
  }

  res.writeHead(405, { Allow: 'GET, HEAD' }).end()
}).listen(PORT, '0.0.0.0', () => {
  console.log(`blog-server: static ${SITE_DIR} + GitHub(${GH.owner}/${GH.repo}@${GH.branch}) on 0.0.0.0:${PORT}`)
  // 启动即预热文章缓存：实例冷启动的第一次访问不再承担 5 秒回源
  refreshPosts().catch(() => {})
})
