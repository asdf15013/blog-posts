---
title: PWN教程
date: 2026-11-17
category: CTF
tags: [CTF, PWN]
series: PWN
---


# Pwn

> 适用对象：准备入坑 CTF Pwn 方向（二进制漏洞利用）的新手
> 目标：把"看不懂 wp"的门槛知识一次性讲明白，每个概念都配大白话解释

---

## 目录

0. [Pwn 是什么](#0-pwn-是什么)
1. [CPU 与寄存器](#1-cpu-与寄存器)
2. [内存布局：程序住在哪](#2-内存布局程序住在哪)
3. [栈与栈帧：Pwn 的命根子](#3-栈与栈帧pwn-的命根子)
4. [汇编基础](#4-汇编基础)
5. [函数调用约定](#5-函数调用约定)
6. [ELF 文件格式](#6-elf-文件格式)
7. [GOT / PLT：程序的通讯录](#7-got--plt程序的通讯录)
8. [Linux 系统调用](#8-linux-系统调用)
9. [C 语言与内存安全](#9-c-语言与内存安全)
10. [保护机制（checksec 六件套）](#10-保护机制checksec-六件套)
11. [常见漏洞类型](#11-常见漏洞类型)
12. [基础利用思路](#12-基础利用思路)
13. [glibc 堆管理入门](#13-glibc-堆管理入门)
14. [工具链全家桶](#14-工具链全家桶)
15. [完整解题流程](#15-完整解题流程把知识串起来)
16. [进阶攻击手法补全](#16-进阶攻击手法补全)
17. [libc 版本差异与 hook 时代](#17-libc-版本差异与-hook-时代)
18. [堆题菜单套路实战](#18-堆题菜单套路实战)
19. [自制靶机与附件处理](#19-自制靶机与附件处理)
20. [32 位与 64 位对照速查](#20-32-位与-64-位对照速查)
21. [新手术语速查表](#21-新手术语速查表)
22. [学习路线与资源](#22-学习路线与资源)

---

## 0. Pwn 是什么

**Pwn** 源于黑客文化里 "own"（拥有、掌控）的谐音拼写，读作 "pow-n"（像 "own" 那样读）。

在 CTF 里，**Pwn = 二进制漏洞利用**。出题方给你：

- 一个程序（ELF 可执行文件）
- 可能还有它的 libc（C 标准库）文件
- 一个远程服务器地址（如 `nc 1.2.3.4 9999`，程序就跑在上面）

你的任务是：**找到程序里的漏洞 → 利用漏洞控制程序执行流 → 拿到远程服务器 shell → 读取 flag**（一串类似 `flag{xxx}` 的通关口令）。

> **通俗理解**：对方开了家"程序银行"，明面上一切正常，但墙上有个没人注意的裂缝（漏洞）。你要研究裂缝的位置、形状，打造工具（exp），最终撬开保险柜拿走金条（flag）。

写出来的攻击脚本俗称 **exp**（exploit 的缩写）。

---

## 1. CPU 与寄存器

### 1.1 CPU 是什么样的工人

CPU 是个**速度飞快但毫无想象力**的工人：

1. 从内存取出一条指令（`rip` 寄存器指着"下一条读哪"）
2. 执行它
3. 把结果写回内存或寄存器
4. 重复，每秒几十亿次

它**绝对听话**——你让它跳转到哪它就去哪。Pwn 的核心思想就是：**通过漏洞篡改数据，欺骗 CPU "听话" 地跳到我们想去的地方**。

### 1.2 寄存器 = CPU 身上的口袋

内存离 CPU 有点远，读写慢。所以 CPU 自带十几个"口袋"（寄存器），用来放马上要用的数据。数量少、速度极快。

**x64 常用寄存器（大白话版）**：

| 寄存器                            | 作用（大白话）                                             |
| --------------------------------- | ---------------------------------------------------------- |
| `rax`                             | **返回值口袋**——函数算完的结果放这，"干完活交到这个口袋"   |
| `rdi` `rsi` `rdx` `rcx` `r8` `r9` | **传参口袋**——调用函数时第 1~6 个参数依次放这里            |
| `rsp`                             | **栈顶指针**——"盘子现在叠到哪了"，永远指向栈顶             |
| `rbp`                             | **栈底指针**——当前函数这层"抽屉"的基准线，方便定位局部变量 |
| `rip`                             | **指令指针**——"下一页书签"，指向下一条要执行的指令         |

**命名规则**（面试常问，做题也常遇到）：

- 64 位以 `r` 开头（`rax`），32 位是 `e` 开头（`eax`）
- `eax` 是 `rax` 的**低 32 位**（就是长口袋的下面半截）
- `al` 是 `rax` 的低 8 位，`ah` 是次低 8 位

```
63                            31              15        7  0
┌──────────────────────────────┬───────────────┬────┬────┬───┐
│            rax               │     eax       │ ax │ ah │al │
└──────────────────────────────┴───────────────┴────┴────┴───┘
```

> **为什么 Pwn 必须懂寄存器？** 因为最终你要"指挥" CPU：让 `rdi` 指向 `/bin/sh` 字符串、让 `rip` 跳到 `system` 函数。寄存器就是你的遥控器按键。

---

## 2. 内存布局：程序住在哪

### 2.1 虚拟地址：每个程序的"专属幻觉"

现代操作系统给每个进程一种幻觉：**你独占 4GB（32位）甚至 128TB（64位）内存**。这叫虚拟地址空间。实际物理内存由操作系统统一映射，互相隔离。

对 Pwn 来说你只需要关心**虚拟地址布局**（以 64 位典型布局为例）：

```
低地址
┌─────────────────────┐ 0x400000（无 PIE 时程序固定从这开始）
│  .text  代码段       │ ← 程序指令，只读+可执行
│  .rodata 只读数据    │ ← 字符串常量，只读
│  .data  已初始化全局 │ ← 全局变量（有初值的）
│  .bss   未初始化全局 │ ← 运行时才分配、清零
├─────────────────────┤
│  heap 堆 ↑向上增长   │ ← malloc 出来的内存在这
│         ...          │
│  (内存映射区)         │ ← libc.so 等动态库加载到这里！
│         ...          │
│  stack 栈 ↓向下增长  │ ← 函数调用现场在这
├─────────────────────┤
│  内核空间（禁止访问） │
└─────────────────────┘ 高地址（0x7fff...）
```

**记忆要点**：

- **堆往上长，栈往下长**，中间空着的地方留给 mmap（动态库）
- `.bss` 里的变量**不占文件体积**（因为初值是 0，没必要存），所以文件大小 ≠ 运行时占用
- **libc 映射在哪是 Pwn 半条命**：知道了 libc 基址，就能算出 `system`、`/bin/sh` 等一切的地址

### 2.2 为什么要区分"可读/可写/可执行"

每段内存有三种权限（r/w/x）。理想的安全设计是：

- 代码段：**r + x**（能读能执行，不许改）
- 数据段（栈/堆/.data）：**r + w**（能读能改，不许执行）

这就是后面讲的 NX 保护。**如果数据区也能执行**，我们往栈里塞一段机器码（shellcode）再跳过去执行就赢了——早期就是这么玩的。

---

## 3. 栈与栈帧：Pwn 的命根子

### 3.1 栈 = 叠盘子

栈（stack）是一种**先进后出**（LIFO）的数据结构，像叠盘子：最后放上去的盘子最先被拿走。

两个核心操作：

- `push`：压入——在栈顶放个东西（`rsp` 自动减 8，因为往低地址长）
- `pop`：弹出——拿走栈顶的东西（`rsp` 自动加 8）

### 3.2 为什么函数调用需要栈

函数调用是"嵌套"的：`main` 调 `funcA`，`funcA` 又调 `funcB`……每个函数都需要自己的地盘放**局部变量**和**回家地址**。用栈来管理最自然：调用时压一层（叠个盘子），返回时弹一层（拿走盘子）。

每层地盘就叫一个**栈帧（stack frame）**。

### 3.3 栈帧结构图（背下来！）

以 64 位为例，`main` 调用 `func(a, b)` 时栈的样子（**地址往下是递减，图里下面是低地址**）：

```
        高地址
        ┌──────────────────┐
        │   main 的栈帧      │
        ├──────────────────┤ ← rbp（func 的栈底基准线）
        │  saved rbp        │ ← func 的"爸爸的基准线"，返回时恢复
        ├──────────────────┤
        │  返回地址 (ret addr)│ ← call 指令自动压入：func 结束后回哪
        ├──────────────────┤
        │  局部变量 buf[16]  │ ← rsp（栈顶）在这附近
        │  局部变量 x        │
        └──────────────────┘
        低地址
```

### 3.4 函数调用完整流程（走一遍）

**调用时**（`main` 里执行 `call func`）：

1. `call` 指令 = `push 下一条指令的地址` + `jmp func`（把"回家地址"压栈，然后跳过去）

**进入 func 后**（序言 prologue）：

```asm
push rbp        ; 保存 main 的基准线
mov  rbp, rsp   ; 建立自己的基准线
sub  rsp, 0x20  ; 给局部变量腾出 0x20 字节空间
```

**返回前**（尾声 epilogue）：

```asm
leave           ; = mov rsp, rbp（栈顶回到基准线）+ pop rbp（恢复爸爸的基准线）
ret             ; = pop rip（把栈上的返回地址弹给 rip，跳回家）
```

### 3.5 栈溢出的原理（一句话版）

如果 `func` 里有个 16 字节的局部缓冲区 `buf`，而我们往里写 100 字节——C 语言不检查越界，多出来的 84 字节会**沿着内存一路往上盖**：盖掉局部变量、盖掉 saved rbp、**盖掉返回地址**。

等函数执行 `ret` 时，CPU 会把我们盖上去的值当成"回家地址"跳过去——**程序执行流被我们劫持了**。

> **通俗理解**：函数下班前看一眼桌上的回家纸条（返回地址）。栈溢出就是偷偷把纸条换了——它还傻乎乎地照着假纸条走，走到了你家（恶意代码）。

---

## 4. 汇编基础

### 4.1 两种语法别搞混

|          | Intel 语法（IDA/pwndbg 默认）                     | AT&T 语法（gcc objdump 默认）              |
| -------- | ------------------------------------------------- | ------------------------------------------ |
| 数据搬运 | `mov rax, rbx`（**左是目的地**，把 rbx 搬给 rax） | `movq %rbx, %rax`（**右是目的地**）        |
| 特征     | 干净                                              | 寄存器带 `%`，立即数带 `$`，指令带尺寸后缀 |

看 wp 时留意别人用的哪种语法，方向反了会完全读反。

### 4.2 常用指令大白话表

| 指令                            | 大白话                                                       |
| ------------------------------- | ------------------------------------------------------------ |
| `mov rax, 5`                    | 把数字 5 塞进 rax 口袋                                       |
| `mov rax, [rbx]`                | 去 rbx 指的地址**取货**放进 rax（rbx 是门牌号，取的是屋里的人） |
| `mov [rbx], rax`                | 把 rax **放进** rbx 指的屋子里                               |
| `lea rax, [rbx+8]`              | 只算**门牌号**：rax = rbx+8，**不去取货**。就像抄下邻居地址但不去敲门 |
| `push x` / `pop x`              | 盘子叠一个 / 拿一个                                          |
| `add` / `sub` / `imul`          | 加减乘                                                       |
| `cmp a, b`                      | 比一比（只做减法看标志位，不动手改值）                       |
| `jz/je` `jnz/jne` `jg` `jl` ... | 比较后按结果跳：相等跳 / 不等跳 / 大于跳 / 小于跳            |
| `jmp addr`                      | 无条件跳（跳槽）                                             |
| `call addr`                     | 打电话：先压返回地址，再跳过去                               |
| `ret`                           | 挂电话：弹返回地址，跳回来                                   |
| `leave`                         | 收拾这层栈帧（见上文）                                       |
| `syscall`                       | 64 位系统调用：求内核办事                                    |
| `int 0x80`                      | 32 位系统调用（老式）                                        |
| `xchg a, b`                     | 两口袋内容互换（栈迁移 gadget 常客）                         |

**`mov` 取值 vs `lea` 取地址**是最容易混的点：

```asm
mov rax, [rbx]   ; rax = rbx 地址上的那个"值"        —— 取屋里的人
lea rax, [rbx]   ; rax = rbx 本身（等于 mov rax, rbx）—— 抄门牌号
lea rax, [rbx+8] ; rax = rbx+8 这个"地址"            —— 抄邻居门牌号
```

### 4.3 ROP gadget 是什么（先混个脸熟）

**gadget** = 一小段以 `ret` 结尾的指令序列，例如：

```asm
pop rdi
ret
```

它的作用：执行到它时，先从栈上弹一个值进 `rdi`（设置第一个参数！），然后 `ret` 又跳到栈上下一个地址。**把一串 gadget 的地址依次叠在栈上，`ret` 就会像吃糖葫芦一样一个个执行下去**——这就是 ROP（Return Oriented Programming，返回导向编程）。

为什么不直接写代码执行？因为 NX 让数据区不可执行了，但**代码段里现成的指令我们是能"借"来用的**——借枪打鸟。

---

## 5. 函数调用约定

**调用约定**回答的问题是：调用函数时，参数放哪？返回值放哪？谁来收拾栈？

### 5.1 32 位 Linux（cdecl）

- 参数**从右到左压栈**：`func(1, 2)` → 先 push 2，再 push 1
- 返回值放 `eax`
- 调用方负责清栈

所以 32 位传参不靠寄存器，ROP 时要用"连续 pop 三次"之类的 gadget，或者直接把参数叠在栈上布局好。

### 5.2 64 位 Linux（System V AMD64）

- 前 6 个参数依次放：**`rdi` `rsi` `rdx` `rcx` `r8` `r9`**（第 7 个起压栈）
- 返回值放 `rax`（浮点用 `xmm0`）

**必背口诀：第一个参数 rdi，第二个 rsi，第三个 rdx。**

为什么必背？Pwn 里最经典的动作就是：

```
让 rdi = "/bin/sh" 的地址
让 rip = system 的地址
→ 等价于执行 system("/bin/sh") → 拿 shell
```

而控制 `rdi` 靠的就是 `pop rdi; ret` 这个 gadget。

> 记忆法：**rdi** 谐音"入参第一个"；实在记不住就记 "D、S、D"（Di、Si、Dx）。

### 5.3 一个重要细节：栈对齐（16 字节）

64 位程序里，`system` 这类 libc 函数可能使用 SSE 指令（如 `movaps`），它要求栈按 16 字节对齐，否则**直接段错误**。所以 ROP 链里有时要故意多垫一个 `ret` 指令来凑齐对齐——"打远程崩溃但本地正常"的常见元凶之一。

---

## 6. ELF 文件格式

### 6.1 ELF 是什么

**ELF**（Executable and Linkable Format）是 Linux 下的可执行文件格式，相当于 Windows 的 `.exe`（PE 格式）。

拿到题第一步就是 `file` 看一眼：

```bash
$ file pwn1
pwn1: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked,
interpreter /lib64/ld-linux-x86-64.so.2, for GNU/Linux 2.6.32,
BuildID[sha1]=..., not stripped
```

重点看三处：

- **32/64 位**：决定寄存器布局、偏移大小
- **dynamically / statically linked**：动态还是静态链接
- **not stripped / stripped**：符号表还在不在。not stripped 时函数名直接可见，IDA 里舒服得多

### 6.2 两种视角：section（链接视角）与 segment（运行视角）

- **section**：给链接器看的，"文件里东西怎么分类摆放"
- **segment**：给加载器看的，"运行时哪几段映射到内存、什么权限"

做题时主要和 section 打交道，用 `readelf -S` 查看。

### 6.3 必须认识的 section

| section             | 存什么                               | 权限     | Pwn 相关点                                          |
| ------------------- | ------------------------------------ | -------- | --------------------------------------------------- |
| `.text`             | 程序指令（机器码）                   | r-x      | ROP gadget 全在这找                                 |
| `.rodata`           | 常量字符串（如 `"/bin/sh"`、格式串） | r--      | 找现成字符串、比对常量                              |
| `.data`             | 已初始化的全局/静态变量              | rw-      | 可写，有时当"落脚点"                                |
| `.bss`              | 未初始化的全局/静态变量              | rw-      | 可写，且**地址在没开 PIE 时固定**，常用来放伪造数据 |
| `.got`              | 全局偏移表（函数真实地址登记处）     | 视 RELRO | 改它 = 劫持函数（见下节）                           |
| `.plt`              | 跳板代码                             | r-x      | 调用外部函数的中转站                                |
| `.symtab` `.strtab` | 符号表（函数名↔地址对照）            | —        | stripped 后被删掉，逆向难度上升                     |

### 6.4 静态链接 vs 动态链接

|              | 静态链接                                      | 动态链接                               |
| ------------ | --------------------------------------------- | -------------------------------------- |
| 原理         | 把 libc 全部**复制**进可执行文件              | 运行时由 `ld.so` **加载** libc.so 共享 |
| 文件大小     | 巨大（几 MB）                                 | 小巧（几十 KB）                        |
| 有无 GOT/PLT | 无                                            | 有                                     |
| Pwn 感受     | 自带 `system`、syscall 等一切，不用 leak libc | 必须先泄露 libc 基址（通常）           |

**判断方法**：`file` 输出 `statically linked`，或 `checksec` 看有无 RELRO/NX 之类动态特征；静态链接的题 `readelf -S` 里没有 `.got.plt`。

---

## 7. GOT / PLT：程序的通讯录

这是新手最容易懵、但**必须搞懂**的一对概念。

### 7.1 问题背景

动态链接的程序调用 `printf` 时，编译时根本不知道 `printf` 运行时会被加载到哪个地址。怎么办？

### 7.2 解决方案：两级跳 + 懒加载

- **PLT（Procedure Linkage Table，过程链接表）**：代码段里的一小段"跳板代码"。程序里所有 `call printf` 其实都是 `call printf@plt`
- **GOT（Global Offset Table，全局偏移表）**：数据段里的一个地址登记簿，每个外部函数一条

**延迟绑定（Lazy Binding）流程**（像查通讯录）：

```
第一次调用 printf：
  call printf@plt
    → jmp [GOT中printf的条目]     ← 此时登记的是"回头去找总机"的地址
    → 跳到 PLT stub：push 序号，跳到 PLT[0]
    → PLT[0] 跳到动态链接器(ld.so)
    → 链接器真正查找 printf 地址，写进 GOT 条目
    → 跳去执行真正的 printf

之后每次调用 printf：
  call printf@plt
    → jmp [GOT中printf的条目]     ← 现在登记的是真实地址
    → 直接到达 printf，一步到位
```

> **通俗理解**：PLT 是前台总机，GOT 是通讯录。第一次找某部门（函数），总机帮你查号码并**记在通讯录上**；以后再找，直接照通讯录拨号。GOT 一开始填的是"空号提示音"（回 PLT 找解析器），查完才填真号。

### 7.3 为什么 Pwn 一定要懂 GOT

1. **泄露 libc**：GOT 里登记着函数的**真实运行时地址**。用格式化字符串等漏洞读出 `puts@got` 的值 → 减去 `puts` 在 libc 里的偏移 → **libc 基址** → 任意 libc 函数地址随便算
2. **劫持执行流**：如果 RELRO 没开全（GOT 可写），把 `got[exit]` 改成 `system` 的地址，程序调用 `exit("...")` 时实际执行 `system("...")`（经典 ret2dlresolve/GOT overwrite 思路）
3. **题目招数**：`ret2plt`——不开 PIE、不泄露 libc 时，直接 `call puts@plt` 打印 got 内容

---

## 8. Linux 系统调用

### 8.1 用户态与内核态

程序跑在**用户态**，权限有限，不能直接碰硬件、读别的进程内存。要干"特权活"（读文件、开网络、创建进程），必须**拜托内核代办**——这就是**系统调用（syscall）**。

> 通俗理解：银行里你（用户态）不能自己进金库，必须到柜台（syscall 接口）填单子，柜员（内核态）帮你办。

### 8.2 调用 syscall 的姿势

系统调用 = "填单子"：**单号（syscall number）放 rax，参数放 rdi/rsi/rdx...，然后执行 `syscall` 指令**。

|            | 32 位                 | 64 位                   |
| ---------- | --------------------- | ----------------------- |
| 触发指令   | `int 0x80`            | `syscall`               |
| 单号寄存器 | `eax`                 | `rax`                   |
| 参数寄存器 | `ebx ecx edx esi edi` | `rdi rsi rdx r10 r8 r9` |

### 8.3 拿 shell 的 syscall：execve

**最常用的 syscall 就是 execve**（执行一个新程序），拿 shell 的本质：

```c
execve("/bin/sh", NULL, NULL);
```

64 位对应的汇编：

```asm
mov rax, 59      ; execve 的系统调用号是 59
mov rdi, binsh   ; "/bin/sh" 字符串的地址
mov rsi, 0       ; argv = NULL
mov rdx, 0       ; envp = NULL
syscall
```

（32 位：`eax=11`，`ebx` 指向 `/bin/sh`，`int 0x80`）

### 8.4 拿不了 shell 就 ORW

有些题开了 **seccomp 沙箱**，禁掉了 execve 这类 syscall，只让你读写文件。这时用 **ORW**：

```c
open("/flag", 0);      // 打开 flag 文件
read(fd, buf, 100);    // 读进内存
write(1, buf, 100);    // 打印到屏幕
```

俗称 **orw 三件套**（open、read、write）。

### 8.5 文件描述符（fd）

- `0` = 标准输入（stdin）
- `1` = 标准输出（stdout）
- `2` = 标准错误（stderr）

远程打靶时：你 `sendline` 的数据进入程序的 stdin（fd 0）；程序 `puts` 的内容从 stdout（fd 1）传回来被你 `recv`。**有些题的 flag 要靠 `dup2` 把 fd 重定向**（比如把 socket fd 复制成 0 和 1，shell 才有输入输出）。

---

## 9. C 语言与内存安全

### 9.1 栈内存 vs 堆内存

|          | 栈                       | 堆                                     |
| -------- | ------------------------ | -------------------------------------- |
| 谁管理   | 编译器自动分配/回收      | 程序员手动（`malloc`/`free`）          |
| 放什么   | 局部变量、参数、返回地址 | 动态分配的数据（链表节点、变长缓冲区） |
| 大小     | 小（默认几 MB）          | 大                                     |
| 生命周期 | 函数返回即销毁           | free 才销毁（忘了 free = 内存泄漏）    |
| 出事类型 | 栈溢出、返回地址被覆盖   | 堆溢出、UAF、double free               |
| Pwn 难度 | 入门                     | 进阶（堆题水深）                       |

```c
void func() {
    int a = 1;                    // 栈上，函数结束自动没
    char *p = malloc(0x20);       // 堆上，你不 free 它就一直活着
    free(p);                      // 释放
}
```

### 9.2 危险函数黑名单（见到就要兴奋）

这些函数的共同问题：**不检查/信任长度输入，照单全收往缓冲区里塞**。

| 危险函数                 | 问题                                      | 病因示例                           |
| ------------------------ | ----------------------------------------- | ---------------------------------- |
| `gets(buf)`              | 完全无长度限制，**最经典**                | 输入多长写多长，必溢出             |
| `scanf("%s", buf)`       | `%s` 不限长（`%16s` 才限）                | 同上                               |
| `strcpy(dst, src)`       | 拷到 `\0` 为止，不管 dst 多大             | src 比 dst 长就爆                  |
| `strcat(dst, src)`       | 追加同理                                  | 同上                               |
| `sprintf(buf, fmt, ...)` | 结果长度不可控                            | 同上                               |
| `read(0, buf, n)`        | n 比 buf 大就溢出（**要看调用是否传对**） | `char buf[8]; read(0, buf, 0x100)` |

安全替代：`fgets`、`strncpy`（也有不补 `\0` 的坑）、`snprintf`。

### 9.3 常见的"病根"清单

- **数组越界**：`buf[16]` 却写了 `buf[16]`（第 17 个字节，越界 1 字节 = off-by-one）
- **off-by-one / off-by-null**：多写 1 字节（常见是 `\0`），堆题经典（House of Einstein 一类的入口）
- **指针悬垂 / UAF**：free 后指针没置空，还能继续用（Use After Free）
- **double free**：同一块内存 free 两次，破坏堆链表
- **整数溢出**：`int size = 0x7fffffff + 1` 变负数；`size_t` 减成负数回绕成超大正数，长度检查被绕过
- **无符号比较陷阱**：`if (len - 5 < 10)`，当 len=2 时 `len-5` 回绕成天文数字，检查形同虚设

---

## 10. 保护机制（checksec 六件套）

`checksec` 是拿到题后第一个跑的命令，输出类似：

```
[*] '/pwn1'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      No PIE
```

逐个通俗讲解：

### 10.1 NX（No-eXecute）—— 数据区不许"表演"

- **原理**：把栈、堆、`.data` 等数据区标记为**不可执行**（只许读写）。CPU 跳到这些区域执行时直接报错
- **通俗理解**：数据区是**草稿纸**——你可以随便写字（写 shellcode），但不许"照着草稿纸做操"。只有正式课本（.text）能执行
- **对打法的影响**：ret2shellcode 失效 → 逼出了 **ROP**（借用代码段里现成指令）
- 同一机制在 Windows 上叫 **DEP**

### 10.2 Canary（栈保护/Stack Protector）—— 门口的暗号纸条

- **原理**：函数入口时，在**局部变量和返回地址之间**插一个随机 8 字节"暗号"（canary），从 `fs:0x28` 取；函数返回前检查暗号有没有被动过，动了就 `__stack_chk_fail` 报错退出
- **通俗理解**：出门进门都要对暗号。溢出要想盖到返回地址，**必然路过暗号纸条**，把它盖乱了就会被发现
- **栈帧变化**：

```
┌──────────────┐
│  局部变量     │
├──────────────┤
│  canary (8B) │ ← 追加的暗号层
├──────────────┤
│  saved rbp   │
├──────────────┤
│  返回地址      │
└──────────────┘
```

- **绕过思路**：
  1. **泄露**：用格式化字符串/逐字节比较侧信道读出 canary 值，payload 里原样带上
  2. **逐字节爆破**：canary 末字节恒为 `\x00`，在线服务 fork 子进程时**canary 不变**，可一位一位猜（错一位只是崩这个连接，重来即可）
  3. 走**不经过检查的路径**（如 `__stack_chk_fail` 本身的劫持、格式化字符串直接写）

### 10.3 PIE（Position Independent Executable）—— 程序本体也随机

- **原理**：程序自身的代码段加载地址随机化。不开时程序固定从 `0x400000`（64位）/ `0x8048000`（32位）开始
- **与 ASLR 的区别**：ASLR 是**操作系统级**的（栈、堆、libc 的地址每次运行随机）；PIE 是**这个文件自己**是否参与随机。可以理解为 ASLR 管"别人"，PIE 管"自己"
- **对打法的影响**：开了 PIE 就必须先泄露程序内某个地址（比如打印一个指针），低 12 位不变（页对齐）可用来**指纹识别 libc 版本**（部分情形）
- **绕过**：泄露程序基址后，程序内一切地址 = 基址 + 偏移（IDA 里看到的偏移）

### 10.4 RELRO（Relocation Read-Only）—— 锁死通讯录

- **Partial RELRO**：`.got`（部分）仍可写 → **GOT 劫持**（改 got 表换函数）可行
- **Full RELRO**：解析全部提前完成，整个 GOT 变**只读** → GOT 覆盖失效，得换思路（如打 `__stack_chk_fail`、`exit` 相关结构、TLS 等）
- **No RELRO**：连 `.dtors`、lazy binding 结构都可打（最老环境）

### 10.5 Fortify

编译时把 `strcpy` 这类替换成 `__strcpy_chk` 等带边界检查版本，检测到"确定的溢出"直接 `abort`。会让部分溢出直接被拦下。

### 10.6 ASLR（系统级，checksec 不显示）

操作系统对**栈、堆、mmap 区（libc 等）**每次加载地址随机化。注意：

- **fork 出的子进程继承父进程地址空间**——所以"一次连接一个子进程"的服务里，地址在多次连接间**不变**，可分多次交互泄露/爆破（Partial overwrite 的理论根基）
- 可 `cat /proc/sys/kernel/randomize_va_space` 看，`echo 0 > ...` 临时关闭（本地调试用，2 是完全开启）

### 10.7 保护组合 → 打法速查

| 保护情况       | 可用打法                                                     |
| -------------- | ------------------------------------------------------------ |
| 全关           | ret2shellcode（栈上写码跳过执行）                            |
| 只开 NX        | ret2text（程序自带后门）/ ret2libc / ROP                     |
| 开 NX + Canary | 先泄露 canary，再 ROP                                        |
| 全开           | 泄露链：leak libc/程序基址 →ROP / 打 FILE 结构 / heap 题思路 |

---

## 11. 常见漏洞类型

### 11.1 栈溢出（Stack Overflow）—— 入门第一课

**成因**：向栈上缓冲区写入超过其容量的数据，覆盖相邻内存。

**经典样例**：

```c
char buf[16];
gets(buf);          // 想写多长写多长
```

**利用三步曲**：

1. `cyclic` 或手工计算**偏移**：输入多少字节后能盖到返回地址
2. 构造 payload：`填充 + [新返回地址]`（+ 后续 ROP 链）
3. 函数 `ret` 时跳向你指定的地址

```
payload = b'A' * offset + p64(pop_rdi_ret) + p64(binsh_addr) + p64(system_addr)
           ↑填够偏移            ↑gadget弹出参数      ↑"/bin/sh"地址     ↑跳到system
```

### 11.2 格式化字符串（Format String）—— 读心术 + 失控笔

**成因**：把用户输入**直接当格式串**：

```c
printf(buf);        // 错误！用户输入里若含 %p %x %n...
printf("%s", buf);  // 正确
```

**威力一：任意读。** 格式符会"顺栈而上"取参数：

- `%p` / `%x`：泄露栈上第 N 个值 → `%7$p` 表示第 7 个参数位置
- `%s`：把栈上的值**当地址取字符串打印** → 放个好地址就能读任意内存（泄露 libc/栈地址神器）

**威力二：任意写。** `%n`：把"**已输出的字符个数**"写进指针指向的地址：

- `%(数字)c%8$hn`：先输出 `数字` 个字符（用 `%c` 填字数），再 `%hn` 写入 2 字节到第 8 个参数位置
- 分两次 `%hn`（各写 2 字节）即可改写一个完整地址

> 通俗理解：`printf` 本来只是个复读机，你却把**麦克风递给了观众**——观众喊什么格式符，复读机就照做什么，还能用 `%n` 这支"失控的笔"往内存里写字。

### 11.3 堆漏洞家族（进阶方向，先认脸）

- **堆溢出（Heap Overflow）**：malloc 的块写超了，盖住**下一个 chunk 的头部**（size 字段等），为后续攻击铺路
- **UAF（Use After Free）**：free 后指针没置空，旧指针仍可读写那块内存。若那块内存已被重新分配给别人（比如放了个函数指针结构），读写它就等于**篡改别人的内脏**
- **Double Free**：同一块 free 两次。glibc 有检查（"double free or corruption"），但 fastbin/tcache 只查相邻，绕过方式：free(a) free(b) free(a)
- **Off-by-null**：多写一个 `\0`，恰好把下一 chunk 的 size 低字节清零（清掉 PREV_INUSE 位），让 free 时向前"错误合并"，制造堆块重叠

**所有堆攻击的统一内核**：**欺骗 malloc，让它以为一个被伪造/篡改的 chunk 是合法的**，从而把"你控制的地址"当成新块返回给你 → 任意地址读写。

### 11.4 整数溢出与截断

```c
unsigned int len = read_len;      // 用户给 0x100000000 → 截断成 0
if (len < 0x100) copy(buf, input, len);   // 检查通过了……
```

或 `size_t` 回绕：`malloc(size - 8)`，当 `size < 8` 时变成超大数/小数错配，导致检查与实际分配不一致。做题时**留意所有长度运算**。

---

## 12. 基础利用思路

### 12.1 ret2text —— 家里有后门

程序里自带 `system("/bin/sh")` 或等价物（IDA 里搜 `system`、搜字符串 `/bin/sh`）。

**条件**：无 PIE（或有基址泄露）。**操作**：溢出后直接返回到后门地址。最简单的一类题。

### 12.2 ret2shellcode —— 自己写剧本

**条件**：NX 关闭 + 栈/堆可执行（或程序自己 mmap 了 rwx 内存）。
**操作**：把 shellcode（机器码字节）写进缓冲区，返回地址填缓冲区地址。

```python
shellcode = asm(shellcraft.amd64.linux.sh())   # pwntools 自动生成
payload = shellcode.ljust(offset, b'\x90') + p64(buf_addr)  # 前面垫 NOP 滑梯
```

`\x90`（NOP）是"空转指令"，垫一片 NOP 滑梯（NOP sled），地址稍微偏一点也不影响滑进 shellcode。

### 12.3 ret2libc —— 借别人的枪

**场景**：NX 开、程序里没后门，但动态链接了 libc。

**核心公式**：

```
函数真实地址 = libc 基址 + 该函数在 libc 中的偏移
```

**流程**：

1. 泄露某个 libc 函数的真实地址（比如用 `puts(puts@got)` 打印 GOT 内容）
2. `libc_base = 泄露值 - puts 在 libc 里的偏移`
3. `system = base + system_offset`、`binsh = base + binsh_offset`
4. 再触发一次溢出，ROP：`pop rdi; ret` → `binsh` → `system`
5. （若两次输入在同一次连接里完成，称为"一次交互两阶段"）

**找偏移**：题目给了 libc 就直接查；没给就按泄露地址**低 12 位**（页内偏移不变）去 libc-database 指纹匹配版本。

### 12.4 ROP —— 糖葫芦串

把一串 **gadget 地址**依次叠在栈上，靠连续的 `ret` 自动"吃"完：

```
栈：  [pop rdi; ret] [binsh] [pop rsi; ret] [0] [system]
      └──ret跳到这──┘弹出一个参数 └─再ret─┘ ...
```

适用一切"要按顺序设置多个寄存器/调用多个函数"的场景（包括 ORW：设置三个 syscall）。

### 12.5 栈迁移（Stack Pivot）—— 换个大舞台

**场景**：溢出长度极短（如只能覆盖到返回地址 + 一点点），放不下 ROP 链。
**操作**：把栈"搬"到我们能控制的大块数据区（.bss、堆）：

- 经典 gadget：`leave; ret`（配合提前控制 rbp）或 `xchg rsp, rax` 一类
- 伪造新的 rbp/rsp 指向大缓冲区，链在大缓冲区里随便铺

### 12.6 one_gadget —— 一键出货

libc 里存在一些"现成的好地址"：跳过去直接执行 `execve("/bin/sh", ...)`。

```bash
$ one_gadget libc.so.6
0x4526a execve("/bin/sh", rsp+0x30, environ)
constraints: [rsp+0x30] == NULL ...
```

**注意**：每个 one_gadget 带**约束条件**（某些寄存器/内存得恰好为 0），不满足就崩。实战常多试几个 gadget，或用 ROP 先布置好环境再跳。

### 12.7 SROP —— 伪造"系统现场"

**Sigreturn ROP**：利用内核**恢复信号现场**时会从栈上一次性恢复**全部寄存器**（ucontext 结构）的特性——伪造一个 sigreturn frame，设置好所有寄存器后触发 `rt_sigreturn`（syscall 号 15），一步到位设置 rax/rdi/rsi/rdx 并执行任意 syscall。pwntools 有现成 `SigreturnFrame()`。

---

## 13. glibc 堆管理入门

（堆题前置，先建立地图，细节可后补）

### 13.1 chunk 结构

malloc 的每一块内存前面有个**头部**：

```
┌───────────────┐
│ prev_size (8B)│ ← 上一块空闲时才有效（存上一块大小）
├───────────────┤
│ size (8B)     │ ← 本块大小 | 低3位标志：
│               │    P(bit0)=上一块是否在使用
│               │    M(bit1)=是否 mmap 分配
│               │    A(bit2)=是否非主arena
├───────────────┤
│ 用户数据 (fd...)│ ← malloc 返回的指针指这里
│               │   空闲时开头是 fd/bk 指针（链表前后向）
└───────────────┘
```

- 实际分配大小对齐 16 字节，最小 0x20
- "size 低三位是标志位"——所以常见 `size & ~0x7` 才是真大小

### 13.2 bins：空闲块的回收站分类

free 掉的 chunk 按大小进不同的"筐"：

| bin              | 存什么                      | 特点                                                         |
| ---------------- | --------------------------- | ------------------------------------------------------------ |
| **tcache**       | 每线程缓存，尺寸 0x20~0x410 | glibc ≥2.26 新增，**每个尺寸默认 7 块**，单链表，检查最松 → 现代 Pwn 主战场 |
| **fastbin**      | 小块（≤0x80 默认）          | 单链表，只查 double free 相邻                                |
| **unsorted bin** | free 后的"中转站"           | **双链表**，其中 fd/bk 在空时指向 `main_arena+88` —— **泄露 libc 地址的经典点**（打 unsorted bin 泄漏） |
| small/large bin  | 中型/大型块                 | 按范围分桶，结构复杂                                         |

### 13.3 经典堆攻击名词（先记名字，别慌）

- **tcache poisoning**：篡改 tcache 链表 fd → malloc 返回任意地址（最常用的"任意地址分配"）
- **fastbin attack / double free**：利用 fastbin 检查漏洞实现同块两次分配
- **Unlink**：伪造双链表节点，free 合并时实现"写目标指针"
- **House of 系列**（House of Force / Orange / Einherjar...）：针对特定 glibc 版本的历史技巧合集
- **堆风水（Heap Fengshui）**：通过精心安排 malloc/free 顺序，把堆"布置"成想要的形状

---

## 14. 工具链全家桶

### 14.1 体检：file / checksec

```bash
file pwn1            # 架构/链接方式/是否 stripped
checksec pwn1        # 保护机制一览（pwn 自带）
```

### 14.2 逆向：IDA / Ghidra

- **IDA Pro**（Pwn 手标配，F5 看伪 C 代码）
- 免费替代：**Ghidra**（NSA 开源）、IDA Free
- 快捷技巧：搜字符串（Shift+F12）、搜函数名、看交叉引用（X 键谁调用了它）

### 14.3 调试：gdb + 插件（三选一）

推荐 **pwndbg**（界面清晰，命令贴心），备选 gef、peda。装好后 `gdb ./pwn1` 进来：

| 命令                           | 作用                                                       |
| ------------------------------ | ---------------------------------------------------------- |
| `r` / `c`                      | 运行 / 继续跑                                              |
| `b main` / `b *0x401234`       | 在函数/地址下断点                                          |
| `ni` / `si`                    | 单步（不进函数 / 进函数）                                  |
| `stack 30`                     | 看栈 30 行（pwndbg）                                       |
| `x/20gx $rsp`                  | 从栈顶起看 20 个 8 字节（十六进制）                        |
| `x/s 0x402010`                 | 把地址当字符串看                                           |
| `vmmap`                        | 看内存映射（**找 libc 基址全靠它**）                       |
| `p system` / `p &main`         | 打印符号地址                                               |
| `cyclic 200`                   | 生成规律测试串；崩溃后 `cyclic -l 0x61616168` 直接算出偏移 |
| `set follow-fork-mode child`   | 调 fork 型服务的子进程                                     |
| `rop` / `ropper`（命令行工具） | 找 gadget                                                  |

**cyclic 原理**：生成 de Bruijn 序列（如 `aaaabaaacaaad...`），任何 4/8 字节窗口唯一。程序崩溃时看 `$rsp`/`$rdi` 里残留的四个字符，反查唯一位置 = 偏移。**测溢出偏移第一神器**。

### 14.4 写 exp：pwntools（Python）

安装：`pip install pwntools`。通用模板：

```python
from pwn import *

context(arch='amd64', os='linux', log_level='debug')
# context(arch='i386', os='linux')          # 32位题改这行

elf  = ELF('./pwn1')                 # 读程序：符号、plt、got 都能直接拿
libc = ELF('./libc.so.6')            # 题目给的 libc

# ---- 连接（本地调试/远程打靶二选一）----
io = process('./pwn1')               # 本地
# io = remote('1.2.3.4', 9999)       # 远程

# ---- 常用收发 ----
io.sendlineafter(b'Name:', b'Peter') # 收到提示语后再发一行
io.sendline(payload)
io.recvline() / io.recvuntil(b'...') / io.recvall()
io.interactive()                     # 收尾：转人工模式（拿shell后手敲命令）

# ---- 常用打包 ----
p64(addr) / p32(addr)      # 地址→字节（64/32位，小端）
u64(b'\x00'*4 + leaked)    # 字节→数（不足8字节要补齐）
cyclic(0x28)               # 测偏移
asm(shellcraft.amd64.linux.sh())   # 生成shellcode
elf.symbols['main']        # 直接拿符号地址
elf.plt['puts'], elf.got['puts']   # plt/got 地址
libc.symbols['system']     # libc 内偏移
next(libc.search(b'/bin/sh'))      # libc 里 /bin/sh 的偏移
```

### 14.5 其他常用工具

| 工具                                  | 用途                                                         |
| ------------------------------------- | ------------------------------------------------------------ |
| **ROPgadget** / ropper                | 找 gadget：`ROPgadget --binary pwn1 --only "pop\|ret"`       |
| **one_gadget**                        | 找 libc 一键 shell 片段（注意约束）                          |
| **LibcSearcher** / libc.blukat.me     | 按泄露地址低 12 位查 libc 版本                               |
| **patchelf**                          | 本地换题目指定 libc 跑：`patchelf --set-interpreter ./ld.so --replace-needed libc.so.6 ./libc.so.6 pwn1` |
| **seccomp-tools**                     | `dump ./pwn1` 查沙箱禁了哪些 syscall                         |
| **strace / ltrace**                   | 跟踪系统调用/库函数调用，观察程序行为                        |
| **objdump -d**                        | 命令行反汇编（不想开 IDA 时快速看）                          |
| **readelf -S/-h/-l**                  | 看 section/header/segment                                    |
| **vmmap（gdb内）** / `/proc/pid/maps` | 看运行时内存布局                                             |

---

## 15. 完整解题流程（把知识串起来）

以一道标准栈题为例：

```
1. 体检
   file pwn1; checksec pwn1
   → 64位、动态链接、NX开、Canary无、PIE无

2. 逆向
   IDA 打开，F5 看伪代码
   → main 里 gets(buf)，buf 距返回地址多少未知
   → 程序无后门函数，但有 puts

3. 测偏移
   gdb 里 r，输入 cyclic(200)，崩溃后 cyclic -l 查 $rsp
   → offset = 0x28

4. 定思路（按保护选打法）
   NX 开 → 不能 shellcode；无后门 → ret2libc
   需要 leak：先 puts(puts@got) 泄露 → 算 libc base → 二次溢出打 system

5. 写 exp（pwntools 模板 + 两阶段 payload）

6. 本地调通（process 模式，gdb attach 看现场）

7. 切 remote 打靶 → io.interactive() → cat flag
```

**遇坑检查清单**：

- 打远程崩、本地好：多半是 **libc 版本不一致**（用 patchelf 换题目 libc）或**栈没 16 字节对齐**（加一个 `ret` 垫）
- `system` 返回了但没 shell：`/bin/sh` 参数没对齐、或者 seccomp 禁了 execve（seccomp-tools dump 查）
- 泄露的地址差一点：泄露时 `recvuntil` 截取是否带了换行、`u64` 前是否补齐 8 字节

---

## 16. 进阶攻击手法补全

> 第 12 章讲的是"标准姿势"，这里补上比赛里同样高频的几个过渡手法。它们解决的其实是同一类困境：**标准姿势的条件总差一个**——没 libc、没 gadget、没输出函数、不让 execve。

### 16.1 ret2syscall（32 位经典三板斧）

**场景**：32 位题、NX 开、程序里找不到 `system`，但能凑出一堆 `pop` 指令。

**原理**：不借任何库函数，纯用 ROP 把 execve 需要的寄存器摆好，最后接 `int 0x80`：

```
pop eax; ret  →  11         （execve 的 32 位系统调用号）
pop ebx; ret  →  binsh      （第一个参数："/bin/sh" 的地址）
pop ecx; ret  →  0          （argv）
pop edx; ret  →  0          （envp）
int 0x80
```

```python
chain = (p32(pop_eax) + p32(11) +
         p32(pop_ebx) + p32(binsh) +
         p32(pop_ecx) + p32(0) +
         p32(pop_edx) + p32(0) +
         p32(int80))
payload = b'A' * offset + chain
```

gadget 用 `ROPgadget --binary pwn | grep "pop eax"` 逐个捞，32 位程序（尤其静态）几乎全能凑齐。

### 16.2 ret2csu（64 位老程序的万能传参器）

**场景**：64 位老程序（glibc ≤ 2.33），只有 `pop rdi`，找不到 `pop rsi` / `pop rdx`——第二、三个参数没 gadget 可用。

**原理**：老 glibc 的 `__libc_csu_init` 末尾自带两段"批发式"gadget：

```asm
; gadget 1：一口气弹 6 个寄存器
pop rbx; pop rbp; pop r12; pop r13; pop r14; pop r15; ret

; gadget 2：把 r13/r14/r15 倒进 rdx/rsi/edi，再间接调用
mov rdx, r13; mov rsi, r14; mov edi, r15d; call [r12 + rbx*8]
```

**用法**：先 gadget1 设参数，再 gadget2 调用。关键设置：

- `rbx=0, rbp=1`（让 call 后的循环判断直接退出，只调一次）
- `r12 = 存放函数地址的地址`（注意是**地址的地址**，call 是间接调用）
- `r13 = 第三个参数(rdx)`，`r14 = 第二个参数(rsi)`，`r15 = 第一个参数`（只有低 32 位 edi！）

注意：glibc 2.34 起 `__libc_csu_init` 被移除，新编译的程序没这福利——遇到老题、老附件才用。

### 16.3 Partial Overwrite（部分覆盖：只改地址尾巴）

**场景**：PIE 开着、没法泄露；或栈溢出能写的长度不够塞一个完整地址（8 字节只够盖到 1~2 字节）。

**原理**：PIE 随机化以**页（0x1000）为单位**——地址**末 3 个十六进制位（低 12 比特）永远不变**。所以只覆盖最低 1~2 字节，高位"原样保留"，就能把返回地址微调到附近目标：

- 只覆盖最低 1 字节：不确定的只有 4 个比特 → **1/16 概率**命中
- fork 型服务崩了重连**地址不变** → 错了就重试，16 次内必中
- 溢出只剩 2 字节空间时，这是唯一活路

```python
payload = b'A' * offset + b'\x48'   # 只盖 1 字节，把返回地址微调到 0x...48 处的 gadget
```

### 16.4 mprotect + shellcode（自己划一块可执行区）

**场景**：静态编译（没有 libc 可借）却想跑 shellcode；或 NX 开但有合适 gadget。

**原理**：`mprotect(addr, len, prot)` 把一段内存改成 7（rwx），随后把 shellcode 写进这段并跳过去：

```
rdi = 页对齐地址（0x1000 的倍数，常选 .bss 附近一整页）
rsi = 长度（页的倍数，如 0x1000）
rdx = 7  （r=1 | w=2 | x=4）
```

静态程序里 `syscall`、`pop rdi/rsi/rdx` 通常都能凑齐，配 12.2 的 shellcode 一起用。

### 16.5 seccomp 沙箱与 ORW 实战

**识别**：`seccomp-tools dump ./pwn` 一跑，沙箱规则全出来（典型：留 read/write，禁 execve）。

**应对**：拿不了 shell 就直接读文件，三条 syscall 的 ROP 链：

```
open("/flag", 0)       → 返回 fd（一般是 3）
read(3, buf, 0x100)    → 读进内存
write(1, buf, 0x100)   → 打印出来
```

细节坑：

- 新 glibc 的 open 底层可能走 **openat**——禁了 open 就换 openat 打
- fd 不一定是 3：程序自己开过文件就会偏，多试几个
- 三条 syscall 意味着 rdi/rsi/rdx 要"设一遍→syscall→再设"，链比较长，画好表再拼

### 16.6 格式化字符串模板化（fmtstr_payload）

手工数 `%c` 填充和 `%n` 偏移非常痛苦，pwntools 一行搞定：

```python
# offset = 格式串参数在栈上的第几个（用 %7$p 逐个试出来）
payload = fmtstr_payload(7, {target_addr: 0xdeadbeef}, write_size='short')
```

- 字典里可以一次写多个 `{地址: 值}`
- `write_size='short'`（%hn 每次写 2 字节）比默认整字稳
- 底层原理仍是 11.2 节那套：**填够字符数 + %n 写入**

---

## 17. libc 版本差异与 hook 时代

> 同一个漏洞，libc 版本不同打法天差地别。做题第一步先确认版本（`strings libc.so | grep "GNU C Library"` 或 libc-database 查），再对照这张表。

### 17.1 关键版本差异表

| glibc 版本                     | 关键变化                                                     | 对做题的影响                                                |
| ------------------------------ | ------------------------------------------------------------ | ----------------------------------------------------------- |
| ≤2.25（Ubuntu16.04 常见 2.23） | 无 tcache                                                    | fastbin/unsorted 主战场，house of 系列经典技法              |
| 2.24                           | IO vtable 加校验                                             | 老版 FSOP（house of orange 原版）失效 → 转 wide vtable 路线 |
| 2.26                           | **引入 tcache**                                              | 小块优先进 tcache，检查最松                                 |
| 2.29                           | tcache 加 **key 字段**（double free 检测）                   | 老式 tcache dup 失效，需先绕 key                            |
| 2.32                           | **safe-linking**：tcache/fastbin 的 fd 与 `位置>>12` 异或存储 | poisoning 需先泄露堆地址才能"加密"目标                      |
| 2.34                           | **删除 __malloc_hook / __free_hook**；__libc_csu_init 消失   | hook 打法、ret2csu 双双退场 → 转攻 IO/exit/TLS              |

### 17.2 __malloc_hook / __free_hook（2.34 以前的送分点）

**是什么**：glibc 预留的两个函数指针，`malloc()` / `free()` 执行时会先检查并调用它们（正常为 NULL，不调用）。

**打法**（任意写 + libc 基址到手后两步搞定）：

```
__free_hook = one_gadget（或 system）
→ 程序任意一次 free(ptr) 触发 → 跳过去拿 shell
```

用 `system` 的经典组合：`__free_hook = system`，然后 free 一个**内容是 "/bin/sh" 的块** → 等价 `system("/bin/sh")`。`__malloc_hook` 同理，靠下一次 malloc 触发。

### 17.3 hook 没了之后打什么（2.34+）

| 替代目标                               | 原理一句话                                                   |
| -------------------------------------- | ------------------------------------------------------------ |
| `_IO_2_1_stdout_` 等 FILE 结构（FSOP） | 伪造/篡改 FILE，exit → _IO_cleanup → fflush 时触发；也能只改 flags/write_ptr 让它把内存"吐"出来当泄露 |
| `__exit_funcs` / TLS `dtor_list`       | exit() 必调的清理函数指针（带指针加密，需按规则解密/伪造）   |
| `setcontext + 61`                      | 一个 gadget 恢复全套寄存器（堆题版 SROP）                    |
| `__environ`                            | libc 里指向栈上环境变量区的指针——**泄露栈地址的官方后门**    |

### 17.4 泄露三件套速记

- **泄露 libc**：读 GOT 表（如 puts@got 里的真实地址）；堆题读 unsorted bin 块的 fd（= `main_arena+88`，减偏移得基址）
- **泄露堆**：tcache/unsorted 里残留的指针；输出型函数打印 chunk 内容
- **泄露栈**：`__environ` / `environ` 符号（拿到栈地址才能打栈上的返回地址）

---

## 18. 堆题菜单套路实战

### 18.1 菜单题长什么样 & 审计四个点

```
1. Add note    2. Delete note    3. Edit note    4. Show note    5. Exit
```

拿到伪代码别急着抠细节，先过这张清单（四问四答）：

| 审计点         | 看什么                              | 对应漏洞                    |
| -------------- | ----------------------------------- | --------------------------- |
| **index 检查** | 下标有没有上限/负数检查             | 数组越界 → 任意地址当 chunk |
| **size 检查**  | add/edit 长度能否超申请值、能否为 0 | 堆溢出、off-by-one          |
| **指针置空**   | delete 后指针有没有清 NULL          | UAF / double free           |
| **edit 权限**  | 能否对已 free 的块继续写            | UAF 写 → 直接 poisoning     |

### 18.2 tcache poisoning 标准流程（2.26 ~ 2.31）

**目标**：让 malloc 返回**任意地址**（栈上的返回地址、`__free_hook`、bss 上的函数指针……）。

```
1. add(0x20)  → chunk A
2. free(A)              → tcache 链: A
3. UAF 改 A 的 next = target   → tcache 链: A → target
4. add(0x20)            → 拿回 A（链头变 target）
5. add(0x20)            → 拿到 target！这次写入的内容直接落到目标地址
```

两个易错点：

- tcache 的 next 指向 **user data 起点**（与 fastbin 不同，不用 -0x10）
- 2.32+ 的 safe-linking：next 存的是 `(next字段地址 >> 12) ^ target`，必须先泄露堆地址

### 18.3 fastbin dup（≤2.25 或 tcache 填满溢出后）

```
free(a); free(b); free(a);
# fastbin 只查"与链表顶部重复"（fasttop），a-b-a 顺序通过 → 链: a → b → a

malloc → a;  malloc → b;  malloc → a;
# a 被程序拿到两次（两个指针指向同一块）
改 a 的 fd = fake_chunk
# fake_chunk 处必须恰好有一个"像样的 size"字段（如 0x70，过安全检查）
第 4 次 malloc → 返回 fake_chunk
```

fake chunk 常放栈上或 `__malloc_hook - 0x23`（那里天然有一段可当 0x7f size 的字节——经典老题姿势）。

### 18.4 UAF 打函数指针（比堆利用更快的活路）

很多题的 note 结构体自带函数指针：

```c
struct note {
    void (*show)(char *);   // 打印函数
    char *content;
};
```

UAF 改结构体：`show = system`、`content = "/bin/sh"`，点一下 Show → `system("/bin/sh")`。**先看结构体里有什么"会被调用的指针"，比闷头堆利用快得多。**

---

## 19. 自制靶机与附件处理

### 19.1 自己编译练习题（保护开关对照表）

想复现 wp 里的无保护环境，gcc 选项对照：

| 保护     | 默认状态             | 关闭它的选项           |
| -------- | -------------------- | ---------------------- |
| NX       | 开                   | `-z execstack`         |
| Canary   | 开（需 -O 系列优化） | `-fno-stack-protector` |
| PIE      | 开                   | `-no-pie`              |
| RELRO    | Full/Partial         | `-z norelro`（全关）   |
| 动态链接 | 动态                 | `-static`（静态）      |

```bash
# "全关"练习题一条龙（32 位需先装 gcc-multilib）
gcc -m32 -no-pie -fno-stack-protector -z execstack -z norelro -o pwn pwn.c
```

### 19.2 题目给了 libc/ld 怎么办

不 patch 直接跑 = 用你本机 libc（大概率 2.35+），偏移全错——这是"**本地一打就通、远程全崩**"的头号原因：

```bash
# 把程序的加载器和 libc 换成题目给的版本
patchelf --set-interpreter ./ld-2.27.so ./pwn
patchelf --replace-needed libc.so.6 ./libc-2.27.so ./pwn

# 验证：两条都应指向题目给的文件
ldd ./pwn
```

### 19.3 socat 一键起"远程"

把本地程序挂成网络服务，用 `remote('127.0.0.1', 9999)` 模拟真实打靶：

```bash
socat tcp-l:9999,reuseaddr,fork exec:./pwn
```

`fork` 让每个连接一个新进程——正好用来练"fork 子进程地址不变"类爆破（canary 爆破、partial overwrite）。

---

## 20. 32 位与 64 位对照速查

| 项目              | 32 位                   | 64 位                                        |
| ----------------- | ----------------------- | -------------------------------------------- |
| 通用寄存器        | eax ebx ecx edx esi edi | rax rbx rcx rdx rsi rdi + r8~r15             |
| 传参方式          | 全部压栈（右→左）       | 前六个进寄存器：rdi rsi rdx rcx r8 r9        |
| 指针/返回地址大小 | 4 字节（p32）           | 8 字节（p64）                                |
| 系统调用触发      | `int 0x80`，号在 eax    | `syscall`，号在 rax                          |
| execve 调用号     | 11                      | 59                                           |
| 栈对齐讲究        | 基本不用管              | `system` 等要求 16 字节对齐（movaps 段错误） |
| 经典专属手法      | ret2syscall             | ret2csu、栈迁移配 xchg                       |
| 偏移习惯          | 常是 4 的倍数           | 常是 8 的倍数                                |
| tcache 尺寸区间   | 0x10 ~ 0x408            | 0x20 ~ 0x410                                 |

> 经验：看 wp 第一步先确认位数——p32 变 p64、传参从压栈变寄存器，整条链的构造逻辑完全不同。

---

## 21. 新手术语速查表

| 术语           | 一句话解释                                                   |
| -------------- | ------------------------------------------------------------ |
| exp            | exploit，攻击脚本——从发起到拿 flag 的完整自动化过程          |
| poc            | proof of concept，证明漏洞存在的最小演示（不一定拿权限）     |
| shellcode      | 一小段机器码，只干一件事（起 shell / orw），需可执行内存配合 |
| gadget         | 以 ret 结尾的指令碎片，ROP 的积木                            |
| ROP 链         | 一串 gadget 地址按执行顺序叠好，靠 ret 连环触发              |
| offset（偏移） | 输入起点到目标（如返回地址）的距离，cyclic 一测便知          |
| base（基址）   | 模块加载的起始地址；真实地址 = 基址 + 偏移                   |
| leak（泄露）   | 让程序吐出本不该给的地址（libc / 堆 / 栈）                   |
| one_gadget     | libc 里现成的 execve("/bin/sh") 地址，一个地址搞定但带约束   |
| orw            | open-read-write 读文件三连，禁 execve 时的活路               |
| UAF            | Use After Free，free 后指针未清空继续用                      |
| double free    | 同一块内存 free 两次，破坏分配器链表                         |
| 堆风水         | 通过精心安排分配/释放顺序把堆摆成想要的形状                  |
| FSOP / IO_FILE | 伪造 FILE 结构体，借 exit/fflush 之手动起来                  |
| hook           | __malloc_hook 等函数指针，改成 gadget 即劫持调用             |
| seccomp / 沙箱 | 内核级系统调用过滤器，禁这禁那                               |
| 爆破 / oracle  | 把"程序崩不崩"当对错信号，逐位猜出秘密（canary、partial overwrite） |
| 打通           | 拿到 shell / flag 的口语说法                                 |
| wp             | writeup，题解                                                |
| 交互模式       | pwntools 的 `io.interactive()`，脚本交出控制权给你手敲       |

---

## 22. 学习路线与资源

### 22.1 建议顺序（别跳）

```
C语言(指针要熟) → Linux基础(命令行/权限/进程概念)
  → 汇编(读得懂即可,不用会写) → 栈/栈帧/调用约定
    → 【栈溢出: ret2text → ret2shellcode → ret2libc → ROP】
      → 格式化字符串(读+写)
        → 堆入门(chunk/tcache/UAF/堆溢出)
          → 堆进阶 + 沙箱(srop/orw) + 各种绕过
```

### 22.2 练习平台

- **pwn.college** —— 教学型，从零到深，配套讲解（强推入门）
- **pwnable.kr / pwnable.tw** —— 经典题库，tw 偏难
- **BUUCTF / 攻防世界** —— 国内复盘题丰富，wp 好找
- 各大比赛平台（CTFtime 上找 event 赛后复现）

### 22.3 参考资料

- 《CTF权威指南——Pwn 篇》—— 国内入门标准书
- 《程序员的自我修养——链接、装载与库》—— ELF/动态链接进阶必读
- **how2heap**（github）—— 堆利用技巧仓库，配 glibc 源码食用
- pwn.college 的 dojo 课程 + CTF Wiki 的 Pwn 章节
- glibc 源码 `malloc.c` —— 堆题最终答案都在这

### 22.4 给新手的几句实在话

1. **环境用 Linux（虚拟机/WSL2）**，Windows 上原生没法练
2. 一道题卡半天是常态，**调试器里看现场永远比脑补准**
3. 先复现别人的 wp（"跟打"），再独立做题，最后看wp都懂了才算会
4. 每道题写**笔记**：漏洞成因、偏移怎么测的、保护怎么绕的——下次秒出思路
5. 记牢三大公式：
   - `真实地址 = 基址 + 偏移`
   - `溢出 payload = 填充 + 返回地址 + ROP链`
   - `函数调用 = rdi(rsi,rdx) 设参 + rip 跳转`

---

*完 —— 把这份当目录用，哪个概念模糊就回头翻哪节。*