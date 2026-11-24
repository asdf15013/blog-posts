// CTF 工具集 v2：古典密码、XOR、RC4、中文趣味编码、编码识别、字频、JSON。
// 全部纯前端实现；与佛论禅按 keyfc 原版算法（AES-256-CBC + 汉字字典）移植。
import { base64Decode, hexDecode, base32Decode, base58Decode, urlDecode, unicodeUnescape, morseDecode } from './cryptoTools.js'

/* ==================== 古典密码 ==================== */

// 凯撒：仅字母位移，保留大小写与非字母
export function caesar(text, shift) {
  const s = ((shift % 26) + 26) % 26
  return text.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= 'Z' ? 65 : 97
    return String.fromCharCode(((c.charCodeAt(0) - base + s) % 26) + base)
  })
}

export function caesarBrute(text) {
  const out = []
  for (let i = 1; i <= 25; i++) out.push({ shift: i, text: caesar(text, i) })
  return out
}

// 栅栏密码：zigzag 读出（加密）/按行还原（解密）
export function railFence(text, rails, encrypt = true) {
  const n = Math.max(2, Math.min(rails, Math.max(2, Math.floor(text.length / 2))))
  if (encrypt) {
    const rows = Array.from({ length: n }, () => '')
    let r = 0
    let dir = 1
    for (const ch of text) {
      rows[r] += ch
      if (r === 0) dir = 1
      else if (r === n - 1) dir = -1
      r += dir
    }
    return rows.join('')
  }
  // 解密：按 zigzag 位置标记还原
  const pattern = []
  let r = 0
  let dir = 1
  for (let i = 0; i < text.length; i++) {
    pattern.push(r)
    if (r === 0) dir = 1
    else if (r === n - 1) dir = -1
    r += dir
  }
  const rowsLen = Array.from({ length: n }, () => 0)
  for (const p of pattern) rowsLen[p]++
  const rows = []
  let pos = 0
  for (let i = 0; i < n; i++) {
    rows.push(text.slice(pos, pos + rowsLen[i]).split(''))
    pos += rowsLen[i]
  }
  let out = ''
  for (const p of pattern) out += rows[p].shift()
  return out
}

export function railFenceBrute(text) {
  const out = []
  const max = Math.min(16, Math.max(2, Math.floor(text.length / 2)))
  for (let n = 2; n <= max; n++) out.push({ rails: n, text: railFence(text, n, false) })
  return out
}

// 维吉尼亚
export function vigenere(text, key, encrypt = true) {
  const k = key.replace(/[^a-zA-Z]/g, '').toLowerCase()
  if (!k) throw new Error('密钥需包含字母')
  let ki = 0
  return text.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= 'Z' ? 65 : 97
    const shift = encrypt
      ? k.charCodeAt(ki % k.length) - 97
      : 26 - ((k.charCodeAt(ki % k.length) - 97) % 26)
    ki++
    return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base)
  })
}

/* ==================== XOR ==================== */

const te = new TextEncoder()
const td = new TextDecoder()

export function xorBytes(input, key) {
  const out = new Uint8Array(input.length)
  for (let i = 0; i < input.length; i++) out[i] = input[i] ^ key[i % key.length]
  return out
}

export function xorText(text, keyStr) {
  if (!keyStr) throw new Error('请输入密钥')
  const out = xorBytes(te.encode(text), te.encode(keyStr))
  return {
    hex: [...out].map((b) => b.toString(16).padStart(2, '0')).join(''),
    text: td.decode(out),
  }
}

function printableScore(bytes) {
  if (!bytes.length) return 0
  let ok = 0
  for (const b of bytes) {
    if ((b >= 32 && b <= 126) || b === 10 || b === 13 || b === 9) ok++
  }
  return ok / bytes.length
}

// 英语字母频率权重（etaoin…），用于给爆破结果按“像不像人话”排序
const FREQ_WEIGHT = { e: 12.7, t: 9.1, a: 8.2, o: 7.5, i: 7.0, n: 6.7, s: 6.3, h: 6.1, r: 6.0, d: 4.3, l: 4.0, u: 2.8, m: 2.4, w: 2.4, f: 2.2, g: 2.0, y: 2.0, p: 1.9, b: 1.5, v: 1.0, k: 0.8, j: 0.15, x: 0.15, q: 0.1, z: 0.07, ' ': 14.0 }

function englishScore(bytes) {
  if (!bytes.length) return 0
  let weight = 0
  let printable = 0
  for (const b of bytes) {
    if ((b >= 32 && b <= 126) || b === 10) printable++
    const c = String.fromCharCode(b).toLowerCase()
    weight += FREQ_WEIGHT[c] || (/[0-9'\"{}_,.!?:;()\-\n]/.test(c) ? 0.5 : 0)
  }
  // 可打印占比门槛 + 频率权重得分
  return (printable / bytes.length) * 0.4 + Math.min(1, weight / (bytes.length * 14)) * 0.6
}

// 单字节密钥爆破：按英文字符频率加权排序，真正可读的排最前
export function xorBruteSingle(text) {
  const input = te.encode(text)
  const scored = []
  for (let k = 1; k < 256; k++) {
    const out = xorBytes(input, new Uint8Array([k]))
    const print = printableScore(out)
    if (print < 0.9) continue
    scored.push({ key: k, keyChar: String.fromCharCode(k), text: td.decode(out), score: englishScore(out) })
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, 16)
}

/* ==================== RC4 ==================== */

export function rc4(keyStr, inputStr) {
  if (!keyStr) throw new Error('请输入密钥')
  const key = te.encode(keyStr)
  // KSA
  const S = Array.from({ length: 256 }, (_, i) => i)
  let j = 0
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + key[i % key.length]) % 256
    ;[S[i], S[j]] = [S[j], S[i]]
  }
  // PRGA
  const input = te.encode(inputStr)
  const out = new Uint8Array(input.length)
  let i = 0
  j = 0
  for (let n = 0; n < input.length; n++) {
    i = (i + 1) % 256
    j = (j + S[i]) % 256
    ;[S[i], S[j]] = [S[j], S[i]]
    out[n] = input[n] ^ S[(S[i] + S[j]) % 256]
  }
  const text = td.decode(out)
  return { hex: [...out].map((b) => b.toString(16).padStart(2, '0')).join(''), text }
}

// hex 输入版：解密时粘贴 rc4 输出的 hex 即可无损往返
export function rc4Hex(keyStr, hexStr) {
  if (!keyStr) throw new Error('请输入密钥')
  if (!/^[0-9a-fA-F]+$/.test(hexStr.trim()) || hexStr.trim().length % 2) throw new Error('输入不是合法的十六进制')
  const input = new Uint8Array(hexStr.trim().match(/.{2}/g).map((h) => parseInt(h, 16)))
  const fake = { length: input.length }
  // 复用 rc4 的流逻辑
  const key = te.encode(keyStr)
  const S = Array.from({ length: 256 }, (_, i) => i)
  let j = 0
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + key[i % key.length]) % 256
    ;[S[i], S[j]] = [S[j], S[i]]
  }
  const out = new Uint8Array(input.length)
  let i2 = 0
  j = 0
  for (let n = 0; n < input.length; n++) {
    i2 = (i2 + 1) % 256
    j = (j + S[i2]) % 256
    ;[S[i2], S[j]] = [S[j], S[i2]]
    out[n] = input[n] ^ S[(S[i2] + S[j]) % 256]
  }
  return { hex: [...out].map((b) => b.toString(16).padStart(2, '0')).join(''), text: td.decode(out) }
}

/* ==================== 核心价值观编码 ==================== */

const CV_ALPHABET = '富强民主文明和谐自由平等公正法治爱国敬业友善'

export function coreValuesEncode(text) {
  return [...te.encode(text)].map((b) => CV_ALPHABET[b >> 4] + CV_ALPHABET[b & 15]).join('')
}

export function coreValuesDecode(text) {
  const clean = text.replace(/\s/g, '')
  if (clean.length % 2) throw new Error('长度应为偶数个汉字')
  const bytes = []
  for (let i = 0; i < clean.length; i += 2) {
    const hi = CV_ALPHABET.indexOf(clean[i])
    const lo = CV_ALPHABET.indexOf(clean[i + 1])
    if (hi < 0 || hi > 15 || lo < 0) throw new Error(`「${clean[i]}${clean[i + 1]}」不是合法字对`)
    bytes.push((hi << 4) | lo)
  }
  return td.decode(new Uint8Array(bytes))
}

/* ==================== 与佛论禅（keyfc tudou 原版算法） ==================== */

const TUDOU = (
  '滅苦婆娑耶陀跋多漫都殿悉夜爍帝吉利阿無南那怛喝羯勝摩伽謹波者穆僧室藝尼瑟地彌菩提蘇醯盧呼舍佛參沙' +
  '伊隸麼遮闍度蒙孕薩夷迦他姪豆特逝朋輸楞栗寫數曳諦羅曰咒即密若般故不實真訶切一除能等是上明大神知三' +
  '藐耨得依諸世槃涅竟究想夢倒顛離遠怖恐有礙心所以亦智道。集盡死老至'
)
const BYTEMARK = '冥奢梵呐俱哆怯諳罰侄缽皤'
const TUDOU_PREFIX = '佛曰：'

async function tudouAes(bytes, encrypt) {
  const key = await crypto.subtle.importKey(
    'raw',
    te.encode('XDXDtudou@KeyFansClub^_^Encode!!'),
    { name: 'AES-CBC' },
    false,
    [encrypt ? 'encrypt' : 'decrypt'],
  )
  // 注意不能解构 subtle.encrypt（会丢 this）
  const buf = encrypt
    ? await crypto.subtle.encrypt({ name: 'AES-CBC', iv: te.encode('Potato@Key@_@=_=') }, key, bytes)
    : await crypto.subtle.decrypt({ name: 'AES-CBC', iv: te.encode('Potato@Key@_@=_=') }, key, bytes)
  return new Uint8Array(buf)
}

// UTF-16LE 编解码（原版格式）
function utf16leEncode(str) {
  const out = new Uint8Array(str.length * 2)
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i)
    out[i * 2] = c & 0xff
    out[i * 2 + 1] = c >> 8
  }
  return out
}
function utf16leDecode(bytes) {
  let out = ''
  for (let i = 0; i + 1 < bytes.length; i += 2) out += String.fromCharCode(bytes[i] | (bytes[i + 1] << 8))
  return out
}

export async function tudouEncode(text) {
  const encrypted = await tudouAes(utf16leEncode(text), true) // WebCrypto 自动做 PKCS7
  let out = TUDOU_PREFIX
  for (const b of encrypted) {
    if (b < 128) out += TUDOU[b]
    else out += BYTEMARK[Math.floor(Math.random() * BYTEMARK.length)] + TUDOU[b - 128]
  }
  return out
}

export async function tudouDecode(text) {
  let body = text.trim()
  if (body.startsWith(TUDOU_PREFIX)) body = body.slice(TUDOU_PREFIX.length)
  else if (!TUDOU.includes(body[0]) && !BYTEMARK.includes(body[0])) {
    throw new Error('不是佛曰格式（应以「佛曰：」开头）')
  }
  const bytes = []
  for (let i = 0; i < body.length; i++) {
    const ch = body[i]
    if (BYTEMARK.includes(ch)) {
      const next = body[++i]
      const idx = TUDOU.indexOf(next)
      if (idx < 0) throw new Error(`无法识别的字符「${next}」`)
      bytes.push(idx + 128)
    } else {
      const idx = TUDOU.indexOf(ch)
      if (idx < 0) throw new Error(`无法识别的字符「${ch}」`)
      bytes.push(idx)
    }
  }
  const decrypted = await tudouAes(new Uint8Array(bytes), false)
  return utf16leDecode(decrypted)
}

/* ==================== 编码自动识别 ==================== */

function safe(fn) {
  try {
    return fn()
  } catch {
    return null
  }
}

export function detectEncodings(text) {
  const t = text.trim()
  if (!t) return []
  const out = []
  const push = (name, decoded, desc) => {
    if (decoded == null || decoded === '' || decoded === t) return
    // 打印字符占比评分
    let printable = 0
    for (const ch of decoded) {
      const c = ch.codePointAt(0)
      if ((c >= 32 && c <= 126) || c === 10 || (c >= 0x4e00 && c <= 0x9fff) || (c >= 0x3000 && c <= 0x303f)) printable++
    }
    const score = printable / [...decoded].length
    if (score > 0.6) out.push({ name, decoded, score, desc })
  }

  if (/^[A-Za-z0-9+/]+={0,2}$/.test(t) && t.length % 4 === 0 && t.length >= 8)
    push('Base64', safe(() => base64Decode(t)), '标准 Base64（含 padding 校验）')
  if (/^[A-Za-z0-9\-_]+$/.test(t) && t.length >= 8 && !t.includes('+'))
    push('Base64URL', safe(() => base64Decode(t.replace(/-/g, '+').replace(/_/g, '/'))), 'URL 安全变体')
  if (/^[A-Z2-7]+=*$/.test(t) && t.length >= 8)
    push('Base32', safe(() => base32Decode(t)), 'RFC 4648 大写字母表')
  if (/^(0x|[0-9a-fA-F]{2})+$/.test(t.replace(/\s/g, '')) && t.replace(/[^0-9a-fA-F]/g, '').length % 2 === 0)
    push('Hex', safe(() => hexDecode(t)), '十六进制转文本')
  if (/^[1-9A-HJ-NP-Za-km-z]+$/.test(t) && t.length >= 6)
    push('Base58', safe(() => base58Decode(t)), 'Bitcoin 字母表')
  if (t.includes('%') && /%[0-9a-fA-F]{2}/.test(t)) push('URL 编码', safe(() => urlDecode(t)), '百分号解码')
  if (/^[\s.\-\/·]+$/.test(t) && /[.-]/.test(t)) push('摩斯电码', safe(() => morseDecode(t)), '点划分隔')
  if (/\\u[0-9a-fA-F]{4}/.test(t)) push('Unicode 转义', safe(() => unicodeUnescape(t)), '\\uXXXX 解码')
  if (new Set(CV_ALPHABET).size && [...t].every((c) => CV_ALPHABET.includes(c)) && t.length >= 4)
    push('核心价值观', safe(() => coreValuesDecode(t)), '24 字表 hex 变体')
  if (t.startsWith(TUDOU_PREFIX) || (BYTEMARK.includes(t[0]) && TUDOU.includes(t[1])))
    out.push({ name: '与佛论禅', decoded: '（异步解密，请用「中文趣味编码」工具）', score: 0.7, desc: '佛曰格式' })
  if (/[a-zA-Z]/.test(t))
    push('ROT13', safe(() => caesar(t, 13)), '可继续点结果再分析')

  return out.sort((a, b) => b.score - a.score)
}

// 贪心自动链：优先确定性解码（Base 家族等），ROT13 仅作兜底且不作为终点
export function autoDecodeChain(text, maxDepth = 4) {
  const chain = []
  const seen = new Set([text.trim()])
  let cur = text.trim()
  for (let d = 0; d < maxDepth; d++) {
    const cands = detectEncodings(cur).filter((c) => c.name !== '与佛论禅' && !seen.has(c.decoded))
    const best = cands.find((c) => c.name !== 'ROT13') || cands[0]
    if (!best) break
    chain.push({ name: best.name, text: best.decoded })
    seen.add(best.decoded)
    cur = best.decoded
  }
  // 尾部若是 ROT13（可能把已解出的原文又转走），裁掉
  while (chain.length && chain[chain.length - 1].name === 'ROT13') {
    chain.pop()
  }
  const result = chain.length ? chain[chain.length - 1].text : text.trim()
  return { chain, result }
}

/* ==================== 字频统计 ==================== */

export function charFrequency(text) {
  const letters = {}
  let letterTotal = 0
  const all = {}
  for (const ch of text) {
    all[ch] = (all[ch] || 0) + 1
    const lower = ch.toLowerCase()
    if (/[a-z]/.test(lower)) {
      letters[lower] = (letters[lower] || 0) + 1
      letterTotal++
    }
  }
  const letterList = Object.entries(letters)
    .map(([ch, count]) => ({ ch, count, pct: letterTotal ? (count / letterTotal) * 100 : 0 }))
    .sort((a, b) => b.count - a.count)
  const top = Object.entries(all)
    .map(([ch, count]) => ({ ch, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12)
  return { letters: letterList, letterTotal, top, totalChars: [...text].length }
}

// 英语常见字母频率（百分比，供对照）
export const EN_FREQ = [
  ['e', 12.7], ['t', 9.1], ['a', 8.2], ['o', 7.5], ['i', 7.0], ['n', 6.7], ['s', 6.3],
  ['h', 6.1], ['r', 6.0], ['d', 4.3], ['l', 4.0], ['u', 2.8],
]

/* ==================== JSON 格式化 ==================== */

export function formatJson(text, spaces = 2) {
  try {
    const obj = JSON.parse(text)
    return { ok: true, output: JSON.stringify(obj, null, spaces) }
  } catch (e) {
    // 从报错 position 定位行列
    const m = String(e.message).match(/position (\d+)/)
    let pos = null
    let line = null
    let col = null
    if (m) {
      pos = Number(m[1])
      const before = text.slice(0, pos)
      line = before.split('\n').length
      col = pos - before.lastIndexOf('\n')
    }
    return { ok: false, error: e.message, line, col }
  }
}

export function minifyJson(text) {
  const r = formatJson(text)
  if (!r.ok) return r
  return { ok: true, output: JSON.stringify(JSON.parse(text)) }
}
