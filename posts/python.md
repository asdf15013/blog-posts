---
title: Python零基础教程
date: 2026-11-17
category: 基础知识
tags: [编程语言, Python]
---

# 零基础 Python 深度教程

> 一份写给**完全没写过代码的人**的 Python 教程：从"程序是什么、Python 怎么装"讲起，一路走到面向对象、生成器与装饰器、爬虫实战、FastAPI 后端。每章末尾附练习题与参考答案。

---

## 这份教程适合谁

- 从来没写过程序，想用一门"上手快、用处广"的语言入门的人；
- 想做自动化脚本、爬虫、数据分析、AI 方向的人（Python 是这些领域的母语）；
- 学过一点 Python 但装饰器、生成器、虚拟环境一直似懂非懂的人。

**不需要任何前置知识。** 本系列另有 C / Java 教程，遇到可对比的概念会顺手点一句（标注为"对照"小条），没读过也不影响。

## 教程的四条主线

| 主线          | 对应章节   | 解决什么问题                                                 |
| ------------- | ---------- | ------------------------------------------------------------ |
| 完整入门主线  | 第 1~7 章  | 从语法到 OOP，Python 体系完整走一遍                          |
| Pythonic 内功 | 第 5、8 章 | 切片/推导式/生成器/装饰器/上下文管理器——写出"像 Python"的代码 |
| 工程与实践    | 第 9~11 章 | 虚拟环境与 pip、异常与文件、脚本批处理与爬虫实战             |
| Web 后端      | 第 12 章   | FastAPI + Pydantic 写出第一个 REST API（对标 Java 教程的 Spring Boot 章） |

## 环境约定

- **Python 3.12+**（教程验证于 3.10+，绝大部分代码一致，个别 3.12 特性会标注）；
- 编辑器：前几章用记事本/VS Code + 命令行（看清"解释执行"的本质），第 5 章起推荐 **VS Code + Python 扩展**或 **PyCharm Community**；
- Windows 为主，Linux/macOS 命令基本一致。

<a id="toc"></a>

## 目录

- [第 1 章　初识 Python 与环境搭建](#p01) —— 解释型、装 Python、REPL、Traceback 读法
- [第 2 章　变量、类型与运算符](#p02) —— 动态类型、标签模型、f-string、可变/不可变
- [第 3 章　流程控制](#p03) —— 缩进即语法、match、for-in、enumerate/zip
- [第 4 章　函数与作用域](#p04) —— 默认参数陷阱、*args/**kwargs、lambda、LEGB
- [第 5 章　四大容器](#p05) —— list/tuple/dict/set、切片、推导式、浅深拷贝
- [第 6 章　字符串与正则](#p06) —— 方法全家桶、编码、re 四函数、分组捕获
- [第 7 章　面向对象](#p07) —— self 真相、@property、继承、dunder、dataclass
- [第 8 章　Pythonic 三大件](#p08) —— 生成器、装饰器、上下文管理器、EAFP
- [第 9 章　模块、包与虚拟环境](#p09) —— import 规则、标准库、pip、venv、类型注解
- [第 10 章　异常与文件](#p10) —— try/except、with、pathlib、JSON/CSV、pytest
- [第 11 章　实战：脚本与爬虫](#p11) —— 批处理模板、requests、BeautifulSoup
- [第 12 章　Web 后端：FastAPI](#p12) —— 路由、Pydantic、自动文档、REST API 实战
- [附录　排错手册 · 速查表 · 进阶路线](#appendix)

## 怎么用这份教程

1. **按顺序读**。第 8 章的内功建立在第 4~7 章之上；第 11、12 章的实战用前面所有知识。
2. **代码必须亲手敲**。每段示例都自己敲、运行，再故意改坏看报什么错——Python 的报错信息非常友好，是免费家教。
3. **做每章练习**，先自己做再对答案。
4. **善用 REPL**（第 1 章教你启动）：任何一行代码拿不准，先敲进去看结果，这是 Python 学习独有的爽点。

## 学习心法

**Python 语法最少，但"坑"换了个地方**——动态类型让错误推迟到运行时，缩进即语法，包管理自成一派。三条针对性心法：

1. **报错从最后一行往回读**。Python 的 Traceback 最底下是错误类型和位置，往上翻是调用链——先看最后再往上追（与 Java 的堆栈阅读顺序相反）；
2. **可变/不可变**是 Python 的"指针问题"：list 是可变的、str/tuple 是不可变的，函数传参、默认参数、赋值的一切意外都源于此（第 2、4 章反复敲打）；
3. **用社区的方式写代码**（PEP 8 风格、蛇形命名、EAFP 哲学），第 8、9 章会把这些讲明白；
4. **建立"多语言互查"的习惯**（如果你读过本系列 C/Java 卷）：C 教你内存与编译、Java 教你类型系统与工程、Python 教你表达力与生态——遇到新概念先想"这在另外两门语言里叫什么"，知识自然成网。附录 C 备有一张三语言对照表，收尾时去对答案。

全教程正文约 3 万字、可运行示例 90 余个。学完你应该能：独立写出几百行的 Python 脚本与爬虫、读懂绝大多数 Python 项目、并用 FastAPI 做出一个小而完整的 Web 接口服务。

祝学习顺利，我们第 1 章见。

---

---

<a id="p01"></a>

# 第 1 章 初识 Python 与环境搭建

> 本章目标：搞清 Python 是怎么执行的；装好 Python 3.12；会用 REPL 草稿纸；用三种方式跑第一个程序；避开新手坑。

---

## 1.1 Python 是怎么执行的

计算机只认机器码。编程语言按翻译方式分两大类：**编译型**（如 C，先整体翻译成机器码再运行）和**解释型**（如 Python，由解释器逐条读语句、逐条执行）。

Python 属于后者（严格说是"先编译成字节码、再由虚拟机执行"的混合模式，第 9 章 `__pycache__` 里能看到痕迹，入门阶段按"解释型"理解即可）：

```
hello.py ──python 解释器逐句执行──▶ 输出结果
（源代码，人读）    （不用手动编译，存盘即运行）
```

这带来两个鲜明特征（对照 C 教程）：

- **没有编译步骤**：写完直接 `python hello.py` 跑——反馈极快，这是 Python 上手快的第一原因；
- **错误在运行时才爆发**：C 里类型写错编译器直接拦下，Python 里要跑到那一行才报错。动态类型的代价，第 2 章展开。

Python 由 Guido van Rossum 于 1991 年发布，设计哲学是"**用一种方法，最好是只有一种方法来做一件事**"（`import this` 在 REPL 里敲一下，能看到完整的《Python 之禅》）。这让它代码风格高度统一，读别人代码像读自己代码。

应用版图：自动化脚本、爬虫、数据分析（pandas）、人工智能（PyTorch）、Web 后端（Django/FastAPI）、运维——**"胶水语言"，哪儿都能粘一脚**。

## 1.2 安装 Python（Windows）

官网 <https://www.python.org/downloads/> 下载 Windows installer（选最新的 3.12.x）。安装界面**第一步就勾上 "Add python.exe to PATH"**（最下方复选框）——不勾的话命令行找不到 python，是 Windows 装 Python 的第一大坑。然后 Install Now 一路默认。

验证：`Win+R` → `cmd` 回车，执行：

```
python --version
```

显示 `Python 3.12.x` 即成功。若提示"不是内部或外部命令"，重装一次记得勾 PATH，或手动把 Python 安装目录加进环境变量 Path（改完**重开 cmd**）。

**Linux/macOS**：macOS 自带或 `brew install python`；Ubuntu `sudo apt install python3 python3-pip`。

> 坑预警：Windows 上如果装了多个 Python，`python` 可能指向旧版。用 `py --version`（Windows 专属启动器）可精确指定：`py -3.12 hello.py`。

### 编辑器

- 前几章：记事本 / VS Code 足够；
- 正式学习：**VS Code + Python 扩展**（微软官方，免费）或 **PyCharm Community**（JetBrains，功能最全）。它们提供补全、红色波浪线（语法错误提前发现）、一键运行。

## 1.3 REPL：随敲随跑的草稿纸

REPL（Read-Eval-Print Loop，交互式解释器）是 Python 学习的**独门爽点**：命令行敲 `python` 回车，出现 `>>>` 提示符，输入任何表达式立刻看结果：

```
>>> 1 + 2
3
>>> "hello".upper()
'HELLO'
>>> [1, 2, 3] + [4]
[1, 2, 3, 4]
>>> import this        ← 试试《Python 之禅》
>>> exit()             ← 退出（或 Ctrl+Z 回车 / Ctrl+D）
```

任何拿不准的代码，先敲进 REPL 看——**比建文件快十倍**。学新函数时，`help(len)` 能直接打印官方文档，`dir(str)` 能列出字符串类型的所有方法。这两个自省函数是 Python 的"随身手册"。

## 1.4 第一个程序：Hello, World!

新建文件夹（如 `D:\py lec`），新建文件 `hello.py`（Python 源文件一律 `.py` 后缀），敲入：

```python
print("Hello, World!")
```

**就一行。**（对照 C 教程的 7 行、Java 教程的 5 行——Python 连"装进类"都不要。）运行有三种方式：

```
python hello.py        ← 方式一：命令行执行脚本（最常用）
python                 ← 方式二：REPL 里直接敲 print("Hello, World!")
                        ← 方式三：VS Code/PyCharm 里点运行按钮
```

输出：

```
Hello, World!
```

逐个认识这行里的元素：`print` 是**内置函数**（Python 自带，无需 import），作用是打印到屏幕并换行；`"Hello, World!"` 是字符串字面量；括号是函数调用语法。没有分号、没有花括号——**Python 用缩进表示代码块**（第 3 章正式讲），这行只有一条语句所以什么都看不到。

三个零基础常见坑：

- **中文标点**：`print("你好"）` 末尾的中文括号直接报 `SyntaxError`；
- **缩进用 Tab 还是空格**：Python 4 空格是铁律（编辑器的 Tab 键通常自动转 4 空格，别手动混敲 Tab）；
- **文件名别叫 python.py / random.py**：会和标准库模块撞名，import 时导入自己，产生灵异错误（第 9 章细说）。

### REPL 自省三件套：dir / help / type

REPL 是草稿纸，这三个内置函数是草稿纸上的放大镜——**自学一切库的基本功**：

```
>>> type(3.14)                 # 这是个什么东西？
<class 'float'>
>>> x = "hello"
>>> dir(x)                     # 这个东西有什么能力？（列出全部属性和方法名）
['__add__', '__class__', 'capitalize', 'center', 'count', ..., 'upper', 'zfill']
>>> help(x.upper)              # 这个方法怎么用？
Help on built-in function upper:
    Return a copy of the string converted to uppercase.
```

组合套路：拿到一个陌生的对象（比如 requests 的响应 `r`），先 `type(r)` 认类，再 `dir(r)` 翻能力清单（下划线开头的是语言内部钩子，先看普通名字），最后 `help(对象.方法)` 读说明——**全程不用查网页**。本章不求记住任何输出，只求把这个"三连问"变成肌肉反射。

### 多版本共存：py 启动器（Windows）

机器上常同时存在 3.10、3.12（不同项目要不同版本）。Windows 的安装器自带 **py 启动器**专治共存：

```
py --list              # 列出已装的所有版本
py -3.12 hello.py      # 指定 3.12 跑脚本
py -3.10 -m venv .venv # 用 3.10 建虚拟环境
```

（Linux/macOS 用 `python3.12` 全名区分。）真正的项目隔离靠第 9 章的 venv——**多版本管"哪个解释器"，venv 管"哪个包集"**，两层各司其职。

## 1.5 报错信息怎么读：Traceback

Python 报错叫 **Traceback（回溯）**，格式是"从最近调用往回列"。故意弄坏一次：

```python
print("hello"
print("world")
```

运行报：

```
  File "hello.py", line 2
    print("world")
         ^
SyntaxError: '(' was never closed
```

阅读顺序（与 Java 相反！）：**从最后一行往回读**。最后一行是错误类型 + 说明（`SyntaxError: '(' was never closed`），倒数第二行是出错位置的代码（带 `^` 指点），再上面是文件与行号。运行时错误则是完整调用链，最后一条是案发现场、往上翻是每层调用者——先看最后，再往回追，附录 A 有常见报错对照表。

### 《Python 之禅》解读：这门语言的价值观

第 1.3 节让你敲过的 `import this`，输出的 19 条 aphorism 值得认真读一遍——它们是 Python 社区写代码的"宪法"。挑五条最影响初学者的：

1. **优美胜于丑陋（Beautiful is better than ugly）**——同一个功能常有多种写法，选那个读起来舒服的。Python 社区对"能跑就行"的容忍度很低，代码是写给人看的；
2. **明了胜于晦涩（Explicit is better than implicit）**——`import utils` 后用 `utils.clean()` 而不是把所有名字倒进来；方法第一个参数明写 self。藏着掖着的"聪明"是负资产；
3. **简单胜于复杂（Simple is better than complex）**——能用一个 for 循环说清楚的事，别上设计模式。过度工程在 Python 圈是笑话素材；
4. **可读性至关重要（Readability counts）**——蛇形命名、空格分隔、一行一事。这条直接写进了 PEP 8 风格指南；
5. **面对歧义，拒绝猜测（There should be one obvious way to do it）**——语言层面对"一件事"通常只提供一种显然的写法（格式化用 f-string、排序用 sorted），所以读别人的代码像读自己的。

实用结论：写完代码问自己一句"**半年后的我看这行，还需要想吗？**"——想，就重写。这个标准比任何教程都好用，也是 Python 代码"天下大同"的根源（你以后读 GitHub 上的开源 Python 项目，会惊讶于风格的高度一致）。

## 1.6 注释与中文

```python
# 单行注释：井号到行尾
print("hi")  # 也可写在代码后面

"""
三引号字符串放在文件开头/函数开头，
约定俗成当多行说明用（叫 docstring，第 4 章正式讲）
"""
```

Python 3 源文件默认 UTF-8，**中文注释、中文字符串直接写**，无需任何声明（对照 Python 2 时代要写 `# -*- coding: utf-8 -*-`，已成历史）。Windows 命令行显示中文乱码时 `chcp 65001` 切 UTF-8。

### Python 生态版图：这门语言靠什么吃饭

学语言前先看生态，方向感立刻清晰。Python 的版图按"离家远近"分三层：

- **标准库**（装好就有，第 9 章专讲）：文件、网络、JSON、日期、正则、随机……写脚本够用；
- **PyPI 第三方包**（`pip install` 装，50 万+）：所有领域的轮子都在这——爬虫的 requests、数据分析的 pandas、AI 的 PyTorch、Web 的 fastapi/django、自动办公的 openpyxl；
- **发行版与运行平台**：CPython（官方实现，本教程用它）、Anaconda（数据科学全家桶）、以及跑在浏览器里的 Pyodide、跑在 JVM 上的 Jython——"Python" 本质是一门语言规范加一个最大众的实现。

三个方向的地基对照本教程章节：**自动化/脚本**（第 3~11 章全部）、**数据分析**（第 5、10 章 + pandas）、**AI**（第 5、8 章 + 数学 + PyTorch）。不管哪条路，前 10 章的语言内功都一样——这也是"先学语言再选方向"而不是反过来的原因。

### 运行细节三则：shebang、编码声明与命令行参数

三个"见过但不明所以"的东西，现在一次说清：

```python
#!/usr/bin/env python3
# ↑ shebang 行：只有 Linux/macOS 把脚本当程序直接执行（./hello.py）时才有意义，
#   作用是告诉系统用哪个解释器跑本文件。Windows 上双击/命令行运行时被当普通注释忽略。

# -*- coding: utf-8 -*-
# ↑ 编码声明：Python 2 时代的必需品，Python 3 默认 UTF-8 后已成历史残留。
#   老项目里见到不要慌，它在 Python 3 里只是注释。
```

命令行参数在脚本里通过 `sys.argv` 接收：

```python
import sys
print(len(sys.argv), sys.argv)    # python demo.py a b → 3 ['demo.py', 'a', 'b']
```

第 11 章的批处理脚本就用它接收目录参数，到时回头看这一段。

## 1.7 心法：REPL 里试，报错里学

Python 的学习循环比其他语言更顺滑：**想法 → REPL 里试 → 脚本里用 → 报错了读 Traceback → 修**。三条起步心法：

1. **先 REPL 后脚本**：学新函数先在 REPL 里玩熟，再进正式代码；
2. **Traceback 从下往上读**：最后一行定类型，往上找位置；
3. **报错类型要认识**：`SyntaxError`（语法错，写的时候）、`NameError`（名字没定义）、`TypeError`（类型不对）、`IndexError`/`KeyError`（下标/键越界）——这四个占新手报错九成，附录对照表全文收录。

### 环境自检清单（10 分钟做完再翻页）

把这一页当 checklist，全部打勾再进第 2 章：

```
□ python --version     输出 3.12.x（或 ≥3.10）
□ pip --version        输出版本号且路径指向你的 Python 安装目录
□ 新建 hello.py 打印三行内容，python hello.py 运行成功
□ REPL（python 命令）能进入、能 exit() 退出
□ dir() / help(len) 都有正常输出
□ 编辑器就绪：VS Code 装好 Python 扩展（或 PyCharm）
□ 建好你的练习目录（如 D:\py lec），后面每章的 .py 都放这里
```

任何一项卡住，回到对应小节重做——环境是一次性投入，接下来 12 章的每一行代码都从它出发。前三项最重要的故障率排序：PATH 没配（重装勾选框）> 装了 Microsoft Store 版（卸掉装 python.org 版）> 多版本打架（用 py 启动器指定）。

## 1.8 小结

- 解释型：写完直接跑，无编译步骤；`python hello.py` 一条命令；
- REPL（`python`）是随敲随跑的草稿纸，`help()`/`dir()` 是随身手册；
- 缩进即语法，4 空格铁律；源码默认 UTF-8，中文随便写；
- Traceback 从最后一行往回读；安装必勾 "Add to PATH"。

## 练习 1

1.（概念）Python 和 C 在"怎么变成可执行结果"上有什么本质区别？各带来什么优缺点？
2.（操作）在 REPL 里：算 `12345 * 67`；打印 `"python".upper()`；执行 `import this` 把《Python 之禅》读一遍。
3.（编程）写脚本输出三行：你的名字、爱好、`I am learning Python.`。
4.（编程）打印如下图案：

```
  *
 ***
*****
```

5.（操作）故意写错三处（中文括号、漏引号、缩进错误）各运行一次，把三种 Traceback 抄在笔记本上。

## 参考答案

**1.** C 先编译成机器码再运行（快、但每次改动要重新编译，且绑定平台）；Python 由解释器逐句执行（改完立即跑、跨平台，但慢、错误运行时才现形）。

**2.** `12345 * 67` → 827115；`"python".upper()` → 'PYTHON'；《Python 之禅》19 条，前两条：优美胜于丑陋，明了胜于晦涩。

**3.**

```python
print("张三")
print("编程")
print("I am learning Python.")
```

**4.**

```python
print("  *")
print(" ***")
print("*****")
```

**5.** 典型三种：`SyntaxError: '(' was never closed`（没闭合）、`SyntaxError: unterminated string literal`（引号没闭合）、`IndentationError: expected an indented block`（缩进错误）。抄下来是为以后 3 秒认出它们。

**[▲ 返回目录](#toc)**

---

<a id="p02"></a>

# 第 2 章 变量、类型与运算符

> 本章目标：掌握 Python 的动态类型与四种核心类型；理解"变量是标签"的心智模型；会用 f-string 格式化；认识可变与不可变的分界线——这是全书最重要的概念之一。

---

## 2.1 变量：贴在值上的标签

Python 变量**不需要声明类型**，赋值即创建：

```python
age = 18              # 变量 age 指向整数 18
name = "张三"          # 指向字符串
pi = 3.14159
is_vip = True
```

心智模型与 C/Java 完全不同：**Python 的变量是"贴在对象上的标签"，不是"装值的盒子"**。赋值 `age = 18` 的意思是"把标签 age 贴到对象 18 上"。变量随时可以改贴：

```python
x = 42          # x 贴在整数 42 上
x = "hello"     # 现在贴到字符串上——合法！类型跟着值走
```

这叫**动态类型**：类型属于**值**而不属于**变量**。好处是灵活、代码短；代价是错误推迟到运行时（把名字写错，C 编译器拦你，Python 要跑到那行才炸出 `NameError`）。

命名规范（PEP 8）：**蛇形命名 lower_snake_case**——`user_name`、`total_score`。常量约定全大写 `MAX_RETRY = 3`（Python 没有"真正的常量"，全大写只是君子协定，语言层面不阻止你改）。

## 2.2 四种核心类型

```python
age = 18               # int 整数——精度无限！100 位整数也轻松存
price = 19.99          # float 浮点数——双精度，有 0.1+0.2 的老毛病
name = "张三"           # str 字符串——不可变序列
ok = True              # bool 布尔——只有 True/False（首字母大写！）
nothing = None         # NoneType——"什么都没有"的唯一值
```

要点：

1. **int 精度无限**：`2 ** 200`（2 的 200 次方）Python 直接算出完整数字，对照 C 的 int 溢出、Java 的 BigInteger 补丁——Python 原生就是对的；
2. **float 照样不精确**：`0.1 + 0.2 == 0.3` 是 `False`，`0.1 + 0.2` 显示 `0.30000000000000004`。算钱用第 10 章的 Decimal 或以"分"为 int；
3. **bool 是 int 的子类**（历史彩蛋）：`True + True` 得 2——能这么玩但别这么写；
4. **None 表示"没有值"**，判断用 `is None` 而不是 `== None`。

查类型用 `type(x)`，转类型用 `int()/float()/str()/bool()`：

```python
type(3.14)              # <class 'float'>
int("123")              # 123：字符串转整数（失败抛 ValueError）
int(3.99)               # 3：直接截断，不是四舍五入
str(42)                 # '42'
round(3.567, 2)         # 3.57：四舍五入到 2 位
bool("")                # False！——空串、0、None、空容器都是“假”
```

**真假规则**是 Python 的暗门：`if` 条件里，`0、0.0、""、[]、{}、None` 都当假，其余都当真。所以 `if items:` 就是"如果列表非空"的地道写法。

### 多重赋值、交换与海象运算符

Python 的赋值远比"一个变量 = 一个值"丰富，四个招式全部属于日常：

```python
# ① 多重赋值：右边整体求值再绑定
x, y = 1, 2
a, b = b, a                    # 交换变量，免临时变量（C 的三行、Java 的仪式感，Python 一行）

# ② 星号解包：多余元素收进列表
first, *rest = [1, 2, 3, 4]    # first=1, rest=[2, 3, 4]
*init, last = [1, 2, 3, 4]     # init=[1,2,3], last=4

# ③ 链式赋值：一个值贴多个标签
p = q = []                     # 注意：p、q 是同一个列表（第 2.5 节的坑在此预警）

# ④ 海象运算符 :=（3.8+）：赋值的同时把值当表达式用
if (n := len("hello world")) > 10:
    print(f"太长了：{n} 个字符")     # n 在条件里赋值，块内直接可用
```

海象运算符（walrus，长得像海象眼睛和獠牙）适合"算一次、判一次、用一次"的场景——读循环里的经典用法：

```python
while (chunk := input("输入（q 退出）：")) != "q":
    print(f"收到 {chunk}")
```

对照 C 教程："赋值是表达式"让 C 能写 `while ((c = getchar()) != EOF)`；Python 把赋值做成**语句**，于是 3.8 补了个 `:=` 专门干这事。招式多但语义统一：**`=` 永远是"右边求值，左边贴标签"**——新招式都逃不出第 2.1 节的心智模型。

### 类型注解初见（先立个牌子）

Python 虽是动态类型，但允许给变量/函数**标注类型**：

```python
age: int = 18
def add(a: int, b: int) -> int:
    return a + b
```

注解**不影响运行**（写错类型程序照跑）——它是给人和 IDE 看的文档，配合 mypy 工具能做静态检查（第 9 章专讲）。第 7 章 dataclass、第 12 章 FastAPI 都直接消费注解，先混个脸熟。

## 2.3 运算符

### 算术：`+ - * / // % **`

```python
7 / 2      # 3.5   —— / 永远返回 float（对照 C 的整数除法砍小数）
7 // 2     # 3     —— // 整除（向下取整：-7 // 2 是 -4，不是 -3！）
7 % 2      # 1     —— 取模
2 ** 10    # 1024  —— ** 幂运算，Python 原生
```

两个反直觉点：**`/` 不做整数除法**（从 C 转来的人天天踩）；**`//` 是向下取整**（负数时与 C 的截断方向不同）。拆数字老套路不变：`n % 10` 取个位、`n // 10` 去个位。

### 比较、逻辑与身份

```python
a == b        # 值相等？（注意和赋值 = 区分）
a != b        # 不等
1 < x <= 10   # 链式比较！数学写法直接合法，等价于 1 < x and x <= 10
a and b       # 逻辑与（不是 &&）
a or b        # 逻辑或（不是 ||）
not a         # 逻辑非（不是 !）
a is b        # 是同一个对象吗？（身份，见下）
```

**`==` 与 `is` 的区别**是 Python 版的"值 vs 地址"：`==` 比内容，`is` 比"是不是同一个对象"（内存身份）。日常判等用 `==`，只有判断 `None` 用 `is`。

**短路求值**同样存在，且是 Python 代码的灵魂技巧：

```python
if data is not None and data[0] > 0:   # 先判空再取值——短路救命的日常写法
    process(data)

result = name or "匿名"                 # or 短路：name 为空串/None 时用默认值
```

### 字符串拼接的 `+`

```python
"得分：" + "95"        # OK：字符串 + 字符串
"得分：" + 95          # TypeError！—— 不自动转换（对照 Java 的隐式拼接）
```

数字必须先 `str(95)` 转字符串才能拼接——**或者干脆用 f-string（下一节），一劳永逸**。

## 2.4 f-string：格式化的现代答案

格式化字符串（f-string，3.6+）：字符串前加 `f`，花括号里直接写表达式：

```python
name, score = "张三", 90.5
print(f"学生 {name} 成绩 {score}")           # 学生 张三 成绩 90.5
print(f"明年 {name} 将满 {age + 1} 岁")       # 花括号里可以算表达式
print(f"平均分 {score:.2f}")                  # 90.50 —— :.2f 保留两位
print(f"{name:>10}|")                        #        张三| —— 右对齐占 10 格
print(f"{1000000:,}")                        # 1,000,000 —— 千分位
```

老三样认识即可（读老代码用）：`%` 风格 `"%s 得 %d" % (name, score)`、`str.format()` `"{} 得 {}".format(name, score)`。**新代码一律 f-string**。

数字转字符串不用想拼接问题：`f"...{num}..."` 自动转换。这是 Python 版的 printf，且更简洁。

## 2.5 可变 vs 不可变：一切的源头

Python 类型分两大阵营，这条分界线解释全书一半的"灵异现象"：

- **不可变类型（immutable）**：int、float、str、bool、tuple——**值本身不能改**；
- **可变类型（mutable）**：list、dict、set——**值可以原地改**。

不可变的证据：

```python
s = "hello"
# s[0] = "H"            # TypeError！字符串不能原地改
s = "Hello"              # 只能“换一个新对象重新贴标签”
```

可变的证据：

```python
items = [1, 2, 3]
items[0] = 99            # OK：列表原地改，还是同一个对象
```

**标签模型 + 两大阵营 = 赋值行为的完整解释**：

```python
a = [1, 2, 3]
b = a                    # 不是复制！只是又贴了一个标签——a、b 指同一个列表
b.append(4)
print(a)                 # [1, 2, 3, 4] —— a "莫名其妙"也变了！因为只有一个列表

x = 10
y = x                    # 不可变对象同理共享，但"改"只能换对象
y = y + 1                # 等于 y 换贴到新对象 11
print(x)                 # 10 —— x 纹丝不动
```

```
可变对象（list）：              不可变对象（int）：
a ──┐                          x ──▶ 10
    ├──▶ [1,2,3,4]             y ──▶ 11（新对象，旧对象没人贴了等 GC）
b ──┘
（两个标签，一个对象）           （"修改"= 换标签）
```

后果预告（后面章节反复回收）：函数传参（第 4 章默认参数陷阱）、字典键必须不可变（第 5 章）、浅拷贝深拷贝（第 5 章）。**现在记住结论：改共享的可变对象，所有标签都看得到；不可变对象的"改"永远产生新对象。**

想真正复制一份可变对象：

```python
import copy
b = a.copy()             # 浅拷贝：新列表外壳（元素还是共享引用）
b = a[:]                 # 切片拷贝，等价
b = list(a)              # 构造器拷贝，等价
deep = copy.deepcopy(a)  # 深拷贝：连元素里的嵌套结构都复制（第 5 章展开）
```

### 对象身份 is、id() 与小整数缓存

`==` 比值、`is` 比身份（同一个对象）。身份用 `id()` 能直接看到（返回对象的内存地址性质的编号）：

```
>>> a = [1, 2]
>>> b = a
>>> id(a) == id(b)
True          ← 两个标签指向同一个对象
>>> c = [1, 2]
>>> a == c
True          ← 内容相等
>>> a is c
False         ← 但是两个不同的对象
```

一个著名的坑——**小整数缓存**：

```
>>> x = 256; y = 256
>>> x is y
True           ← [-5, 256] 的整数被解释器缓存，字面量共享同一对象
>>> x = 257; y = 257
>>> x is y
False          ← 超出缓存范围，两个新对象
```

结论（背下来）：**is 只用于判断 None（`x is None`），数值/字符串/列表的一律用 ==**。小整数缓存属于解释器实现细节，依赖它写代码属于"薛定谔 bug"——换个 Python 版本就变。这与 Java 教程 Integer 缓存坑（-128~127）是同一家族的问题，两门语言都教育你同一件事：**比较内容用语义比较，身份比较留给 None 和单例**。

### 浮点老朋友与 Decimal 预告

`0.1 + 0.2 != 0.3` 在 Python 里同样成立（IEEE 754 是全人类共享的坑，对照 C/Java 教程同款章节）。Python 的解法家族：

```python
0.1 + 0.2                     # 0.30000000000000004
round(0.1 + 0.2, 2)           # 0.3 —— 显示层四舍五入（展示够用，账目不够）
from decimal import Decimal
Decimal("0.1") + Decimal("0.2")     # Decimal('0.3') —— 十进制精确（算钱正解）
```

纪律照旧：**钱用 Decimal（构造参数用字符串！）或以分为单位的 int**。浮点留给"允许误差"的科学计算。

## 2.6 输入：input()

```python
name = input("你的名字：")       # 括号里是提示语，返回值永远是字符串！
age = int(input("年龄："))       # 要数字必须手动转（转失败抛 ValueError）
```

**input() 永远返回 str**——"18" 跟 18 是两个东西，`age + 1` 前必须 `int()` 转换。这是 Python 新手第一高频率报错 `TypeError: can only concatenate str` 的根源。健壮写法（配合第 10 章异常）：

```python
try:
    age = int(input("年龄："))
except ValueError:
    print("请输入数字")
```

### None 与"可变默认参数"的邻居们：三个 null 相关陷阱

None 本身不咬人，咬人的是"在错误的地方信任了它"。三个高频陷阱集齐：

```python
# 陷阱 1：用 == 判断 None
if x == None: ...            # 能跑，但若 x 是自定义对象且 __eq__ 写得怪，会误判
if x is None: ...            # 唯一正确姿势（is 比身份，None 是全局单例）

# 陷阱 2：把 None 当 false 用，丢掉了"合法的 0/空串"
def greet(name=None):
    display = name or "匿名"          # 坑！name="" 或 0 时也会被换成“匿名”
    display = name if name is not None else "匿名"   # 对：只替换真正的“没有”

# 陷阱 3：可变默认参数（4.2 节全书大坑的根源预告）
def add_item(item, items=None):       # None 哨兵是默认参数的正确姿势
    items = [] if items is None else items
```

心智模型：**None 是"这里应该有值但现在没有"的正式标记**——它合法地出现在返回值（函数没 return）、字典键值、默认参数里。处理它的标准动作只有三个：`is None` 判断、`or` 提供默认（确认不会误伤合法假值时）、`x if x is not None else y`（精确版）。第 12 章 FastAPI 的 `Optional[str] = None` 参数会把这三个动作全部再演一遍。

## 2.7 小结

- 变量是标签不是盒子；动态类型，类型跟着值走；蛇形命名；
- 四类型：int 无限精度、float 不精确、str 不可变、bool 首字母大写；空值 None 用 is 判断；
- `/` 是真除法、`//` 向下取整、`**` 幂；链式比较合法；`==` 比值 `is` 比身份；
- **f-string 一把梭**；input() 永远返回 str，要转 int；
- **可变（list/dict/set） vs 不可变（int/str/tuple）**：`b = a` 只是贴标签，改可变对象全体可见。

## 练习 2

1.（概念）`a = [1,2]; b = a; b.append(3)` 后 `a` 是什么？换成 `a = (1,2)`（元组）后呢？为什么行为不同？
2.（概念）`7 / 2`、`7 // 2`、`-7 // 2`、`7 % 2`、`2 ** 3` 各是多少？
3.（改错）找出两处问题：

```python
age = input("年龄：")
if age >= 18:
    print("成年")
```

4.（编程）读入半径，输出圆面积和周长（π 用 3.14159），面积保留 2 位小数（f-string）。
5.（编程）读入一个三位整数，用整除和取模输出它的个、十、百位之和。

## 参考答案

**1.** a 变成 `[1,2,3]`——b 是同一列表的第二个标签，append 改的是那个共享对象。元组版直接 `TypeError`（tuple 不可变，没有 append），且 `b = a` 无论什么类型都只是贴标签。行为差异的本质：可变对象能被"原地修改"，不可变的只能换标签。

**2.** `3.5`、`3`、`-4`（向下取整方向）、`1`、`8`。

**3.** ① `input()` 返回字符串，`age >= 18` 是 str 与 int 比较——Python 3 直接 `TypeError`，须 `age = int(input(...))`；② 无第二处语法错，但 int() 转换失败会抛 ValueError 未处理（练习 10 章修）。

**4.**

```python
r = float(input("半径："))
area = 3.14159 * r ** 2
circ = 2 * 3.14159 * r
print(f"面积 {area:.2f}，周长 {circ:.2f}")
```

**5.**

```python
n = int(input("三位整数："))
print(n // 100 + n // 10 % 10 + n % 10)
```

**[▲ 返回目录](#toc)**

---

<a id="p03"></a>

# 第 3 章 流程控制

> 本章目标：掌握 if/elif、while、for-in 与 range；理解"缩进即语法"；认识 match 语句；练熟经典题。Python 的分支循环没有花括号、没有括号包裹条件，全靠缩进与冒号。

---

## 3.1 if / elif / else：缩进即语法

```python
score = 85

if score >= 90:
    print("优秀")
elif score >= 80:
    print("良好")        # ← 这行会执行
elif score >= 60:
    print("及格")
else:
    print("不及格")
```

语法三件套（背下来，Python 全部语法都长这样）：

1. **条件后跟冒号 `:`**；
2. **下一行缩进 4 空格**表示"属于 if"；
3. **缩进结束 = 块结束**——不需要 `}`，回退缩进就出块了。

```python
if score >= 60:
    print("及格")
    print("（缩进相同，都属于 if 块）")
print("这句永远执行（已出块）")
```

**缩进是语法不是风格**——多一格少一格直接改变程序含义或报 `IndentationError`。规矩：全程 4 空格，绝不用 Tab 混缩。

条件的真假规则（第 2 章）：`0、""、[]、None` 都算假。所以有三种常见等价：

```python
if len(items) > 0:      # 新手写法
    print("非空")

if items != []:         # 一般写法
    print("非空")

if items:               # Pythonic：直接判真值
    print("非空")
```

`if-else` 还能写成**条件表达式**（三元），常用于赋值：

```python
status = "成年" if age >= 18 else "未成年"
```

## 3.2 match：结构化的多路分发（3.10+）

传统的多分支可以用 if-elif 链，3.10 起新增 `match`（类似 C/Java 的 switch，但强大得多）：

```python
command = input("命令：")

match command:
    case "start":
        print("启动")
    case "stop" | "exit":          # | 表示多值或
        print("停止")
    case _:                         # _ 兜底（对应 default）
        print("未知命令")
```

match 的真正威力在**模式匹配**：能拆解数据结构——

```python
point = (3, 0)

match point:
    case (0, 0):
        print("原点")
    case (0, y):
        print(f"在 y 轴上，y={y}")      # 把元组第二个元素“捕获”给 y
    case (x, 0):
        print(f"在 x 轴上，x={x}")
    case (x, y):
        print(f"普通点 ({x}, {y})")
```

`case (x, 0)` 不是判断相等，而是"**形状匹配**"：元组长度为 2 且第二个元素是 0，顺便把第一个元素绑给 x。这个能力在读 JSON、处理消息协议时极其好用，本章先入门，第 12 章 API 例子再见到它。

## 3.3 while：条件循环

```python
count = 1
while count <= 5:
    print(f"第 {count} 圈")
    count += 1          # Python 没有 count++，用 += 1
```

三要素照旧：初始化、条件、更新。死循环 `while True:` 配 `break` 是交互菜单的标准骨架：

```python
while True:
    cmd = input("命令（q 退出）：")
    if cmd == "q":
        break
    print(f"执行 {cmd}")
```

## 3.4 for-in：Python 的循环主力

Python 的 for 不数数字，而是**遍历序列**（对照 C 的 `for(i=0;i<n;i++)`）：

```python
for ch in "hello":            # 遍历字符串的每个字符
    print(ch)

for item in [10, 20, 30]:     # 遍历列表
    print(item)

for i in range(5):            # range(5) → 0,1,2,3,4
    print(i)

for i in range(2, 10, 3):     # range(起, 止, 步长) → 2,5,8（不含 10）
    print(i)
```

`range(n)` 是"数数器"：生成 0 到 n-1（记住"**左闭右开**"）。想要下标同时要值，用 `enumerate`（Pythonic 必杀技）：

```python
for i, item in enumerate(["a", "b", "c"]):
    print(i, item)            # 0 a / 1 b / 2 c —— 不要再手写 i += 1
```

两个序列并行遍历用 `zip`：

```python
for name, score in zip(["张三", "李四"], [90, 66]):
    print(f"{name}: {score}")
```

### 双层循环与追踪表

九九乘法表（对照 C/Java 教程同款）：

```python
for row in range(1, 10):
    for col in range(1, row + 1):
        print(f"{col}x{row}={row * col}", end="\t")   # end 指定行尾，默认 \n
    print()                                            # 每行结束换行
```

外层每走一步、内层完整跑一遍——心法与 C 相同。`print` 的 `end` 参数很常用：默认打印后换行，改成 `end=" "` 可同行连续输出。

## 3.5 break、continue 与 else

`break` 跳出本层循环、`continue` 跳过本轮——语义与 C 相同。Python 还有个独有的 **循环 else**：

```python
for n in range(2, 100):
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            break                 # 找到因子：n 不是素数
    else:
        print(n, end=" ")         # 循环没被 break 打断 = 没找到因子 = 素数！
```

**循环的 else 只在"循环自然结束（没有被 break）"时执行**——初读拗口，但"找了一圈没找到"恰好是 else 的语义，写搜索类循环时很干净。记不住就先不用，知道有这个东西、读别人代码不慌即可。

### match 进阶：守卫与解构的真实用法

match 的模式匹配配**守卫（if 条件）**才能发挥全力——"形状匹配 + 内容校验"两段式：

```python
def handle(msg: dict):
    match msg:
        case {"type": "login", "user": user}:
            print(f"{user} 请求登录")                 # 字典模式：匹配键值并捕获
        case {"type": "move", "x": x, "y": y} if x * y >= 0:
            print(f"同象限移动 ({x}, {y})")           # 守卫：形状对了还要过 if
        case {"type": t}:
            print(f"未知消息类型：{t}")               # 有 type 但没匹配上的兜底
        case _:
            print("这不是消息")

handle({"type": "move", "x": 3, "y": 5})    # 同象限移动 (3, 5)
handle({"type": "move", "x": 3, "y": -5})   # 未知消息类型：move（守卫拦下）
```

另一个真实场景——**命令解析**（对照 C/Java 教程的 switch 分发，功能强一档）：

```python
match cmd.split():
    case ["add", name, score]:        # 把 split 结果按位置解构
        add(name, int(score))
    case ["find", name]:
        find(name)
    case ["list"]:
        list_all()
    case _:
        print("用法：add 姓名 分数 / find 姓名 / list")
```

`cmd.split()` 的列表被按"形状"拆解——一行顶 if-elif 三行。处理机器人指令、协议包、嵌套 JSON 时，match + 解构是 Python 3.10+ 的新标准答案（老代码还是 if-elif 链，两套都要会读）。

## 3.6 经典例题

### 例 1：猜数字

```python
import random

secret = random.randint(1, 100)       # [1, 100] 两端都含（注意与 randrange 区别）
count = 0

while True:
    guess = int(input("猜（1~100）："))
    count += 1
    if guess > secret:
        print("大了")
    elif guess < secret:
        print("小了")
    else:
        print(f"猜中！用了 {count} 次")
        break
```

### 例 2：最大公约数（辗转相除）

```python
a, b = 1998, 629
while b:
    a, b = b, a % b       # 多重赋值：右边先整体求值，再同时绑定——无需临时变量！
print(a)                  # 17
```

`a, b = b, a % b` 是 Python 的招牌写法：右侧先打包求值，再解包赋给左侧——交换变量也是 `a, b = b, a`，一行顶 C 的三行。

### 例 3：水仙花数

```python
for n in range(100, 1000):
    a, b, c = n // 100, n // 10 % 10, n % 10
    if a**3 + b**3 + c**3 == n:
        print(n, end=" ")
print()    # 153 370 371 407
```

### 循环进阶两式：else-搜索与守卫式死循环

**式一：循环 else 做"找没找到"**（3.5 节素数例的通用化）：

```python
def find_user(users, name):
    for u in users:
        if u["name"] == name:
            return u                # 找到：直接 return，else 不会执行
    else:
        raise LookupError(f"查无此人：{name}")   # 循环自然走完 = 没找到

for-else / while-else 的语义：else 只在"循环没被 break 打断"时执行。
```

**式二：死循环的守卫**。`while True` 交互循环要防两类事故：

```python
while True:
    cmd = input("> ").strip()
    if cmd == "q":
        break                        # ① 明确出口放最前面
    try:
        handle(cmd)
    except Exception as e:           # ② 循环体出错也不能死（打日志继续下一轮）
        print(f"处理失败：{e}")
```

终端里死循环按 **Ctrl+C** 强制中断（会抛 KeyboardInterrupt，第 10 章讲为什么裸 except 会连它一起吞）。写交互循环时把这两道守卫带上，程序就"死不了、卡不住"。

### 性能直觉：timeit 计时器

REPL 里自带性能测试工具，怀疑"哪种写法快"时不用猜：

```
>>> import timeit
>>> timeit.timeit("sum(range(1000))", number=10000)
0.32...
>>> timeit.timeit("sum([i for i in range(1000)])", number=10000)
0.41...
```

`number` 是重复次数。结论示例：直接 `sum(range(1000))` 比先造列表再求和快——**生成器/惰性版省了造列表的开销**（第 8 章的理论，这里先给工具）。性能话题的第一课不是优化技巧，而是**先测量再动手**：直觉在数据面前一文不值。

## 3.7 循环三大经典 Bug（Python 版）

1. **差一错误**：`range(len(items))` 上界 `len(items)` 本身取不到（左闭右开是保护不是陷阱，但要心算清楚）；
2. **遍历中修改序列**：

```python
items = [1, 2, 3, 4]
for x in items:
    if x % 2 == 0:
        items.remove(x)        # 边遍历边删 → 跳元素，结果错误（不报错更阴险）
# 正解：items = [x for x in items if x % 2]   （第 5 章推导式）
```

3. **浮点累加判等**：`x != 1.0` 当步进 0.1 时永假——用 `x < 1.0` 或整数计数。

### 综合练习级示例：命令行通讯录骨架

把本章所有控制流装进一个"能跑的小系统"——这也是你第一个百行级程序模板（数据结构与文件持久化在第 10 章升级）：

```python
"""通讯录骨架：add / find / list / quit"""
contacts = []                                    # [{"name":..., "phone":...}]

def find(name):
    for c in contacts:
        if c["name"] == name:
            return c
    return None

while True:
    cmd = input("add/find/list/quit > ").strip()

    if cmd == "quit":
        print("再见")
        break
    elif cmd == "add":
        name = input("姓名：").strip()
        if find(name) is not None:               # 已存在则拒绝（业务规则）
            print("已存在同名联系人")
            continue
        phone = input("电话：").strip()
        contacts.append({"name": name, "phone": phone})
        print(f"已添加 {name}（共 {len(contacts)} 人）")
    elif cmd == "find":
        c = find(input("姓名：").strip())
        print(f"{c['name']}: {c['phone']}" if c else "查无此人")
    elif cmd == "list":
        for i, c in enumerate(contacts, start=1):    # enumerate 从 1 计数
            print(f"{i}. {c['name']} {c['phone']}")
    else:
        print("未知命令")
```

值得注意的三处设计：**find 独立成函数**（add 和 find 复用，改查找逻辑只改一处）；**enumerate(start=1)** 让编号从 1 开始符合人类习惯；**输入一律 strip()**（手滑的空格是命令行程序的常见死因）。跑通它之后，第 10 章你会给它加 JSON 存档，第 12 章 FastAPI 版还会再见到同样的增删查逻辑——**业务逻辑不变，载体一路升级**，这正是"语言只是方言"的现场教学。

## 3.8 小结

- 冒号 + 4 空格缩进 = 代码块；缩进是语法；真值规则让 `if items:` 地道；
- match-case：字面量匹配 + `|` 多值 + `_` 兜底 + 结构模式拆解；
- for-in 遍历序列为主力，`range` 负责数数，`enumerate`/`zip` 是 Pythonic 必杀技；
- 循环 else 在"没被 break"时执行；多重赋值 `a, b = b, a` 免临时变量；
- 遍历中删元素是 Python 版经典 bug，用推导式过滤。

## 练习 3

1.（概念）`range(1, 10, 2)` 依次产生哪些数？`range(5)` 呢？
2.（编程）读入 n，输出 1~n 中所有能被 3 整除但不能被 5 整除的数。
3.（编程）求斐波那契数列第 30 项（循环版）。
4.（编程）打印 n 层星号金字塔（n=3 时同前两套教程）。
5.（编程）读入若干整数（输入 q 结束），输出个数、总和、最大、最小（不使用列表）。

## 参考答案

**1.** `1, 3, 5, 7, 9`（步长 2，不含 10）；`range(5)` → `0 1 2 3 4`。

**2.**

```python
n = int(input())
for i in range(1, n + 1):
    if i % 3 == 0 and i % 5 != 0:
        print(i, end=" ")
print()
```

**3.**

```python
a, b = 1, 1
for _ in range(28):          # _ 是“我不打算用这个变量”的约定名
    a, b = b, a + b
print(b)                     # 832040
```

**4.**

```python
n = int(input())
for i in range(1, n + 1):
    print(" " * (n - i) + "*" * (2 * i - 1))     # 字符串乘法：直接生成重复
```

**5.**

```python
count = total = 0
mx, mn = None, None
while True:
    s = input("数字（q 结束）：")
    if s == "q":
        break
    x = int(s)
    count += 1
    total += x
    mx = x if mx is None else max(mx, x)
    mn = x if mn is None else min(mn, x)
print(f"个数 {count} 总和 {total} 最大 {mx} 最小 {mn}")
```

**[▲ 返回目录](#toc)**

---

<a id="p04"></a>

# 第 4 章 函数与作用域

> 本章目标：定义与调用函数、返回多个值、默认参数陷阱（全书著名大坑）、*args/**kwargs、lambda、递归与作用域规则。

---

## 4.1 定义函数

```python
def add(a, b):            # def 函数名(参数): 
    """返回两数之和。"""      # docstring：第一行的三引号字符串，help() 读的就是它
    return a + b

result = add(3, 7)        # 10
```

要点：

- `def` 定义、冒号 + 缩进成块（与 if 同款语法）；
- `return` 返回值并**立刻结束**函数；不写 return 或裸 `return`，返回 **None**；
- **蛇形命名**：`get_max`、`is_prime`、`calc_total`；
- docstring（函数体第一行的三引号字符串）是函数的说明书：`help(add)` 能直接打印——第 1 章的伏笔在此收回，给自己写的函数也养成写一行 docstring 的习惯。

**Python 函数是"一等公民"**：函数可以像值一样赋给变量、装进列表、当参数传来传去——这是第 8 章装饰器的基础，先留印象：

```python
f = add          # f 是同一个函数的另一个名字（贴标签！）
print(f(1, 2))   # 3
```

## 4.2 参数的四种形态

### 位置参数与关键字参数

```python
def greet(name, greeting):
    print(f"{greeting}，{name}！")

greet("张三", "你好")              # 位置参数：按顺序对号
greet(greeting="早", name="李四")   # 关键字参数：指名道姓，顺序随便
greet("王五", greeting="晚安")      # 混用：位置在前，关键字在后
```

### 默认参数：给参数一个出厂值

```python
def greet(name, greeting="你好"):
    print(f"{greeting}，{name}！")

greet("张三")                 # 你好，张三！
greet("张三", "早上好")        # 早上好，张三！
```

规则：**有默认值的参数必须排在无默认值参数之后**（否则解释器无法对号）。

### ⚠️ 默认参数陷阱（全书著名大坑）

默认值在**函数定义时求值一次**，之后所有调用**共享同一个默认对象**——默认值是可变对象时，灾难降临：

```python
def add_item(item, items=[]):        # 坏！所有调用共享同一个列表
    items.append(item)
    return items

print(add_item(1))      # [1]
print(add_item(2))      # [1, 2]  ← “2”？上次那个列表还在！
print(add_item(3))      # [1, 2, 3]
```

```
定义时：items=[] 被求值一次，成为函数对象的一部分
每次调用：不传就复用这“同一个”列表 → 上次的修改全部保留
```

**铁律：默认参数永远用不可变值；需要"空容器"时用 None 哨兵**：

```python
def add_item(item, items=None):
    if items is None:
        items = []            # 每次调用现场新建
    items.append(item)
    return items
```

这个坑在 Python 面试出现率接近 100%，实际项目里也是真实事故源——**现在就刻进肌肉记忆**。

### *args 与 **kwargs：不定个数参数

```python
def demo(*args, **kwargs):
    print(args)        # 元组：收下所有“多余的位置参数”
    print(kwargs)      # 字典：收下所有“多余的关键字参数”

demo(1, 2, 3, x=10, y=20)
# (1, 2, 3)
# {'x': 10, 'y': 20}
```

读法：参数名前加 `*` 是"打包"——把散装实参收进元组/字典。反向也能用：调用时 `*` 是"解包"：

```python
def add(a, b, c):
    return a + b + c

nums = [1, 2, 3]
add(*nums)              # 等价 add(1, 2, 3) —— 列表解包成三个参数
config = {"a": 1, "b": 2, "c": 3}
add(**config)           # 字典解包成关键字参数
```

`*打包/解包` 这套符号在赋值、函数、装饰器里到处出现，记住口诀：**定义处是打包，调用处是解包**。

## 4.3 返回多个值

Python 函数天然能"返回多个值"——其实是打包成元组再解包：

```python
def min_max(nums):
    return min(nums), max(nums)       # 打包成 (最小, 最大)

lo, hi = min_max([3, 1, 9])           # 解包接收
print(lo, hi)                          # 1 9
```

对照 C（要靠指针参数带出）和 Java（要造 record），Python 一行搞定——"返回元组 + 解包"是 Python 函数设计的日常。

## 4.4 作用域：LEGB 规则

变量查找顺序：**L**ocal（函数内）→ **E**nclosing（外层函数）→ **G**lobal（模块级）→ **B**uilt-in（内置名如 print）。

```python
x = "全局"

def outer():
    x = "外层"            # E
    def inner():
        print(x)          # 找不到局部 → 往外层找到 “外层”
    inner()

outer()                    # 外层
```

三条规矩：

1. 函数内**读**外部变量：随便读（顺着 LEGB 找）；
2. 函数内**改**全局变量：必须先声明 `global x`（否则你只是新建了个局部变量，全局纹丝不动）：

```python
count = 0
def bump():
    global count           # 不写这行，count = 1 会新建局部变量
    count += 1
```

3. **能不 global 就不 global**——全局可变状态是 bug 温床（与 C/Java 教程同一结论），数据用参数进出，状态装进类（第 7 章）。

### 高阶函数与闭包：函数当值的两个进阶用法

**用法一：map/filter——把函数当零件喂给流水线**：

```python
nums = [1, 2, 3, 4, 5]

list(map(str, nums))                     # ['1', '2', '3', '4', '5']：对每个元素应用函数
list(filter(lambda x: x % 2, nums))      # [1, 3, 5]：留下返回真的元素
```

但现代 Python 更推荐**推导式**完成同样的事（`[str(x) for x in nums]`、`[x for x in nums if x % 2]`）——map/filter 主要是**读老代码**和配合现成函数（`map(str, nums)` 比 `[str(x) for x in nums]` 更直白）时用。

**用法二：闭包——内层函数记住外层的变量**：

```python
def make_adder(n):
    def add(x):
        return x + n          # add 记住了 make_adder 的 n（LEGB 的 E 层）
    return add

add10 = make_adder(10)
add100 = make_adder(100)
print(add10(5))               # 15
print(add100(5))              # 105 —— 两次调用各自记着各自的 n
```

`make_adder` 返回后它的栈帧早该销毁，但 add 还引用着 n——Python 把被引用的变量**封存在闭包里**随身携带。这是"工厂函数"模式：同一套逻辑，配上不同的参数出厂。第 8 章装饰器（`timer(func)` 记住 func）就是闭包的直接应用——**先懂闭包，装饰器只剩语法糖**。

### 函数注解与文档的完整版

第 2 章的类型注解 + 第 4 章 docstring，正式函数的标准模样：

```python
def grade(score: float, weights: dict[str, float] | None = None) -> str:
    """按分数给等级：>=90 优，>=80 良，>=60 及格，其余不及格。

    Args:
        score: 0~100 的分数。
        weights: 可选的加权配置，键为科目名。
    Returns:
        等级字符串。
    """
    if score >= 90:
        return "优"
    ...
```

Google 风格 docstring（Args/Returns 分节）是业界主流之一。签名注解 + docstring + 具体异常，就是 Python 的"接口合同"——对照 Java 教程的 javadoc，思想完全一致。

## 4.5 lambda：一行匿名函数

```python
square = lambda x: x ** 2       # 定义：lambda 参数: 表达式（只能一个表达式）
print(square(5))                # 25
```

lambda 本体只能写**一个表达式**（不能 if 语句、不能循环语句），主要用途是**当参数传给高阶函数**：

```python
nums = [3, 1, 4, 1, 5]

nums.sort(key=lambda x: -x)          # 按负值排 = 降序
print(nums)                          # [5, 4, 3, 1, 1]

pairs = [("a", 3), ("b", 1)]
pairs.sort(key=lambda p: p[1])       # 按元组第二个元素排
```

`sorted/list.sort` 的 `key` 参数是 lambda 的头号舞台。PEP 8 建议：能给函数起名字就 `def`，别把复杂 lambda 赋值给变量——lambda 只做"顺手传个规则"。

### global 的完整语义与 nonlocal

改全局变量要 `global`，改**外层函数**的变量要 `nonlocal`（3.x 引入，闭包场景）：

```python
def counter():
    count = 0
    def inc():
        nonlocal count        # 没有它，count = count + 1 会把 count 当局部变量 → UnboundLocalError
        count += 1
        return count
    return inc

c = counter()
c(); c()                       # 1, 2 —— count 封存在闭包里被 inc 持续修改
```

global 与 nonlocal 的统一语义：**声明"这个名字不是本层新建的，请到外层找"**。多数场景下更好的替代品是"把状态装进对象"（第 7 章）或"用返回值流动"——闭包计数器这种"函数带记忆"的写法，在装饰器（第 8 章 count_calls）里你会看到工业级版本。

## 4.6 递归

```python
def fact(n):
    """n 的阶乘。n <= 1 时返回 1。"""
    if n <= 1:                 # 出口
        return 1
    return n * fact(n - 1)     # 缩小

print(fact(10))    # 3628800
```

两板斧（出口 + 缩小）与 C/Java 相同。**Python 特有约束：默认递归深度约 1000 层**（`sys.setrecursionlimit` 可调但不建议），深度递归超限抛 `RecursionError`——所以 Python 圈子的惯例是：能用循环就用循环，递归留给天然树状问题（目录遍历、JSON 解析）。

汉诺塔三行照旧优雅：

```python
def hanoi(n, a, b, c):
    if n == 0:
        return
    hanoi(n - 1, a, c, b)
    print(f"{a} -> {c}")
    hanoi(n - 1, b, a, c)
```

### *args/**kwargs 的实战三连

打包解包的符号在真实代码里的三个高频落点：

```python
# ① 转发参数：包装函数把收到的参数原样传给内层（装饰器的命脉，第 8 章）
def logged(func):
    def wrapper(*args, **kwargs):          # 收下一切
        print("调用", func.__name__, args, kwargs)
        return func(*args, **kwargs)       # 原样转发
    return wrapper

# ② 合并配置：默认配置被调用者覆盖
DEFAULT = {"timeout": 10, "retries": 3}
def request(url, **options):
    config = {**DEFAULT, **options}        # 字典合并：options 优先
    return config                          # request("x", timeout=30) → timeout=30

# ③ 元组/字典在调用点的展开
print(*[1, 2, 3], sep=" -> ")              # 1 -> 2 -> 3（列表摊开成三个位置参数）
config = {"end": "\n\n"}
print("done", **config)                    # end 参数从字典注入
```

一个命名约定要说清：`args/kwargs` 只是**惯用名**，语法本体是 `*` 和 `**`——`def demo(*values, **options)` 同样合法。读懂第三方库源码的关键一步就是认出"这里是转发不是消费"：看到 `func(*args, **kwargs)` 就知道这个壳子只是中转。

## 4.7 函数设计五原则（语言无关，再贴一遍）

1. 一函数一事；2. 一屏以内；3. 参数 ≤ 4 个（多了打包成 dict/dataclass）；4. 先定签名（含类型注解，第 9 章）再写实现；5. 非法输入尽早抛异常（fail fast，第 10 章）。再加一条 Python 特有：**docstring 至少一行**，说明函数干什么。

## 4.8 小结

- def + 冒号缩进；return None；函数是值，可以传来传去；
- 默认值**定义时求值一次**——可变默认参数是全书大坑，None 哨兵解法背下来；
- `*args/**kwargs` 定义处打包、调用处解包；函数可返回元组多值；
- LEGB 作用域；改全局要 global，但尽量别 global；
- lambda = 单表达式匿名函数，主战场是 sort 的 key；递归默认深度约 1000 层。

## 练习 4

1.（概念）为什么 `def f(x, items=[])` 是危险的？正确写法？
2.（概念）`def f(*args)` 内 `args` 是什么类型？`f(*[1,2,3])` 调用时发生了什么？
3.（编程）写函数 `def stats(nums)` 返回 `(总和, 平均, 最大, 最小)`，main 中解包验证。
4.（编程）用 `sorted + lambda` 把 `students = [("张三",90),("李四",66),("王五",95)]` 按分数降序输出。
5.（编程）递归实现 `def sum_digits(n)`：各位数字之和。

## 参考答案

**1.** 默认值在定义时求值一次，后续调用共享同一个列表对象，上次 append 的内容会"泄漏"到下次调用。正确：`def f(x, items=None): if items is None: items = []`。

**2.** 元组 tuple。调用时 `*` 把列表**解包**成三个独立的位置参数，args 又把它们**打包**回元组 `(1,2,3)`。

**3.**

```python
def stats(nums):
    return sum(nums), sum(nums) / len(nums), max(nums), min(nums)

total, avg, mx, mn = stats([3, 1, 4, 1, 5])
print(total, avg, mx, mn)      # 14 2.8 5 1
```

**4.**

```python
for name, score in sorted(students, key=lambda s: s[1], reverse=True):
    print(name, score)
```

**5.**

```python
def sum_digits(n):
    if n < 10:
        return n
    return n % 10 + sum_digits(n // 10)
```

**[▲ 返回目录](#toc)**

---

<a id="p05"></a>

# 第 5 章 四大容器：list、tuple、dict、set

> 本章目标：玩转 Python 的四大容器与切片；用推导式一行顶十行；理解浅拷贝深拷贝；避开遍历删除陷阱。**这是 Python 日常代码出场率最高的一章。**

---

## 5.1 list：可变的有序列表

```python
nums = [10, 20, 30, 40, 50]      # 方括号字面量
mixed = [1, "two", 3.0, [4, 5]]  # 元素类型随意（还能嵌套）

nums.append(60)                   # 尾部追加
nums.insert(0, 5)                 # 指定位置插入（O(n)，慎用）
nums.extend([70, 80])             # 合并另一个列表
nums.remove(30)                   # 按值删（第一次出现的；不存在抛 ValueError）
last = nums.pop()                 # 弹出末尾并返回；pop(0) 弹头部
nums[0] = 99                      # 按下标改
len(nums)                         # 长度
10 in nums                        # 成员判断 → True/False（O(n)，dict/set 才是 O(1)）
nums.index(20)                    # 查下标
nums.count(99)                    # 出现次数
nums.sort()                       # 原地升序；sort(reverse=True) 降序
sorted(nums)                      # 不动原列表，返回新列表
nums.reverse()                    # 原地反转
```

list 是**可变**对象（第 2 章阵营表），所有方法都是原地操作——**注意大部分方法返回 None**！`nums = nums.sort()` 是新手经典错误（sort 原地排完返回 None，你把 None 贴给了 nums）。要新列表用 `sorted()`。

### 切片：Python 的招牌刀法

`序列[start:stop:step]`，左闭右开，三个都可省：

```python
nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

nums[2:5]      # [2, 3, 4]        下标 2~4
nums[:3]       # [0, 1, 2]        开头到下标 2
nums[7:]       # [7, 8, 9]        下标 7 到末尾
nums[-3:]      # [7, 8, 9]        负下标：倒数第 3 个到最后（-1 是最后一个！）
nums[::2]      # [0, 2, 4, 6, 8]  每 2 个取一个
nums[::-1]     # [9, 8, ..., 0]   步长 -1 = 反转（面试爱问）
nums[:]        # 浅拷贝一份
```

**负下标与切片**是 Python 独有的糖：`s[-1]` 取最后元素、`nums[::-1]` 反转、`nums[:3]` 前三个——熟练后代码又短又读得懂。切片越界**不报错**（自动截断），单下标越界才抛 IndexError。

### 遍历与枚举

```python
for x in nums: print(x)                    # 只要值
for i, x in enumerate(nums): print(i, x)   # 要下标+值（第 3 章）
```

## 5.2 tuple：不可变的序列

```python
point = (3, 4)               # 圆括号（其实逗号才是本体：point = 3, 4 也行）
single = (42,)               # 单元素元组必须带逗号！(42) 只是数字 42
x, y = point                 # 解包（第 4 章）
a, *rest = [1, 2, 3, 4]      # 星号解包：a=1, rest=[2,3,4]
```

tuple 是 list 的**不可变**兄弟：不能 append/remove/改下标。什么时候用：坐标、配置常量、字典的键（可变对象不能当键）、函数多返回值。口诀：**会变的用 list，定死的用 tuple**。

元组解包无处不在——遍历字典、`enumerate`、`zip` 返回的都是元组，解包语法让它们用起来像"多个变量"。

## 5.3 dict：键值对字典（Python 的心脏）

```python
scores = {"张三": 90, "李四": 66}

scores["王五"] = 95            # 增/改（键存在则覆盖）
scores["张三"]                 # 取：90；键不存在抛 KeyError
scores.get("赵六")             # None（不抛错）
scores.get("赵六", 0)          # 给默认值 0 —— get 是防 KeyError 的日常姿势
"李四" in scores               # 判断键存在（查的是键不是值）
del scores["李四"]             # 删除
scores.pop("王五")             # 删除并返回值
list(scores.keys())            # 所有键；.values() 所有值
scores.items()                 # [(键, 值), ...] 可迭代
```

### 遍历的三种姿势

```python
for k in scores:                        # 默认遍历键
    print(k)
for v in scores.values():
    print(v)
for k, v in scores.items():             # 最常用：键值一起拿
    print(f"{k}: {v}")
```

### 三个高频方法

```python
scores.setdefault("钱七", []).append(90)   # 键没有则先建默认值再操作
scores.update({"孙八": 88})                 # 批量更新（另一个 dict）
# setdefault 的经典用途：分组
groups = {}
for name, cls in [("张三","A"),("李四","B"),("王五","A")]:
    groups.setdefault(cls, []).append(name)
# {'A': ['张三', '王五'], 'B': ['李四']}
```

**dict 键必须不可变**（str/int/tuple 都行，list 不行）——因为 dict 靠键的哈希值定位（Java 教程 HashMap 的同款原理），键一变哈希就失效。3.7+ 的 dict 保持插入顺序（放心按序遍历）。

### 词频统计（经典应用）

```python
text = "to be or not to be"
freq = {}
for w in text.split():
    freq[w] = freq.get(w, 0) + 1     # 有则+1，无则从 0 起步
print(freq)    # {'to': 2, 'be': 2, 'or': 1, 'not': 1}
```

### dict 的哈希原理初探（对照 Java 的 HashMap）

dict 为什么 `in`/取值都是 O(1)？——和 Java 教程的 HashMap 同一套机制：**哈希表**。

```
存入 d["张三"] = 90：
  1. hash("张三") 算出哈希值 → 映射到内部数组的某个槽位
  2. 值 90 存进那个槽
查询 d["张三"]：
  同样算哈希 → 直达槽位 → 取出 90（不用挨个比对）
```

由此解释三条此前的规矩：① **键必须不可变**（list 变了 hash 就变，槽位对不上，对象"失踪"——Java 教程"可变键自残"同款）；② **键内容相等则视为同一键**（哈希相同 + `==` 验证，所以 str/int/元组都行）；③ dict 无序（3.7 前严格无序，3.7+ 保证插入序但机制仍是哈希）。set 是"只有键没有值"的 dict——同一个哈希机制，所以 set 元素也必须不可变。

对照记忆：C 教程没有内置哈希表（要手写）；Java 的 HashMap 是类库；Python 的 dict 是**语言内置字面量**——三套教程走到这里都在教同一个数据结构，只是逼你遇见它的方式不同。哈希冲突怎么解决（拉链法）、什么时候退化成 O(n)，属于面试深化话题，入门记住"原理 = 哈希直达"即可。

## 5.4 set：去重与集合运算

```python
s = {1, 2, 3}                    # 花括号（只有值）；空集合必须 set()——{} 是空 dict！
s.add(4); s.discard(99)          # 增删（discard 不存在不报错，remove 会报）
empty = set()                    # 空集合

{1, 2, 3} | {3, 4}               # 并集 {1, 2, 3, 4}
{1, 2, 3} & {2, 3, 4}            # 交集 {2, 3}
{1, 2, 3} - {2}                  # 差集 {1, 3}
2 in s                            # 成员判断 O(1)——比 list 的 O(n) 快得多

set([1, 1, 2, 3, 3])             # {1, 2, 3} —— 去重神器
```

去重是 set 的头号用途：`list(set(items))` 一行去重（无序，要保序见练习）。

### sorted 的 key 参数与排序稳定性

`sorted/list.sort` 的 `key` 是排序的灵魂——"按什么排"由 key 函数决定：

```python
students = [("张三", 90), ("李四", 66), ("王五", 90)]

sorted(students, key=lambda s: s[1])                    # 按分数升序
sorted(students, key=lambda s: s[1], reverse=True)      # 降序
sorted(students, key=lambda s: (-s[1], s[0]))           # 分数降序，同分按姓名升序
words = ["banana", "Apple", "cherry"]
sorted(words, key=str.lower)                            # 忽略大小写排序
```

**排序稳定性**：Python 的排序是稳定排序——key 相同的元素保持原有相对顺序。利用它可以"多轮排序"：先按次要条件排、再按主要条件排，稳定性能让次要条件自动生效（等于实现多字段排序）。

```python
data = [...]
data = sorted(data, key=lambda r: r["dept"])       # 第一轮：按部门
data = sorted(data, key=lambda r: -r["score"])     # 第二轮：按分数降序（部门顺序保留）
```

另一个日常利器：`max/min` 也支持 key——`max(students, key=lambda s: s[1])` 直接拿到分数最高的学生**整个元组**，不用手动找下标。

### 遍历字典与视图对象

`d.keys()/values()/items()` 返回的是**视图**：动态反映字典变化，且支持集合运算：

```python
d = {"a": 1, "b": 2}
ks = d.keys()
d["c"] = 3
print(list(ks))                    # ['a', 'b', 'c'] —— 视图跟着变
print(d.keys() & {"a", "z"})       # {'a'} —— 键视图能做交集（对照 set）

# 遍历时安全修改的正确姿势：遍历副本，修改本体
for k in list(d):
    if d[k] < 2:
        del d[k]
```

最后一行是 Python 版"遍历中删除"的标准解法（对照 Java 教程的 `removeIf` 思想：**遍历与修改分离**）。

## 5.5 推导式：一行顶十行

**列表推导式**是 Python 最有辨识度的语法——"从旧序列按规则造新序列"：

```python
nums = [1, 2, 3, 4, 5, 6]

squares = [x ** 2 for x in nums]               # [1, 4, 9, 16, 25, 36]
evens = [x for x in nums if x % 2 == 0]        # 带过滤 [2, 4, 6]
labels = [f"第{i}名" for i in range(1, 4)]      # 表达式随便写

# 嵌套：矩阵转置
matrix = [[1, 2, 3], [4, 5, 6]]
transposed = [[row[j] for row in matrix] for j in range(3)]
# [[1, 4], [2, 5], [3, 6]]
```

同族还有字典/集合推导式：

```python
freq = {w: len(w) for w in ["hello", "hi"]}    # {'hello': 5, 'hi': 2}
unique = {x % 3 for x in range(10)}            # {0, 1, 2}
```

**何时用推导式 vs 普通 for**：转换+过滤这种"一个表达式说得清"的用推导式；有复杂逻辑（多行、副作用）用普通 for。推导式塞太多层反而难读——PEP 8 的忠告：**复杂就拆开，可读性优先**。

遍历删除的经典 bug，推导式一行修复（第 3 章埋的雷）：

```python
items = [1, 2, 3, 4, 5, 6]
items = [x for x in items if x % 2]     # 只留奇数：过滤生成新列表，安全
```

### 嵌套结构操作：JSON 风格数据的取改删

真实数据（API 响应、配置文件）长这样——list 套 dict 套 list 的嵌套体。学会在嵌套结构里"穿隧道"是现代开发的日常功：

```python
school = {
    "name": "实验中学",
    "classes": [
        {"name": "一班", "students": [
            {"name": "张三", "scores": {"math": 90, "eng": 85}},
            {"name": "李四", "scores": {"math": 66, "eng": 72}},
        ]},
        {"name": "二班", "students": [
            {"name": "王五", "scores": {"math": 95, "eng": 92}},
        ]},
    ],
}

# 取：一层层下标，链式穿隧道
school["classes"][0]["students"][1]["scores"]["math"]     # 66
school["classes"][0]["students"][1].get("scores", {}).get("math", 0)  # 防御版：任一层缺失回 0

# 改：穿到最深处赋值
school["classes"][1]["students"][0]["scores"]["eng"] = 98

# 遍历聚合：双层推导式 + sum
all_math = [stu["scores"]["math"]
            for cls in school["classes"]
            for stu in cls["students"]]
print(sum(all_math) / len(all_math))        # 全校数学平均分

# 删：按条件删嵌套列表里的元素
for cls in school["classes"]:
    cls["students"] = [s for s in cls["students"]
                       if s["scores"]["math"] >= 60]     # 掉队者移除
```

三条经验：① **取深层数据用 .get 链**（`d.get("a", {}).get("b")`）——API 响应缺字段是常态，KeyError 一次就能教会你；② 嵌套层级超过四层说明数据形状该重新设计了（拆表/拍平）；③ 想打印看结构用 `json.dumps(school, ensure_ascii=False, indent=2)`（第 10 章），比 print 直观十倍。

对照：这套"穿隧道"功夫在 Java 教程对应 Map/List 嵌套（第 9 章），在爬虫解析 JSON API（第 11 章）与 FastAPI 响应构造（第 12 章）里天天见。

## 5.6 浅拷贝与深拷贝

第 2 章说过 `b = a` 只是贴标签。想复制，还有深浅之分：

```python
import copy
a = [1, [2, 3]]

b = a.copy()          # 浅拷贝：外壳新列表，但内层 [2,3] 还是共享引用
c = copy.deepcopy(a)  # 深拷贝：连内层都复制

b[0] = 99             # b 独有的外壳 → a 不受影响
b[1].append(4)        # 改的是共享的内层 → a[1] 也变成 [2,3,4]！
print(a)              # [1, [2, 3, 4]] —— “灵异现象”其实是浅拷贝
print(a == b)
```

```
浅拷贝后：
a ──┐                a[1] ──┐
    ├──▶ [1, ·]             ├──▶ [2, 3, 4]     ← 内层仍共享
b ──┘                b[1] ──┘
```

守则：**一维列表 `a.copy()` 够用；嵌套结构（列表套列表/字典套字典）必须 deepcopy**——否则就是上面这种"查一小时最后发现是浅拷贝"的 bug。

### 容器的性能画像：为什么选对容器就是优化

四种容器的核心操作复杂度（大 O），一表定乾坤：

| 操作              | list     | dict        | set      | 说明                |
| ----------------- | -------- | ----------- | -------- | ------------------- |
| 按下标取          | O(1)     | —           | —        | list 的主场         |
| 按值查找 `x in c` | **O(n)** | O(1)（键）  | **O(1)** | 差 100 万倍的分水岭 |
| 插入/删除（中部） | O(n)     | O(1)        | O(1)     | list 要挪后面一排   |
| 保持顺序          | 插入序   | 3.7+ 插入序 | 无序     |                     |

结论极其实用：**频繁 `in` 判断的集合，从 list 换成 set**。实测感受一下差距：

```python
import time

big_list = list(range(100_000))
big_set = set(big_list)

t = time.time()
for _ in range(1000):
    99_999 in big_list          # 平均要扫一半：O(n)
print(f"list: {time.time() - t:.3f}s")    # 约 2.5s

t = time.time()
for _ in range(1000):
    99_999 in big_set           # 哈希直达：O(1)
print(f"set:  {time.time() - t:.3f}s")    # 约 0.00004s —— 快五万倍
```

这不是算法竞赛的屠龙技——爬虫里"已见过的 URL 集合"、去重判断、黑名单检查，全是 `in` 高频场景。**数据结构选对，比任何微优化都值钱**（对照 C 教程"枚举边界值十秒思考"：性能意识是通识，不是玄学）。

## 5.7 容器选型速查

| 需求               | 用    | 例                 |
| ------------------ | ----- | ------------------ |
| 有序、可变、可重复 | list  | 待办清单、日志行   |
| 固定结构、不可变   | tuple | 坐标、函数多返回值 |
| 键查值             | dict  | 电话簿、配置、计数 |
| 去重、成员判断     | set   | 黑名单、已见 ID    |

## 5.8 小结

- list 可变有序（方法原地、返回 None 是坑）；切片左闭右开、负下标、`[::-1]` 反转；
- tuple 不可变（单元素带逗号），解包无处不在；dict 键必须不可变；
- dict：`get(k, 默认)` 防 KeyError、`setdefault` 分组、items() 遍历；
- set 去重 + O(1) 成员判断；推导式一行完成转换过滤；
- 浅拷贝共享内层，嵌套结构必须 deepcopy。

## 练习 5

1.（概念）`nums = [1,2,3]; nums2 = nums; nums2.append(4)` 后 nums 是什么？如何真正复制？
2.（概念）`{}` 和 `set()` 有什么区别？为什么列表不能当字典的键？
3.（编程）统计字符串 `"hello python hello world"` 中每个单词出现次数，输出出现 ≥2 次的词。
4.（编程）读入一行数字（空格分隔），输出去重后的升序列表和降序列表（各一行）。
5.（编程）用推导式生成 100 以内所有"平方数"（1,4,9,...,100），并求它们的和。

## 参考答案

**1.** nums 变 `[1,2,3,4]`（同一对象）。复制：`nums.copy()`（一维够用）或 `copy.deepcopy(nums)`（嵌套必需）。

**2.** `{}` 是空**字典**，`set()` 才是空集合。列表可变——内容变了哈希值就变，dict 无法再定位它（对照 Java 教程"可变键自残"）。

**3.**

```python
text = "hello python hello world"
freq = {}
for w in text.split():
    freq[w] = freq.get(w, 0) + 1
for w, c in freq.items():
    if c >= 2:
        print(w, c)          # hello 2
```

**4.**

```python
nums = list(map(int, input().split()))
uniq = sorted(set(nums))
print(uniq)
print(uniq[::-1])
```

**5.**

```python
squares = [x ** 2 for x in range(1, 11)]
print(squares)                 # [1, 4, 9, ..., 100]
print(sum(squares))            # 385
```

**[▲ 返回目录](#toc)**

---

<a id="p06"></a>

# 第 6 章 字符串与正则

> 本章目标：吃透 str 的不可变与常用方法；理解字符编码；用 re 模块做模式匹配。字符串是文本处理（爬虫、日志、配置）的原料，这一章是实操密度最高的一章。

---

## 6.1 字符串的四种写法

```python
s1 = "hello"            # 双引号
s2 = 'world'            # 单引号（完全等价，选一种坚持用）
s3 = "他说:\"你好\""      # 反斜杠转义
s4 = 'C:\new\test'      # 坑！\n 被转义成换行符
s5 = r'C:\new\test'     # r 前缀 = 原始字符串，反斜杠不转义（Windows 路径/正则必备）
```

**三引号**多行文本（第 1 章预告的 docstring 同款语法）：

```python
html = """
<html>
  <body>hello</body>
</html>
"""
```

**f-string** 嵌入变量（第 2 章讲过，字符串任务的默认选择）：

```python
name, score = "张三", 90.5
msg = f"{name} 得了 {score:.1f} 分"
```

## 6.2 不可变与方法全家桶

str 是不可变类型：`s.upper()` **不改变 s**，而是**返回新字符串**——与 list 的原地方法截然不同（第 5 章的老朋友）。所有方法都遵循这条规则。

```python
s = "  Hello, Python  "

s.strip()                # 'Hello, Python'   去两端空白（lstrip/rstrip 单边）
s.lower()                # '  hello, python  '  转小写（返回新串）
s.upper()                # '  HELLO, PYTHON  '  转大写
s.replace("l", "L")      # 'HeLLo, Python'   全部替换
s.startswith("  He")     # True              前缀判断
s.endswith("on  ")       # True
"Py" in s                # True              子串判断（in 运算符）
s.index("Python")        # 找不到抛 ValueError；s.find("xx") 找不到返回 -1
s.count("l")             # 3
len(s)                   # 17                长度是内置函数，不是方法
"42".zfill(5)            # '00042'           补零
"abc".center(10, "-")    # '---abc----'      居中填充
```

### split 与 join：文本处理的黄金搭档

```python
line = "张三,90,男"
parts = line.split(",")              # ['张三', '90', '男'] —— 拆成列表
csv = "|".join(parts)                # '张三|90|男' —— 列表拼回字符串

"  a  b  ".split()                   # ['a', 'b'] —— 无参数版：按任意空白拆（最常用）
```

**split + 处理 + join** 是文本加工的万能三段式，第 11 章的批处理脚本全程用它。注意 `join` 的调用者是**分隔符字符串**，参数是字符串列表（元素必须是 str，混入 int 会 TypeError，先 map(str, ...)）。

### 判断类方法（返回 bool）

```python
"123".isdigit()        # True   全数字
"abc".isalpha()        # True   全字母
"abc123".isalnum()     # True   字母数字
"  ".isspace()         # True   全空白
"Hello".istitle()      # True   首字母大写风格
```

## 6.3 下标、切片与遍历

字符串是序列，list 的下标/切片语法全部适用（不可变——切片产生新串）：

```python
s = "Python"
s[0]          # 'P'
s[-1]         # 'n'    最后一个
s[1:4]        # 'yth'
s[::-1]       # 'nohtyP'  反转
for ch in s: print(ch)     # 逐字符遍历
```

### 字符串常用操作自测十连（REPL 里全试一遍）

本章闭卷自测——每条先心算答案再进 REPL 验证（答案附后）：

```
>>> "python"[1:4]
>>> "hello world".title()
>>> "abc".rjust(6, "*")
>>> "5".zfill(3)
>>> "a,b,,c".split(",")
>>> "-".join(["2026", "11", "17"])
>>> "  hi  ".strip().upper()
>>> "banana".count("an")
>>> "42" + str(8)
>>> f"{3.14159:.1f}"
```

答案：`yth`；`Hello World`（每个单词首字母大写）；`***abc`；`005`；`['a', 'b', '', 'c']`（空字段保留——和想当然的"自动跳过"不同，按空白拆才会跳）；`2026-11-17`；`HI`；`2`；`428`；`3.1`。

十连全对，第 6 章语法层毕业；错三条以上，回到 6.2 节方法全家桶重读一遍。这类"心算 + 验证"的自测法比重读正文高效得多——**输出在你脑中的第一版本，决定你写代码时的第一版本**。

## 6.4 字符编码：把"乱码"一次讲清

计算机只认字节。**字符 ↔ 字节**的翻译表就是编码。三位主角：

- **ASCII**：128 个英文字符，1 字节；
- **GBK**：中文 Windows 传统编码，汉字 2 字节；
- **UTF-8**：Unicode 的主流编码（英文 1 字节、汉字 3 字节），**互联网事实标准**。

同一个"中"字，GBK 编码是字节 `D6 D0`，UTF-8 是 `E4 B8 AD`。**用 A 编码写入、按 B 编码读取 = 乱码**（数据没坏，只是翻译本拿错了）。

```python
s = "中"
s.encode("utf-8")        # b'\xe4\xb8\xad'  编码：str → bytes
s.encode("gbk")          # b'\xd6\xd0'
b"\xe4\xb8\xad".decode("utf-8")   # '中'   解码：bytes → str（解码本错了就乱码）
```

认识 **bytes 类型**（字节串）：`b"..."` 字面量，网络传输、文件二进制读写的原生形态，`decode()` 转回 str 才好处理。

Python 3 的 str 默认就是 Unicode，**源文件默认 UTF-8**——日常写代码几乎遇不到编码问题；乱码只出现在"读别人家的文件/网页"时，解法：先弄清对方编码再 decode（第 10 章读写文件时配合 `encoding=` 参数）。

### 格式规格迷你语言：f-string 的完整火力

f-string 花括号里 `{值:规格}` 的"规格"是一门迷你语言，常用就这六招：

```python
pi = 3.14159265
n = 1234567
name = "py"

f"{pi:.3f}"          # '3.142'        小数位
f"{n:>10,}"          # ' 1,234,567'   右对齐 + 千分位
f"{name:<8}|"        # 'py      |'    左对齐占 8
f"{name:^10}"        # '    py    '   居中
f"{255:x}"           # 'ff'           十六进制（b 二进制 / o 八进制）
f"{0.856:.1%}"       # '85.6%'        百分比（自动 ×100）
f"{'张三':*^8}"      # '***张三***'    填充字符可自定义
```

老式 `%` 格式化（`"%s=%d" % (k, v)`）在老代码里常见，认识即可；**新代码 f-string 一统天下**，规格语言和 C 的 printf 同源（`%f`→`.2f` 的谱系），学一次两边通用。

### 文本清洗流水线（实战小模板）

处理脏文本（用户输入/爬来的网页）的标准三段式，split/join/strip/正则各司其职：

```python
import re

def clean_line(raw: str) -> str:
    s = raw.strip()                          # ① 去首尾空白
    s = re.sub(r"\s+", " ", s)               # ② 多个空白压成一个空格
    s = re.sub(r"[^\w\u4e00-\u9fff，。]", "", s)   # ③ 只留单词/中文/常用标点
    return s

print(clean_line("  hello   world !! 你好，世界。 "))
# 'hello world 你好，世界。'
```

`\u4e00-\u9fff` 是 CJK 统一汉字的码位区间——正则里直接用 Unicode 范围匹配中文。这三步流水线在第 11 章爬虫清洗、第 12 章 API 入参规范化里都会原样复用。

## 6.5 正则表达式：re 模块

正则 = 用一串符号**描述文本的形状**。先背核心符号表：

| 符号      | 含义                | 示例                 |
| --------- | ------------------- | -------------------- |
| `\d`      | 一个数字            | `\d\d` 两位数字      |
| `\w`      | 字母/数字/下划线    | `\w\w` 两个字符      |
| `\s`      | 空白                |                      |
| `.`       | 任意一个字符        |                      |
| `+`       | 前面的重复 1 次以上 | `\d+` 数字串         |
| `*`       | 重复 0 次以上       |                      |
| `?`       | 0 或 1 次           |                      |
| `{m,n}`   | 重复 m~n 次         | `\d{3}` 恰好 3 位    |
| `[abc]`   | 字符集合任选一      | `[aeiou]` 元音       |
| `^` / `$` | 串首 / 串尾         | `^\d+$` 整串都是数字 |
| `( )`     | 分组捕获            |                      |
| `|`       | 或                  | `cat|dog`            |

### 常用四个函数

```python
import re

text = "电话 13812345678，备用 15987654321，邮编 100010"

# ① search：找第一处（返回 Match 对象或 None）
m = re.search(r"\d{11}", text)
print(m.group())                    # 13812345678

# ② findall：找全部（返回列表）—— 最常用
print(re.findall(r"\d+", text))     # ['13812345678', '15987654321', '100010']

# ③ sub：替换
print(re.sub(r"\d", "*", text))     # 电话 ***********，备用 ***********，邮编 ******

# ④ match：只从串首匹配（像"必须以...开头"的严格校验）
print(re.match(r"\d+", "123abc").group())   # 123
print(re.match(r"\d+", "abc123"))            # None
```

两个习惯：

1. **模式字符串永远加 r 前缀**（原始字符串，防止 `\d` 之类的反斜杠被 Python 先吃一层）；
2. 校验"整个串符不符合形状"用 `re.fullmatch` 或加 `^...$` 锚：

```python
def is_phone(s):
    return bool(re.fullmatch(r"1[3-9]\d{9}", s))     # 11 位手机号形状

print(is_phone("13812345678"))    # True
print(is_phone("12345678901"))    # False（第二位只能是 3-9）
```

### 分组捕获：提取结构

```python
log = "2026-11-17 10:30:00 ERROR 磁盘满"
m = re.search(r"(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) (\w+)", log)
if m:
    print(m.group(1))    # 2026-11-17     日期
    print(m.group(2))    # 10:30:00       时间
    print(m.group(3))    # ERROR          级别
```

`()` 分组 + `group(n)` 取件——从日志、爬虫响应里抽取结构化数据的看家本领。**正则写完必须用正反例测**（几个该匹配的 + 几个不该匹配的），本章练习就是干这个。

### 常用正则配方集（抄走即用）

收集高频场景的现成模式（Python 字符串记得带 r 前缀）：

```python
import re

# 校验类（配 re.fullmatch）
EMAIL   = r"[\w.+-]+@[\w-]+\.[\w.-]+"
IPV4    = r"(\d{1,3}\.){3}\d{1,3}"
DATE    = r"\d{4}-\d{2}-\d{2}"
CHINESE = r"[\u4e00-\u9fff]+"              # 纯中文
STRONG_PWD = r"(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"   # 含大小写与数字的 8 位+

def ok(pattern, s):
    return bool(re.fullmatch(pattern, s))

print(ok(EMAIL, "a.b@x.com"))             # True
print(ok(DATE, "2026-11-17"))             # True
print(ok(STRONG_PWD, "Abc12345"))         # True（?=. 是前瞻：要求“存在”而不消费字符）

# 提取类（配 findall + 分组）
text = "2026-11-17 出账 128.50 元，2026-11-18 退回 30 元"
re.findall(r"(\d{4}-\d{2}-\d{2}).*?(\d+\.\d{2}) 元", text)
# [('2026-11-17', '128.50'), ('2026-11-18', '30')]   —— 非贪婪 .*? 粘住最近的金额

# 清洗类（配 sub）
re.sub(r"<[^>]+>", "", "<b>hi</b> 你好")            # 'hi 你好' —— 去简单 HTML 标签
re.sub(r"\s+", " ", "a   \n b")                     # 'a b' —— 压缩空白
```

三条正则使用纪律：① **先写正反例测试**（该匹配的三条、不该匹配的三条）再用于生产；② 能用字符串方法（startswith/in/split）解决的就别上正则——可读性优先；③ 复杂正则写 `re.compile` 存成常量并配注释，例如本例的全大写模式名——半年后你自己会感谢这些名字。

## 6.6 小结

- 四种写法：单双引号等价、转义、r 原始串（路径/正则必带）、三引号多行；
- str 不可变，方法全部返回新串；split/join 是文本加工黄金搭档；
- 编码：str（Unicode）→ encode → bytes；乱码 = 拿错解码本；
- re 四函数：search/findall/sub/match；模式串加 r；校验用 fullmatch；分组捕获提结构。

## 练习 6

1.（概念）`s.replace("a", "b")` 会改变 s 本身吗？和 list.sort() 的行为模式有何不同？
2.（概念）`r"C:\new"` 与 `"C:\new"` 有什么区别？
3.（编程）统计一行输入中**元音字母**（aeiou，不分大小写）的个数（不许用 for，用 sum + 生成器）。
4.（编程）把 `"2026-11-17"` 拆成年月日三个 int 并输出"2026年11月17日"。
5.（编程）写 `def mask_phone(s)`：把文本中所有 11 位手机号的中间四位替换成 `****`（用 re.sub + 分组）。

## 参考答案

**1.** 不改变（str 不可变，返回新串）。list.sort() 是原地修改返回 None；str 方法是返回新对象——两大阵营的方法论差异（第 5 章）。

**2.** `"C:\new"` 中 `\n` 是换行转义（串里真有换行符）；`r"C:\new"` 原始串反斜杠保持字面（4+3 个字符）。Windows 路径与正则必须 r 前缀。

**3.**

```python
line = input().lower()
print(sum(1 for ch in line if ch in "aeiou"))
# 或 sum(ch in "aeiou" for ch in line)   —— True 当 1 加
```

**4.**

```python
y, m, d = (int(x) for x in "2026-11-17".split("-"))
print(f"{y}年{m}月{d}日")
```

**5.**

```python
import re

def mask_phone(s):
    return re.sub(r"(1[3-9]\d)\d{4}(\d{4})", r"\1****\2", s)

print(mask_phone("联系 13812345678"))   # 联系 138****5678
```

（`\1`/`\2` 引用分组 1、3 位开头和末 4 位，中间 4 位被换掉。）

**[▲ 返回目录](#toc)**

---

<a id="p07"></a>

# 第 7 章 面向对象

> 本章目标：类与实例、`__init__` 与 self 的真相、属性与方法、继承与多态、dunder 魔法方法、dataclass。Python 的 OOP 比 Java 松弛得多——没有访问修饰符、没有接口强制——但核心思想一致。

---

## 7.1 类与实例：图纸与产品

面向对象的核心思想（图纸 vs 实例）与 C/Java 教程一致，这里直接上 Python 语法：

```python
class Student:                          # 类名大驼峰 PascalCase（PEP 8 约定）
    """学生类：装一个学生的数据与行为。"""     # docstring

    def __init__(self, name, score):    # 构造方法：创建实例时自动调用
        self.name = name                # 给“这个实例”挂上属性
        self.score = score

    def introduce(self):                # 实例方法
        print(f"我是 {self.name}，{self.score} 分")


s1 = Student("张三", 90)                # 实例化：类名(参数)，无需 new
s1.introduce()                          # 我是 张三，90 分
s2 = Student("李四", 66)
print(s2.name)                          # 李四 —— 属性直接用点访问
```

### self 的真相（Python OOP 的第一课）

`introduce(self)` 里的 self 是什么？**就是实例本身**。调用 `s1.introduce()` 时 Python 自动把它翻译成 `Student.introduce(s1)`——self 收到的就是 s1。所以：

- 方法的第一个参数**必须写 self**（这是显式约定，Java 的 this 是隐式，Python 选择明着写）；
- 方法内访问自己的属性一律 `self.xxx`；
- `__init__(self, ...)` 里的 self 就是"正在出生的那个对象"，`self.name = name` 是给它挂属性。

Python 没有 private 关键字：**属性默认公开**，谁都能 `s1.score = -999`。约定俗成：前缀**单下划线 `_name` = "内部使用，外面别碰"**（君子协定）；双下划线 `__name` 触发名称改写，防止子类误覆盖（真封装需求用 `@property`，本节末尾）。Python 哲学："我们都是成年人"——靠约定而非强制。

## 7.2 属性、方法与类成员

```python
class BankAccount:
    total_accounts = 0                       # 类属性：全体实例共享（对照 Java 的 static）

    def __init__(self, owner, balance=0):
        self.owner = owner                   # 实例属性：每个对象一份
        self.balance = balance
        BankAccount.total_accounts += 1

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("存款必须为正数")   # fail fast（第 10 章异常）
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("余额不足")
        self.balance -= amount

acc = BankAccount("张三", 100)
acc.deposit(500)
print(acc.balance)                            # 600
print(BankAccount.total_accounts)             # 1
```

查找顺序：实例属性 → 类属性。改余额要过 `deposit/withdraw` 的规矩（校验逻辑集中在门里）——封装思想与 Java 教程同款，实现手段换成"约定 + 方法守门"。

### @property：把方法伪装成属性

需要"读的时候算一下"或"写的时候校验"时，用 property 让调用方依旧写属性语法：

```python
class Circle:
    def __init__(self, r):
        self.r = r

    @property
    def area(self):                          # 读 c.area 时自动调用（不用加括号！）
        return 3.14159 * self.r ** 2

    @property
    def r(self):
        return self._r

    @r.setter
    def r(self, value):                      # 写 c.r = x 时校验
        if value <= 0:
            raise ValueError("半径必须为正")
        self._r = value

c = Circle(2)
print(c.area)          # 12.56636 —— 无括号，像属性
c.r = 5                # 走 setter 校验
```

这是 Python 版的 getter/setter——**调用方无感知，实现方有控制**。

## 7.3 继承与多态

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError("子类必须实现 speak")   # 对照 Java 的抽象方法

class Dog(Animal):                            # 括号里写父类：继承
    def speak(self):                          # 重写
        return f"{self.name}: 汪汪"

class Cat(Animal):
    def speak(self):
        return f"{self.name}: 喵"

animals = [Dog("旺财"), Cat("咪咪")]
for a in animals:
    print(a.speak())                          # 多态：各喊各的
```

要点：

- `class Dog(Animal)` 单继承（Java 同款）；多重继承 Python 允许（`class C(A, B)`），MRO（方法解析顺序）决定查找顺序，初学慎用；
- 子类重写 `__init__` 时调父类：`super().__init__(name)`——super() 与 Java 的 super 相同角色：

```python
class Puppy(Dog):
    def __init__(self, name):
        super().__init__(name)          # 让父类把公共初始化做完
        self.cute = True
```

- Python 的多态**靠鸭子类型兜底**：不看继承树，"会呱呱叫就当鸭子"——只要对象有 `speak()` 方法就能进 animals 列表（不需要共同父类，对照 Java 必须实现接口）。这灵活但也要求调用方写好文档。

## 7.4 dunder 魔法方法：让对象接入语言

`__init__` 这种双下划线方法（dunder，double underscore）是 Python 的"系统钩子"——**定义了它，你的对象就能参与语言的内置行为**：

| 方法          | 触发时机             | 例                |
| ------------- | -------------------- | ----------------- |
| `__init__`    | 实例化               | `Student("张三")` |
| `__str__`     | print(对象)/str()    | 人读的字符串      |
| `__repr__`    | REPL 显示/调试       | 开发者视角        |
| `__len__`     | len(对象)            |                   |
| `__eq__`      | == 比较              |                   |
| `__getitem__` | obj[i] 下标访问      |                   |
| `__iter__`    | for 遍历             | 第 8 章迭代器     |
| `__call__`    | obj() 像函数一样调用 | 装饰器基础        |

最常用的是 `__str__`/`__repr__`/`__eq__`：

```python
class Student:
    def __init__(self, name, score):
        self.name, self.score = name, score

    def __str__(self):                       # print(s) 时显示
        return f"{self.name}({self.score}分)"

    def __repr__(self):                      # REPL/容器里显示（惯例=带类名的精确表示）
        return f"Student({self.name!r}, {self.score})"

    def __eq__(self, other):                 # s1 == s2 时调用
        if not isinstance(other, Student):
            return NotImplemented
        return (self.name, self.score) == (other.name, other.score)

s = Student("张三", 90)
print(s)                                     # 张三(90分) —— 不再是 <__main__.Student object at 0x...>
```

第 5 章"`__init__` 是构造器"只是 dunder 的第一课——**写好 `__str__` 一个方法，调试体验立刻起飞**（不再满屏对象地址）。

### MRO 与 super 的协作顺序

多重继承时"super 到底调了谁"由 **MRO（方法解析顺序）** 决定——Python 用 C3 线性化算法把继承图拉成一条确定的查找线，`ClassName.__mro__` 能直接看：

```python
class A:
    def hello(self): print("A")

class B(A):
    def hello(self):
        print("B 前置")
        super().hello()          # 沿 MRO 找下一个，不一定是 A！

class C(A):
    def hello(self):
        print("C 前置")
        super().hello()

class D(B, C):                   # 多重继承
    def hello(self):
        print("D 前置")
        super().hello()

D().hello()
print([c.__name__ for c in D.__mro__])
# ['D', 'B', 'C', 'A', 'object'] —— 查找顺序
# 输出：D 前置 / B 前置 / C 前置 / A —— B 的 super 走到 C 而不是 A！
```

关键认知：**super() 不是"我的父类"，而是"MRO 上的下一个类"**——这就是菱形继承里每个类只被初始化一次的保证机制。初学期的实用守则：能单继承就单继承；用多重继承时只继承"无状态的能力混入"（mixin，方法不共享属性），MRO 的坑就基本踩不到。

### 鸭子类型与 EAFP 的 OO 面

Python 不需要接口声明就能多态（7.3 节提过），判断"这个对象能不能用"有两种流派：

```python
# LBYL 流：先问它会不会（hasattr）
if hasattr(obj, "speak"):
    obj.speak()

# EAFP 流（Pythonic）：直接用，错了接住
try:
    obj.speak()
except AttributeError:
    ...
```

更工程化的第三种：**协议即文档**——在 docstring 里写明"传入对象需实现 speak()"，然后信任它（fail fast 在深处的 AttributeError 上）。鸭子类型把"是不是鸭子"的判断从类型系统转移到使用现场，代价是错误后移、收益是零样板代码——FastAPI 里传入任何"能处理请求"的对象都能工作，正是这套哲学的工业化体现。

## 7.5 dataclass：数据类一行搞定

"只是装数据"的类（字段 + `__init__` + `__repr__` + `__eq__`），Python 3.7 的 `@dataclass` 装饰器自动生成全套：

```python
from dataclasses import dataclass

@dataclass
class Point:
    x: int                     # 类型注解（必写！dataclass 靠它识别字段）
    y: int

p1 = Point(3, 4)
print(p1)                       # Point(x=3, y=4)  —— __repr__ 自动生成
print(p1 == Point(3, 4))        # True             —— __eq__ 自动生成

@dataclass
class Rect:
    w: float
    h: float

    def area(self) -> float:    # 普通方法照常写
        return self.w * self.h

print(Rect(3, 4).area())        # 12.0
```

对照 Java 教程的 record：思想完全一致（不可变数据类自动全套）。dataclass 默认可变（要不可变加 `@dataclass(frozen=True)`）。**"只是装数据"就 dataclass，有行为才手写类**——第 12 章 FastAPI 的 Pydantic 模型就是它的超集。

### @classmethod 与 @staticmethod：类的另外两种方法

实例方法之外，类还能挂两种"不带 self"的方法：

```python
class Pizza:
    """ Pizza 类演示三种方法。"""
    menu = {"margherita": 30}                  # 类属性

    def __init__(self, ingredients):
        self.ingredients = ingredients         # 实例属性

    @classmethod
    def margherita(cls):                       # cls = 类本身（工厂方法惯例名）
        return cls(["番茄", "芝士"])

    @staticmethod
    def is_vegetarian(ingredients) -> bool:    # 与类/实例都无关的工具函数
        return "肉" not in ingredients

p = Pizza.margherita()          # 通过类直接造实例 —— 工厂方法
print(Pizza.is_vegetarian(["番茄"]))           # True
```

- **@classmethod**：第一个参数是 `cls`（类），常做**工厂方法**——"用另一种方式构造实例"（如从 JSON、从字符串解析）。子类调用时 cls 自动是子类，工厂返回子类实例（对照 Java 静态工厂）；
- **@staticmethod**：既不要 self 也不要 cls，只是"恰好放在类里的普通函数"，做相关工具方法。

选型：要动实例数据→实例方法；要造实例/动类数据→classmethod；都不沾→staticmethod（或干脆放模块层）。

### \_\_slots\_\_ 与对象内存（选读）

Python 实例属性存在每个对象的 `__dict__` 里（灵活但有开销）。声明 `__slots__` 后改用固定槽位：省内存、禁动态加属性：

```python
class Point:
    __slots__ = ("x", "y")           # 只允许这两个属性

    def __init__(self, x, y):
        self.x, self.y = x, y

p = Point(1, 2)
# p.z = 3                             # AttributeError！slots 之外的属性不许加
```

百万级小对象（粒子、节点）场景下 slots 能省一半以上内存；日常业务类不必用（灵活性优先），知道它存在即可——排查"为什么不能加属性"的灵异问题时会想起它。

## 7.6 组合优于继承

Python 圈同样信奉：**is-a 用继承，has-a 用组合，拿不准用组合**：

```python
class Engine:
    def start(self):
        print("引擎启动")

class Car:
    def __init__(self):
        self.engine = Engine()       # 组合：Car 拥有一个 Engine

    def drive(self):
        self.engine.start()          # 委托
        print("出发")
```

多重继承 + 混入（mixin）是 Python 特色玩法（如 Django 的类视图），进阶再学；新手期守住"单继承 + 组合"就足够健康。

### 对象关系图解：内存里的类与实例

第 7 章收尾，把 Python OOP 的内存画面画全（对照 Java 教程 5 章"遥控器"图）：

```
类 Student（class 对象，启动时创建）
┌──────────────────────────┐
│ "Student"                 │
│ __init__ ───▶ 函数代码     │◀── 类属性/方法全体实例共享
│ introduce ──▶ 函数代码     │
└──────────────────────────┘
      ▲                        实例（堆）
      │ __class__ 指回类        ┌──────────────────┐
s1 ──▶├──────────────────────▶│ name ──▶ "张三"    │ ← 实例属性各一份
                              │ score = 90        │
                              └──────────────────┘
```

三个推论，把此前散落的知识串起来：

1. **方法只有一份**（在类里），`s1.introduce()` 时 Python 把 s1 绑定为 self——所以方法不用复制给每个实例，实例只存自己的数据；
2. **实例属性与类属性同名时实例优先**（查找顺序：实例 dict → 类 dict）——这也是为什么"类属性当可变默认值共享"（第 5 章 BankAccount.total_accounts）要小心：`self.x += 1` 若类里有 x，会**新建**实例属性遮住类属性，意外的"静止"多半源于此；
3. `del s1` 删的是标签不是对象——引用计数归零（第 9 章没有别的标签引用它）后由解释器立即回收（CPython 的引用计数为主、分代 GC 兜底循环引用）。

至此 Python 的对象体系闭环：**标签模型（第 2 章）+ 属性字典 + 类共享方法**——三块拼图合上，任何 OOP 灵异问题都能在图上找到坐标。

## 7.7 小结

- class 定义；`__init__(self, ...)` 构造、self=实例本身、方法第一个参数必写 self；
- 无强制私有：`_name` 约定内部、`@property` 做受控属性；
- 继承 `class A(B)`，super() 调父类；多态靠方法重写 + 鸭子类型；
- dunder 是语言钩子：`__str__` 让 print 可读、`__eq__` 定义相等；
- 数据类用 @dataclass（对照 Java record）；组合优先于继承。

## 练习 7

1.（概念）`s1.introduce()` 执行时，self 收到什么？Python 为什么不省略 self？
2.（概念）dataclass 与手写类的分工？"只是装数据"用谁、为什么？
3.（编程）写 `Rect` 类：`__init__(w, h)`、`area()`、`__str__`（输出"3x4 矩形"样式）、`__eq__`（同宽高相等）。
4.（编程）`Shape` 基类（`area()` 抛 NotImplementedError），子类 `Circle`/`Square`；用列表装混合实例求总面积。
5.（编程）`Counter` 类：实例属性 count 从 0 起，`increment()`、类属性记录"创建过多少个 Counter 实例"，类方法查询。

## 参考答案

**1.** self 收到 s1（实例本身）。Python 显式 self 是设计哲学：方法 = 类作用域里的普通函数，谁被调用一目了然，也方便 `Student.introduce(s1)` 这种显式调用；隐式 this 把绑定藏在语言里，Python 选择让你看见。

**2.** 只装数据（DTO、配置、坐标、返回值打包）用 dataclass：__init__/__repr__/__eq__ 自动生成，三行顶三十行；需要复杂行为/状态机/继承体系才手写类。与 Java 的 record 同一分工哲学。

**3.**

```python
class Rect:
    def __init__(self, w, h):
        self.w, self.h = w, h

    def area(self):
        return self.w * self.h

    def __str__(self):
        return f"{self.w}x{self.h} 矩形"

    def __eq__(self, other):
        return isinstance(other, Rect) and (self.w, self.h) == (other.w, other.h)
```

**4.**

```python
class Shape:
    def area(self):
        raise NotImplementedError

class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return 3.14159 * self.r ** 2

class Square(Shape):
    def __init__(self, a): self.a = a
    def area(self): return self.a ** 2

shapes = [Circle(2), Square(3)]
print(sum(s.area() for s in shapes))    # 21.56636
```

**5.**

```python
class Counter:
    instances = 0                       # 类属性

    def __init__(self):
        self.count = 0
        Counter.instances += 1

    def increment(self):
        self.count += 1

a, b = Counter(), Counter()
a.increment(); a.increment()
print(a.count, b.count, Counter.instances)   # 2 0 2
```

**[▲ 返回目录](#toc)**

---

<a id="p08"></a>

# 第 8 章 Pythonic 三大件：生成器、装饰器、上下文管理器

> 本章目标：迭代器与生成器（惰性求值）、装饰器（函数的函数）、with 与上下文管理器。这是"会写 Python"与"写出地道 Python"的分水岭，也是读懂一切开源库的门槛。

---

## 8.1 迭代器：for 循环的底层协议

for 循环为什么能遍历字符串、列表、文件、字典？——因为它们都实现了**迭代协议**。Python 的 for 实际是这么工作的：

```python
nums = [10, 20, 30]
it = iter(nums)          # 1. 向序列要一个迭代器（调 nums.__iter__()）
print(next(it))          # 2. 反复向迭代器要下一个值（调 it.__next__()）
print(next(it))          # 30
print(next(it))
print(next(it))          # StopIteration 异常 → for 捕获它 → 循环结束
```

for 循环 = `iter()` + 反复 `next()` + 捕获 `StopIteration`。**任何实现了 `__iter__` 和 `__next__` 的对象都能被 for 遍历**——这就是鸭子类型的迭代协议。

迭代器是一次性的（取完就空），而列表/字符串等**可迭代对象**（Iterable）每次都能发新迭代器。记住名词：可迭代对象 = 能给 for 用的东西；迭代器 = 记着"发到哪了"的游标对象。

## 8.2 生成器：惰性生产的序列

造一个自定义迭代器，不必写类，用**生成器函数**——带 `yield` 的函数：

```python
def count_up(n):
    i = 1
    while i <= n:
        yield i          # 交出一个值，然后“暂停”在这里
        i += 1           # 下次要值时从这里继续

for x in count_up(3):
    print(x)             # 1 2 3

g = count_up(3)
next(g)                  # 1
next(g)                  # 2 —— 函数状态（i 的值）被完整记住！
```

`yield` 与 return 的本质区别：**return 是"下班"，yield 是"暂停"**。调用生成器函数不执行函数体，只返回生成器对象；每次 `next()` 执行到下一个 yield 暂停，局部变量、执行位置全部保留——函数变成了"可续命的协程"。

### 为什么要惰性：内存与无限流

普通列表是"先全部造好再给你"（占真内存）；生成器是"要一个造一个"（只存当前状态）：

```python
# 十亿个数的平方：列表版要吃掉几 GB；生成器版瞬间创建
squares_gen = (x ** 2 for x in range(1_000_000_000))   # 生成器表达式（圆括号！）
print(next(squares_gen))     # 1：只有第一个被真的计算

# 无限流：列表根本没法表达
def fib():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

f = fib()
for _ in range(10):
    print(next(f), end=" ")   # 0 1 1 2 3 5 8 13 21 34
print()
```

`(x**2 for x in ...)` 是**生成器表达式**——列表推导式 `[...]` 的惰性版：换方括号为圆括号，边遍历边生产，处理大文件/大日志的标配。

```python
total = sum(x ** 2 for x in range(100))       # 喂给 sum/max/any 等内置函数
```

**经验**：数据量小、要反复用、要切片 → 列表；一次流式处理、数据巨大或无限 → 生成器。第 10 章读大文件 `for line in f` 就是文件对象当生成器用（不把整个文件读进内存）。

### yield 的进阶形态（选读）

`yield` 还能收值（协程雏形）与向外委托（`yield from`），async/await（第 12 章 FastAPI 的异步）正是这套思想的现代化身——知道即可，用到再深究。

## 8.3 装饰器：函数的函数

需求：给一批函数统一加"计时日志"。复制粘贴计时代码进每个函数？维护噩梦。**装饰器 = 包在原函数外面的一层壳**，不改原函数代码就增强它：

```python
import time

def timer(func):                        # ① 接收被装饰的函数
    def wrapper(*args, **kwargs):       # ② 定义壳函数：接住任意参数
        start = time.time()
        result = func(*args, **kwargs)  # ③ 调原函数（解包传参）
        print(f"{func.__name__} 耗时 {time.time() - start:.4f}s")
        return result                   # ④ 把返回值传回去
    return wrapper                      # ⑤ 返回壳

@timer                                  # 糖：等价于 slow_sum = timer(slow_sum)
def slow_sum(n):
    return sum(range(n))

slow_sum(10_000_000)                    # slow_sum 耗时 0.2134s
```

执行机制（把 ⑤①③ 串起来）：

```
@timer 做的事：slow_sum = timer(slow_sum)
之后调用 slow_sum(...) 实际调的是 wrapper(...)
wrapper 里再调真正的原函数 func —— 壳里套核
```

**装饰器=接收函数返回新函数的高阶函数**，`@` 只是把赋值写成一行。它能做任何"横切关注点"：计时、日志、权限校验、重试、缓存。

### functools.wraps 与带参数的装饰器

两个进阶细节（读懂框架源码必备）：

```python
from functools import wraps

def log_call(func):
    @wraps(func)                              # 保住原函数的名字/文档（不加则都变成 wrapper）
    def wrapper(*args, **kwargs):
        print(f"调用 {func.__name__}, 参数 {args} {kwargs}")
        return func(*args, **kwargs)
    return wrapper

# 带参数的装饰器：再包一层
def repeat(times):                             # repeat(3) 先执行，返回真正的装饰器
    def deco(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return deco

@repeat(3)
def greet():
    print("hi")

greet()          # hi hi hi
```

**哪里见过装饰器**：`@property`（第 7 章）、`@dataclass`、FastAPI 的 `@app.get(...)`（第 12 章）、pytest 的 `@pytest.fixture`——**装饰器是 Python 框架的通用语法**，本章之后你能在每个库里见到它。

### yield 的本质：协程的第一课

生成器不只是"省内存的序列"——yield 的暂停/恢复机制是 Python **协程（coroutine）**的雏形，而协程是第 12 章 FastAPI 异步世界的地基。看一个"生成器能被外部喂数据"的进阶形态：

```python
def running_average():
    total, count = 0.0, 0
    avg = None
    while True:
        x = yield avg            # yield 既是出口也是入口：avg 交给外界，外界传进 x
        total += x
        count += 1
        avg = total / count

r = running_average()
next(r)                          # 启动到第一个 yield（拿到 None）
print(r.send(10))                # 10.0   —— send 同时喂数据并取结果
print(r.send(20))                # 15.0   —— 它记着 total/count，滚动计算
print(r.send(30))                # 20.0
```

`yield` 的语义升级：**暂停点同时是数据交换点**（产出 avg、收回 x）。函数变成了"可暂停、有记忆、可对话"的运行体——这就是协程。async/await（第 12 章的 async def）在语言层面就是这套机制的语法化封装：await 暂停等 IO，事件循环恢复它。**现在看不懂 send 用法没关系**，记住"生成器是协程的祖先"这个族谱，第 12 章读到 await 时会突然贯通。

## 8.4 上下文管理器：with 的原理

第 10 章会正式用 `with open(...)`，这里先讲清它为什么存在。资源管理的老问题：打开文件 → 用 → **必须在所有路径上关闭**（包括出错的路径）：

```python
f = open("data.txt")
try:
    data = f.read()
finally:
    f.close()            # 无论成功失败都要关 —— 每次都写 try/finally 太啰嗦
```

`with` 语句把"进入时准备、离开时清理"打包成语法：

```python
with open("data.txt") as f:
    data = f.read()
# 离开 with 块（无论正常还是异常）自动 f.close() —— 想忘都忘不掉
```

原理：对象实现两个 dunder——`__enter__`（with 进入时调用，返回值绑定给 as 变量）与 `__exit__`（离开时调用，负责清理）。任何"申请-使用-释放"资源的场景都能做成上下文管理器：

```python
from contextlib import contextmanager     # 生成器速成版：@contextmanager

@contextmanager
def timer(label):
    start = time.time()
    yield                                  # yield 之前 = __enter__，之后 = __exit__
    print(f"{label} 耗时 {time.time() - start:.4f}s")

with timer("处理"):
    sum(range(10_000_000))
```

自写类版（完整协议）：

```python
class Timer:
    def __enter__(self):
        self.start = time.time()
        return self                        # 绑定给 as 变量
    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"耗时 {time.time() - self.start:.4f}s")
        return False                       # True 可吞掉异常（一般不吞）

with Timer():
    sum(range(10_000_000))
```

适用场景清单：文件、锁（threading.Lock）、数据库连接、网络会话、临时改变目录……**守则：申请了外部资源的代码，一律 with**。

### 生成器流水线：惰性组合的威力

生成器真正的杀伤力在**串成流水线**——每段只管加工，数据像水一样流过全程，内存里永远只有"当前一滴"：

```python
import re

def read_lines(path):
    """生产：逐行读文件（大文件也不怕）。"""
    with open(path, encoding="utf-8") as f:
        for line in f:
            yield line.rstrip()

def parse(lines):
    """加工：从日志行提取 (时间, 耗时)。"""
    for line in lines:
        m = re.match(r"(\S+ \S+) .* (\d+\.\d+)s", line)
        if m:
            yield m.group(1), float(m.group(2))

def slow_only(pairs, threshold=1.0):
    """过滤：只留慢请求。"""
    for ts, sec in pairs:
        if sec > threshold:
            yield ts, sec

# 组装：三段生成器串联，没有任何一步把全量数据装进内存
log_stream = read_lines("access.log")
records = parse(log_stream)
slow = slow_only(records, 1.0)

for ts, sec in slow:
    print(ts, sec)
```

对照第 10 章"逐行读大文件"与 Java 教程 Stream 章的"惰性中间操作"——**三者是同一个思想的三种方言**：数据流 + 惰性 + 组合。生成器版本的优势是零依赖（纯语言特性）、无限流友好（比如 `tail -f` 式实时日志，永远读不完也能跑）。

### functools 补遗：partial 与 reduce

```python
from functools import partial, reduce

# partial：冻结部分参数，造出新函数
int2 = partial(int, base=2)          # 二进制版 int
print(int2("1010"))                  # 10

# reduce：滚动聚合（SQL 里聚合函数的祖师爷）
from operator import add
print(reduce(add, [1, 2, 3, 4]))     # 10：((((1+2)+3)+4))
```

partial 在"回调要带固定参数"时特别顺手（GUI、线程池任务）；reduce 如今多数场景被 sum/推导式取代，读到老代码认识即可。functools 家族（wraps/lru_cache/partial）是装饰器生态的螺丝钉，第 9 章还会遇见。

## 8.5 EAFP：Python 的错误处理哲学

三条 Pythonic 风格（写出来别人一看就知道你会 Python）：

1. **EAFP**（Easier to Ask Forgiveness than Permission）："先干，出错再处理"——直接 try 访问 dict 键，比先 `if key in d` 更地道（对照 C/Java 的 LBYL"先看看再干"）；
2. **真值判断**：`if items:` 而不是 `if len(items) > 0:`；
3. **生成器替代中间列表**：`sum(x for x in ...)` 而不是先造列表再 sum。

### 装饰器实战三连：重试 / 缓存 / 计数

三个生产里直接能用的装饰器，把 8.3 的语法落成肌肉记忆：

```python
import time
import functools

def retry(times=3, delay=1.0):
    """失败重试：网络请求的标配。"""
    def deco(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for i in range(times):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if i == times - 1:
                        raise                     # 最后一次失败：如实上抛
                    print(f"重试 {i + 1}/{times - 1}：{e}")
                    time.sleep(delay * (i + 1))   # 递增等待
        return wrapper
    return deco

@retry(times=3, delay=0.5)
def fetch(url):
    ...                                             # 你的网络请求

def cache_result(func):
    """极简缓存：相同参数直接回上次结果。"""
    cache = {}
    @functools.wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper
```

（生产里直接用 `functools.lru_cache` 替代 cache_result、`tenacity` 库替代 retry——但**手写一遍的价值不可替代**：写完你就同时吃透了闭包、*args、wraps 三件事。）

```python
@cache_result
def slow_square(n):
    time.sleep(1)
    return n * n

print(slow_square(9))     # 等 1 秒 → 81
print(slow_square(9))     # 瞬间 → 81（缓存命中）
```

对照 Java 教程：retry 相当于 Spring Retry 注解，cache_result 相当于 @Cacheable——**Python 用 15 行装饰器表达，Java 用框架注解表达**，思想同源（AOP：横切关注点与业务分离）。

## 8.6 小结

- for = iter() + next() + StopIteration；可迭代对象 vs 迭代器；
- yield 暂停不终结；生成器惰性生产省内存、能表达无限流；生成器表达式 `(x for x in ...)`；
- 装饰器 = 接函数返函数的高阶函数，@ 是赋值糖；functools.wraps 保元信息；
- with 靠 `__enter__/__exit__`，资源管理一律 with；@contextmanager 用生成器速成；
- EAFP、真值判断、生成器喂内置函数——Pythonic 三连。

## 练习 8

1.（概念）`[x*2 for x in ...]` 与 `(x*2 for x in ...)` 的区别？什么场景选后者？
2.（概念）说出装饰器执行的两个阶段（装饰时 vs 调用时）各发生什么。
3.（编程）写生成器 `def chunk(seq, n)`：把序列按 n 个一组切，`list(chunk([1,2,3,4,5], 2))` → `[[1,2],[3,4],[5]]`。
4.（编程）写装饰器 `@count_calls`：统计函数被调用次数（存函数属性），`greet.__calls__` 可查。
5.（编程）用 @contextmanager 写 `indent_ctx(n)`：进入后全局变量 STYLE["indent"] 增加 n、退出恢复原值。

## 参考答案

**1.** `[]` 立即计算全部存进列表（占内存、可切片可复用）；`()` 返回生成器（惰性、一次性、可无限）。数据量大且只顺序消费一遍时选后者。

**2.** 装饰时（import 到 @ 行）：执行 timer(func)，生成并替换 wrapper；调用时：每次调用原函数名实际执行 wrapper，wrapper 内再调原函数。

**3.**

```python
def chunk(seq, n):
    for i in range(0, len(seq), n):
        yield list(seq[i:i + n])

print(list(chunk([1, 2, 3, 4, 5], 2)))    # [[1, 2], [3, 4], [5]]
```

**4.**

```python
import functools

def count_calls(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return func(*args, **kwargs)
    wrapper.calls = 0
    return wrapper

@count_calls
def greet():
    print("hi")

greet(); greet()
print(greet.calls)     # 2
```

**5.**

```python
from contextlib import contextmanager

STYLE = {"indent": 0}

@contextmanager
def indent_ctx(n):
    old = STYLE["indent"]
    STYLE["indent"] = old + n
    try:
        yield
    finally:
        STYLE["indent"] = old       # 异常也要恢复

with indent_ctx(4):
    print(STYLE["indent"])          # 4
print(STYLE["indent"])              # 0
```

**[▲ 返回目录](#toc)**

---

<a id="p09"></a>

# 第 9 章 模块、包与虚拟环境

> 本章目标：import 的完整规则、标准库全家福、第三方库与 pip、虚拟环境 venv（Python 工程的命脉）、项目组织与类型注解。学完本章，你的代码从"脚本"升级为"项目"。

---

## 9.1 模块：一个 .py 就是一个模块

任何 `.py` 文件都是模块（module），`import` 就是"把另一个文件的代码加载进来用"：

```
项目目录/
├── utils.py          ← 模块 utils
└── main.py
```

```python
# utils.py
def clean(s):
    return s.strip().lower()

MAX_LEN = 100
```

```python
# main.py
import utils                    # 导入整个模块

print(utils.clean("  Hi  "))    # 通过 模块名.名字 使用
print(utils.MAX_LEN)
```

四种导入姿势：

```python
import utils                    # ① 整模块：用 utils.xxx
import utils as u               # ② 起别名：u.xxx（惯例：import numpy as np）
from utils import clean, MAX_LEN # ③ 点名导入：直接用 clean
from utils import *             # ④ 全部倒进来（污染命名空间，禁用！）
```

### __name__ == "__main__"：模块的双重身份

每个模块都有个 `__name__` 属性：**被直接运行时是 `"__main__"`，被 import 时是模块名**。利用它让文件"既能当脚本跑，又能被安全导入"：

```python
# utils.py
def clean(s):
    return s.strip().lower()

def main():                      # 自测入口
    print(clean("  Test  "))

if __name__ == "__main__":       # 只在直接运行本文件时执行
    main()
```

`python utils.py` 会跑自测；别的文件 `import utils` 时 main() 不会执行。**每个正式脚本都该套这个模板**——第 1 章埋的伏笔在此收回。

### 模块搜索路径与撞名坑

import 时解释器按顺序找：当前目录 → 环境变量 → 标准库目录。两个经典坑：

1. **自建文件名撞标准库**：文件命名 `random.py`，则 `import random` 导入的是你自己的文件（当前目录优先）——递归导入自己直接报错。命名避开标准库名（random/json/os/time/string...）；
2. **改了模块不生效**：`import` 只在首次执行（有缓存），REPL 里改了 utils.py 要 `importlib.reload(utils)` 或重启会话。

### import 的内部过程与 pyc 缓存

第一次 `import utils` 时解释器干了三件事（知道流程，排查就顺）：

1. **搜索**：按 `sys.path` 顺序找 utils.py（当前目录 → 环境变量 PYTHONPATH → 标准库/site-packages）；
2. **执行**：把 utils.py **从头到尾跑一遍**——模块顶层的一切语句（包括耗时操作！）都在这一刻执行；
3. **缓存**：结果存进 `sys.modules` 字典，第二次 import 直接取缓存不再执行。

```
>>> import sys
>>> 'json' in sys.modules
True      ← 你没用过？内置的很多模块其实早已被加载
```

由此三条实战结论：① **模块顶层只放定义和常量**，别放重活（连数据库、读大文件）——它们会在"被 import"时执行，哪怕你一个函数都没调用；② 修改源码后 REPL/长驻进程里要 `importlib.reload(utils)` 才生效；③ `__pycache__` 目录里的 `.pyc` 文件是编译字节码缓存（加速下次加载），删了会自动重生成，进 .gitignore 即可。

对照 Java 教程 12.8"类是懒加载的"：Java 首次用到才加载类；Python 是**首次 import 就执行**整个模块——粒度和时机都不同，坑位也不同。

## 9.2 包：带目录的模块群

包 = 装模块的文件夹（含 `__init__.py` 标识）：

```
myproject/
├── main.py
└── shop/                ← 包
    ├── __init__.py      ← 可为空，标记这是个包
    ├── cart.py          ← shop.cart 模块
    └── payment/
        ├── __init__.py
        └── alipay.py    ← shop.payment.alipay 子包
```

```python
from shop.cart import add_item          # 从包里点名导入
from shop import cart                   # 导入子模块
import shop.payment.alipay              # 全路径导入后用 shop.payment.alipay.xxx
```

相对导入（包内部互相引用，`from .cart import xxx` 的点 = 当前包）是库作者的进阶话题，先认识即可。

## 9.3 标准库全家福： batteries included

Python 口号"自带电池"——标准库就是海量现成模块。按用途速记一批（每个都能 `help()` 自学）：

| 模块              | 用途                     | 常用                              |
| ----------------- | ------------------------ | --------------------------------- |
| `os` / `os.path`  | 操作系统交互             | `os.listdir`、路径拼接            |
| `pathlib`         | 面向对象路径（现代首选） | `Path("a/b.txt").exists()`        |
| `sys`             | 解释器与命令行           | `sys.argv`、`sys.exit`            |
| `json`            | JSON 编解码              | `loads/dumps/load/dump`           |
| `re`              | 正则（第 6 章）          |                                   |
| `math` / `random` | 数学/随机                |                                   |
| `datetime`        | 日期时间                 | `datetime.now()`                  |
| `collections`     | 加强容器                 | `Counter`、`defaultdict`、`deque` |
| `itertools`       | 迭代神器                 | `product`、`groupby`              |
| `functools`       | 函数工具                 | `wraps`、`lru_cache`              |
| `subprocess`      | 执行外部命令             | 安全话题另学                      |
| `logging`         | 日志                     | 第 10 章实战用                    |

### collections 三件套（直接提升代码质量）

```python
from collections import Counter, defaultdict, deque

Counter("hello world").most_common(3)
# [('l', 3), ('o', 2), ('h', 1)] —— 词频统计一行搞定（第 5 章 dict 版的五行人肉循环可退役）

groups = defaultdict(list)          # 访问不存在的键时自动创建默认值
groups["A"].append("张三")           # 无需 setdefault！
# defaultdict(int) 的默认是 0，适合计数

q = deque([1, 2, 3])
q.appendleft(0); q.pop()            # 两端 O(1) 操作（list.pop(0) 是 O(n)）
```

`functools.lru_cache` 一行给递归加缓存：

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(200))    # 瞬间出结果——朴素递归要算万年（Java 教程 4.7 节的性能问题，Python 一行装饰器解决）
```

### 常用标准库三例：datetime / argparse / subprocess

三个高频模块各来一个最小可用样例，用法记住、细节 help() 查：

**datetime：日期时间**（对照 Java 教程 java.time）：

```python
from datetime import datetime, timedelta

now = datetime.now()                          # 2026-11-17 10:30:00.123456
now.strftime("%Y-%m-%d %H:%M")                # 格式化 → '2026-11-17 10:30'
datetime.strptime("2026-11-17", "%Y-%m-%d")   # 解析字符串 → datetime
now + timedelta(days=7)                       # 一周后
(now + timedelta(days=30)).year               # 取年
```

**argparse：命令行参数**（比 sys.argv 正规，第 11 章脚本升级用）：

```python
import argparse

parser = argparse.ArgumentParser(description="文件清理工具")
parser.add_argument("folder", help="目标目录")
parser.add_argument("--dry-run", action="store_true", help="只预览不写入")
args = parser.parse_args()

print(args.folder, args.dry_run)     # python clean.py /tmp --dry-run
```

`--help` 自动生成说明书——argparse 写一次，命令行体验专业十年。

**subprocess：调用外部程序**（认识即可，安全使用见守则）：

```python
import subprocess

r = subprocess.run(["ping", "-n", "1", "127.0.0.1"],
                   capture_output=True, text=True, timeout=10)
print(r.returncode, r.stdout[:50])
```

守则：命令参数**用列表**（如上）而不是 `shell=True` 拼字符串——后者把用户输入直接交给 shell 解释，是命令注入的温床（与 PHP 教程第 10 章的注入话题同源）。这一条既是工程习惯也是安全习惯。

## 9.4 pip 与第三方库

标准库之外的世界靠 **pip** 安装（PyPI 上有 50 万+ 包）：

```
pip install requests          # 安装
pip install "requests>=2.31"  # 指定版本
pip list                      # 已装清单
pip show requests             # 某包信息
pip uninstall requests        # 卸载
python -m pip install --upgrade pip    # 升级 pip 自身
```

常用第三方包速记：`requests`（HTTP）、`beautifulsoup4`（HTML 解析）、`pandas`（表格数据）、`fastapi`+`uvicorn`（Web）、`openpyxl`（Excel）、`pillow`（图像）、`pyyaml`、`rich`（终端美化）。

国内镜像加速（装不动时救命）：

```
pip install requests -i https://pypi.tuna.tsinghua.edu.cn/simple
```

## 9.5 虚拟环境 venv：工程命脉

**问题**：项目 A 要 requests 2.25，项目 B 要 2.31，全装在系统 Python 里必然打架（还有"污染系统 Python"的连带问题）。**解法**：每个项目建一个隔离的"迷你 Python 环境"，各装各的包：

```
cd 项目目录
python -m venv .venv          # 创建（一个叫 .venv 的文件夹，含独立解释器+包目录）
.venv\Scripts\activate        # 激活（Windows）
source .venv/bin/activate     # 激活（Linux/macOS）
```

激活成功后命令行前面出现 `(.venv)` 标记，此后 `pip install` 只装进这个环境。退出用 `deactivate`。VS Code 会自动探测 .venv 并使用（右下角解释器切换确认一下）。

**依赖清单**——把环境里装了什么记录下来，别人一条命令复原：

```
pip freeze > requirements.txt      # 导出
pip install -r requirements.txt    # 在新环境复原（同事/服务器/明年重建环境）
```

守则（背下来）：**一项目一 venv；requirements.txt 进 Git，.venv 不进**。这是 Python 项目协作与部署的地基，从今天起每写一个正式项目都这么开头。

### \_\_init\_\_.py 的两种用法与 mypy 初体验

**`__init__.py` 不只是"标记包"**，它还是包的门面——控制 `from shop import *` 暴露什么、提供快捷入口：

```python
# shop/__init__.py
from .cart import add_item, Cart        # 把子模块的常用名字提到包顶层

__all__ = ["add_item", "Cart"]          # 显式声明 * 导出的白名单
```

```python
# 用户侧
from shop import add_item               # 不用写 from shop.cart import add_item
```

大型库（如 requests）大量用这招："记住一个顶层名，底下结构随便重组"——门面稳定，实现自由。

**mypy：让注解真正"咬人"**。装上后对整个项目做静态类型检查：

```
pip install mypy
mypy main.py
# error: Argument 1 to "add" has incompatible type "str"; expected "int"
```

它在**运行前**抓类型错（第 9.6 节说的"弥补动态类型短板"的兑现）。落地建议：新项目 CI 里跑 `mypy app/ --ignore-missing-imports`，存量代码渐进式加注解（mypy 按文件宽松/严格可配）。Python 圈的成熟度信号之一就是 CI 三件套：**mypy（类型）+ ruff（风格）+ pytest（行为）**——三条全绿，代码才算过关。

### venv 实操全记录（跟着敲一遍）

虚拟环境是 Python 工程的命脉，值得完整走一遍全流程——假设我们要开一个爬虫项目：

```
D:\> mkdir books-crawler && cd books-crawler

D:\books-crawler> python -m venv .venv          # ① 创建环境（约 10 秒）
D:\books-crawler> .venv\Scripts\activate        # ② 激活（Linux/macOS: source .venv/bin/activate）

(.venv) D:\books-crawler> python --version      # 确认解释器
Python 3.12.4
(.venv) D:\books-crawler> where python          # 看它到底用的哪个 python
D:\books-crawler\.venv\Scripts\python.exe       ← 指向 venv 内部！隔离生效

(.venv) D:\books-crawler> pip install requests beautifulsoup4
(.venv) D:\books-crawler> pip freeze > requirements.txt    # ③ 记录依赖快照
(.venv) D:\books-crawler> type requirements.txt
beautifulsoup4==4.12.3
requests==2.31.0
...
(.venv) D:\books-crawler> deactivate            # ④ 退出环境（回到系统 Python）
```

半年后（或同事的电脑上）复原环境只要两步：

```
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
```

四个必答疑问：**① .venv 文件夹能删吗？** 能，删了重建 + `pip install -r` 即复原（所以它不进 Git）；**② 忘了激活就 pip install 了？** 包进 了系统 Python，`pip uninstall` 清掉重装即可；**③ VS Code 怎么知道用 .venv？** 打开项目文件夹后右下角解释器选择器里选 `.venv`（通常会自动探测）；**④ 每个 venv 多大？** 几 MB 到几十 MB（含一份解释器副本），比 Docker 镜像轻得多——所以"一项目一环境"毫无成本压力。**从今天起，`python -m venv .venv` 是你每个新项目的第一行命令。**

## 9.6 项目组织与类型注解

一个健康的中小型项目长这样：

```
myproject/
├── .venv/                 ← 环境（不进 Git）
├── requirements.txt
├── README.md
├── src/                   ← 或直接平铺包名
│   └── myproj/
│       ├── __init__.py
│       ├── core.py        ← 核心逻辑
│       └── cli.py         ← 命令行入口（带 if __name__ == "__main__"）
└── tests/
    └── test_core.py       ← 测试（第 10 章简接触 pytest）
```

### 类型注解：给动态类型上保险

Python 是动态类型，但 3.5+ 支持**类型注解**——写上预期类型（不影响运行，是给人和工具看的合同）：

```python
def total(prices: list[float]) -> float:      # 参数类型 → 返回类型
    return sum(prices)

def find(scores: dict[str, int], name: str) -> int | None:   # 3.10+ 写法
    return scores.get(name)

age: int = 18                                  # 变量注解
```

作用：① 文档（签名即说明书）；② IDE 补全与错误提示直线上升；③ 配合 `mypy` 静态检查能在**运行前**抓类型错误（弥补动态类型的短板，对照 C 的编译期检查）。**现代 Python 项目（尤其 FastAPI 生态）默认全注解**——第 12 章的 Pydantic 校验直接依赖注解。从现在起养成习惯：自己写的函数签名都加注解。

## 9.7 小结

- 文件即模块；四种 import；`if __name__ == "__main__"` 模板；文件名别撞标准库；
- 包 = 带 `__init__.py` 的目录；标准库先查有没有再造轮子；
- collections 三件套（Counter/defaultdict/deque）+ lru_cache 是性价比最高的四个工具；
- **一项目一 venv + requirements.txt**；国内镜像加速 pip；
- 类型注解写进函数签名，mypy 可静态检查，FastAPI 依赖它。

## 练习 9

1.（概念）`if __name__ == "__main__":` 的作用？没有它直接在模块底部写测试代码有什么隐患？
2.（概念）为什么需要 venv？没有它两个项目依赖冲突时会发生什么？
3.（操作）创建新项目目录：建 venv、激活、pip install requests、导出 requirements.txt、退出环境，记录每步输出。
4.（编程）用 Counter 重写第 5 章的词频统计（输入一句话，输出 top3 高频词）。
5.（编程）给 `def is_palindrome(s: str) -> bool` 补上实现与类型注解（忽略大小写）。

## 参考答案

**1.** 区分"被直接运行"与"被导入"两种身份，让自测代码只在直接运行时执行。没有它，import 这个模块时底部测试代码会被执行一遍——可能打印垃圾信息甚至产生副作用（写文件、发请求）。

**2.** pip 默认装进同一个全局环境，版本只能存一份；项目 A/B 需要 different 版本时必有一方崩。venv 给每项目独立包目录，互不可见。

**3.** 关键六步：`python -m venv .venv` → 激活（提示符出现 (.venv)）→ `pip install requests` → `pip freeze > requirements.txt`（内容形如 `requests==2.31.0`）→ `deactivate`。

**4.**

```python
from collections import Counter

text = input()
for word, cnt in Counter(text.split()).most_common(3):
    print(word, cnt)
```

**5.**

```python
def is_palindrome(s: str) -> bool:
    s = s.lower()
    return s == s[::-1]
```

**[▲ 返回目录](#toc)**

---

<a id="p10"></a>

# 第 10 章 异常与文件

> 本章目标：try/except/finally 与异常体系；with 读文件、pathlib、JSON、CSV；完成"学生成绩存档"与"日志分析"两个实战；附 pytest 测试初见。

---

## 10.1 异常体系与 try/except

程序运行出错时 Python 抛出**异常对象**。不处理，程序终止并打印 Traceback；用 try/except 接住，程序继续活：

```python
try:
    age = int(input("年龄："))          # 危险区：可能抛 ValueError
    result = 100 / age                  # 可能抛 ZeroDivisionError
except ValueError:                      # 接住指定类型
    print("请输入合法数字")
except ZeroDivisionError:
    print("0 不能做除数")
else:                                   # try 没抛异常时执行（可选）
    print(f"得分系数 {result:.2f}")
finally:                                # 无论如何都执行（可选，收尾用）
    print("流程结束")
```

阅读与 Java/C 的差异：**没有 checked 异常**——Python 一切异常都不强迫你处理（EAFP 哲学的配套设计），处理与否是设计决策。

常见异常类型（背下来，Traceback 最后一行就是它们）：

| 异常                           | 触发场景                    |
| ------------------------------ | --------------------------- |
| `ValueError`                   | 值不合法：`int("abc")`      |
| `TypeError`                    | 类型不对：`1 + "a"`         |
| `NameError` / `AttributeError` | 名字不存在 / 对象没有该属性 |
| `IndexError` / `KeyError`      | 下标越界 / 字典键不存在     |
| `FileNotFoundError`            | 文件不存在                  |
| `ZeroDivisionError`            | 除零                        |
| `ModuleNotFoundError`          | 模块没装/路径不对           |

### 抛异常与自定义异常

```python
def withdraw(balance, amount):
    if amount > balance:
        raise ValueError(f"余额不足：{balance} < {amount}")   # raise 抛出
    return balance - amount

class BizError(Exception):           # 自定义异常：继承 Exception
    """业务错误。"""

def login(name, password):
    if not name:
        raise BizError("用户名不能为空")
```

**治理军规**（与 Java 教程 10.2 同源）：能预防就别抛（先判空先校验）；except 要具体类型；**永不裸 except**（`except:` 会连 KeyboardInterrupt 一起吞，至少写 `except Exception`）；异常消息带上下文；不要"捕获了却什么都不做"。

### EAFP 风格示例

```python
# LBYL（先看再干）
if "score" in data and isinstance(data["score"], int):
    use(data["score"])

# EAFP（先干再接）—— Pythonic 首选
try:
    use(data["score"])
except (KeyError, TypeError):
    ...
```

## 10.2 文件读写：with open

**永远用 with**（第 8 章的上下文管理器，自动关闭文件）：

```python
# 写
with open("note.txt", "w", encoding="utf-8") as f:
    f.write("第一行\n")
    f.write("第二行\n")
    f.writelines(["三\n", "四\n"])

# 读：三种姿势
with open("note.txt", "r", encoding="utf-8") as f:
    all_text = f.read()              # ① 整个读成一个字符串（小文件）
with open("note.txt", encoding="utf-8") as f:
    lines = f.readlines()            # ② 全部行 → 列表
with open("note.txt", encoding="utf-8") as f:
    for line in f:                   # ③ 逐行迭代（大文件首选——惰性，第 8 章生成器的落地）
        print(line.rstrip())         # 行尾自带 \n，处理时rstrip掉
```

模式速记：`r` 读（默认）、`w` 写覆盖（**清空原文件！**）、`a` 追加、`+` 读写、`b` 二进制（`rb`/`wb`，图片等）。**encoding="utf-8" 要养成肌肉记忆**——Windows 默认编码是 GBK，不写这个参数，你的 UTF-8 文件就会读出乱码（本机实测高频问题）。

### pathlib：现代路径操作

```python
from pathlib import Path

p = Path("data") / "scores.txt"     # 用 / 拼路径（跨平台正斜杠）
p.exists()                          # 存在？
p.parent / p.name                   # 目录 / 文件名
p.suffix                            # '.txt'

Path("a/b/c").mkdir(parents=True, exist_ok=True)   # 递归建目录（已存在不报错）
text = Path("note.txt").read_text(encoding="utf-8") # 读小文件一行流
Path("out.txt").write_text("hi", encoding="utf-8")   # 写小文件一行流
list(Path(".").glob("*.py"))        # 列出当前目录所有 .py（glob 通配符）
```

对照 `os.path` 老接口：pathlib 更直观，新代码一律用它。

### 异常进阶：异常链、finally 与 return、日志

**异常链**：在 except 里再抛新异常，Python 自动把原异常挂在 `__cause__` 上并打印 "The above exception was the direct cause..."——错误全链路可追溯：

```python
def load_config(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except FileNotFoundError as e:
        raise RuntimeError(f"配置文件缺失：{path}") from e     # from e 保留案发现场
```

**finally 与 return 的暗坑**：finally 里的 return 会**吞掉** try 里的 return 和异常——结论与 Java 教程一致：finally 只放清理代码，永不放 return/break。至于清理资源，现代写法全部交给 with（第 8 章），finally 的存在感已经很低。

**logging：生产级日志**（对照 Java 教程 SLF4J）：

```python
import logging

logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("myapp")

log.info("启动完成")
log.warning("重试第 %d 次", 2)
try:
    risky()
except Exception:
    log.exception("出事了")       # 自动带上完整 Traceback —— print 调试的正式替代品
```

级别 `DEBUG < INFO < WARNING < ERROR < CRITICAL`；`logging.basicConfig(level=...)` 一行控制输出级别。守则与 Java 版一致：**开发用 print，写完换 logging；错误路径必留痕迹**。

## 10.3 JSON 与 CSV：两种通用数据格式

### JSON（配置、API 交互的通用语）

```python
import json

student = {"name": "张三", "scores": [90, 66], "vip": False}

s = json.dumps(student, ensure_ascii=False, indent=2)   # 序列化：dict → JSON 字符串
# ensure_ascii=False 让中文原样显示；indent 缩进美化
back = json.loads(s)                                     # 反序列化：JSON 字符串 → dict

# 直接读写文件（s 后缀的函数对字符串，不带 s 的对文件）
with open("student.json", "w", encoding="utf-8") as f:
    json.dump(student, f, ensure_ascii=False, indent=2)
with open("student.json", encoding="utf-8") as f:
    data = json.load(f)
print(data["scores"][0])    # 90
```

Python 类型 ↔ JSON 对照：dict↔object、list↔array、str↔string、int/float↔number、True/False↔true/false、None↔null。**tuple 会变成 array（丢身份）**——JSON 没有元组概念。

### csv 模块（表格数据）

```python
import csv

with open("students.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["姓名", "成绩"])
    w.writerows([["张三", 90], ["李四", 66]])

with open("students.csv", encoding="utf-8") as f:
    for row in csv.reader(f):        # 每行一个列表
        print(row)
```

注意 `newline=""` 参数（csv 模块的官方要求，防止 Windows 下多出空行）。Excel 可直接打开 csv。

### 编码实战三连：GBK 老文件、Excel 换行、容错读取

编码问题集中营一次排干净（Windows 用户高频三案）：

```python
# 案 1：读 GBK 编码的老公文/下载文件 → UnicodeDecodeError
text = Path("老文件.txt").read_text(encoding="gbk")      # 显式指定解码本
# 探测编码：pip install chardet → chardet.detect(原始字节) 给出猜测

# 案 2：写 CSV 给 Excel 打开 → 乱码
# 用 encoding="utf-8-sig"（带 BOM 头），Excel 才认它是 UTF-8
with open("out.csv", "w", newline="", encoding="utf-8-sig") as f:
    f.write("姓名,成绩\n张三,90")

# 案 3：混合编码的大文件里个别行坏 → 不要整文件报废
with open("mix.log", "rb") as f:                          # 二进制读
    for raw_line in f:
        line = raw_line.decode("utf-8", errors="replace")  # 坏字节替换成 � 而不炸
        process(line)
```

决策树：**新文件一律 `utf-8`；读老文件先试 `utf-8` 再 `gbk`；给 Excel 用 `utf-8-sig`；容错场景用 `errors="replace"`**。对照第 6 章"编码 = 翻译本"的比喻：所有乱码问题的第一问都是"这份数据当年用哪本翻译本写的"。

### 结构化数据选型：JSON vs CSV vs SQLite 一句话通

存"结构化数据"的三种文件形态，选型一句话：

| 格式   | 长相           | 适用                           | 忌                               |
| ------ | -------------- | ------------------------------ | -------------------------------- |
| JSON   | 嵌套 dict/list | 配置、API 数据、复杂结构       | 千万行大文件（要全量加载）       |
| CSV    | 表格行         | 表格数据、Excel 交换           | 嵌套结构（表达不了层级）         |
| SQLite | 单文件数据库   | 需要查询/索引/并发写的中型数据 | 教学外的超大规模（上专业数据库） |

SQLite 其实是标准库自带的（`import sqlite3`），无需装服务器：

```python
import sqlite3

conn = sqlite3.connect("students.db")          # 文件即数据库
conn.execute("CREATE TABLE IF NOT EXISTS stu (id INTEGER PRIMARY KEY, name TEXT, score INT)")
conn.execute("INSERT INTO stu (name, score) VALUES (?, ?)", ("张三", 90))   # ? 占位防注入！
conn.commit()

for row in conn.execute("SELECT name, score FROM stu WHERE score >= ?", (60,)):
    print(row)                                  # ('张三', 90)
conn.close()
```

两个要点先立住：① SQL 里值一律用 `?` 占位传参——字符串拼接 SQL 就是 SQL 注入（PHP 教程第 10 章的主角）；② 数据到了"要按条件查、要加字段、要多程序同时写"的规模，就从 JSON/CSV 升级到 SQLite，再往上才是 MySQL/PostgreSQL。第 12 章 FastAPI 生产化的第一课就是换数据库——你现在已经认识它了。

## 10.4 实战 1：学生成绩存档（JSON 持久化）

```python
import json
from pathlib import Path

FILE = Path("students.json")

def load():
    if not FILE.exists():
        return []
    return json.loads(FILE.read_text(encoding="utf-8"))

def save(students):
    FILE.write_text(json.dumps(students, ensure_ascii=False, indent=2),
                    encoding="utf-8")

def main():
    students = load()                          # 启动时读档
    while True:
        cmd = input("add/list/del/quit > ").strip()
        if cmd == "add":
            name = input("姓名：").strip()
            try:
                score = int(input("成绩："))
                assert 0 <= score <= 100, "成绩需在 0~100"
            except ValueError:
                print("成绩必须是数字"); continue
            except AssertionError as e:
                print(e); continue
            students.append({"name": name, "score": score})
            save(students)                     # 每次变动立即存档
        elif cmd == "list":
            for s in sorted(students, key=lambda x: -x["score"]):
                print(f"{s['name']}: {s['score']}")
        elif cmd == "del":
            name = input("删除谁：").strip()
            students = [s for s in students if s["name"] != name]
            save(students)
        elif cmd == "quit":
            break

if __name__ == "__main__":
    main()
```

串起第 3（菜单循环）、5（推导式过滤）、9（pathlib/模块守则）、10 章全部知识。**断言式校验 `assert cond, msg`** 抛 AssertionError，适合内部检查（生产校验用户输入用显式 raise 更稳）。

## 10.5 实战 2：日志分析（大文件流式处理）

统计 access.log 里每种状态码出现次数、找出耗时最长的 5 条请求（假设每行形如 `2026-11-17 10:30:00 GET /api 200 0.15s`）：

```python
from collections import Counter
from pathlib import Path

log = Path("access.log")

codes = Counter()
slowest = []                                # (耗时, 行) 收集后排序
with log.open(encoding="utf-8") as f:       # 大文件：逐行流式，内存只存当前行
    for line in f:
        parts = line.split()
        if len(parts) >= 5:
            codes[parts[-2]] += 1
            slowest.append((float(parts[-1].rstrip("s")), line.strip()))

print(codes.most_common())
for sec, line in sorted(slowest, reverse=True)[:5]:
    print(f"{sec:6.2f}s  {line}")
```

`Counter + most_common`、流式迭代、元组排序——三个本章工具全部落地。数据换成 1GB 的真日志，程序内存占用也只有几 MB（生成器/迭代的威力）。

## 10.6 pytest 初见（30 秒入门）

Python 圈的测试标准（对标 Java 教程 JUnit）：

```python
# test_calc.py —— 文件/函数名以 test_ 开头
def add(a, b):
    return a + b

def test_add():
    assert add(2, 3) == 5            # 直接用 assert！没有 assertEquals

def test_add_float():
    assert add(0.1, 0.2) != 0.3      # 连浮点陷阱都能写成测试
```

```
pip install pytest
pytest            # 自动发现并运行所有 test_*.py，-v 看详情
```

pytest 的哲学：**assert 就是断言**，报错时自动展开变量值——零学习成本起步，比手写 `print` 调试专业得多。写函数时顺手配一个 `test_xxx.py`，是"改代码不怕改坏"的底气。

## 10.7 小结

- try/except/else/finally；无 checked 异常；raise 抛出、自定义异常继承 Exception；EAFP；
- 文件一律 with open + encoding="utf-8"；w 会清空；大文件逐行迭代；
- pathlib：`/` 拼路径、read_text/write_text 一行流、glob 列文件；
- json 四函数（dumps/loads/dump/load）；csv 记得 newline=""；
- pytest：assert 即断言。

## 练习 10

1.（概念）`except:` 裸捕获为什么危险？至少应该写成什么？
2.（概念）`open(..., "w")` 对已存在文件做什么？想保留旧内容追加写用什么模式？
3.（编程）统计一个文本文件中出现次数最多的 5 个单词（split + Counter）。
4.（编程）把第 10.4 节存档程序加一个 `avg` 命令：输出平均分和低于平均分的人数。
5.（编程）给 `add(a, b)` 写 pytest 测试：正数、负数、浮点、字符串拼接（str 类型）四条用例。

## 参考答案

**1.** 裸 `except:` 连 KeyboardInterrupt（Ctrl+C）、SystemExit 等系统级异常一并吞掉，程序无法被正常中断、真实错误被隐藏。至少 `except Exception as e:`，最好具体类型。

**2.** 清空原文件（原内容立即丢失）。追加用 `"a"`。

**3.**

```python
from collections import Counter
from pathlib import Path

words = Path("article.txt").read_text(encoding="utf-8").lower().split()
for w, c in Counter(words).most_common(5):
    print(w, c)
```

**4.** 在菜单里加分支：

```python
elif cmd == "avg":
    if students:
        avg = sum(s["score"] for s in students) / len(students)
        below = sum(1 for s in students if s["score"] < avg)
        print(f"平均 {avg:.2f}，低于平均 {below} 人")
```

**5.**

```python
def add(a, b):
    return a + b

def test_pos(): assert add(2, 3) == 5
def test_neg(): assert add(-1, -2) == -3
def test_float(): assert abs(add(0.1, 0.2) - 0.3) < 1e-9
def test_str(): assert add("a", "b") == "ab"
```

**[▲ 返回目录](#toc)**

---

<a id="p11"></a>

# 第 11 章 实战：脚本与爬虫

> 本章目标：两个完整实战——① 文件批处理脚本（把全书语言知识串成生产力工具）；② requests + BeautifulSoup 爬虫（理解 HTTP 与网页解析）。学完你能写出真正"替人干活"的程序。

---

## 11.1 实战一：文件批处理脚本

需求：把一个文件夹里所有 `.txt` 的行尾空白清理掉、统计每个文件行数，并生成报告。这是"批量改文件"类需求的万能模板：

```python
"""批处理脚本：清理 .txt 行尾空白并生成报告。"""
from pathlib import Path
import sys

def clean_file(path: Path) -> int:
    """清理单个文件，返回处理后的行数。"""
    lines = path.read_text(encoding="utf-8").splitlines()   # 不带 \n 的行列表
    cleaned = [line.rstrip() for line in lines]             # 去每行尾部空白
    while cleaned and cleaned[-1] == "":
        cleaned.pop()                                        # 去文件尾部空行
    path.write_text("\n".join(cleaned) + ("\n" if cleaned else ""),
                    encoding="utf-8")
    return len(cleaned)

def main(folder: str) -> None:
    root = Path(folder)
    if not root.is_dir():
        sys.exit(f"目录不存在：{folder}")

    report = []
    for path in sorted(root.glob("*.txt")):                  # 只处理 .txt（递归用 rglob）
        n = clean_file(path)
        report.append(f"{path.name}: {n} 行")
        print(f"已清理 {path.name}（{n} 行）")

    (root / "_report.txt").write_text("\n".join(report), encoding="utf-8")
    print(f"共处理 {len(report)} 个文件，报告见 _report.txt")

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else ".")
```

运行：`python clean_txt.py D:\notes`。**知识点全景**：pathlib glob 遍历、类型注解、docstring、推导式清洗、join/splitlines、sys.argv 命令行参数、sys.exit 带消息退出、main 守卫。改造成"重命名所有 jpg / 统计所有 csv 行数 / 给所有 md 加标题"，只需要换 `clean_file` 的逻辑——**模板不变，灵魂可换**。

扩展练习方向：加 `--dry-run` 参数只预览不写入；跳过超过 10MB 的大文件；处理编码异常（try/except 包 read_text）。

### 脚本 CLI 化：argparse 升级版

第 9 章 argparse 的实战落地——把批处理脚本从"改源码换参数"升级成正规命令行工具：

```python
"""clean_txt.py —— 行尾空白清理工具（CLI 版）"""
import argparse
import sys
from pathlib import Path

def main() -> None:
    parser = argparse.ArgumentParser(description="清理 .txt 行尾空白")
    parser.add_argument("folder", nargs="?", default=".", help="目标目录（默认当前）")
    parser.add_argument("--dry-run", action="store_true", help="只预览不写入")
    parser.add_argument("--ext", default="txt", help="目标扩展名（默认 txt）")
    args = parser.parse_args()

    files = sorted(Path(args.folder).glob(f"*.{args.ext}"))
    if not files:
        sys.exit(f"没找到 *.{args.ext} 文件")

    for p in files:
        before = p.read_text(encoding="utf-8")
        after = "\n".join(line.rstrip() for line in before.splitlines()) + "\n"
        if args.dry_run:
            print(f"[预览] {p.name} 将改动 {len(before) - len(after)} 字符")
        else:
            p.write_text(after, encoding="utf-8")
            print(f"已清理 {p.name}")

if __name__ == "__main__":
    main()
```

```
python clean_txt.py D:\notes --dry-run     # 先预览
python clean_txt.py D:\notes               # 确认后再真删
python clean_txt.py --help                  # 自动生成的说明书
```

**--dry-run（只读预览）是批处理工具的职业素养**：先看会改什么，再真改——这个习惯在服务器上能救命（与 PHP/Java 教程"危险操作前想三秒"同源）。

### 反爬常识与爬虫礼仪清单

目标站点"不欢迎你"时常见的信号与应对（仅做认知储备，**绕过限制不属于本教程范畴**）：

| 信号                  | 含义           | 合规应对                                  |
| --------------------- | -------------- | ----------------------------------------- |
| 403 Forbidden         | 身份/来源被拒  | 检查 UA 头是否过于裸露；仍拒则放弃该站    |
| 429 Too Many Requests | 频率超限       | 指数退避重试 + 加大间隔                   |
| 验证码 / JS 渲染页    | 内容需真人交互 | 数据另有 API 时走 API；否则放弃或人工处理 |

礼仪四条（爬虫的"交通规则"）：① 先看 robots.txt（如 `https://目标站/robots.txt`）声明了哪些路径不许抓；② sleep 限速（每请求 ≥1 秒是善意基线）；③ 只抓公开数据、绝不绕登录/付费墙；④ 抓来的数据尊重版权，商用前确认授权。**爬虫技术的正途是"爬得稳"，不是"爬得狠"**——这条与你的安全方向同理：边界感是专业人士的标志。

## 11.2 HTTP 快速必修课

爬虫 = 程序模拟浏览器发 HTTP 请求、解析响应。30 秒补齐 HTTP（Java 教程 13.5 节的同款知识）：

- **请求**：方法（GET 拿/POST 交）+ URL + 请求头（Headers，含身份信息）+ 可选请求体；
- **响应**：状态码（200 成功、403 拒绝、404 不存在、429 太频繁）+ 响应头 + 正文（HTML/JSON）；
- **HTML** 是嵌套标签文本：`<div class="title">内容</div>`——爬虫解析就是"按标签/类名定位数据"。

礼貌爬虫三条：看目标站 robots.txt 与服务条款；控制频率（time.sleep）；只抓公开数据，不绕登录/付费墙——**技术边界与法律边界都要守住**。

### 给脚本穿衣服：退出码与可组合性

脚本和脚本之间靠**退出码**协作（C/Java 教程 main 返回值的 Python 版）：

```python
import sys
from pathlib import Path

def main() -> int:
    target = Path("data")
    if not target.exists():
        print(f"错误：目录不存在", file=sys.stderr)   # 错误走 stderr
        return 1                                     # 非 0 = 失败
    ...                                              # 正常干活
    return 0                                         # 0 = 成功

if __name__ == "__main__":
    sys.exit(main())
```

三条规矩与 C/Java 完全同源：**0 成功、非 0 失败**；正常输出走 stdout、错误信息走 stderr（`print(..., file=sys.stderr)`）；于是脚本之间可以管道组合：

```
python fetch.py && python clean.py        # 前一个成功才跑下一个（&& 看退出码）
python fetch.py | sort > out.txt          # stdout 进管道
```

写脚本时把退出码当合同——它是你的工具将来被自动化（任务计划、CI、别的脚本）调用的握手协议。

## 11.3 requests：HTTP 客户端

第三方库，先装：`pip install requests`（第 9 章流程）。

```python
import requests

# GET
r = requests.get("https://httpbin.org/get", timeout=10)
print(r.status_code)          # 200
print(r.headers["content-type"])
print(r.json())               # 若响应是 JSON：直接解析成 dict
print(r.text[:100])           # 响应正文（文本）

# 带参数与请求头
r = requests.get(
    "https://httpbin.org/get",
    params={"q": "python", "page": 1},             # URL ?q=python&page=1
    headers={"User-Agent": "Mozilla/5.0 (学习用爬虫)"},   # 伪装浏览器身份
    timeout=10,                                     # 超时必设！否则可能永远卡住
)

# POST（表单/JSON）
r = requests.post("https://httpbin.org/post", data={"user": "a"})       # 表单
r = requests.post("https://httpbin.org/post", json={"user": "a"})       # JSON 体

r.raise_for_status()      # 非 2xx 状态码直接抛异常（配合 try/except 用）
```

健壮请求的模板（异常处理 + 重试）：

```python
import time
import requests

def fetch(url: str, retries: int = 3, **kwargs) -> requests.Response | None:
    kwargs.setdefault("timeout", 10)
    kwargs.setdefault("headers", {"User-Agent": "Mozilla/5.0"})
    for i in range(retries):
        try:
            r = requests.get(url, **kwargs)
            r.raise_for_status()
            return r
        except requests.RequestException as e:      # 网络类异常的公共基类
            print(f"第 {i + 1} 次失败：{e}")
            time.sleep(2 ** i)                       # 指数退避：2s, 4s, 8s
    return None
```

## 11.4 BeautifulSoup：HTML 解析

`pip install beautifulsoup4`。核心：把 HTML 变成可搜索的对象树，用 `find/find_all` + CSS 选择器定位元素：

```python
from bs4 import BeautifulSoup

html = """
<html><body>
  <h1 id="title">今日新闻</h1>
  <div class="item">
    <a href="/news/1">第一条</a><span class="time">10:00</span>
  </div>
  <div class="item">
    <a href="/news/2">第二条</a><span class="time">11:00</span>
  </div>
</body></html>
"""

soup = BeautifulSoup(html, "html.parser")

soup.find("h1").text                       # '今日新闻' —— 第一个 h1 的文本
soup.find_all("div", class_="item")        # 所有 class=item 的 div（列表）
soup.select("#title")                      # CSS 选择器：#id
soup.select("div.item > a")                # .item 的直接子级 a
soup.select_one(".item .time").text        # 第一个匹配

for div in soup.select("div.item"):
    a = div.find("a")
    print(a["href"], a.text)               # 取属性用方括号；/news/1 第一条 ...
```

定位三板斧：`find("标签", class_=...)`、`select("CSS 选择器")`、`element.parent/next_sibling`——90% 的解析需求覆盖。

### JSON API 爬取：比 HTML 更好抓的目标

现代网站很多走"前后端分离"：页面 HTML 只是壳，数据来自 XHR 接口返回的 JSON——**抓 JSON 比解析 HTML 舒服一个量级**（结构现成，无需 BeautifulSoup）：

```python
import requests

r = requests.get("https://api.github.com/search/repositories",
                 params={"q": "language:python", "sort": "stars", "per_page": 5},
                 headers={"User-Agent": "learn-python"},
                 timeout=10)
data = r.json()                              # JSON → dict，直接穿隧道
for item in data["items"]:
    print(f"{item['full_name']:<40} ★{item['stargazers_count']}")
```

**怎么找页面背后的 JSON 接口**：浏览器 F12 → Network（网络）面板 → 刷新页面 → 筛选 XHR/Fetch → 找到返回数据的请求 → 复制其 URL 与参数。三条注意：① 带 Referer/UA 头模拟真实来源；② 接口可能有签名/时间戳参数（那是反爬，勿硬逆向）；③ 优先找官方开放 API——**能用文档解决的，就不要用爬虫**。

对照 Java 教程：requests 之于 Python ≈ HttpClient 之于 Java 11+；JSON 穿隧道（`data["items"][0]["full_name"]`）就是第 5 章"嵌套结构操作"的直接复用——**语言课程的知识在实战章全部回收**。

## 11.5 实战二：完整爬虫（抓取 + 清洗 + 存盘）

目标：抓取一个 Books 假想站点（练习用 httpbin 也能玩，正式学习可用 books.toscrape.com——专门给爬虫练习的合法站点）：

```python
"""抓取书籍列表页：标题、价格、评分，存成 CSV。"""
import csv
import time
import requests
from bs4 import BeautifulSoup

BASE = "https://books.toscrape.com/catalogue/page-{}.html"
HEADERS = {"User-Agent": "Mozilla/5.0 (教程练习)"}

def parse_page(html: str) -> list[dict]:
    soup = BeautifulSoup(html, "html.parser")
    books = []
    for article in soup.select("article.product_pod"):
        title = article.h3.a["title"].strip()
        price = article.select_one("p.price_color").text.strip()
        rating = article.p.get("class", [""])[-1]        # <p class="star-rating Three">
        books.append({"title": title, "price": price, "rating": rating})
    return books

def main():
    all_books = []
    page = 1
    while page <= 3:                                     # 教程只抓 3 页，礼貌练习
        url = BASE.format(page)
        r = requests.get(url, headers=HEADERS, timeout=10)
        if r.status_code == 404:
            break                                        # 翻到头了
        r.raise_for_status()
        all_books.extend(parse_page(r.text))
        print(f"第 {page} 页完成，累计 {len(all_books)} 本")
        page += 1
        time.sleep(1)                                    # 礼貌：每页之间歇 1 秒

    with open("books.csv", "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=["title", "price", "rating"])
        w.writeheader()
        w.writerows(all_books)
    print(f"完成：{len(all_books)} 本已存入 books.csv")

if __name__ == "__main__":
    main()
```

四个实战细节：① `encoding="utf-8-sig"` 让 Excel 打开 CSV 不乱码；② `DictWriter` 按字段名写字典列表；③ 404 当"翻页结束"的信号；④ 每页 sleep 1 秒。**结构：请求函数 → 解析函数（纯函数，可单测）→ 主流程**——把这个骨架换成任何目标站都成立。

### 进阶路标（本章不做，留名）

- 动态渲染页面（数据由 JS 加载）：`playwright`/`selenium` 驱动真浏览器；
- 需要登录：requests.Session 保持 Cookie；
- 大规模并发：httpx 异步版；
- 数据管道：抓取 → pandas 清洗 → 存储。

### 爬虫数据管道：从"抓到"到"能用"

抓到数据只是第一步。一条完整的数据管道长这样（把本章与第 10 章串起来）：

```
requests 抓取 → BeautifulSoup/JSON 解析 → 清洗（正则/类型转换）→ 去重 → 存储（CSV/SQLite）
```

给 11.5 的爬虫补上清洗与去重（真实网页的脏数据超出你想象）：

```python
import re

def parse_price(text: str) -> float:
    """'£51.77' → 51.77：从噪声里提取数字。"""
    m = re.search(r"[\d.]+", text)
    if m is None:
        raise ValueError(f"价格解析失败：{text!r}")
    return float(m.group())

def build_records(pages_of_books) -> list[dict]:
    seen_titles = set()                      # 去重集合（第 5 章 O(1) 的 in）
    records = []
    for books in pages_of_books:
        for b in books:
            title = b["title"].strip()
            if title in seen_titles:         # 翻页重复的跳过
                continue
            seen_titles.add(title)
            records.append({
                "title": title,
                "price": parse_price(b["price"]),       # 字符串 → 数值
                "rating": b["rating"],
            })
    return records
```

清洗三原则：**字段类型化**（价格转 float 才能算总额）、**信任但验证**（解析失败抛异常而不是塞进脏数据）、**幂等**（重跑一遍结果一致——seen_titles 保证翻页重叠不重复入库）。爬虫与数据工程的分界线就在这一步：会抓只是入门，**抓回来还干净、可重跑、能分析**才算成品。接下来去哪：pandas（清洗分析）、SQLite（存储查询）、APScheduler（定时抓）——你已握有全部前置知识。

## 11.6 小结

- 批处理模板：glob 遍历 → 处理函数 → 报告输出，main 守卫 + sys.argv；
- requests：params/headers/timeout/raise_for_status，异常重试用指数退避；
- BeautifulSoup：find/find_all + select(CSS)，text 与 ["属性"] 两把钥匙；
- 爬虫骨架：请求 → 解析（纯函数）→ 存盘（csv/utf-8-sig），sleep 讲礼貌。

## 练习 11

1.（概念）为什么 `requests.get` 要设 timeout？不设会怎样？为什么 raise_for_status 之后还要 try/except？
2.（编程）改造批处理脚本：统计文件夹中所有 `.md` 文件的总字数与文件数，输出 top3 大文件。
3.（编程）用 requests + httpbin.org 验证：POST JSON `{"name":"py"}`，打印响应里服务器收到的 data 字段。
4.（编程）给爬虫加"按评分过滤"：只保存 Four/Five 星的书。
5.（概念）爬虫三礼貌是什么？403/429 状态码分别说明什么、该怎么应对？

## 参考答案

**1.** 无 timeout 时若服务器不响应，请求可能挂住数分钟甚至永久（线程/脚本卡死）。raise_for_status 把 HTTP 错误变成异常，但仍需 try/except 接住才能走重试/降级逻辑——"抛"与"接"是一套动作的两半。

**2.**

```python
from pathlib import Path

files = sorted(Path("目录").glob("*.md"))
sizes = [(p.name, len(p.read_text(encoding="utf-8"))) for p in files]
print(f"文件数 {len(sizes)} 总字数 {sum(s for _, s in sizes)}")
for name, size in sorted(sizes, key=lambda x: -x[1])[:3]:
    print(name, size)
```

**3.**

```python
import requests

r = requests.post("https://httpbin.org/post", json={"name": "py"}, timeout=10)
print(r.json()["data"])       # '{"name": "py"}'
```

**4.** parse_page 里加一行过滤：`if rating in ("Four", "Five"): books.append(...)`。

**5.** 看 robots.txt、限速（sleep）、只抓公开内容。403 = 服务器拒绝（IP/身份被限制，应停手勿硬闯）；429 = 请求过频（降速、指数退避重试）。

**[▲ 返回目录](#toc)**

---

<a id="p12"></a>

# 第 12 章 Web 后端：FastAPI

> 本章目标：理解 Web 框架的角色；用 FastAPI + Pydantic 写出学生管理 REST API（对标 Java 教程第 13 章的 Spring Boot 项目）；跑通 uvicorn、自动交互文档、测试接口。

---

## 12.1 Web 框架在干什么

第 11 章的爬虫是"客户端"；本章写"服务端"。裸写服务端要处理 TCP、HTTP 解析、路由分发、并发连接……Web 框架把这些全部包掉，你只写**路由处理函数**：声明"什么路径、什么方法，交给哪个函数"。

Python 三大框架选型：

| 框架                  | 风格                             | 适合             |
| --------------------- | -------------------------------- | ---------------- |
| **FastAPI**（本教程） | 现代异步、类型注解驱动、自动文档 | API 服务、新项目 |
| Flask                 | 极简微框架                       | 小服务、学习     |
| Django                | 全家桶（ORM/后台/认证）          | 传统大网站       |

选 FastAPI 的三个理由：**基于类型注解**（第 9 章伏笔兑现）、**自动生成交互式 API 文档**、**原生异步**（性能强）。HTTP/REST 基础（方法、状态码、JSON）与 Java 教程 13.5 节相同，不再重复。

## 12.2 第一个服务：Hello API

装依赖（venv 里）：`pip install "fastapi[standard]"`（自带 uvicorn 服务器与全套工具）。

```python
# main.py
from fastapi import FastAPI

app = FastAPI(title="我的第一个 API")       # 应用实例

@app.get("/")                               # 装饰器声明路由：GET /
def root():
    return {"message": "Hello, FastAPI"}    # 返回 dict 自动变 JSON
```

运行：

```
uvicorn main:app --reload        # main 是文件名，app 是实例名；--reload 改代码自动重启
```

浏览器访问 <http://127.0.0.1:8000/>，看到 `{"message":"Hello, FastAPI"}`。**访问 <http://127.0.0.1:8000/docs> ——自动生成的交互式 API 文档**（Swagger UI）：所有接口、参数、直接在网页上"点 Try it out"发请求。这是 FastAPI 的招牌体验，写接口的同时免费得了文档。

## 12.3 路径参数、查询参数与 Pydantic 模型

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI()

# 路径参数：{} 占位，函数参数同名自动接收并做类型转换
@app.get("/students/{id}")
def get_student(id: int):                       # 声明 int → 传入 "abc" 自动 422 报错
    return {"id": id}

# 查询参数：不在路径里的函数参数自动当 ?key=value
@app.get("/search")
def search(keyword: str, limit: int = 10):      # limit 有默认值 → 可选参数
    return {"keyword": keyword, "limit": limit}

# 请求体：参数类型是 BaseModel（Pydantic 模型）→ 自动从 JSON 解析
class StudentIn(BaseModel):                     # 新建学生的输入模型
    name: str = Field(min_length=1, max_length=32)     # 校验规则写在字段上
    score: int = Field(ge=0, le=100)                   # 0 ≤ score ≤ 100

@app.post("/students", status_code=201)
def create_student(s: StudentIn):
    return {"id": 1, **s.model_dump()}          # 展开模型字段（Pydantic v2 语法）

# 错误响应：HTTPException
@app.delete("/students/{id}")
def delete_student(id: int):
    if id != 1:                                  # 假装数据库里只有 1 号
        raise HTTPException(status_code=404, detail="学生不存在")
    return {"deleted": id}
```

**Pydantic 的魔法**：函数签名即接口契约——类型注解 + Field 规则让框架自动完成：JSON 解析、类型转换、**校验失败自动返回 422 与中文可读的错误明细**、生成文档。零手写校验代码（对照 Java 教程要手写 if 判断的版本）。校验失败不用你管，业务"查无此人"才 raise HTTPException。

### 分步实现路线（照顺序做，每步都能跑）

自己动手写 12.4 的完整版时，别一口气抄 90 行——按这条路线小步走，每一步都是可运行的状态：

1. **裸框架**：main.py 只有 Hello World（12.2），`uvicorn main:app --reload` 跑通——确认环境没问题；
2. **只读接口**：`GET /students` 返回硬编码的 dict 列表，浏览器 /docs 里点一下能看到 JSON；
3. **路径参数**：加 `GET /students/{id}`，故意传 "abc" 看 422 响应——亲眼看 Pydantic 的自动校验；
4. **POST + 模型**：加 StudentIn 与 create 接口，在 /docs 里提交表单，观察自动生成的校验错误；
5. **404**：get_student 里查不到时 raise HTTPException——用 curl 验证 404；
6. **持久化**：引入 db dict + save()/load()（JSON 文件），重启服务数据还在；
7. **PUT/DELETE**：补齐增删改查闭环；
8. **测试**：写 test_api.py（TestClient），pytest 全绿。

每步 10~20 行，出问题时嫌疑范围永远很小——**这条路线与 Java 教程 P2 项目的分步法、C 教程贪吃蛇的分步法完全同构**：小步提交、每步可验证，是所有工程（不止编程）的通用方法论。走完 8 步，你收获的不只是一个 API，而是"从零到部署"的完整手感。

## 12.4 实战：学生管理 REST API（完整版）

把 Java 教程 13.6 节的同款需求用 FastAPI 实现——增删查 + 排序 + 持久化（JSON 文件）：

```python
"""student_api.py —— 学生管理 REST API（FastAPI 教学完整版）"""
import threading
from fastapi import FastAPI, HTTPException
from pathlib import Path
from pydantic import BaseModel, Field

app = FastAPI(title="学生管理 API", version="1.0")
FILE = Path("students.json")

# ---------- 数据层：内存 dict + JSON 存档 ----------
lock = threading.Lock()                          # 写文件时的互斥锁（第 11 章并发意识）
db: dict[int, dict] = {}
if FILE.exists():
    for item in __import__("json").loads(FILE.read_text(encoding="utf-8")):
        db[item["id"]] = item

def save() -> None:
    with lock, FILE.open("w", encoding="utf-8") as f:
        import json
        json.dump(list(db.values()), f, ensure_ascii=False, indent=2)

def next_id() -> int:
    return max(db, default=0) + 1

# ---------- 模型 ----------
class StudentIn(BaseModel):
    name: str = Field(min_length=1, max_length=32)
    score: int = Field(ge=0, le=100)

# ---------- 接口层 ----------
@app.get("/students")
def list_students(min_score: int = 0) -> list[dict]:
    """全部学生（可按最低分过滤），按成绩降序。"""
    rows = [s for s in db.values() if s["score"] >= min_score]
    return sorted(rows, key=lambda s: -s["score"])

@app.get("/students/{id}")
def get_student(id: int) -> dict:
    if id not in db:
        raise HTTPException(404, "学生不存在")
    return db[id]

@app.post("/students", status_code=201)
def create_student(s: StudentIn) -> dict:
    stu = {"id": next_id(), **s.model_dump()}
    db[stu["id"]] = stu
    save()
    return stu

@app.put("/students/{id}")
def update_student(id: int, s: StudentIn) -> dict:
    if id not in db:
        raise HTTPException(404, "学生不存在")
    db[id] = {"id": id, **s.model_dump()}
    save()
    return db[id]

@app.delete("/students/{id}", status_code=204)
def delete_student(id: int) -> None:
    if db.pop(id, None) is None:
        raise HTTPException(404, "学生不存在")
    save()
```

结构对照 Java 版（13.6 节）：Store→db dict + save()，Controller→路由函数，Pydantic→手写校验的替代。**同需求 Python 版只有一半行数**——这正是两门语言的气质差。

## 12.5 测试接口：三种方式

**① /docs 网页**（最快）：打开 <http://127.0.0.1:8000/docs>，每个接口 Try it out 直接发。

**② curl**：

```
curl -X POST http://127.0.0.1:8000/students -H "Content-Type: application/json" -d "{\"name\":\"张三\",\"score\":90}"
curl http://127.0.0.1:8000/students
curl http://127.0.0.1:8000/students/1
curl -X DELETE http://127.0.0.1:8000/students/1
curl http://127.0.0.1:8000/students/999          # {"detail":"学生不存在"} + 404
curl -X POST http://127.0.0.1:8000/students -H "Content-Type: application/json" -d "{\"name\":\"\",\"score\":200}"
# 422 + 字段级错误明细（Pydantic 自动产出）
```

**③ pytest + TestClient**（不启服务器直接测，工程标准做法）：

```
pip install pytest httpx
```

```python
# test_api.py
from fastapi.testclient import TestClient
from student_api import app

client = TestClient(app)

def test_create_and_get():
    r = client.post("/students", json={"name": "张三", "score": 90})
    assert r.status_code == 201
    sid = r.json()["id"]
    assert client.get(f"/students/{sid}").json()["name"] == "张三"

def test_not_found():
    assert client.get("/students/999").status_code == 404

def test_validation():
    r = client.post("/students", json={"name": "", "score": 999})
    assert r.status_code == 422
```

`pytest` 一跑——**接口测试不需要真启动服务器**，TestClient 直接进程内调用，秒级完成回归。

### 依赖项 Depends：FastAPI 的"依赖注入"

接口越来越多个性需求（都要连数据库、都要验证 API Key），复制粘贴进每个函数？FastAPI 的答案是**依赖项**——声明式地"给接口挂公共前置"：

```python
from fastapi import Depends, HTTPException, Header

def verify_token(x_api_key: str = Header(default="")) -> str:
    """依赖：从请求头取 API Key 并校验。返回值会注入给接口。"""
    if x_api_key != "secret123":
        raise HTTPException(401, "无效的 API Key")
    return x_api_key

@app.get("/admin/stats", dependencies=[Depends(verify_token)])
def stats() -> dict:
    """受保护接口：没带对 Key 根本进不来。"""
    return {"total": len(db)}

@app.get("/secure/data")
def secure_data(key: str = Depends(verify_key)):     # 还能接收依赖的返回值
    return {"key": key}
```

三种挂法：`dependencies=[Depends(...)]` 只做守门（不取返回值）；`参数 = Depends(...)` 既守门又取返回值；`app = FastAPI(dependencies=[...])` 全局挂。对照 Java 教程 13.6 的 Spring 依赖注入：**同一个"依赖抽象、框架接线"思想**，Spring 用容器扫描注解，FastAPI 用函数签名——你已经在两套框架里见过同一种设计，这就是"学第二框架只要半天"的原因。

### 项目结构建议：从单文件到包

接口超过五个、模型超过三个，单文件就该拆了：

```
student-api/
├── .venv/
├── requirements.txt          # fastapi, uvicorn, httpx, pytest
├── main.py                   # 只做：创建 app、挂路由、uvicorn 入口
├── app/
│   ├── __init__.py
│   ├── models.py             # Pydantic 模型（StudentIn 等）
│   ├── store.py              # 数据层（db dict + save/load）
│   └── routers/
│       ├── __init__.py
│       └── students.py       # /students 路由组
└── tests/
    └── test_api.py
```

拆分神器是 **APIRouter**：

```python
# app/routers/students.py
from fastapi import APIRouter

router = APIRouter(prefix="/students", tags=["学生"])

@router.get("")                       # 最终路径 /students（prefix 已带上）
def list_students(): ...

# main.py
from fastapi import FastAPI
from app.routers import students

app = FastAPI()
app.include_router(students.router)   # 路由组整挂
```

对照 Java 教程三层分包（controller/service/repository）——分层思想完全一致，Python 版更轻：**models（数据形状）/ store（存取）/ routers（接口）**，service 层在玩具规模可并入 router，业务复杂了再拆。Git 首提交把 `.venv/` 写进 `.gitignore`（第 9 章守则）。

## 12.6 异步初见（选读）

把 `def` 换成 `async def` 即进入异步世界：处理函数在等待 IO（数据库、外部 API）时**让出线程去服务别的请求**，少量线程撑起海量并发（对照 Java 教程 11.5 的虚拟线程，殊途同归）：

```python
import httpx

@app.get("/weather")
async def weather():
    async with httpx.AsyncClient() as client:        # 异步 HTTP 客户端
        r = await client.get("https://httpbin.org/get", timeout=10)
        return r.json()
```

规矩：`async def` 里不能用同步阻塞调用（会卡住整个事件循环），IO 要用异步库（httpx/异步数据库驱动）。纯 CPU 计算留普通 `def`（FastAPI 会自动丢进线程池）。入门结论：**IO 密集接口用 async def，其余用 def，别过度设计**。

### 三小件收尾：CORS、静态文件、后台任务

三个真实服务迟早要用的配置，FastAPI 各只要几行：

```python
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# ① CORS：允许浏览器前端（跑在别的域名）调用本 API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],    # 前端开发服务器的地址；生产写具体域名
    allow_methods=["*"],
    allow_headers=["*"],
)

# ② 静态文件：让服务顺便发图片/前端构建产物
app.mount("/static", StaticFiles(directory="static"), name="static")
# 访问 /static/logo.png 即返回 static/logo.png

# ③ 后台任务：响应先回去，慢活儿慢慢干
def send_welcome_email(addr: str) -> None:
    ...                                          # 假装发邮件（耗时 3 秒）

@app.post("/register", status_code=201)
def register(email: str, bg: BackgroundTasks):
    bg.add_task(send_welcome_email, email)      # 注册接口不等邮件，先返回
    return {"registered": email}
```

CORS 是浏览器同源策略的放行单（没配它，跨域前端调用会被浏览器拦截——新手部署前后端分离时的第一大坑）；`mount` 让 FastAPI 兼职静态服务器；BackgroundTasks 处理"响应要快、活儿可以慢"的场景（发邮件、写日志）。对照 Java 教程：三个概念一一对应（CORS 配置、静态资源映射、@Async）——**框架不同，问题域相同**。

## 12.7 部署一瞥

开发用 `uvicorn main:app --reload`；生产去掉 --reload 并多开进程：

```
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

更正式的方案：`gunicorn -k uvicorn.workers.UvicornWorker -w 4 main:app`，前面挂 Nginx 反向代理，服务器上 `pip install -r requirements.txt` 复现环境（第 9 章 venv 在服务器同样适用）。

### 前后端全链路一图流（系列收官图）

最后把两套教程（Java/Python）的 Web 知识合成一张全景图——这是一条请求的完整一生：

```
浏览器/爬虫/手机 App
   │  HTTP 请求（方法 + 路径 + JSON/表单）
   ▼
┌─ Web 服务器层 ─────────────────────────────────┐
│ Nginx（静态资源/反向代理，可选）                  │
│   ▼                                            │
│ 应用服务器：uvicorn（Python）/ Tomcat（Java）     │ ← 12.7 / Java 13.6
│   ▼                                            │
│ 框架路由：@app.get / @GetMapping                │ ← 匹配路径，分发到函数
│   ▼                                            │
│ 中间件/过滤器：CORS、认证（API Key/Session）      │ ← 12.6 三小件 / Java Security
│   ▼                                            │
│ 参数解析与校验：Pydantic / Spring Validation     │ ← 非法请求 422 挡在这里
│   ▼                                            │
│ 业务层（Service/路由函数）—— 真正的逻辑           │
│   ▼                                            │
│ 数据层：dict/SQLite/MySQL（占位符防注入！）        │ ← 10.4 / PHP 教程第 9 章
└────────────────────────────────────────────────┘
   │  JSON 响应（200/201/404/422/500）
   ▼
客户端渲染展示
```

读完整个系列再回看这张图，每一层你都见过实物：爬虫（第 11 章）是左侧"客户端"的一种；JSON 是第 10 章的序列化；防注入是本章 sqlite3 `?` 占位符……**Web 开发没有新问题，只有老问题的不同岗位**。下一站无论去哪（数据库深入、前端、运维），这张图都是地图。

### API 联调清单：从"我能跑"到"别人能用"

写给自己跑和交给别人用，中间隔一张验收清单（交付前逐条过）：

**功能面**

- [ ] 每个接口正例通过（200/201/204 状态码正确）；
- [ ] 反例齐全：参数缺失/类型错（422）、资源不存在（404）、业务冲突（409）；
- [ ] 分页/过滤参数有边界校验（limit=99999 不会拖死服务）。

**健壮面**

- [ ] 所有磁盘 IO（存档）在服务重启后数据还在；
- [ ] 无全局可变状态裸奔（多 worker 部署时 dict 共享问题——生产要换数据库的原因）；
- [ ] 日志覆盖错误路径（12.6 / 第 10 章 logging）。

**协作面**

- [ ] /docs 上每个接口有 summary/docstring（自动显示在文档里）；
- [ ] 错误响应格式统一（{"detail": "..."}），前端能统一弹错；
- [ ] requirements.txt 与 README（启动命令、接口列表）提交进 Git。

这张清单与 Java 教程 13 章的工程习惯清单、C 教程的工程习惯清单一脉相承——**框架和语言换了，"可交付"的标准不换**。对照检查你的第 12.4 项目：前两条功能面现在就能过，健壮面第一条就是"换数据库"的动机——每一次不达标项都是下一步的学习路标。

## 12.8 小结

- 框架替你管 HTTP；FastAPI = 注解驱动 + 自动文档 + 异步；
- 路径参数 `{id}`、查询参数默认值、Pydantic BaseModel 请求体 + Field 校验；
- HTTPException 报业务错误（404 等）；返回 dict 自动 JSON；
- /docs 交互文档免费送；TestClient + pytest 进程内测接口；
- async def 异步 IO，普通 def CPU 任务；部署 uvicorn --workers。

## 练习 12

1.（概念）Pydantic 校验失败时谁负责返回 422？你该在什么情况下抛 HTTPException？
2.（编程）给 API 加 `GET /stats`：返回学生总数、平均分、最高分（空库时平均分返回 None→null）。
3.（编程）加 `GET /students/top/{n}`：前 n 名（n 用路径参数 + Field 校验 1~100）。
4.（编程）给 create 接口加"重名拒绝"：同名学生已存在时返回 409 Conflict。
5.（操作）为 12.4 全部接口写 TestClient 测试（创建→查询→更新→删除→404 全链路）。

## 参考答案

**1.** 框架（Pydantic）自动返回 422——你只声明类型与 Field 规则；HTTPException 用于**业务级错误**（资源不存在 404、冲突 409 等）。分工：格式/类型错误归框架，业务规则归你。

**2.**

```python
@app.get("/stats")
def stats():
    if not db:
        return {"total": 0, "avg": None, "max": None}
    scores = [s["score"] for s in db.values()]
    return {"total": len(scores),
            "avg": sum(scores) / len(scores),
            "max": max(scores)}
```

**3.**

```python
@app.get("/students/top/{n}")
def top(n: int) -> list[dict]:
    if not 1 <= n <= 100:
        raise HTTPException(422, "n 需在 1~100")
    rows = sorted(db.values(), key=lambda s: -s["score"])
    return rows[:n]
```

**4.**

```python
@app.post("/students", status_code=201)
def create_student(s: StudentIn) -> dict:
    if any(stu["name"] == s.name for stu in db.values()):
        raise HTTPException(409, "学生已存在")
    stu = {"id": next_id(), **s.model_dump()}
    db[stu["id"]] = stu
    save()
    return stu
```

**5.**

```python
def test_full_lifecycle():
    r = client.post("/students", json={"name": "李四", "score": 66})
    sid = r.json()["id"]
    assert client.put(f"/students/{sid}",
                      json={"name": "李四", "score": 99}).json()["score"] == 99
    assert client.delete(f"/students/{sid}").status_code == 204
    assert client.get(f"/students/{sid}").status_code == 404
```

**[▲ 返回目录](#toc)**

---

<a id="appendix"></a>

# 附录：排错手册 · 速查表 · 进阶路线

> 三部分：A. 常见报错对照与排查流程；B. 速查表；C. 进阶路线与书单。

---

## A.1 编译/运行期报错对照

| 报错（Traceback 最后一行）                               | 意思           | 最常见原因                                        |
| -------------------------------------------------------- | -------------- | ------------------------------------------------- |
| `SyntaxError: invalid syntax`                            | 语法不对       | 中文标点、漏冒号、括号不配对（看报错行的上一行）  |
| `IndentationError: expected an indented block`           | 缩进错误       | if/def 后没缩进；Tab 与空格混用                   |
| `NameError: name 'x' is not defined`                     | 名字未定义     | 拼写错、先使用后定义、忘了 import                 |
| `ModuleNotFoundError: No module named 'x'`               | 模块不存在     | 没装（pip install）、venv 没激活、文件名撞标准库  |
| `TypeError: can only concatenate str (not "int") to str` | 类型不拼接     | input() 返回 str 没转 int；f-string 忘了 f        |
| `TypeError: 'NoneType' object is not callable`           | 调用了 None    | `x = lst.sort()` 的经典事故（原地方法返回 None）  |
| `ValueError: invalid literal for int()`                  | 值不合法       | int("abc")、int("12.5")（先 float 再 int）        |
| `IndexError: list index out of range`                    | 下标越界       | len 与 range 边界心算错                           |
| `KeyError: 'xxx'`                                        | 字典键不存在   | 用 get(k, 默认) 或先 in 判断                      |
| `AttributeError: 'str' object has no attribute 'append'` | 类型没这方法   | 变量类型和想象的不一样（用 type() 查）            |
| `UnboundLocalError`                                      | 局部变量未赋值 | 函数内读了"定义在后面"的变量；或改全局没写 global |
| `RecursionError: maximum recursion depth exceeded`       | 递归超深       | 忘出口；改循环或 lru_cache                        |
| `PermissionError`                                        | 权限不够       | 文件被占用/只读，或写到系统目录                   |
| `UnicodeDecodeError`                                     | 解码失败       | 文件不是 UTF-8（GBK 文件用 encoding="gbk" 读）    |

### 排查四步

1. Traceback **从最后一行往上读**：类型 → 消息 → 出错行；
2. 出错行打印中间值：`print(type(x), repr(x))` 看真实类型与内容；
3. 缩小范围：注释掉可疑代码二分定位，或复制到新文件最小复现；
4. 求助五件套：目标、完整 Traceback、最小代码、已尝试、环境（python --version）。

## A.3 高频 FAQ 五连

**Q1：pip install 成功了，运行还是 ModuleNotFoundError？**
九成是"装错环境"：你装进了 A venv，运行用的是系统 Python（或另一个 venv）。确认法：在运行环境里 `python -m pip list` 看包在不在。守则：**装包前先激活 venv，或干脆用 `python -m pip install`**（保证 pip 和 python 是同一套）。

**Q2：中文输出乱码 / SyntaxError: invalid character？**
分两种：源文件里有中文标点（`，` `；` `：` 混进代码）→ 报 SyntaxError，换成英文标点；运行输出乱码 → 老版 cmd 编码问题，`chcp 65001` 或改用 Windows Terminal/VS Code 内置终端。

**Q3：修改了 .py 文件，运行结果没变？**
三查：① 保存了吗（编辑器右上角圆点）；② 运行的是不是同名文件（cwd 错位）；③ --reload 没开（uvicorn 改代码要重启）。与 C 教程"忘了重新编译"同族——**改完存盘、跑对文件**。

**Q4：函数里改全局变量为什么不起作用？**
没写 `global`（第 4 章 LEGB）：函数内对名字赋值默认新建局部变量。但更好的修法是别用全局——参数进出或封装成类。

**Q5：for 循环里删元素为什么跳元素？**
迭代器按位置前进，删除后后面的元素前移补位，迭代器跳过了紧邻的下一个。解法口诀：**要过滤，用推导式重建；要边遍历边删，先收集待删清单**（与 Java 的 ConcurrentModificationException、PHP 的 foreach 引用删除同族问题——三套教程反复敲打的同一个坑）。

## A.4 新手误区清单（对照自查）

| 误区                        | 真相                                             | 出处       |
| --------------------------- | ------------------------------------------------ | ---------- |
| "Python 没有类型"           | 有类型且强类型，只是**运行时**检查               | 第 1、2 章 |
| "`b = a` 复制了列表"        | 只是贴标签，复制要 copy/deepcopy                 | 第 2、5 章 |
| "`x += 1` 在函数里改全局"   | 没有 global 就是新建局部变量                     | 第 4 章    |
| "`lst.sort()` 后接收返回值" | sort 原地返回 None，要新列表用 sorted            | 第 5 章    |
| "列表推导式只是语法糖"      | 它还带来作用域隔离（不泄漏循环变量）             | 第 5 章    |
| "异常处理 = try 包住一切"   | 具体类型 + EAFP 哲学，裸 except 是事故源         | 第 10 章   |
| "装饰器很难"                | 它只是"接函数返函数"的高阶函数 + @ 糖            | 第 8 章    |
| "多线程能加速一切"          | GIL 下 CPU 密集要多进程，IO 密集才轮到线程/async | 第 12 章   |

十条里中三条以上，说明你该重读对应章节；十条全避开的，你已经超过大半网络教程作者。

**Q6：为什么大家说"Python 慢"？我该在意吗？**
慢在解释执行与动态类型（对比 C/Java），但：脚本/爬虫/数据处理的大头是 IO 等待，瓶颈在网络磁盘不在语言；热点代码有第三方 C 扩展（numpy/pandas）托底；真要快还有 PyPy/Cython/C 扩展三条路。**决策原则：先写对（Python 的强项），测量证明慢了，再针对性优化或局部换语言。**

**Q7：学 Python 2 老教程/老代码有影响吗？**
有但可控。Python 2（2020 年已停止维护）与 3 的主要差异：print 是语句、/ 是整数除法、字符串默认 ASCII、xrange/iteritems 等改名。**读老代码按"考古模式"**（见到 print "x" 自动翻译成 print("x")）；**写代码一律 Python 3**——本教程全部语法基于 3.10+，时代正确。

## B.1 速查表

**f-string 格式**：`{x:.2f}` 两位小数、`{x:>10}` 右对齐、`{x:,}` 千分位、`{x=}` 调试输出（变量名+值）。

**容器方法**（list）：`append insert extend remove pop sort reverse index count`；（dict）：`get setdefault keys values items update pop`；（str）：`strip split join replace startswith find upper lower`。

**推导式三件**：`[表达式 for x in 序列 if 条件]`、`{k: v for ...}`、`(惰性版 for ...)`。

**collections**：`Counter().most_common(n)`、`defaultdict(list/int)`、`deque().appendleft/popleft`。

**pathlib**：`Path.exists/is_dir/glob/rglob、/ 拼接、read_text/write_text、mkdir(parents=True, exist_ok=True)`。

**json**：`dumps(obj, ensure_ascii=False, indent=2) / loads / dump / load`。

**内置函数 top**：`len range enumerate zip sorted sum max min any all map filter open print input type isinstance isinstance`。

**virtualenv 流**：`python -m venv .venv → activate → pip install → pip freeze > requirements.txt → deactivate`。

## B.2 速查表补充：内置函数与模块导航

**读代码速译表**（老项目/其他作者风格的常见变体 → 标准等价）：

| 见到                        | 含义                   | 现代写法                 |
| --------------------------- | ---------------------- | ------------------------ |
| `%s %d` % (a, b)            | 老式格式化             | f"{a} {b}"               |
| `dict.has_key(k)`           | Python 2 判断键        | `k in d`                 |
| `xrange(10)`                | Python 2 惰性 range    | `range(10)`              |
| `items.sort(cmp=...)`       | Python 2 比较函数      | `sorted(items, key=...)` |
| `class C(object):`          | Python 2 新式类        | `class C:`               |
| `u"文本"`                   | Unicode 前缀（2 时代） | `"文本"`                 |
| `os.path.join(a, b)`        | 老路径拼接             | `Path(a) / b`            |
| `@staticmethod` + self 误传 | 装饰器错位             | 看方法是否用到实例状态   |

**内置函数高频 20 个**（无需 import）：`print input len range type isinstance int str float bool list dict set tuple sum min max sorted sorted/reversed enumerate zip abs round any all open`。

**异常家族**：`Exception`（基类）→ `ValueError TypeError NameError IndexError KeyError AttributeError FileNotFoundError ZeroDivisionError RuntimeError`；捕获优先写具体类型。

**关键字速览**（33 个，认识即可）：`def return if elif else for while break continue pass import from as class try except finally raise with lambda global nonlocal in is not and or del yield assert async await match case`。

**彩蛋函数**：`help() dir() id() hash() repr() format() vars()` ——REPL 自省家族，第 1 章的三件套还有这些亲戚。

**模块地图**（按"想做某事"查）：文件路径 `pathlib` / 数据文件 `json csv sqlite3` / 时间 `datetime time` / 数学随机 `math random statistics` / 文本 `re string textwrap` / 系统 `os sys subprocess shutil` / 迭代函数 `itertools functools collections` / 调试 `logging traceback pdb timeit` / 网络 `http requests(三方)`。

**pip 常用**：`install / uninstall / list / show / freeze / install -r requirements.txt / install -i 镜像`。

**venv 三步**：`python -m venv .venv` → `激活` → `deactivate`；**pytest 三步**：`pip install pytest` → 写 `test_*.py` 里 assert → 命令行 `pytest`。

## B.3 PEP 8 风格速查（写出"像样"的 Python）

PEP 8 是 Python 官方风格指南，社区一致遵循——风格统一让所有 Python 代码"看起来是一家写的"。核心条款速查：

```python
# 命名
module_name        # 模块：蛇形
ClassName          # 类：大驼峰
function_name      # 函数/变量：蛇形
CONSTANT_VALUE     # 常量：全大写下划线
_private_var       # 前置下划线：内部使用约定

# 缩进与空格
def f(a, b=1, *args, **kwargs):     # 逗号后一个空格；= 两边不空格（默认参数）
    if x > 0 and y < 10:            # 运算符两侧一个空格
        return x * y
    return None

# 换行：一行不超过 79~99 字符；长表达式用括号隐式续行
result = some_function(argument_one, argument_two,
                       argument_three)
long_condition = (first_condition
                  and second_condition)

# 导入顺序：标准库 → 三方库 → 本地模块，组间空行
import json
import sys

import requests

from myproject import utils

# 字符串：统一双引号或单引号（项目内一致）；f-string 优先
greeting = f"Hello, {name}"

# 比较
if x:                 # 而非 if x == True:
if x is None:         # 而非 if x == None:
```

工具化执行（不靠自觉）：`pip install ruff` → `ruff check .`（检查）+ `ruff format .`（自动格式化）——**2024 年起 Python 社区的格式化事实标准**，一条命令让代码瞬间合规。VS Code 保存自动格式化配置一次，终身受益。风格的意义不是洁癖：统一格式让 diff 只显示逻辑变化（code review 不被空格噪音淹没）、团队零磨合、你读任何开源库都毫无违和感。

## C. 进阶路线

**第一步：补全语言**。并发多线程（threading/asyncio 深入）、元类、描述符、打包发布（pyproject.toml、PyPI 发包）、uv/poetry 现代工具链。书：《Fluent Python》（Pythonic 圣经，第 8 章三大件的无限展开版）。

**第二步：数据/工程方向二选一深挖**：

- **数据分析/AI**：pandas → matplotlib → scikit-learn → PyTorch（本教程第 5、10 章是直接前置）；
- **后端**：SQLAlchemy（ORM）→ 数据库迁移 → Redis → Docker → 把第 12 章 API 部署上云。

**第三步：测试与质量**。pytest 深入（fixture/参数化/mock）、mypy 全量类型检查、ruff（linter）、CI（GitHub Actions 跑测试）——"会写"到"敢上线"的差距全在这一步。

**书单速记**：《Python 编程：从入门到实践》（补趣味项目）→《Fluent Python》（进阶必读）→ 《Effective Python》（90 条军规）→ 方向书（pandas/PyTorch/FastAPI 官方文档本身质量极高，读文档是这个生态的正道）。

**三个月时间表**：第 1 月过完第 1~7 章 + 每章练习；第 2 月第 8~12 章，独立完成批处理与爬虫各一个；第 3 月 FastAPI 项目接数据库 + Docker 部署 + GitHub Actions。每阶段有产出，知识才留得住。

### 本系列横向对照表

读完全系列（C / Java / Python）后，这张表帮你把"同一件事的三种方言"钉在一起：

| 概念       | C                    | Java                   | Python                   |
| ---------- | -------------------- | ---------------------- | ------------------------ |
| 变量本质   | 盒子（有类型的格子） | 盒子 / 引用遥控器      | 贴在对象上的标签         |
| 字符串     | char 数组 + \0       | String 不可变对象      | str 不可变序列           |
| 数组/容器  | 定长数组             | List/Set/Map 接口体系  | list/dict/set 字面量直造 |
| 手动内存   | malloc/free          | JVM GC                 | 引用计数 + GC（全自动）  |
| 编译方式   | AOT 编译成机器码     | 编译成字节码跑 JVM     | 解释执行（字节码 + PVM） |
| 错误处理   | 返回值/goto          | checked/unchecked 异常 | 全 unchecked + EAFP      |
| 多返回值   | 指针参数带出         | record 打包            | return 元组解包          |
| 排序       | qsort + 比较函数     | Comparator 回调        | sorted(key=lambda)       |
| 文件 IO    | fopen/fclose         | try-with-resources     | with open                |
| Web 框架章 | —                    | Spring Boot            | FastAPI                  |

三套教程的"灵魂章节"其实是一个主题：**数据在内存里长什么样、怎么流动**。语言只是方言，画面才是普通话——这张表留在手边，切换语言时先对表再动手。

### 与系列前作的衔接：学完 Python 去哪

本系列已完成的 C / Java 教程各自留了进阶路线，Python 卷的读者按兴趣接力：

- **已有 C 基础**：Python 是最好的"第二语言"——把 C 教程第 11 章的 Makefile 工程心法换成第 9 章 venv/pytest，把指针思维换成标签思维，两周即可双修；
- **已有 Java 基础**：第 12 章 FastAPI 对照 Spring Boot（同需求少一半代码）、第 11 章爬虫对照 HttpClient——Java 工程师学 Python 的主战场是**数据与自动化**（pandas/脚本），那正是 Java 不擅长的；
- **三修齐了**：去读《代码大全》或参与一个真实的开源项目——语言只是方言（见附录对照表），工程能力才是普通话。

最后一句：Python 的生态把"造轮子"变成"选轮子"——**语言基础决定你会不会用，标准库与社区决定你用得多快**。把第 8、9 章的 Pythonic 内功打牢，剩下的是不断接新轮子的快乐。

**[▲ 返回目录](#toc)**

---

（完 · Happy Pythoning）