<template>
  <div class="layout-two-col">
    <section class="res-list">
      <div class="res-head glass">
        <h1 class="res-title">📦 资料下载</h1>
        <p class="res-sub">学习资料与工具包 · 点击即可下载</p>
        <div v-if="categories.length" class="res-filter">
          <button class="chip" :class="{ on: !activeCat }" @click="activeCat = ''">全部</button>
          <button
            v-for="c in categories"
            :key="c"
            class="chip"
            :class="{ on: activeCat === c }"
            @click="activeCat = c"
          >
            {{ c }}
          </button>
        </div>
      </div>

      <p v-if="loading" class="res-hint glass">资料加载中…</p>
      <div v-else-if="error" class="res-hint glass">
        <p>{{ error }}</p>
        <button class="btn-glass" @click="load">重试</button>
      </div>
      <div v-else-if="!filtered.length" class="res-hint glass">
        {{ files.length ? '该分类下暂无资料' : '还没有上传任何资料' }}
      </div>

      <div v-for="(f, i) in paged" :key="f.id" v-reveal="Math.min(i, 5) * 60" class="res-card glass spot">
        <div class="res-icon">{{ iconFor(f) }}</div>
        <div class="res-info">
          <div class="res-name">{{ f.name }}</div>
          <p class="res-desc">{{ f.desc || '暂无简介' }}</p>
          <div class="res-meta">
            <span class="chip">{{ f.category }}</span>
            <span>📅 {{ f.date }}</span>
            <span>💾 {{ f.sizeText }}</span>
          </div>
        </div>
        <a class="res-dl" :href="`/api/res/download/${f.id}`" download>⬇ 下载</a>
      </div>

      <PaginationBar v-model:page="page" :page-count="pageCount" :total="filtered.length" />
    </section>

    <SiteSidebar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import SiteSidebar from '../components/SiteSidebar.vue'
import PaginationBar from '../components/PaginationBar.vue'

const files = ref([])
const loading = ref(true)
const error = ref('')
const activeCat = ref('')

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
onMounted(load)

const categories = computed(() => [...new Set(files.value.map((f) => f.category))])

const filtered = computed(() =>
  activeCat.value ? files.value.filter((f) => f.category === activeCat.value) : files.value,
)

/* 分页：每页 10 条；分类切换回到第 1 页 */
const PAGE_SIZE = 10
const page = ref(1)
const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))
const paged = computed(() => filtered.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))
watch(activeCat, () => (page.value = 1))

function iconFor(f) {
  const ext = f.name.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return '📕'
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return '🗜'
  if (['doc', 'docx'].includes(ext)) return '📘'
  if (['xls', 'xlsx', 'csv'].includes(ext)) return '📗'
  if (['ppt', 'pptx'].includes(ext)) return '📙'
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return '🖼'
  if (['mp4', 'mkv', 'avi'].includes(ext)) return '🎬'
  if (['mp3', 'wav', 'flac'].includes(ext)) return '🎵'
  if (['c', 'cpp', 'py', 'js', 'java', 'zip2'].includes(ext) || !ext) return '📎'
  return '📄'
}
</script>

<style scoped>
.res-head {
  padding: 26px 30px;
  margin-bottom: 18px;
}

.res-title {
  font-size: 22px;
}

.res-sub {
  margin: 6px 0 14px;
  font-size: 13px;
  color: var(--text-3);
}

.res-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.res-filter .chip.on {
  color: #fff;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
}

.res-hint {
  padding: 40px;
  text-align: center;
  color: var(--text-3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.res-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 20px 24px;
  color: var(--text-1);
  transition: transform var(--transition), box-shadow var(--transition);
}

.res-card + .res-card {
  margin-top: 14px;
}

.res-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 36px rgba(80, 70, 170, 0.2);
}

.res-icon {
  font-size: 30px;
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  border-radius: var(--radius-md);
  background: var(--code-bg);
}

.res-info {
  flex: 1;
  min-width: 0;
}

.res-name {
  font-size: 16px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.res-desc {
  margin: 5px 0 8px;
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.res-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: var(--text-3);
}

.res-dl {
  flex-shrink: 0;
  padding: 9px 20px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  font-size: 13.5px;
  font-weight: 600;
  transition: all 0.2s;
}

.res-dl:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(109, 94, 242, 0.4);
}

@media (max-width: 640px) {
  .res-card {
    flex-wrap: wrap;
  }
  .res-dl {
    width: 100%;
    text-align: center;
  }
}
</style>
