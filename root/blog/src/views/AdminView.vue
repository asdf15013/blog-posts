<template>
  <div class="admin-page">
    <div class="glass admin-shell">
      <!-- 标签栏 + 连接状态 -->
      <div class="shell-head">
        <div class="shell-tabs">
          <button
            v-for="t in tabs"
            :key="t.id"
            class="shell-tab"
            :class="{ on: tab === t.id }"
            @click="switchTab(t.id)"
          >
            {{ t.icon }} {{ t.name }}
          </button>
        </div>
        <div class="shell-status">
          <span
            class="status-chip"
            :class="ghConnected ? 'ok' : 'off'"
            title="GitHub 令牌（管理文章）"
            @click="!ghConnected && switchTab('posts')"
          >
            GitHub {{ ghConnected ? '✓' : '未连接' }}
          </span>
          <span
            class="status-chip"
            :class="resConnected ? 'ok' : 'off'"
            title="资料服务令牌（管理资料与歌单）"
            @click="!resConnected && switchTab('resources')"
          >
            资料服务 {{ resConnected ? '✓' : '未连接' }}
          </span>
        </div>
      </div>

      <div class="shell-body">
        <AdminDashboard v-if="tab === 'home'" />
        <AdminPosts v-else-if="tab === 'posts'" />
        <AdminResources v-else-if="tab === 'resources'" />
        <AdminMusic v-else-if="tab === 'music'" />
        <AdminLinks v-else-if="tab === 'links'" />
        <AdminGallery v-else-if="tab === 'gallery'" />
        <AdminLogs v-else-if="tab === 'logs'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ghConnected, resConnected, refreshAdminAuth } from '../composables/adminAuth'
import AdminDashboard from '../components/admin/AdminDashboard.vue'
import AdminPosts from '../components/admin/AdminPosts.vue'
import AdminResources from '../components/admin/AdminResources.vue'
import AdminMusic from '../components/admin/AdminMusic.vue'
import AdminLinks from '../components/admin/AdminLinks.vue'
import AdminGallery from '../components/admin/AdminGallery.vue'
import AdminLogs from '../components/admin/AdminLogs.vue'

const route = useRoute()
const router = useRouter()

const tabs = [
  { id: 'home', icon: '📊', name: '概览' },
  { id: 'posts', icon: '📄', name: '文章' },
  { id: 'resources', icon: '📦', name: '资料' },
  { id: 'music', icon: '🎵', name: '歌单' },
  { id: 'links', icon: '🔗', name: '友链' },
  { id: 'gallery', icon: '🖼', name: '图片库' },
  { id: 'logs', icon: '📋', name: '日志' },
]

const tab = computed(() =>
  ['home', 'posts', 'resources', 'music', 'links', 'gallery', 'logs'].includes(route.query.tab)
      ? route.query.tab
      : 'home',
)

function switchTab(id) {
  refreshAdminAuth()
  router.replace({ path: '/admin', query: id === 'home' ? {} : { tab: id } })
}

refreshAdminAuth()
</script>

<style scoped>
.admin-page {
  max-width: 920px;
  margin: 0 auto;
}

.admin-shell {
  padding: 18px 22px 24px;
}

.shell-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  border-bottom: 1px solid var(--glass-border);
  padding-bottom: 14px;
}

.shell-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.shell-tab {
  padding: 8px 20px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-2);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.shell-tab:hover {
  background: var(--hover-bg);
  color: var(--text-1);
}

.shell-tab.on {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  box-shadow: 0 4px 14px rgba(109, 94, 242, 0.35);
}

.shell-status {
  display: flex;
  gap: 8px;
}

.status-chip {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
  cursor: default;
}

.status-chip.ok {
  color: #3aa675;
  border-color: rgba(58, 166, 117, 0.4);
  background: rgba(58, 166, 117, 0.08);
}

.status-chip.off {
  color: #e6a23c;
  border-color: rgba(230, 162, 60, 0.4);
  background: rgba(230, 162, 60, 0.08);
  cursor: pointer;
}

.shell-body {
  padding-top: 18px;
}
</style>
