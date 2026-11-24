<template>
  <!-- 未登录 GitHub：登录表单 -->
  <div v-if="!admin" class="login-card glass">
    <h2 class="section-title">🔐 GitHub 登录（管理文章）</h2>
    <p class="login-hint">
      文章仓库：<strong>{{ cfg.owner ? `${cfg.owner}/${cfg.repo}` : '加载中…' }}</strong>
    </p>

    <label class="field">
      <span>GitHub Token（Fine-grained，需该仓库 Contents 读写权限）</span>
      <input v-model="token" type="password" class="input" placeholder="github_pat_…" @keyup.enter="login" />
    </label>

    <button class="btn-primary" :disabled="loggingIn" @click="login">
      {{ loggingIn ? '验证中…' : '验证并登录' }}
    </button>

    <p v-if="loginError" class="error-msg">{{ loginError }}</p>
    <p class="login-tip">Token 只保存在你的浏览器本地，不会上传到本站服务器。</p>
  </div>

  <!-- 已登录：文章管理 -->
  <div v-else>
    <div class="admin-toolbar">
      <h2 class="section-title">📚 文章管理</h2>
      <div class="toolbar-actions">
        <router-link to="/admin/new" class="btn-primary">＋ 新文章</router-link>
        <button class="btn-glass" @click="logout">退出登录</button>
      </div>
    </div>

    <p v-if="store.loading" class="list-hint">加载中…</p>
    <p v-else-if="store.error" class="list-hint">
      读取失败：{{ store.error }}
      <button class="btn-glass" @click="loadPosts(true)">重试</button>
    </p>
    <p v-else-if="!store.posts.length" class="list-hint">
      仓库里还没有文章，点「新文章」写下第一篇吧 ✍️
    </p>

    <table v-else class="post-table">
      <thead>
        <tr>
          <th>标题</th>
          <th>日期</th>
          <th>分类</th>
          <th class="ops-col">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in paged" :key="p.slug">
          <td class="cell-title">
            <span v-if="p.pinned" class="pin">📌</span>{{ p.title }}
          </td>
          <td class="cell-date">{{ p.date }}</td>
          <td>{{ p.category }}</td>
          <td class="ops-col">
            <router-link :to="`/admin/edit/${p.slug}`" class="op-link">编辑</router-link>
            <router-link :to="`/post/${p.slug}`" class="op-link">查看</router-link>
            <button class="op-link danger" @click="remove(p)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <PaginationBar v-model:page="page" :page-count="pageCount" :total="store.posts.length" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { store, loadPosts } from '../../posts'
import { getAdmin, setAdmin, clearAdmin, validateToken, deletePost, readPost } from '../../utils/github'
import { refreshAdminAuth } from '../../composables/adminAuth'
import PaginationBar from '../PaginationBar.vue'
import { logOp } from '../../utils/logger'

const admin = ref(getAdmin())
const cfg = ref({ owner: '', repo: '', branch: 'main' })
const token = ref('')
const loggingIn = ref(false)
const loginError = ref('')

/* 分页：每页 10 条 */
const PAGE_SIZE = 10
const page = ref(1)
const pageCount = computed(() => Math.max(1, Math.ceil(store.posts.length / PAGE_SIZE)))
const paged = computed(() => store.posts.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))

onMounted(async () => {
  try {
    const res = await fetch('/api/config')
    cfg.value = await res.json()
  } catch {
    /* 保持空值 */
  }
  loadPosts()
})

async function login() {
  if (!token.value.trim()) {
    loginError.value = '请输入 Token'
    return
  }
  loggingIn.value = true
  loginError.value = ''
  try {
    await validateToken(cfg.value.owner, cfg.value.repo, token.value.trim())
    setAdmin({ token: token.value.trim(), owner: cfg.value.owner, repo: cfg.value.repo })
    admin.value = getAdmin()
    token.value = ''
    refreshAdminAuth()
  } catch (e) {
    loginError.value = e.message
  } finally {
    loggingIn.value = false
  }
}

function logout() {
  clearAdmin()
  admin.value = null
  refreshAdminAuth()
}

async function remove(p) {
  if (!confirm(`确定删除《${p.title}》？此操作会从 GitHub 仓库移除该文件，不可撤销。`)) return
  try {
    const info = getAdmin()
    const file = await readPost(info.owner, info.repo, info.token, p.slug)
    if (!file) throw new Error('文件不存在，可能已被删除')
    await deletePost(info.owner, info.repo, info.token, p.slug, file.sha)
    logOp('删除文章', `《${p.title}》`)
    await loadPosts(true)
  } catch (e) {
    alert('删除失败：' + e.message)
  }
}
</script>

<style scoped>
.login-card {
  max-width: 460px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 26px 28px;
}

.section-title {
  font-size: 20px;
}

.login-hint {
  font-size: 14px;
  color: var(--text-2);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13.5px;
  color: var(--text-2);
}

.input {
  padding: 10px 14px;
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

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  border: none;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(109, 94, 242, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-msg {
  color: #e5484d;
  font-size: 13.5px;
}

.login-tip {
  font-size: 12.5px;
  color: var(--text-3);
}

.admin-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
}

.toolbar-actions {
  display: flex;
  gap: 10px;
}

.list-hint {
  color: var(--text-3);
  font-size: 14px;
  padding: 20px 0;
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

.pin {
  margin-right: 6px;
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
  text-decoration: none;
}

.op-link.danger {
  color: #e5484d;
}
</style>
