<template>
  <aside class="sidebar">
    <!-- 个人卡片 -->
    <div v-reveal class="glass side-card profile-card spot">
      <img :src="site.avatar" alt="头像" class="avatar" :class="{ 'avatar-spin': avatarSpinning }" style="cursor: pointer" @click="onAvatarEgg" />
      <div class="name">{{ site.name }}</div>
      <div class="motto">{{ site.motto }}</div>
      <div class="socials">
        <a
          v-for="s in site.socials"
          :key="s.name"
          :href="s.url"
          target="_blank"
          rel="noopener"
          class="social-link"
        >
          {{ s.name }}
        </a>
      </div>
    </div>

    <!-- 分类 -->
    <div v-reveal="70" class="glass side-card spot">
      <h3 class="side-title">分类</h3>
      <div class="cat-list">
        <router-link
          v-for="c in categories"
          :key="c.name"
          :to="{ path: '/', query: { cat: c.name } }"
          class="cat-item"
          :class="{ active: route.query.cat === c.name }"
        >
          <span>{{ c.name }}</span>
          <span class="count">{{ c.count }}</span>
        </router-link>
      </div>
    </div>

    <!-- 标签云 -->
    <div v-reveal="140" class="glass side-card spot">
      <h3 class="side-title">标签</h3>
      <div class="tag-cloud">
        <router-link
          v-for="t in tags"
          :key="t.name"
          :to="{ path: '/', query: { tag: t.name } }"
          class="tag"
          :class="{ active: route.query.tag === t.name }"
          :style="{ fontSize: tagFontSize(t.count) + 'px' }"
        >
          {{ t.name }}
        </router-link>
      </div>
    </div>

    <!-- 系列 -->
    <div v-if="seriesList.length" v-reveal="210" class="glass side-card spot">
      <h3 class="side-title">系列专栏</h3>
      <router-link
        v-for="se in seriesList"
        :key="se.name"
        :to="{ path: '/', query: { series: se.name } }"
        class="cat-item"
        :class="{ active: route.query.series === se.name }"
      >
        <span>📚 {{ se.name }}</span>
        <span class="count">{{ se.count }}</span>
      </router-link>
    </div>

    <!-- 订阅 -->
    <div v-reveal class="glass side-card spot subscribe-card">
      <div class="sub-row">
        <div class="sub-info">
          <strong>订阅本站</strong>
          <span>RSS 阅读器订阅，更新即时送达</span>
        </div>
        <a class="sub-rss" href="/rss.xml" target="_blank" rel="noopener" title="RSS 订阅">📡</a>
      </div>
    </div>

    <!-- 最近浏览（仅本浏览器） -->
    <div v-if="history.length" v-reveal class="glass side-card spot">
      <h3 class="side-title">👣 最近浏览</h3>
      <router-link v-for="h in history" :key="h.slug" :to="`/post/${h.slug}`" class="recent-item">
        <div class="recent-title">{{ h.title }}</div>
        <div class="recent-date">{{ fmtAgo(h.at) }}</div>
      </router-link>
    </div>

    <!-- 最新文章 -->
    <div v-reveal="280" class="glass side-card spot">
      <h3 class="side-title">最新文章</h3>
      <router-link v-for="p in recent" :key="p.slug" :to="`/post/${p.slug}`" class="recent-item">
        <div class="recent-title">{{ p.title }}</div>
        <div class="recent-date">{{ p.date }}</div>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '../config'
import { store, getAllTags, getAllCategories } from '../posts'

const route = useRoute()

// 🥚 头像五连击
const avatarSpinning = ref(false)
let avatarClicks = 0
let avatarTimer = 0
function onAvatarEgg() {
  avatarClicks++
  clearTimeout(avatarTimer)
  avatarTimer = setTimeout(() => (avatarClicks = 0), 1500)
  if (avatarClicks >= 5) {
    avatarClicks = 0
    avatarSpinning.value = true
    setTimeout(() => (avatarSpinning.value = false), 1200)
    window.dispatchEvent(new CustomEvent('avatar-egg'))
  }
}
const categories = computed(() => getAllCategories())
const tags = computed(() => getAllTags())
const recent = computed(() => store.posts.slice(0, 5))

// 最近浏览足迹（localStorage，仅本浏览器）
const history = ref([])
function loadHistory() {
  try {
    history.value = JSON.parse(localStorage.getItem('yanqi-history') || '[]').slice(0, 5)
  } catch {
    history.value = []
  }
}
function fmtAgo(ts) {
  const m = Math.round((Date.now() - ts) / 60000)
  if (m < 1) return '刚刚'
  if (m < 60) return m + ' 分钟前'
  const h = Math.round(m / 60)
  if (h < 24) return h + ' 小时前'
  return Math.round(h / 24) + ' 天前'
}
loadHistory()
const onHist = () => loadHistory()
window.addEventListener('history-updated', onHist)
onUnmounted(() => window.removeEventListener('history-updated', onHist))

// 系列聚合（有 series 字段的文章按系列计数）
const seriesList = computed(() => {
  const m = new Map()
  for (const p of store.posts) {
    if (!p.series) continue
    m.set(p.series, (m.get(p.series) || 0) + 1)
  }
  return [...m.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
})

function tagFontSize(count) {
  const max = tags.value[0]?.count || 1
  return 12 + Math.round((count / max) * 4)
}
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 88px;
}

.side-card {
  padding: 20px 22px;
}

.side-title {
  font-size: 15px;
  margin-bottom: 14px;
  padding-left: 10px;
  border-left: 3px solid var(--accent);
  color: var(--text-1);
}

/* 个人卡片 */
.profile-card {
  text-align: center;
}

.avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 6px 20px rgba(109, 94, 242, 0.3);
}

.name {
  margin-top: 12px;
  font-size: 17px;
  font-weight: 700;
}

.motto {
  margin-top: 6px;
  font-size: 13px;
  color: var(--text-3);
}

.socials {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.social-link {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
  color: var(--text-2);
  transition: all 0.2s;
}

.social-link:hover {
  color: #fff;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  border-color: transparent;
}

/* 分类 */
.cat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  margin: 2px 0;
  border-radius: var(--radius-sm);
  color: var(--text-2);
  font-size: 14px;
  transition: all 0.15s;
}

.cat-item:hover {
  background: var(--hover-bg);
  color: var(--text-1);
}

.cat-item.active {
  background: var(--hover-bg);
  color: var(--accent-deep);
  font-weight: 600;
}

.count {
  font-size: 12px;
  color: var(--text-3);
  background: var(--code-bg);
  border-radius: 999px;
  padding: 1px 8px;
}

/* 标签云 */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  color: var(--text-2);
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--code-bg);
  transition: all 0.2s;
}

.tag:hover,
.tag.active {
  color: #fff;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
}

/* 最新文章 */
.recent-item {
  display: block;
  padding: 9px 10px;
  border-radius: var(--radius-sm);
  color: var(--text-1);
}

.recent-item:hover {
  background: var(--hover-bg);
}

.recent-title {
  font-size: 13.5px;
  font-weight: 600;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recent-date {
  font-size: 12px;
  color: var(--text-3);
  margin-top: 2px;
}
</style>

.subscribe-card {
  padding: 16px 20px;
}

.sub-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sub-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
}

.sub-info strong {
  font-size: 14.5px;
}

.sub-info span {
  font-size: 12px;
  color: var(--text-3);
}

.sub-rss {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  font-size: 17px;
  text-decoration: none;
  flex-shrink: 0;
}

.avatar-spin {
  animation: avatarSpin 1.2s cubic-bezier(0.3, 0.7, 0.2, 1);
}

@keyframes avatarSpin {
  from {
    transform: rotate(0) scale(1);
  }
  50% {
    transform: rotate(400deg) scale(1.25);
  }
  to {
    transform: rotate(720deg) scale(1);
  }
}
