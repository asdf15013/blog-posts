<template>
  <div class="editor-page">
    <div class="glass editor-card">
      <div class="editor-toolbar">
        <h1 class="editor-title">{{ isEdit ? '✏️ 编辑文章' : '✨ 新文章' }}</h1>
        <div class="toolbar-actions">
          <router-link to="/admin" class="btn-glass">返回列表</router-link>
          <button class="btn-primary" :disabled="saving" @click="save">
            {{ typeof saving === 'string' ? saving : saving ? '发布中…' : '🚀 保存并发布' }}
          </button>
        </div>
      </div>

      <p v-if="loadError" class="error-msg">{{ loadError }}</p>

      <!-- 元信息表单 -->
      <div class="meta-grid">
        <label class="field span-2">
          <span>标题 *</span>
          <input v-model="form.title" class="input" placeholder="文章标题" />
        </label>

        <label v-if="!isEdit" class="field">
          <span>URL 路径（slug）</span>
          <input v-model="form.slug" class="input mono" placeholder="可留空自动生成" />
        </label>
        <label class="field">
          <span>日期 *</span>
          <input v-model="form.date" class="input mono" type="date" />
        </label>

        <label class="field">
          <span>分类</span>
          <input v-model="form.category" class="input" list="cat-list" placeholder="如：技术" />
          <datalist id="cat-list">
            <option v-for="c in categories" :key="c" :value="c" />
          </datalist>
        </label>
        <label class="field">
          <span>标签（逗号分隔）</span>
          <input v-model="form.tags" class="input" placeholder="Vue, 前端" />
        </label>

        <label class="field">
          <span>系列专栏（同名的文章自动聚合，选填）</span>
          <input v-model="form.series" class="input" list="series-list" placeholder="如：PWN入门" />
          <datalist id="series-list">
            <option v-for="s in seriesOptions" :key="s" :value="s" />
          </datalist>
        </label>

        <label class="field span-2">
          <span>摘要（留空自动截取正文）</span>
          <textarea v-model="form.summary" class="input" rows="2" placeholder="一句话简介"></textarea>
        </label>

        <label class="check-field">
          <input v-model="form.pin" type="checkbox" />
          <span>📌 置顶</span>
        </label>
      </div>

      <!-- 正文编辑器 -->
      <div class="editor-split">
        <div class="editor-pane">
          <div class="pane-head">
            <span>Markdown 正文</span>
            <label class="upload-label">
              🖼 插入图片
              <input type="file" accept="image/*" hidden @change="onImage" />
            </label>
          </div>
          <textarea
            ref="bodyEl"
            v-model="form.body"
            class="body-input"
            placeholder="开始写作…"
            spellcheck="false"
          ></textarea>
        </div>
        <div class="editor-pane">
          <div class="pane-head"><span>实时预览</span></div>
          <div v-code-copy class="markdown-body preview-pane" v-html="previewHtml" @click="onAnchorClick"></div>
        </div>
      </div>

      <div v-if="isEdit" class="danger-zone">
        <button class="danger-btn" @click="remove">🗑 删除这篇文章</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store, loadPosts, getAllCategories } from '../posts'
import { getAdmin, readPost, writePost, deletePost, uploadImage, slugify } from '../utils/github'
import { logOp } from '../utils/logger'
import { parseFrontmatter } from '../utils/frontmatter'
import { renderMarkdown } from '../utils/markdown'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => route.name === 'admin-edit')

const bodyEl = ref(null)
const saving = ref(false)
const pasting = ref(false)
const loadError = ref('')
const fileSha = ref(null)
const originalSlug = ref('')

const form = reactive({
  title: '',
  slug: '',
  date: new Date().toISOString().slice(0, 10),
  category: '',
  tags: '',
  summary: '',
  pin: false,
  series: '',
  body: '',
})

// 已有系列（datalist 提示用）
const seriesOptions = computed(() => [...new Set(store.posts.map((p) => p.series).filter(Boolean))])

const categories = computed(() => getAllCategories().map((c) => c.name))
const previewHtml = computed(() => renderMarkdown(form.body || '_(开始输入后这里会实时预览)_'))

// 预览里的锚点链接（#xxx）：滚动到预览区对应标题，不触发路由跳转
function onAnchorClick(e) {
  const a = e.target.closest('a')
  if (!a) return
  const href = a.getAttribute('href') || ''
  if (!href.startsWith('#')) return
  e.preventDefault()
  const id = decodeURIComponent(href.slice(1))
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(async () => {
  if (!getAdmin()) {
    router.replace('/admin')
    return
  }
  if (isEdit.value) {
    const info = getAdmin()
    try {
      const file = await readPost(info.owner, info.repo, info.token, route.params.slug)
      if (!file) {
        loadError.value = '文章不存在，可能已被删除'
        return
      }
      fileSha.value = file.sha
      originalSlug.value = route.params.slug
      const { data, body } = parseFrontmatter(file.content)
      form.title = data.title || ''
      form.date = data.date || form.date
      form.category = data.category || ''
      form.tags = (data.tags || []).join(', ')
      form.summary = data.summary || ''
      form.pin = !!data.pin
      form.series = data.series || ''
      form.body = body
    } catch (e) {
      loadError.value = '读取文章失败：' + e.message
    }
  }
  if (!store.posts.length) loadPosts()
})

function buildMarkdown() {
  const fm = [
    '---',
    `title: ${form.title.trim()}`,
    `date: ${form.date}`,
    `category: ${form.category.trim() || '未分类'}`,
    `tags: [${form.tags
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean)
      .join(', ')}]`,
  ]
  if (form.summary.trim()) fm.push(`summary: ${form.summary.trim()}`)
  if (form.series.trim()) fm.push(`series: ${form.series.trim()}`)
  if (form.pin) fm.push('pin: true')
  fm.push('---', '')
  return fm.join('\n') + '\n' + form.body
}

async function save() {
  if (!form.title.trim()) {
    alert('请填写标题')
    return
  }
  if (!form.date) {
    alert('请选择日期')
    return
  }
  const info = getAdmin()
  if (!info) {
    router.replace('/admin')
    return
  }

  // 编辑模式下若改过 slug，相当于旧文件删除 + 新文件创建
  let slug
  if (isEdit.value) {
    slug = (form.slug || originalSlug.value).trim() || originalSlug.value
  } else {
    slug = (form.slug || '').trim() || slugify(form.title)
  }
  slug = slug.replace(/[^a-zA-Z0-9-_]+/g, '-').replace(/^-+|-+$/g, '') || slugify(form.title)

  saving.value = true
  try {
    // 保存前自动本地化外链图片：服务端抓取转存，改写为站内链接
    const localizeNote = await localizeImages()

    // 先取最新 sha，避免覆盖后台外的修改
    let sha = null
    const existing = await readPost(info.owner, info.repo, info.token, slug)
    if (existing) {
      if (
        isEdit.value &&
        slug !== originalSlug.value &&
        !confirm(`路径「${slug}」已存在另一篇文章，保存将覆盖它，确定？`)
      ) {
        saving.value = false
        return
      }
      sha = existing.sha
    }

    await writePost(info.owner, info.repo, info.token, slug, buildMarkdown(), sha)
    logOp(isEdit.value ? '更新文章' : '发布文章', `《${form.title}》${localizeNote}`)

    // 改名：删除旧文件
    if (isEdit.value && slug !== originalSlug.value) {
      const old = await readPost(info.owner, info.repo, info.token, originalSlug.value)
      if (old) await deletePost(info.owner, info.repo, info.token, originalSlug.value, old.sha)
    }

    await loadPosts(true)
    router.push('/admin')
  } catch (e) {
    alert('保存失败：' + e.message)
  } finally {
    saving.value = false
  }
}

/* ---- 外链图片自动本地化 ---- */

// 提取正文里所有 http(s) 图片链接（已是站内 /api/res/download/ 的不算）
function extractExternalImages(body) {
  const urls = new Set()
  const re = /!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g
  let m
  while ((m = re.exec(body))) {
    const u = m[1]
    // 已是站内链接（相对路径本就不匹配；排除本站绝对地址）不再本地化
    if (u.includes('/api/res/download/') || u.startsWith(location.origin + '/')) continue
    urls.add(u)
  }
  return [...urls]
}

async function localizeImages() {
  const urls = extractExternalImages(form.body)
  if (!urls.length) return ''
  const resToken = localStorage.getItem('yanqi-res-token')
  if (!resToken) return `（${urls.length} 张外链图片未本地化：未登录资料令牌）`

  let ok = 0
  const failed = []
  for (let i = 0; i < urls.length; i++) {
    saving.value = `本地化图片 ${i + 1}/${urls.length}…`
    try {
      const r = await fetch('/api/res/localize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resToken}` },
        body: JSON.stringify({ url: urls[i] }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`)
      // 替换正文中该图片的所有出现
      form.body = form.body.split(urls[i]).join(data.url)
      ok++
    } catch (e) {
      failed.push(`${urls[i].slice(0, 60)}…（${e.message}）`)
    }
  }
  let note = `，本地化图片 ${ok}/${urls.length}`
  if (failed.length) note += `，${failed.length} 张失败保留外链`
  if (failed.length) console.warn('图片本地化失败列表：', failed)
  return note
}

async function remove() {
  const info = getAdmin()
  if (!confirm(`确定删除《${form.title}》？不可撤销。`)) return
  try {
    if (!fileSha.value) {
      const file = await readPost(info.owner, info.repo, info.token, originalSlug.value)
      fileSha.value = file?.sha
    }
    await deletePost(info.owner, info.repo, info.token, originalSlug.value, fileSha.value)
    logOp('删除文章', `《${form.title}》`)
    await loadPosts(true)
    router.push('/admin')
  } catch (e) {
    alert('删除失败：' + e.message)
  }
}

// Ctrl+V 粘贴图片：自动上传并插入光标处
async function onPaste(e) {
  const items = [...(e.clipboardData?.items || [])]
  const imgItem = items.find((it) => it.type.startsWith('image/'))
  if (!imgItem) return
  e.preventDefault()
  const file = imgItem.getAsFile()
  if (!file) return
  const info = getAdmin()
  if (!info) return
  pasting.value = true
  try {
    const { url } = await uploadImage(info.owner, info.repo, cfgBranch.value, info.token, file)
    const el = bodyEl.value
    const s = el ? el.selectionStart : form.body.length
    form.body = form.body.slice(0, s) + `\n\n![](${url})\n\n` + form.body.slice(el ? el.selectionEnd : form.body.length)
  } catch (err) {
    alert('粘贴上传失败：' + err.message)
  } finally {
    pasting.value = false
  }
}

async function onImage(e) {
  const file = e.target.files?.[0]
  e.target.value = ''
  if (!file) return
  const info = getAdmin()
  if (!info) return router.replace('/admin')

  try {
    const { url } = await uploadImage(
      info.owner,
      info.repo,
      cfgBranch.value,
      info.token,
      file,
    )
    const md = `\n\n![](${url})\n\n`
    const el = bodyEl.value
    if (el && el.selectionStart != null) {
      const { selectionStart: s, selectionEnd: t, value } = el
      form.body = value.slice(0, s) + md + value.slice(t)
    } else {
      form.body += md
    }
  } catch (err) {
    alert('图片上传失败：' + err.message)
  }
}

// 分支名从站点 API 配置拿（默认 main）
const cfgBranch = ref('main')
fetch('/api/config')
  .then((r) => r.json())
  .then((c) => (cfgBranch.value = c.branch || 'main'))
  .catch(() => {})
</script>

<style scoped>
.editor-page {
  max-width: 1080px;
  margin: 0 auto;
}

.editor-card {
  padding: 26px 30px;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.editor-title {
  font-size: 20px;
}

.toolbar-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.error-msg {
  color: #e5484d;
  margin-bottom: 14px;
  font-size: 14px;
}

/* 表单 */
.meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 14px;
  margin-bottom: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--text-2);
}

.span-2 {
  grid-column: span 2;
}

.input {
  padding: 9px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text-1);
  font-size: 14px;
  outline: none;
  font-family: inherit;
  resize: vertical;
}

.input:focus {
  border-color: var(--accent);
}

.mono {
  font-family: var(--font-mono);
}

.check-field {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-2);
  align-self: end;
  padding-bottom: 10px;
  cursor: pointer;
}

.check-field input {
  width: 16px;
  height: 16px;
  accent-color: var(--accent);
}

/* 分屏编辑器 */
.editor-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  min-height: 480px;
}

.editor-pane {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--glass-bg-strong);
  min-height: 480px;
}

.pane-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 14px;
  font-size: 12.5px;
  color: var(--text-3);
  border-bottom: 1px solid var(--glass-border);
}

.upload-label {
  cursor: pointer;
  color: var(--accent-deep);
}

.upload-label:hover {
  text-decoration: underline;
}

.body-input {
  flex: 1;
  padding: 16px 18px;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-1);
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.8;
  resize: none;
}

.preview-pane {
  flex: 1;
  padding: 16px 20px;
  overflow-y: auto;
  font-size: 14.5px;
}

/* 删除区 */
.danger-zone {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px dashed var(--glass-border);
  display: flex;
  justify-content: flex-end;
}

.danger-btn {
  padding: 8px 18px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(229, 72, 77, 0.4);
  background: transparent;
  color: #e5484d;
  cursor: pointer;
  font-size: 13.5px;
  transition: all 0.2s;
}

.danger-btn:hover {
  background: rgba(229, 72, 77, 0.1);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  padding: 9px 20px;
  border-radius: var(--radius-sm);
  border: none;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(109, 94, 242, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 860px) {
  .meta-grid {
    grid-template-columns: 1fr 1fr;
  }
  .span-2 {
    grid-column: span 2;
  }
  .editor-split {
    grid-template-columns: 1fr;
  }
}
</style>

.paste-tip {
  padding: 6px 14px;
  font-size: 12.5px;
  color: var(--accent-deep);
  background: var(--code-bg);
}
