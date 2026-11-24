// 图片灯箱：点击容器内图片全屏查看，支持 ← → 切图、Esc/点击背景关闭。
// 用事件委托收集图片，正文 v-html 重渲染后依然有效。

export const lightbox = {
  mounted(el) {
    // 图片懒加载：进入视口前不下载（长教程多图场景收益大）
    el.querySelectorAll('img').forEach((img) => {
      img.loading = 'lazy'
      img.decoding = 'async'
    })
    el.__lbClick = (e) => {
      const img = e.target
      if (!(img instanceof HTMLImageElement)) return
      const list = [...el.querySelectorAll('img')]
      openLightbox(list, list.indexOf(img))
    }
    el.addEventListener('click', el.__lbClick)
  },
  unmounted(el) {
    el.removeEventListener('click', el.__lbClick)
    closeLightbox()
  },
}

let overlay = null
let current = { list: [], index: 0 }
let keyHandler = null

function ensureOverlay() {
  if (overlay) return overlay
  overlay = document.createElement('div')
  overlay.className = 'lb-overlay'
  overlay.innerHTML = `
    <button class="lb-btn lb-close" aria-label="关闭">✕</button>
    <button class="lb-btn lb-prev" aria-label="上一张">‹</button>
    <img class="lb-img" alt="" />
    <button class="lb-btn lb-next" aria-label="下一张">›</button>
    <div class="lb-counter"></div>`
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox()
  })
  overlay.querySelector('.lb-close').addEventListener('click', closeLightbox)
  overlay.querySelector('.lb-prev').addEventListener('click', () => step(-1))
  overlay.querySelector('.lb-next').addEventListener('click', () => step(1))
  document.body.appendChild(overlay)
  return overlay
}

function render() {
  const img = overlay.querySelector('.lb-img')
  const item = current.list[current.index]
  img.src = item.src
  img.alt = item.alt || ''
  overlay.querySelector('.lb-counter').textContent =
    current.list.length > 1 ? `${current.index + 1} / ${current.list.length}` : ''
}

function step(delta) {
  const n = current.list.length
  if (n < 2) return
  current.index = (current.index + delta + n) % n
  render()
}

function openLightbox(list, index) {
  current = { list, index }
  const ov = ensureOverlay()
  render()
  ov.classList.add('open')
  document.body.style.overflow = 'hidden'
  if (!keyHandler) {
    keyHandler = (e) => {
      if (e.key === 'Escape') closeLightbox()
      else if (e.key === 'ArrowLeft') step(-1)
      else if (e.key === 'ArrowRight') step(1)
    }
    document.addEventListener('keydown', keyHandler)
  }
}

function closeLightbox() {
  if (!overlay) return
  overlay.classList.remove('open')
  document.body.style.overflow = ''
  if (keyHandler) {
    document.removeEventListener('keydown', keyHandler)
    keyHandler = null
  }
}
