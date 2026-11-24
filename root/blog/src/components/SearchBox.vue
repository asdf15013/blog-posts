<template>
  <div ref="rootEl" class="search-box">
    <svg class="search-icon" viewBox="0 0 24 24" width="15" height="15">
      <path
        fill="currentColor"
        d="M10 2a8 8 0 1 0 4.9 14.3l5 5a1.2 1.2 0 0 0 1.7-1.7l-5-5A8 8 0 0 0 10 2Zm0 2.4a5.6 5.6 0 1 1 0 11.2 5.6 5.6 0 0 1 0-11.2Z"
      />
    </svg>
    <input
      v-model="keyword"
      class="search-input"
      type="text"
      placeholder="搜索文章…"
      @focus="open = true"
    />
    <transition name="fade-slide">
      <div v-if="open && keyword.trim()" class="search-dropdown glass">
        <template v-if="results.length">
          <router-link
            v-for="p in results"
            :key="p.slug"
            :to="`/post/${p.slug}`"
            class="search-item"
            @click="reset"
          >
            <div class="search-item-title">{{ p.title }}</div>
            <div class="search-item-meta">{{ p.date }} · {{ p.category }}</div>
          </router-link>
        </template>
        <div v-else class="search-empty">没有找到相关文章</div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { searchPosts } from '../posts'

const keyword = ref('')
const open = ref(false)
const results = ref([])
const rootEl = ref(null)

let searchReqId = 0
watch(keyword, async (kw) => {
  const reqId = ++searchReqId
  if (!kw.trim()) {
    results.value = []
    return
  }
  // 异步服务端搜索：晚到的旧请求丢弃
  const list = await searchPosts(kw)
  if (reqId !== searchReqId) return
  results.value = list.slice(0, 6)
  scheduleSearchLog(kw, results.value.length)
})

// 搜索词上报（800ms 防抖，≥2 字才记）
let searchTimer = null
function scheduleSearchLog(kw, n) {
  clearTimeout(searchTimer)
  const q = kw.trim()
  if (q.length < 2) return
  searchTimer = setTimeout(() => {
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({ type: 'search', q: q.slice(0, 60), detail: n === 0 ? '无结果' : `结果 ${n} 条` }),
    }).catch(() => {})
  }, 800)
}

function reset() {
  keyword.value = ''
  open.value = false
}

function onClickOutside(e) {
  if (rootEl.value && !rootEl.value.contains(e.target)) open.value = false
}

document.addEventListener('click', onClickOutside)
</script>

<style scoped>
.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-3);
  pointer-events: none;
}

.search-input {
  width: 180px;
  padding: 8px 12px 8px 34px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text-1);
  font-size: 13.5px;
  outline: none;
  transition: width 0.3s, border-color 0.2s;
}

.search-input::placeholder {
  color: var(--text-3);
}

.search-input:focus {
  width: 230px;
  border-color: var(--accent);
}

.search-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  width: 300px;
  padding: 8px;
  z-index: 200;
  max-height: 340px;
  overflow-y: auto;
}

.search-item {
  display: block;
  padding: 9px 12px;
  border-radius: var(--radius-sm);
  color: var(--text-1);
}

.search-item:hover {
  background: var(--hover-bg);
}

.search-item-title {
  font-size: 14px;
  font-weight: 600;
}

.search-item-meta {
  font-size: 12px;
  color: var(--text-3);
  margin-top: 2px;
}

.search-empty {
  padding: 16px;
  text-align: center;
  font-size: 13px;
  color: var(--text-3);
}

@media (max-width: 720px) {
  .search-input {
    width: 110px;
  }
  .search-input:focus {
    width: 150px;
  }
}
</style>
