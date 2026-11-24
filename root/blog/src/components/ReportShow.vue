<template>
  <Teleport to="body">
    <transition name="rs-fade">
      <div v-if="open" class="rs-overlay" @click.self="close" @mousemove="onOverlayMove">
        <!-- 背景场景（鼠标视差） -->
        <div class="rs-scene" aria-hidden="true">
        <!-- 多层背景：每页一种渐变，切换淡入淡出 -->
        <div class="rs-bgs">
          <div v-for="n in 7" :key="n" class="rs-bg" :class="'bg' + (n - 1)" :style="{ opacity: idx === n - 1 ? 1 : 0 }"></div>
        </div>
        <!-- 双层星空 -->
        <div class="rs-stars"></div>
        <div class="rs-stars s2"></div>
        <!-- 漂浮光斑 -->
        <div class="rs-glow g1"></div>
        <div class="rs-glow g2"></div>
        <div class="rs-glow g3"></div>
        </div>

        <!-- 彩带画布 -->
        <canvas ref="confettiEl" class="rs-confetti"></canvas>

        <!-- 顶部进度与退出 -->
        <div class="rs-topbar">
          <div class="rs-progress"><div class="rs-progress-bar" :style="{ width: progressPct + '%' }"></div></div>
          <button class="rs-skip" @click="close">跳过 ✕</button>
        </div>

        <!-- 幻灯片 -->
        <div class="rs-stage" @click="next" @wheel.passive="onWheel">
          <transition :name="slideDir === 1 ? 'rs-slide-next' : 'rs-slide-prev'" mode="out-in">
            <div :key="idx" class="rs-slide" :class="'s' + idx">
              <!-- 0 封面 -->
              <template v-if="idx === 0">
                <div class="rs-spark">✦</div>
                <div class="rs-cover-tag">{{ typeName }}</div>
                <h1 class="rs-title">{{ report.label }}</h1>
                <p class="rs-sub">{{ lines.cover }}</p>
                <div class="rs-hint">点击任意处，故事开始</div>
              </template>

              <!-- 1 阅读大数字（仅统计文章） -->
              <template v-else-if="idx === 1">
                <div class="rs-q">{{ lines.accessLead }}</div>
                <div class="rs-big"><CountUp :value="report.access.count" /></div>
                <div class="rs-q2">{{ lines.accessTail }}</div>
              </template>

              <!-- 2 创作数据 -->
              <template v-else-if="idx === 2">
                <div class="rs-q">{{ lines.writeLead }}</div>
                <div class="rs-big"><CountUp :value="report.articles.count" /> 篇</div>
                <div class="rs-row">
                  <span class="rs-mini"><b>{{ fmtWords(report.articles.totalWords) }}</b> 字落笔</span>
                  <span v-if="report.articles.longest" class="rs-mini">
                    <b>最长</b>《{{ report.articles.longest.title.slice(0, 14) }}…》
                  </span>
                </div>
                <div class="rs-q2">{{ lines.writeTail }}</div>
              </template>

              <!-- 3 最受欢迎 -->
              <template v-else-if="idx === 3">
                <div class="rs-q">{{ lines.champLead }}</div>
                <div class="rs-champ" v-if="champion">🏆《{{ champion }}》</div>
                <div class="rs-q2" v-if="championCount">{{ lines.champTail.replace('{n}', championCount) }}</div>
                <div class="rs-rank" v-if="runnerUps.length">
                  <span v-for="(t, i) in runnerUps" :key="i" class="rank-item">{{ i + 2 }}. {{ t }}</span>
                </div>
                <div class="rs-q2 dim" v-if="!champion">{{ lines.champEmpty }}</div>
              </template>

              <!-- 4 读者态度 -->
              <template v-else-if="idx === 4">
                <div class="rs-q">{{ lines.readerLead }}</div>
                <div class="rs-row big-row">
                  <span class="rs-mini"><b><CountUp :value="totalLikes" /></b> 次点赞</span>
                  <span class="rs-mini"><b>{{ bestRate }}</b> 完读率</span>
                </div>
                <div class="rs-q2">{{ bestRateLine }}</div>
              </template>

              <!-- 5 搜索热词 -->
              <template v-else-if="idx === 5">
                <div class="rs-q">{{ lines.searchLead }}</div>
                <div class="rs-cloud">
                  <span v-for="(w, i) in hotWords" :key="i" class="rs-word" :style="{ fontSize: 18 + (hotWords.length - i) * 3 + 'px', animationDelay: i * 0.12 + 's' }">{{ w }}</span>
                </div>
                <div class="rs-q2 dim" v-if="!hotWords.length">{{ lines.searchEmpty }}</div>
                <div class="rs-q2 dim" v-else>{{ lines.searchTail }}</div>
              </template>

              <!-- 6 结语 -->
              <template v-else>
                <div class="rs-spark">🌟</div>
                <div class="rs-q">{{ report.label }}的故事讲完了</div>
                <p class="rs-end">{{ lines.endLine }}</p>
                <p class="rs-end dim">{{ lines.endSub }}</p>
                <button class="rs-finish" @click.stop="close">{{ lines.endBtn }}</button>
              </template>
            </div>
          </transition>
        </div>

        <!-- 圆点与翻页 -->
        <div class="rs-dots">
          <button
            v-for="n in slideCount"
            :key="n"
            class="rs-dot"
            :class="{ on: idx === n - 1 }"
            @click="go(n - 1)"
          ></button>
        </div>
        <div class="rs-arrows">
          <button class="rs-arrow" :disabled="idx === 0" @click="prev">‹</button>
          <button class="rs-arrow" :disabled="idx === slideCount - 1" @click="next">›</button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import CountUp from './CountUp.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  report: { type: Object, required: true },
  stats: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['close'])

const SLIDE_COUNT = 7
const slideCount = SLIDE_COUNT
const idx = ref(0)
const slideDir = ref(1)
const totalLikes = ref(0)

const progressPct = computed(() => ((idx.value + 1) / SLIDE_COUNT) * 100)
const typeName = computed(() => ({ week: '周报', month: '月报', year: '年报' })[props.report?.period] || '报告')

const confettiEl = ref(null)
const sceneEl = ref(null)

/* ---- 鼠标视差：背景随指针轻微偏移 ---- */
function onOverlayMove(e) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = ((e.clientX - r.left) / r.width - 0.5) * 2
  const y = ((e.clientY - r.top) / r.height - 0.5) * 2
  el.style.setProperty('--px', x.toFixed(3))
  el.style.setProperty('--py', y.toFixed(3))
}

/* ---- 终章彩带（零依赖 canvas 引擎） ---- */
let confettiRaf = 0
function fireConfetti() {
  const canvas = confettiEl.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = canvas.offsetWidth * dpr
  canvas.height = canvas.offsetHeight * dpr
  const W = canvas.width
  const H = canvas.height
  const colors = ['#8b7bff', '#4d9fff', '#ffd76e', '#ff8fab', '#5eead4', '#c9c2ff']
  const parts = Array.from({ length: 140 }, () => ({
    x: W / 2 + (Math.random() - 0.5) * W * 0.5,
    y: H * (0.2 + Math.random() * 0.25),
    vx: (Math.random() - 0.5) * 9 * dpr,
    vy: (-4 - Math.random() * 7) * dpr,
    w: (5 + Math.random() * 5) * dpr,
    h: (8 + Math.random() * 6) * dpr,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.25,
    color: colors[Math.floor(Math.random() * colors.length)],
    life: 1,
  }))
  const started = performance.now()
  cancelAnimationFrame(confettiRaf)
  const tick = (now) => {
    const t = (now - started) / 1000
    ctx.clearRect(0, 0, W, H)
    let alive = 0
    for (const p of parts) {
      p.vy += 0.22 * dpr
      p.x += p.vx
      p.y += p.vy
      p.rot += p.vr
      p.life = Math.max(0, 1 - t / 3.6)
      if (p.life <= 0 || p.y > H + 30) continue
      alive++
      ctx.save()
      ctx.globalAlpha = p.life
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * (0.6 + 0.4 * Math.sin(p.rot * 3)))
      ctx.restore()
    }
    if (alive > 0 && props.open) confettiRaf = requestAnimationFrame(tick)
    else ctx.clearRect(0, 0, W, H)
  }
  confettiRaf = requestAnimationFrame(tick)
}

watch(idx, (n) => {
  if (n === SLIDE_COUNT - 1) nextTick(fireConfetti)
})

const champion = computed(() => props.report?.access?.top?.[0]?.title || null)
const championCount = computed(() => props.report?.access?.top?.[0]?.count || 0)
const runnerUps = computed(() => (props.report?.access?.top || []).slice(1, 3).map((t) => t.title || t.path))

/* ---------- 文案引擎：按数据分档 + 多变体随机（每次打开刷新一版） ---------- */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

const lines = ref({})

function buildLines() {
  const access = props.report?.access?.count || 0
  const posts = props.report?.articles?.count || 0
  const words = props.report?.articles?.totalWords || 0

  const cover = pick([
    '每一个数字背后，都是一次相遇',
    '这段时间的记录，讲给你听',
    '数据不会说谎，热爱有迹可循',
    '一期一会，与你共览',
    '时间会给记录以答案',
  ])

  let accessLead, accessTail
  if (access === 0) {
    accessLead = '这段时间，博客安静地等风来'
    accessTail = '没有阅读，也有月光 ✨'
  } else if (access < 100) {
    accessLead = pick(['这段时间，博客文章被阅读了', '陆陆续续，有读者翻开了文章'])
    accessTail = pick(['次 · 每一次翻开都算数', '次 · 谢谢每一次阅读 🙏', '次 · 万事开头难，起步即胜利'])
  } else if (access < 1000) {
    accessLead = pick(['越来越多的读者循光而来', '这段时间，博客文章被阅读了'])
    accessTail = pick(['次 · 蒸蒸日上 📈', '次 · 故事正在被更多人读到', '次 · 你们的每次阅读都是鼓励'])
  } else {
    accessLead = pick(['门庭若市，热闹非凡', '这段时间，博客文章被阅读了'])
    accessTail = pick(['次 · 人气爆棚 🎉', '次 · 高朋满座，蓬荜生辉', '次 · 感谢每一位远道而来的读者'])
  }

  let writeLead, writeTail
  if (posts === 0) {
    writeLead = '这段时间按下了暂停键'
    writeTail = '休息也是创作的一部分 🌙'
  } else if (posts < 3) {
    writeLead = pick(['你静下心来，写下了', '字斟句酌，你完成了'])
    writeTail = pick(['少而精，皆心血之作', '每一篇都值得细细打磨 ✍️', '慢工出细活'])
  } else {
    writeLead = pick(['笔耕不辍，你写下了', '键盘冒烟，你输出了', '灵感井喷，你完成了'])
    writeTail = pick(['写作已成为习惯 💪', '这个产量，respect！', '厚积薄发，肉眼可见'])
  }
  if (words >= 100000) writeTail = pick(['十万字级输出，字字千钧 🖋️', '这字数，可以直接出书了吧', '指尖的星辰大海'])

  const champLead = pick(['大家最爱看的是', '流量之王当属', '最受读者青睐的，是'])
  const champTail = pick(['被打开 {n} 次，当之无愧', '以 {n} 次打开强势登顶', '{n} 次点击，实力使然'])
  const champEmpty = pick(['暂时还没有访问数据——好酒也怕巷子深', '静待第一位有缘人 🍶'])

  const readerLead = pick(['读者们的回应，是最好的回礼', '这些数字来自屏幕前的他们', '你看，有人在认真回应'])
  const searchLead = pick(['读者们在这里 searching', '他们带着问题而来', '搜索框里，藏着读者的好奇'])
  const searchEmpty = pick(['搜索框还在等待第一个问号', '暂无搜索记录，也许大家都直达目标'])
  const searchTail = pick(['每一个词，都是一篇选题', '这些词，你写到了吗？', '读者的好奇心，尽在其中'])

  const isYear = props.report?.period === 'year'
  const y = props.report?.label?.match(/\d{4}/)?.[0] || ''
  const endLine = posts > 0
    ? pick(
        isYear
          ? [`${y} 收官，感谢每一个日夜`, `${y} 的故事，写满了热爱`, '这一年，我们都未曾辜负']
          : ['一期一会，后会有期', '这个周期的故事，圆满收官', '记录的意义，在于被看见'],
      )
    : pick(['空白也是故事的一部分', '休整之后，再出发'])
  const endSub = isYear ? '新的一年，继续记录、继续分享 ✨' : '下一个周期，我们再会 ✨'
  const endBtn = pick(['完成回顾', '带着热爱继续', '后会有期', '满怀期待出发'])

  lines.value = { cover, accessLead, accessTail, writeLead, writeTail, champLead, champTail, champEmpty, readerLead, searchLead, searchEmpty, searchTail, endLine, endSub, endBtn }
}

const bestRateLine = computed(() => {
  const r = (props.stats?.readStats || []).filter((x) => x.opens >= 2 && x.rate > 0)[0]
  if (!r) return pick(['每一篇完读，都是最好的鼓励', '有人从头读到尾，这就是意义'])
  return pick([
    `《${r.title.slice(0, 16)}》被从头到尾读了 ${r.done} 次`,
    `${r.done} 位读者读完了《${r.title.slice(0, 14)}…》`,
  ])
})
const bestRate = computed(() => {
  const r = (props.stats?.readStats || []).filter((x) => x.opens >= 2 && x.rate > 0)[0]
  return r ? r.rate + '%' : '—'
})
const hotWords = computed(() => (props.stats?.searchTop || []).slice(0, 6).map((x) => x.q))

function fmtWords(n) {
  return n >= 10000 ? (n / 10000).toFixed(1) + ' 万' : String(n || 0)
}

function next() {
  if (idx.value < SLIDE_COUNT - 1) {
    slideDir.value = 1
    idx.value++
  }
}
function prev() {
  if (idx.value > 0) {
    slideDir.value = -1
    idx.value--
  }
}
function go(n) {
  slideDir.value = n > idx.value ? 1 : -1
  idx.value = n
}
function close() {
  emit('close')
}

let wheelLock = 0
function onWheel(e) {
  if (Date.now() - wheelLock < 600) return
  wheelLock = Date.now()
  if (e.deltaY > 20) next()
  else if (e.deltaY < -20) prev()
}

function onKey(e) {
  if (!props.open) return
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight' || e.key === ' ') next()
  else if (e.key === 'ArrowLeft') prev()
}
document.addEventListener('keydown', onKey)
onMounted(() => {})
onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  cancelAnimationFrame(confettiRaf)
})

watch(
  () => props.open,
  (v) => {
    if (v) {
      idx.value = 0
      buildLines()
      document.body.style.overflow = 'hidden'
      fetch('/api/likes')
        .then((r) => r.json())
        .then((d) => (totalLikes.value = Object.values(d || {}).reduce((a, b) => a + b, 0)))
        .catch(() => {})
    } else {
      document.body.style.overflow = ''
    }
  },
)
</script>

<style scoped>
.rs-overlay {
  position: fixed;
  inset: 0;
  z-index: 950;
  background: #0a0918;
  color: #efedff;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  overflow: hidden;
}

/* ===== 背景场景：鼠标视差容器 ===== */
.rs-scene {
  position: absolute;
  inset: -40px;
  pointer-events: none;
  transform: translate(calc(var(--px, 0) * -16px), calc(var(--py, 0) * -12px));
  will-change: transform;
}

/* ===== 彩带画布 ===== */
.rs-confetti {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
}

/* ===== 逐元素编排入场：页面内元素依次浮现 ===== */
.rs-slide > :deep(*) {
  animation: rsItemIn 0.65s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

.rs-slide > :deep(*:nth-child(1)) { animation-delay: 0.05s; }
.rs-slide > :deep(*:nth-child(2)) { animation-delay: 0.22s; }
.rs-slide > :deep(*:nth-child(3)) { animation-delay: 0.4s; }
.rs-slide > :deep(*:nth-child(4)) { animation-delay: 0.58s; }
.rs-slide > :deep(*:nth-child(5)) { animation-delay: 0.76s; }
.rs-slide > :deep(*:nth-child(6)) { animation-delay: 0.94s; }

@keyframes rsItemIn {
  from {
    opacity: 0;
    transform: translateY(22px);
    filter: blur(6px);
  }
  to {
    opacity: 1;
    transform: none;
    filter: none;
  }
}

/* ===== 多层背景：每页一种氛围 ===== */
.rs-bgs,
.rs-stars,
.rs-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.rs-bg {
  position: absolute;
  inset: 0;
  transition: opacity 0.9s ease;
}

/* 封面：深紫星域 */
.bg0 {
  background:
    radial-gradient(900px 500px at 75% 18%, rgba(139, 123, 255, 0.22), transparent 60%),
    radial-gradient(700px 600px at 18% 82%, rgba(61, 139, 253, 0.16), transparent 60%),
    linear-gradient(160deg, #191436 0%, #0e0b24 55%, #0a0918 100%);
}

/* 访问：深蓝海 */
.bg1 {
  background:
    radial-gradient(800px 480px at 70% 25%, rgba(77, 159, 255, 0.22), transparent 62%),
    radial-gradient(600px 500px at 22% 78%, rgba(45, 212, 191, 0.12), transparent 60%),
    linear-gradient(165deg, #0d1b33 0%, #0a1226 60%, #080d1c 100%);
}

/* 创作：紫红晚霞 */
.bg2 {
  background:
    radial-gradient(850px 500px at 28% 22%, rgba(217, 70, 239, 0.16), transparent 60%),
    radial-gradient(700px 550px at 76% 80%, rgba(109, 94, 242, 0.2), transparent 62%),
    linear-gradient(160deg, #221236 0%, #160d2c 58%, #0c0919 100%);
}

/* 冠军：金色荣耀 */
.bg3 {
  background:
    radial-gradient(750px 460px at 50% 20%, rgba(255, 196, 84, 0.16), transparent 60%),
    radial-gradient(640px 520px at 82% 78%, rgba(217, 119, 6, 0.12), transparent 60%),
    radial-gradient(560px 460px at 14% 72%, rgba(139, 123, 255, 0.12), transparent 60%),
    linear-gradient(165deg, #241a10 0%, #170f14 55%, #0c0a12 100%);
}

/* 读者：青碧夜光 */
.bg4 {
  background:
    radial-gradient(820px 500px at 72% 24%, rgba(45, 212, 191, 0.16), transparent 60%),
    radial-gradient(680px 520px at 24% 80%, rgba(59, 130, 246, 0.16), transparent 62%),
    linear-gradient(162deg, #0c2028 0%, #0a1626 58%, #080d1a 100%);
}

/* 搜索：绛紫极光 */
.bg5 {
  background:
    radial-gradient(900px 460px at 30% 18%, rgba(167, 139, 250, 0.18), transparent 58%),
    radial-gradient(640px 520px at 78% 82%, rgba(236, 72, 153, 0.1), transparent 60%),
    linear-gradient(160deg, #1b1233 0%, #120d26 58%, #0a0918 100%);
}

/* 结语：暖紫晨曦 */
.bg6 {
  background:
    radial-gradient(880px 520px at 50% 82%, rgba(139, 123, 255, 0.2), transparent 62%),
    radial-gradient(600px 420px at 76% 16%, rgba(255, 158, 132, 0.1), transparent 58%),
    linear-gradient(15deg, #0e0b24 0%, #140f2e 55%, #0c0a1c 100%);
}

/* ===== 星空（两层不同节奏闪烁） ===== */
.rs-stars {
  background-image:
    radial-gradient(1.6px 1.6px at 12% 22%, rgba(255, 255, 255, 0.85) 50%, transparent),
    radial-gradient(1.2px 1.2px at 28% 68%, rgba(255, 255, 255, 0.6) 50%, transparent),
    radial-gradient(1.8px 1.8px at 46% 14%, rgba(214, 214, 255, 0.9) 50%, transparent),
    radial-gradient(1.2px 1.2px at 62% 42%, rgba(255, 255, 255, 0.55) 50%, transparent),
    radial-gradient(1.6px 1.6px at 78% 18%, rgba(255, 255, 255, 0.8) 50%, transparent),
    radial-gradient(1.2px 1.2px at 88% 62%, rgba(205, 220, 255, 0.6) 50%, transparent),
    radial-gradient(1.6px 1.6px at 8% 82%, rgba(255, 255, 255, 0.7) 50%, transparent),
    radial-gradient(1.2px 1.2px at 38% 88%, rgba(255, 255, 255, 0.5) 50%, transparent),
    radial-gradient(1.8px 1.8px at 68% 76%, rgba(230, 230, 255, 0.75) 50%, transparent),
    radial-gradient(1.2px 1.2px at 94% 34%, rgba(255, 255, 255, 0.6) 50%, transparent);
  animation: rsTwinkle 4.2s ease-in-out infinite;
}

.rs-stars.s2 {
  background-image:
    radial-gradient(1.4px 1.4px at 18% 44%, rgba(255, 255, 255, 0.7) 50%, transparent),
    radial-gradient(1px 1px at 34% 26%, rgba(255, 255, 255, 0.5) 50%, transparent),
    radial-gradient(1.6px 1.6px at 54% 58%, rgba(220, 214, 255, 0.8) 50%, transparent),
    radial-gradient(1px 1px at 72% 34%, rgba(255, 255, 255, 0.45) 50%, transparent),
    radial-gradient(1.4px 1.4px at 84% 84%, rgba(255, 255, 255, 0.65) 50%, transparent),
    radial-gradient(1px 1px at 4% 54%, rgba(255, 255, 255, 0.5) 50%, transparent),
    radial-gradient(1.6px 1.6px at 58% 92%, rgba(205, 220, 255, 0.6) 50%, transparent);
  animation: rsTwinkle 5.8s ease-in-out infinite reverse;
}

@keyframes rsTwinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

/* ===== 漂浮光斑 ===== */
.rs-glow {
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: rsDrift 16s ease-in-out infinite alternate;
}

.g1 {
  width: 420px;
  height: 420px;
  left: -100px;
  top: -80px;
  background: radial-gradient(circle, rgba(139, 123, 255, 0.5), transparent 70%);
}

.g2 {
  width: 360px;
  height: 360px;
  right: -80px;
  top: 30%;
  background: radial-gradient(circle, rgba(77, 159, 255, 0.4), transparent 70%);
  animation-delay: -6s;
}

.g3 {
  width: 300px;
  height: 300px;
  left: 34%;
  bottom: -120px;
  background: radial-gradient(circle, rgba(180, 139, 255, 0.4), transparent 70%);
  animation-delay: -11s;
}

@keyframes rsDrift {
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(60px, 40px) scale(1.1); }
}

/* ===== 顶部栏 ===== */
.rs-topbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  position: relative;
  z-index: 2;
}

.rs-progress {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.14);
  overflow: hidden;
}

.rs-progress-bar {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, #8b7bff, #4d9fff);
  transition: width 0.4s ease;
}

.rs-skip {
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border-radius: 999px;
  font-size: 12.5px;
  padding: 5px 14px;
  cursor: pointer;
}

.rs-skip:hover {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.6);
}

/* ===== 舞台 ===== */
.rs-stage {
  flex: 1;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 20px;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.rs-slide {
  max-width: 760px;
  width: 100%;
}

.rs-slide-next-enter-active,
.rs-slide-next-leave-active,
.rs-slide-prev-enter-active,
.rs-slide-prev-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.rs-slide-next-enter-from { opacity: 0; transform: translateY(26px); }
.rs-slide-next-leave-to { opacity: 0; transform: translateY(-20px); }
.rs-slide-prev-enter-from { opacity: 0; transform: translateY(-20px); }
.rs-slide-prev-leave-to { opacity: 0; transform: translateY(26px); }

.rs-spark {
  font-size: 44px;
  animation: rsFloat 3s ease-in-out infinite alternate;
}

@keyframes rsFloat {
  from { transform: translateY(-6px); }
  to { transform: translateY(6px) rotate(6deg); }
}

.rs-cover-tag {
  font-size: 14px;
  letter-spacing: 0.4em;
  color: #968bff;
  margin: 18px 0 10px;
}

.rs-title {
  font-size: clamp(34px, 8vw, 52px);
  font-weight: 900;
  background: linear-gradient(120deg, #a29bff, #6db4ff, #a29bff);
  background-size: 200%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: rsShine 4s linear infinite;
}

@keyframes rsShine {
  to { background-position: 200%; }
}

.rs-sub {
  margin-top: 14px;
  color: rgba(239, 237, 255, 0.6);
  font-size: 15px;
}

.rs-hint {
  margin-top: 46px;
  font-size: 12.5px;
  color: rgba(239, 237, 255, 0.35);
  animation: rsBlink 1.6s ease-in-out infinite;
}

@keyframes rsBlink {
  50% { opacity: 0.25; }
}

.rs-q {
  font-size: 19px;
  color: rgba(239, 237, 255, 0.78);
}

.rs-q2 {
  margin-top: 12px;
  font-size: 15px;
  color: rgba(239, 237, 255, 0.6);
}

.rs-q2.dim {
  color: rgba(239, 237, 255, 0.4);
  font-size: 13.5px;
}

.rs-big {
  font-size: clamp(56px, 14vw, 88px);
  font-weight: 900;
  line-height: 1.15;
  background: linear-gradient(135deg, #a29bff, #6db4ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 10px 0;
  text-shadow: 0 20px 60px rgba(109, 94, 242, 0.25);
}

.rs-row {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
  margin-top: 18px;
}

.rs-row.big-row .rs-mini b {
  font-size: 44px;
}

.rs-mini {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13.5px;
  color: rgba(239, 237, 255, 0.6);
}

.rs-mini b {
  font-size: 26px;
  background: linear-gradient(135deg, #a29bff, #6db4ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.rs-champ {
  font-size: clamp(24px, 6vw, 34px);
  font-weight: 800;
  margin: 16px 0 6px;
  color: #ffd76e;
  text-shadow: 0 4px 24px rgba(255, 215, 110, 0.3);
}

.rs-rank {
  display: flex;
  justify-content: center;
  gap: 22px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.rank-item {
  font-size: 13.5px;
  color: rgba(239, 237, 255, 0.55);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 260px;
}

.rs-cloud {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 14px 22px;
  margin-top: 26px;
  min-height: 120px;
}

.rs-word {
  font-weight: 700;
  color: #c9c2ff;
  animation: rsWord 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) backwards;
}

@keyframes rsWord {
  from { opacity: 0; transform: scale(0.5) translateY(10px); }
}

.rs-end {
  margin-top: 16px;
  color: rgba(239, 237, 255, 0.75);
  font-size: 16px;
}

.rs-end.dim {
  margin-top: 8px;
  color: rgba(239, 237, 255, 0.45);
  font-size: 13.5px;
}

.rs-finish {
  margin-top: 40px;
  padding: 12px 44px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #6d5ef2, #3d8bfd);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(109, 94, 242, 0.45);
}

.rs-finish:hover {
  transform: translateY(-2px);
}

.rs-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  position: relative;
  z-index: 2;
}

.rs-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.25s;
}

.rs-dot.on {
  background: linear-gradient(135deg, #8b7bff, #4d9fff);
  transform: scale(1.35);
}

.rs-arrows {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 14px;
  pointer-events: none;
  z-index: 2;
}

.rs-arrow {
  pointer-events: auto;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.75);
  font-size: 22px;
  cursor: pointer;
}

.rs-arrow:hover:not(:disabled) {
  background: rgba(139, 123, 255, 0.25);
}

.rs-arrow:disabled {
  opacity: 0.2;
  cursor: default;
}

.rs-fade-enter-active,
.rs-fade-leave-active {
  transition: opacity 0.4s ease;
}
.rs-fade-enter-from,
.rs-fade-leave-to {
  opacity: 0;
}
</style>
