// 轻量 Service Worker：静态资源缓存优先，API 网络优先+离线兜底，文章数据 stale-while-revalidate
const CACHE = 'yanqi-blog-v5' // v5：清掉错误 content-type 的图片缓存
const SHELL = ['/', '/og-default.png', '/icon-192.png', '/icon-512.png']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)
  if (url.origin !== location.origin || e.request.method !== 'GET') return

  // 核心 GET API：stale-while-revalidate（秒开缓存 + 后台更新，弱网/离线可读）
  // 文件下载（图片/资料）：id 永不变更，缓存优先且命中后不再回源
  if (url.pathname.startsWith('/api/res/download/') && e.request.method === 'GET') {
    e.respondWith(
      caches.open(CACHE).then(async (c) => {
        const key = url.pathname + url.search
        const cached = await c.match(key)
        if (cached) return cached
        const r = await fetch(e.request)
        if (r.ok) c.put(key, r.clone())
        return r
      }).catch(() => fetch(e.request)),
    )
    return
  }

  const SWR_LIST = ['/api/posts', '/api/music/playlist', '/api/likes', '/api/links', '/api/announce', '/api/logs/stats']
  if (url.pathname.startsWith('/api/') && e.request.method === 'GET' && SWR_LIST.includes(url.pathname)) {
    e.respondWith(
      caches.open(CACHE).then(async (c) => {
        // 键 = 路径+查询串：列表 /api/posts 与正文 /api/posts?slug=x 是不同资源，严禁共键
        const key = url.pathname + url.search
        const cached = await c.match(key)
        const refresh = fetch(e.request)
          .then((r) => {
            if (r.ok) c.put(key, r.clone())
            return r
          })
          .catch(() => null)
        return cached || (await refresh) || new Response('{}', { headers: { 'Content-Type': 'application/json' } })
      }),
    )
    return
  }

  // 其余 API：网络优先不缓存（含带鉴权的管理接口）
  if (url.pathname.startsWith('/api/')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)))
    return
  }

  // 带哈希的静态资源：缓存优先（永不重复下载）
  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(
      caches.match(e.request).then((hit) => hit || fetch(e.request).then((r) => {
        const copy = r.clone()
        caches.open(CACHE).then((c) => c.put(e.request, copy))
        return r
      })),
    )
    return
  }

  // 页面与其余资源：网络优先，离线回缓存
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        const copy = r.clone()
        caches.open(CACHE).then((c) => c.put(e.request, copy))
        return r
      })
      .catch(() => caches.match(e.request).then((hit) => hit || caches.match('/'))),
  )
})
