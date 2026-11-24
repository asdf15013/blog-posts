// 生成 1200x630 默认 OG 分享底图：紫→蓝渐变 + 角落光斑，纯 node（zlib+CRC32）无依赖
import { writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const W = 1200, H = 630
const px = Buffer.alloc(W * H * 3)
const c1 = [109, 94, 242], c2 = [61, 139, 253]
const orbs = [
  { x: 1000, y: 90, r: 210, c: [180, 160, 255], a: 0.35 },
  { x: 130, y: 560, r: 240, c: [100, 190, 255], a: 0.3 },
]
const lerp = (a, b, t) => a + (b - a) * t
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const t = (x / W + y / H) / 2
    let r = lerp(c1[0], c2[0], t), g = lerp(c1[1], c2[1], t), b = lerp(c1[2], c2[2], t)
    for (const o of orbs) {
      const d = Math.hypot(x - o.x, y - o.y) / o.r
      if (d < 1) {
        const k = (1 - d) * o.a
        r = lerp(r, o.c[0], k); g = lerp(g, o.c[1], k); b = lerp(b, o.c[2], k)
      }
    }
    const i = (y * W + x) * 3
    px[i] = Math.round(r); px[i + 1] = Math.round(g); px[i + 2] = Math.round(b)
  }
}
const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
const crc32 = (buf) => {
  let c = 0xffffffff
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type), data])
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}
const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4)
ihdr[8] = 8; ihdr[9] = 2
const raw = Buffer.alloc((W * 3 + 1) * H)
for (let y = 0; y < H; y++) {
  raw[y * (W * 3 + 1)] = 0
  px.copy(raw, y * (W * 3 + 1) + 1, y * W * 3, (y + 1) * W * 3)
}
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
])
writeFileSync('/root/blog/public/og-default.png', png)
console.log('og-default.png 生成:', png.length, 'bytes')
