import md from 'markdown-it'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import python from 'highlight.js/lib/languages/python'
import markdownLang from 'highlight.js/lib/languages/markdown'
import ini from 'highlight.js/lib/languages/ini'
import sql from 'highlight.js/lib/languages/sql'
import c from 'highlight.js/lib/languages/c'
import cpp from 'highlight.js/lib/languages/cpp'
import makefile from 'highlight.js/lib/languages/makefile'
import x86asm from 'highlight.js/lib/languages/x86asm'
import './markdown.css'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('typescript', javascript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('vue', xml)
hljs.registerLanguage('vue-html', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('scss', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('sh', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('python', python)
hljs.registerLanguage('markdown', markdownLang)
hljs.registerLanguage('md', markdownLang)
hljs.registerLanguage('toml', ini)
hljs.registerLanguage('ini', ini)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('c', c)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('c++', cpp)
hljs.registerLanguage('makefile', makefile)
hljs.registerLanguage('make', makefile)
hljs.registerLanguage('x86asm', x86asm)
hljs.registerLanguage('asm', x86asm)

const markdown = md({
  html: true,
  linkify: true,
  breaks: false,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch {
        /* 忽略高亮失败，回退为纯文本 */
      }
    }
    return ''
  },
})

// GitHub 风格标题 slug：小写、去标点、空格转 -、保留中文字符，重复追加 -1/-2。
// 与 Typora/VSCode/GitHub 渲染出的锚点一致，正文里手写的目录链接才能对得上。
function githubSlug(text, used) {
  let s = text
    .trim()
    .toLowerCase()
    .replace(/[`'"!?:;,.[\]{}<>#+*/\\|~^%$&=@；，。！？：：（）【】《》「」‘’“”…—–·、]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-_\u4e00-\u9fff]/g, '')
  if (!s) s = 'section'
  if (used.has(s)) {
    const n = used.get(s) + 1
    used.set(s, n)
    s = `${s}-${n}`
  } else {
    used.set(s, 0)
  }
  return s
}

// 给 h2/h3 注入锚点 id，并在 env.toc 收集目录项
const defaultHeadingOpen =
  markdown.renderer.rules.heading_open ||
  ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options))

markdown.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
  const tag = tokens[idx].tag
  if ((tag === 'h2' || tag === 'h3') && env?.collectToc) {
    env.toc = env.toc || []
    env.used = env.used || new Map()
    const id = githubSlug(tokens[idx + 1].content, env.used)
    tokens[idx].attrSet('id', id)
    // heading_open 的下一个 token 一定是 inline，其 content 即标题原文
    env.toc.push({ id, level: Number(tag.slice(1)), text: tokens[idx + 1].content })
  }
  return defaultHeadingOpen(tokens, idx, options, env, self)
}

// collectToc=true 时返回 { html, toc: [{id, level, text}] }，否则只返回 html 字符串
export function renderMarkdown(source, collectToc = false) {
  if (!collectToc) return markdown.render(source)
  const env = { collectToc: true, toc: [] }
  const html = markdown.render(source, env)
  return { html, toc: env.toc }
}
