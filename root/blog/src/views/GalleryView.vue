<template>
  <div>
    <!-- 类型筛选 -->
    <div class="g-head glass">
      <h1 class="g-title">🖼 图片库</h1>
      <p class="g-sub">共 {{ files.length }} 张 · 全部程序生成 · 存于自有服务器 · 点击放大</p>
      <div class="g-filter">
        <button class="g-chip" :class="{ on: !type }" @click="type = ''">全部</button>
        <button
          v-for="(label, key) in TYPES"
          :key="key"
          class="g-chip"
          :class="{ on: type === key }"
          @click="type = key"
        >
          {{ label }} <em class="g-chip-n">{{ countOf(key) }}</em>
        </button>
      </div>
    </div>

    <p v-if="loading" class="g-hint glass">加载中…</p>
    <p v-else-if="error" class="g-hint glass">{{ error }} <button class="btn-glass" @click="load">重试</button></p>
    <p v-else-if="!filtered.length" class="g-hint glass">还没有图片——后台「图片库」可以导入</p>

    <!-- 瀑布流 -->
    <div v-else class="masonry">
      <figure v-for="(f, i) in filtered" :key="f.id" class="g-item" @click="openBox(i)">
        <!-- 50 张 SVG 总共约 250KB，直接全部加载，避免 columns+lazy 的渲染坑 -->
        <img :src="srcOf(f)" decoding="async" alt="" @error="onImgErr(f, $event)" />
        <figcaption>
          <span class="g-name">{{ familyOf(f.name).label }}</span>
          <span class="g-dl" title="下载原图" @click.stop.prevent="download(f)">⬇</span>
        </figcaption>
      </figure>
    </div>

    <!-- 灯箱 -->
    <Teleport to="body">
      <transition name="lb-fade">
        <div v-if="boxIdx !== null" class="lb-overlay" @click.self="boxIdx = null">
          <button class="lb-x" @click="boxIdx = null">✕</button>
          <button class="lb-nav prev" @click.stop="step(-1)">‹</button>
          <div class="lb-main">
            <img :src="`/api/res/download/${filtered[boxIdx].id}`" alt="" />
            <div class="lb-cap">
              <span>{{ familyOf(filtered[boxIdx].name).label }} · {{ filtered[boxIdx].name }}</span>
              <a class="lb-dl" :href="`/api/res/download/${filtered[boxIdx].id}`" download>⬇ 下载原图</a>
            </div>
          </div>
          <button class="lb-nav next" @click.stop="step(1)">›</button>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

const TYPES = {
  scene: '风景插画',
  star: '星空宇宙',
  ink: '水墨和风',
  geo: '抽象几何',
  grad: '渐变海报',
  pixel: '像素艺术',
  geek: '极客科技',
}

const files = ref([])
const loading = ref(true)
const error = ref('')
const type = ref('')
const boxIdx = ref(null)

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/gallery')
    const data = await res.json()
    files.value = data.files || []
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
onMounted(load)

const filtered = computed(() =>
  type.value ? files.value.filter((f) => familyKey(f.name) === type.value) : files.value,
)

function countOf(key) {
  return files.value.filter((f) => familyKey(f.name) === key).length
}

function familyKey(name) {
  const m = String(name).match(/^gallery-([a-z]+)-/)
  return m ? m[1] : ''
}

function familyOf(name) {
  const k = familyKey(name)
  return { key: k, label: TYPES[k] || '图片' }
}

// src：失败自动重试（换参数绕过中间缓存，最多 2 次）
const retries = reactive({})

function srcOf(f) {
  const n = retries[f.id] || 0
  return `/api/res/download/${f.id}${n ? `?r=${n}` : ''}`
}

function onImgErr(f, e) {
  const n = retries[f.id] || 0
  if (n >= 2) return
  retries[f.id] = n + 1
  e.target.src = srcOf(f)
}

function openBox(i) {
  boxIdx.value = i
}

function step(d) {
  const n = filtered.value.length
  if (!n) return
  boxIdx.value = (boxIdx.value + d + n) % n
}

function download(f) {
  const a = document.createElement('a')
  a.href = `/api/res/download/${f.id}`
  a.download = f.name
  a.click()
}

function onKey(e) {
  if (boxIdx.value === null) return
  if (e.key === 'Escape') boxIdx.value = null
  else if (e.key === 'ArrowLeft') step(-1)
  else if (e.key === 'ArrowRight') step(1)
}
window.addEventListener('keydown', onKey)
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.g-head {
  padding: 24px 28px;
  margin-bottom: 20px;
}

.g-title {
  font-size: 21px;
}

.g-sub {
  margin: 6px 0 14px;
  font-size: 12.5px;
  color: var(--text-3);
}

.g-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.g-chip {
  padding: 5px 14px;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text-2);
  font-size: 12.5px;
}

.g-chip em {
  font-style: normal;
  opacity: 0.65;
  margin-left: 3px;
}

.g-chip.on {
  color: #fff;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  border-color: transparent;
}

.g-hint {
  padding: 36px;
  text-align: center;
  color: var(--text-3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* 瀑布流 */
.masonry {
  columns: 3 260px;
  column-gap: 14px;
}

.g-item {
  break-inside: avoid;
  margin-bottom: 14px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--glass-bg-strong);
  border: 1px solid var(--glass-border);
  cursor: zoom-in;
  position: relative;
}

.g-item img {
  display: block;
  width: 100%;
}

.g-item figcaption {
  display: none;
  position: absolute;
  inset: auto 0 0 0;
  padding: 26px 12px 8px;
  background: linear-gradient(transparent, rgba(10, 12, 24, 0.7));
  color: #fff;
  font-size: 12.5px;
}

.g-item:hover figcaption {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.g-dl {
  cursor: pointer;
}

/* 灯箱 */
.lb-overlay {
  position: fixed;
  inset: 0;
  z-index: 920;
  background: rgba(8, 10, 20, 0.92);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lb-main {
  max-width: 92vw;
  max-height: 86vh;
  text-align: center;
}

.lb-main img {
  max-width: 92vw;
  max-height: 76vh;
  border-radius: var(--radius-md);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
}

.lb-cap {
  margin-top: 14px;
  color: rgba(255, 255, 255, 0.75);
  font-size: 13px;
  display: flex;
  justify-content: center;
  gap: 18px;
  align-items: center;
}

.lb-dl {
  color: #fff;
  text-decoration: underline;
}

.lb-x {
  position: absolute;
  top: 18px;
  right: 20px;
}

.lb-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.lb-x,
.lb-nav {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 20px;
  cursor: pointer;
}

.lb-x {
  font-size: 15px;
}

.lb-nav:hover,
.lb-x:hover {
  background: rgba(109, 94, 242, 0.4);
}

.lb-nav.prev {
  left: 20px;
}
.lb-nav.next {
  right: 20px;
}

.lb-fade-enter-active,
.lb-fade-leave-active {
  transition: opacity 0.3s;
}
.lb-fade-enter-from,
.lb-fade-leave-to {
  opacity: 0;
}
</style>
