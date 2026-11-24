<template>
  <div class="layout-two-col">
    <section class="links-list">
      <div class="links-head glass">
        <h1 class="links-title">🔗 友情链接</h1>
        <p class="links-sub">朋友的站点 · 欢迎互换（联系我即可）</p>
      </div>

      <p v-if="loading" class="links-hint glass">加载中…</p>
      <div v-else-if="!links.length" class="links-hint glass">
        还没有友链——想交换的朋友联系我吧 🤝
      </div>

      <a
        v-for="(l, i) in links"
        :key="i"
        v-reveal="Math.min(i, 5) * 60"
        :href="l.url"
        target="_blank"
        rel="noopener"
        class="link-card glass spot"
      >
        <img v-if="l.avatar" :src="l.avatar" class="link-avatar" alt="" referrerpolicy="no-referrer" />
        <div v-else class="link-avatar link-avatar-def">🔗</div>
        <div class="link-info">
          <div class="link-name">{{ l.name }}</div>
          <p class="link-desc">{{ l.desc || '这个朋友很懒，什么都没写' }}</p>
        </div>
        <span class="link-arrow">→</span>
      </a>
    </section>

    <SiteSidebar />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SiteSidebar from '../components/SiteSidebar.vue'

const links = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch('/api/links')
    const data = await res.json()
    links.value = data.links || []
  } catch {
    /* 静默 */
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.links-head {
  padding: 26px 30px;
  margin-bottom: 18px;
}

.links-title {
  font-size: 22px;
}

.links-sub {
  margin-top: 6px;
  font-size: 13px;
  color: var(--text-3);
}

.links-hint {
  padding: 40px;
  text-align: center;
  color: var(--text-3);
}

.link-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 24px;
  color: var(--text-1);
  transition: transform var(--transition), box-shadow var(--transition);
}

.link-card + .link-card {
  margin-top: 14px;
}

.link-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 36px rgba(80, 70, 170, 0.2);
}

.link-avatar {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  object-fit: cover;
  flex-shrink: 0;
}

.link-avatar-def {
  display: grid;
  place-items: center;
  background: var(--code-bg);
  font-size: 20px;
}

.link-info {
  flex: 1;
  min-width: 0;
}

.link-name {
  font-size: 16px;
  font-weight: 700;
}

.link-desc {
  margin-top: 4px;
  font-size: 13px;
  color: var(--text-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-arrow {
  color: var(--text-3);
  transition: transform 0.2s, color 0.2s;
}

.link-card:hover .link-arrow {
  transform: translateX(4px);
  color: var(--accent-deep);
}
</style>
