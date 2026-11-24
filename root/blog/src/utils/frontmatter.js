/**
 * 解析 Markdown 文件头部的 frontmatter。
 * 支持简单的 key: value 形式，tags 支持逗号分隔或 [a, b] 两种写法。
 */
export function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return { data: {}, body: raw }

  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([\w$]+)\s*:\s*(.*)$/)
    if (!kv) continue
    const [, key, value] = kv
    if (key === 'tags') {
      const inner = value.replace(/^\[|\]$/g, '')
      data.tags = inner
        .split(/[,，]/)
        .map((t) => t.trim())
        .filter(Boolean)
    } else if (value === 'true' || value === 'false') {
      data[key] = value === 'true'
    } else {
      data[key] = value.trim()
    }
  }
  return { data, body: raw.slice(match[0].length) }
}
