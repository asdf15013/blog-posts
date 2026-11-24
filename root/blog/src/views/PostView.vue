<template>
  <!-- 单一根节点：App.vue 的 <transition mode="out-in"> 不支持多根片段组件 -->
  <div class="post-view-root">
    <!-- 顶部阅读进度条 -->
    <div class="reading-progress" :style="{ width: progress + '%' }" aria-hidden="true"></div>

    <div v-if="post" class="post-layout" :class="{ 'has-toc': toc.length }">
      <div class="post-main-col">
      <article class="post-page glass">
      <!-- 断点续读 -->
      <transition name="fade-slide">
        <div v-if="resumePct" class="resume-bar">
          📖 上次读到 {{ resumePct }}%
          <button class="resume-go" @click="goResume">继续阅读 ↓</button>
          <button class="resume-x" @click="resumePct = 0">✕</button>
        </div>
      </transition>

      <header class="post-header">
        <h1 class="post-title">{{ post.title }}</h1>
        <div class="post-meta">
          <span>📅 {{ formatDate(post.date) }}</span>
          <span>📂 {{ post.category }}</span>
          <span v-if="readingInfo">📝 {{ readingInfo.text }} · 约 {{ readingInfo.minutes }} 分钟</span>
          <span v-for="t in post.tags" :key="t" class="meta-tag" @click="goTag(t)"># {{ t }}</span>
          <span class="reader-prefs">
            <button class="pref-btn" title="减小字号" @click="setFont(fontSize - 1)">A⁻</button>
            <button class="pref-btn" :class="{ on: fontSize === 2 }" title="标准字号" @click="setFont(2)">A</button>
            <button class="pref-btn" title="增大字号" @click="setFont(fontSize + 1)">A⁺</button>
            <button class="pref-btn" :title="codeLight ? '代码块：浅色' : '代码块：深色'" @click="toggleCodeTheme">
              {{ codeLight ? '☀' : '🌙' }}
            </button>
          </span>
          <button class="share-btn" title="复制文章链接" @click="share">
            {{ shareTip ? '✓ 已复制' : '🔗 分享' }}
          </button>
          <button class="share-btn like-btn" :class="{ liked: isLiked }" title="点赞" @click="like">
            {{ isLiked ? '❤' : '🤍' }} {{ likeCount || '' }}
          </button>
        </div>
      </header>

      <div v-if="bodyLoading" class="body-skeleton">
        <div class="brand-wait">
          <span class="bw-mark">岩栖散记</span>
          <span class="bw-dots"><i></i><i></i><i></i></span>
        </div>
        <div class="sk-line w90"></div><div class="sk-line w60"></div><div class="sk-line w75"></div>
        <div class="sk-line w40"></div><div class="sk-line w85"></div><div class="sk-line w70"></div>
        <p class="sk-tip">正文加载中…</p>
      </div>
      <div v-else v-code-copy v-lightbox class="markdown-body" v-html="html" @click="onAnchorClick"></div>

      <footer class="post-footer">
        <router-link v-if="prev" :to="`/post/${prev.slug}`" class="page-nav">
          <span class="page-nav-label">← 上一篇</span>
          <span class="page-nav-title">{{ prev.title }}</span>
        </router-link>
        <span v-else class="page-nav disabled">
          <span class="page-nav-label">← 上一篇</span>
          <span class="page-nav-title">没有了</span>
        </span>
        <router-link v-if="next" :to="`/post/${next.slug}`" class="page-nav right">
          <span class="page-nav-label">下一篇 →</span>
          <span class="page-nav-title">{{ next.title }}</span>
        </router-link>
        <span v-else class="page-nav disabled right">
          <span class="page-nav-label">下一篇 →</span>
          <span class="page-nav-title">没有了</span>
        </span>
      </footer>
    </article>

    <!-- 本系列 -->
    <section v-if="seriesPosts.length" class="series-box glass">
      <div class="series-head">
        📚 系列：{{ post.series }}（{{ seriesPosts.length }} 篇）
        <button class="book-btn" title="打包本系列为独立 HTML 电子书" @click="exportBook">{{ bookTip || '📖 导出电子书' }}</button>
      </div>
      <router-link
        v-for="(sp, i) in seriesPosts"
        :key="sp.slug"
        :to="`/post/${sp.slug}`"
        class="series-item"
        :class="{ cur: sp.slug === post.slug }"
      >
        <span class="series-idx">{{ i + 1 }}</span>
        <span class="series-name">{{ sp.title }}</span>
        <span v-if="sp.slug === post.slug" class="series-cur">本文</span>
      </router-link>
    </section>

    <!-- 相关文章 -->
    <section v-if="related.length" class="related glass">
      <h2 class="related-title">🔗 相关文章</h2>
      <router-link v-for="r in related" :key="r.slug" :to="`/post/${r.slug}`" class="related-item">
        <span class="related-name">{{ r.title }}</span>
        <span class="related-meta">{{ r.date }} · {{ r.category }}</span>
      </router-link>
    </section>

    <!-- 订阅引导 -->
    <div class="subscribe-cta glass">
      <div class="sub-text">
        <strong>持续更新，订阅不走丢</strong>
        <span>新教程、新资料第一时间送达 · RSS 阅读器订阅</span>
      </div>
      <div class="sub-actions">
        <a class="sub-btn" href="/rss.xml" target="_blank" rel="noopener">📡 打开 RSS</a>
        <button class="sub-btn ghost" @click="copyRss">{{ rssTip ? '✓ 已复制' : '复制链接' }}</button>
      </div>
    </div>

    <!-- 评论 -->
    <GiscusComments :key="post.slug" :slug="post.slug" />
      </div>

    <!-- 宽屏：文章右侧常驻目录 -->
    <aside v-if="toc.length" class="toc-col glass">
      <ArticleToc :toc="toc" :active-id="activeId" :progress="progress" />
    </aside>

    <SiteSidebar class="side-col" />

    <!-- 窄屏：悬浮目录按钮 + 弹出层 -->
    <template v-if="toc.length">
      <button class="toc-fab glass" :class="{ open: sheetOpen }" title="文章目录" @click="sheetOpen = !sheetOpen">
        <svg viewBox="0 0 24 24" width="19" height="19">
          <path
            fill="currentColor"
            d="M3 5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Zm13 0a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V5Zm0 6a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-2Zm0 6a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-2ZM5.5 7.5h6v1.6h-6V7.5Zm0 4h6v1.6h-6v-1.6Zm0 4h4v1.6h-4v-1.6Z"
          />
        </svg>
      </button>

      <transition name="fade-slide">
        <div v-if="sheetOpen" class="toc-sheet glass">
          <ArticleToc :toc="toc" :active-id="activeId" :progress="progress" @navigate="sheetOpen = false" />
        </div>
      </transition>
    </template>
  </div>

  <div v-else-if="store.loading" class="not-found glass">文章加载中…</div>

    <div v-else class="not-found glass">
      <p>文章不存在或已被删除 🍃</p>
      <router-link to="/" class="btn-glass">返回首页</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SiteSidebar from '../components/SiteSidebar.vue'
import ArticleToc from '../components/ArticleToc.vue'
import GiscusComments from '../components/GiscusComments.vue'
import { store, getPostBySlug, formatDate, loadPostBody } from '../posts'
import { renderMarkdown } from '../utils/markdown'
import { site } from '../config'
import { logRead } from '../utils/logger'

const route = useRoute()
const router = useRouter()

const post = computed(() => getPostBySlug(route.params.slug))

// 正文按需加载（列表只带元数据）
const body = ref('')
const bodyLoading = ref(true)

watch(
  () => route.params.slug,
  async (slug) => {
    if (!slug) return
    bodyLoading.value = true
    body.value = await loadPostBody(slug)
    bodyLoading.value = false
  },
  { immediate: true },
)

const rendered = computed(() =>
  post.value && body.value ? renderMarkdown(body.value, true) : { html: '', toc: [] },
)
const html = computed(() => rendered.value.html)
const toc = computed(() => rendered.value.toc)

// 字数与预计阅读时长：中文按字、英文按词，约 400 字/分钟
const readingInfo = computed(() => {
  if (!post.value || !body.value) return null
  const plain = body.value.replace(/[#>*`~!\[\]()|-]/g, '')
  const cjk = (plain.match(/[\u4e00-\u9fff]/g) || []).length
  const words = (plain.replace(/[\u4e00-\u9fff]/g, ' ').match(/[a-zA-Z0-9]+/g) || []).length
  const total = cjk + words
  if (!total) return null
  return {
    text: total >= 10000 ? (total / 10000).toFixed(1) + ' 万字' : total + ' 字',
    minutes: Math.max(1, Math.round(total / 400)),
  }
})

// 相关文章：同分类 +2 分，每个共同标签 +1 分，取前三
const related = computed(() => {
  if (!post.value) return []
  return store.posts
    .filter((p) => p.slug !== post.value.slug)
    .map((p) => ({
      p,
      score:
        (p.category === post.value.category ? 2 : 0) +
        p.tags.filter((t) => post.value.tags.includes(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.p)
})

// 分享：复制「标题 — 链接」
const shareTip = ref(false)

/* ---- 点赞 ---- */
const likeCount = ref(0)
const isLiked = ref(localStorage.getItem('yanqi-liked:' + route.params.slug) === '1')

function anonId() {
  let id = localStorage.getItem('yanqi-uid')
  if (!id) {
    id = 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
    localStorage.setItem('yanqi-uid', id)
  }
  return id
}

async function like() {
  if (isLiked.value) return
  try {
    const res = await fetch(`/api/like/${route.params.slug}?u=${anonId()}`, { method: 'POST' })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    likeCount.value = data.count
    isLiked.value = true
    localStorage.setItem('yanqi-liked:' + route.params.slug, '1')
  } catch (e) {
    alert(e.message)
  }
}

/* ---- 系列 ---- */
const seriesPosts = computed(() => {
  if (!post.value?.series) return []
  return store.posts
    .filter((x) => x.series === post.value.series)
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
})

/* ---- 断点续读 ---- */
const RESUME_KEY = 'yanqi-readpos:' + route.params.slug
const savedPct = Number(localStorage.getItem(RESUME_KEY) || 0)
const resumePct = ref(savedPct >= 5 && savedPct <= 95 ? savedPct : 0)
let lastSaveAt = 0

function saveReadPos() {
  const total = document.documentElement.scrollHeight - window.innerHeight
  if (total <= 0) return
  const pct = Math.round((window.scrollY / total) * 100)
  if (pct >= 5 && pct <= 95) {
    localStorage.setItem(RESUME_KEY, String(pct))
  } else if (pct > 95) {
    localStorage.removeItem(RESUME_KEY) // 读完清除
  }
}

function goResume() {
  const total = document.documentElement.scrollHeight - window.innerHeight
  window.scrollTo({ top: (total * resumePct.value) / 100, behavior: 'smooth' })
  resumePct.value = 0
}

/* ---- 阅读偏好：字号三档 + 代码块深浅 ---- */
const fontSize = ref(Number(localStorage.getItem('yanqi-fs') || 2))
const codeLight = ref(localStorage.getItem('yanqi-code-light') === '1')

function applyPrefs() {
  document.documentElement.style.setProperty('--article-fs', ['15px', '16px', '18px'][fontSize.value - 1] || '16px')
  // 兼容旧值（v3.1 初版的 1=15px 语义）
  document.documentElement.dataset.codeTheme = codeLight.value ? 'light' : 'dark'
}
applyPrefs()

function setFont(n) {
  // n: 1 小 / 2 标准 / 3 大；A⁻ A⁺ 传增量偏移由按钮处理
  fontSize.value = Math.min(3, Math.max(1, n))
  localStorage.setItem('yanqi-fs', String(fontSize.value))
  applyPrefs()
}

function toggleCodeTheme() {
  codeLight.value = !codeLight.value
  localStorage.setItem('yanqi-code-light', codeLight.value ? '1' : '0')
  applyPrefs()
}

/* ---- 最近浏览足迹 ---- */
function recordHistory(t) {
  try {
    const list = JSON.parse(localStorage.getItem('yanqi-history') || '[]')
    const filtered = list.filter((x) => x.slug !== t.slug)
    filtered.unshift({ slug: t.slug, title: t.title, at: Date.now() })
    localStorage.setItem('yanqi-history', JSON.stringify(filtered.slice(0, 10)))
    window.dispatchEvent(new CustomEvent('history-updated'))
  } catch {}
}
watch(post, (t) => t && recordHistory(t), { immediate: true })

/* ---- 系列电子书导出（客户端拼装独立 HTML） ---- */
async function exportBook() {
  const name = post.value.series
  const posts = seriesPosts.value
  toastBook('正在组装电子书…')
  const parts = []
  for (let i = 0; i < posts.length; i++) {
    const x = posts[i]
    const b = await loadPostBody(x.slug) // 列表已无正文，逐篇按需取
    const html = renderMarkdown(b, false)
    parts.push(`<section class="chapter"><h1>${i + 1}. ${escapeHtml(x.title)}</h1>${html}</section>`)
  }
  const doc = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(name)} · 系列合集</title>
<style>
body{font-family:'PingFang SC','Microsoft YaHei',sans-serif;max-width:860px;margin:0 auto;padding:40px 24px;line-height:1.85;color:#2b2d42}
.cover{text-align:center;padding:70px 0;border-bottom:3px solid #6d5ef2;margin-bottom:40px}
.cover h1{font-size:34px;background:linear-gradient(135deg,#6d5ef2,#3d8bfd);-webkit-background-clip:text;background-clip:text;color:transparent}
.cover p{color:#8b8ea8;font-size:14px;margin-top:14px}
.chapter{margin-bottom:56px}
.chapter h1{font-size:24px;border-left:5px solid #6d5ef2;padding-left:14px;margin-bottom:20px}
pre{background:#1e2038;color:#e6e8ff;padding:16px 18px;border-radius:12px;overflow-x:auto;font-size:13.5px;line-height:1.7}
code{font-family:Consolas,monospace}
img{max-width:100%;border-radius:10px}
blockquote{border-left:4px solid #6d5ef2;margin:1.2em 0;padding:10px 18px;background:rgba(109,94,242,.07);border-radius:0 10px 10px 0}
table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px 12px}
@media print{.cover{page-break-after:always}}
</style>
</head>
<body>
<div class="cover"><h1>${escapeHtml(name)}</h1><p>共 ${posts.length} 篇 · 岩栖_shard 的博客 · ${new Date().toLocaleDateString('zh-CN')}</p></div>
${parts.join('\n')}
</body></html>`
  const blob = new Blob([doc], { type: 'text/html;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = (name || 'series').replace(/[\\/:*?"<>|]/g, '_') + '.html'
  document.body.appendChild(a)
  a.click()
  a.remove()
  // 延迟回收：立即回收会截断浏览器的下载读取
  setTimeout(() => URL.revokeObjectURL(a.href), 60_000)
}

const bookTip = ref('')
function toastBook(t) {
  bookTip.value = t
  setTimeout(() => (bookTip.value = ''), 2500)
}

function escapeHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/* ---- 订阅 ---- */
const rssTip = ref(false)

async function copyRss() {
  try {
    await navigator.clipboard.writeText(location.origin + '/rss.xml')
    rssTip.value = true
    setTimeout(() => (rssTip.value = false), 1600)
  } catch {}
}

async function share() {
  if (!post.value) return
  // 用路径 URL 分享：社交平台爬虫才能读到文章级 OG 卡片
  const text = `${post.value.title} — ${location.origin}/post/${post.value.slug}`
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    /* 剪贴板不可用则退回弹窗展示 */
    alert(text)
    return
  }
  shareTip.value = true
  setTimeout(() => (shareTip.value = false), 1600)
}

// 点赞数
fetch('/api/likes')
  .then((r) => r.json())
  .then((d) => (likeCount.value = d[route.params.slug] || 0))
  .catch(() => {})

// 动态标题与描述（SEO）
watch(
  post,
  (p) => {
    if (!p) return
    document.title = `${p.title} · ${site.name}`
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', p.summary.slice(0, 100))
  },
  { immediate: true },
)

// 上一篇/下一篇：按列表顺序（新→旧）
const siblings = computed(() => {
  const idx = store.posts.findIndex((p) => p.slug === route.params.slug)
  return { prev: store.posts[idx + 1], next: store.posts[idx - 1] }
})
const prev = computed(() => siblings.value.prev)
const next = computed(() => siblings.value.next)

function retry() {
  import('../posts').then((m) => m.loadPosts(true))
}

function goTag(tag) {
  router.push({ path: '/', query: { tag } })
}

// 正文内锚点链接（#xxx）：改为页内平滑滚动。
// 不能让默认行为修改 location.hash——本站路由基于 hash，会被当成未知路径重定向回首页。
function onAnchorClick(e) {
  const a = e.target.closest('a')
  if (!a) return
  const href = a.getAttribute('href') || ''
  if (!href.startsWith('#')) return
  e.preventDefault()
  const id = decodeURIComponent(href.slice(1))
  const target = document.getElementById(id)
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* ---- 阅读进度 + 章节滚动侦测（scroll-spy） ---- */
const progress = ref(0)
const readReported = new Set()
const activeId = ref('')
const sheetOpen = ref(false)
let rafId = null

function onScroll() {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = null
    const doc = document.documentElement
    const total = doc.scrollHeight - window.innerHeight
    progress.value = total > 0 ? Math.min(100, Math.round((window.scrollY / total) * 100)) : 0

    // 完读率埋点：25/50/75/100 四档，每档只报一次
    for (const m of [25, 50, 75, 100]) {
      if (progress.value >= m && !readReported.has(m)) {
        readReported.add(m)
        logRead(m, '/post/' + route.params.slug, post.value?.title)
      }
    }

    // 断点续读：位置保存（2 秒节流）
    if (Date.now() - lastSaveAt > 2000) {
      lastSaveAt = Date.now()
      saveReadPos()
    }

    // 当前章节 = 视口内最后一个越过头部基准线的标题
    let current = ''
    for (const t of toc.value) {
      const el = document.getElementById(t.id)
      if (!el) continue
      if (el.getBoundingClientRect().top <= 110) current = t.id
      else break
    }
    activeId.value = current
  })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (rafId) cancelAnimationFrame(rafId)
})

// 切换文章后重置状态并立即计算一次
watch(
  () => route.params.slug,
  () => {
    progress.value = 0
    activeId.value = ''
    sheetOpen.value = false
    readReported.clear()
    requestAnimationFrame(onScroll)
  },
)
</script>

<style scoped>
/* ===== 阅读进度条 ===== */
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  z-index: 300;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  border-radius: 0 3px 3px 0;
  box-shadow: 0 0 10px rgba(109, 94, 242, 0.5);
  transition: width 0.1s linear;
  pointer-events: none;
}

/* ===== 布局：默认单栏；≥960 正文+侧边栏；≥1280 且有目录时「侧边栏 | 正文 | 目录」 ===== */
.post-layout {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: 'main';
  gap: 24px;
  align-items: start;
}

@media (min-width: 960px) {
  .post-layout {
    grid-template-columns: minmax(0, 1fr) 300px;
    grid-template-areas: 'main side';
  }
}

@media (min-width: 1280px) {
  .post-layout.has-toc {
    grid-template-columns: 300px minmax(0, 1fr) 240px;
    grid-template-areas: 'side main toc';
  }
}

.post-page {
  grid-area: main;
}

.side-col {
  grid-area: side;
  position: sticky;
  top: 88px;
}

.toc-col {
  grid-area: toc;
  position: sticky;
  top: 88px;
  padding: 18px;
  display: none;
}

@media (min-width: 1280px) {
  .post-layout.has-toc .toc-col {
    display: block;
  }
}

/* ===== 文章卡片 ===== */
.post-main-col {
  grid-area: main;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.post-page {
  padding: 36px 40px;
}

.post-header {
  padding-bottom: 22px;
  margin-bottom: 26px;
  border-bottom: 1px solid var(--glass-border);
}

.post-title {
  font-size: 28px;
  line-height: 1.45;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 14px;
  font-size: 13px;
  color: var(--text-3);
}

.meta-tag {
  cursor: pointer;
  transition: color 0.2s;
}

.meta-tag:hover {
  color: var(--accent-deep);
}

.share-btn {
  margin-left: auto;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text-2);
  border-radius: 999px;
  font-size: 12.5px;
  padding: 3px 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.share-btn:hover {
  color: #fff;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  border-color: transparent;
}

.reader-prefs {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}

.pref-btn {
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text-2);
  border-radius: 7px;
  font-size: 11.5px;
  padding: 3px 8px;
  cursor: pointer;
  font-family: var(--font-mono);
}

.pref-btn:hover {
  color: var(--accent-deep);
  border-color: var(--accent);
}

.pref-btn.on {
  background: var(--hover-bg);
  color: var(--accent-deep);
  font-weight: 700;
}

.book-btn {
  float: right;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--accent-deep);
  border-radius: 8px;
  font-size: 12.5px;
  padding: 4px 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.book-btn:hover {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  border-color: transparent;
}

.like-btn.liked {
  color: #e5484d;
  border-color: rgba(229, 72, 77, 0.5);
}

.like-btn.liked:hover {
  background: rgba(229, 72, 77, 0.08);
}

/* ===== 系列导航 ===== */
.series-box {
  grid-area: main;
  margin-top: 24px;
  padding: 20px 26px;
}

.series-head {
  font-size: 14.5px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--accent-deep);
}

.series-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  color: var(--text-1);
  font-size: 14px;
}

.series-item:hover {
  background: var(--hover-bg);
}

.series-item.cur {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
}

.series-idx {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border-radius: 7px;
  background: var(--code-bg);
  color: var(--accent-deep);
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.series-item.cur .series-idx {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}

.series-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.series-cur {
  font-size: 11.5px;
  opacity: 0.85;
}

/* ===== 订阅引导 ===== */
.subscribe-cta {
  grid-area: main;
  margin-top: 24px;
  padding: 20px 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  background: linear-gradient(135deg, rgba(109, 94, 242, 0.12), rgba(61, 139, 253, 0.12));
}

.sub-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sub-text strong {
  font-size: 15.5px;
}

.sub-text span {
  font-size: 12.5px;
  color: var(--text-3);
}

.sub-actions {
  display: flex;
  gap: 10px;
}

.sub-btn {
  padding: 8px 18px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
}

.sub-btn.ghost {
  background: transparent;
  border: 1px solid var(--glass-border);
  color: var(--text-2);
}

.sub-btn.ghost:hover {
  color: var(--accent-deep);
  border-color: var(--accent);
}

/* ===== 断点续读 ===== */
.resume-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 9px 16px;
  border-radius: var(--radius-sm);
  background: rgba(230, 162, 60, 0.12);
  border: 1px solid rgba(230, 162, 60, 0.35);
  font-size: 13px;
  color: var(--text-1);
}

.resume-go {
  border: none;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  border-radius: 8px;
  padding: 4px 14px;
  font-size: 12.5px;
  cursor: pointer;
}

.resume-x {
  margin-left: auto;
  border: none;
  background: transparent;
  color: var(--text-3);
  cursor: pointer;
}

.body-skeleton {
  padding: 10px 0 30px;
}

.sk-line {
  height: 16px;
  border-radius: 8px;
  margin-bottom: 14px;
  background: linear-gradient(90deg, var(--glass-border) 25%, var(--hover-bg) 50%, var(--glass-border) 75%);
  background-size: 200% 100%;
  animation: skShimmer 1.4s linear infinite;
}

.w90 { width: 90%; }
.w85 { width: 85%; }
.w75 { width: 75%; }
.w70 { width: 70%; }
.w60 { width: 60%; }
.w40 { width: 40%; }

@keyframes skShimmer {
  to {
    background-position: -200% 0;
  }
}

.sk-tip {
  text-align: center;
  color: var(--text-3);
  font-size: 13px;
  margin-top: 20px;
}

/* ===== 相关文章 ===== */
.related {
  margin-top: 24px;
  padding: 24px 30px;
}

.related-title {
  font-size: 17px;
  margin-bottom: 14px;
}

.related-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 14px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  color: var(--text-1);
  transition: background 0.2s;
}

.related-item:hover {
  background: var(--hover-bg);
}

.related-item + .related-item {
  margin-top: 4px;
}

.related-name {
  font-size: 14.5px;
  font-weight: 600;
}

.related-name:hover {
  color: var(--accent-deep);
}

.related-meta {
  font-size: 12px;
  color: var(--text-3);
  white-space: nowrap;
}

@media (max-width: 720px) {
  .related-meta {
    display: none;
  }
  .related,
  .post-page {
    padding: 20px 16px;
  }
}

.post-footer {
  display: flex;
  gap: 14px;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid var(--glass-border);
}

.page-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  color: var(--text-1);
  transition: all 0.2s;
  min-width: 0;
}

.page-nav.right {
  text-align: right;
}

.page-nav:not(.disabled):hover {
  background: var(--hover-bg);
  border-color: var(--accent);
  transform: translateY(-2px);
}

.page-nav.disabled {
  opacity: 0.45;
}

.page-nav-label {
  font-size: 12px;
  color: var(--text-3);
}

.page-nav-title {
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===== 窄屏悬浮目录 ===== */
.toc-fab {
  position: fixed;
  right: 18px;
  bottom: 88px;
  z-index: 250;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--accent-deep);
  cursor: pointer;
  transition: transform 0.2s;
}

.toc-fab:hover {
  transform: translateY(-2px);
}

.toc-fab.open {
  color: #fff;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  border-color: transparent;
}

.toc-sheet {
  position: fixed;
  right: 18px;
  bottom: 144px;
  z-index: 250;
  width: min(300px, calc(100vw - 36px));
  max-height: min(420px, 60vh);
  overflow-y: auto;
  padding: 16px;
}

/* ≥1280px 有常驻目录，隐藏悬浮按钮 */
@media (min-width: 1280px) {
  .post-layout.has-toc .toc-fab {
    display: none;
  }
}

.not-found {
  padding: 64px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  color: var(--text-2);
}

@media (max-width: 720px) {
  .post-page {
    padding: 24px 20px;
  }
}
</style>

.brand-wait {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 8px 0 22px;
}

.bw-mark {
  font-family: 'Songti SC', serif;
  font-size: 19px;
  font-weight: 900;
  letter-spacing: 0.25em;
  color: var(--accent-deep);
  animation: bwBreath 2.6s ease-in-out infinite;
}

@keyframes bwBreath {
  50% {
    opacity: 0.45;
  }
}

.bw-dots {
  display: flex;
  gap: 7px;
}

.bw-dots i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  animation: bwDot 1.3s ease-in-out infinite;
}

.bw-dots i:nth-child(2) {
  animation-delay: 0.18s;
}

.bw-dots i:nth-child(3) {
  animation-delay: 0.36s;
}

@keyframes bwDot {
  0%, 100% {
    opacity: 0.25;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
    transform: translateY(-5px);
  }
}
