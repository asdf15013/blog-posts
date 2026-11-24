<template>
  <span class="cu">{{ display }}</span>
</template>

<script setup>
// 数字滚动动画：从 0 滚到目标值
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  value: { type: Number, default: 0 },
  duration: { type: Number, default: 1200 },
})

const display = ref('0')

function animate() {
  const target = props.value || 0
  const start = performance.now()
  const tick = (now) => {
    const t = Math.min(1, (now - start) / props.duration)
    const eased = 1 - Math.pow(1 - t, 3)
    display.value = Math.round(target * eased).toLocaleString()
    if (t < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

onMounted(animate)
watch(() => props.value, animate)
</script>

<style scoped>
.cu {
  font-variant-numeric: tabular-nums;
}
</style>
