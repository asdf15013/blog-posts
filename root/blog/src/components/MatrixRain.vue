<template>
  <Teleport to="body">
    <canvas
      v-if="active"
      ref="canvasEl"
      class="mr-canvas"
      title="再按一次方向键秘籍或点击任意处退出"
      @click="$emit('exit')"
    ></canvas>
  </Teleport>
</template>

<script setup>
// Matrix 数字雨：Konami 秘籍触发，点击/ESC/再输秘籍退出
import { ref, watch, nextTick, onUnmounted } from 'vue'

const props = defineProps({ active: Boolean })
const emit = defineEmits(['exit'])

const canvasEl = ref(null)
let raf = 0
let stopFn = null
let onResize = null

async function start() {
  await nextTick()
  await nextTick()
  const canvas = canvasEl.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  onResize = () => {
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = canvas.offsetHeight * dpr
  }
  onResize()
  window.addEventListener('resize', onResize)

  const CHARS = 'ｱｶｻﾀﾅﾊﾏﾔﾗ01ﾊﾋｼﾃﾆflag{pwn_ctf}'
  const fontSize = 16 * dpr
  const cols = Math.ceil(canvas.width / fontSize)
  const drops = Array.from({ length: cols }, () => Math.random() * -50)

  const draw = () => {
    ctx.fillStyle = 'rgba(5, 12, 8, 0.08)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.font = `${fontSize}px monospace`
    for (let i = 0; i < cols; i++) {
      const ch = CHARS[Math.floor(Math.random() * CHARS.length)]
      const y = drops[i] * fontSize
      ctx.fillStyle = Math.random() > 0.975 ? '#d8ffe8' : '#2ef26e'
      ctx.fillText(ch, i * fontSize, y)
      if (y > canvas.height && Math.random() > 0.976) drops[i] = Math.random() * -20
      drops[i]++
    }
    raf = requestAnimationFrame(draw)
  }
  raf = requestAnimationFrame(draw)

  stopFn = () => {
    cancelAnimationFrame(raf)
    if (onResize) window.removeEventListener('resize', onResize)
  }
}

watch(
  () => props.active,
  (v) => {
    if (v) start()
    else if (stopFn) {
      stopFn()
      stopFn = null
    }
  },
  { immediate: true },
)

onUnmounted(() => stopFn?.())
</script>

<style scoped>
.mr-canvas {
  position: fixed;
  inset: 0;
  z-index: 940;
  width: 100vw;
  height: 100vh;
  background: #040a06;
  cursor: pointer;
  animation: mrIn 0.5s ease;
}

@keyframes mrIn {
  from {
    opacity: 0;
  }
}
</style>
