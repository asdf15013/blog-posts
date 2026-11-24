<template>
  <div class="comments glass">
    <h2 class="comments-title">💬 评论区</h2>
    <p class="comments-hint">基于 GitHub Discussions，使用 GitHub 账号登录后评论</p>
    <div ref="giscusEl" class="giscus-wrap"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../composables/useTheme'

const props = defineProps({
  slug: { type: String, required: true },
})

// giscus 配置（仓库 Discussions 已开启；需安装 giscus App：https://github.com/apps/giscus）
const GISCUS = {
  repo: 'asdf15013/blog-posts',
  repoId: 'R_kgDOVxLiVw',
  category: 'Announcements',
  categoryId: 'DIC_kwDOVxLiV84DLVJM',
}

const giscusEl = ref(null)
const { resolvedTheme } = useTheme()
let unwatchTheme = null

function giscusTheme() {
  return resolvedTheme() === 'dark' ? 'transparent_dark' : 'light'
}

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  const attrs = {
    'data-repo': GISCUS.repo,
    'data-repo-id': GISCUS.repoId,
    'data-category': GISCUS.category,
    'data-category-id': GISCUS.categoryId,
    'data-mapping': 'specific',
    'data-term': props.slug,
    'data-strict': '1',
    'data-reactions-enabled': '1',
    'data-emit-metadata': '0',
    'data-input-position': 'top',
    'data-theme': giscusTheme(),
    'data-lang': 'zh-CN',
    'data-loading': 'lazy',
  }
  for (const [k, v] of Object.entries(attrs)) script.setAttribute(k, v)
  giscusEl.value.appendChild(script)

  // 站点明暗切换时同步 giscus 主题
  unwatchTheme = watch(
    () => resolvedTheme(),
    () => {
      giscusEl.value
        ?.querySelector('iframe')
        ?.contentWindow?.postMessage(
          { giscus: { setConfig: { theme: giscusTheme() } } },
          'https://giscus.app',
        )
    },
  )
})

onUnmounted(() => unwatchTheme?.())
</script>

<style scoped>
.comments {
  margin-top: 24px;
  padding: 26px 34px;
}

.comments-title {
  font-size: 18px;
}

.comments-hint {
  margin: 6px 0 14px;
  font-size: 12.5px;
  color: var(--text-3);
}

@media (max-width: 720px) {
  .comments {
    padding: 20px 16px;
  }
}
</style>
