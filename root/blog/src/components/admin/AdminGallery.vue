<template>
  <div>
    <div class="admin-toolbar">
      <h2 class="section-title">🖼 图片库管理</h2>
      <div class="toolbar-actions">
        <button class="btn-glass" :disabled="!dirty || saving" @click="noop">
          {{ dirty ? '有未保存删除' : '已同步' }}
        </button>
      </div>
    </div>

    <!-- 导入 -->
    <div class="upload-box">
      <label class="field">
        <span>导入图片（支持多选；SVG/PNG/JPG/WebP，单张 ≤32MB）</span>
        <input type="file" multiple accept="image/*,.svg" class="input" @change="onFiles" />
      </label>
      <div v-if="uploading" class="prog-wrap">
        <div class="prog-bar-bg"><div class="prog-bar" :style="{ width: progress.pct + '%' }"></div></div>
        <div class="prog-text">
          <span>{{ progress.pct }}%</span>
          <span>{{ idx + 1 }}/{{ filesToUpload.length }} · {{ filesToUpload[idx]?.name }}</span>
        </div>
      </div>
      <p v-if="upErr" class="error-msg">⚠ {{ upErr }}</p>
      <p v-if="upOk" class="ok-tip">✓ 导入完成</p>
    </div>

    <p v-if="loading" class="list-hint">加载中…</p>
    <p v-else-if="!imgs.length" class="list-hint">图片库为空，上面导入即可</p>

    <div v-else class="g-grid">
      <div v-for="f in imgs" :key="f.id" class="g-card glass">
        <img :src="`/api/res/download/${f.id}`" loading="lazy" alt="" />
        <div class="g-meta">
          <span class="g-n">{{ f.name }}</span>
          <span class="g-s">{{ f.sizeText }}</span>
        </div>
        <button class="del" title="删除" @click="remove(f)">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { uploadWithProgress, fmtBytes } from '../../utils/upload'

const TOKEN_KEY = 'yanqi-res-token'
const imgs = ref([])
const loading = ref(true)
const dirty = ref(false)
const saving = ref(false)
const filesToUpload = ref([])
const idx = ref(0)
const uploading = ref(false)
const upErr = ref('')
const upOk = ref(false)
const progress = reactive({ pct: 0 })

function auth() {
  return { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY) || ''}` }
}

async function load() {
  loading.value = true
  try {
    const res = await fetch('/api/gallery?t=' + Date.now())
    const data = await res.json()
    imgs.value = data.files || []
  } finally {
    loading.value = false
  }
}
onMounted(load)

function onFiles(e) {
  filesToUpload.value = [...(e.target.files || [])]
  if (filesToUpload.value.length) uploadAll()
}

async function uploadAll() {
  uploading.value = true
  upErr.value = ''
  upOk.value = false
  try {
    for (let i = 0; i < filesToUpload.value.length; i++) {
      idx.value = i
      const f = filesToUpload.value[i]
      const params = new URLSearchParams({ name: f.name, category: 'gallery', hidden: '1' })
      await uploadWithProgress(`/api/res/upload?${params}`, f, auth().Authorization.slice(7), {
        onProgress: (l, t) => (progress.pct = Math.round((l / t) * 100)),
      })
    }
    upOk.value = true
    setTimeout(() => (upOk.value = false), 2000)
    await load()
  } catch (e) {
    upErr.value = e.message
  } finally {
    uploading.value = false
    filesToUpload.value = []
  }
}

async function remove(f) {
  if (!confirm(`删除「${f.name}」？不可恢复。`)) return
  try {
    const res = await fetch(`/api/res/del/${f.id}`, { method: 'DELETE', headers: auth() })
    if (!res.ok) throw new Error(`删除失败（${res.status}）`)
    await load()
  } catch (e) {
    alert(e.message)
  }
}

function noop() {}
</script>

<style scoped>
.admin-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.section-title {
  font-size: 20px;
}

.toolbar-actions {
  display: flex;
  gap: 10px;
}

.btn-glass {
  padding: 7px 16px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text-3);
  font-size: 12.5px;
}

.upload-box {
  padding: 18px;
  border: 1px dashed var(--glass-border);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 22px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--text-2);
}

.input {
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text-1);
  font-size: 13.5px;
}

.error-msg {
  color: #e5484d;
  font-size: 13.5px;
}

.ok-tip {
  color: #3aa675;
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
  transition: width 0.2s ease;
}

.prog-text {
  display: flex;
  gap: 14px;
  font-size: 12.5px;
  color: var(--text-3);
  font-family: var(--font-mono);
}

.list-hint {
  color: var(--text-3);
  font-size: 14px;
  padding: 14px 0;
}

.g-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.g-card {
  position: relative;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  overflow: hidden;
  background: var(--glass-bg-strong);
}

.g-card img {
  display: block;
  width: 100%;
  height: 110px;
  object-fit: cover;
}

.g-meta {
  padding: 8px 10px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 11px;
  color: var(--text-3);
}

.g-n {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.del {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  border: none;
  background: rgba(229, 72, 77, 0.85);
  color: #fff;
  font-size: 12px;
  cursor: pointer;
}
</style>
