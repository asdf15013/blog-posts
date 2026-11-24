<template>
  <div>
    <!-- 未登录资料令牌 -->
    <div v-if="!token" class="login-card glass">
      <h2 class="section-title">📋 日志查看登录</h2>
      <label class="field">
        <span>资料服务访问令牌（与资料/歌单管理相同）</span>
        <input v-model="tokenInput" type="password" class="input" placeholder="粘贴令牌…" @keyup.enter="login" />
      </label>
      <button class="btn-primary" :disabled="checking" @click="login">
        {{ checking ? '验证中…' : '验证并进入' }}
      </button>
      <p v-if="loginError" class="error-msg">{{ loginError }}</p>
    </div>

    <div v-else>
      <!-- 统计卡片 -->
      <div class="stat-grid">
        <div class="stat-card glass">
          <div class="stat-num">{{ stats.total }}</div>
          <div class="stat-label">30 天访问量</div>
        </div>
        <div class="stat-card glass">
          <div class="stat-num">{{ stats.today }}</div>
          <div class="stat-label">今日访问</div>
        </div>
        <div v-if="stats.readStats.length" class="stat-card glass wide">
          <div class="stat-title">📖 完读率（读完 ÷ 打开）</div>
          <div v-for="(t, i) in stats.readStats" :key="'r' + i" class="top-row">
            <span class="top-name">{{ i + 1 }}. {{ t.title }}</span>
            <span class="top-count">{{ t.rate }}%（{{ t.done }}/{{ t.opens }}）</span>
          </div>
        </div>
        <div class="stat-card glass wide">
          <div class="stat-title">热门内容 Top {{ stats.top.length }}</div>
          <div v-for="(t, i) in stats.top" :key="i" class="top-row">
            <span class="top-name">{{ i + 1 }}. {{ t.name }}</span>
            <span class="top-count">{{ t.count }} 次</span>
          </div>
          <div v-if="!stats.top.length" class="top-empty">暂无访问数据</div>
        </div>
      </div>

      <!-- 日志筛选 -->
      <div class="log-tabs">
        <button
          v-for="t in tabs"
          :key="t.id"
          class="log-tab"
          :class="{ on: type === t.id }"
          @click="switchType(t.id)"
        >
          {{ t.icon }} {{ t.name }}
        </button>
        <button class="btn-glass refresh" @click="loadAll">↻ 刷新</button>
      </div>

      <p v-if="loading" class="list-hint">加载中…</p>
      <p v-else-if="error" class="list-hint">{{ error }} <button class="btn-glass" @click="loadAll">重试</button></p>
      <p v-else-if="!logs.length" class="list-hint">该分类暂无日志</p>

      <div v-else class="log-list">
        <div v-for="(l, i) in logs" :key="i" class="log-row glass" :class="l.type">
          <span class="log-time">{{ fmtTime(l.t) }}</span>
          <span class="log-type">{{ typeName(l.type) }}</span>
          <span class="log-main">
            <template v-if="l.type === 'access'">
              <strong>{{ l.title || l.path }}</strong>
              <em v-if="l.ref">（来自 {{ shortRef(l.ref) }}）</em>
              <span v-if="l.ip" class="log-geo">{{ flagOf(l.cc) }} {{ l.country || '未知' }} · {{ l.ip }}</span>
            </template>
            <template v-else-if="l.type === 'read'">
              <strong>{{ l.title || l.path }}</strong>
              <em>读到 {{ l.milestone }}%</em>
            </template>
            <template v-else-if="l.type === 'op'">
              <strong>{{ l.action }}</strong> <em v-if="l.detail">{{ l.detail }}</em>
            </template>
            <template v-else>
              <em>{{ l.detail || l.path }}</em>
            </template>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { refreshAdminAuth } from '../../composables/adminAuth'

const TOKEN_KEY = 'yanqi-res-token'
const token = ref(localStorage.getItem(TOKEN_KEY) || '')
const tokenInput = ref('')
const checking = ref(false)
const loginError = ref('')

const tabs = [
  { id: 'access', icon: '👀', name: '访问' },
  { id: 'read', icon: '📖', name: '阅读' },
  { id: 'op', icon: '✍️', name: '操作' },
  { id: 'err', icon: '⚠️', name: '错误' },
]
const type = ref('access')

const logs = ref([])
const stats = reactive({ total: 0, today: 0, top: [], readStats: [] })
const loading = ref(true)
const error = ref('')

async function login() {
  checking.value = true
  loginError.value = ''
  try {
    const t = tokenInput.value.trim()
    if (!t || !/^[\x21-\x7e]+$/.test(t)) throw new Error('令牌格式不对——应为纯 ASCII 字符串')
    const res = await fetch('/api/res/verify', { headers: { Authorization: `Bearer ${t}` } })
    if (res.status === 401) throw new Error('令牌无效——请核对资料服务令牌')
    if (!res.ok) throw new Error('资料服务暂时不可达')
    localStorage.setItem(TOKEN_KEY, t)
    token.value = t
    tokenInput.value = ''
    refreshAdminAuth()
    await loadAll()
  } catch (e) {
    loginError.value = e.message
  } finally {
    checking.value = false
  }
}

function switchType(id) {
  type.value = id
  loadLogs()
}

async function loadLogs() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`/api/logs?type=${type.value}&limit=200`, {
      headers: { Authorization: `Bearer ${token.value}` },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    logs.value = data.logs || []
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function loadStats() {
  try {
    const res = await fetch('/api/logs/stats', {
      headers: { Authorization: `Bearer ${token.value}` },
    })
    if (!res.ok) return
    const data = await res.json()
    stats.total = data.total || 0
    stats.today = data.today || 0
    stats.top = data.top || []
    stats.readStats = (data.readStats || []).filter((r) => r.opens > 0).slice(0, 6)
  } catch {}
}

async function loadAll() {
  await Promise.all([loadLogs(), loadStats()])
}
onMounted(() => token.value && loadAll())

function typeName(t) {
  return { access: '访问', read: '阅读', op: '操作', err: '错误' }[t] || t
}

function fmtTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getMonth() + 1}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

// 两位国家码转国旗 emoji
function flagOf(cc) {
  if (!cc || cc.length !== 2) return '🌐'
  return String.fromCodePoint(...[...cc.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65))
}

function shortRef(ref) {
  try {
    return new URL(ref).hostname
  } catch {
    return ref.slice(0, 30)
  }
}
</script>

<style scoped>
.login-card {
  max-width: 440px;
  margin: 20px auto;
  padding: 26px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 20px;
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
}

.error-msg {
  color: #e5484d;
  font-size: 13.5px;
}

/* 统计卡片 */
.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: 14px;
  margin-bottom: 18px;
}

.stat-card.wide + .stat-card.wide {
  margin-top: 0;
}

.stat-card {
  padding: 18px 20px;
}

.stat-num {
  font-size: 26px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.stat-label {
  font-size: 12px;
  color: var(--text-3);
  margin-top: 4px;
}

.stat-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-2);
  margin-bottom: 8px;
}

.top-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 12.5px;
  padding: 3px 0;
  color: var(--text-2);
}

.top-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.top-count {
  color: var(--accent-deep);
  font-weight: 600;
  flex-shrink: 0;
}

.top-empty {
  font-size: 12.5px;
  color: var(--text-3);
}

/* 筛选与列表 */
.log-tabs {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.log-tab {
  padding: 7px 18px;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
  background: transparent;
  color: var(--text-2);
  font-size: 13.5px;
  cursor: pointer;
}

.log-tab.on {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  border-color: transparent;
}

.refresh {
  margin-left: auto;
  font-size: 13px;
  padding: 7px 16px;
}

.list-hint {
  color: var(--text-3);
  font-size: 14px;
  padding: 14px 0;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.log-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 9px 14px;
  border-radius: var(--radius-sm);
  font-size: 13px;
}

.log-time {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-3);
  flex-shrink: 0;
}

.log-type {
  font-size: 11.5px;
  padding: 1px 9px;
  border-radius: 999px;
  flex-shrink: 0;
  background: var(--code-bg);
  color: var(--accent-deep);
}

.log-row.err .log-type {
  color: #e5484d;
  background: rgba(229, 72, 77, 0.1);
}

.log-main {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-2);
}

.log-main strong {
  color: var(--text-1);
  font-weight: 600;
}

.log-geo {
  margin-left: 10px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--accent-deep);
  background: var(--code-bg);
  border-radius: 6px;
  padding: 1px 8px;
  flex-shrink: 0;
}

.log-main em {
  font-style: normal;
  color: var(--text-3);
  margin-left: 6px;
}

@media (max-width: 720px) {
  .stat-grid {
    grid-template-columns: 1fr 1fr;
  }

  .stat-card.wide {
    grid-column: span 2;
  }
}
</style>
