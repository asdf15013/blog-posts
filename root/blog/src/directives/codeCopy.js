// 给 v-html 渲染出的 <pre><code> 代码块注入：复制按钮、行号、超长折叠。
// 用指令而非字符串插件：v-html 内容无法绑定事件，指令可在每次渲染后补挂真实 DOM。

const COLLAPSE_LINES = 20 // 超过此行数自动折叠

function addButtons(el) {
  el.querySelectorAll('pre').forEach((pre) => {
    if (pre.querySelector('.code-copy-btn')) return

    const code = pre.querySelector('code')
    const text = (code || pre).textContent || ''
    const lines = text.replace(/\n$/, '').split('\n').length

    // 行号槽：独立于代码内容渲染，多行高亮 span 不受影响
    if (lines > 1 && code) {
      const gutter = document.createElement('span')
      gutter.className = 'code-gutter'
      gutter.setAttribute('aria-hidden', 'true')
      gutter.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>')
      pre.insertBefore(gutter, pre.firstChild)
      pre.classList.add('has-gutter')
    }

    // 超长折叠
    if (lines > COLLAPSE_LINES) {
      pre.classList.add('collapsed')
      const toggle = document.createElement('button')
      toggle.type = 'button'
      toggle.className = 'code-toggle'
      toggle.textContent = `▸ 展开全部 ${lines} 行`
      toggle.addEventListener('click', () => {
        const collapsed = pre.classList.toggle('collapsed')
        toggle.textContent = collapsed
          ? `▸ 展开全部 ${lines} 行`
          : '▴ 收起代码'
      })
      pre.appendChild(toggle)
    }

    // 复制按钮
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'code-copy-btn'
    btn.textContent = '复制'

    btn.addEventListener('click', async () => {
      const ok = await copyText(text)
      btn.textContent = ok ? '已复制 ✓' : '复制失败'
      btn.classList.add(ok ? 'copied' : 'failed')
      setTimeout(() => {
        btn.textContent = '复制'
        btn.classList.remove('copied', 'failed')
      }, 1600)
    })

    pre.appendChild(btn)
  })
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // 非 https 环境的兜底方案
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.cssText = 'position:fixed;opacity:0'
    document.body.appendChild(ta)
    ta.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      /* ignore */
    }
    ta.remove()
    return ok
  }
}

export const codeCopy = {
  mounted: addButtons,
  updated: addButtons,
}
