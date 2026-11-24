// 轻量埋点：访问日志（路由切换）与后台操作日志。fire-and-forget，失败静默。

export function logAccess(path, title = '') {
  try {
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        type: 'access',
        path,
        title,
        ref: (document.referrer || '').slice(0, 300),
        ua: navigator.userAgent.slice(0, 200),
      }),
    }).catch(() => {})
  } catch {}
}

export function logOp(action, detail = '') {
  try {
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({ type: 'op', action: String(action).slice(0, 120), detail: String(detail).slice(0, 300) }),
    }).catch(() => {})
  } catch {}
}

// 阅读进度埋点：milestone = 25|50|75|100
export function logRead(milestone, path, title) {
  try {
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({ type: 'read', milestone, path, title: String(title || '').slice(0, 120) }),
    }).catch(() => {})
  } catch {}
}
