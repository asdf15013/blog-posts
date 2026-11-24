<template>
  <div>
    <!-- 令牌登录 -->
    <div v-if="!token" class="glass admin-card login-card">
      <h2 class="section-title">🔑 资料服务登录</h2>
      <label class="field">
        <span>资料服务访问令牌（存于服务器 /root/blog-resources/config.json）</span>
        <input v-model="tokenInput" type="password" class="input" placeholder="粘贴令牌…" @keyup.enter="login" />
      </label>
      <button class="btn-primary" :disabled="loggingIn" @click="login">
        {{ loggingIn ? '验证中…' : '验证并进入' }}
      </button>
      <p v-if="loginError" class="error-msg">{{ loginError }}</p>
      <p class="login-tip">令牌只保存在你的浏览器本地。</p>
    </div>

    <!-- 管理界面 -->
    <div v-else>
      <div class="admin-toolbar">
        <h2 class="section-title">📦 资料管理</h2>
        <div class="toolbar-actions">
          <button class="btn-glass" @click="logout">退出</button>
        </div>
      </div>

      <!-- 上传区 -->
      <div class="upload-box">
        <label class="field">
          <span>文件（≤32MB；更大文件请用 SFTP 放到服务器后联系补录）</span>
          <input type="file" class="input" @change="onFile" />
        </label>
        <div class="upload-grid">
          <label class="field">
            <span>显示名称</span>
            <input v-model="form.name" class="input" placeholder="默认用文件名" />
          </label>
          <label class="field">
            <span>分类</span>
            <input v-model="form.category" class="input" list="res-cats" placeholder="如：CTF" />
            <datalist id="res-cats">
              <option v-for="c in categories" :key="c" :value="c" />
            </datalist>
          </label>
          <label class="field span-2">
            <span>简介</span>
            <input v-model="form.desc" class="input" placeholder="一句话描述（选填）" />
          </label>
        </div>
        <button class="btn-primary" :disabled="!file || uploading" @click="upload">
          {{ uploading ? '上传中…' : '⬆ 上传资料' }}
        </button>

        <!-- 上传进度 -->
        <div v-if="uploading" class="prog-wrap">
          <div class="prog-bar-bg">
            <div class="prog-bar" :style="{ width: progress.pct + '%' }"></div>
          </div>
          <div class="prog-text">
            <span>{{ progress.pct }}%</span>
            <span>{{ fmtBytes(progress.loaded) }} / {{ fmtBytes(progress.total) }}</span>
            <span v-if="progress.pct >= 100">服务器保存中…</span>
            <span v-else-if="progress.speed">{{ fmtSpeed(progress.speed) }}</span>
          </div>
        </div>
        <p v-else-if="uploadSuccess" class="ok-msg">✓ 上传成功</p>
        <p v-if="stalled && uploading" class="warn-msg">⚠ 上传似乎停滞了——请检查网络连接；若长时间无进展可刷新页面后重试</p>
        <p v-if="uploadError" class="error-msg">{{ uploadError }}</p>
      </div>

      <!-- 文件列表 -->
      <p v-if="loading" class="list-hint">加载中…</p>
      <p v-else-if="error" class="list-hint">
        {{ error }} <button class="btn-glass" @click="load">重试</button>
      </p>
      <p v-else-if="!files.length" class="list-hint">还没有资料，上传第一个吧</p>

      <table v-else class="post-table">
        <thead>
          <tr><th>名称</th><th>分类</th><th>大小</th><th>日期</th><th class="ops-col">操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="f in pagedFiles" :key="f.id">
            <td class="cell-title">{{ f.name }}</td>
            <td>{{ f.category }}</td>
            <td>{{ f.sizeText }}</td>
            <td class="cell-date">{{ f.date }}</td>
            <td class="ops-col">
              <button class="op-link" @click="startEdit(f)">编辑</button>
              <button class="op-link danger" @click="remove(f)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>

      <PaginationBar v-model:page="filePage" :page-count="filePageCount" :total="files.length" />
    </div>

    <!-- 行内编辑浮层 -->
    <div v-if="editing" class="edit-mask" @click.self="editing = null">
      <div class="glass edit-box">
        <h2 class="edit-title">编辑资料信息</h2>
        <label class="field"><span>显示名称</span><input v-model="editForm.name" class="input" /></label>
        <label class="field"><span>分类</span><input v-model="editForm.category" class="input" /></label>
        <label class="field"><span>简介</span><input v-model="editForm.desc" class="input" /></label>
        <div class="edit-actions">
          <button class="btn-glass" @click="editing = null">取消</button>
          <button class="btn-primary" @click="saveEdit">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { refreshAdminAuth } from '../../composables/adminAuth'
import { uploadWithProgress, fmtBytes, fmtSpeed } from '../../utils/upload'
import PaginationBar from '../PaginationBar.vue'
import { logOp } from '../../utils/logger'

const TOKEN_KEY = 'yanqi-res-token'
const token = ref(localStorage.getItem(TOKEN_KEY) || '')
const tokenInput = ref('')
const loggingIn = ref(false)
const loginError = ref('')

const files = ref([])
const loading = ref(true)
const error = ref('')

const file = ref(null)
const form = reactive({ name: '', category: '', desc: '' })
const uploading = ref(false)
const uploadError = ref('')
const progress = reactive({ pct: 0, loaded: 0, total: 0, speed: 0 })
const uploadSuccess = ref(false)
const stalled = ref(false)

/* 分页：每页 10 条；上传/删除后自动跳回有内容的页 */
const FILE_PAGE_SIZE = 10
const filePage = ref(1)
const filePageCount = computed(() => Math.max(1, Math.ceil(files.value.length / FILE_PAGE_SIZE)))
const pagedFiles = computed(() =>
  files.value.slice((filePage.value - 1) * FILE_PAGE_SIZE, filePage.value * FILE_PAGE_SIZE),
)

const editing = ref(null)
const editForm = reactive({ name: '', category: '', desc: '' })

const categories = computed(() => [...new Set(files.value.map((f) => f.category))])

function authHeaders() {
  return { Authorization: `Bearer ${token.value}` }
}

async function login() {
  loggingIn.value = true
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
    loggingIn.value = false
  }
}

// 令牌失效（如服务器端已更换）：清掉本地坏令牌，回到登录界面
function handleAuthFailure() {
  localStorage.removeItem(TOKEN_KEY)
  token.value = ''
  refreshAdminAuth()
  return '令牌已失效，请重新登录'
}

function logout() {
  localStorage.removeItem(TOKEN_KEY)
  token.value = ''
  refreshAdminAuth()
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/res/list?t=' + Date.now())
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    files.value = data.files || []
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
onMounted(() => token.value && load())

function onFile(e) {
  const f = e.target.files?.[0]
  file.value = f || null
  if (f && !form.name) form.name = f.name
}

async function upload() {
  if (!file.value) return
  if (file.value.size > 32 * 1024 * 1024) {
    uploadError.value = '资料文件超过 32MB 上限（大文件请用 SFTP 放服务器后补录）'
    return
  }
  uploading.value = true
  uploadError.value = ''
  stalled.value = false
  const startedAt = Date.now()
  const params = new URLSearchParams({
    name: form.name || file.value.name,
    category: form.category || '未分类',
    desc: form.desc || '',
  })
  try {
    const data = await uploadWithProgress(`/api/res/upload?${params}`, file.value, token.value, {
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
    file.value = null
    form.name = ''
    form.desc = ''
    uploadSuccess.value = true
    setTimeout(() => (uploadSuccess.value = false), 2000)
    logOp('上传资料', `${data.file.name}（${data.file.sizeText}）`)
    await load()
  } catch (e) {
    uploadError.value = e.message.includes('未授权') ? handleAuthFailure() : e.message
  } finally {
    uploading.value = false
  }
}

function startEdit(f) {
  editing.value = f
  editForm.name = f.name
  editForm.category = f.category
  editForm.desc = f.desc || ''
}

async function saveEdit() {
  try {
    const res = await fetch(`/api/res/meta/${editing.value.id}`, {
      method: 'PUT',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editForm }),
    })
    if (!res.ok) throw new Error(`保存失败（${res.status}）`)
    editing.value = null
    await load()
  } catch (e) {
    alert(e.message)
  }
}

async function remove(f) {
  if (!confirm(`确定删除「${f.name}」？文件会从服务器移除，不可恢复。`)) return
  try {
    const res = await fetch(`/api/res/del/${f.id}`, { method: 'DELETE', headers: authHeaders() })
    if (!res.ok) throw new Error(`删除失败（${res.status}）`)
    logOp('删除资料', f.name)
    await load()
  } catch (e) {
    alert(e.message)
  }
}
</script>

<style scoped>
.admin-page {
  max-width: 860px;
  margin: 0 auto;
}

.login-card {
  max-width: 460px;
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

.input:focus {
  border-color: var(--accent);
}

.login-tip {
  font-size: 12.5px;
  color: var(--text-3);
}

.error-msg {
  color: #e5484d;
  font-size: 13.5px;
}

.ok-msg {
  color: #3aa675;
  font-size: 13.5px;
}

.warn-msg {
  color: #e6a23c;
  font-size: 13px;
  line-height: 1.6;
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

.upload-box {
  padding: 20px;
  border: 1px dashed var(--glass-border);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 24px;
}

.upload-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.span-2 {
  grid-column: span 2;
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
  padding: 16px 0;
  display: flex;
  gap: 12px;
  align-items: center;
}

.post-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.post-table th {
  text-align: left;
  padding: 10px 12px;
  color: var(--text-3);
  font-weight: 600;
  border-bottom: 1px solid var(--glass-border);
}

.post-table td {
  padding: 11px 12px;
  border-bottom: 1px solid var(--glass-border);
}

.cell-title {
  font-weight: 600;
}

.cell-date {
  color: var(--text-3);
  font-family: var(--font-mono);
  font-size: 13px;
}

.ops-col {
  white-space: nowrap;
  text-align: right;
}

.op-link {
  font-size: 13px;
  margin-left: 12px;
  color: var(--accent-deep);
  background: none;
  border: none;
  cursor: pointer;
}

.op-link.danger {
  color: #e5484d;
}

/* 编辑浮层 */
.edit-mask {
  position: fixed;
  inset: 0;
  z-index: 600;
  background: rgba(10, 10, 24, 0.45);
  backdrop-filter: blur(3px);
  display: grid;
  place-items: center;
  padding: 20px;
}

.edit-box {
  width: min(420px, 100%);
  padding: 26px 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.edit-title {
  font-size: 17px;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 640px) {
  .upload-grid {
    grid-template-columns: 1fr;
  }
  .span-2 {
    grid-column: span 1;
  }
}
</style>

.section-title {
  font-size: 20px;
}
