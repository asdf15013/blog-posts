<template>
  <div>
    <!-- 令牌登录 -->
    <div v-if="!token" class="glass admin-card login-card">
      <h2 class="section-title">🎵 资料服务登录</h2>
      <label class="field">
        <span>资料服务访问令牌（与资料管理相同）</span>
        <input v-model="tokenInput" type="password" class="input" placeholder="粘贴令牌…" @keyup.enter="login" />
      </label>
      <button class="btn-primary" :disabled="checking" @click="login">
        {{ checking ? '验证中…' : '验证并进入' }}
      </button>
      <p v-if="loginError" class="error-msg">{{ loginError }}</p>
    </div>

    <div v-else>
      <div class="admin-toolbar">
        <h2 class="section-title">🎵 歌单管理</h2>
        <div class="toolbar-actions">
          <button class="btn-glass" @click="logout">退出</button>
        </div>
      </div>

      <!-- 添加歌曲 -->
      <div class="add-box">
        <div class="mode-tabs">
          <button class="mode-tab" :class="{ on: mode === 'file' }" @click="mode = 'file'">⬆ 上传文件</button>
          <button class="mode-tab" :class="{ on: mode === 'url' }" @click="mode = 'url'">🔗 外链</button>
        </div>

        <div class="add-grid">
          <label class="field">
            <span>歌名 *</span>
            <input v-model="form.title" class="input" placeholder="歌曲名称" />
          </label>
          <label class="field">
            <span>艺术家</span>
            <input v-model="form.artist" class="input" placeholder="演唱者（选填）" />
          </label>

          <template v-if="mode === 'file'">
            <label class="field">
              <span>音频文件（≤50MB，mp3/flac/wav/ogg/m4a/aac 等）</span>
              <input type="file" accept="audio/*,.flac,.mp3,.wav,.ogg,.m4a,.aac,.wma,.ape" class="input" @change="onAudio" />
            </label>
            <label class="field">
              <span>封面图（选填）</span>
              <input type="file" accept="image/*" class="input" @change="onCover" />
            </label>
          </template>
          <template v-else>
            <label class="field">
              <span>音频直链 URL *</span>
              <input v-model="form.src" class="input mono" placeholder="https://…/song.mp3" />
            </label>
            <label class="field">
              <span>封面图 URL（选填）</span>
              <input v-model="form.coverUrl" class="input mono" placeholder="https://…/cover.jpg" />
            </label>
          </template>
        </div>

        <button class="btn-primary" :disabled="busy || !canAdd" @click="addTrack">
          {{ busy ? '处理中…' : '➕ 添加到歌单' }}
        </button>

        <!-- 上传进度：点击添加立即显示（不等第一个进度事件） -->
        <div v-if="busy" class="prog-wrap">
          <div class="prog-bar-bg">
            <div class="prog-bar" :style="{ width: progress.pct + '%' }"></div>
          </div>
          <div class="prog-text">
            <span>{{ progress.pct }}%</span>
            <span>{{ fmtBytes(progress.loaded) }} / {{ fmtBytes(progress.total) }}</span>
            <span v-if="progress.pct >= 100 && progress.total">服务器保存中…</span>
            <span v-else-if="progress.total === 0 && mode === 'file'">准备上传…</span>
            <span v-else-if="progress.speed">{{ fmtSpeed(progress.speed) }}</span>
          </div>
        </div>
        <p v-if="stalled && busy" class="warn-msg">⚠ 上传似乎停滞了——请检查网络连接；若长时间无进展可刷新页面后重试</p>
        <p v-if="addError" class="error-msg">{{ addError }}</p>
      </div>

      <!-- 歌单列表 -->
      <p v-if="loading" class="list-hint">加载中…</p>
      <p v-else-if="!tracks.length" class="list-hint">
        歌单为空——前台左下角播放器只在实际有歌曲时显示，添加并保存后即可出现
      </p>

      <div v-else class="track-list">
        <div v-for="(t, i) in tracks" :key="i" class="track-row glass">
          <img v-if="coverOf(t)" :src="coverOf(t)" class="t-cover" alt="" />
          <div v-else class="t-cover t-cover-def">{{ t.type === 'url' ? '🔗' : '🎵' }}</div>
          <div class="t-info">
            <div class="t-name">{{ t.title }}</div>
            <div class="t-artist">{{ t.artist || '—' }} · {{ t.type === 'url' ? '外链' : '服务器文件' }}</div>
          </div>
          <div class="t-ops">
            <button class="op-btn" :disabled="i === 0" title="上移" @click="move(i, -1)">↑</button>
            <button class="op-btn" :disabled="i === tracks.length - 1" title="下移" @click="move(i, 1)">↓</button>
            <button class="op-btn danger" title="移除" @click="remove(i)">✕</button>
          </div>
        </div>
      </div>

      <div class="save-row">
        <span class="save-tip">{{ dirty ? '有未保存的修改' : '已同步' }}</span>
        <button class="btn-primary" :disabled="!dirty || saving" @click="save">
          {{ saving ? '保存中…' : '💾 保存歌单' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { refreshAdminAuth } from '../../composables/adminAuth'
import { uploadWithProgress, fmtBytes, fmtSpeed } from '../../utils/upload'
import { logOp } from '../../utils/logger'

function logout() {
  localStorage.removeItem('yanqi-res-token')
  token.value = ''
  refreshAdminAuth()
}

const TOKEN_KEY = 'yanqi-res-token'
const token = ref(localStorage.getItem(TOKEN_KEY) || '')
const tokenInput = ref('')
const checking = ref(false)
const loginError = ref('')

const tracks = ref([])
const loading = ref(true)
const dirty = ref(false)
const saving = ref(false)

const mode = ref('file')
const audioFile = ref(null)
const coverFile = ref(null)
const busy = ref(false)
const addError = ref('')
const progress = reactive({ pct: 0, loaded: 0, total: 0, speed: 0 })
const stalled = ref(false)
const form = reactive({ title: '', artist: '', src: '', coverUrl: '' })

const canAdd = computed(() =>
  form.title.trim() && (mode.value === 'url' ? form.src.trim() : audioFile.value),
)

async function login() {
  checking.value = true
  loginError.value = ''
  try {
    const t = tokenInput.value.trim()
    // HTTP 头只允许 ASCII：提前拦下含中文/空白的错误粘贴，给出友好提示
    if (!t || !/^[\x21-\x7e]+$/.test(t)) {
      throw new Error('令牌格式不对——应为纯 ASCII 字符串（检查是否误粘贴了带中文的内容）')
    }
    // 真正的令牌校验：/verify 带鉴权，错误令牌返回 401
    const res = await fetch('/api/res/verify', {
      headers: { Authorization: `Bearer ${t}` },
    })
    if (res.status === 401) throw new Error('令牌无效——请核对资料服务令牌（在服务器 /root/blog-resources/config.json 中）')
    if (!res.ok) throw new Error('资料服务暂时不可达，请稍后再试')
    localStorage.setItem(TOKEN_KEY, tokenInput.value.trim())
    token.value = tokenInput.value.trim()
    tokenInput.value = ''
    refreshAdminAuth()
    await load()
  } catch (e) {
    loginError.value = e.message
  } finally {
    checking.value = false
  }
}

// 令牌失效：清本地坏令牌回登录界面
function handleAuthFailure() {
  localStorage.removeItem(TOKEN_KEY)
  token.value = ''
  refreshAdminAuth()
  return '令牌已失效，请重新登录'
}

async function load() {
  loading.value = true
  try {
    const res = await fetch('/api/music/playlist?t=' + Date.now())
    const data = await res.json()
    tracks.value = data.tracks || []
  } finally {
    loading.value = false
  }
}
onMounted(() => token.value && load())

function onAudio(e) {
  const f = e.target.files?.[0]
  audioFile.value = f || null
  if (f && !form.title) form.title = f.name.replace(/\.[^.]+$/, '')
}

function onCover(e) {
  coverFile.value = e.target.files?.[0] || null
}

async function uploadHidden(file, name) {
  const params = new URLSearchParams({ name, category: 'music', hidden: '1' })
  const startedAt = Date.now()
  const data = await uploadWithProgress(`/api/res/upload?${params}`, file, token.value, {
    onProgress: (loaded, total) => {
      progress.pct = Math.round((loaded / total) * 100)
      progress.loaded = loaded
      progress.total = total
      const secs = (Date.now() - startedAt) / 1000
      progress.speed = secs > 0 ? loaded / secs : 0
      stalled.value = false
    },
    onStall: () => {
      stalled.value = true
    },
  })
  return data.file.id
}

const MUSIC_MAX = 50 * 1024 * 1024

async function addTrack() {
  busy.value = true
  addError.value = ''
  if (mode.value === 'file' && audioFile.value && audioFile.value.size > MUSIC_MAX) {
    busy.value = false
    addError.value = '音频文件超过 50MB 上限'
    return
  }
  progress.pct = 0
  progress.speed = 0
  progress.total = 0
  stalled.value = false
  try {
    if (mode.value === 'file') {
      const fileId = await uploadHidden(audioFile.value, form.title)
      let cover = ''
      if (coverFile.value) {
        const coverId = await uploadHidden(coverFile.value, form.title + '-封面')
        cover = 'res:' + coverId
      }
      tracks.value.push({ type: 'file', fileId, title: form.title, artist: form.artist, cover })
    } else {
      tracks.value.push({
        type: 'url',
        src: form.src.trim(),
        title: form.title,
        artist: form.artist,
        cover: form.coverUrl.trim(),
      })
    }
    dirty.value = true
    form.title = ''
    form.artist = ''
    form.src = ''
    form.coverUrl = ''
    audioFile.value = null
    coverFile.value = null
  } catch (e) {
    addError.value = e.message.includes('未授权') ? handleAuthFailure() : e.message
  } finally {
    busy.value = false
  }
}

function move(i, delta) {
  const j = i + delta
  if (j < 0 || j >= tracks.value.length) return
  const list = tracks.value
  ;[list[i], list[j]] = [list[j], list[i]]
  dirty.value = true
}

function remove(i) {
  tracks.value.splice(i, 1)
  dirty.value = true
}

function coverOf(t) {
  if (!t.cover) return ''
  return t.cover.startsWith('res:') ? '/api/res/download/' + t.cover.slice(4) : t.cover
}

async function save() {
  saving.value = true
  try {
    const res = await fetch('/api/music/playlist', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token.value}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(tracks.value),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `保存失败（${res.status}）`)
    dirty.value = false
    logOp('保存歌单', `共 ${tracks.value.length} 首`)
    // 通知全站播放器立即刷新歌单（SPA 同页签内即时生效）
    window.dispatchEvent(new CustomEvent('playlist-updated'))
  } catch (e) {
    alert(e.message)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.admin-page {
  max-width: 760px;
  margin: 0 auto;
}

.login-card {
  max-width: 440px;
  margin: 20px auto;
  padding: 26px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--text-2);
}

.input {
  padding: 9px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text-1);
  font-size: 14px;
  outline: none;
}

.mono {
  font-family: var(--font-mono);
  font-size: 13px;
}

.input:focus {
  border-color: var(--accent);
}

.error-msg {
  color: #e5484d;
  font-size: 13.5px;
}

.prog-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.prog-bar-bg {
  height: 8px;
  border-radius: 4px;
  background: var(--glass-border);
  overflow: hidden;
}

.prog-bar {
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  box-shadow: 0 0 10px rgba(109, 94, 242, 0.45);
  transition: width 0.2s ease;
}

.prog-text {
  display: flex;
  gap: 14px;
  font-size: 12.5px;
  color: var(--text-3);
  font-family: var(--font-mono);
}

.warn-msg {
  color: #e6a23c;
  font-size: 13px;
  line-height: 1.6;
}

.admin-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.toolbar-actions {
  display: flex;
  gap: 10px;
}

.add-box {
  padding: 18px;
  border: 1px dashed var(--glass-border);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 22px;
}

.mode-tabs {
  display: flex;
  gap: 8px;
}

.mode-tab {
  padding: 7px 18px;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
  background: transparent;
  color: var(--text-2);
  font-size: 13.5px;
  cursor: pointer;
}

.mode-tab.on {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  border-color: transparent;
}

.add-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.btn-primary {
  align-self: flex-start;
  padding: 9px 22px;
  border: none;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.list-hint {
  color: var(--text-3);
  font-size: 14px;
  padding: 14px 0;
}

.track-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.track-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
}

.t-cover {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
}

.t-cover-def {
  display: grid;
  place-items: center;
  background: var(--code-bg);
  font-size: 17px;
}

.t-info {
  flex: 1;
  min-width: 0;
}

.t-name {
  font-size: 14.5px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.t-artist {
  font-size: 12px;
  color: var(--text-3);
  margin-top: 2px;
}

.t-ops {
  display: flex;
  gap: 6px;
}

.op-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid var(--glass-border);
  background: transparent;
  color: var(--text-2);
  cursor: pointer;
  font-size: 13px;
}

.op-btn:hover:not(:disabled) {
  color: var(--accent-deep);
  border-color: var(--accent);
}

.op-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.op-btn.danger:hover {
  color: #e5484d;
  border-color: #e5484d;
}

.save-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 14px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--glass-border);
}

.save-tip {
  font-size: 12.5px;
  color: var(--text-3);
}

@media (max-width: 640px) {
  .add-grid {
    grid-template-columns: 1fr;
  }
}
</style>

.section-title {
  font-size: 20px;
}
