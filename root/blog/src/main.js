import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { codeCopy } from './directives/codeCopy'
import { reveal } from './directives/reveal'
import { lightbox } from './directives/lightbox'
import './styles/main.css'

const app = createApp(App)
app.use(router)
app.directive('code-copy', codeCopy)
app.directive('reveal', reveal)
app.directive('lightbox', lightbox)
app.mount('#app')

// PWA：注册 Service Worker（生产环境）
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

// 🥚 控制台彩蛋
console.log(
  '%c岩栖_shard 的博客',
  'font-size:30px;font-weight:900;padding:8px 20px;border-radius:12px;background:linear-gradient(135deg,#6d5ef2,#3d8bfd);color:#fff;text-shadow:0 2px 8px rgba(109,94,242,.5)',
)
console.log('%c欢迎来到控制台——CTF 选手的老地方 👋', 'color:#8b7bff;font-size:13px')
console.log('%c提示：方向键有时也藏着秘密 ↑ ↑ ↓ ↓ ← → ← → B A', 'color:#5c5f7a;font-size:12px')
console.log('%c以及：在页面上快速打出 f-l-a-g 试试？', 'color:#5c5f7a;font-size:12px')
