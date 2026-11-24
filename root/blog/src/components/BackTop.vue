<template>
  <transition name="fade-slide">
    <button v-show="show" class="backtop glass" title="回到顶部" @click="toTop">
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path
          fill="currentColor"
          d="M12 4.6 4.3 12.3a1.1 1.1 0 0 0 1.6 1.6L11 8.8V19a1 1 0 1 0 2 0V8.8l5.1 5.1a1.1 1.1 0 0 0 1.6-1.6L12 4.6Z"
        />
      </svg>
    </button>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const show = ref(false)
let raf = 0

function onScroll() {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    show.value = window.scrollY > window.innerHeight
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (raf) cancelAnimationFrame(raf)
})

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.backtop {
  position: fixed;
  right: 18px;
  bottom: 24px;
  z-index: 240;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: var(--accent-deep);
  transition: transform 0.2s, opacity 0.2s;
}

.backtop:hover {
  transform: translateY(-3px);
  color: var(--text-1);
}
</style>
