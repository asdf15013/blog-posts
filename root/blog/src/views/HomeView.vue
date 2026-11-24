<template>
  <div>
    <!-- 全屏风景轮播首屏 -->
    <section class="hero">
      <transition name="heroFade" mode="out-in">
        <div class="hero-bg" :key="heroIdx" :style="{ backgroundImage: `url(${scenes[heroIdx].img})` }"></div>
      </transition>
      <div class="hero-mask"></div>

      <div class="hero-text">
        <transition name="heroFade" mode="out-in">
          <div :key="heroIdx">
            <div class="hero-kicker">{{ scenes[heroIdx].cap }}</div>
            <h1 class="hero-title">岩栖散记</h1>
            <p class="hero-sub">代码之外，别有洞天 —— CTF 笔记 · 开发踩坑 · 读书随笔</p>
          </div>
        </transition>
        <div class="hero-dots">
          <button
            v-for="(s, i) in scenes"
            :key="i"
            class="hero-dot"
            :class="{ on: heroIdx === i }"
            @click.stop="heroIdx = i"
          ></button>
        </div>
      </div>
      <div class="hero-down" title="向下探索" @click="scrollDown">︾</div>
    </section>

    <!-- 白卡悬浮层：正文与侧栏统一承载 -->
    <section class="sheet">
      <div class="sheet-grid">
        <div class="feed">
          <div class="feed-head">
            <span class="feed-title">最近文章</span>
            <span class="feed-sub">{{ store.loading ? '' : `共 ${filtered.length} 篇 · 记录即存在` }}</span>
          </div>

          <div class="filter-bar" v-if="filterLabel">
            <span>
              筛选：<strong>{{ filterLabel }}</strong>
              <em class="filter-count">（{{ filtered.length }} 篇）</em>
            </span>
            <button class="clear-btn" @click="clearFilter">✕ 清除</button>
          </div>

          <template v-if="filtered.length">
            <PostCard v-for="(p, i) in paged" :key="p.slug" v-reveal="Math.min(i, 5) * 70" :post="p" />
            <PaginationBar v-model:page="page" :page-count="pageCount" :total="filtered.length" />
          </template>
          <template v-else-if="store.loading">
            <div v-for="n in 3" :key="n" class="sk-card">
              <div class="sk-line w30"></div>
              <div class="sk-line w80" style="height: 22px"></div>
              <div class="sk-line w90"></div>
              <div class="sk-line w60"></div>
            </div>
          </template>
          <div v-else-if="store.error" class="empty">
            <p>文章加载失败：{{ store.error }}</p>
            <button class="btn-glass" @click="loadPosts(true)">重试</button>
          </div>
          <div v-else class="empty">该分类下暂无文章</div>
        </div>

        <SiteSidebar />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PostCard from '../components/PostCard.vue'
import SiteSidebar from '../components/SiteSidebar.vue'
import PaginationBar from '../components/PaginationBar.vue'
import { store, loadPosts } from '../posts'

const route = useRoute()
const router = useRouter()

// 冷启动提示：3 秒后告诉访客在拉取
const slowTip = ref('')
let slowTimer = 0
onMounted(() => {
  slowTimer = setTimeout(() => (slowTip.value = '首次加载较慢（正在从远端同步文章），再稍等片刻…'), 3000)
})
onUnmounted(() => clearTimeout(slowTimer))
watch(store.loading, (v) => {
  if (!v) slowTip.value = ''
})

/* 轮播 */
const scenes = [
  { img: '/scenery/dawn.svg', cap: '山间黎明 · 每一次抵达都值得记录' },
  { img: '/scenery/night.svg', cap: '静夜湖畔 · 代码之外，别有洞天' },
  { img: '/scenery/mist.svg', cap: '雾里青山 · 慢慢走，欣赏啊' },
  { img: '/scenery/sea.svg', cap: '落日归帆 · 今日份 RCE 已到货' },
]
const heroIdx = ref(0)
let heroTimer = 0
onMounted(() => {
  heroTimer = setInterval(() => (heroIdx.value = (heroIdx.value + 1) % scenes.length), 6500)
})
onUnmounted(() => clearInterval(heroTimer))

function scrollDown() {
  document.querySelector('.sheet')?.scrollIntoView({ behavior: 'smooth' })
}

/* 筛选与分页 */
const filtered = computed(() => {
  const { cat, tag, series } = route.query
  return store.posts.filter((p) => {
    if (cat && p.category !== cat) return false
    if (tag && !p.tags.includes(tag)) return false
    if (series && p.series !== series) return false
    return true
  })
})

const filterLabel = computed(() => {
  if (route.query.cat) return `分类 · ${route.query.cat}`
  if (route.query.tag) return `标签 · ${route.query.tag}`
  if (route.query.series) return `系列 · ${route.query.series}`
  return ''
})

const PAGE_SIZE = 10
const page = ref(1)
const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))
const paged = computed(() => filtered.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))
watch(
  () => route.query,
  () => (page.value = 1),
)

function clearFilter() {
  router.push({ path: '/' })
}
</script>

<style scoped>
/* ===== 首屏 ===== */
.hero {
  position: relative;
  height: 56vh;
  min-height: 400px;
  overflow: hidden;
  margin-top: -76px;
  /* 全出血：突破 App 容器宽度，铺满视口 */
  width: 100vw;
  margin-left: calc(50% - 50vw);
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transform: scale(1.06);
  transition: transform 9s linear;
}

.hero:hover .hero-bg {
  transform: scale(1.12);
}

.hero-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(10, 12, 24, 0.16) 0%,
    rgba(10, 12, 24, 0.04) 42%,
    rgba(247, 248, 250, 0.55) 84%,
    var(--bg-base) 99%
  );
}

.hero-text {
  position: absolute;
  inset: 0 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  text-shadow: 0 2px 20px rgba(10, 12, 24, 0.45);
}

.hero-kicker {
  font-size: 13.5px;
  letter-spacing: 0.4em;
  opacity: 0.9;
  margin-bottom: 16px;
}

.hero-title {
  font-family: 'Songti SC', 'Noto Serif SC', serif;
  font-size: clamp(42px, 8vw, 68px);
  font-weight: 900;
  letter-spacing: 0.16em;
  text-indent: 0.16em;
}

.hero-sub {
  margin-top: 18px;
  font-size: 14px;
  letter-spacing: 0.22em;
  opacity: 0.85;
}

.hero-dots {
  position: absolute;
  bottom: 18px;
  display: flex;
  gap: 10px;
}

.hero-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.85);
  background: transparent;
  cursor: pointer;
  transition: all 0.25s;
}

.hero-dot.on {
  background: #fff;
  transform: scale(1.25);
}

.hero-down {
  position: absolute;
  bottom: 16px;
  right: 26px;
  left: auto;
  transform: none;
  left: 50%;
  transform: translateX(-50%);
  font-size: 21px;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  z-index: 3;
  animation: heroBob 1.8s ease-in-out infinite;
}

@keyframes heroBob {
  50% {
    transform: translateY(8px);
  }
}

.heroFade-enter-active,
.heroFade-leave-active {
  transition: opacity 0.9s ease;
}
.heroFade-enter-from,
.heroFade-leave-to {
  opacity: 0;
}

/* ===== 白卡悬浮层：统一承载正文与侧栏 ===== */
.sheet {
  max-width: 1240px;
  margin: -36px auto 64px;
  padding: 0 24px;
  position: relative;
  z-index: 2;
  background: transparent;
  border: none;
  box-shadow: none;
}

.sheet-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 292px;
  gap: 30px;
  align-items: start;
}

@media (max-width: 960px) {
  .sheet-grid {
    grid-template-columns: 1fr;
  }
  .sheet {
    margin-top: -60px;
    padding: 22px 18px 26px;
  }
}

/* 文章列表 */
.feed-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 20px;
}

.feed-title {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.feed-sub {
  font-size: 12px;
  color: var(--text-3);
  letter-spacing: 0.12em;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  margin-bottom: 16px;
  font-size: 13.5px;
  background: var(--code-bg);
  border-radius: var(--radius-sm);
}

.filter-count {
  font-style: normal;
  color: var(--text-3);
  font-size: 12.5px;
}

.clear-btn {
  border: none;
  background: none;
  color: var(--text-3);
  cursor: pointer;
  font-size: 12.5px;
}

.clear-btn:hover {
  color: var(--accent-deep);
}

.empty {
  padding: 40px;
  text-align: center;
  color: var(--text-3);
}

.brand-wait {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 10px 0 24px;
}

.bw-mark {
  font-family: 'Songti SC', 'Noto Serif SC', serif;
  font-size: 21px;
  font-weight: 900;
  letter-spacing: 0.25em;
  text-indent: 0.25em;
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

.bw-tip {
  font-size: 12.5px;
  color: var(--text-3);
}

/* 骨架 */
.sk-card {
  padding: 18px 22px;
  margin-bottom: 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sk-line {
  height: 14px;
  border-radius: 8px;
  background: linear-gradient(90deg, var(--glass-border) 25%, var(--hover-bg) 50%, var(--glass-border) 75%);
  background-size: 200% 100%;
  animation: skShimmer 1.4s linear infinite;
}

.w30 { width: 30%; }
.w60 { width: 60%; }
.w80 { width: 80%; }
.w90 { width: 90%; }

@keyframes skShimmer {
  to {
    background-position: -200% 0;
  }
}
</style>
