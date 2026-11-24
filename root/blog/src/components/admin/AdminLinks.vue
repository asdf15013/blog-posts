<template>
  <div>
    <div class="admin-toolbar">
      <h2 class="section-title">🔗 友链管理</h2>
      <div class="toolbar-actions">
        <button class="btn-primary" @click="add">＋ 添加友链</button>
        <button class="btn-glass" :disabled="!dirty || saving" @click="save">
          {{ saving ? '保存中…' : dirty ? '💾 保存' : '已同步' }}
        </button>
      </div>
    </div>

    <p v-if="loading" class="list-hint">加载中…</p>
    <p v-else-if="!links.length" class="list-hint">还没有友链，点「添加友链」加第一个</p>

    <div v-else class="link-rows">
      <div v-for="(l, i) in links" :key="i" class="link-row glass">
        <img v-if="l.avatar" :src="l.avatar" class="l-avatar" alt="" referrerpolicy="no-referrer" />
        <div v-else class="l-avatar l-avatar-def">🔗</div>
        <div class="l-fields">
          <input v-model="l.name" class="input" placeholder="站点名称" @input="dirty = true" />
          <input v-model="l.url" class="input mono" placeholder="https://…" @input="dirty = true" />
          <input v-model="l.avatar" class="input mono" placeholder="头像 URL（选填）" @input="dirty = true" />
          <input v-model="l.desc" class="input" placeholder="一句话描述" @input="dirty = true" />
        </div>
        <div class="l-ops">
          <button class="op-btn" :disabled="i === 0" @click="move(i, -1)">↑</button>
          <button class="op-btn" :disabled="i === links.length - 1" @click="move(i, 1)">↓</button>
          <button class="op-btn danger" @click="remove(i)">✕</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const links = ref([])
const loading = ref(true)
const dirty = ref(false)
const saving = ref(false)

onMounted(async () => {
  try {
    const res = await fetch('/api/links')
    const data = await res.json()
    links.value = data.links || []
  } finally {
    loading.value = false
  }
})

function add() {
  links.value.push({ name: '', url: '', avatar: '', desc: '' })
  dirty.value = true
}

function move(i, d) {
  const j = i + d
  if (j < 0 || j >= links.value.length) return
  ;[links.value[i], links.value[j]] = [links.value[j], links.value[i]]
  dirty.value = true
}

function remove(i) {
  links.value.splice(i, 1)
  dirty.value = true
}

async function save() {
  saving.value = true
  try {
    const res = await fetch('/api/links', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('yanqi-res-token') || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(links.value),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `保存失败（${res.status}）`)
    dirty.value = false
  } catch (e) {
    alert(e.message)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.admin-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
}

.section-title {
  font-size: 20px;
}

.toolbar-actions {
  display: flex;
  gap: 10px;
}

.btn-primary {
  padding: 9px 20px;
  border: none;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
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

.link-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.link-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
}

.l-avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.l-avatar-def {
  display: grid;
  place-items: center;
  background: var(--code-bg);
}

.l-fields {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1.4fr 1.2fr 1.4fr;
  gap: 8px;
}

.input {
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text-1);
  font-size: 13px;
  outline: none;
  min-width: 0;
}

.mono {
  font-family: var(--font-mono);
  font-size: 12px;
}

.input:focus {
  border-color: var(--accent);
}

.l-ops {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.op-btn {
  width: 28px;
  height: 26px;
  border-radius: 7px;
  border: 1px solid var(--glass-border);
  background: transparent;
  color: var(--text-2);
  cursor: pointer;
  font-size: 12px;
}

.op-btn:hover:not(:disabled) {
  color: var(--accent-deep);
  border-color: var(--accent);
}

.op-btn:disabled {
  opacity: 0.35;
}

.op-btn.danger:hover {
  color: #e5484d;
  border-color: #e5484d;
}

@media (max-width: 760px) {
  .l-fields {
    grid-template-columns: 1fr 1fr;
  }
  .link-row {
    flex-wrap: wrap;
  }
}
</style>
