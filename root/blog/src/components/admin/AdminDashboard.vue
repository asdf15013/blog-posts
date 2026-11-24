<template>
  <div>
    <!-- 统计卡片 -->
    <div class="dash-grid">
      <div class="dash-card glass">
        <div class="d-num">{{ stats.today }}</div>
        <div class="d-label">今日阅读</div>
      </div>
      <div class="dash-card glass">
        <div class="d-num">{{ stats.total }}</div>
        <div class="d-label">30 天阅读</div>
      </div>
      <div class="dash-card glass">
        <div class="d-num">{{ store.posts.length }}</div>
        <div class="d-label">文章总数</div>
      </div>
      <div class="dash-card glass">
        <div class="d-num">{{ totalLikes }}</div>
        <div class="d-label">累计点赞</div>
      </div>
    </div>

    <div class="dash-cols">
      <!-- 热门 + 完读 -->
      <div class="glass dash-panel">
        <h2 class="panel-title">🔥 热门文章（30 天）</h2>
        <div v-if="stats.top?.length" class="p-list">
          <div v-for="(t, i) in stats.top.slice(0, 5)" :key="i" class="p-row">
            <span class="p-name">{{ i + 1 }}. {{ t.name }}</span>
            <span class="p-count">{{ t.count }} 次</span>
          </div>
        </div>
        <p v-else class="p-empty">暂无数据</p>

        <h2 class="panel-title" style="margin-top: 18px">📖 完读率</h2>
        <div v-if="stats.readStats?.length" class="p-list">
          <div v-for="(t, i) in stats.readStats.slice(0, 5)" :key="i" class="p-row">
            <span class="p-name">{{ i + 1 }}. {{ t.title }}</span>
            <span class="p-count">{{ t.rate }}%（{{ t.done }}/{{ t.opens }}）</span>
          </div>
        </div>
        <p v-else class="p-empty">读者读完文章后这里会出现统计</p>
      </div>

      <!-- 搜索词 -->
      <div class="glass dash-panel">
        <h2 class="panel-title">🔍 搜索词（30 天）</h2>
        <div v-if="stats.searchTop?.length" class="p-list">
          <div v-for="(t, i) in stats.searchTop.slice(0, 8)" :key="i" class="p-row">
            <span class="p-name">{{ t.q }}</span>
            <span class="p-count" :class="{ miss: t.miss > 0 }">
              {{ t.count }} 次{{ t.miss > 0 ? ` · ${t.miss} 次无结果` : '' }}
            </span>
          </div>
        </div>
        <p v-else class="p-empty">读者搜索后这里会出现记录——「无结果」的词就是下一篇的选题</p>
      </div>
    </div>

    <div class="dash-cols" style="margin-top: 16px">
      <!-- 国家分布 -->
      <div class="glass dash-panel">
        <h2 class="panel-title">🌍 访客地区（30 天）</h2>
        <div v-if="stats.countries?.length" class="p-list">
          <div v-for="(c, i) in stats.countries" :key="i" class="p-row">
            <span class="p-name">{{ flagOf(c.cc) }} {{ c.name }}</span>
            <span class="p-count">{{ c.count }} 次</span>
          </div>
        </div>
        <p v-else class="p-empty">暂无地区数据</p>
      </div>

      <!-- 公告编辑 -->
      <div class="glass dash-panel">
        <h2 class="panel-title">📢 站点公告</h2>
        <label class="field">
          <span>公告内容（显示在站点顶部横幅）</span>
          <textarea v-model="announce.text" class="a-input" rows="3" maxlength="300" placeholder="如：新教程上线 / 比赛通知 / 站点更新…"></textarea>
        </label>
        <label class="check-field">
          <input v-model="announce.on" type="checkbox" />
          <span>启用公告横幅</span>
        </label>
        <button class="btn-primary" :disabled="savingAnn" @click="saveAnnounce">
          {{ savingAnn ? '保存中…' : '💾 保存公告' }}
        </button>
        <p v-if="annTip" class="ok-tip">{{ annTip }}</p>
        <p v-if="annErr" class="err-tip">{{ annErr }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { store } from '../../posts'
import { refreshAdminAuth } from '../../composables/adminAuth'

const stats = reactive({ today: 0, total: 0, top: [], readStats: [], countries: [], searchTop: [] })
const likes = ref({})
const announce = reactive({ on: false, text: '' })
const savingAnn = ref(false)
const annTip = ref('')
const annErr = ref('')

const totalLikes = computed(() => Object.values(likes.value).reduce((a, b) => a + b, 0))

onMounted(async () => {
  // 统计已公开，点赞公开，公告公开——无需令牌即可看板
  fetch('/api/logs/stats')
    .then((r) => r.json())
    .then((d) => Object.assign(stats, d))
    .catch(() => {})
  fetch('/api/likes')
    .then((r) => r.json())
    .then((d) => (likes.value = d || {}))
    .catch(() => {})
  fetch('/api/announce')
    .then((r) => r.json())
    .then((d) => Object.assign(announce, d))
    .catch(() => {})
})

function flagOf(cc) {
  if (!cc || cc.length !== 2) return '🌐'
  return String.fromCodePoint(...[...cc.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65))
}

async function saveAnnounce() {
  savingAnn.value = true
  annTip.value = ''
  annErr.value = ''
  try {
    const res = await fetch('/api/announce', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('yanqi-res-token') || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ on: announce.on, text: announce.text }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `保存失败（${res.status}）`)
    annTip.value = '已保存并即时生效'
    setTimeout(() => (annTip.value = ''), 2000)
    window.dispatchEvent(new CustomEvent('announce-updated'))
  } catch (e) {
    annErr.value = e.message
  } finally {
    savingAnn.value = false
  }
}
</script>

<style scoped>
.dash-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 16px;
}

.dash-card {
  padding: 18px 20px;
}

.d-num {
  font-size: 26px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.d-label {
  font-size: 12px;
  color: var(--text-3);
  margin-top: 4px;
}

.dash-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.dash-panel {
  padding: 20px 24px;
}

.panel-title {
  font-size: 14.5px;
  margin-bottom: 12px;
  padding-left: 10px;
  border-left: 3px solid var(--accent);
}

.p-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.p-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 13px;
  color: var(--text-2);
}

.p-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.p-count {
  color: var(--accent-deep);
  font-weight: 600;
  flex-shrink: 0;
}

.p-count.miss {
  color: #e6a23c;
}

.p-empty {
  font-size: 13px;
  color: var(--text-3);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--text-2);
}

.a-input {
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text-1);
  font-size: 14px;
  outline: none;
  resize: vertical;
  font-family: inherit;
}

.a-input:focus {
  border-color: var(--accent);
}

.check-field {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-2);
  margin: 12px 0 16px;
  cursor: pointer;
}

.check-field input {
  width: 16px;
  height: 16px;
  accent-color: var(--accent);
}

.btn-primary {
  padding: 9px 22px;
  border: none;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.ok-tip {
  margin-top: 10px;
  font-size: 13px;
  color: #3aa675;
}

.err-tip {
  margin-top: 10px;
  font-size: 13px;
  color: #e5484d;
}

@media (max-width: 860px) {
  .dash-grid {
    grid-template-columns: 1fr 1fr;
  }
  .dash-cols {
    grid-template-columns: 1fr;
  }
}
</style>
