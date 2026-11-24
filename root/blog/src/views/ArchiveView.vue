<template>
  <div class="layout-two-col">
    <section class="archive glass">
      <h1 class="archive-title">归档</h1>
      <p class="archive-sub">
        {{ store.loading ? '加载中…' : `共 ${store.posts.length} 篇文章 · 记录即存在` }}
      </p>

      <!-- 视图切换 -->
      <div class="view-tabs">
        <button
          v-for="v in views"
          :key="v.id"
          class="view-tab"
          :class="{ on: view === v.id }"
          @click="switchView(v.id)"
        >
          {{ v.icon }} {{ v.name }}
        </button>
      </div>

      <!-- ===== 全部：年份时间线（原有视图） ===== -->
      <template v-if="view === 'all'">
        <div v-for="(group, gi) in pagedGroups" :key="group.year" v-reveal="gi * 90" class="year-group">
          <div class="year-marker">
            <span class="year">{{ group.year }}</span>
            <span class="year-count">{{ group.posts.length }} 篇</span>
          </div>

          <div class="timeline">
            <router-link
              v-for="p in group.posts"
              :key="p.slug"
              :to="`/post/${p.slug}`"
              class="timeline-item"
            >
              <span class="dot"></span>
              <span class="item-date">{{ p.date }}</span>
              <span class="item-title">{{ p.title }}</span>
              <span class="item-cat">{{ p.category }}</span>
            </router-link>
          </div>
        </div>
        <PaginationBar v-model:page="page" :page-count="pageCount" :total="store.posts.length" />
      </template>

      <!-- ===== 周报 / 月报 / 年报 ===== -->
      <template v-else>
        <!-- 周期选择：本期实时 + 最近若干期 -->
        <div class="report-actions">
          <button class="cinema-btn" title="以动画幻灯片形式回顾本报告" @click="openShow">
            🎬 动画模式查看
          </button>
        </div>
        <div class="period-chips">
          <button
            class="period-chip live"
            :class="{ on: reportOffset === 0 }"
            @click="loadReport(0)"
          >
            本期 · 实时
          </button>
          <button
            v-for="n in periodCount[view] ?? 8"
            :key="n"
            class="period-chip"
            :class="{ on: reportOffset === n }"
            @click="loadReport(n)"
          >
            {{ periodLabel(n) }}
          </button>
        </div>

        <p v-if="reportLoading" class="report-hint">报告生成中…</p>
        <p v-else-if="reportError" class="report-hint">
          {{ reportError }}
          <button class="btn-glass" @click="loadReport(reportOffset)">重试</button>
        </p>

        <div v-else-if="report" class="report">
          <!-- 报告头 -->
          <div class="report-head">
            <div>
              <div class="report-label">
                {{ periodName }} · {{ report.label }}
                <span v-if="report.live" class="live-badge">进行中</span>
              </div>
              <div class="report-range">{{ report.from }} ~ {{ report.to }}</div>
            </div>
            <div class="report-nums">
              <div class="rn">
                <span class="rn-num">{{ report.articles.count }}</span>
                <span class="rn-label">发布</span>
              </div>
              <div class="rn">
                <span class="rn-num">{{ fmtWords(report.articles.totalWords) }}</span>
                <span class="rn-label">字数</span>
              </div>
              <div class="rn">
                <span class="rn-num">{{ report.access.count }}</span>
                <span class="rn-label">访问</span>
              </div>
            </div>
          </div>

          <!-- 创作亮点 -->
          <div class="report-sec">
            <h3 class="sec-title">✨ 亮点</h3>
            <ul class="hl-list">
              <li v-for="(h, i) in report.highlights" :key="i">{{ h }}</li>
            </ul>
          </div>

          <!-- 文章统计 -->
          <div class="report-sec">
            <h3 class="sec-title">📝 文章统计</h3>
            <div v-if="report.articles.count" class="cat-chips">
              <span v-for="(n, cat) in report.articles.byCategory" :key="cat" class="chip">
                {{ cat }} × {{ n }}
              </span>
            </div>
            <p v-else class="sec-empty">本期没有发布文章</p>
            <div v-if="report.articles.list.length" class="report-posts">
              <router-link
                v-for="p in report.articles.list"
                :key="p.slug"
                :to="`/post/${p.slug}`"
                class="rp-row"
              >
                <span class="rp-date">{{ p.date }}</span>
                <span class="rp-title">{{ p.title }}</span>
                <span class="rp-words">{{ fmtWords(p.words) }} 字</span>
              </router-link>
            </div>
          </div>

          <!-- 访问统计 -->
          <div class="report-sec">
            <h3 class="sec-title">👀 访问统计</h3>
            <template v-if="report.access.count">
              <div
                v-for="(t, i) in report.access.top.slice(0, 5)"
                :key="i"
                class="top-row"
              >
                <span class="top-rank">{{ i + 1 }}</span>
                <span class="top-name">{{ t.title || t.path }}</span>
                <span class="top-bar-wrap">
                  <span class="top-bar" :style="{ width: barWidth(t.count) }"></span>
                </span>
                <span class="top-count">{{ t.count }}</span>
              </div>
            </template>
            <p v-else class="sec-empty">本期暂无访问数据</p>
          </div>
        </div>
      </template>
    </section>

    <SiteSidebar />

    <!-- 动画模式 -->
    <ReportShow :open="showOpen" :report="report || {}" :stats="showStats" @close="showOpen = false" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SiteSidebar from '../components/SiteSidebar.vue'
import PaginationBar from '../components/PaginationBar.vue'
import ReportShow from '../components/ReportShow.vue'
import { store } from '../posts'

const views = [
  { id: 'all', icon: '🗂', name: '全部' },
  { id: 'week', icon: '📅', name: '周报' },
  { id: 'month', icon: '🗓', name: '月报' },
  { id: 'year', icon: '🏆', name: '年报' },
]
const view = ref('all')

// 周期回溯数按建站日（最早文章日期）计算：建站之前的期不出现在选项里
const periodCount = computed(() => {
  const oldest = store.posts.length ? store.posts[store.posts.length - 1].date : ''
  if (!oldest) return { week: 8, month: 12, year: 5 }
  const now = new Date(Date.now() + 8 * 3600_000)
  const days = Math.max(0, (now - new Date(oldest + 'T00:00:00Z')) / 86400_000)
  if (view.value === 'week') {
    const dow = (now.getUTCDay() + 6) % 7
    return { week: Math.min(8, Math.floor((days + dow) / 7)), month: 12, year: 5 }
  }
  if (view.value === 'month') {
    const months = (now.getUTCFullYear() - Number(oldest.slice(0, 4))) * 12 + (now.getUTCMonth() + 1 - Number(oldest.slice(5, 7)))
    return { week: 8, month: Math.min(12, Math.max(0, months)), year: 5 }
  }
  return { week: 8, month: 12, year: Math.min(5, Math.max(0, now.getUTCFullYear() - Number(oldest.slice(0, 4)))) }
})

const report = ref(null)
const reportOffset = ref(0)
const reportLoading = ref(false)
const reportError = ref('')
const showOpen = ref(false)
const showStats = ref({})

function openShow() {
  if (!report.value) return
  fetch('/api/logs/stats')
    .then((r) => r.json())
    .then((d) => (showStats.value = d))
    .catch(() => {})
  showOpen.value = true
}

/* 分页：每页 10 条，切页后按年份重新分组 */
const PAGE_SIZE = 10
const page = ref(1)
const pageCount = computed(() => Math.max(1, Math.ceil(store.posts.length / PAGE_SIZE)))
const pagedGroups = computed(() => {
  const slice = store.posts.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE)
  const map = new Map()
  for (const p of slice) {
    const year = (p.date || '未知').slice(0, 4)
    if (!map.has(year)) map.set(year, [])
    map.get(year).push(p)
  }
  return [...map.entries()].map(([year, list]) => ({ year, posts: list }))
})

function switchView(id) {
  const typeChanged = id !== view.value
  view.value = id
  // 切换周期类型时必须重新加载（周报的数据不能挂在月报下）
  if (id !== 'all' && (typeChanged || !report.value)) {
    report.value = null
    loadReport(0)
  }
}

async function loadReport(offset) {
  reportOffset.value = offset
  reportLoading.value = true
  reportError.value = ''
  // 记录发起时的视图，响应回来时视图已切换则丢弃（防止慢响应互相覆盖）
  const reqView = view.value
  try {
    const res = await fetch(`/api/report?period=${reqView}&offset=${offset}`)
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    if (view.value !== reqView) return
    report.value = data
  } catch (e) {
    if (view.value === reqView) reportError.value = e.message
  } finally {
    if (view.value === reqView) reportLoading.value = false
  }
}

const periodName = computed(
  () => ({ week: '周报', month: '月报', year: '年报' })[view.value] || '报告',
)

// 周期标签（与后端同样规则在本地生成）
function periodLabel(n) {
  const now = new Date(Date.now() + 8 * 3600_000)
  const iso = (d) => d.toISOString().slice(0, 10)
  if (view.value === 'week') {
    const dow = (now.getUTCDay() + 6) % 7
    const monday = new Date(now.getTime() - dow * 86400_000 - n * 7 * 86400_000)
    const end = new Date(monday.getTime() + 6 * 86400_000)
    return `${iso(monday).slice(5).replace('-', '/')}~${iso(end).slice(5).replace('-', '/')}`
  }
  if (view.value === 'month') {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - n, 1))
    return `${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, '0')}`
  }
  return `${now.getUTCFullYear() - n} 年`
}

function fmtWords(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + ' 万'
  return String(n)
}

function barWidth(count) {
  const max = report.value?.access?.top?.[0]?.count || 1
  return Math.max(6, Math.round((count / max) * 100)) + '%'
}
</script>

<style scoped>
.archive {
  padding: 34px 38px;
}

.archive-title {
  font-size: 26px;
}

.archive-sub {
  margin: 8px 0 18px;
  color: var(--text-3);
  font-size: 13.5px;
}

/* 视图切换 */
.view-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--glass-border);
  margin-bottom: 22px;
}

.view-tab {
  padding: 7px 18px;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
  background: transparent;
  color: var(--text-2);
  font-size: 13.5px;
  cursor: pointer;
  transition: all 0.2s;
}

.view-tab:hover {
  background: var(--hover-bg);
}

.view-tab.on {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  border-color: transparent;
  font-weight: 600;
}

/* 周期选择 */
.period-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.period-chip {
  padding: 5px 14px;
  border-radius: 999px;
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text-2);
  font-size: 12.5px;
  font-family: var(--font-mono);
  cursor: pointer;
}

.period-chip.on {
  color: #fff;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  border-color: transparent;
}

.period-chip.live {
  font-family: var(--font-sans);
}

.report-hint {
  color: var(--text-3);
  padding: 20px 0;
}

/* 报告卡片 */
.report-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  padding: 18px 20px;
  border-radius: var(--radius-md);
  background: var(--glass-bg-strong);
  border: 1px solid var(--glass-border);
  margin-bottom: 18px;
}

.report-label {
  font-size: 17px;
  font-weight: 800;
}

.live-badge {
  font-size: 11px;
  font-weight: 600;
  color: #3aa675;
  background: rgba(58, 166, 117, 0.12);
  border-radius: 999px;
  padding: 2px 10px;
  margin-left: 8px;
  vertical-align: 2px;
}

.report-range {
  font-size: 12px;
  color: var(--text-3);
  font-family: var(--font-mono);
  margin-top: 4px;
}

.report-nums {
  display: flex;
  gap: 26px;
}

.rn {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rn-num {
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.rn-label {
  font-size: 11.5px;
  color: var(--text-3);
}

/* 报告分区 */
.report-sec {
  margin-bottom: 20px;
}

.sec-title {
  font-size: 14.5px;
  margin-bottom: 10px;
  padding-left: 10px;
  border-left: 3px solid var(--accent);
}

.sec-empty {
  font-size: 13px;
  color: var(--text-3);
}

.hl-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.hl-list li {
  font-size: 14px;
  color: var(--text-2);
  padding-left: 18px;
  position: relative;
}

.hl-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 9px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
}

.cat-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.report-posts {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rp-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 7px 10px;
  border-radius: var(--radius-sm);
  color: var(--text-1);
  font-size: 13.5px;
}

.rp-row:hover {
  background: var(--hover-bg);
}

.rp-date {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-3);
  flex-shrink: 0;
}

.rp-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
}

.rp-words {
  font-size: 12px;
  color: var(--text-3);
  flex-shrink: 0;
}

/* 访问 Top 榜 */
.top-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
  font-size: 13px;
}

.top-rank {
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  background: var(--code-bg);
  color: var(--accent-deep);
  font-size: 11.5px;
  font-weight: 700;
  flex-shrink: 0;
}

.top-name {
  width: 40%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-2);
}

.top-bar-wrap {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: var(--glass-border);
  overflow: hidden;
}

.top-bar {
  display: block;
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
}

.top-count {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-3);
  flex-shrink: 0;
  min-width: 32px;
  text-align: right;
}

/* 年份时间线（原视图） */
.year-group + .year-group {
  margin-top: 34px;
}

.year-marker {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;
}

.year {
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.year-count {
  font-size: 12.5px;
  color: var(--text-3);
}

.timeline {
  position: relative;
  padding-left: 20px;
  border-left: 2px solid var(--glass-border);
  margin-left: 6px;
}

.timeline-item {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 11px 14px;
  margin: 4px 0;
  border-radius: var(--radius-sm);
  color: var(--text-1);
  transition: background 0.2s;
}

.timeline-item:hover {
  background: var(--hover-bg);
}

.dot {
  position: absolute;
  left: -27px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  box-shadow: 0 0 0 4px var(--code-bg);
}

.item-date {
  font-size: 13px;
  color: var(--text-3);
  font-family: var(--font-mono);
}

.item-title {
  font-size: 15px;
  font-weight: 600;
}

.item-title:hover {
  color: var(--accent-deep);
}

.item-cat {
  margin-left: auto;
  font-size: 12px;
  color: var(--accent-deep);
  background: var(--code-bg);
  padding: 2px 10px;
  border-radius: 999px;
}

@media (max-width: 720px) {
  .archive {
    padding: 24px 18px;
  }
  .item-cat,
  .top-name {
    display: none;
  }
}
</style>

.report-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.cinema-btn {
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--accent-deep);
  border-radius: 999px;
  font-size: 12.5px;
  padding: 5px 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.cinema-btn:hover {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  border-color: transparent;
}
