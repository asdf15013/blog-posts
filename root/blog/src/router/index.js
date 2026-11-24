import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { logAccess } from '../utils/logger'
import { store } from '../posts'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    {
      path: '/post/:slug',
      name: 'post',
      component: () => import('../views/PostView.vue'),
    },
    {
      path: '/archive',
      name: 'archive',
      component: () => import('../views/ArchiveView.vue'),
    },
    {
      path: '/tools',
      name: 'tools',
      component: () => import('../views/ToolsView.vue'),
    },
    {
      path: '/resources',
      name: 'resources',
      component: () => import('../views/ResourcesView.vue'),
    },
    {
      path: '/links',
      name: 'links',
      component: () => import('../views/LinksView.vue'),
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: () => import('../views/GalleryView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
    },
    {
      path: '/admin/new',
      name: 'admin-new',
      component: () => import('../views/AdminEditor.vue'),
    },
    {
      path: '/admin/edit/:slug',
      name: 'admin-edit',
      component: () => import('../views/AdminEditor.vue'),
    },
    {
      path: '/admin/resources',
      redirect: { path: '/admin', query: { tab: 'resources' } },
    },
    {
      path: '/admin/gallery',
      redirect: { path: '/admin', query: { tab: 'gallery' } },
    },
    {
      path: '/admin/music',
      redirect: { path: '/admin', query: { tab: 'music' } },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

// 各页面默认标题（文章页由 PostView 动态覆盖为文章标题）
const titles = {
  home: '岩栖_shard · 个人博客',
  archive: '归档 · 岩栖_shard',
  tools: '工具 · 岩栖_shard',
  resources: '资料下载 · 岩栖_shard',
  links: '友链 · 岩栖_shard',
  gallery: '图片库 · 岩栖_shard',
  about: '关于 · 岩栖_shard',
  admin: '后台管理 · 岩栖_shard',
  'admin-new': '写文章 · 岩栖_shard',
  'admin-edit': '编辑文章 · 岩栖_shard',
}
router.afterEach((to) => {
  document.title = titles[to.name] || '岩栖_shard · 个人博客'

  // 访问埋点：跳过后台路由；同一路径 30 秒内不重复计
  if (!String(to.fullPath).startsWith('/admin')) {
    const now = Date.now()
    if (lastLogged.path !== to.fullPath || now - lastLogged.at > 30_000) {
      lastLogged = { path: to.fullPath, at: now }
      let title = (titles[to.name] || '').replace(' · 岩栖_shard', '') || (to.name === 'home' ? '首页' : '')
      if (to.name === 'post') {
        title = store.posts.find((p) => p.slug === to.params.slug)?.title || '文章'
      }
      logAccess(to.fullPath, title)
    }
  }
})

let lastLogged = { path: '', at: 0 }

export default router
