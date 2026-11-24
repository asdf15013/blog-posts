import { ref, onMounted, onUnmounted } from 'vue'

const STORAGE_KEY = 'yanqi-theme-preference'

// 'auto' | 'light' | 'dark'：auto 表示跟随系统
const preference = ref(localStorage.getItem(STORAGE_KEY) || 'auto')
const systemDark = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)
const media = window.matchMedia('(prefers-color-scheme: dark)')

function resolvedTheme() {
  return preference.value === 'auto' ? (systemDark.value ? 'dark' : 'light') : preference.value
}

function apply() {
  document.documentElement.dataset.theme = resolvedTheme()
}

function onMediaChange(e) {
  systemDark.value = e.matches
  apply()
}

media.addEventListener('change', onMediaChange)

export function useTheme() {
  onMounted(apply)
  onUnmounted(() => media.removeEventListener('change', onMediaChange))

  // x/y 为触发按钮的屏幕坐标，用于圆形扩散的圆心；不支持 View Transitions 时瞬时切换
  function toggle(x, y) {
    // 当前实际是深色就切到亮色，反之亦然；并记住用户选择
    const next = resolvedTheme() === 'dark' ? 'light' : 'dark'
    preference.value = next
    localStorage.setItem(STORAGE_KEY, next)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const doApply = () => {
      document.documentElement.dataset.theme = next
    }
    if (typeof x !== 'number' || !document.startViewTransition || reduce) {
      doApply()
      return
    }
    const vt = document.startViewTransition(doApply)
    vt.ready
      .then(() => {
        const radius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y),
        )
        document.documentElement.animate(
          {
            clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
          },
          { duration: 480, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' },
        )
      })
      .catch(() => {
        /* 过渡被中断时无需处理，主题已切换 */
      })
  }

  return { preference, resolvedTheme, toggle }
}
