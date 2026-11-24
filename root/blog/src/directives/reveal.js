// 滚动渐显：元素进入视口时浮升出现，一次性触发后即还原（避免残留 transition 干扰悬停效果）
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const reveal = {
  mounted(el, binding) {
    if (reduced) return
    el.classList.add('reveal')
    const delay = Math.min(Number(binding.value) || 0, 600)
    if (delay) el.style.transitionDelay = delay + 'ms'

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        el.classList.add('visible')
        // 动画结束后摘掉渐显类，让元素自己（如卡片的悬停上浮）接管 transform/transition
        const cleanup = () => {
          el.classList.remove('reveal', 'visible')
          el.style.transitionDelay = ''
        }
        el.addEventListener('transitionend', cleanup, { once: true })
        setTimeout(cleanup, delay + 800)
      },
      { threshold: 0.08 },
    )
    io.observe(el)
    el.__revealIO = io
  },
  unmounted(el) {
    el.__revealIO?.disconnect()
  },
}
