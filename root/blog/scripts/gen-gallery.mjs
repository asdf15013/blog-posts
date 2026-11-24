// 程序化画廊生成器：50 张 SVG（7 家族），种子随机保证每张独一无二。
// 用法：node scripts/gen-gallery.mjs [输出目录]
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OUT = process.argv[2] || '/root/blog-gallery'

// mulberry32 种子随机
function rng(seed) {
  let a = seed >>> 0
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const SIZES = {
  land: [1200, 675],
  sq: [900, 900],
  vert: [800, 1000],
}
const pickSize = (r) => {
  const roll = r()
  if (roll < 0.55) return SIZES.land
  if (roll < 0.85) return SIZES.sq
  return SIZES.vert
}

const svgWrap = (w, h, inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">` + inner + '</svg>'

/* ---------- 星空 ---------- */
function star(seed) {
  const r = rng(seed)
  const [w, h] = pickSize(r)
  const hues = [
    ['#0b1026', '#1b2550', '#2c3a6e'],
    ['#170f2e', '#2c1a4d', '#452a6e'],
    ['#0d1b2a', '#16324f', '#274472'],
  ]
  const [c1, c2, c3] = hues[Math.floor(r() * hues.length)]
  let s = `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset=".6" stop-color="${c2}"/><stop offset="1" stop-color="${c3}"/></linearGradient>`
  const nc = Math.floor(r() * 2) + 1
  for (let i = 0; i < nc; i++) {
    const x = Math.round(r() * w), y = Math.round(r() * h * 0.7), rr = Math.round(140 + r() * 260)
    s += `<radialGradient id="n${i}"><stop offset="0" stop-color="${r() > 0.5 ? '#7b6ba8' : '#4d9fff'}" opacity=".35"/><stop offset="1" stop-color="transparent"/></radialGradient>`
    s += `<circle cx="${x}" cy="${y}" r="${rr}" fill="url(#n${i})"/>`
  }
  s += '</defs><rect width="100%" height="100%" fill="url(#g)"/>'
  const stars = Math.floor(50 + r() * 60)
  let st = ''
  for (let i = 0; i < stars; i++) {
    st += `<circle cx="${(r() * w).toFixed(0)}" cy="${(r() * h).toFixed(0)}" r="${(0.8 + r() * 1.6).toFixed(1)}" fill="#fff" opacity="${(0.35 + r() * 0.6).toFixed(2)}"/>`
  }
  s += st
  // 月亮/行星 60%
  if (r() > 0.4) {
    const mx = w * (0.62 + r() * 0.25), my = h * (0.16 + r() * 0.2), mr = 34 + r() * 40
    if (r() > 0.5) s += `<circle cx="${mx}" cy="${my}" r="${mr}" fill="#f4f0d8" opacity=".92"/><circle cx="${mx + mr * 0.4}" cy="${my - mr * 0.3}" r="${mr}" fill="${c2}"/>`
    else {
      s += `<circle cx="${mx}" cy="${my}" r="${mr}" fill="#6db4ff" opacity=".9"/><ellipse cx="${mx}" cy="${my}" rx="${mr * 1.8}" ry="${mr * 0.5}" fill="none" stroke="#c9c2ff" stroke-width="3" opacity=".7" transform="rotate(-18 ${mx} ${my})"/>`
    }
  }
  // 流星 40%
  if (r() > 0.6) {
    const x1 = w * r() * 0.7, y1 = h * r() * 0.3
    s += `<line x1="${x1}" y1="${y1}" x2="${x1 + 130}" y2="${y1 + 46}" stroke="#fff" stroke-width="2.4" opacity=".8" stroke-linecap="round"/>`
  }
  // 远山 50%
  if (r() > 0.5) {
    s += `<path d="M0 ${h * 0.82} Q${w * 0.3} ${h * 0.72} ${w * 0.55} ${h * 0.8} T${w} ${h * 0.78} V${h} H0 Z" fill="#10142c" opacity=".95"/>`
  }
  return svgWrap(w, h, s)
}

/* ---------- 风景插画 ---------- */
function scene(seed) {
  const r = rng(seed + 700)
  const [w, h] = pickSize(r)
  const skies = [
    ['#2b3a67', '#7b6ba8', '#e8a4b8'],
    ['#dfe8e4', '#a8c4b8', '#7aa08e'],
    ['#f7c8a0', '#e8956b', '#a45a7e'],
    ['#1b2550', '#31456e', '#5a789e'],
  ]
  const sky = skies[Math.floor(r() * skies.length)]
  let s = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">`
  sky.forEach((c, i) => (s += `<stop offset="${i / (sky.length - 1)}" stop-color="${c}"/>`))
  s += '</linearGradient></defs><rect width="100%" height="100%" fill="url(#sky)"/>'
  // 日/月
  const sx = w * (0.2 + r() * 0.6), sy = h * (0.18 + r() * 0.25), sr = 40 + r() * 50
  s += `<circle cx="${sx.toFixed(0)}" cy="${sy.toFixed(0)}" r="${sr.toFixed(0)}" fill="${r() > 0.5 ? '#ffe9c9' : '#fff'}" opacity=".9"/><circle cx="${sx.toFixed(0)}" cy="${sy.toFixed(0)}" r="${(sr * 1.6).toFixed(0)}" fill="#ffe9c9" opacity=".15"/>`
  // 层叠山（3~4 层随机峰）
  const layers = 3 + Math.floor(r() * 2)
  for (let l = 0; l < layers; l++) {
    const base = h * (0.55 + (l / layers) * 0.4)
    const shade = 0.25 + (l / layers) * 0.45
    const col = `rgba(${Math.round(40 + shade * 30)},${Math.round(38 + shade * 24)},${Math.round(80 + shade * 30)},1)`
    let d = `M0 ${base}`
    let x = 0
    while (x < w) {
      const nx = x + w * (0.12 + r() * 0.18)
      const peak = base - h * (0.06 + r() * 0.14)
      d += ` L${x + (nx - x) / 2} ${peak.toFixed(0)} L${nx.toFixed(0)} ${(base + (r() - 0.5) * 30).toFixed(0)}`
      x = nx
    }
    d += ` L${w} ${h} L0 ${h} Z`
    s += `<path d="${d}" fill="${col}"/>`
  }
  // 飞鸟
  if (r() > 0.5) s += `<g stroke="#1f1a35" stroke-width="3.4" fill="none" opacity=".65"><path d="M${w * 0.3} ${h * 0.3} q14 -10 28 0"/><path d="M${w * 0.3 + 40} ${h * 0.33} q12 -9 24 0"/></g>`
  return svgWrap(w, h, s)
}

/* ---------- 水墨和风 ---------- */
function ink(seed) {
  const r = rng(seed + 1400)
  const [w, h] = pickSize(r)
  let s = `<defs><filter id="wash" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${10 + r() * 10}"/></filter></defs>`
  s += `<rect width="100%" height="100%" fill="#f6f3ea"/>`
  // 远山淡墨
  const hills = 2 + Math.floor(r() * 2)
  for (let i = 0; i < hills; i++) {
    const y = h * (0.42 + i * 0.16)
    const op = 0.12 + i * 0.1
    s += `<ellipse cx="${w * (0.3 + r() * 0.4)}" cy="${y}" rx="${w * (0.42 + r() * 0.25)}" ry="${h * (0.1 + r() * 0.09)}" fill="#3a352d" opacity="${op.toFixed(2)}" filter="url(#wash)"/>`
  }
  // 禅圆 ensō
  const ex = w * (0.6 + r() * 0.25), ey = h * (0.3 + r() * 0.2), er = Math.min(w, h) * (0.16 + r() * 0.1)
  s += `<circle cx="${ex.toFixed(0)}" cy="${ey.toFixed(0)}" r="${er.toFixed(0)}" fill="none" stroke="#1c1a17" stroke-width="${(8 + r() * 10).toFixed(0)}" stroke-linecap="round" stroke-dasharray="${(er * 4.8).toFixed(0)} ${(er * 1.6).toFixed(0)}" transform="rotate(${Math.round(r() * 360)} ${ex.toFixed(0)} ${ey.toFixed(0)})" opacity=".9"/>`
  // 竹枝
  if (r() > 0.4) {
    const bx = w * 0.12
    s += `<g stroke="#4a443a" stroke-width="5" fill="none" opacity=".8"><path d="M${bx} ${h} Q${bx + 20} ${h * 0.6} ${bx + 8} ${h * 0.28}"/></g>`
    for (let i = 0; i < 4; i++) {
      const ly = h * (0.36 + r() * 0.3)
      s += `<path d="M${bx + 8} ${ly} q${30 + r() * 30} ${-6 - r() * 10} ${60 + r() * 30} ${-2}" stroke="#5a544a" stroke-width="3" fill="none" opacity=".7"/>`
    }
  }
  // 朱印
  const px = w - 64, py = h - 74
  s += `<rect x="${px}" y="${py}" width="40" height="40" fill="none" stroke="#b3352c" stroke-width="3" opacity=".85"/><text x="${px + 20}" y="${py + 27}" text-anchor="middle" font-size="17" fill="#b3352c" font-family="serif" font-weight="900">岩</text>`
  // 惊鹤/飞雁一笔
  s += `<g stroke="#1c1a17" stroke-width="2.6" fill="none" opacity=".6"><path d="M${w * 0.2} ${h * 0.22} q16 -12 32 0"/><path d="M${w * 0.2 + 42} ${h * 0.245} q14 -10 28 0"/></g>`
  return svgWrap(w, h, s)
}

/* ---------- 抽象几何 ---------- */
function geo(seed) {
  const r = rng(seed + 2100)
  const [w, h] = pickSize(r)
  const PAL = ['#e8590c', '#1a1a1a', '#f4d35e', '#4ecdc4', '#6d5ef2', '#f7f3ea', '#ff8fab']
  const bg = PAL[Math.floor(r() * PAL.length)]
  let s = `<rect width="100%" height="100%" fill="${bg}"/>`
  const n = 9 + Math.floor(r() * 7)
  for (let i = 0; i < n; i++) {
    const col = PAL[Math.floor(r() * PAL.length)]
    if (col === bg) continue
    const x = r() * w, y = r() * h, rr = Math.min(w, h) * (0.1 + r() * 0.28)
    const kind = Math.floor(r() * 5)
    if (kind === 0) s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rr.toFixed(0)}" fill="${col}"/>`
    else if (kind === 1) s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rr.toFixed(0)}" fill="none" stroke="${col}" stroke-width="${(rr * 0.16).toFixed(0)}"/>`
    else if (kind === 2) s += `<path d="M${x.toFixed(0)} ${y.toFixed(0)} h${rr.toFixed(0)} a${rr.toFixed(0)} ${rr.toFixed(0)} 0 0 1 -${rr.toFixed(0)} ${rr.toFixed(0)} Z" fill="${col}" transform="rotate(${Math.round(r() * 360)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`
    else if (kind === 3) s += `<polygon points="${x.toFixed(0)},${(y - rr).toFixed(0)} ${(x + rr).toFixed(0)},${(y + rr * 0.8).toFixed(0)} ${(x - rr).toFixed(0)},${(y + rr * 0.8).toFixed(0)}" fill="${col}" opacity="${(0.8 + r() * 0.2).toFixed(2)}"/>`
    else s += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${(rr * 1.4).toFixed(0)}" height="${(rr * 0.5).toFixed(0)}" fill="${col}" transform="rotate(${Math.round(r() * 90)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`
  }
  // 细网格线增加构成感
  s += `<g stroke="#1a1a1a" stroke-width="1" opacity=".12">`
  for (let i = 1; i < 5; i++) s += `<line x1="0" y1="${(h / 5) * i}" x2="${w}" y2="${(h / 5) * i}"/>`
  s += '</g>'
  return svgWrap(w, h, s)
}

/* ---------- 渐变海报 ---------- */
function grad(seed) {
  const r = rng(seed + 2800)
  const [w, h] = pickSize(r)
  const PAIRS = [
    ['#ff9a9e', '#a18cd1', '#fad0c4'],
    ['#0f2027', '#2c5364', '#5ef2d6'],
    ['#e8a4b8', '#6d5ef2', '#2b3a67'],
    ['#f6d365', '#fda085', '#c0392b'],
    ['#a1c4fd', '#c2e9fb', '#f2f7ff'],
    ['#0b1026', '#6d5ef2', '#00e5ff'],
  ]
  const p = PAIRS[Math.floor(r() * PAIRS.length)]
  const ang = Math.round(r() * 360)
  let s = `<defs><linearGradient id="g" gradientTransform="rotate(${ang} 0.5 0.5)"><stop offset="0" stop-color="${p[0]}"/><stop offset="${(0.4 + r() * 0.3).toFixed(2)}" stop-color="${p[1]}"/><stop offset="1" stop-color="${p[2] || p[0]}"/></linearGradient>`
  for (let i = 0; i < 2; i++) {
    const x = Math.round(r() * w), y = Math.round(r() * h)
    s += `<radialGradient id="o${i}"><stop offset="0" stop-color="#fff" opacity=".4"/><stop offset="1" stop-color="transparent"/></radialGradient>`
    s += `<circle cx="${x}" cy="${y}" r="${Math.round(Math.min(w, h) * (0.25 + r() * 0.3))}" fill="url(#o${i})"/>`
  }
  s += '</defs><rect width="100%" height="100%" fill="url(#g)"/>'
  // 一条细线 + 一个小圆，增加"海报感"
  s += `<line x1="${w * 0.12}" y1="${h * 0.82}" x2="${w * 0.88}" y2="${h * 0.82}" stroke="#fff" stroke-width="2" opacity=".6"/>`
  s += `<circle cx="${w * (0.2 + r() * 0.6)}" cy="${h * 0.3}" r="${8 + r() * 14}" fill="none" stroke="#fff" stroke-width="2" opacity=".7"/>`
  return svgWrap(w, h, s)
}

/* ---------- 像素艺术 ---------- */
function pixel(seed) {
  const r = rng(seed + 3500)
  const [w, h] = pickSize(r)
  const GRID = 14
  const PALS = [
    ['#1a1c2c', '#ef7d57', '#ffcd75', '#a7d0cd'],
    ['#f4f4f4', '#e8590c', '#141414', '#f4d35e'],
    ['#0b0f0d', '#2ef26e', '#7ee787', '#d8ffe8'],
    ['#29366f', '#73eff7', '#ffcd75', '#f4f4f4'],
    ['#fef5e7', '#ff6b6b', '#4ecdc4', '#333'],
  ]
  const pal = PALS[Math.floor(r() * PALS.length)]
  const bg = pal[0]
  const cell = w / GRID
  const rows = Math.ceil(h / cell)
  // 对称生成（左右镜像更像图案）
  const half = []
  for (let y = 0; y < rows; y++) {
    half[y] = []
    for (let x = 0; x < Math.ceil(GRID / 2); x++) {
      half[y][x] = r() > 0.55 ? 1 + Math.floor(r() * (pal.length - 1)) : 0
    }
  }
  let s = `<rect width="100%" height="100%" fill="${bg}"/>`
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < GRID; x++) {
      const v = half[y]?.[Math.min(x, GRID - 1 - x)] || 0
      if (v) s += `<rect x="${(x * cell).toFixed(1)}" y="${(y * cell).toFixed(1)}" width="${(cell + 0.5).toFixed(1)}" height="${(cell + 0.5).toFixed(1)}" fill="${pal[v]}"/>`
    }
  }
  // 像素边框
  s += `<rect x="4" y="4" width="${w - 8}" height="${h - 8}" fill="none" stroke="${pal[1]}" stroke-width="8"/>`
  return svgWrap(w, h, s)
}

/* ---------- 极客科技 ---------- */
function geek(seed) {
  const r = rng(seed + 4200)
  const [w, h] = pickSize(r)
  let s = `<rect width="100%" height="100%" fill="#0b0f0d"/>`
  // 二进制流
  const rows = 10 + Math.floor(r() * 8)
  for (let i = 0; i < rows; i++) {
    let bin = ''
    const len = 26 + Math.floor(r() * 20)
    for (let j = 0; j < len; j++) bin += r() > 0.5 ? '1' : '0'
    const y = ((i + 1) / (rows + 1)) * h
    s += `<text x="${(r() * 30 + 8).toFixed(0)}" y="${y.toFixed(0)}" font-family="monospace" font-size="${(12 + r() * 6).toFixed(0)}" fill="#2ef26e" opacity="${(0.08 + r() * 0.22).toFixed(2)}">${bin}</text>`
  }
  // 电路走线
  const paths = 3 + Math.floor(r() * 3)
  for (let i = 0; i < paths; i++) {
    let x = r() * w, y = r() * h
    let d = `M${x.toFixed(0)} ${y.toFixed(0)}`
    const segs = 3 + Math.floor(r() * 3)
    for (let k = 0; k < segs; k++) {
      if (r() > 0.5) { const nx = x + (r() - 0.5) * w * 0.5; d += ` L${nx.toFixed(0)} ${y.toFixed(0)}`; x = nx }
      else { const ny = y + (r() - 0.5) * h * 0.5; d += ` L${x.toFixed(0)} ${ny.toFixed(0)}`; y = ny }
    }
    const col = r() > 0.5 ? '#00e5ff' : '#ff2ea6'
    s += `<path d="${d}" fill="none" stroke="${col}" stroke-width="2.4" opacity=".75"/>`
    s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="5" fill="${col}"/>`
  }
  // 中心代码徽记
  s += `<rect x="${w / 2 - 74}" y="${h / 2 - 30}" width="148" height="60" rx="10" fill="#0b0f0d" stroke="#2ef26e" stroke-width="2" opacity=".9"/><text x="${w / 2}" y="${h / 2 + 8}" text-anchor="middle" font-family="monospace" font-size="20" fill="#2ef26e">&gt;_</text>`
  return svgWrap(w, h, s)
}

/* ==================== 生成 50 张 ==================== */
const FAMILIES = [
  ['star', star, 8],
  ['scene', scene, 7],
  ['ink', ink, 7],
  ['geo', geo, 7],
  ['grad', grad, 7],
  ['pixel', pixel, 7],
  ['geek', geek, 7],
]

mkdirSync(OUT, { recursive: true })
let count = 0
for (const [name, fn, n] of FAMILIES) {
  for (let i = 1; i <= n; i++) {
    const seed = 4200 + count * 137
    const svg = fn(seed)
    const file = join(OUT, `gallery-${name}-${String(i).padStart(2, '0')}.svg`)
    writeFileSync(file, svg)
    count++
  }
}
console.log(`生成 ${count} 张 SVG → ${OUT}`)
