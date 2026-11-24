import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        // 框架与业务代码分 chunk：业务更新不失效框架缓存
        manualChunks: {
          vendor: ['vue', 'vue-router'],
        },
      },
    },
  },
})
