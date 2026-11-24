<template>
  <button class="theme-toggle" :title="isDark ? '切换到亮色' : '切换到暗色'" @click="onToggle">
    <transition name="icon-fade" mode="out-in">
      <svg v-if="isDark" key="moon" viewBox="0 0 24 24" width="17" height="17">
        <path
          fill="currentColor"
          d="M12.3 2.1a9.9 9.9 0 0 0-2.6.4 10 10 0 0 1 0 19 10 10 0 1 0 2.6-19.4Zm-4 3.3a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm-3 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm2 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm5 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
        />
      </svg>
      <svg v-else key="sun" viewBox="0 0 24 24" width="17" height="17">
        <path
          fill="currentColor"
          d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-13a1 1 0 0 1-1-1V1a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1Zm0 19a1 1 0 0 1-1-1v-2a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1ZM4.2 5.6a1 1 0 0 1 1.4 0 1 1 0 0 1 0 1.4 1 1 0 0 1-1.4-1.4Zm13 13a1 1 0 0 1 1.4 0 1 1 0 0 1-1.4 1.5 1 1 0 0 1 0-1.5ZM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2H2a1 1 0 0 1-1-1Zm19 0a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1ZM4.2 18.4a1 1 0 0 1 0-1.4 1 1 0 0 1 1.4 0 1 1 0 0 1-1.4 1.4Zm13-13a1 1 0 0 1 0-1.4 1 1 0 0 1 1.5 1.4 1 1 0 0 1-1.5 0Z"
        />
      </svg>
    </transition>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '../composables/useTheme'

const { resolvedTheme, toggle } = useTheme()
const isDark = computed(() => resolvedTheme() === 'dark')

// 把点击坐标传给主题切换，作为圆形扩散动画的圆心
function onToggle(e) {
  toggle(e.clientX, e.clientY)
}
</script>

<style scoped>
.theme-toggle {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--accent-deep);
  cursor: pointer;
  transition: all 0.2s;
}

.theme-toggle:hover {
  background: var(--hover-bg);
  transform: rotate(15deg);
}

.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.icon-fade-enter-from,
.icon-fade-leave-to {
  opacity: 0;
  transform: rotate(-90deg) scale(0.6);
}
</style>
