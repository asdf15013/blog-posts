<template>
  <header class="site-header" :class="{ hide: headerHidden, over: overHero }">
    <div class="container header-inner glass">
      <router-link to="/" class="brand">
        <img :src="site.avatar" alt="头像" class="brand-avatar" :class="{ 'avatar-spin': avatarSpinning }" @click="onAvatarEgg" />
        <span class="brand-name">{{ site.name }}</span>
      </router-link>

      <nav class="nav">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/archive" class="nav-link">归档</router-link>
        <router-link to="/tools" class="nav-link">工具</router-link>
        <router-link to="/resources" class="nav-link">资料</router-link>
        <router-link to="/gallery" class="nav-link">相册</router-link>
        <router-link to="/links" class="nav-link">友链</router-link>
        <router-link to="/about" class="nav-link">关于</router-link>
      </nav>

      <div class="header-actions">
        <!-- 快捷图标：RSS / GitHub / 随机一篇 -->
        <div class="qicons">
          <a class="qicon" href="/rss.xml" target="_blank" rel="noopener" title="RSS 订阅">
            <svg viewBox="0 0 24 24" width="15" height="15">
              <path
                fill="currentColor"
                d="M4 4a16 16 0 0 1 16 16 1.8 1.8 0 0 1-1.8 1.8A1.8 1.8 0 0 1 16.4 20 12.4 12.4 0 0 0 4 7.6 1.8 1.8 0 0 1 2.2 5.8 1.8 1.8 0 0 1 4 4Zm0 6.8A9.2 9.2 0 0 1 13.2 20a1.8 1.8 0 0 1-1.8 1.8A1.8 1.8 0 0 1 9.6 20 5.6 5.6 0 0 0 4 14.4 1.8 1.8 0 0 1 2.2 12.6 1.8 1.8 0 0 1 4 10.8Zm0 5.2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"
              />
            </svg>
          </a>
          <a class="qicon" :href="site.socials.find(s=>s.name==='GitHub')?.url" target="_blank" rel="noopener" title="GitHub 主页">
            <svg viewBox="0 0 16 16" width="16" height="16">
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
              />
            </svg>
          </a>
          <button class="qicon" title="随机读一篇" @click="goRandom">🎲</button>
        </div>

        <SearchBox />

        <button class="kbd-btn" title="命令面板（Ctrl+K）" @click="openPalette">⌘K</button>
        <ThemeToggle />

        <!-- 移动端汉堡 -->
        <button class="hamburger" title="菜单" @click="drawerOpen = !drawerOpen">
          <svg viewBox="0 0 24 24" width="19" height="19" v-if="!drawerOpen">
            <path fill="currentColor" d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" />
          </svg>
          <svg viewBox="0 0 24 24" width="19" height="19" v-else>
            <path fill="currentColor" d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6 10.6 12 5 6.4 6.4 5Z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 移动端侧滑抽屉 -->
    <Teleport to="body">
      <transition name="fade-slide">
        <div v-if="drawerOpen" class="drawer-mask" @click="drawerOpen = false">
          <div class="drawer glass" @click.stop>
            <div class="drawer-head">
              <img :src="site.avatar" class="drawer-avatar" alt="" />
              <div>
                <div class="drawer-name">{{ site.name }}</div>
                <div class="drawer-motto">{{ site.motto }}</div>
              </div>
            </div>
            <nav class="drawer-nav">
              <router-link to="/" class="drawer-link">🏠 首页</router-link>
              <router-link to="/archive" class="drawer-link">🗂 归档</router-link>
              <router-link to="/tools" class="drawer-link">🧰 工具</router-link>
              <router-link to="/resources" class="drawer-link">📦 资料</router-link>
              <router-link to="/gallery" class="drawer-link">🖼 相册</router-link>
              <router-link to="/links" class="drawer-link">🔗 友链</router-link>
              <router-link to="/about" class="drawer-link">👤 关于</router-link>
            </nav>
            <div class="drawer-divider"></div>
            <div class="drawer-actions">
              <button class="drawer-chip" @click="openFromDrawer">⌘ 命令面板</button>
              <a class="drawer-chip" href="/rss.xml" target="_blank" rel="noopener">📡 RSS</a>
              <button class="drawer-chip" @click="goRandom">🎲 随机一篇</button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </header>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SearchBox from './SearchBox.vue'
import ThemeToggle from './ThemeToggle.vue'
import { site } from '../config'
import { store } from '../posts'
import { openPalette } from '../composables/palette'

const route = useRoute()
const router = useRouter()

// 🥚 头像五连击
const avatarSpinning = ref(false)
let avatarClicks = 0
let avatarTimer = 0
function onAvatarEgg() {
  avatarClicks++
  clearTimeout(avatarTimer)
  avatarTimer = setTimeout(() => (avatarClicks = 0), 1500)
  if (avatarClicks >= 5) {
    avatarClicks = 0
    avatarSpinning.value = true
    setTimeout(() => (avatarSpinning.value = false), 1200)
    window.dispatchEvent(new CustomEvent('avatar-egg'))
  }
}

/* ---- 移动端抽屉 ---- */
const drawerOpen = ref(false)
watch(() => route.fullPath, () => (drawerOpen.value = false))

function openFromDrawer() {
  drawerOpen.value = false
  openPalette()
}

function goRandom() {
  drawerOpen.value = false
  if (!store.posts.length) return
  const p = store.posts[Math.floor(Math.random() * store.posts.length)]
  router.push('/post/' + p.slug)
}

/* ---- 下滑收起、上滑展开；首页顶部处于 hero 之上时透明 ---- */
const headerHidden = ref(false)
const overHero = ref(false)
function updateOver() {
  overHero.value = route.name === 'home' && window.scrollY < window.innerHeight - 90
}
let lastY = window.scrollY
let hideRaf = 0

function onScroll() {
  if (hideRaf) return
  hideRaf = requestAnimationFrame(() => {
    hideRaf = 0
    const y = window.scrollY
    // poetize 式：导航常驻，不做下滑隐藏（隐藏会让读者失去搜索/菜单）
    headerHidden.value = false
    lastY = y
    updateOver()
  })
}

watch(() => route.name, () => nextTick(updateOver))
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  nextTick(updateOver)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (hideRaf) cancelAnimationFrame(hideRaf)
})
</script>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s;
}
.site-header > .container {
  max-width: none;
  padding: 0 26px;
}
.site-header.over {
  background: transparent;
  box-shadow: none;
}
.site-header.over .header-inner {
  background: transparent;
  border: none;
  box-shadow: none;
  backdrop-filter: none;
}
.site-header.over .nav-link {
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 1px 8px rgba(10, 12, 24, 0.4);
}
.site-header.over .nav-link.router-link-active {
  color: #fff;
}
.site-header.over .brand-name {
  color: #fff;
  text-shadow: 0 1px 8px rgba(10, 12, 24, 0.4);
}
.site-header.over .search-input,
.site-header.over .theme-toggle {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}
.site-header.over .search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.site-header.hide {
  transform: translateY(-130%);
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 22px;
  border-radius: var(--radius-lg);
  background: var(--nav-solid);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(18px) saturate(160%);
  transition: background 0.3s, border-color 0.3s;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-1);
  font-weight: 700;
  font-size: 17px;
  min-width: 0;
}

.brand-avatar {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  flex-shrink: 0;
}

.nav {
  display: flex;
  gap: 6px;
  margin-left: 8px;
}

.nav-link {
  padding: 7px 14px;
  border-radius: var(--radius-sm);
  color: var(--text-2);
  font-size: 14.5px;
  transition: all 0.2s;
}

.nav-link:hover {
  color: var(--text-1);
  background: var(--hover-bg);
}

/* 当前激活页 */
.nav-link.router-link-active {
  color: #fff;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  box-shadow: 0 4px 14px rgba(109, 94, 242, 0.35);
}

.header-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 快捷图标 */
.qicons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.qicon {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--text-2);
  cursor: pointer;
  font-size: 15px;
  transition: all 0.2s;
  text-decoration: none;
}

.qicon:hover {
  color: var(--accent-deep);
  background: var(--hover-bg);
  transform: translateY(-1px);
}

/* ⌘K 按钮 */
.kbd-btn {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text-3);
  font-size: 12px;
  font-family: var(--font-mono);
  cursor: pointer;
  transition: all 0.2s;
}

.kbd-btn:hover {
  color: var(--accent-deep);
  border-color: var(--accent);
}

/* 汉堡按钮：桌面隐藏 */
.hamburger {
  display: none;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text-1);
  cursor: pointer;
}

/* 抽屉 */
.drawer-mask {
  position: fixed;
  inset: 0;
  z-index: 700;
  background: rgba(10, 10, 24, 0.4);
  backdrop-filter: blur(3px);
}

.drawer {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: min(320px, 84vw);
  border-radius: 0;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  animation: drawerIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes drawerIn {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}

.drawer-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 8px 18px;
}

.drawer-avatar {
  width: 46px;
  height: 46px;
  border-radius: 14px;
}

.drawer-name {
  font-weight: 700;
  font-size: 16px;
}

.drawer-motto {
  font-size: 12px;
  color: var(--text-3);
  margin-top: 3px;
}

.drawer-link {
  display: block;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  color: var(--text-1);
  font-size: 15px;
  font-weight: 500;
}

.drawer-link:active,
.drawer-link.router-link-active {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
}

.drawer-divider {
  height: 1px;
  background: var(--glass-border);
  margin: 12px 0;
}

.drawer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.drawer-chip {
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
  background: transparent;
  color: var(--text-2);
  font-size: 13px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.drawer-chip:hover {
  color: #fff;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  border-color: transparent;
}

@media (max-width: 880px) {
  .nav,
  .qicons,
  .kbd-btn {
    display: none;
  }

  .hamburger {
    display: grid;
  }

  .brand-name {
    display: none;
  }

  .header-inner {
    gap: 8px;
    padding: 10px 14px;
  }
}
</style>

.avatar-spin {
  animation: avatarSpin 1.2s cubic-bezier(0.3, 0.7, 0.2, 1);
}

@keyframes avatarSpin {
  from {
    transform: rotate(0) scale(1);
  }
  50% {
    transform: rotate(400deg) scale(1.25);
  }
  to {
    transform: rotate(720deg) scale(1);
  }
}
