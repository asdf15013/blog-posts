<template>
  <nav class="toc">
    <div class="toc-head">
      <span class="toc-title">📖 目录</span>
      <span v-if="progress !== null" class="toc-progress">{{ progress }}%</span>
    </div>
    <ul v-if="toc.length" class="toc-list">
      <li
        v-for="item in toc"
        :key="item.id"
        :class="['toc-item', 'lv' + item.level, { active: item.id === activeId }]"
      >
        <a :href="'#' + item.id" :title="item.text" @click.prevent="jump(item.id)">
          {{ item.text }}
        </a>
      </li>
    </ul>
    <p v-else class="toc-empty">正文没有小节标题</p>
  </nav>
</template>

<script setup>
const props = defineProps({
  toc: { type: Array, default: () => [] },
  activeId: { type: String, default: '' },
  // 显示阅读进度（百分比数字）；传 null 隐藏
  progress: { type: Number, default: null },
})

const emit = defineEmits(['navigate'])

function jump(id) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // 落点标题短暂发光，提示“你到这了”；先移除再强制重排以重启动画
    el.classList.remove('heading-flash')
    void el.offsetWidth
    el.classList.add('heading-flash')
  }
  emit('navigate', id)
}
</script>

<style scoped>
.toc {
  display: flex;
  flex-direction: column;
}

.toc-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
  padding-left: 10px;
  border-left: 3px solid var(--accent);
  font-size: 14px;
  font-weight: 700;
  color: var(--text-1);
}

.toc-progress {
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-mono);
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.toc-list {
  list-style: none;
  max-height: calc(100vh - 240px);
  overflow-y: auto;
  overscroll-behavior: contain;
}

.toc-item {
  position: relative;
  padding: 2px 0;
}

.toc-item a {
  display: block;
  padding: 5px 10px;
  border-radius: var(--radius-sm);
  color: var(--text-2);
  font-size: 13px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s, background 0.2s;
}

.toc-item.lv3 a {
  padding-left: 24px;
  font-size: 12.5px;
}

.toc-item a:hover {
  color: var(--text-1);
  background: var(--hover-bg);
}

/* 当前阅读章节：左侧渐变竖条 + 主题色文字 */
.toc-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 3px;
  border-radius: 2px;
  background: linear-gradient(180deg, var(--accent), var(--accent-2));
}

.toc-item.active a {
  color: var(--accent-deep);
  font-weight: 600;
  background: var(--hover-bg);
}

.toc-empty {
  font-size: 12.5px;
  color: var(--text-3);
}
</style>
