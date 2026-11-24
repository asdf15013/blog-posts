<template>
  <div v-if="pageCount > 1" class="pg-bar">
    <span class="pg-info">共 {{ total }} 条 · {{ page }}/{{ pageCount }} 页</span>
    <div class="pg-btns">
      <button class="pg-btn" :disabled="page <= 1" title="上一页" @click="go(page - 1)">‹</button>
      <template v-for="(it, i) in items" :key="i">
        <span v-if="it === '…'" class="pg-ellipsis">…</span>
        <button v-else class="pg-btn" :class="{ on: it === page }" @click="go(it)">{{ it }}</button>
      </template>
      <button class="pg-btn" :disabled="page >= pageCount" title="下一页" @click="go(page + 1)">›</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  page: { type: Number, required: true },
  pageCount: { type: Number, required: true },
  total: { type: Number, default: 0 },
})

const emit = defineEmits(['update:page'])

// 页码窗口：始终显示首尾与当前±1，中间用省略号
const items = computed(() => {
  const n = props.pageCount
  if (n <= 7) return Array.from({ length: n }, (_, i) => i + 1)
  const cur = props.page
  const keep = new Set([1, 2, n - 1, n, cur - 1, cur, cur + 1])
  const out = []
  let prev = 0
  for (let i = 1; i <= n; i++) {
    if (keep.has(i)) {
      if (i - prev > 1) out.push('…')
      out.push(i)
      prev = i
    }
  }
  return out
})

function go(p) {
  if (p >= 1 && p <= props.pageCount && p !== props.page) emit('update:page', p)
}
</script>

<style scoped>
.pg-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
}

.pg-info {
  font-size: 12.5px;
  color: var(--text-3);
}

.pg-btns {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.pg-btn {
  min-width: 34px;
  height: 34px;
  padding: 0 10px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text-2);
  font-size: 13.5px;
  font-family: var(--font-mono);
  cursor: pointer;
  transition: all 0.15s;
}

.pg-btn:hover:not(:disabled) {
  color: var(--text-1);
  background: var(--hover-bg);
  border-color: var(--accent);
}

.pg-btn.on {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  border-color: transparent;
  font-weight: 700;
}

.pg-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.pg-ellipsis {
  align-self: end;
  padding: 0 2px 6px;
  color: var(--text-3);
}
</style>
