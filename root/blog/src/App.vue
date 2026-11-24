<template>
  <div class="bg-scene" aria-hidden="true">
    <div class="gradient"></div>
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
  </div>

  <SiteHeader />

  <!-- 站点公告横幅（后台「概览」里编辑） -->
  <div v-if="showAnnounce" class="announce-bar">
    <span class="ann-text">📢 {{ announce.text }}</span>
    <button class="ann-close" title="今日不再显示" @click="dismissAnnounce">✕</button>
  </div>

  <!-- 源站不可达时的降级提示：宁可吵闹，不要静默展示旧数据 -->
  <transition name="fade-slide">
    <div v-if="store.stale" class="stale-banner">
      ⚠ 暂时无法连接文章源（GitHub），正在展示缓存内容——最新发布的文章可能尚未显示，稍后会自动重试
    </div>
  </transition>

  <BackTop />
  <CommandPalette />
  <MusicPlayer />

  <!-- 报告出炉提醒（月报：次月1号22点 / 年报：12-31 22点 解锁，每期只提醒一次） -->
  <transition name="fade-slide">
    <div v-if="reportCard" class="report-card glass">
      <div class="rc-icon">🎁</div>
      <div class="rc-info">
        <strong>{{ reportCard.title }}已出炉</strong>
        <span>{{ reportCard.label }} · 点击回顾这段时光</span>
      </div>
      <button class="rc-open" @click="openReport">立即查看</button>
      <button class="rc-close" title="不再提醒本期" @click="dismissReport">✕</button>
    </div>
  </transition>

  <ReportShow
    :open="reportShowOpen"
    :report="reportCard?.data || {}"
    :stats="reportCard?.stats || {}"
    @close="closeReport"
  />

  <!-- 🥚 彩蛋：Matrix 数字雨（Konami 触发） -->
  <MatrixRain :active="matrixOn" @exit="matrixOn = false" />

  <!-- 🥚 彩蛋：全局 toast（彩蛋专用，避免打断） -->
  <transition name="fade-slide">
    <div v-if="eggToast" class="egg-toast glass">{{ eggToast }}</div>
  </transition>

  <main class="main-area" :class="{ 'home-main': $route.name === 'home' }">
    <div class="container" :class="{ 'container-wide': $route.name === 'post' }">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </main>

  <footer class="site-footer">
    <p>© {{ year }} 岩栖_shard · 记录即存在 · 由 Vue 3 驱动</p>
  </footer>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref, computed, defineAsyncComponent } from 'vue'
import SiteHeader from './components/SiteHeader.vue'
import BackTop from './components/BackTop.vue'
const MusicPlayer = defineAsyncComponent(() => import('./components/MusicPlayer.vue'))
// 懒挂载：非首屏必需的重组件，首次使用时才下载
const CommandPalette = defineAsyncComponent(() => import('./components/CommandPalette.vue'))
const ReportShow = defineAsyncComponent(() => import('./components/ReportShow.vue'))
const MatrixRain = defineAsyncComponent(() => import('./components/MatrixRain.vue'))
import { latestReleased, isReportSeen, markReportSeen } from './composables/reportRelease'
import { site } from './config'
import { useTheme } from './composables/useTheme'
import { loadPosts, store, installHoverPrefetch } from './posts'
import { paletteOpen, openPalette, closePalette } from './composables/palette'

useTheme()
loadPosts()
installHoverPrefetch()

// 空闲预取：首屏渲染完后拉文章页整条链路（组件+markdown 引擎），点文章即秒开
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    import('./views/PostView.vue').catch(() => {})
  }, { timeout: 4000 })
}

const year = new Date().getFullYear()

/* ==================== 🥚 彩蛋区 ==================== */

const matrixOn = ref(false)
const eggToast = ref('')
let eggToastTimer = 0

function toast(text, ms = 2600) {
  eggToast.value = text
  clearTimeout(eggToastTimer)
  eggToastTimer = setTimeout(() => (eggToast.value = ''), ms)
}

// 1) Konami 秘籍 ↑↑↓↓←→←→BA
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
let konamiIdx = 0

// 2) 任意处连打 flag
let flagBuf = ''
let flagBufTimer = 0

// 3) 标签页离开标题
let titleBackup = ''

function eggKeydown(e) {
  if (e.key === 'Escape') matrixOn.value = false

  const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName) || e.target?.isContentEditable
  if (!isTyping) {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
    if (k === KONAMI[konamiIdx] || (KONAMI[konamiIdx].length === 1 && k === KONAMI[konamiIdx].toLowerCase())) {
      konamiIdx++
      if (konamiIdx === KONAMI.length) {
        konamiIdx = 0
        matrixOn.value = !matrixOn.value
        toast(matrixOn.value ? 'woke up, hacker… 🟩' : '回到现实世界')
      }
    } else {
      konamiIdx = k === KONAMI[0] ? 1 : 0
    }
    if (/[a-z]/.test(k)) {
      flagBuf = (flagBuf + k).slice(-8)
      clearTimeout(flagBufTimer)
      flagBufTimer = setTimeout(() => (flagBuf = ''), 1600)
      if (flagBuf.endsWith('flag')) {
        flagBuf = ''
        toast('flag{th1s_1s_a_fake_flag} 😏 这里的 flag 是假的，去做题')
      }
    }
  }
}
document.addEventListener('keydown', eggKeydown)

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    titleBackup = document.title
    document.title = '👀 别走呀，flag 还没找到呢'
  } else if (titleBackup) {
    document.title = titleBackup
    titleBackup = ''
  }
})

window.addEventListener('avatar-egg', () => {
  const QUOTES = [
    'flag 两行泪，夜战到三点 🌙',
    'ret2 的尽头是 spec',
    'nc 连不上？先检查网线（认真）',
    '菜就多练 😤',
    '今日份 RCE 已到货 📦',
    '一寸 shell 一寸血',
    'pwn 掉的不只是程序，还有头发',
  ]
  toast(QUOTES[Math.floor(Math.random() * QUOTES.length)])
})

window.addEventListener('footer-egg', () => {
  document.documentElement.classList.add('negatif')
  toast('负片模式 😎', 3000)
  setTimeout(() => document.documentElement.classList.remove('negatif'), 3000)
})

/* ---- 周期报告出炉提醒 ---- */
const reportCard = ref(null)
const reportShowOpen = ref(false)

async function checkReportRelease() {
  const { annual, monthly } = latestReleased()
  // 年报优先；建站之前的期没有故事，直接标记已读避免反复探测
  for (const cand of [annual, monthly]) {
    if (isReportSeen(cand.key)) continue
    try {
      const res = await fetch(`/api/report?period=${cand.type}&offset=${cand.offset}`)
      const data = await res.json()
      if (data.beforeSite || (!data.articles.count && !data.access.count)) {
        markReportSeen(cand.key)
        continue
      }
      let stats = {}
      try {
        stats = await (await fetch('/api/logs/stats')).json()
      } catch {}
      const title = cand.type === 'year' ? `${data.label.replace(' 年', '')} 年报` : `${data.label} 月报`
      reportCard.value = { ...cand, data, stats, title, label: data.label }
      return
    } catch {
      return
    }
  }
}
checkReportRelease()

function openReport() {
  reportShowOpen.value = true
}

function closeReport() {
  reportShowOpen.value = false
  if (reportCard.value) {
    markReportSeen(reportCard.value.key)
    reportCard.value = null
  }
}

function dismissReport() {
  if (reportCard.value) markReportSeen(reportCard.value.key)
  reportCard.value = null
}

/* ---- 站点公告 ---- */
const announce = reactive({ on: false, text: '' })
const annDismissed = ref(localStorage.getItem('yanqi-ann-day') === new Date().toISOString().slice(0, 10))
const showAnnounce = computed(
  () => announce.on && announce.text.trim() && !annDismissed.value,
)

async function loadAnnounce() {
  try {
    const res = await fetch('/api/announce')
    Object.assign(announce, await res.json())
  } catch {}
}
loadAnnounce()
window.addEventListener('announce-updated', loadAnnounce)

let footerClicks = 0
let footerTimer = 0
function onFooterEgg() {
  footerClicks++
  clearTimeout(footerTimer)
  footerTimer = setTimeout(() => (footerClicks = 0), 1500)
  if (footerClicks >= 5) {
    footerClicks = 0
    window.dispatchEvent(new CustomEvent('footer-egg'))
  }
}

function dismissAnnounce() {
  annDismissed.value = true
  localStorage.setItem('yanqi-ann-day', new Date().toISOString().slice(0, 10))
}

/* Ctrl+K / Cmd+K 呼出命令面板 */
function onKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
    e.preventDefault()
    paletteOpen.value ? closePalette() : openPalette()
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

/* 卡片光晕跟随：单个 rAF 节流的指针监听，把坐标写给悬停中的 .spot 卡片 */
let spotRaf = 0
function onPointerMove(e) {
  if (spotRaf) return
  spotRaf = requestAnimationFrame(() => {
    spotRaf = 0
    const el = e.target instanceof Element ? e.target.closest('.spot') : null
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', e.clientX - rect.left + 'px')
    el.style.setProperty('--my', e.clientY - rect.top + 'px')
  })
}

onMounted(() => document.addEventListener('pointermove', onPointerMove, { passive: true }))
onUnmounted(() => {
  document.removeEventListener('pointermove', onPointerMove)
  if (spotRaf) cancelAnimationFrame(spotRaf)
})
</script>

<style>
.home-main {
  padding-top: 0;
}

/* 文章页三栏布局（侧边栏 + 正文 + 目录）用更宽的容器 */
.container-wide {
  max-width: 1800px;
}

.report-card {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 92px;
  z-index: 280;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: var(--radius-lg);
  cursor: default;
  animation: reportCardIn 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
  max-width: calc(100vw - 32px);
}

@keyframes reportCardIn {
  from { opacity: 0; transform: translateX(-50%) translateY(24px) scale(0.95); }
}

.rc-icon {
  font-size: 30px;
  animation: rsBob 2.4s ease-in-out infinite alternate;
}

@keyframes rsBob {
  to { transform: rotate(10deg) scale(1.12); }
}

.rc-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.rc-info strong {
  font-size: 15px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.rc-info span {
  font-size: 12px;
  color: var(--text-3);
}

.rc-open {
  padding: 8px 18px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.rc-open:hover {
  box-shadow: 0 6px 18px rgba(109, 94, 242, 0.45);
}

.rc-close {
  border: none;
  background: transparent;
  color: var(--text-3);
  cursor: pointer;
  font-size: 13px;
  padding: 4px 6px;
  border-radius: 6px;
}

.rc-close:hover {
  background: var(--hover-bg);
  color: var(--text-1);
}

.egg-toast {
  position: fixed;
  left: 50%;
  bottom: 150px;
  transform: translateX(-50%);
  z-index: 960;
  padding: 12px 22px;
  border-radius: 999px;
  font-size: 14px;
  color: var(--text-1);
  max-width: calc(100vw - 32px);
  text-align: center;
}

html.negatif {
  filter: invert(1) hue-rotate(180deg);
}

html.negatif .egg-toast,
html.negatif .mr-canvas {
  filter: invert(1) hue-rotate(180deg);
}

.footer-egg {
  cursor: pointer;
  user-select: none;
}

.announce-bar {
  max-width: 1440px;
  margin: 10px auto 0;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  background: linear-gradient(90deg, rgba(109, 94, 242, 0.18), rgba(61, 139, 253, 0.18));
  border: 1px solid rgba(109, 94, 242, 0.4);
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 13.5px;
  color: var(--text-1);
  backdrop-filter: blur(12px);
}

.ann-text {
  flex: 1;
}

.ann-close {
  border: none;
  background: transparent;
  color: var(--text-3);
  cursor: pointer;
  font-size: 13px;
  padding: 2px 6px;
  border-radius: 6px;
}

.ann-close:hover {
  color: var(--text-1);
  background: var(--hover-bg);
}

.stale-banner {
  max-width: 1440px;
  margin: 10px auto 0;
  padding: 9px 20px;
  border-radius: var(--radius-sm);
  background: rgba(230, 162, 60, 0.15);
  border: 1px solid rgba(230, 162, 60, 0.4);
  color: #b3782a;
  font-size: 13px;
  backdrop-filter: blur(12px);
}

html[data-theme='dark'] .report-card {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 92px;
  z-index: 280;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: var(--radius-lg);
  cursor: default;
  animation: reportCardIn 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
  max-width: calc(100vw - 32px);
}

@keyframes reportCardIn {
  from { opacity: 0; transform: translateX(-50%) translateY(24px) scale(0.95); }
}

.rc-icon {
  font-size: 30px;
  animation: rsBob 2.4s ease-in-out infinite alternate;
}

@keyframes rsBob {
  to { transform: rotate(10deg) scale(1.12); }
}

.rc-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.rc-info strong {
  font-size: 15px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.rc-info span {
  font-size: 12px;
  color: var(--text-3);
}

.rc-open {
  padding: 8px 18px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.rc-open:hover {
  box-shadow: 0 6px 18px rgba(109, 94, 242, 0.45);
}

.rc-close {
  border: none;
  background: transparent;
  color: var(--text-3);
  cursor: pointer;
  font-size: 13px;
  padding: 4px 6px;
  border-radius: 6px;
}

.rc-close:hover {
  background: var(--hover-bg);
  color: var(--text-1);
}

.egg-toast {
  position: fixed;
  left: 50%;
  bottom: 150px;
  transform: translateX(-50%);
  z-index: 960;
  padding: 12px 22px;
  border-radius: 999px;
  font-size: 14px;
  color: var(--text-1);
  max-width: calc(100vw - 32px);
  text-align: center;
}

html.negatif {
  filter: invert(1) hue-rotate(180deg);
}

html.negatif .egg-toast,
html.negatif .mr-canvas {
  filter: invert(1) hue-rotate(180deg);
}

.footer-egg {
  cursor: pointer;
  user-select: none;
}

.announce-bar {
  max-width: 1440px;
  margin: 10px auto 0;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  background: linear-gradient(90deg, rgba(109, 94, 242, 0.18), rgba(61, 139, 253, 0.18));
  border: 1px solid rgba(109, 94, 242, 0.4);
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 13.5px;
  color: var(--text-1);
  backdrop-filter: blur(12px);
}

.ann-text {
  flex: 1;
}

.ann-close {
  border: none;
  background: transparent;
  color: var(--text-3);
  cursor: pointer;
  font-size: 13px;
  padding: 2px 6px;
  border-radius: 6px;
}

.ann-close:hover {
  color: var(--text-1);
  background: var(--hover-bg);
}

.stale-banner {
  color: #e6b86c;
}
</style>

<style scoped>
.site-footer {
  padding: 0 0 30px;
}

.site-footer p {
  text-align: center;
  font-size: 12.5px;
  color: var(--text-3);
  letter-spacing: 0.08em;
}
</style>
