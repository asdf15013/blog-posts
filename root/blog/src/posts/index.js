import { reactive } from 'vue'

// 文章数据层：列表只带元数据（体积优化），正文按文章页按需拉取并缓存。
export const store = reactive({
  posts: [], // 元数据：slug/title/date/category/tags/summary/pinned/series
  loading: true,
  error: null,
  stale: false,
})

const bodyCache = new Map() // slug → body（会话级缓存）
const bodyPending = new Map() // slug → Promise（去重并发）

let inflight = null

export async function loadPosts(force = false) {
  if (inflight && !force) return inflight
  inflight = (async () => {
    if (force) {
      try {
        await fetch('/api/purge', { method: 'POST' })
      } catch {
        /* 缓存清不掉也无妨，60s TTL 兜底 */
      }
    }
    store.loading = true
    store.error = null
    try {
      const res = await fetch('/api/posts')
      if (!res.ok) throw new Error((await res.json()).error || `HTTP ${res.status}`)
      const data = await res.json()
      // 形状防御：列表必须含 posts 数组（防缓存污染/网关异常返回别的资源）
      if (!Array.isArray(data.posts)) throw new Error('文章数据异常，请刷新重试')
      store.posts = data.posts
      store.stale = !!data.stale
    } catch (e) {
      store.error = e.message || '加载失败'
      // 网络抖动自动重试一次（绕过一切缓存）
      if (!store.posts.length) {
        setTimeout(() => {
          if (!store.posts.length && store.error) inflight = null, loadPosts(true)
        }, 1200)
      }
    } finally {
      store.loading = false
      inflight = null
    }
  })()
  return inflight
}

// 按需拉取正文（带会话缓存与并发去重）
export async function loadPostBody(slug) {
  if (bodyCache.has(slug)) return bodyCache.get(slug)
  if (bodyPending.has(slug)) return bodyPending.get(slug)
  const p = (async () => {
    try {
      const res = await fetch(`/api/posts?slug=${encodeURIComponent(slug)}`)
      const data = await res.json()
      const body = data.post?.body || ''
      bodyCache.set(slug, body)
      return body
    } finally {
      bodyPending.delete(slug)
    }
  })()
  bodyPending.set(slug, p)
  return p
}

export function hasBody(slug) {
  return bodyCache.has(slug)
}

export function getPostBySlug(slug) {
  return store.posts.find((p) => p.slug === slug)
}

export function getAllTags() {
  const count = new Map()
  for (const p of store.posts) for (const t of p.tags) count.set(t, (count.get(t) || 0) + 1)
  return [...count.entries()].map(([name, n]) => ({ name, count: n })).sort((a, b) => b.count - a.count)
}

export function getAllCategories() {
  const count = new Map()
  for (const p of store.posts) count.set(p.category, (count.get(p.category) || 0) + 1)
  return [...count.entries()].map(([name, n]) => ({ name, count: n })).sort((a, b) => b.count - a.count)
}

// 站内搜索：改走服务端（客户端不再持有全部正文）
export async function searchPosts(keyword) {
  const kw = keyword.trim()
  if (!kw) return []
  try {
    const res = await fetch('/api/search?q=' + encodeURIComponent(kw))
    if (!res.ok) return []
    const data = await res.json()
    return data.results || []
  } catch {
    return []
  }
}

// 悬停/触摸预取：鼠标掠过文章链接即拉正文，点击时秒开
export function installHoverPrefetch() {
  const prefetch = (e) => {
    const a = e.target instanceof Element ? e.target.closest('a') : null
    if (!a) return
    const m = (a.getAttribute('href') || '').match(/#\/post\/([a-zA-Z0-9_-]+)/)
    if (m) loadPostBody(m[1]) // 内置去重，重复调用零成本
  }
  document.addEventListener('mouseover', prefetch, { passive: true })
  document.addEventListener('touchstart', prefetch, { passive: true })
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`
}
