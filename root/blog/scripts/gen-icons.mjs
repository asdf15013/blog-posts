// 生成 PWA 图标 192/512（渐变+光斑，复用 OG 生成器的纯 node PNG 编码）
import { writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

function makePng(size, file) {
  const W = size, H = size
  const px = Buffer.alloc(W * H * 3)
  const c1 = [109, 94, 242], c2 = [61, 139, 253]
  const lerp = (a, b, t) => a + (b - a) * t
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const t = (x / W + y / H) / 2
      let r = lerp(c1[0], c2[0], t), g = lerp(c1[1], c2[1], t), b = lerp(c1[2], c2[2], t)
      const d = Math.hypot(x - W * 0.8, y - H * 0.2) / (W * 0.35)
      if (d < 1) { const k = (1 - d) * 0.4; r = lerp(r, 220, k); g = lerp(g, 210, k); b = lerp(b, 255, k) }
      const i = (y * W + x) * 3
      px[i] = Math.round(r); px[i + 1] = Math.round(g); px[i + 2] = Math.round(b)
    }
  }
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    return c >>> 0
  })
  const crc32 = (buf) => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0 }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
    const body = Buffer.concat([Buffer.from(type), data])
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body))
    return Buffer.concat([len, body, crc])
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 2
  const raw = Buffer.alloc((W * 3 + 1) * H)
  for (let y = 0; y < H; y++) { raw[y * (W * 3 + 1)] = 0; px.copy(raw, y * (W * 3 + 1) + 1, y * W * 3, (y + 1) * W * 3) }
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0)),
  ])
  writeFileSync(file, png)
  console.log(file, png.length, 'bytes')
}
makePng(192, '/root/blog/public/icon-192.png')
makePng(512, '/root/blog/public/icon-512.png')
