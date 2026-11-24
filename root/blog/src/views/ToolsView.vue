<template>
  <div class="tools-layout">
    <!-- 工具导航 -->
    <aside class="tools-nav glass">
      <div v-for="g in groups" :key="g.name" class="nav-group">
        <div class="group-name">{{ g.name }}</div>
        <button
          v-for="t in g.tools"
          :key="t.id"
          class="tool-btn"
          :class="{ active: activeId === t.id }"
          @click="activeId = t.id"
        >
          {{ t.icon }} {{ t.name }}
        </button>
      </div>
      <p class="tools-tip">🔒 所有计算均在你的浏览器本地完成，内容不会上传到任何服务器</p>
    </aside>

    <!-- 工具面板 -->
    <section class="tool-panel glass">
      <!-- ===== 编码转换类 ===== -->
      <template v-if="tool.kind === 'transform'">
        <h1 class="tool-title">{{ tool.icon }} {{ tool.name }}</h1>
        <p class="tool-desc">{{ tool.desc }}</p>

        <div class="io-grid">
          <div class="io-pane">
            <label class="pane-label">输入</label>
            <textarea v-model="st.input" placeholder="输入内容…" spellcheck="false"></textarea>
          </div>
          <div class="io-pane">
            <label class="pane-label">
              输出
              <button v-if="st.output" class="mini-btn" @click="copy(st.output)">复制</button>
            </label>
            <textarea v-model="st.output" readonly placeholder="输出结果…" spellcheck="false"></textarea>
          </div>
        </div>

        <div class="action-row">
          <button class="btn-primary" @click="runTransform(0)">{{ tool.encLabel }}</button>
          <button v-if="!tool.single" class="btn-primary alt" @click="runTransform(1)">
            {{ tool.decLabel }}
          </button>
          <button class="btn-glass" @click="swapOutput">⇅ 输出转输入</button>
          <button class="btn-glass" @click="clearAll">清空</button>
        </div>
        <p v-if="st.error" class="error-msg">⚠ {{ st.error }}</p>
        <p v-if="st.copied" class="ok-msg">✓ 已复制到剪贴板</p>
      </template>

      <!-- ===== 哈希 ===== -->
      <template v-else-if="tool.kind === 'hash'">
        <h1 class="tool-title">🔢 哈希摘要</h1>
        <p class="tool-desc">对输入文本计算 MD5 / SHA-1 / SHA-256 / SHA-384 / SHA-512（UTF-8 编码）</p>

        <textarea
          v-model="st.input"
          class="hash-input"
          placeholder="输入要计算哈希的内容…"
          spellcheck="false"
        ></textarea>
        <div class="action-row">
          <button class="btn-primary" @click="runHash">计算全部哈希</button>
          <button class="btn-glass" @click="clearAll">清空</button>
        </div>

        <div v-if="st.results" class="hash-results">
          <div v-for="r in st.results" :key="r.name" class="hash-row">
            <span class="hash-name">{{ r.name }}</span>
            <code class="hash-value">{{ r.hex }}</code>
            <button class="mini-btn" @click="copy(r.hex)">复制</button>
          </div>
        </div>
        <p v-if="st.error" class="error-msg">⚠ {{ st.error }}</p>
      </template>

      <!-- ===== AES ===== -->
      <template v-else-if="tool.kind === 'aes'">
        <h1 class="tool-title">🔐 AES 加解密</h1>
        <p class="tool-desc">
          AES-256，PBKDF2 派生密钥（10 万次迭代）。输出格式：Base64(盐 + IV + 密文)。
          解密时请选择与加密时相同的模式。
        </p>

        <div class="form-row">
          <label class="form-field">
            <span>模式</span>
            <select v-model="st.mode" class="input">
              <option value="gcm">GCM（推荐，带完整性校验）</option>
              <option value="cbc">CBC（传统）</option>
            </select>
          </label>
          <label class="form-field grow">
            <span>密码</span>
            <input v-model="st.password" type="password" class="input" placeholder="加密口令" />
          </label>
        </div>

        <div class="io-grid">
          <div class="io-pane">
            <label class="pane-label">{{ st.lastOp === 'dec' ? '密文（Base64）' : '明文输入' }}</label>
            <textarea v-model="st.input" placeholder="输入明文或 Base64 密文…" spellcheck="false"></textarea>
          </div>
          <div class="io-pane">
            <label class="pane-label">
              {{ st.lastOp === 'enc' ? '密文（Base64）' : '解密结果' }}
              <button v-if="st.output" class="mini-btn" @click="copy(st.output)">复制</button>
            </label>
            <textarea v-model="st.output" readonly placeholder="输出结果…" spellcheck="false"></textarea>
          </div>
        </div>

        <div class="action-row">
          <button class="btn-primary" @click="runAes('enc')">🔒 加密</button>
          <button class="btn-primary alt" @click="runAes('dec')">🔓 解密</button>
          <button class="btn-glass" @click="swapOutput">⇅ 输出转输入</button>
          <button class="btn-glass" @click="clearAll">清空</button>
        </div>
        <p v-if="st.error" class="error-msg">⚠ {{ st.error }}</p>
      </template>

      <!-- ===== JWT ===== -->
      <template v-else-if="tool.kind === 'jwt'">
        <h1 class="tool-title">🎫 JWT 解码</h1>
        <p class="tool-desc">解析 JWT 的 Header 与 Payload（仅解码展示，不校验签名有效性）</p>

        <textarea
          v-model="st.input"
          class="hash-input"
          placeholder="粘贴 eyJhbGciOi… 格式的 JWT…"
          spellcheck="false"
        ></textarea>
        <div class="action-row">
          <button class="btn-primary" @click="runJwt">解码</button>
          <button class="btn-glass" @click="clearAll">清空</button>
        </div>

        <template v-if="st.jwt">
          <div class="jwt-block">
            <label class="pane-label">Header</label>
            <pre class="code-block">{{ st.jwt.header }}</pre>
          </div>
          <div class="jwt-block">
            <label class="pane-label">Payload</label>
            <pre class="code-block">{{ st.jwt.payload }}</pre>
          </div>
          <div class="jwt-block">
            <label class="pane-label">Signature</label>
            <pre class="code-block sig">{{ st.jwt.signature }}</pre>
            <p class="warn-msg">签名未验证——不要据此判断 token 是否有效</p>
          </div>
        </template>
        <p v-if="st.error" class="error-msg">⚠ {{ st.error }}</p>
      </template>

      <!-- ===== 编码识别 ===== -->
      <template v-else-if="tool.kind === 'detect'">
        <h1 class="tool-title">🪄 编码识别</h1>
        <p class="tool-desc">不知道是什么编码？粘进来一键分析；自动解码链会逐层剥开 Base64/Hex/URL 等嵌套</p>
        <textarea v-model="st.input" class="hash-input" placeholder="粘贴 mysterious 字符串…" spellcheck="false"></textarea>
        <div class="action-row">
          <button class="btn-primary" @click="runDetect">🔍 分析</button>
          <button class="btn-glass" @click="clearAll">清空</button>
        </div>
        <p v-if="st.error" class="error-msg">⚠ {{ st.error }}</p>

        <div v-if="st.detectChain" class="detect-box">
          <h3 class="sec-h">🚀 自动解码链</h3>
          <div class="chain-row">
            <span class="chain-step">原始</span>
            <template v-for="(c, i) in st.detectChain.chain" :key="i">
              <span class="chain-arrow">→ {{ c.name }}</span>
            </template>
          </div>
          <pre class="code-block">{{ st.detectChain.result }}</pre>
        </div>

        <div v-if="st.detectCands && st.detectCands.length" class="detect-box">
          <h3 class="sec-h">📋 候选编码（点击采纳为输入继续分析）</h3>
          <div v-for="(c, i) in st.detectCands" :key="i" class="cand-row glass" @click="adoptCand(c)">
            <span class="cand-name">{{ c.name }}</span>
            <span class="cand-preview">{{ c.decoded.slice(0, 60) }}{{ c.decoded.length > 60 ? '…' : '' }}</span>
            <span class="cand-score">{{ Math.round(c.score * 100) }}%</span>
          </div>
        </div>
        <p v-else-if="st.detectCands && !st.detectCands.length" class="list-hint">没识别出已知编码，试试挨个工具解</p>
      </template>

      <!-- ===== 古典三件套 ===== -->
      <template v-else-if="tool.kind === 'classic'">
        <h1 class="tool-title">🏛 古典密码</h1>
        <p class="tool-desc">凯撒 / 栅栏 / 维吉尼亚，均带暴力破解</p>
        <div class="mode-tabs">
          <button class="mode-tab" :class="{ on: st.classicTab === 'caesar' }" @click="st.classicTab = 'caesar'"> Caesar 凯撒</button>
          <button class="mode-tab" :class="{ on: st.classicTab === 'rail' }" @click="st.classicTab = 'rail'">🚧 栅栏</button>
          <button class="mode-tab" :class="{ on: st.classicTab === 'vig' }" @click="st.classicTab = 'vig'">🗝 维吉尼亚</button>
        </div>

        <textarea v-model="st.input" class="hash-input" placeholder="输入密文或明文…" spellcheck="false"></textarea>

        <div v-if="st.classicTab === 'caesar'" class="form-row">
          <label class="form-field">
            <span>位移（0-25，负数为反向）</span>
            <input v-model.number="st.caesarShift" type="number" class="input" />
          </label>
          <div class="action-row" style="align-items:flex-end">
            <button class="btn-primary" @click="runCaesar">转换</button>
            <button class="btn-primary alt" @click="runCaesarBrute">💥 25 位移全解</button>
          </div>
        </div>

        <div v-else-if="st.classicTab === 'rail'" class="form-row">
          <label class="form-field">
            <span>栏数</span>
            <input v-model.number="st.railN" type="number" min="2" class="input" />
          </label>
          <div class="action-row" style="align-items:flex-end">
            <button class="btn-primary" @click="runRail('enc')">加密</button>
            <button class="btn-primary alt" @click="runRail('dec')">解密</button>
            <button class="btn-primary alt" @click="runRailBrute">💥 栏数全解</button>
          </div>
        </div>

        <div v-else class="form-row">
          <label class="form-field grow">
            <span>密钥（字母）</span>
            <input v-model="st.vigKey" class="input mono" placeholder="如 LEMON" />
          </label>
          <div class="action-row" style="align-items:flex-end">
            <button class="btn-primary" @click="runVig(true)">加密</button>
            <button class="btn-primary alt" @click="runVig(false)">解密</button>
          </div>
        </div>

        <p v-if="st.error" class="error-msg">⚠ {{ st.error }}</p>
        <div v-if="st.output" class="hash-results">
          <div class="hash-row" style="grid-template-columns: 70px 1fr auto">
            <span class="hash-name">结果</span>
            <code class="hash-value">{{ st.output }}</code>
            <button class="mini-btn" @click="copy(st.output)">复制</button>
          </div>
        </div>
        <div v-if="st.classicResults" class="detect-box">
          <h3 class="sec-h">💥 暴力结果</h3>
          <div v-for="(r, i) in st.classicResults" :key="i" class="cand-row glass" @click="st.output = r.text; st.input = r.text">
            <span class="cand-name">{{ r.shift !== undefined ? '+' + r.shift : r.rails + ' 栏' }}</span>
            <span class="cand-preview">{{ r.text.slice(0, 70) }}</span>
          </div>
        </div>
      </template>

      <!-- ===== XOR ===== -->
      <template v-else-if="tool.kind === 'xor'">
        <h1 class="tool-title">🔀 XOR 异或</h1>
        <p class="tool-desc">循环密钥异或；不知道密钥？单字节爆破直接出可读结果</p>
        <textarea v-model="st.input" class="hash-input" placeholder="输入文本…" spellcheck="false"></textarea>
        <div class="form-row">
          <label class="form-field grow">
            <span>密钥</span>
            <input v-model="st.xorKey" class="input mono" placeholder="如 key / flag" />
          </label>
          <div class="action-row" style="align-items:flex-end">
            <button class="btn-primary" @click="runXor">异或</button>
            <button class="btn-primary alt" @click="runXorBrute">💥 单字节爆破</button>
          </div>
        </div>
        <p v-if="st.error" class="error-msg">⚠ {{ st.error }}</p>
        <div v-if="st.output" class="hash-results">
          <div class="hash-row">
            <span class="hash-name">文本</span>
            <code class="hash-value">{{ st.output }}</code>
            <button class="mini-btn" @click="copy(st.output)">复制</button>
          </div>
          <div class="hash-row">
            <span class="hash-name">Hex</span>
            <code class="hash-value">{{ st.xorHex }}</code>
            <button class="mini-btn" @click="copy(st.xorHex)">复制</button>
          </div>
        </div>
        <div v-if="st.xorBruteResults" class="detect-box">
          <h3 class="sec-h">💥 爆破结果（按可读性排序）</h3>
          <div v-for="(r, i) in st.xorBruteResults" :key="i" class="cand-row glass" @click="st.output = r.text">
            <span class="cand-name">0x{{ r.key.toString(16) }}</span>
            <span class="cand-preview">{{ r.text.slice(0, 70) }}</span>
          </div>
        </div>
      </template>

      <!-- ===== 中文趣味编码 ===== -->
      <template v-else-if="tool.kind === 'zhcode'">
        <h1 class="tool-title">🈶 中文趣味编码</h1>
        <p class="tool-desc">核心价值观编码 / 与佛论禅（keyfc 原版算法，兼容在线工具）</p>
        <div class="mode-tabs">
          <button class="mode-tab" :class="{ on: st.zhMode === 'cv' }" @click="st.zhMode = 'cv'">🇨🇳 核心价值观</button>
          <button class="mode-tab" :class="{ on: st.zhMode === 'tudou' }" @click="st.zhMode = 'tudou'">🙏 与佛论禅</button>
        </div>
        <textarea v-model="st.input" class="hash-input" :placeholder="st.zhMode === 'cv' ? '输入文本或核心价值观密文…' : '输入文本或「佛曰：…」'" spellcheck="false"></textarea>
        <div class="action-row">
          <button class="btn-primary" @click="runZh(true)">加密</button>
          <button class="btn-primary alt" @click="runZh(false)">解密</button>
          <button class="btn-glass" @click="clearAll">清空</button>
        </div>
        <p v-if="st.error" class="error-msg">⚠ {{ st.error }}</p>
        <div v-if="st.output" class="hash-results">
          <div class="hash-row" style="grid-template-columns: 70px 1fr auto">
            <span class="hash-name">结果</span>
            <code class="hash-value" style="word-break: break-all">{{ st.output }}</code>
            <button class="mini-btn" @click="copy(st.output)">复制</button>
          </div>
        </div>
      </template>

      <!-- ===== 字频统计 ===== -->
      <template v-else-if="tool.kind === 'freq'">
        <h1 class="tool-title">📊 字频统计</h1>
        <p class="tool-desc">字母频率分布 + 高频字符榜，破解替换类密码的标配（黄条为英语常见频率对照）</p>
        <textarea v-model="st.input" class="hash-input" placeholder="粘贴密文…" spellcheck="false"></textarea>
        <div class="action-row">
          <button class="btn-primary" @click="runFreq">统计</button>
          <button class="btn-glass" @click="clearAll">清空</button>
        </div>
        <div v-if="st.freqResult" class="freq-box">
          <div class="freq-meta">共 {{ st.freqResult.totalChars }} 字符 · 字母 {{ st.freqResult.letterTotal }} 个</div>
          <div class="freq-rows">
            <div v-for="l in st.freqResult.letters.slice(0, 16)" :key="l.ch" class="freq-row">
              <span class="f-ch">{{ l.ch }}</span>
              <div class="f-bar-wrap">
                <div class="f-bar" :style="{ width: Math.min(100, l.pct * 5) + '%' }"></div>
                <div class="f-bar ref" :style="{ width: Math.min(100, (EN_REF[l.ch] || 0) * 5) + '%' }"></div>
              </div>
              <span class="f-num">{{ l.pct.toFixed(1) }}%</span>
            </div>
          </div>
          <div class="freq-top">
            <span v-for="t in st.freqResult.top" :key="t.ch" class="chip">{{ t.ch === '\n' ? '⏎' : t.ch }} ×{{ t.count }}</span>
          </div>
        </div>
      </template>

      <!-- ===== 时间戳 ===== -->
      <template v-else-if="tool.kind === 'timestamp'">
        <h1 class="tool-title">⏰ 时间戳转换</h1>
        <p class="tool-desc">Unix 时间戳 ↔ 日期互转，秒/毫秒自动识别</p>
        <div class="ts-now glass">
          <div>
            <div class="ts-label">当前时间戳</div>
            <code class="ts-num">{{ tsNow }}</code>
            <span class="ts-unit">ms</span>
          </div>
          <div>
            <div class="ts-label">当前时间</div>
            <code class="ts-num">{{ tsNowDate }}</code>
          </div>
          <button class="mini-btn" style="align-self: center" @click="copy(String(tsNow))">复制</button>
        </div>

        <div class="form-row" style="margin-top: 16px">
          <label class="form-field grow">
            <span>时间戳 → 日期</span>
            <input v-model="st.tsInput" class="input mono" placeholder="如 1763500000 或 1763500000123" @input="tsToDate" />
          </label>
          <div class="form-field">
            <span>&nbsp;</span>
            <div class="ts-result">{{ st.tsOut || '—' }}</div>
          </div>
        </div>

        <div class="form-row" style="margin-top: 14px">
          <label class="form-field grow">
            <span>日期 → 时间戳</span>
            <input v-model="st.tsDate" type="datetime-local" class="input mono" step="1" @input="dateToTs" />
          </label>
          <div class="form-field">
            <span>&nbsp;</span>
            <div class="ts-result">{{ st.tsOut2 || '—' }}</div>
          </div>
        </div>
      </template>

      <!-- ===== JSON 格式化 ===== -->
      <template v-else-if="tool.kind === 'jsonfmt'">
        <h1 class="tool-title">🧾 JSON 格式化</h1>
        <p class="tool-desc">校验 + 美化 + 压缩；出错时直接定位行列</p>
        <textarea v-model="st.input" class="hash-input" placeholder='{"json": "here"}' spellcheck="false"></textarea>
        <div class="action-row">
          <button class="btn-primary" @click="runJson(2)">✨ 美化 (2空格)</button>
          <button class="btn-primary alt" @click="runJson(4)">美化 (4空格)</button>
          <button class="btn-primary alt" @click="runJsonMin">📦 压缩</button>
          <button class="btn-glass" @click="clearAll">清空</button>
        </div>
        <p v-if="st.jsonErr" class="error-msg">⚠ {{ st.jsonErr }}</p>
        <div v-if="st.output" class="hash-results">
          <div class="hash-row" style="grid-template-columns: 70px 1fr auto">
            <span class="hash-name">结果</span>
            <code class="hash-value" style="white-space: pre-wrap">{{ st.output }}</code>
            <button class="mini-btn" @click="copy(st.output)">复制</button>
          </div>
        </div>
      </template>

      <!-- ===== RC4 ===== -->
      <template v-else-if="tool.kind === 'rc4'">
        <h1 class="tool-title">🔑 RC4</h1>
        <p class="tool-desc">经典流密码；解密请把上次输出的 Hex 粘回并选「Hex 输入」</p>
        <textarea v-model="st.input" class="hash-input" :placeholder="st.rc4HexIn ? '输入十六进制密文…' : '输入文本…'" spellcheck="false"></textarea>
        <div class="form-row">
          <label class="form-field grow">
            <span>密钥</span>
            <input v-model="st.rc4Key" class="input mono" placeholder="RC4 key" />
          </label>
          <label class="form-field" style="justify-content: flex-end">
            <span>&nbsp;</span>
            <label class="chk"><input v-model="st.rc4HexIn" type="checkbox" /> Hex 输入</label>
          </label>
        </div>
        <div class="action-row">
          <button class="btn-primary" @click="runRc4">🔑 加/解密</button>
          <button class="btn-glass" @click="clearAll">清空</button>
        </div>
        <p v-if="st.error" class="error-msg">⚠ {{ st.error }}</p>
        <div v-if="st.output" class="hash-results">
          <div class="hash-row">
            <span class="hash-name">文本</span>
            <code class="hash-value">{{ st.output }}</code>
            <button class="mini-btn" @click="copy(st.output)">复制</button>
          </div>
          <div class="hash-row">
            <span class="hash-name">Hex</span>
            <code class="hash-value">{{ st.xorHex }}</code>
            <button class="mini-btn" @click="copy(st.xorHex)">复制</button>
          </div>
        </div>
      </template>

      <!-- ===== 进制转换 ===== -->
      <template v-else-if="tool.kind === 'baseconv'">
        <h1 class="tool-title">🔀 进制转换</h1>
        <p class="tool-desc">数字进制（2-36）互转；字符串进制：把字符串当作字符集下的大整数，转出各进制并支持还原</p>

        <div class="mode-tabs">
          <button class="mode-tab" :class="{ on: st.convMode === 'num' }" @click="st.convMode = 'num'">🔢 数字进制</button>
          <button class="mode-tab" :class="{ on: st.convMode === 'str' }" @click="st.convMode = 'str'">🔤 字符串进制</button>
        </div>

        <!-- 数字进制（原功能） -->
        <template v-if="st.convMode === 'num'">
          <div class="form-row">
            <label class="form-field">
              <span>输入进制</span>
              <select v-model.number="st.fromBase" class="input">
                <option v-for="b in [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 20, 26, 32, 36]" :key="b" :value="b">
                  {{ b }} 进制
                </option>
              </select>
            </label>
            <label class="form-field grow">
              <span>数值</span>
              <input v-model="st.input" class="input mono" placeholder="如 ff / 11111111 / zzz" />
            </label>
          </div>
          <div class="action-row">
            <button class="btn-primary" @click="runBaseConv">转换</button>
            <button class="btn-glass" @click="clearAll">清空</button>
          </div>

          <div v-if="st.results" class="base-results">
            <div v-for="r in st.results" :key="r.base" class="base-row">
              <span class="base-name">{{ r.base }} 进制</span>
              <code class="hash-value">{{ r.value }}</code>
              <button class="mini-btn" @click="copy(r.value)">复制</button>
            </div>
          </div>
        </template>

        <!-- 字符串进制 -->
        <template v-else>
          <div class="form-row">
            <label class="form-field">
              <span>字符集</span>
              <select v-model="st.charsetId" class="input" @change="onCharsetChange">
                <option v-for="c in charsets" :key="c.id" :value="c.id">{{ c.name }}</option>
                <option value="custom">自定义…</option>
              </select>
            </label>
            <label class="form-field grow">
              <span>字符集内容（{{ currentAlphabet.length }} 个字符，可编辑）</span>
              <input v-model="st.customAlphabet" class="input mono" placeholder="字符顺序即数值顺序" />
            </label>
          </div>

          <div class="mode-tabs">
            <button class="mode-tab" :class="{ on: st.strDir === 'encode' }" @click="st.strDir = 'encode'">字符串 → 数字</button>
            <button class="mode-tab" :class="{ on: st.strDir === 'decode' }" @click="st.strDir = 'decode'">数字 → 字符串</button>
          </div>

          <label class="field" style="margin-bottom: 14px">
            <span>{{ st.strDir === 'encode' ? '输入字符串（如 Welcome_to_CTFshow_PWN）' : '输入数字与进制' }}</span>
            <div v-if="st.strDir === 'decode'" class="form-row" style="margin-bottom: 8px">
              <select v-model.number="st.numRadix" class="input" style="max-width: 130px">
                <option v-for="b in [10, 16, 8, 2, 32, 36]" :key="b" :value="b">{{ b }} 进制</option>
              </select>
              <input v-model="st.strInput" class="input mono grow" placeholder="数字" />
            </div>
            <textarea v-else v-model="st.strInput" class="hash-input" placeholder="输入字符串…" spellcheck="false"></textarea>
          </label>

          <div class="action-row">
            <button class="btn-primary" @click="runStrBaseConv">转换</button>
            <button class="btn-glass" @click="clearAll">清空</button>
          </div>

          <div v-if="st.strResults" class="base-results">
            <div v-for="r in st.strResults" :key="r.base" class="base-row">
              <span class="base-name">{{ r.base }} 进制</span>
              <code class="hash-value">{{ r.value }}</code>
              <button class="mini-btn" @click="copy(r.value)">复制</button>
            </div>
          </div>
          <div v-if="st.strDecoded" class="hash-results">
            <div class="hash-row" style="grid-template-columns: 90px 1fr auto">
              <span class="hash-name">还原结果</span>
              <code class="hash-value">{{ st.strDecoded }}</code>
              <button class="mini-btn" @click="copy(st.strDecoded)">复制</button>
            </div>
          </div>
        </template>
        <p v-if="st.error" class="error-msg">⚠ {{ st.error }}</p>
      </template>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { jwtDecode, convertBase, hashText, aesEncrypt, aesDecrypt, BASE_CHARSETS, stringToBigNumber, bigNumberToString, bigToAllBases } from '../utils/cryptoTools'
import { caesar, caesarBrute, railFence, railFenceBrute, vigenere, xorText, xorBruteSingle, rc4, rc4Hex, coreValuesEncode, coreValuesDecode, tudouEncode, tudouDecode, detectEncodings, autoDecodeChain, charFrequency, EN_FREQ, formatJson, minifyJson } from '../utils/ctfTools'
import { TOOL_GROUPS } from '../utils/toolsMeta'

const groups = TOOL_GROUPS
const EN_REF = Object.fromEntries(EN_FREQ)

const activeId = ref('base64')
const tool = computed(() => groups.flatMap((g) => g.tools).find((t) => t.id === activeId.value))

// 深链支持：/tools?t=base64 直达某个工具（命令面板使用）
const route = useRoute()
watch(
  () => route.query.t,
  (t) => {
    if (t && groups.flatMap((g) => g.tools).some((x) => x.id === t)) activeId.value = t
  },
  { immediate: true },
)

// 每个工具一份独立状态，切换工具不丢输入
const states = reactive({})
const st = computed(() => {
  if (!states[activeId.value]) {
    states[activeId.value] = {
      input: '', output: '', error: '', copied: false, customAlphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_',
      detectCands: null, detectChain: null,
      classicTab: 'caesar', caesarShift: 3, railN: 3, vigKey: '', classicResults: null,
      xorKey: '', xorHex: '', xorBruteResults: null,
      zhMode: 'cv',
      freqResult: null,
      tsInput: '', tsOut: '', tsDate: '', tsOut2: '',
      jsonErr: '',
      rc4Key: '', rc4HexIn: false,
      results: null, jwt: null,
      mode: 'gcm', password: '', lastOp: '', fromBase: 16,
      convMode: 'num', strDir: 'encode', charsetId: 'b63', customAlphabet: '',
      strInput: '', numRadix: 10, strResults: null, strDecoded: '',
    }
  }
  return states[activeId.value]
})

async function runTransform(which) {
  st.value.error = ''
  st.value.copied = false
  st.value.output = ''
  try {
    st.value.output = await tool.value.fns[which](st.value.input)
  } catch (e) {
    st.value.error = e.message
  }
}

async function runHash() {
  st.value.error = ''
  st.value.results = null
  try {
    st.value.results = await hashText(st.value.input)
  } catch (e) {
    st.value.error = e.message
  }
}

async function runAes(op) {
  st.value.error = ''
  st.value.output = ''
  st.value.lastOp = op
  try {
    st.value.output =
      op === 'enc'
        ? await aesEncrypt(st.value.input, st.value.password, st.value.mode)
        : await aesDecrypt(st.value.input, st.value.password, st.value.mode)
  } catch (e) {
    st.value.error = e.message
  }
}

function runJwt() {
  st.value.error = ''
  st.value.jwt = null
  try {
    st.value.jwt = jwtDecode(st.value.input)
  } catch (e) {
    st.value.error = e.message
  }
}

const charsets = BASE_CHARSETS
const currentAlphabet = computed(() => {
  if (st.value.charsetId === 'custom') return st.value.customAlphabet || ''
  return charsets.find((c) => c.id === st.value.charsetId)?.alphabet || ''
})

function onCharsetChange() {
  if (st.value.charsetId !== 'custom') {
    st.value.customAlphabet = currentAlphabet.value
  }
}

function runStrBaseConv() {
  st.value.error = ''
  st.value.strResults = null
  st.value.strDecoded = ''
  const alphabet = currentAlphabet.value
  if (new Set(alphabet).size !== alphabet.length || alphabet.length < 2) {
    st.value.error = '字符集无效：至少 2 个字符且不能有重复字符'
    return
  }
  try {
    if (st.value.strDir === 'encode') {
      const num = stringToBigNumber(st.value.strInput, alphabet)
      st.value.strResults = bigToAllBases(num)
    } else {
      const clean = st.value.strInput.trim().toLowerCase()
      st.value.strDecoded = bigNumberToString(clean, st.value.numRadix, alphabet)
    }
  } catch (e) {
    st.value.error = e.message
  }
}

/* ===== 新工具逻辑 ===== */

function runDetect() {
  st.value.error = ''
  st.value.detectCands = null
  st.value.detectChain = null
  try {
    st.value.detectCands = detectEncodings(st.value.input)
    st.value.detectChain = autoDecodeChain(st.value.input)
  } catch (e) {
    st.value.error = e.message
  }
}

function adoptCand(c) {
  st.value.input = c.decoded
  runDetect()
}

function runCaesar() {
  st.value.error = ''
  st.value.classicResults = null
  try {
    st.value.output = caesar(st.value.input, st.value.caesarShift || 0)
  } catch (e) {
    st.value.error = e.message
  }
}

function runCaesarBrute() {
  st.value.output = ''
  st.value.classicResults = caesarBrute(st.value.input)
}

function runRail(mode) {
  st.value.error = ''
  st.value.classicResults = null
  try {
    st.value.output = railFence(st.value.input, Math.max(2, st.value.railN || 3), mode === 'enc')
  } catch (e) {
    st.value.error = e.message
  }
}

function runRailBrute() {
  st.value.output = ''
  st.value.classicResults = railFenceBrute(st.value.input)
}

function runVig(encrypt) {
  st.value.error = ''
  st.value.classicResults = null
  try {
    st.value.output = vigenere(st.value.input, st.value.vigKey, encrypt)
  } catch (e) {
    st.value.error = e.message
  }
}

function runXor() {
  st.value.error = ''
  st.value.xorBruteResults = null
  try {
    const r = xorText(st.value.input, st.value.xorKey)
    st.value.output = r.text
    st.value.xorHex = r.hex
  } catch (e) {
    st.value.error = e.message
  }
}

function runXorBrute() {
  st.value.error = ''
  st.value.output = ''
  st.value.xorBruteResults = xorBruteSingle(st.value.input)
  if (!st.value.xorBruteResults.length) st.value.error = '没有找到可读结果（可能不是单字节异或）'
}

async function runZh(encrypt) {
  st.value.error = ''
  try {
    if (st.value.zhMode === 'cv') {
      st.value.output = encrypt ? coreValuesEncode(st.value.input) : coreValuesDecode(st.value.input)
    } else {
      st.value.output = encrypt ? await tudouEncode(st.value.input) : await tudouDecode(st.value.input)
    }
  } catch (e) {
    st.value.error = e.message
  }
}

function runFreq() {
  st.value.error = ''
  st.value.freqResult = charFrequency(st.value.input)
}

/* 时间戳 */
const tsNow = ref(Date.now())
const tsNowDate = ref('')
let tsTimer = 0
onMounted(() => {
  const tick = () => {
    tsNow.value = Date.now()
    tsNowDate.value = new Date().toLocaleString('zh-CN', { hour12: false })
  }
  tick()
  tsTimer = setInterval(tick, 1000)
})
onUnmounted(() => clearInterval(tsTimer))

function tsToDate() {
  const t = String(st.value.tsInput).trim()
  if (!t) { st.value.tsOut = ''; return }
  const n = Number(t)
  if (!Number.isFinite(n)) { st.value.tsOut = '不是数字'; return }
  const ms = t.length >= 13 ? n : t.length >= 10 ? n * 1000 : NaN
  if (!Number.isFinite(ms)) { st.value.tsOut = '长度不对'; return }
  st.value.tsOut = new Date(ms).toLocaleString('zh-CN', { hour12: false })
}

function dateToTs() {
  if (!st.value.tsDate) { st.value.tsOut2 = ''; return }
  const ms = new Date(st.value.tsDate).getTime()
  if (Number.isNaN(ms)) { st.value.tsOut2 = '日期无效'; return }
  st.value.tsOut2 = `${Math.floor(ms / 1000)} s · ${ms} ms`
}

function runJson(spaces) {
  st.value.error = ''
  st.value.jsonErr = ''
  const r = formatJson(st.value.input, spaces)
  if (r.ok) st.value.output = r.output
  else {
    st.value.output = ''
    st.value.jsonErr = r.line ? `${r.error}（第 ${r.line} 行 第 ${r.col} 列附近）` : r.error
  }
}

function runJsonMin() {
  st.value.error = ''
  st.value.jsonErr = ''
  const r = minifyJson(st.value.input)
  if (r.ok) st.value.output = r.output
  else {
    st.value.output = ''
    st.value.jsonErr = r.line ? `${r.error}（第 ${r.line} 行 第 ${r.col} 列附近）` : r.error
  }
}

function runRc4() {
  st.value.error = ''
  try {
    const r = st.value.rc4HexIn ? rc4Hex(st.value.rc4Key, st.value.input) : rc4(st.value.rc4Key, st.value.input)
    st.value.output = r.text
    st.value.xorHex = r.hex
  } catch (e) {
    st.value.error = e.message
  }
}

function runBaseConv() {
  st.value.error = ''
  st.value.results = null
  try {
    st.value.results = convertBase(st.value.input, st.value.fromBase)
  } catch (e) {
    st.value.error = e.message
  }
}

function swapOutput() {
  st.value.input = st.value.output
  st.value.output = ''
  st.value.error = ''
  st.value.results = null
  st.value.jwt = null
}

function clearAll() {
  Object.assign(st.value, {
    input: '', output: '', error: '', copied: false, results: null, jwt: null, lastOp: '',
  })
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text)
    st.value.copied = true
    setTimeout(() => (st.value.copied = false), 1500)
  } catch {
    /* 剪贴板不可用时静默 */
  }
}
</script>

<style scoped>
.tools-layout {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

/* 左侧导航 */
.tools-nav {
  position: sticky;
  top: 88px;
  padding: 18px 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.group-name {
  font-size: 12px;
  color: var(--text-3);
  padding: 0 10px 4px;
  font-weight: 600;
}

.tool-btn {
  text-align: left;
  padding: 8px 12px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-2);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
}

.tool-btn:hover {
  background: var(--hover-bg);
  color: var(--text-1);
}

.tool-btn.active {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(109, 94, 242, 0.3);
}

.tools-tip {
  font-size: 12px;
  color: var(--text-3);
  line-height: 1.7;
  padding: 10px 10px 0;
  border-top: 1px dashed var(--glass-border);
}

/* 主面板 */
.tool-panel {
  padding: 30px 34px;
  min-height: 480px;
}

.tool-title {
  font-size: 21px;
}

.tool-desc {
  margin: 8px 0 20px;
  font-size: 13.5px;
  color: var(--text-3);
  line-height: 1.7;
}

/* 输入输出区 */
.io-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.io-pane {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pane-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--text-2);
}

textarea,
.hash-input {
  min-height: 170px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg-strong);
  color: var(--text-1);
  font-family: var(--font-mono);
  font-size: 13.5px;
  line-height: 1.7;
  resize: vertical;
  outline: none;
}

.hash-input {
  width: 100%;
}

textarea:focus,
.hash-input:focus {
  border-color: var(--accent);
}

textarea[readonly] {
  opacity: 0.92;
}

/* 按钮 */
.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.btn-primary {
  padding: 9px 22px;
  border: none;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary.alt {
  background: linear-gradient(135deg, #3d8bfd, #38bdf8);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(109, 94, 242, 0.35);
}

.mini-btn {
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text-2);
  border-radius: 6px;
  font-size: 12px;
  padding: 2px 10px;
  cursor: pointer;
}

.mini-btn:hover {
  color: var(--accent-deep);
  border-color: var(--accent);
}

/* 表单 */
.form-row {
  display: flex;
  gap: 14px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--text-2);
}

.form-field.grow {
  flex: 1;
  min-width: 200px;
}

.input {
  padding: 9px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--glass-border);
  background: var(--glass-bg-strong);
  color: var(--text-1);
  font-size: 14px;
  outline: none;
}

.input:focus {
  border-color: var(--accent);
}

.mono {
  font-family: var(--font-mono);
}

/* 哈希/进制结果 */
.hash-results,
.base-results {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hash-row,
.base-row {
  display: grid;
  grid-template-columns: 90px 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  background: var(--glass-bg-strong);
  border: 1px solid var(--glass-border);
}

.hash-name,
.base-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--accent-deep);
}

.hash-value {
  font-family: var(--font-mono);
  font-size: 13px;
  word-break: break-all;
  color: var(--text-1);
}

/* JWT */
.jwt-block {
  margin-top: 16px;
}

.code-block {
  margin-top: 8px;
  padding: 14px 18px;
  border-radius: var(--radius-md);
  background: #1e2038;
  color: #e6e8ff;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.7;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.code-block.sig {
  color: #a7accf;
}

.warn-msg {
  margin-top: 6px;
  font-size: 12.5px;
  color: #e6a23c;
}

/* 提示 */
.error-msg {
  margin-top: 14px;
  font-size: 13.5px;
  color: #e5484d;
}

.ok-msg {
  margin-top: 10px;
  font-size: 13px;
  color: #3aa675;
}

@media (max-width: 960px) {
  .tools-layout {
    grid-template-columns: 1fr;
  }
  .tools-nav {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
  }
  .nav-group {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }
  .tools-tip {
    display: none;
  }
  .io-grid {
    grid-template-columns: 1fr;
  }
  .tool-panel {
    padding: 22px 18px;
  }
}
</style>
