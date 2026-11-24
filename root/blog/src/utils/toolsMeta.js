// 工具元数据：ToolsView 与命令面板共用（新增工具只改这里）
import {
  base64Encode, base64Decode, hexEncode, hexDecode, urlEncode, urlDecode,
  unicodeEscape, unicodeUnescape, rot13, morseEncode, morseDecode,
  base32Encode, base32Decode, base58Encode, base58Decode,
} from './cryptoTools.js'

export const TOOL_GROUPS = [
  {
    name: '编码解码',
    tools: [
      { id: 'base64', icon: '🔡', name: 'Base64', kind: 'transform', encLabel: '编码', decLabel: '解码', fns: [base64Encode, base64Decode], desc: '文本 ↔ Base64（完整 UTF-8 支持）' },
      { id: 'hex', icon: '🧮', name: 'Hex', kind: 'transform', encLabel: '编码', decLabel: '解码', fns: [hexEncode, hexDecode], desc: '文本 ↔ 十六进制，自动忽略空格/0x' },
      { id: 'url', icon: '🔗', name: 'URL', kind: 'transform', encLabel: '编码', decLabel: '解码', fns: [urlEncode, urlDecode], desc: 'URL 百分号编码 / 解码' },
      { id: 'unicode', icon: '🌐', name: 'Unicode', kind: 'transform', encLabel: '转义', decLabel: '反转义', fns: [unicodeEscape, unicodeUnescape], desc: '文本 ↔ \\uXXXX 转义' },
      { id: 'rot13', icon: '🔁', name: 'ROT13', kind: 'transform', single: true, encLabel: '转换', fns: [rot13], desc: '自逆凯撒位移 13' },
      { id: 'morse', icon: '📡', name: '摩斯电码', kind: 'transform', encLabel: '编码', decLabel: '解码', fns: [morseEncode, morseDecode], desc: '点划电码，词间 / 分隔' },
      { id: 'zhcode', icon: '🈶', name: '中文趣味编码', kind: 'zhcode', desc: '核心价值观 / 与佛论禅' },
    ],
  },
  {
    name: '哈希计算',
    tools: [{ id: 'hash', icon: '🔢', name: '哈希摘要', kind: 'hash', desc: 'MD5 / SHA 家族一次全算' }],
  },
  {
    name: '对称加密',
    tools: [
      { id: 'aes', icon: '🔐', name: 'AES 加解密', kind: 'aes', desc: 'AES-256 GCM/CBC + PBKDF2' },
      { id: 'rc4', icon: '🔑', name: 'RC4', kind: 'rc4', desc: '经典流密码，支持文本/Hex 输入' },
    ],
  },
  {
    name: '古典密码',
    tools: [
      { id: 'classic', icon: '🏛', name: '古典三件套', kind: 'classic', desc: '凯撒（暴力）/ 栅栏（暴力）/ 维吉尼亚' },
      { id: 'xor', icon: '🔀', name: 'XOR 异或', kind: 'xor', desc: '循环密钥异或 + 单字节密钥爆破' },
    ],
  },
  {
    name: 'CTF 常用',
    tools: [
      { id: 'detect', icon: '🪄', name: '编码识别', kind: 'detect', desc: '不知道是什么编码？粘进来一键分析与自动解码链' },
      { id: 'base32', icon: '🔠', name: 'Base32', kind: 'transform', encLabel: '编码', decLabel: '解码', fns: [base32Encode, base32Decode], desc: 'RFC 4648' },
      { id: 'base58', icon: '🅱️', name: 'Base58', kind: 'transform', encLabel: '编码', decLabel: '解码', fns: [base58Encode, base58Decode], desc: 'Bitcoin 字母表' },
      { id: 'jwt', icon: '🎫', name: 'JWT 解码', kind: 'jwt', desc: 'Header/Payload 解析' },
      { id: 'baseconv', icon: '🔢', name: '进制转换', kind: 'baseconv', desc: '数字进制 + 字符串进制' },
    ],
  },
  {
    name: '辅助工具',
    tools: [
      { id: 'freq', icon: '📊', name: '字频统计', kind: 'freq', desc: '字母频率分布，替换类密码破解辅助' },
      { id: 'timestamp', icon: '⏰', name: '时间戳转换', kind: 'timestamp', desc: 'Unix 时间戳 ↔ 日期' },
      { id: 'jsonfmt', icon: '🧾', name: 'JSON 格式化', kind: 'jsonfmt', desc: '校验 + 美化 + 压缩，错误定位行列' },
    ],
  },
]

export const ALL_TOOLS = TOOL_GROUPS.flatMap((g) => g.tools)
