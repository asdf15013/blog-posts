import { ref } from 'vue'

// 后台两种凭据的连接状态（GitHub 令牌 / 资料服务令牌），供控制台标签栏显示
export const ghConnected = ref(!!localStorage.getItem('yanqi-admin'))
export const resConnected = ref(!!localStorage.getItem('yanqi-res-token'))

export function refreshAdminAuth() {
  ghConnected.value = !!localStorage.getItem('yanqi-admin')
  resConnected.value = !!localStorage.getItem('yanqi-res-token')
}
