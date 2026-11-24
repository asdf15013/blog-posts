// 上传工具：小文件直传，大文件自动分片（绕过平台单请求体限制）。
// 对调用方暴露统一签名 uploadWithProgress(url, file, token, opts)，组件无感知。
// url 形如 /api/res/upload?name=…&category=…，分片时原查询参数迁移到 chunk-finish。

const CHUNK_SIZE = 16 * 1024 * 1024 // 16MB/片，留足平台 32MB 单请求上限的余量
const CHUNK_RETRIES = 2 // 单片失败重试次数

function xhrSend(url, body, token, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.timeout = 10 * 60 * 1000
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.setRequestHeader('Content-Type', 'application/octet-stream')
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(e.loaded, e.total)
    }
    xhr.onload = () => {
      let data
      try {
        data = JSON.parse(xhr.responseText)
      } catch {
        data = null
      }
      if (xhr.status >= 200 && xhr.status < 300 && data) resolve(data)
      else reject(new Error(data?.error || `上传失败（HTTP ${xhr.status}）`))
    }
    xhr.onerror = () => reject(new Error('网络错误，上传中断'))
    xhr.ontimeout = () => reject(new Error('上传超时，请检查网络'))
    xhr.onabort = () => reject(new Error('上传已取消'))
    xhr.send(body)
  })
}

export async function uploadWithProgress(url, file, token, opts = {}) {
  const { onProgress, onStall } = typeof opts === 'function' ? { onProgress: opts } : opts
  const report = onProgress || (() => {})
  // 停滞看门狗：timer 封闭在闭包内，外部只拿到 touch/stop 两个方法
  const watchdog = (() => {
    let last = Date.now()
    let notified = false
    const timer = setInterval(() => {
      if (!notified && Date.now() - last > 45_000) {
        notified = true
        onStall?.()
      }
    }, 5000)
    return {
      touch: () => {
        last = Date.now()
        notified = false
      },
      stop: () => clearInterval(timer),
    }
  })()

  try {
    let result
    if (file.size <= CHUNK_SIZE) {
      result = await xhrSend(url, file, token, (l, t) => {
        watchdog.touch()
        report(l, t)
      })
    } else {
      // 解析原上传参数，分片传输后由 chunk-finish 携带
      const u = new URL(url, location.origin)
      const params = u.search
      const uid = 'up-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10)
      let done = 0
      const total = file.size
      const chunks = Math.ceil(total / CHUNK_SIZE)
      for (let i = 0; i < chunks; i++) {
        const blob = file.slice(i * CHUNK_SIZE, Math.min((i + 1) * CHUNK_SIZE, total))
        const base = done
        let ok = false
        let lastErr
        for (let attempt = 0; attempt <= CHUNK_RETRIES && !ok; attempt++) {
          try {
            await xhrSend(`/api/res/chunk?uid=${uid}`, blob, token, (l) => {
              watchdog.touch()
              report(base + l, total)
            })
            ok = true
          } catch (e) {
            lastErr = e
            if (e.message.includes('未授权')) throw e // 鉴权问题不重试
          }
        }
        if (!ok) throw lastErr
        done += blob.size
        report(done, total)
      }
      // 合并（无请求体）
      result = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', `/api/res/chunk-finish${params}&uid=${uid}`)
        xhr.timeout = 60_000
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
        xhr.onload = () => {
          let data
          try {
            data = JSON.parse(xhr.responseText)
          } catch {
            data = null
          }
          if (xhr.status >= 200 && xhr.status < 300 && data) resolve(data)
          else reject(new Error(data?.error || `合并失败（HTTP ${xhr.status}）`))
        }
        xhr.onerror = () => reject(new Error('合并请求失败：网络错误'))
        xhr.ontimeout = () => reject(new Error('合并超时，请重试'))
        xhr.send()
      })
    }
    watchdog.stop()
    return result
  } catch (e) {
    watchdog.stop()
    throw e
  }
}

export function fmtBytes(n) {
  if (!n) return '0 B'
  if (n >= 1024 ** 3) return (n / 1024 ** 3).toFixed(2) + ' GB'
  if (n >= 1024 ** 2) return (n / 1024 ** 2).toFixed(1) + ' MB'
  if (n >= 1024) return (n / 1024).toFixed(0) + ' KB'
  return n + ' B'
}

export function fmtSpeed(bytesPerSec) {
  if (!bytesPerSec) return ''
  if (bytesPerSec >= 1024 ** 2) return (bytesPerSec / 1024 ** 2).toFixed(1) + ' MB/s'
  if (bytesPerSec >= 1024) return (bytesPerSec / 1024).toFixed(0) + ' KB/s'
  return bytesPerSec.toFixed(0) + ' B/s'
}
