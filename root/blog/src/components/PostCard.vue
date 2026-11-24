<template>
  <router-link :to="`/post/${post.slug}`" class="post-card glass spot">
    <div class="cover" :style="{ backgroundImage: `url(${cover})` }">
      <span class="cover-cat">{{ post.category }}</span>
      <span v-if="post.pinned" class="cover-pin">📌 置顶</span>
    </div>
    <div class="inner">
      <div class="post-head">
        <span class="post-date">{{ post.date }}</span>
        <span v-if="post.series" class="post-series">📚 {{ post.series }}</span>
      </div>
      <h2 class="post-title">{{ post.title }}</h2>
      <p class="post-summary">{{ post.summary }}</p>
      <div class="post-tags">
        <span v-for="t in post.tags" :key="t" class="chip"># {{ t }}</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  post: { type: Object, required: true },
})

// 按 slug 稳定映射到四张风景封面
const SCENES = ['/scenery/dawn.svg', '/scenery/night.svg', '/scenery/mist.svg', '/scenery/sea.svg']
const cover = computed(() => {
  let h = 0
  for (const c of props.post.slug) h = (h * 31 + c.charCodeAt(0)) % 997
  return SCENES[h % 4]
})
</script>

<style scoped>
.post-card {
  display: block;
  overflow: hidden;
  color: var(--text-1);
  transition: transform var(--transition), box-shadow var(--transition);
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 40px rgba(80, 70, 170, 0.2);
}

.post-card + .post-card {
  margin-top: 18px;
}

/* 封面 */
.cover {
  height: 168px;
  background-size: cover;
  background-position: center;
  position: relative;
  transition: transform 0.5s;
}

.post-card:hover .cover {
  transform: scale(1.04);
}

.cover-cat {
  position: absolute;
  left: 14px;
  bottom: 12px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--accent-deep);
  font-size: 11.5px;
  font-weight: 700;
  padding: 3px 12px;
  border-radius: 999px;
}

.cover-pin {
  position: absolute;
  right: 14px;
  top: 12px;
  background: rgba(230, 162, 60, 0.92);
  color: #fff;
  font-size: 11.5px;
  font-weight: 700;
  padding: 3px 12px;
  border-radius: 999px;
}

.inner {
  padding: 16px 24px 18px;
}

.post-head {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12.5px;
  color: var(--text-3);
}

.post-series {
  color: var(--accent-deep);
}

.post-title {
  font-size: 19px;
  margin: 10px 0 8px;
  transition: color 0.2s;
}

.post-card:hover .post-title {
  color: var(--accent-deep);
}

.post-summary {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
</style>
