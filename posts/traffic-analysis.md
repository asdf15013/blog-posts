---
title: 流量分析（Traffic Analysis）知识总结
date: 2026-11-17
category: CTF
tags: [CTF, 流量分析]
---

# 流量分析（Traffic Analysis）知识总结

> 适用对象：准备入坑 CTF 流量分析方向的新手，配套 Pwn/RE/Web/Misc/Crypto 篇食用
> 目标：从"打开 pcap 一屏彩色表格就头晕"到"知道每一列是什么、每个协议在干嘛、每种题型怎么撬"

---

## 目录

0. [流量分析是什么](#0-流量分析是什么)
1. [网络分层模型](#1-网络分层模型)
2. [协议原理详解](#2-协议原理详解)
3. [Wireshark入门](#3-wireshark入门)
4. [tshark与脚本化](#4-tshark与脚本化)
5. [pcap文件结构与修复](#5-pcap文件结构与修复)
6. [题型套路大全](#6-题型套路大全)
7. [隐蔽信道](#7-隐蔽信道)
8. [WiFi流量专题](#8-wifi流量专题)
9. [工具链全家桶](#9-工具链全家桶)
10. [解题流程与心法](#10-解题流程与心法)
11. [学习路线与资源](#11-学习路线与资源)

---

## 0. 流量分析是什么

**流量分析 = 给你一段"网络监控录像"（pcap 文件），还原出期间发生过什么**：谁访问了谁、传了什么文件、敲了什么键盘、flag 藏在哪条包里。

- 文件形态：`.pcap` / `.pcapng`（Wireshark 抓包保存的标准格式）
- 题面形态："分析流量包，找出 flag" / "黑客上传了什么文件" / "用户敲了什么"

> **通俗理解**：网络数据包像**一条条往来快递**。流量分析就是调取物流监控——每件快递的寄件人、收件人、货物清单、运输路线全记在案。你的工作是翻记录：大部分是无关杂物（聊天、刷网页），flag 藏在某个"可疑快递"的夹层里。

### 0.1 与其他方向的关系

- **Web 篇的 HTTP 知识直接复用**：流量题最常见的料就是 HTTP 明文
- **Crypto 篇**：WiFi 握手包跑字典、TLS 解密
- **Misc 篇**：从流量里提取的文件继续按 Misc 套路撬（图/压缩包）
- **取证思路一致**：流量包就是"网络现场的取证镜像"

---

## 1. 网络分层模型

### 1.1 四层模型 + 快递比喻（一张表记住）

| 层     | 谁在干活        | 快递比喻                       | 数据单位 | CTF 关注点              |
| ------ | --------------- | ------------------------------ | -------- | ----------------------- |
| 应用层 | HTTP/DNS/FTP…   | **货物本身**                   | 数据     | 明文内容（flag 常在这） |
| 传输层 | TCP/UDP         | **包裹 + 单号**（端口号=门牌） | 段       | 连接、端口、隐蔽信道    |
| 网络层 | IP/ICMP         | **收发件地址**（IP）           | 包       | 路由、ping、分片        |
| 链路层 | 以太网/ARP/WiFi | **货车**（MAC=车牌）           | 帧       | WiFi 无线流量、ARP 攻击 |

### 1.2 封包过程（寄快递）

应用产出数据（如 HTTP 请求），**每往下一层就包一层"信封"**：

```
应用数据：GET /flag.php HTTP/1.1
   ↓ 套 TCP 头（源端口 50000 → 目的端口 80，序号 123）
   ↓ 套 IP 头（源 192.168.1.100 → 目的 10.0.0.5）
   ↓ 套以太网帧头尾（MAC 地址 + 校验）
   ↓ 变成比特流上网
```

**Wireshark 里你看到的就是这层层信封**——选中一个包，详情栏从上到下依次是 Frame → Ethernet → IP → TCP → HTTP，一层一层展开（和寄递过程完全镜像）。

---

## 2. 协议原理详解

> 做题够用深度：每个协议讲清"它长什么样、什么字段有戏、CTF 怎么考它"。

### 2.1 以太网帧（链路层）

```
[目的 MAC 6B][源 MAC 6B][类型 2B][上层载荷...][校验 4B]
```

- **MAC 地址**：网卡出厂编号，形如 `aa:bb:cc:dd:ee:ff`，前 3 段是厂商标识（OUI）——**从 MAC 认设备厂商**（`Apple_XX` / `Intel_XX`）是流量题找目标设备的小技巧
- **类型字段**：`0x0800`=里面是 IP 包、`0x0806`=ARP

### 2.2 ARP：门牌查询协议

局域网里"我知道 IP，要问 MAC"——广播喊话：

```
"谁有 192.168.1.5？告诉我你的 MAC"（广播）→ "192.168.1.5 在 aa:bb:cc…"（应答）
```

CTF 考法：**ARP 欺骗/中间人**——同一 IP 对应**两个不同 MAC 应答**，且流量绕经攻击者机器 → 说明存在中间人（题目一般围绕"还原被嗅探的明文流量"）。

### 2.3 IP 与 ICMP

**IP 头关键五字段**：

```
[版本+头长][总长][TTL][协议号][源 IP][目的 IP]
```

- **TTL**：每过一跳路由器减 1，归 0 丢弃——看 TTL 猜系统（Windows 初始 128，Linux 64）
- **协议号**：1=ICMP、6=TCP、17=UDP（过滤/识别用）

**ICMP（ping 的协议）**：

```
type=8 请求（ping 出去）/ type=0 应答（pong 回来）/ type=3 不可达 / type=11 超时
```

CTF 考法：① 探测记录还原（先 ping 了一圈谁）② **ICMP data 字段藏数据**（隐蔽信道，见第 7 章）。

### 2.4 TCP：可靠传输的"挂号信"（重中之重）

**端口**：IP 是地址，端口是门牌。`0~1023` 常用服务（22 SSH / 80 HTTP / 443 HTTPS / 53 DNS / 21 FTP / 25 SMTP），通讯录背几个。

**三次握手**（打电话对暗号）：

```
客户端 → 服务器: SYN            （"喂，能听见吗？" seq=x）
服务器 → 客户端: SYN, ACK       （"能！你能听见我吗？" seq=y, ack=x+1）
客户端 → 服务器: ACK            （"能！" ack=y+1）
—— 连接建立，开始传数据 ——
```

**四次挥手**（礼貌挂电话）：

```
A: FIN    （"我说完了"）
B: ACK    （"知道了"）
B: FIN    （"我也说完了"）
A: ACK    （"好，挂了"）
```

**异常信号（做题眼）**：

- 大量 SYN 无回应 → 端口扫描（SYN 扫描：`tcp.flags.syn==1 && tcp.flags.ack==0`）
- **RST 包**：粗暴断开——扫描探测端口开没开常用 RST 区分
- **PSH 标志**：数据"直接推给应用"，**看数据传输出 PSH 包**

**序列号（seq）**：给每个字节编号——除了保证有序，也是**隐蔽信道藏数据的暗格**（第 7 章）。

### 2.5 UDP：不可靠的"明信片"

无连接、无握手、发完就完。头只有 8 字节（源端口/目的端口/长度/校验）。**DNS 跑在 UDP 53**，QUIC/视频流也是 UDP。CTF 考法：UDP 里的**隐蔽数据**（data 字段）、DNS 隧道。

### 2.6 DNS：域名翻译官

```
查询（qr=0）：你这台机器 → 8.8.8.8：  "www.baidu.com 的 IP 是？"（A 记录）
响应（qr=1）：8.8.8.8 → 你：         "→ 110.242.68.66"
```

- 记录类型：**A**（域名→IP）、**CNAME**（别名）、**MX**（邮件）、**TXT**（文本，**藏数据重灾区**）、**NULL**（任意数据）
- **域名结构**：`sub.domain.com` 从右往左越靠后越"大"（com → domain → sub）
- CTF 考法：① 查询记录还原"访问过哪些站" ② **子域名藏编码数据**（DNS 隧道，第 7 章）

### 2.7 HTTP：流量题的第一大金矿

**明文协议**——Wireshark 里全程裸奔（详见 Web 篇第 2 章，此处讲"流量视角"）：

```
请求流：GET /login HTTP/1.1 ... POST /login → body 里 username=admin&password=123456
响应流：HTTP/1.1 200 OK ... <html>...</html>
上传：POST multipart/form-data，boundary 分隔的文件二进制（可还原出完整文件！）
```

CTF 挖法：follow stream（跟流）看完整对话、搜敏感词（password/flag/upload）、**导出 HTTP 对象**直接拿传输的文件（第 3、6 章）。

### 2.8 HTTPS / TLS：加密后还能看什么

TLS 握手流程（应用数据之前）：

```
① ClientHello   → 客户端随机数 + 支持的加密套件 + **SNI（想访问的域名，明文！）**
② ServerHello   → 选定套件 + 服务器随机数 + 证书（域名、公钥，明文）
③ 密钥交换/验证（几个来回，算法各异）
④ ChangeCipherSpec + EncryptedHandshake → 之后全加密
```

**加密后你还能看到**：IP、端口、包大小、时间、SNI 域名——**看不到**：URL 路径、内容、cookie。

**CTF 解密条件**（给了条件就能看穿）：

1. **RSA 密钥交换 + 给了服务器私钥** → Wireshark 里粘贴私钥解密
2. **给了 TLS keylogfile（SSLKEYLOGFILE）** → Preferences → Protocols → TLS → (Pre)-Master-Secret log filename 加载

> 老流量题常用条件 1（老握手可解）；现代 TLS 1.3 前向保密，私钥也解不开——题目只能给 keylogfile。

### 2.9 明文老协议（送分三兄弟）

| 协议          | 端口                     | 明文能看到什么                                               |
| ------------- | ------------------------ | ------------------------------------------------------------ |
| **FTP**       | 21(控制)/20 或随机(数据) | `USER xxx` / `PASS 123456`、上传下载的文件名，**数据通道里是裸文件** |
| **SMTP**      | 25/465                   | 邮件正文；**附件是 Base64 编码**（抠出来解码即文件）         |
| **POP3/IMAP** | 110/143                  | `USER/PASS` 明文登录 + 拉取的邮件内容                        |

**看到这几个端口/协议就等于白送**——跟流、抠 Base64、解压，flag 三步到家。

### 2.10 特殊/工业协议（认个脸）

- **Modbus**（工控 502 端口）：功能码 + 寄存器数据——工控题读寄存器值找异常
- **DICOM**（医疗影像）：导出对象能导出 CT 图（图里可能藏着东西）
- **MQTT / WebSocket / 自定义 TCP 协议**：跟流观察结构，按"魔数+长度+数据"格式分析

---

## 3. Wireshark入门

### 3.1 界面四栏（从上到下）

```
① 过滤栏        输入显示过滤器（最重要，见 3.2）
② 包列表        每行一个包：编号/时间/源/目的/协议/长度/信息
③ 包详情        选中包的分层信封展开（Frame→Ether→IP→TCP→HTTP）
④ 字节面板      该包原始 hex（对照结构看/复制数据）
```

### 3.2 显示过滤器速查（必背，做题效率的命）

**写错会变红色**——变绿才是合法语法。

| 过滤表达式                                 | 含义                       |
| ------------------------------------------ | -------------------------- |
| `http` / `dns` / `ftp` / `icmp`            | 只看该协议                 |
| `ip.addr == 192.168.1.100`                 | 涉及该 IP 的双向流量       |
| `ip.src == x` / `ip.dst == x`              | 单向                       |
| `tcp.port == 21` / `udp.port == 53`        | 指定端口                   |
| `tcp.flags.syn == 1 && tcp.flags.ack == 0` | 裸 SYN（扫描迹象）         |
| `http.request.method == "POST"`            | 只看 POST                  |
| `http.response.code == 200`                | 成功响应                   |
| `frame contains "flag"`                    | 全包搜字符串               |
| `http contains "password"`                 | 指定协议层搜               |
| `dns.qry.name contains "xxx"`              | 子域名匹配                 |
| `!(arp || icmp || dns)`                    | **降噪神器：剔除背景流量** |
| `&&` `\|\|` `!`                            | 与/或/非（组合拳）         |

### 3.3 五大杀器功能

**① Follow Stream（跟流）**——右键包 → Follow → TCP/UDP/HTTP Stream：把一条 TCP 连接的所有字节**拼回完整对话**（红色=客户端发，蓝色=服务器回）。**HTTP/FTP/SMTP 题的第一动作。**

**② Export Objects（导出对象）**——File → Export Objects → HTTP/DICOM：**把流量里传输过的所有文件列成清单一键下载**（网站上的图/js、上传的文件、CT 图）。文件提取题的官方姿势。

**③ Statistics → Protocol Hierarchy（协议分级）**——一眼看清包里都是什么协议、各占比。**打开 pcap 的第一个动作**：哪个协议占比反常（比如 Modbus 占 80%），就先看哪个。

**④ Statistics → Conversations（会话）**——谁和谁聊、聊了多少包/字节。找出**通信量异常大的 IP 对**（偷偷传数据）。

**⑤ 搜索**——Ctrl+F → 选 "Packet bytes" / "String" / "Packet details"：全文搜 `flag`、`key`、`pass`。

### 3.4 其他实用项

- 时间显示：View → Time Display Format（看绝对时间还原事件顺序）
- 着色/标记：右键 Colorize Conversation（区分多条流）；Ctrl+M 标记重要包
- 保存子集：File → Export Specified Packets（只留过滤结果另存，方便后续脚本处理）

---

## 4. tshark与脚本化

**tshark = Wireshark 的命令行版**，批量提取靠它（GUI 点不过来的活）：

```bash
tshark -r flag.pcap                          # 读包（-r = read）
tshark -r flag.pcap -Y "http"                # -Y 显示过滤（语法同 wireshark）
tshark -r flag.pcap -Y "http.request" -T fields -e http.request.full_uri
#        -T fields 按字段输出  -e 指定字段名（可多个）
tshark -r flag.pcap --export-objects http,./out_dir     # 一键导出 HTTP 文件
tshark -r flag.pcap -z conv,tcp              # 统计会话
tshark -r flag.pcap -Y "usb.capdata" -T fields -e usb.capdata > keys.txt
#        USB 键盘数据一键抠出（见 6.4）
```

**Python 处理（scapy）**——过滤逻辑复杂时用代码：

```python
from scapy.all import rdpcap
pkts = rdpcap('flag.pcap')
for p in pkts:
    if p.haslayer('TCP') and p['TCP'].dport == 21:
        print(bytes(p['TCP'].payload))
```

---

## 5. pcap文件结构与修复

### 5.1 文件结构（了解一下，修复要用）

```
[全局头 24B]：魔数 + 版本 + 链路类型
[包头 16B][包数据] × N     ← 每个包前都有一张 16 字节"快递单"（时间戳+长度）
```

- **魔数**：`d4 c3 b2 a1`（小端）或 `a1 b2 c3 d4`（大端）；pcapng 魔数是 `0x0A0D0D0A`

### 5.2 三种常见损坏与修复

| 情况            | 现象                      | 修法                                   |
| --------------- | ------------------------- | -------------------------------------- |
| 魔数被改/删     | Wireshark 拒开"不是 pcap" | 010 对照 5.1 补/改头 4 字节            |
| 文件被截断      | 打开就报错，只能看几个包  | 删掉最后不完整包（工具 pcapfix）       |
| 数据被加密/异或 | 打开正常但内容全乱        | 按字节统计异或密钥（见 Misc XOR 思路） |

```bash
pip install pcapng  # 或用开源 pcapfix 修复工具
```

---

## 6. 题型套路大全

> 按出现频率排序。每个题型给"识别 → 打法"。

### 6.1 HTTP 明文挖掘（最高频）

**识别**：Protocol Hierarchy 里 HTTP 占比大。

**打法**：

```
1. http.request.method=="POST"   → 登录/上传请求
2. Follow HTTP Stream            → 看完整表单：username=admin&password=xxx
3. frame contains "flag"         → 全文搜
4. Export Objects → HTTP         → 导出图片/压缩包（接着走 Misc 套路）
```

### 6.2 FTP / 邮件明文（第二高频）

**识别**：端口 21 / 25 / 110，或协议列表有 FTP/SMTP/POP3。

**打法**：

```
FTP：Follow TCP Stream(21端口) → 看 USER/PASS/STOR 命令
     数据通道（另一端口）→ Follow → Raw 模式 Save as → 得到传输的原始文件
SMTP：跟流 → 邮件正文直接读；附件是 base64 块 → 抠出来 base64 -d
POP3：跟流 → USER/PASS 明文 + RETR 拉取的邮件
```

> FTP 数据流导出注意选 **Raw**（别用 ASCIIDump，会加换行毁掉二进制文件）。

### 6.3 文件提取全家

除了 Export Objects，万能兜底：

```bash
foremost flag.pcap -o out/       # 按魔数雕出 jpg/zip/pdf（Misc 篇 5.1 同款）
binwalk -e flag.pcap             # 嵌套文件扫描提取
```

### 6.4 USB 键盘/鼠标流量还原（Misc 系第一计算题）

**场景**：题目给一个"插着键盘记录器"的 USB 流量包——**还原敲了什么字/画了什么图**。

**键盘 HID 协议**：每个按键一次中断传输，**8 字节报告**：

```
[修饰键][保留][键码1][键码2]...[键码6]
   ↑byte0     ↑byte2 是主键码
byte0: bit0=左Ctrl bit1=左Shift bit5=右Shift（判断大小写/符号全靠它）
```

**核心键码表**（背高频段）：

```
0x04=a  0x05=b  0x06=c ... 0x1d=z      （字母=0x04+序号）
0x1e=1  0x1f=2 ... 0x26=9  0x27=0
0x28=回车  0x2c=空格  0x2d=-  0x2e=  0x2f=[  0x30=]  0x33=;
```

**打法三步**：

```bash
# ① 抠出数据（Wireshark 3.x 用 usb.capdata，老版本用 usbhid.data）
tshark -r usb.pcap -Y "usb.capdata && usb.data_len == 8" -T fields -e usb.capdata > raw.txt
# ② 脚本映射
```

```python
KEY = {0x04:'a',0x05:'b',0x06:'c',0x07:'d',0x08:'e',0x09:'f',0x0a:'g',0x0b:'h',
       0x0c:'i',0x0d:'j',0x0e:'k',0x0f:'l',0x10:'m',0x11:'n',0x12:'o',0x13:'p',
       0x14:'q',0x15:'r',0x16:'s',0x17:'t',0x18:'u',0x19:'v',0x1a:'w',0x1b:'x',
       0x1c:'y',0x1d:'z',0x1e:'1',0x1f:'2',0x20:'3',0x21:'4',0x22:'5',0x23:'6',
       0x24:'7',0x25:'8',0x26:'9',0x27:'0',0x28:'\n',0x2c:' ',0x2d:'-',0x2e:'=',
       0x2f:'[',0x30:']',0x33:';',0x36:',',0x37:'.'}
SHIFT = {0x1e:'!',0x1f:'@',0x20:'#',0x21:'$',0x22:'%',0x23:'^',0x24:'&',0x25:'*',
         0x26:'(',0x27:')',0x2d:'_',0x2e:'+',0x30:'}',0x33:':'}
out = ''
for line in open('raw.txt'):
    d = bytes.fromhex(line.strip().replace(':',''))
    mods, key = d[0], d[2]
    if key == 0: continue                      # 空报告（松键）
    if mods & 0x22 and key in SHIFT: out += SHIFT[key]      # 按住 Shift
    elif key in KEY: out += KEY[key].upper() if mods & 0x22 else KEY[key]
print(out)
```

**鼠标流量**：报告一般是 4 字节 `[按键][x位移][y位移][滚轮]`（位移是有符号数）：

```python
# 累加每次位移，matplotlib 画轨迹图 —— 鼠标"写"出 flag 的字迹
xs, ys, x, y = [], [], 0, 0
for line in open('raw.txt'):
    d = bytes.fromhex(line.strip().replace(':',''))
    if d[0] & 0x01: xs.append(None); ys.append(None); continue   # 按下=换笔
    x += int.from_bytes(d[1:2],'little',signed=True)
    y += int.from_bytes(d[2:3],'little',signed=True) * -1
    xs.append(x); ys.append(y)
import matplotlib.pyplot as plt
plt.plot(xs, ys); plt.gca().set_aspect(1); plt.show()
```

### 6.5 蓝牙流量

结构与 USB HID 类似：协议层是 `btatt`（HID over ATT），数据字段 `btatt.value`。键码表同 6.4。过滤：

```
tshark -r bt.pcap -Y "btatt.opcode == 0x52" -T fields -e btatt.value
```

### 6.6 特殊协议题

- **Modbus**：过滤 `modbus`，看功能码（03 读保持寄存器/06 写单寄存器）→ 把寄存器值序列提取出来分析（常转 ASCII 拼字符）
- **DICOM**：Export Objects → DICOM 直接导 CT 图 → 翻图找 flag
- **自定义 TCP 协议**：跟流看字节规律（长度头/分隔符），scapy 按格式切

---

## 7. 隐蔽信道

**出题人把数据拆碎藏进"看起来正常"的流量**。四大暗格逐一摸。

### 7.1 ICMP data 字段

ping 的载荷本该是固定模式字节（`abcdef...`），藏了东西就不正常：

```
过滤 icmp → 看每个包的 Data 字段 → 长度异常/内容异常 → 按序拼接
tshark -r f.pcap -Y icmp -T fields -e data.data > hex.txt   # hex 解码
```

### 7.2 DNS 隧道（子域名藏数据）

外泄数据被编码塞进子域名：

```
dGhpcyBpcyBmbGFn.malicious.com   ← 子域名是 Base32/Base64 数据！
```

```
tshark -r f.pcap -Y "dns.flags.response == 0" -T fields -e dns.qry.name
# 取所有查询域名 → 去掉固定后缀 → 按序拼 → Base32/Base64 解码
```

识别特征：**大量查询同一主域、子域名长得像乱码**、TXT 记录返回奇怪内容。

### 7.3 TCP 头暗格

- **seq 低几位**藏字符：正常 seq 递增，藏数据的包 seq 尾数解码出 ASCII
- **窗口大小 / IP 的 TTL / Identification 字段**：值异常跳动 = 逐包藏一字节

打法：脚本逐包抽字段 → 拼接 → 看是否可读。

### 7.4 HTTP 头花活

- **异常头字段**（`X-Secret: xxx`）
- **头的大小写交替**（大小写本身编码信息）
- **Cookie 值超长**（Base64）
- **URL 参数逐包拼**（每包传一个字符）

---

## 8. WiFi流量专题

### 8.1 802.11 帧三兄弟

| 类别       | 干什么     | 代表                                          |
| ---------- | ---------- | --------------------------------------------- |
| 管理帧     | 组网/广播  | **Beacon**（AP 定时广播 SSID）、Probe（探测） |
| 控制帧     | 辅助收发   | RTS/CTS/ACK                                   |
| **数据帧** | 真正的数据 | 加密（WPA2 下看不到内容！）                   |

**明文可见**：Beacon 里的 SSID、信号强度、频道、设备 MAC——**重建"现场有哪些设备"没问题；看内容要解密**。

### 8.2 WPA2 握手与破解（考法核心）

设备连 WiFi 时走 **四次握手（EAPOL 包）**——握手包被密码保护着。攻击路径：

```
① 找握手：过滤 eapol   → 有 4 条 EAPOL = 完整握手（可破解）
② 跑字典：aircrack-ng wifi.pcap -w 字典.txt   → 破出 WiFi 密码
③ 解密：把密码转成 key 喂给 Wireshark
   Preferences → Protocols → IEEE 802.11 → Enable decryption
   → Decryption keys: wpa-pwk "破出的密码:SSID"
   → 数据帧瞬间变成明文 HTTP → 回 6.1 套路
```

命令行解密另存：`airdecap-ng -e SSID -p 密码 wifi.pcap` → 生成解密后的 pcap。

### 8.3 无线侧信道小知识

- Beacon/Probe 里能看到**所有连过的设备 MAC**（结合 OUI 认厂商）
- SSID 本身可藏信息（改 SSID 传字节——管理帧也算隐蔽信道！）

---

## 9. 工具链全家桶

| 工具                   | 用途         | 关键点                                               |
| ---------------------- | ------------ | ---------------------------------------------------- |
| **Wireshark**          | 图形化主战场 | 过滤器/跟流/导出对象/协议分级                        |
| **tshark**             | 命令行批量   | `-r -Y -T fields -e`                                 |
| **NetworkMiner**       | 自动取证     | 拖入 pcap 自动还原文件/凭证/会话（Windows 图形工具） |
| **scapy / pyshark**    | Python 解析  | 复杂逻辑脚本化                                       |
| **aircrack-ng 套件**   | WiFi         | `aircrack-ng / airdecap-ng`                          |
| **foremost / binwalk** | 兜底提取     | 按魔数雕刻                                           |
| **010 Editor**         | 修文件头     | 魔数修复                                             |
| **CyberChef**          | 解码辅助     | DNS 隧道/ICMP hex 批量解                             |

### 9.1 每个新 pcap 的"第一分钟"

```
1. file xxx.pcap 看类型（还是 pcapng？损坏？）
2. Wireshark 打开 → Statistics → Protocol Hierarchy 看协议占比
3. Statistics → Conversations 看谁话多
4. 过滤降噪：!(arp || icmp || dns) 逐层收窄
5. frame contains "flag" 伸手党检查（万一直接搜到呢）
```

---

## 10. 解题流程与心法

### 10.1 通用流程

```
1. 摸底：file → Wireshark 打开 → Protocol Hierarchy / Conversations
2. 定主战场：占比最高的"业务协议"是什么？（HTTP？FTP？USB？Modbus？）
3. 降噪过滤 → Follow Stream 逐条看对话
4. 提取：Export Objects / foremost / tshark 字段导出
5. 特殊题型转专章套路（USB 键鼠→6.4，WiFi→8，隐蔽信道→7）
6. 提取产物继续撬（图/压缩包/编码 → Misc 篇套路接力）
```

### 10.2 卡住检查清单

- 全是 TLS 看不到内容 → 有没有 keylogfile/私钥附件？没有则信息藏在 SNI/包大小/时序里
- HTTP 里没 flag → 试 FTP/SMTP/自定义协议；导出对象翻每个文件
- USB 流量 `usb.capdata` 过滤为空 → Wireshark 版本差异（usbhid.data）/ 需要 USB 描述符解析（按题目 README 提示）
- 看着都正常 → 隐蔽信道五暗格过一遍（ICMP/DNS 子域/seq/TTL/ID）
- 包打开报错 → 回第 5 章修复文件头

### 10.3 心法四条

1. **先统计后细节**：Protocol Hierarchy + Conversations 十秒看清全貌，别从第一个包硬读
2. **明文协议优先**：HTTP/FTP/SMTP 的产出概率远大于加密流量
3. **流量题是链条题**：流量包 → 文件 → 图片/压缩包 → flag，后段全是 Misc 篇的功夫
4. **异常即线索**（与 Misc 同源）：包大小均匀异常、时间间隔规律、字段值跳动——正常流量不会这么"整齐"

---

## 11. 学习路线与资源

### 11.1 建议顺序（别跳）

```
四层模型 + 三次握手(吃透) → Wireshark 过滤器背熟
  → HTTP/FTP/SMTP 题练手(跟流+导出对象)
    → 文件提取兜底技能(foremost)
      → USB 键鼠还原(脚本必写一遍) → 隐蔽信道四暗格
        → WiFi(握手包+aircrack) → TLS 解密条件 → 特殊协议(Modbus/DICOM)
```

### 11.2 练习平台

- **CTFHub 技能树（流量分析）**—— 分类最贴合本篇：协议专题/USB/隐蔽信道逐个练
- **BUUCTF / 攻防世界 Misc-Flow 区** —— 复盘题多
- 自练素材：自己抓包（Wireshark 开着逛网页/传 FTP/敲键盘再保存），**知道自己怎么造的数据，就知道别人怎么藏**
- 附件：Wireshark 官方样例包（wiki.wireshark.org/SampleCaptures，几十种协议的真实样本）

### 11.3 参考资料

- 《Wireshark 网络分析就这么简单》（林沛满）—— 中文入门第一书，故事化教学
- 《Wireshark 数据包分析实战》—— 稍深
- CTF Wiki - 流量分析章节 —— 题型套路汇总
- 各种 CTF 赛后 writeup 的流量题合集（GitHub 搜 "CTF pcap writeup"）

### 11.4 给新手的几句实在话

1. **过滤器是肌肉记忆**：`ip.addr`、`tcp.port`、`contains`、`&&/||/!` 写不熟等于瞎子
2. **三次握手必须能默画**：TCP 是流量世界的地基，握手看不懂就谈不上分析
3. USB 键盘题**亲手写一遍脚本**——抄脚本=不会，写完= forever
4. 看 Wireshark 时永远带着问题看（"这个 IP 在干嘛？"），漫无目的翻包必迷路
5. 和五篇兄弟联动：HTTP→Web、提取文件→Misc、解密→Crypto，流量篇是**战场，不是孤岛**
6. 自己抓包是最快的学习方式：造一遍，胜看十遍

---

*完 —— 流量分析的本质：网络从不删除记录，它只是把秘密切碎了撒进千万个包里；你负责把它们捡回来。*