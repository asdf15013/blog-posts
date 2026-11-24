<template>
  <div class="layout-two-col">
    <section class="about">
      <!-- 主卡片 -->
      <div v-reveal class="glass about-hero spot">
        <img :src="site.avatar" alt="头像" class="hero-avatar" />
        <h1 class="hero-name">{{ site.name }}</h1>
        <p class="hero-motto">{{ site.motto }}</p>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-num">{{ store.posts.length }}</span>
            <span class="stat-label">文章</span>
          </div>
          <div class="stat">
            <span class="stat-num">{{ tags.length }}</span>
            <span class="stat-label">标签</span>
          </div>
          <div class="stat">
            <span class="stat-num">{{ categories.length }}</span>
            <span class="stat-label">分类</span>
          </div>
        </div>
      </div>

      <!-- 关于我 -->
      <div v-reveal="80" class="glass about-card spot">
        <h2 class="card-title">👋 关于我</h2>
        <p class="card-text">{{ site.bio }}</p>
        <p class="card-text">
          白天写代码，晚上读书，周末爬山。相信「慢慢来，比较快」，
          也相信记录的力量——所以有了这个小站。
        </p>
      </div>

      <!-- 关于本站 -->
      <div v-reveal="160" class="glass about-card spot">
        <h2 class="card-title">🛠 关于本站</h2>
        <ul class="card-list">
          <li>技术栈：<strong>Vue 3 + Vite</strong> + Node 服务，部署在云端</li>
          <li>文章以 <strong>Markdown</strong> 存放于 GitHub 仓库，后台保存即发布</li>
          <li>界面采用<strong>渐变玻璃拟态（Glassmorphism）</strong>风格，支持明暗主题跟随系统</li>
          <li>支持分类、标签、站内搜索、归档时间线与在线后台管理</li>
        </ul>
      </div>

      <!-- 更新日志 -->
      <div v-reveal="240" class="glass about-card spot">
        <h2 class="card-title">🧾 更新日志</h2>
        <div v-for="e in changelog" :key="e.version" class="cl-item">
          <div class="cl-head">
            <span class="cl-version">{{ e.version }}</span>
            <span class="cl-date">{{ e.date }}</span>
          </div>
          <ul class="cl-list">
            <li v-for="(t, i) in e.items" :key="i">{{ t }}</li>
          </ul>
        </div>
      </div>

      <!-- 联系方式 -->
      <div v-reveal="320" class="glass about-card spot">
        <h2 class="card-title">📮 联系我</h2>
        <div class="contact-row">
          <a v-for="s in site.socials" :key="s.name" :href="s.url" class="contact-item">
            {{ s.name }}
          </a>
        </div>
        <p class="card-hint">欢迎交流技术、爬山路线与好书推荐 ✨</p>
      </div>
    </section>

    <SiteSidebar />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SiteSidebar from '../components/SiteSidebar.vue'
import { site } from '../config'
import { store, getAllTags, getAllCategories } from '../posts'
import changelogRaw from '../../CHANGELOG.md?raw'

const tags = computed(() => getAllTags())
const categories = computed(() => getAllCategories())

// 解析 CHANGELOG.md：## 标题为版本，- 列表为条目。改日志文件即自动同步到页面。
const changelog = (() => {
  const entries = []
  for (const line of changelogRaw.split('\n')) {
    const h = line.match(/^## (.+)/)
    if (h) {
      const m = h[1].match(/^([\dv.]+)\s*[（(]([^)）]+)[)）]/)
      entries.push({ version: m?.[1] || h[1], date: m?.[2] || '', items: [] })
    } else if (/^- /.test(line) && entries.length) {
      entries[entries.length - 1].items.push(line.slice(2))
    }
  }
  return entries
})()
</script>

<style scoped>
.about {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.about-hero {
  padding: 44px 32px;
  text-align: center;
}

.hero-avatar {
  width: 104px;
  height: 104px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 28px rgba(109, 94, 242, 0.35);
}

.hero-name {
  margin-top: 16px;
  font-size: 24px;
}

.hero-motto {
  margin-top: 8px;
  color: var(--text-3);
  font-size: 14px;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 44px;
  margin-top: 26px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-num {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.stat-label {
  font-size: 12px;
  color: var(--text-3);
}

.about-card {
  padding: 26px 30px;
}

.card-title {
  font-size: 17px;
  margin-bottom: 14px;
}

.card-text {
  font-size: 14.5px;
  line-height: 1.9;
  color: var(--text-2);
  margin-bottom: 8px;
}

.card-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-list li {
  font-size: 14.5px;
  line-height: 1.8;
  color: var(--text-2);
  padding-left: 18px;
  position: relative;
}

.card-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 11px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
}

.contact-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.contact-item {
  padding: 8px 22px;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
  color: var(--text-1);
  font-size: 14px;
  transition: all 0.2s;
}

.contact-item:hover {
  color: #fff;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  border-color: transparent;
  transform: translateY(-2px);
}

.card-hint {
  margin-top: 16px;
  font-size: 13px;
  color: var(--text-3);
}

/* 更新日志 */
.cl-item + .cl-item {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px dashed var(--glass-border);
}

.cl-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 8px;
}

.cl-version {
  font-size: 15px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.cl-date {
  font-size: 12px;
  color: var(--text-3);
  font-family: var(--font-mono);
}

.cl-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cl-list li {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-2);
  padding-left: 18px;
  position: relative;
}

.cl-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
}
</style>
