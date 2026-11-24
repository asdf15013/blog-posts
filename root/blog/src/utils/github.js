// 浏览器直连 GitHub API 的封装：Token 只存在浏览器 localStorage，不经我们的服务器。
// 读写均针对 /repos/{owner}/{repo}/contents 下的 posts/ 与 images/。

const ADMIN_KEY = 'yanqi-admin'

export function getAdmin() {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_KEY)) || null
  } catch {
    return null
  }
}

export function setAdmin(admin) {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin))
}

export function clearAdmin() {
  localStorage.removeItem(ADMIN_KEY)
}

function api(owner, repo, path = '') {
  return `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
}

function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

function toBase64(str) {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}

function fromBase64(b64) {
  const binary = atob(b64.replace(/\n/g, ''))
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

// 验证 Token 是否对目标仓库有权限
export async function validateToken(owner, repo, token) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: headers(token),
  })
  if (res.status === 401 || res.status === 403) throw new Error('Token 无效或没有该仓库权限')
  if (res.status === 404) throw new Error('仓库不存在（确认用户名/仓库名拼写）')
  if (!res.ok) throw new Error(`GitHub 返回 ${res.status}`)
  return true
}

// 读取单篇文章（返回 {content, sha}），文件不存在返回 null
export async function readPost(owner, repo, token, slug) {
  const res = await fetch(api(owner, repo, `posts/${slug}.md`), {
    headers: headers(token),
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`读取失败（${res.status}）`)
  const data = await res.json()
  return { content: fromBase64(data.content), sha: data.sha }
}

// 新建或更新文章（保存即发布）
export async function writePost(owner, repo, token, slug, markdown, sha) {
  const body = { message: `发文：${slug}`, content: toBase64(markdown) }
  if (sha) body.sha = sha
  const res = await fetch(api(owner, repo, `posts/${slug}.md`), {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify(body),
  })
  if (res.status === 401 || res.status === 403) throw new Error('Token 无效或权限不足')
  if (res.status === 409) throw new Error('文件已变更，请刷新后重试')
  if (!res.ok) throw new Error(`保存失败（${res.status}）`)
  return true
}

export async function deletePost(owner, repo, token, slug, sha) {
  const res = await fetch(api(owner, repo, `posts/${slug}.md`), {
    method: 'DELETE',
    headers: headers(token),
    body: JSON.stringify({ message: `删除：${slug}`, sha }),
  })
  if (!res.ok) throw new Error(`删除失败（${res.status}）`)
  return true
}

// 图片上传到 images/ 目录，返回可外链的 raw 地址
export async function uploadImage(owner, repo, branch, token, file) {
  const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png'
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).slice(2, 8)
  const path = `images/${date}-${rand}.${ext}`

  const buf = await file.arrayBuffer()
  const bytes = new Uint8Array(buf)
  let binary = ''
  const CHUNK = 0x8000
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  }
  const b64 = btoa(binary)

  const res = await fetch(api(owner, repo, path), {
    method: 'PUT',
    headers: headers(token),
    body: JSON.stringify({ message: `上传图片：${path}`, content: b64 }),
  })
  if (res.status === 401 || res.status === 403) throw new Error('Token 无效或权限不足')
  if (!res.ok) throw new Error(`图片上传失败（${res.status}）`)
  return {
    path,
    url: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`,
  }
}

// 由标题生成 URL 友好的 slug；中文标题回退为日期编号
export function slugify(title) {
  const latin = title
    .toLowerCase()
    .match(/[a-z0-9]+/g)
    ?.join('-')
  if (latin && latin.length >= 3) return latin
  return 'post-' + Date.now().toString(36)
}
