import { ref } from 'vue'

// 命令面板的全局开关（App 挂载组件，顶栏按钮/快捷键共同控制）
export const paletteOpen = ref(false)

export function openPalette() {
  paletteOpen.value = true
}

export function closePalette() {
  paletteOpen.value = false
}
