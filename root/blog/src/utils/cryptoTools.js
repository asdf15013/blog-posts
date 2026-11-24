// 工具页的全部加密/编码算法实现：纯函数、无副作用，可在 node 与浏览器中运行。
// 哈希与 AES 使用浏览器原生 Web Crypto（node ≥19 也有全局 crypto.subtle）。
import md5 from 'blueimp-md5'

const enc = new TextEncoder()
const dec = new TextDecoder()

function buf2hex(buf) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function bytesToB64(bytes) {
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  return btoa(binary)
}

function b64ToBytes(b64) {
  const binary = atob(b64.replace(/\s+/g, ''))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

/* ============ Base64 ============ */

export function base64Encode(text) {
  return bytesToB64(enc.encode(text))
}

export function base64Decode(b64) {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(b64ToBytes(b64))
  } catch {
    throw new Error('不是有效的 Base64（或不是 UTF-8 文本）')
  }
}

/* ============ Hex ============ */

export function hexEncode(text) {
  return buf2hex(enc.encode(text))
}

export function hexDecode(hex) {
  const clean = hex.replace(/0x/gi, '').replace(/[^0-9a-fA-F]/g, '')
  if (!clean) throw new Error('没有可识别的十六进制字符')
  if (clean.length % 2) throw new Error('十六进制长度为奇数，请检查是否缺字符')
  const bytes = new Uint8Array(clean.length / 2)
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16)
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    throw new Error('解码出的字节不是有效 UTF-8 文本')
  }
}

/* ============ URL ============ */

export function urlEncode(text) {
  return encodeURIComponent(text)
}

export function urlDecode(text) {
  try {
    return decodeURIComponent(text)
  } catch {
    throw new Error('不是有效的 URL 编码（检查 % 转义是否完整）')
  }
}

/* ============ Unicode 转义 ============ */

export function unicodeEscape(text) {
  let out = ''
  for (const ch of text) {
    const cp = ch.codePointAt(0)
    if (cp >= 0x20 && cp <= 0x7e) {
      out += ch
    } else if (cp > 0xffff) {
      // 代理对按 UTF-16 码元拆成两个 \uXXXX（注意不能 for...of，它按码点迭代）
      for (let i = 0; i < ch.length; i++) {
        out += '\\u' + ch.charCodeAt(i).toString(16).padStart(4, '0')
      }
    } else {
      out += '\\u' + cp.toString(16).padStart(4, '0')
    }
  }
  return out
}

export function unicodeUnescape(text) {
  return text
    .replace(/\\u\{([0-9a-fA-F]{1,6})\}/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
}

/* ============ ROT13 ============ */

export function rot13(text) {
  return text.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= 'Z' ? 65 : 97
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base)
  })
}

/* ============ 摩斯电码 ============ */

const MORSE = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
  I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
  Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..',
  0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....',
  6: '-....', 7: '--...', 8: '---..', 9: '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', '/': '-..-.', ':': '---...',
  "'": '.----.', '!': '-.-.--', '-': '-....-', '(': '-.--.', ')': '-.--.-',
}
const MORSE_REV = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]))

export function morseEncode(text) {
  return text
    .toUpperCase()
    .split(/\s+/)
    .map((word) =>
      [...word]
        .map((c) => MORSE[c] || (() => { throw new Error(`摩斯电码不支持字符「${c}」`) })())
        .join(' '),
    )
    .join(' / ')
}

export function morseDecode(code) {
  return code
    .trim()
    .split(/\s*\/\s*/)
    .map((word) =>
      word
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((m) => MORSE_REV[m] || (() => { throw new Error(`无法识别的摩斯序列「${m}」`) })())
        .join(''),
    )
    .join(' ')
}

/* ============ Base32 (RFC 4648) ============ */

const B32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

export function base32Encode(text) {
  const bytes = enc.encode(text)
  let bits = 0
  let value = 0
  let out = ''
  for (const b of bytes) {
    value = (value << 8) | b
    bits += 8
    while (bits >= 5) {
      out += B32_ALPHABET[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) out += B32_ALPHABET[(value << (5 - bits)) & 31]
  while (out.length % 8) out += '='
  return out
}

export function base32Decode(text) {
  const clean = text.toUpperCase().replace(/[=\s]/g, '')
  let bits = 0
  let value = 0
  const out = []
  for (const c of clean) {
    const idx = B32_ALPHABET.indexOf(c)
    if (idx === -1) throw new Error(`Base32 中出现非法字符「${c}」`)
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array(out))
  } catch {
    throw new Error('解码结果不是有效 UTF-8 文本')
  }
}

/* ============ Base58 (Bitcoin 字母表) ============ */

const B58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const B58_MAP = Object.fromEntries([...B58_ALPHABET].map((c, i) => [c, BigInt(i)]))

export function base58Encode(text) {
  const bytes = enc.encode(text)
  // 前导 0x00 每个对应一个 '1'
  let lead = 0
  while (lead < bytes.length && bytes[lead] === 0) lead++
  let num = 0n
  for (const b of bytes) num = (num << 8n) | BigInt(b)
  let out = ''
  while (num > 0n) {
    out = B58_ALPHABET[Number(num % 58n)] + out
    num /= 58n
  }
  return '1'.repeat(lead) + out
}

export function base58Decode(text) {
  const clean = text.replace(/\s+/g, '')
  let lead = 0
  while (lead < clean.length && clean[lead] === '1') lead++
  let num = 0n
  for (const c of clean) {
    const v = B58_MAP[c]
    if (v === undefined) throw new Error(`Base58 中出现非法字符「${c}」`)
    num = num * 58n + v
  }
  const bytes = []
  while (num > 0n) {
    bytes.unshift(Number(num & 0xffn))
    num >>= 8n
  }
  const out = new Uint8Array([...new Array(lead).fill(0), ...bytes])
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(out)
  } catch {
    throw new Error('解码结果不是有效 UTF-8 文本')
  }
}

/* ============ JWT 解码（不校验签名） ============ */

function b64urlDecode(part) {
  const b64 = part.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(part.length / 4) * 4, '=')
  return new TextDecoder().decode(b64ToBytes(b64))
}

export function jwtDecode(token) {
  const parts = token.trim().split('.')
  if (parts.length < 2 || parts.length > 3 || !parts[0] || !parts[1]) {
    throw new Error('JWT 格式应为 header.payload.signature（三段，点分隔）')
  }
  try {
    return {
      header: JSON.stringify(JSON.parse(b64urlDecode(parts[0])), null, 2),
      payload: JSON.stringify(JSON.parse(b64urlDecode(parts[1])), null, 2),
      signature: parts[2] || '（无签名段）',
    }
  } catch {
    throw new Error('无法解析：header/payload 不是 Base64URL 编码的 JSON')
  }
}

/* ============ 进制转换 ============ */

// 字符集预设（字符串进制用）：字符在集合中的位置即它的“数字”值
export const BASE_CHARSETS = [
  { id: 'b62', name: 'Base62（0-9A-Za-z）', alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' },
  { id: 'b36l', name: 'Base36 小写（0-9a-z）', alphabet: '0123456789abcdefghijklmnopqrstuvwxyz' },
  { id: 'b36u', name: 'Base36 大写（0-9A-Z）', alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
  { id: 'b63', name: 'Base63（Base62+下划线，CTF 常见）', alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_' },
  { id: 'b64ctf', name: 'Base64 变体（A-Za-z0-9+/）', alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/' },
]

// 字符串 → 大整数：按字符集把字符串当作 base-N 数
export function stringToBigNumber(text, alphabet) {
  const base = BigInt(alphabet.length)
  let num = 0n
  for (const ch of text) {
    const idx = alphabet.indexOf(ch)
    if (idx === -1) {
      throw new Error(`字符「${ch}」不在所选字符集中（共 ${alphabet.length} 个字符）`)
    }
    num = num * base + BigInt(idx)
  }
  return num
}

// 大整数 → 字符串：按字符集还原
export function bigNumberToString(numStr, radix, alphabet) {
  let num = BigInt(numStr)
  if (num < 0n) throw new Error('暂不支持负数')
  const base = BigInt(alphabet.length)
  if (num === 0n) return alphabet[0]
  let out = ''
  while (num > 0n) {
    out = alphabet[Number(num % base)] + out
    num /= base
  }
  return out
}

export function bigToAllBases(num) {
  return [
    { base: 2, value: num.toString(2) },
    { base: 8, value: num.toString(8) },
    { base: 10, value: num.toString(10) },
    { base: 16, value: num.toString(16) },
    { base: 32, value: num.toString(32) },
    { base: 36, value: num.toString(36) },
  ]
}

export function convertBase(input, fromBase) {
  const clean = input.trim().toLowerCase().replace(/[\s_,]/g, '')
  if (!clean) throw new Error('请输入数字')
  if (clean.startsWith('-')) throw new Error('暂不支持负数')
  const digits = '0123456789abcdefghijklmnopqrstuvwxyz'.slice(0, fromBase)
  let num = 0n
  for (const c of clean) {
    const v = digits.indexOf(c)
    if (v === -1) throw new Error(`字符「${c}」不是合法的 ${fromBase} 进制数字`)
    num = num * BigInt(fromBase) + BigInt(v)
  }
  return [
    { base: 2, value: num.toString(2) },
    { base: 8, value: num.toString(8) },
    { base: 10, value: num.toString(10) },
    { base: 16, value: num.toString(16) },
    { base: 32, value: num.toString(32) },
    { base: 36, value: num.toString(36) },
  ]
}

/* ============ 哈希 ============ */

export async function hashText(text) {
  const data = enc.encode(text)
  const algs = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']
  const digests = await Promise.all(algs.map((a) => crypto.subtle.digest(a, data)))
  return [
    { name: 'MD5', hex: md5(text) },
    { name: 'SHA-1', hex: buf2hex(digests[0]) },
    { name: 'SHA-256', hex: buf2hex(digests[1]) },
    { name: 'SHA-384', hex: buf2hex(digests[2]) },
    { name: 'SHA-512', hex: buf2hex(digests[3]) },
  ]
}

/* ============ AES（Web Crypto，PBKDF2 派生密钥） ============ */

const PBKDF2_ITERATIONS = 100000

async function deriveAesKey(password, salt, mode) {
  const material = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, [
    'deriveKey',
  ])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    material,
    { name: mode === 'gcm' ? 'AES-GCM' : 'AES-CBC', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

function ivLength(mode) {
  return mode === 'gcm' ? 12 : 16
}

// 输出格式：base64( salt[16] + iv + ciphertext )
export async function aesEncrypt(text, password, mode = 'gcm') {
  if (!password) throw new Error('请输入密码')
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(ivLength(mode)))
  const key = await deriveAesKey(password, salt, mode)
  const algo = { name: mode === 'gcm' ? 'AES-GCM' : 'AES-CBC', iv }
  const ct = new Uint8Array(await crypto.subtle.encrypt(algo, key, enc.encode(text)))
  const out = new Uint8Array(salt.length + iv.length + ct.length)
  out.set(salt)
  out.set(iv, salt.length)
  out.set(ct, salt.length + iv.length)
  return bytesToB64(out)
}

export async function aesDecrypt(b64, password, mode = 'gcm') {
  if (!password) throw new Error('请输入密码')
  let bytes
  try {
    bytes = b64ToBytes(b64)
  } catch {
    throw new Error('密文不是有效的 Base64')
  }
  const ivLen = ivLength(mode)
  if (bytes.length < 16 + ivLen + 16) throw new Error('密文长度不正确，可能被截断')
  const salt = bytes.slice(0, 16)
  const iv = bytes.slice(16, 16 + ivLen)
  const ct = bytes.slice(16 + ivLen)
  try {
    const key = await deriveAesKey(password, salt, mode)
    const algo = { name: mode === 'gcm' ? 'AES-GCM' : 'AES-CBC', iv }
    const pt = await crypto.subtle.decrypt(algo, key, ct)
    return new TextDecoder('utf-8', { fatal: true }).decode(pt)
  } catch {
    throw new Error('解密失败：密码错误、模式不符或数据已损坏')
  }
}
