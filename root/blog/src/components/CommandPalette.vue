<template>
  <Teleport to="body">
    <transition name="fade-slide">
      <div v-if="paletteOpen" class="cp-overlay" @click.self="close">
        <div class="cp-panel glass">
          <div class="cp-input-row">
            <svg viewBox="0 0 24 24" width="16" height="16" class="cp-search-icon">
              <path
                fill="currentColor"
                d="M10 2a8 8 0 1 0 4.9 14.3l5 5a1.2 1.2 0 0 0 1.7-1.7l-5-5A8 8 0 0 0 10 2Zm0 2.4a5.6 5.6 0 1 1 0 11.2 5.6 5.6 0 0 1 0-11.2Z"
              />
            </svg>
            <input
              ref="inputEl"
              v-model="q"
              class="cp-input"
              type="text"
              placeholder="搜索文章、工具、页面，或执行动作…"
              @keydown="onKey"
            />
            <kbd class="cp-kbd">Esc</kbd>
          </div>

          <div class="cp-list">
            <template v-for="g in groups" :key="g.name">
              <div v-if="g.items.length" class="cp-group">{{ g.name }}</div>
              <button
                v-for="item in g.items"
                :key="item.key"
                class="cp-item"
                :class="{ active: item.key === activeKey }"
                @click="run(item)"
                @mouseenter="activeKey = item.key"
              >
                <span class="cp-icon">{{ item.icon }}</span>
                <span class="cp-label">{{ item.label }}</span>
                <span v-if="item.hint" class="cp-hint">{{ item.hint }}</span>
              </button>
            </template>
            <div v-if="!flat.length" class="cp-empty">没有匹配项，换个关键词试试</div>
          </div>

          <div class="cp-foot">↑↓ 选择 · Enter 打开 · Esc 关闭</div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { paletteOpen, closePalette } from '../composables/palette'
import { store } from '../posts'
import { useTheme } from '../composables/useTheme'

const router = useRouter()
const { toggle } = useTheme()

const q = ref('')
const inputEl = ref(null)
const activeKey = ref('')

// 工具清单与 ToolsView 共享一份元数据（直达深链 /tools?t=xx）
import { ALL_TOOLS } from '../utils/toolsMeta'

const TOOLS = ALL_TOOLS

const PAGES = [
  { icon: '🏠', label: '首页', to: '/' },
  { icon: '🗂', label: '归档', to: '/archive' },
  { icon: '🧰', label: '工具', to: '/tools' },
  { icon: '📦', label: '资料下载', to: '/resources' },
  { icon: '🖼', label: '图片库', to: '/gallery' },
  { icon: '👤', label: '关于', to: '/about' },
]

const allItems = computed(() => [
  ...store.posts.map((p) => ({
    key: 'post-' + p.slug,
    group: '文章',
    icon: '📄',
    label: p.title,
    hint: p.category + ' · ' + p.date,
    keywords: [p.title, p.category, ...p.tags].join(' ').toLowerCase(),
    action: () => router.push('/post/' + p.slug),
  })),
  ...TOOLS.map((t) => ({
    key: 'tool-' + t.id,
    group: '工具',
    icon: t.icon,
    label: t.name,
    hint: '工具页',
    keywords: (t.name + ' tool ' + t.id).toLowerCase(),
    action: () => router.push({ path: '/tools', query: { t: t.id } }),
  })),
  ...PAGES.map((p) => ({
    key: 'page-' + p.label,
    group: '页面',
    icon: p.icon,
    label: p.label,
    keywords: ('页面 ' + p.label).toLowerCase(),
    action: () => router.push(p.to),
  })),
  {
    key: 'act-theme',
    group: '动作',
    icon: '🌗',
    label: '切换明暗主题',
    hint: '动作',
    keywords: '主题 theme 暗色 亮色 dark light'.toLowerCase(),
    action: () => toggle(),
  },
  {
    key: 'act-random',
    group: '动作',
    icon: '🎲',
    label: '随机读一篇文章',
    hint: '动作',
    keywords: '随机 random 文章'.toLowerCase(),
    action: () => {
      if (!store.posts.length) return
      const p = store.posts[Math.floor(Math.random() * store.posts.length)]
      router.push('/post/' + p.slug)
    },
  },
  {
    key: 'act-rss',
    group: '动作',
    icon: '📡',
    label: '打开 RSS 订阅',
    hint: '/rss.xml',
    keywords: 'rss 订阅 feed'.toLowerCase(),
    action: () => window.open('/rss.xml', '_blank'),
  },
])

const groups = computed(() => {
  const kw = q.value.trim().toLowerCase()
  const hit = kw ? allItems.value.filter((i) => i.keywords.includes(kw)) : allItems.value
  const order = ['文章', '工具', '页面', '动作']
  return order
    .map((name) => ({ name, items: hit.filter((i) => i.group === name).slice(0, name === '文章' ? 8 : 10) }))
    .filter((g) => g.items.length)
})

const flat = computed(() => groups.value.flatMap((g) => g.items))

watch(flat, (list) => {
  if (!list.some((i) => i.key === activeKey.value)) activeKey.value = list[0]?.key || ''
})

watch(paletteOpen, async (open) => {
  if (open) {
    q.value = ''
    await nextTick()
    inputEl.value?.focus()
  }
})

function run(item) {
  closePalette()
  item.action()
}

function onKey(e) {
  if (e.key === 'Escape') {
    closePalette()
  } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    if (!flat.value.length) return
    const idx = flat.value.findIndex((i) => i.key === activeKey.value)
    const next = e.key === 'ArrowDown' ? Math.min(idx + 1, flat.value.length - 1) : Math.max(idx - 1, 0)
    activeKey.value = flat.value[next].key
    // 保持激活项可见
    document.querySelector('.cp-item.active')?.scrollIntoView({ block: 'nearest' })
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const item = flat.value.find((i) => i.key === activeKey.value)
    if (item) run(item)
  }
}

function close() {
  closePalette()
}
</script>

<style scoped>
.cp-overlay {
  position: fixed;
  inset: 0;
  z-index: 800;
  background: rgba(10, 10, 24, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 12vh 20px 20px;
}

.cp-panel {
  width: min(620px, 100%);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 62vh;
}

.cp-input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--glass-border);
}

.cp-search-icon {
  color: var(--text-3);
  flex-shrink: 0;
}

.cp-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-1);
  font-size: 15.5px;
}

.cp-input::placeholder {
  color: var(--text-3);
}

.cp-kbd {
  font-size: 11px;
  color: var(--text-3);
  border: 1px solid var(--glass-border);
  border-radius: 5px;
  padding: 2px 7px;
  font-family: var(--font-mono);
}

.cp-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.cp-group {
  font-size: 11.5px;
  color: var(--text-3);
  padding: 10px 12px 4px;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.cp-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  text-align: left;
  padding: 9px 12px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-1);
  font-size: 14px;
  cursor: pointer;
}

.cp-item.active {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
}

.cp-icon {
  flex-shrink: 0;
  width: 20px;
  text-align: center;
}

.cp-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cp-hint {
  font-size: 12px;
  color: var(--text-3);
  flex-shrink: 0;
}

.cp-item.active .cp-hint {
  color: rgba(255, 255, 255, 0.75);
}

.cp-empty {
  padding: 28px;
  text-align: center;
  color: var(--text-3);
  font-size: 13.5px;
}

.cp-foot {
  padding: 10px 18px;
  border-top: 1px solid var(--glass-border);
  font-size: 12px;
  color: var(--text-3);
}
</style>
