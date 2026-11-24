<template>
  <!-- 有歌单且未隐藏时显示 -->
  <div v-if="tracks.length" class="music-dock" :class="{ open: panelOpen }">
    <!-- 展开面板 -->
    <transition name="fade-slide">
      <div v-if="panelOpen" class="music-panel glass">
        <div class="mp-head">
          <span class="mp-title">🎵 播放列表</span>
          <span class="mp-count">{{ tracks.length }} 首</span>
        </div>

        <div class="mp-list">
          <div
            v-for="(t, i) in tracks"
            :key="i"
            class="mp-item"
            :class="{ active: i === currentIndex }"
            @click="play(i)"
          >
            <span class="mp-num">{{ i === currentIndex && playing ? '♪' : i + 1 }}</span>
            <span class="mp-name">{{ t.title }}</span>
            <span class="mp-artist">{{ t.artist }}</span>
          </div>
        </div>

        <div class="mp-progress">
          <span class="mp-time">{{ fmt(time) }}</span>
          <input
            class="mp-range"
            type="range"
            min="0"
            :max="duration || 0"
            step="0.1"
            :value="time"
            @input="seek"
          />
          <span class="mp-time">{{ fmt(duration) }}</span>
        </div>

        <div class="mp-volume">
          <span>🔊</span>
          <input
            v-model.number="volume"
            class="mp-range vol"
            type="range"
            min="0"
            max="1"
            step="0.01"
          />
        </div>
      </div>
    </transition>

    <!-- 空闲态：收成小圆钮，不占画面 -->
    <button v-if="idle" class="mb-round glass" title="博客背景音乐" @click="wake">🎵</button>

    <!-- 迷你条（播放中或展开时才出现） -->
    <div v-else class="music-bar glass">
      <div class="mb-cover-wrap" @click="toggle">
        <img v-if="currentCover" :src="currentCover" class="mb-cover" :class="{ spin: playing }" alt="" />
        <div v-else class="mb-cover mb-cover-default" :class="{ spin: playing }">🎵</div>
      </div>
      <div class="mb-info" @click="panelOpen = !panelOpen">
        <div class="mb-name">{{ currentTrack?.title || '未在播放' }}</div>
        <div class="mb-artist">{{ currentTrack?.artist || '点击展开播放列表' }}</div>
      </div>
      <button class="mb-btn" :title="playing ? '暂停' : '播放'" @click="toggle">
        <svg v-if="playing" viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M7 5h4v14H7V5Zm6 0h4v14h-4V5Z" />
        </svg>
        <svg v-else viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M8 5.5v13l11-6.5L8 5.5Z" />
        </svg>
      </button>
      <button class="mb-btn" title="下一首" @click="next">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M5 5.5v13l9-6.5-9-6.5Zm11 0h3v13h-3v-13Z" />
        </svg>
      </button>
      <button class="mb-btn" :title="panelOpen ? '收起' : '展开'" @click="panelOpen = !panelOpen">
        <svg viewBox="0 0 24 24" width="15" height="15">
          <path
            fill="currentColor"
            :d="panelOpen
              ? 'M5 13.4 12 6.4l7 7-1.4 1.4-5.6-5.6-5.6 5.6L5 13.4Z'
              : 'M5 10.6 12 17.6l7-7-1.4-1.4-5.6 5.6-5.6-5.6L5 10.6Z'"
          />
        </svg>
      </button>
    </div>

    <audio
      ref="audioEl"
      @timeupdate="time = $event.target.currentTime"
      @durationchange="duration = $event.target.duration || 0"
      @ended="next"
      @play="playing = true"
      @pause="playing = false"
    ></audio>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tracks = ref([])
const currentIndex = ref(-1)
const playing = ref(false)
const panelOpen = ref(false)
const started = ref(false)
const idle = computed(() => !playing.value && !panelOpen.value && !started.value)

function wake() {
  if (!tracks.value.length) return
  started.value = true
  if (currentIndex.value < 0) play(0)
  else audioEl.value?.play().catch(() => {})
  panelOpen.value = false
}
const audioEl = ref(null)
const time = ref(0)
const duration = ref(0)
const volume = reactive({
  v: Number(localStorage.getItem('yanqi-music-vol') ?? 0.8),
})

// cover 字段支持完整 URL 或 "res:<fileId>"（上传到资料服务的封面）
function resolveCover(c) {
  if (!c) return ''
  if (c.startsWith('res:')) return '/api/res/download/' + c.slice(4)
  return c
}

const currentTrack = computed(() => tracks.value[currentIndex.value] || null)
const currentCover = computed(() => resolveCover(currentTrack.value?.cover))

function trackSrc(t) {
  if (!t) return ''
  return t.type === 'url' ? t.src : `/api/res/download/${t.fileId}`
}

let lastLoadAt = 0
async function load() {
  lastLoadAt = Date.now()
  try {
    const res = await fetch('/api/music/playlist')
    if (!res.ok) return
    const data = await res.json()
    tracks.value = data.tracks || []
    if (currentIndex.value >= tracks.value.length) currentIndex.value = -1
  } catch {
    /* 静默：无歌单则不显示播放器 */
  }
}
onMounted(load)

// SPA 内部切页不重新加载应用：后台加完歌切回前台时，这里负责拿到新歌单
watch(
  () => route.path,
  () => {
    if (Date.now() - lastLoadAt > 8000) load()
  },
)

// 后台保存歌单后的即时广播（同页签立即生效）
function onPlaylistUpdated() {
  load()
}
window.addEventListener('playlist-updated', onPlaylistUpdated)
onUnmounted(() => window.removeEventListener('playlist-updated', onPlaylistUpdated))

function play(i) {
  if (i < 0 || i >= tracks.value.length) return
  currentIndex.value = i
  const audio = audioEl.value
  audio.src = trackSrc(tracks.value[i])
  audio.volume = volume.v
  audio.play().catch(() => {
    /* 浏览器自动播放限制时等用户手动点击 */
  })
}

function toggle() {
  const audio = audioEl.value
  if (!currentTrack.value) {
    play(0)
    return
  }
  playing.value ? audio.pause() : audio.play().catch(() => {})
}

function next() {
  if (!tracks.value.length) return
  play((currentIndex.value + 1) % tracks.value.length)
}

function seek(e) {
  const audio = audioEl.value
  if (audio && Number.isFinite(Number(e.target.value))) {
    audio.currentTime = Number(e.target.value)
    time.value = Number(e.target.value)
  }
}

watch(
  () => volume.v,
  (v) => {
    if (audioEl.value) audioEl.value.volume = v
    localStorage.setItem('yanqi-music-vol', String(v))
  },
)

function fmt(s) {
  if (!Number.isFinite(s) || s < 0) s = 0
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}
</script>

<style scoped>
.music-dock {
  position: fixed;
  left: 18px;
  bottom: 24px;
  z-index: 260;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: calc(100vw - 36px);
}

/* ===== 迷你条 ===== */
.music-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 999px;
}

.mb-cover-wrap {
  cursor: pointer;
  flex-shrink: 0;
}

.mb-cover {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 14px rgba(109, 94, 242, 0.35);
}

.mb-cover-default {
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  font-size: 18px;
}

.mb-cover.spin {
  animation: coverSpin 12s linear infinite;
}

@keyframes coverSpin {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

.mb-info {
  min-width: 0;
  cursor: pointer;
  width: 130px;
}

.mb-name {
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mb-artist {
  font-size: 11.5px;
  color: var(--text-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mb-btn {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--text-2);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
}

.mb-btn:hover {
  background: var(--hover-bg);
  color: var(--accent-deep);
}

.mb-btn:first-of-type {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
}

.mb-btn:first-of-type:hover {
  box-shadow: 0 4px 12px rgba(109, 94, 242, 0.4);
}

/* ===== 面板 ===== */
.music-panel {
  width: 320px;
  max-width: calc(100vw - 36px);
  border-radius: var(--radius-lg);
  padding: 14px 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mp-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.mp-title {
  font-size: 14px;
  font-weight: 700;
}

.mp-count {
  font-size: 12px;
  color: var(--text-3);
}

.mp-list {
  max-height: 220px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mp-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.15s;
}

.mp-item:hover {
  background: var(--hover-bg);
}

.mp-item.active {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
}

.mp-num {
  width: 18px;
  font-size: 12px;
  color: var(--text-3);
  text-align: center;
  flex-shrink: 0;
}

.mp-item.active .mp-num {
  color: rgba(255, 255, 255, 0.85);
}

.mp-name {
  font-size: 13.5px;
  font-weight: 600;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mp-artist {
  font-size: 11.5px;
  color: var(--text-3);
  flex-shrink: 0;
  max-width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mp-item.active .mp-artist {
  color: rgba(255, 255, 255, 0.75);
}

.mp-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mp-time {
  font-size: 11px;
  color: var(--text-3);
  font-family: var(--font-mono);
  flex-shrink: 0;
}

.mp-volume {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.mp-range {
  flex: 1;
  height: 4px;
  appearance: none;
  border-radius: 2px;
  background: var(--glass-border);
  outline: none;
  cursor: pointer;
}

.mp-range::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  cursor: pointer;
}

.mp-range::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border: none;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
}

.mb-round {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  font-size: 19px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(109, 94, 242, 0.4);
  animation: mbPulse 3s ease-in-out infinite;
}

@keyframes mbPulse {
  50% {
    box-shadow: 0 6px 26px rgba(109, 94, 242, 0.6);
  }
}

@media (max-width: 640px) {
  .mb-info {
    width: 90px;
  }
}
</style>
