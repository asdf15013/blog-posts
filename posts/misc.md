---
title: 杂项（Misc）知识总结
date: 2026-11-17
category: CTF
tags: [CTF, Misc]
---

# 杂项（Misc）知识总结
> 适用对象：准备入坑 CTF Misc 方向的新手，配套 Pwn / RE / Web 三篇食用
> 目标：从"拿到一张图一个压缩包只会双击打开"到"知道每种文件该用什么工具撬开、什么套路该往哪想"

---

## 目录

0. [杂项是什么](#0-杂项是什么)
1. [文件本质与文件头](#1-文件本质与文件头)
2. [图片隐写](#2-图片隐写)
3. [压缩包攻防](#3-压缩包攻防)
4. [音频与视频隐写](#4-音频与视频隐写)
5. [取证与恢复](#5-取证与恢复)
6. [编码大全与奇怪文本](#6-编码大全与奇怪文本)
7. [OSINT社工与杂题](#7-osint社工与杂题)
8. [其他常见杂项](#8-其他常见杂项)
9. [工具链全家桶](#9-工具链全家桶)
10. [解题流程与心法](#10-解题流程与心法)
11. [学习路线与资源](#11-学习路线与资源)

---

## 0. 杂项是什么

**Misc = Miscellaneous（杂七杂八）**——CTF 里不属于 Pwn/RE/Web/Crypto 四大金刚的题**全都归它**：图片藏东西、压缩包要密码、音频听猫腻、内存里翻文件、看图找地址、甚至玩个游戏拿 flag。

> **通俗理解**：其他方向是"正规军打仗"（有固定漏洞类型和打公式），Misc 是"侦探破案"——现场给你一堆杂物（图/包/音频/内存镜像），你得**观察异常 → 判断作案工具 → 用对工具撬开**。练的是"工具箱广度 + 直觉"。

### 0.1 Misc 题的五大门派（本篇目录对应）

| 门派                  | 典型题面                         | 核心技能      |
| --------------------- | -------------------------------- | ------------- |
| **隐写**（Stego）     | 一张图/一段音频："里面有东西"    | 第 2、3、4 章 |
| **取证**（Forensics） | 镜像/内存 dump："找出他干了什么" | 第 5 章       |
| **编码**（Encoding）  | 一坨看不懂的符号                 | 第 6 章       |
| **社工/OSINT**        | 一张照片："这是哪里拍的？"       | 第 7 章       |
| **脑洞/杂技**         | 游戏、PDF、二维码……              | 第 8 章       |

### 0.2 Misc 的第一性原理

所有隐写/取证题都建立在这句话上：

> **文件 = 数据 + 结构。你"看到"的只是数据被结构解释后的样子——换一种解释方式，就可能看到另一个世界。**

一张 1MB 的"风景图"：

- 用图片查看器看 → 风景
- 用十六进制看 → 可能尾部藏了个 zip
- 用 zsteg 看 → 像素最低位可能藏着文本
- 改宽高再开 → 可能下半张图才是 flag

**Misc 的一切套路，本质都是"换姿势解释文件"。**

---

## 1. 文件本质与文件头

### 1.1 一切皆字节：文件头（Magic Number）

操作系统和工具**不看你文件叫什么名字，只看开头几个字节**来决定"这是个啥"。这个签名叫**文件头/魔数（Magic Number）**——改后缀骗不了它。

**必背魔数表**（见到字节串直接报菜名）：

| 文件 | 魔数（hex）   | 记忆                                           |
| ---- | ------------- | ---------------------------------------------- |
| PNG  | `89 50 4E 47` | `\x89PNG`                                      |
| JPEG | `FF D8 FF`    | 开头很规律                                     |
| GIF  | `47 49 46 38` | ASCII `"GIF8"`                                 |
| ZIP  | `50 4B 03 04` | ASCII `"PK"`（zip/jar/docx/xlsx/apk 全是它！） |
| RAR  | `52 61 72 21` | ASCII `"Rar!"`                                 |
| 7z   | `37 7A BC AF` | `"7z"`                                         |
| PDF  | `25 50 44 46` | ASCII `"%PDF"`                                 |
| BMP  | `42 4D`       | ASCII `"BM"`                                   |
| ELF  | `7F 45 4C 46` | `\x7fELF`                                      |
| PCAP | `D4 C3 B2 A1` | 流量文件（见流量篇）                           |

> **zip 全家桶认知**：`.zip .jar .apk .docx .xlsx .pptx .apk` 开头都是 `PK`——**docx 本质是个 zip**（改后缀解压就能翻里面的 XML）。

### 1.2 三板斧：拿到任何文件先做

```bash
file xxx                # ① 用魔数认真实类型（名字和实际不符 → 有戏！）
strings xxx | head      # ② 捞可读字符串（藏的提示/密钥/base64 串）
binwalk xxx             # ③ 扫嵌套文件（尾部藏 zip/多文件拼接会现形）
```

**binwalk 显示嵌套文件 → 一条命令全拆出来：**

```bash
binwalk -e xxx          # 自动提取（输出在 _xxx.extracted/ 目录）
```

### 1.3 十六进制编辑器：010 Editor / HxD

Misc 人的"手术刀"。必会操作：

- **跳转偏移**（Ctrl+G）
- **改字节**（patch 宽高/魔数/标志位全靠它）
- 010 的**模板解析**（Template）能按结构高亮 PNG/ZIP 每个字段——结构学习神器

### 1.4 最常见的考法：文件头修复

题目给一个"打不开的文件"，九成是**魔数被抠掉/改错**：

```
拿到 flag.jpg 打不开 → 010 打开看开头 → 开头不是 FF D8
→ 手动补上 FF D8 FF E0 → 秒开
（同理 PNG 补 89 50 4E 47 0D 0A 1A 0A）
```

---

## 2. 图片隐写

图片隐写是 Misc 的**第一大题源**。先懂 PNG/JPG 结构，再懂藏法。

### 2.1 PNG 结构（必懂，宽高修复的基础）

```
89 50 4E 47 0D 0A 1A 0A   ← 固定文件头
┌─ IHDR 块 ──────────────────────┐
│ 长度(4B) + "IHDR" + 数据区      │
│ 数据区前 8 字节: [宽度 4B][高度 4B]  ← 偏移 0x10~0x17
└────────────────────────────────┘
IDAT 块 ×N   ← 真正的图像压缩数据
IEND 块      ← 文件结束标志（66 8E 8B F4 + CRC）
```

**关键点**：图像真实宽高就写在文件第 16~24 字节（0x10 处开始）。

### 2.2 宽高隐写（出现率极高）

**原理**：真实图片宽高 500×800，文件里被改成 500×200 → 图片查看器只显示上半截，**下半截数据还在文件里但渲染不出来**。

**识别**：图片打开"下面被截断/显示不全/扔出 CRC 警告"。

**修复脚本**（爆出真实宽高并改回）：

```python
import struct, zlib, pathlib

data = bytearray(pathlib.Path('flag.png').read_bytes())
w, h = struct.unpack('>II', data[16:24])   # 当前宽高
# 爆破：试所有宽高组合，哪个能让整块 IDAT 的 CRC 校验通过，哪个就是真的
idat_start = data.find(b'IDAT') - 4
target_crc = struct.unpack('>I', data[idat_start+13:idat_start+17])[0]
for nw in range(1, 2000):
    for nh in range(1, 2000):
        d = data.copy()
        d[16:24] = struct.pack('>II', nw, nh)
        if zlib.crc32(d[12:idat_start+13]) == target_crc:
            print('真实宽高:', nw, nh)
            d[16:24] = struct.pack('>II', nw, nh)
            pathlib.Path('fixed.png').write_bytes(d)
            break
```

> 记忆：**PNG 每个块末尾都有 CRC 校验，宽高改错 CRC 必不过**——这就是爆破的判据。

### 2.3 LSB 隐写（最低有效位）

**原理**：像素每个通道 8 位，**最低 1 位（LSB）改了肉眼完全看不出**（颜色差 1/256）。把数据按 bit 藏进每个像素的最低位。

```
像素 RGB 值 (10110010) → 改成 (10110011) → 人眼无感，但第 8 位全是数据
```

**工具二连**：

```bash
zsteg flag.png        # 一条命令自动扫所有 LSB 通道+顺序，藏了直接吐出来（PNG 专用）
```

- **zsteg**（PNG）：输出形如 `b1,r,lsb,xy -> text "flag{...}"`，每个组合都是一种藏法
- **stegsolve**（万能）：Java 小工具，逐个翻**通道视图**（R/G/B/Alpha 的 0~7 位）→ 藏了文字的通道会突然显出白色噪点文字图

**手写 LSB 提取**（zsteg 不装时）：

```python
from PIL import Image
img = Image.open('flag.png').convert('RGB')
bits = ''
for y in range(img.height):
    for x in range(img.width):
        r, g, b = img.getpixel((x, y))
        bits += str(r & 1)          # 取 R 通道最低位；不对就换 g、b
bytes_ = bytes(int(bits[i:i+8], 2) for i in range(0, len(bits) - 7, 8))
print(bytes_[:100])
```

### 2.4 文件尾附加（最朴素也最常见）

**原理**：PNG 的 IEND 之后、JPG 的 `FF D9` 之后**追加任何字节都不影响图片显示**——出题人直接把 zip/flag 贴在尾巴上。

```bash
binwalk flag.png          # 看到 "Zip archive data" → 有货
binwalk -e flag.png       # 拆出来（往往得到一个要密码的压缩包 → 接第 3 章）
```

手拆：010 里搜 `50 4B 03 04`（PK 头）→ 从那里复制到文件尾 → 存成 zip。

### 2.5 JPG 特色

- 结构标记：开头 `FF D8`（SOI），结尾 `FF D9`（EOI）——**EOI 之后有东西 = 尾部附加**
- JPG 是**有损压缩**，像素级 LSB 藏不住 → JPG 用 **DCT 系数域**藏：工具是 **steghide**（带密码）、outguess、F5

```bash
steghide extract -sf flag.jpg -p 密码     # 有密码时
steghide info flag.jpg                     # 先看有没有藏东西
outguess -r flag.jpg out.txt              # steghide 不行试它（常无密码）
```

### 2.6 其他图片套路速查

| 套路            | 识别                  | 工具/操作                                          |
| --------------- | --------------------- | -------------------------------------------------- |
| **Exif 信息**   | 元数据藏 flag/坐标    | `exiftool flag.jpg`（GPS 也在这！）                |
| **通道分离**    | 彩色图某通道藏文字    | stegsolve 逐通道翻                                 |
| **GIF 帧分离**  | 某一帧藏东西/快速闪过 | `convert flag.gif co_*.png` 或在线拆帧             |
| **图片拼接**    | 两张图/图有拼缝       | 盯交界处；stegsolve 的 Image Combiner 两图 XOR/Add |
| **色差/对比度** | 看似空白区域藏白字    | stegsolve 调 Curve/Brightness                      |
| **二维码缺角**  | 二维码损坏            | PS/画图补角（QR 有容错，缺一角也能扫）             |

---

## 3. 压缩包攻防

第二大题源。几乎所有 Misc 题的"最后一关"都是一个 zip。**四种死法逐一排查**。

### 3.1 ZIP 结构（懂结构才懂攻击）

```
[Local File Header 文件1]（含文件名、标志位、压缩数据）
[Local File Header 文件2]...
[Central Directory 中央目录]  ← 文件清单（真正的加密标志在这）
[EOCD 结束记录]
```

**加密标志**：Header 的 **General Purpose Bit Flag** 第 0 位（值 1 = 加密）。伪加密就是手动把这个位改成 1。

### 3.2 死法一：伪加密（没密码的"假加密"）

**识别**：打开提示要密码，但**文件能正常看到文件名列表**、`unzip -l` 正常 → 八成伪加密。

**操作**（010 编辑器）：

```
搜 50 4B 03 04 → 往后数到 flag 字节（偏移 +6 的 2 字节）→ 改成 00 00
搜 50 4B 01 02 → 中央目录里同样位置 → 改成 00 00
保存 → 直接解压，无密码！
```

> 原理：解压工具只看标志位决定"要不要问你要密码"——标志位是假的，密码自然也是假的。

### 3.3 死法二：真密码——按线索选打法

| 线索                          | 打法                                            |
| ----------------------------- | ----------------------------------------------- |
| 题目描述/图片里有"密码：xxx"  | 直接输（社工式给密码，先试！）                  |
| 密码是 4~6 位纯数字           | **暴力爆破**：ARCHPR（Windows）跑数字字典，秒出 |
| `hashcat`/`john` 流派         | `zip2john flag.zip > hash.txt && john hash.txt` |
| 密码是"这个 zip 自己的 CRC32" | 见 CRC32 攻击（3.5）                            |

### 3.4 死法三：明文攻击（已知 zip 里某个文件的内容）

**场景**：zip 里有个 `readme.txt`，而你在网上找到了这个 txt 的原文 → 可以**不爆破直接解出整个 zip**。

```bash
# 工具：bkcrack（github 开源）
# 前提：明文至少 12 字节连续已知
bkcrack -C flag.zip -c readme.txt -p known_readme.txt
# 输出 keys 后解密全部：
bkcrack -C flag.zip -k 1234abcd 5678ef90 11223344 -d decrypted.zip
```

> 原理：zip 的传统加密是流式异或——拿着已知明文对可以**反推出内部密钥流**，进而解其他文件。通俗：抄了近路的部分答案，推出答案本。

### 3.5 死法四：CRC32 爆破（小文件内容的"指纹"）

**场景**：zip 里有个**很短的文件**（几字节~几十字节）被加密，密码难爆 → **利用每个文件自带的 CRC32 值反推内容**。

- CRC32 是内容的"指纹"：内容短 → 指纹反推原内容可行（几字节内容秒出）
- 工具/脚本：`crcbrute`，或 Python 暴力枚举短字符串比对 CRC

### 3.6 RAR / 7z / 其他

- RAR 伪加密：010 改 head 区 flag 字节（偏移与 zip 不同，查资料）
- 7z 加密连文件名都藏 → 只能爆破（ARCHPR 支持 7z）
- **压缩包套娃**：解出一层里面又一层（每层换打法），耐心逐层拆

---

## 4. 音频与视频隐写

### 4.1 三大件先过一遍

```bash
file xxx.mp3                  # 真实格式？
exiftool xxx.mp3              # 元数据（注释/作者里常藏提示）
binwalk xxx.mp3               # 尾部藏文件
strings xxx.mp3 | grep -i flag
```

### 4.2 摩斯电码（听 + 看）

音频里"滴滴滴"的节奏：短=点（.），长=划（-），停顿=分隔。两条路：

- **听**：Audacity 打开，肉眼对照波形/人耳听
- **看**：**频谱图（Spectrogram）直接把声音"画"出来**——很多题根本不是摩斯，是**直接在频谱上画了字**！

> **频谱图是音频隐写第一杀器**：Audacity → 音轨左侧下拉 → Spectrogram → 屏幕上可能直接写着 flag（高频段画图）。`sox xxx.mp3 -n spectrogram -o spec.png` 命令行版。

### 4.3 波形/振幅隐写

- **极低/极高频段**藏图形（频谱图看）
- **波形数据藏文本**：直接把 wav 的采样字节 dump 出来看：

```python
import wave
w = wave.open('flag.wav')
frames = w.readframes(w.getnframes())
print(frames[:200])      # 有可读文本 = 振幅最低位藏字（LSB 音频版）
```

- wav LSB 提取：取每采样最低位拼字节（和图片 LSB 同理，DeepSound 工具可自动化）

### 4.4 MP3Stego（MP3 专属）

MP3 压缩时嵌数据，必须用原工具+密码解：

```bash
MP3StegoDecode.exe -X -P 密码 flag.mp3     # 输出 .txt/.bmp
```

### 4.5 视频杂项

- **逐帧翻**：`ffmpeg -i flag.mp4 frames/%04d.png` → 某一帧有货
- **视频元数据/字幕流**：`exiftool`、`ffmpeg -i` 看流信息
- **音轨**：视频音轨照音频套路来一遍（频谱图！）

### 4.6 两个音频组合（Audio Stego 组合拳）

stegsolve 的 **Image Combiner** 思路搬到音频：两段 wav 相减/异或，抵消正常部分剩隐藏部分（Python numpy 一行搞定）。

---

## 5. 取证与恢复

题面从"文件里藏东西"升级为"**从现场还原发生过什么**"。对象：磁盘镜像、内存 dump、流量包（流量单独成篇）。

### 5.1 文件雕刻（File Carving）：foremost

**原理**：文件系统不管了，直接按**文件头/尾魔数**在原始字节流里"雕刻"出文件（恢复已删除文件的核心思想）。

```bash
foremost -i disk.img -o out_dir/     # 输出按类型分文件夹：jpg/ pdf/ zip/ ...
binwalk -e disk.img                  # binwalk 也能干同样的事
```

### 5.2 磁盘镜像分析

```bash
file disk.img                     # 可能是 ext4/ntf 的 raw 镜像
mount -o ro disk.img /mnt         # Linux 直接挂载（只读！）
ls /mnt                           # 翻目录找 flag（含隐藏文件 ls -la）
```

- **已删除文件**：挂载看不到 → foremost 雕刻
- **FTK Imager / Autopsy**：图形化取证工具（Windows 友好，能看时间线/注册表）

### 5.3 内存取证：Volatility（取证题重头戏）

**场景**：给一个 `.raw/.mem/.dmp` 内存快照——程序运行时的全部现场（进程、命令行、网络、文件、密码、屏幕内容）都在里面。

> 通俗理解：**电脑突然断电那一瞬间，把整条内存拍了张照片**。照片里能看到每个进程当时在干嘛。

```bash
# volatility2 流程（v3 命令不同但思路一致）
volatility -f mem.raw imageinfo          # ① 认系统版本（Suggest Profile: Win7SP1x64）
volatility -f mem.raw --profile=Win7SP1x64 pslist      # ② 进程列表（找可疑进程）
volatility -f mem.raw --profile=Win7SP1x64 cmdscan     # ③ 历史命令行（flag 常在这！）
volatility -f mem.raw --profile=Win7SP1x64 filescan    # ④ 文件列表（grep flag）
volatility -f mem.raw --profile=Win7SP1x64 dumpfiles -Q 0x地址 -D out/  # ⑤ 抽出文件
volatility -f mem.raw --profile=Win7SP1x64 screenshot  # ⑥ 还原当时屏幕画面
volatility -f mem.raw --profile=Win7SP1x64 hashdump    # ⑦ 密码哈希
notepad.exe 相关: notepad 插件 / editbox 可抠出记事本里正在输入的文本
```

**做题顺序口诀：认版本 → 看进程 → 翻命令 → 搜文件 → 抠内容。** `cmdscan` 和 `screenshot` 是 flag 高产田。

### 5.4 日志与注册表

- **日志**：`/var/log/auth.log`（登录记录）、nginx access.log（访问痕迹）、Windows 事件日志（`.evtx`，工具 Event Log Explorer）
- **注册表**（Windows 镜像）：`SYSTEM/SOFTWARE/SAM` hive → **RegRipper** 工具一键解析；USB 使用痕迹（插过什么 U 盘）、开机密码策略都在这

---

## 6. 编码大全与奇怪文本

Misc 题里"一坨符号"类：**认出编码/密码体系 = 解题 90%**。全套速查表。

### 6.1 标准编码家族（CyberChef 一键识别）

| 编码               | 长相特征                                 | 例子               |
| ------------------ | ---------------------------------------- | ------------------ |
| **Base64**         | A-Za-z0-9+/，末尾 `=` 填充，4 的倍数长度 | `ZmxhZ3t4eHh9`     |
| **Base32**         | A-Z2-7，末尾多个 `=`，全大写             | `MZWGC233EBSGS43N` |
| **Base16(=Hex)**   | 0-9a-f，偶数长度                         | `666c6167`         |
| **Base58**         | Base64 去掉易混字符（无 0OIl+\/）        | 比特币地址系       |
| **Base85/Ascii85** | 出现标点符号混排                         | `<~87cURD]i,"..~>` |
| **URL 编码**       | `%xx` 成串                               | `%E4%BD%A0`        |
| **Unicode 转义**   | `\u4f60` 或 `&#20320;`                   | 网页源码里         |

**解码万能解法**：CyberChef（在线）→ **Magic 配方**自动逐层识别解码（嵌套 Base64 套 Base64 也能自动剥）。

### 6.2 摩斯电码（背常量）

```
A .-   B -... C -.-. D -..  E .
F ..-. G --.  H .... I ..   J .---
K -.-  L .-.. M --   N -.   O ---
P .--. Q --.- R .-.  S ...  T -
U ..-  V ...- W .--  X -..- Y -.-- Z --..
0 ----- 1 .---- 2 ..--- 3 ...-- 4 ....-
5 ..... 6 -.... 7 --... 8 ---.. 9 ----.
```

读法：`..` = I，`...` = S，`...---...` = SOS。分隔符常见 `/` 或空格。**在线工具/Python morse 库秒解。**

### 6.3 培根密码（Baconian）

每个字母 = 5 位 **A/B 序列**（两种符号：大小写、两种字体、AB 组合都算）：

```
aaaaa=A  aaaab=B  aaaba=C ... baaba=U ... bbbaa=Y  bbbbb=Z
```

识别：文本长度是 5 的倍数 + 只含两种"形态"差异。

### 6.4 中文场景"玄学密码"（国内赛特色）

| 名字                   | 长相                     | 解法                                      |
| ---------------------- | ------------------------ | ----------------------------------------- |
| **与佛论禅**           | `佛曰：遮虑遮诸栗…`      | 在线工具"与佛论禅"（需 key 时找题目提示） |
| **新佛曰/佛曰加密**    | `佛曰：諸諦婆羯…`        | 同类在线工具                              |
| **猪圈密码**           | 符号画成井字带点的图形   | 查表（每个符号=字母位置）                 |
| **银河字母/标准银河**  | 外星风符号               | 查表                                      |
| **跳舞的小人**         | 小人图案                 | 福尔摩斯跳舞小人密码查表                  |
| **当铺密码**           | 汉字按"出头笔画数"编数字 | 数出头的笔画                              |
| **敲击码（Tap code）** | 数字对 `(2,3)`           | 5×5 表格坐标→字母                         |

### 6.5 程序员系"奇文本"

| 名字                   | 长相                             | 解法                                                 |
| ---------------------- | -------------------------------- | ---------------------------------------------------- |
| **BrainFuck**          | `++++++++[>++++<...]`            | 8 个符号的图灵完备语言，在线解释器跑                 |
| **Ook!**               | `Ook. Ook? ...`                  | BrainFuck 换皮（三词组合对应 BF 八符号）             |
| **JSFuck**             | `[][(![]+[])[+[]]...`            | 纯 JS 符号写代码，浏览器 Console 直接 eval           |
| **颜文字 JS**          | `ﾟωﾟﾉ= /｀ｍ´）ﾉ ...`            | 同上，Console 跑                                     |
| **社会主义核心价值观** | `富强民主文明...`                | 在线工具"核心价值观编码"                             |
| **云影密码**           | `01248` 组成的数字串（0 是分隔） | 1~4 个数字映射字母（1=A 22=W...）                    |
| **键盘坐标**           | 一串数字对                       | 按电脑键盘布局 `qwert...` 行列取字母（或手机九宫格） |
| **TTT/电话按键**       | `4433555`                        | 多按键=第几个字母（4=44→H? 按手机九键：44=G）        |

### 6.6 栅栏/曲路（文本重排类）

- **栅栏密码**：明文切成 N 段竖着叠（`flag{a}` → 栏 2 → `flg{a}a` 型）。解法：试不同栏数重排
- **曲路密码**：按矩阵路径读字。画格子手动走

---

## 7. OSINT社工与杂题

**OSINT（Open Source Intelligence，开源情报）**：用公开信息（搜索引擎/地图/社交媒体）回答"这是哪/这是谁/这是什么时间"。

### 7.1 搜图三连（看图猜地点必会）

1. **反向搜图**：Google Lens / 百度识图 / TinEye / Yandex（**Yandex 对风景照最强**）
2. **EXIF 提取**：`exiftool photo.jpg` → GPS 坐标直接有（出题人忘删就是送分）
3. **人工线索**：招牌文字（语言/店名）、车牌颜色、建筑风格、山形、电线杆样式、阳光方向+影子定南北

**坐标拿去哪**：Google Maps / 百度地图搜坐标 → 地名往往就是 flag 或答案的一部分。

### 7.2 时间推断

- 照片 EXIF 的拍摄时间
- 影子长度 + 太阳高度 → 大致时段
- 社交媒体发帖时间戳

### 7.3 社工类套路

| 题型                   | 思路                                                |
| ---------------------- | --------------------------------------------------- |
| "找到他的 GitHub/微博" | 全网用户名搜索（ Sherlock 工具一次搜几十个平台）    |
| "密码是什么"           | 弱口令字典 + 生日/姓名拼音组合（社工字典生成器）    |
| "该邮件是谁发的"       | 邮件头 Received 链 + Return-Path 分析（流量篇衔接） |
| 一个故事多个平台线索   | 逐平台收集拼图（微博→QQ 空间→贴吧）                 |

### 7.4 杂题心态

OSINT/杂题没有固定工具，**拼的是信息检索耐心**：多换关键词、多换语言、多换搜索引擎（Google→Bing→百度→Yandex）。

---

## 8. 其他常见杂项

### 8.1 PDF 杂项

- PDF 也是"结构+数据"：**尾部常有附加文件**（Attachment）

```bash
binwalk file.pdf                 # 嵌套文件
pdfimages -all file.pdf out/     # 抽出所有内嵌图片
pdftotext file.pdf -             # 抽文本（含"看不见"的白字黑底文本！）
qpdf --qdf --object-streams=disable in.pdf out.pdf   # 展开对象流人工翻
```

- **隐藏层（OCG）**：PDF 页面有图层，白字/隐藏层用编辑器（LibreOffice Draw）打开翻

### 8.2 Office 文档（docx/xlsx/pptx）

- **本质是 zip**：改后缀解压 → `word/document.xml` 翻隐藏文本；`docProps/` 看作者元数据
- **隐藏文字**：Word 里"不显示的文本"（白字）→ 全选改黑色 / XML 里找 `vanish` 属性
- **宏病毒题**：`.docm` 看 VBA 宏（oletools：`olevba file.docm`）

### 8.3 二维码

- **缺定位角**：画图/PS 补上三个角（左上+右上+左下）
- **残缺能扫**：QR 容错最高 30%——缺一角先试直接扫
- **反色/颠倒**：黑白反转后再扫（有些工具不认）
- **非标准二维码**：颜色变换/特殊字符块 → 按同样规则还原成黑白

### 8.4 游戏类 Misc

题目是个小游戏（Unity exe / flash / 网页 JS 游戏）：

- **Unity 游戏**：data 目录用 **AssetStudio** 抽资源（图/文本，flag 可能贴在贴图里）
- **Flash**：JPEXS 反编译 swf 看代码
- **网页游戏**：F12 看源码/请求（衔接 Web 篇）
- **CE 改数值**：Cheat Engine 扫内存改分数解锁 flag

### 8.5 电子取证周边

- **FTK / Autopsy**：图形化全流程取证
- **手机备份**：`.ab`（Android adb backup，是个 tar）直接解
- **Windows 缩略图缓存**：`thumbcache_*.db`（Thumbcache Viewer 打开——**删掉的图片可能残留在缩略图缓存里！**）

---

## 9. 工具链全家桶

### 9.1 工具地图

| 类别     | 工具                                                   | 一句话        |
| -------- | ------------------------------------------------------ | ------------- |
| 十六进制 | **010 Editor**（带模板）/ HxD                          | 手术刀        |
| 识别     | file / binwalk / DIE                                   | 摸底三连      |
| 图片     | **stegsolve** / zsteg / steghide / outguess / exiftool | 图隐写全家    |
| 频谱     | Audacity / sox                                         | 音频第一杀器  |
| 压缩     | ARCHPR / zip2john+john / **bkcrack**                   | 爆破+明文攻击 |
| 取证     | **Volatility** / foremost / Autopsy / FTK Imager       | 内存+磁盘     |
| 编码     | **CyberChef**（Magic） / onlinejer（佛语等）           | 一站解码      |
| 搜索     | Google Lens / Yandex / Sherlock / exiftool             | OSINT         |
| 其他     | AssetStudio / JPEXS / qpdf / pdftotext / CE            | 杂技箱        |

### 9.2 快速安装

```bash
# Kali 大部分自带；缺的补：
pip install zsteg stegano     # zsteg 是 gem 装：gem install zsteg
apt install foremost exiftool sox volatility-tools
# Windows 手动装：010、ARCHPR、stegsolve、Audacity、AssetStudio、Volatility
```

### 9.3 每类文件的"第一分钟检查单"

| 文件       | 第一分钟做什么                                               |
| ---------- | ------------------------------------------------------------ |
| 图片       | file → binwalk → exiftool → stegsolve 翻通道 → zsteg（png）→ 看宽高 |
| 音频       | 频谱图！→ 听 → binwalk → strings                             |
| 压缩包     | 能不能开 → 伪加密？→ 爆破 or 明文 or CRC                     |
| PDF/Office | binwalk → pdftotext / 解压翻 XML                             |
| 镜像/raw   | file → foremost → volatility（内存）                         |
| 神秘文本   | CyberChef Magic 一键 → 对照第 6 章速查表                     |

---

## 10. 解题流程与心法

### 10.1 通用流程

```
1. 摸底：file 看真实类型（名字≠类型？有戏）
2. 扫描：binwalk / strings / exiftool 三连
3. 分类：图片？音频？压缩包？镜像？文本？
4. 套速查表（第 2~8 章对应章节的检查单）
5. 得到的中间产物（压缩包/密码/编码串）继续往下撬
6. 卡住 → 回第 1~2 步：是不是漏了什么？换工具再扫一遍
```

### 10.2 Misc 心法五条

1. **异常即线索**：文件大小和内容对不上（一张 5KB 的图却 2MB？→ 尾部有货）、图片显示不全、压缩包能看文件名却要密码
2. **工具失败 ≠ 没货**：stegsolve 没看出来试 zsteg，zsteg 没有试宽高，宽高没有试尾部——**按清单过，不要凭感觉**
3. **中间产物接力**：Misc 题是链条题（图→密码→压缩包→内存→flag），每解开一环别恋战，立刻奔向下一环
4. **提示语是考纲**：题目描述的每个字都可能是工具名暗示（"听"=音频，"层层深入"=套娃，"看不清"=宽高/白字）
5. **Google 是最强工具**：神秘符号复制粘贴直接搜——前人早踩过

---

## 11. 学习路线与资源

### 11.1 建议顺序（别跳）

```
文件结构认知(file/binwalk/010) → 图片隐写(宽高→LSB→steghide)
  → 压缩包四死法 → 音频(频谱图必练)
    → 编码大全(边做题边背表) → 取证(volatility 从 cmdscan 入门)
      → OSINT / PDF/Office / 二维码 / 游戏杂技
```

### 11.2 练习平台

- **ctfshow Misc 区** —— 分主题刷（本篇目录即路线图）
- **BUUCTF / 攻防世界 Misc 区** —— 复盘题海量
- **CTFHub 技能树（Misc）** —— 按考点逐个练
- 国内赛 Misc 常出"玄学编码"，见多就广

### 11.3 参考资料

- 《CTF 之 Misc 杂项入门》类中文教程 / 各大比赛官方 writeup 集
- CyberChef 官方 Recipe 收藏（把常用配方存起来）
- GitHub：stegano 工具合集、CTF-Misc 工具大全仓库
- 看雪/吾爱破解的取证与隐写专题帖

### 11.4 给新手的几句实在话

1. **工具装齐是第一生产力**：010/stegsolve/Audacity/Volatility 四件套没装好别开工
2. **每道题记"特征→工具"两行笔记**：Misc 的知识是查表型的，积累自己的速查表最快
3. 遇到"没见过的符号"先复制粘贴 Google，别硬啃
4. 压缩包四死法按顺序过：伪加密→给密码线索→CRC→明文攻击→爆破，**先便宜的再贵的**
5. Misc 是三大方向的"休息区"，也是**最好入门的方向**——先用它练出工具感，再回 Pwn/RE/Web
6. 和流量篇配套：取证题常混着 pcap 包，两篇工具箱共用

---

*完 —— Misc 的本质：万物皆字节，异常即线索，工具即刀，Google 即军师。*