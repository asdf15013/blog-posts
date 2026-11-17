---
title: HTML/CSS
date: 2026-11-17
category: 基础知识
tags: [前端]
---

# 前端 HTML/CSS 教程

> 适用对象：有编程/安全经验、需要看懂和修改前端页面的读者
> 风格：每个概念先讲"它在干嘛"，配比喻和"安全视角"贴士；现代 CSS 讲到中级

---

## 目录

0. [写给安全人员的前端课](#0-写给安全人员的前端课)
1. [HTML 页面的骨架](#1-html-页面的骨架)
2. [HTML 全家桶](#2-html-全家桶)
3. [CSS 页面的皮肤](#3-css-页面的皮肤)
4. [选择器](#4-选择器)
5. [盒模型](#5-盒模型)
6. [文本与颜色](#6-文本与颜色)
7. [显示与定位](#7-显示与定位)
8. [Flex 布局](#8-flex-布局)
9. [Grid 布局](#9-grid-布局)
10. [响应式设计](#10-响应式设计)
11. [过渡与动画](#11-过渡与动画)
12. [现代特性与实用技巧](#12-现代特性与实用技巧)
13. [实战项目](#13-实战项目)
14. [调试与速查](#14-调试与速查)
15. [学习路线](#15-学习路线)

---

## 0. 写给安全人员的前端课

**前端 = 浏览器里你能看到、能点的一切**。HTML 是骨架（结构），CSS 是皮肤（样式），JavaScript 是肌肉（行为）——本篇只讲前两块：**看懂页面结构、看懂样式规则、能动手改**。

> **通俗理解**：网页是一栋精装修的房子。HTML 是承重墙和房间布局（哪里是卧室哪里是门），CSS 是墙漆地板家具（长什么样），JS 是水电智能系统（动起来）。

### 0.1 为什么安全人员要懂前端

| 场景                | 前端知识怎么用                             |
| ------------------- | ------------------------------------------ |
| 看页面源码          | 认出注释里的敏感信息、隐藏表单、可疑接口   |
| 分析登录框          | 知道表单往哪发、参数叫什么、前端校验了什么 |
| 改请求/构造 payload | 理解 DOM 结构才能精准定位注入点            |
| 写钓鱼/测试页面     | 亲手搭一个以假乱真的表单页                 |
| 读 JS 混淆前的 HTML | 大量"前端校验"逻辑直接写在标签属性里       |

### 0.2 学习心法（先记住三句话）

1. **HTML 描述"有什么"，CSS 描述"长什么样"**——两者完全解耦，改样式不动结构
2. **浏览器渲染你写的代码之前，会先"修正"它**——标签没闭合它帮你补，所以别依赖浏览器宽容，写规范
3. **前端的一切对用户都是公开的**——JS/HTML/CSS 全部可读可改，任何"只在浏览器里做的安全检查"都等于没做

> 🛡️ **安全视角**：本篇在相关位置穿插 `🛡️` 贴士，只讲前端知识本身如何服务于安全工作，不展开漏洞利用细节。

---

## 1. HTML 页面的骨架

### 1.1 HTML 是什么

**HTML（HyperText Markup Language）**：超文本标记语言。它不是编程语言——**没有逻辑，只有"标记"**：给内容贴标签，声明"这一块是标题、那一块是段落、这是个按钮"。

```
<p>你好</p>
↑开标签  ↑内容  ↑闭标签    ← 一个完整的"元素"
```

### 1.2 标准文档结构（每个网页的模板）

```html
<!DOCTYPE html>              ← 声明：这是 HTML5（必须第一行）
<html lang="zh-CN">          ← 根元素，一切内容的祖先
  <head>                     ← 头部：给浏览器看的信息（不显示在页面上）
    <meta charset="UTF-8">   ← 字符编码（没有它中文变乱码）
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面标题</title>   ← 浏览器标签页上那行字
    <link rel="stylesheet" href="style.css">  ← 外挂 CSS
  </head>
  <body>                     ← 主体：用户看到的一切内容
    <h1>Hello</h1>
    <p>这是一个段落。</p>
  </body>
</html>
```

**head vs body 一句话**：head 是"户口档案"（标题/编码/引入的资源），body 是"房间陈设"（真内容）。

### 1.3 标签的属性（Attribute）

标签可以带"出厂参数"：

```html
<a href="https://example.com" target="_blank">链接文字</a>
  ↑属性名="属性值"
```

- 属性写在**开标签**里，格式 `name="value"`
- 通用属性（所有标签都能带）：`id`（唯一编号）、`class`（分类标记，CSS 的挂钩）、`style`（内联样式）、`title`（悬浮提示）、`data-*`（自定义数据）

> 🛡️ **安全视角**：`id`/`class`/`data-*` 经常"自曝家门"——`class="debug-panel"`、`data-api="/admin/v2"`、`id="backup-url"` 都是信息收集金矿。看源码先扫属性。

### 1.4 常用文本标签

| 标签                | 作用                         | 示例                           |
| ------------------- | ---------------------------- | ------------------------------ |
| `<h1>`~`<h6>`       | 六级标题（h1 最大）          | `<h1>主标题</h1>`              |
| `<p>`               | 段落                         | `<p>一段文字</p>`              |
| `<span>`            | 行内小容器（包几个字做样式） | `<span class="hl">重点</span>` |
| `<strong>` / `<em>` | 强调（粗体/斜体，有语义）    | `<strong>重要</strong>`        |
| `<b>` / `<i>`       | 纯样式粗/斜（无语义）        | `<b>视觉加粗</b>`              |
| `<br>`              | 换行（自闭合）               | `第一行<br>第二行`             |
| `<hr>`              | 水平分割线                   | `<hr>`                         |
| `<!-- -->`          | 注释（不渲染）               | `<!-- TODO -->`                |
| `<pre>`             | 保留空格换行的原始文本       | 贴代码用                       |
| `<code>`            | 标记代码片段                 | `<code>ls -la</code>`          |

> 🛡️ **安全视角**：`<!-- -->` 注释**在浏览器"查看源代码"里原样可见**。搜索 `password、key、admin、test、backup、debug、TODO` 是读源码第一步。

### 1.5 链接与图片

```html
<a href="https://example.com/page" target="_blank" rel="noopener">去某站</a>
<img src="photo.jpg" alt="照片描述" width="300">
```

- `href`：目的地。支持绝对/相对 URL、`#锚点`（跳到页面内某处）、`mailto:`、`javascript:` 伪协议
- `target="_blank"`：新标签页打开
- `alt`：图片加载失败时的替代文字 + 无障碍朗读内容
- `img` 是**自闭合**标签（没有内容，不需要闭标签）

**相对 vs 绝对路径**（读项目结构必备）：

```
src="images/cat.jpg"      相对：当前目录下
src="/images/cat.jpg"     从网站根目录出发
src="../images/cat.jpg"   上级目录（../ 可以连续上跳——路径遍历的语法基础）
```

### 1.6 列表

```html
<ul>                     <!-- 无序列表（圆点） -->
  <li>苹果</li>
  <li>香蕉</li>
</ul>
<ol>                     <!-- 有序列表（数字） -->
  <li>第一步</li>
  <li>第二步</li>
</ol>
```

---

## 2. HTML 全家桶

### 2.1 表格（读后台系统必备）

```html
<table>
  <tr>                     <!-- table row 行 -->
    <th>姓名</th>          <!-- table header 表头（默认加粗居中） -->
    <th>部门</th>
  </tr>
  <tr>
    <td>张三</td>          <!-- table data 单元格 -->
    <td>研发</td>
  </tr>
</table>
```

结构化写法（老系统常见）：`<thead>`（表头区）、`<tbody>`（数据区）、`<tfoot>`（合计区）。`colspan="2"` 跨 2 列、`rowspan="2"` 跨 2 行。

### 2.2 表单（前端的核心业务，重点章节）

表单是**用户输入的载体**——登录、搜索、上传全靠它：

```html
<form action="/api/login" method="POST">
  <label for="user">用户名</label>
  <input type="text" id="user" name="username" placeholder="请输入用户名" required>

  <label for="pwd">密码</label>
  <input type="password" id="pwd" name="password" minlength="6" maxlength="20">

  <input type="hidden" name="csrf_token" value="abc123">
  <input type="hidden" name="role" value="guest">

  <select name="city">
    <option value="010">北京</option>
    <option value="021" selected>上海</option>
  </select>

  <textarea name="comment" rows="3">默认内容</textarea>

  <input type="checkbox" name="agree" value="yes" checked> 同意协议
  <input type="radio" name="gender" value="m"> 男
  <input type="radio" name="gender" value="f" checked> 女

  <button type="submit">登录</button>
</form>
```

**必须吃透的四个点**：

1. **`name` 就是发给后端的参数名**——提交时浏览器打包成 `username=xxx&password=yyy`（GET 拼 URL，POST 装请求体）。**抓包里看到的参数，源头就在这里**
2. **`type` 决定输入框形态**，见下表
3. **`action` + `method` = 请求的 URL 和方式**
4. **前端限制全是摆设**——`required`、`maxlength`、`min`、`pattern` 这些校验发生在**浏览器里**，用抓包工具直接构造请求即可全部绕过；真正的校验必须在服务器重做

> 🛡️ **安全视角**：`<input type="hidden">` 是"看不见但仍会提交"的字段——价格、权限、角色、跳转地址藏在里面是经典设计缺陷。读表单先扫 hidden。

**input 全类型速查**：

| type       | 形态                 | type       | 形态                     |
| ---------- | -------------------- | ---------- | ------------------------ |
| `text`     | 文本框               | `password` | 密码（打点）             |
| `email`    | 邮箱（自带格式校验） | `number`   | 数字（min/max/step）     |
| `date`     | 日期选择器           | `file`     | 文件选择（配 `enctype`） |
| `checkbox` | 复选框               | `radio`    | 单选框（同 name 一组）   |
| `hidden`   | 隐藏域               | `submit`   | 提交按钮                 |
| `color`    | 颜色选择             | `range`    | 滑块                     |

### 2.3 多媒体

```html
<video src="demo.mp4" controls width="480"></video>
<audio src="bgm.mp3" controls loop></audio>
<video poster="封面图.jpg" controls><source src="a.webm" type="video/webm"></video>
```

`controls` 显示播放控件；`<source>` 可写多个格式让浏览器自选。

### 2.4 语义化标签（HTML5 的"房间命名"）

HTML5 用"有意义的名字"替代满屏 `<div>`：

```html
<header>   页头（logo/导航）
<nav>      导航栏
<main>     主内容区（每页一个）
<section>  内容分区
<article>  独立成篇的内容（一篇文章/一条评论）
<aside>    侧边栏
<footer>   页脚（版权/备案号）
```

> **为什么要有语义**：给搜索引擎（SEO）和屏幕阅读器（无障碍）讲"结构故事"。**读别人页面时，语义标签=免费的结构地图**：一眼定位 header/footer/main。

### 2.5 iframe 与容器

```html
<iframe src="https://other.com/embed" width="600" height="400"></iframe>
```

**iframe = 页面里再嵌一个独立浏览器窗口**——第三方登录框、嵌入播放器、广告都是它。嵌进去的内容与外层页面**相互隔离**（同源策略）。

> 🛡️ **安全视角**：iframe 的两个经典话题——①钓鱼站用透明 iframe 套真站界面；②合法站被恶意 iframe 嵌套导致"点击劫持"（防御靠响应头 `X-Frame-Options`/`CSP frame-ancestors`，即 HTML 之外的事）。看到不明 iframe 先看 `src` 指向哪。

### 2.6 全局属性与特殊字符

**全局属性四件套**：

| 属性     | 用途                                 | 例子                  |
| -------- | ------------------------------------ | --------------------- |
| `id`     | 全页唯一编号（JS/CSS 定位）          | `id="submit-btn"`     |
| `class`  | 分类标记（**可多个**，CSS 主要挂钩） | `class="btn btn-red"` |
| `style`  | 内联样式（优先级最高）               | `style="color:red"`   |
| `data-*` | 自定义数据（JS 读）                  | `data-userid="42"`    |

**特殊字符转义（实体）**：`<`、`>`、`&` 在 HTML 里有特殊含义，想"显示"它们本身要写实体：

| 想显示             | 写法     | 名字               |
| ------------------ | -------- | ------------------ |
| `<`                | `&lt;`   | less than          |
| `>`                | `&gt;`   | greater than       |
| `&`                | `&amp;`  | ampersand          |
| `"`                | `&quot;` | quote              |
| 空格（连续不合并） | `&nbsp;` | non-breaking space |

> 🛡️ **安全视角**：实体就是"防注入的原始形态"——用户输入被转成实体再输出，浏览器就只当文字显示不当标签执行。**没转义的用户输入直出 = 标签可被注入**，这是注入类漏洞的语法根源。反过来读源码时，看到满屏 `&lt;script&gt;` 说明该处做了输出转义。

---

## 3. CSS 页面的皮肤

### 3.1 CSS 是什么

**CSS（Cascading Style Sheets）**：层叠样式表。只干一件事：**告诉浏览器"选中的元素，长什么样"**。

```css
选择器 { 属性: 值; }
h1     { color: red; font-size: 32px; }
```

### 3.2 三种引入方式（优先级从低到高）

```html
<!-- ① 外部样式表（工程标准做法） -->
<link rel="stylesheet" href="style.css">

<!-- ② 内部样式表（单页演示用） -->
<style>
  p { color: blue; }
</style>

<!-- ③ 内联样式（写死在标签上，优先级最高，慎用） -->
<p style="color: green;">我是绿色</p>
```

> **"层叠"（Cascade）的含义**：多条规则撞车时，按**来源优先级 + 选择器优先级 + 书写顺序**裁决——这是 CSS 的裁判规则，见 4.5。

### 3.3 基础语法与注释

```css
/* 这是 CSS 注释（没有 // 注释！） */
body {
  margin: 0;              /* 每条声明 = 属性: 值; */
  background: #f5f5f5;
}
```

---

## 4. 选择器

**选择器 = "选中哪些元素"的模式匹配语法**——CSS 的瞄准镜，JS（`querySelector`）和爬虫解析也用同一套，一学三用。

### 4.1 基础选择器

| 选择器  | 含义                      | 示例                           |
| ------- | ------------------------- | ------------------------------ |
| `p`     | 所有 `<p>` 元素           | `p { margin: 0 }`              |
| `.card` | 所有 class 含 card 的元素 | `.card { border: 1px solid }`  |
| `#main` | id 为 main 的那个元素     | `#main { width: 960px }`       |
| `*`     | 所有元素                  | `* { box-sizing: border-box }` |

### 4.2 组合选择器

| 写法         | 含义                               | 记忆       |
| ------------ | ---------------------------------- | ---------- |
| `.nav li`    | .nav **里面**所有 li（不管多少层） | 后代：空格 |
| `.nav > li`  | .nav **直接儿子** li               | 子代：`>`  |
| `h2 + p`     | 紧跟在 h2 后面的第一个 p           | 相邻：`+`  |
| `h2 ~ p`     | h2 后面所有同级 p                  | 兄弟：`~`  |
| `h1, h2, h3` | 三种都选中                         | 分组：逗号 |

### 4.3 属性选择器

```css
input[type="password"]  { background: #eee; }   /* 密码框统一底色 */
a[href^="https"]        { color: green; }        /* href 以 https 开头 */
a[href$=".pdf"]         { }                      /* 以 .pdf 结尾 */
a[href*="admin"]        { outline: 1px solid red } /* 包含 admin */
```

> 🛡️ **安全视角**：`input[type="hidden"]`、`a[href*="token"]` 这类选择器可直接用在浏览器 F12 控制台 `document.querySelectorAll()` 里——**秒扫页面里的隐藏域和带 token 的链接**。

### 4.4 伪类与伪元素

**伪类（冒号）= 元素的"状态/位置"**：

```css
a:hover        { color: red; }      /* 鼠标悬停 */
input:focus    { outline: blue; }   /* 获得焦点（正在输入） */
li:first-child { font-weight: bold }/* 第一个孩子 */
li:nth-child(2n)   { }              /* 偶数个（斑马纹） */
li:nth-child(3n+1) { }              /* 第 1、4、7…个 */
p:not(.intro)  { }                  /* 不含 intro 类的 p */
input:checked  { }                  /* 被勾选 */
tr:hover       { background: #fafafa }  /* 表格悬停高亮 */
```

**伪元素（双冒号）= 元素的"虚拟部分"**：

```css
p::first-line  { }                          /* 第一行 */
.icon::before  { content: "→ "; }           /* 内容前面插入 */
.icon::after   { content: " ←"; }           /* 内容后面插入 */
input::placeholder { color: #999; }         /* 占位提示文字 */
```

### 4.5 优先级（Specificity）——谁说了算

同一条样式被多条规则命中时，裁判规则（从强到弱）：

```
内联 style=""  >  #id  >  .class/伪类/属性  >  元素/伪元素
（1000 分）      （100 分）  （10 分）           （1 分）
```

- **分数相同 → 后写的赢**（所以引入顺序有意义）
- **`!important` = 一票否决**，压倒一切（`color: red !important`）——调试时用它验证"这条样式是不是被别的规则盖了"，正式代码少用
- **继承**：文字类属性（color/font）会从父元素传给孩子；盒模型类（width/margin）不继承

---

## 5. 盒模型

**CSS 的地基**。页面上每个元素都是一个"快递盒"：

```
┌───────────── margin（外边距：盒子与盒子的距离）─────────────┐
│  ┌───────────── border（边框）──────────────────────────┐  │
│  │  ┌───────── padding（内边距：内容与边框的距离）─────┐ │  │
│  │  │  ┌───────── content（内容：文字/图片）────────┐ │ │  │
│  │  │  │              300 × 100                     │ │ │  │
│  │  │  └────────────────────────────────────────────┘ │ │  │
│  │  └───────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

```css
.box {
  width: 300px; height: 100px;   /* content 的尺寸 */
  padding: 20px;                 /* 内边距：一个值=四周；两个值=上下 左右；四个值=上右下左（顺时针） */
  border: 2px solid #333;        /* 宽度 样式 颜色 */
  margin: 10px auto;             /* auto = 左右自动平分 = 水平居中 */
}
```

### 5.1 box-sizing：新手第一坑

默认规则（`content-box`）下：**width 只算 content**，实际占位 = width + padding×2 + border×2——设了 `width: 100%` 再加 padding 直接撑爆容器。

```css
* { box-sizing: border-box; }   /* 现代标准姿势：width = content+padding+border 的总宽 */
```

> **一句话：写页面先加全局 `border-box`，从此 width 就是"盒子总宽"，所见即所得。**

### 5.2 margin 细节

- **水平居中**：块级元素 `margin: 0 auto`（要有确定 width）
- **负 margin**：允许负值，可用于微调重叠（hack 手段）
- **margin 塌陷/合并**：相邻两个盒子的上下 margin 会**取较大者合并**；父元素与第一个子元素的 margin 会"穿出来"——新手常见的"间距对不上"元凶。绕过法：改用 padding、或父元素加 `overflow: hidden`

---

## 6. 文本与颜色

### 6.1 字体三件套

```css
body {
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif;  /* 字体栈：依次降级，最后兜底无衬线 */
  font-size: 16px;      /* 常见单位：px 固定 / rem 随根字号缩放（响应式推荐） */
  font-weight: 400;     /* 100~900 或 bold(700)/normal(400) */
  line-height: 1.6;     /* 行高：无单位数字=字号倍数（1.5~1.8 最舒服） */
}
```

### 6.2 文本样式速查

```css
text-align: center | left | right | justify;   /* 水平对齐 */
text-decoration: none | underline | line-through;   /* 下划线（去链接下划线=none） */
text-transform: uppercase | lowercase | capitalize; /* 大小写转换 */
letter-spacing: 2px;      /* 字间距 */
white-space: nowrap;      /* 禁止换行（配合 overflow 做省略号） */
text-overflow: ellipsis;  /* 溢出显示省略号（三件套见下） */
```

**单行省略号三件套**（背下来，列表卡片高频）：

```css
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### 6.3 颜色四种写法

```css
color: red;                  /* 关键词 */
color: #ff0000;              /* 十六进制（可缩写 #f00；8位=带透明） */
color: rgb(255, 0, 0);       /* RGB；rgba(...,0.5)=带透明度 */
color: hsl(0, 100%, 50%);    /* 色相/饱和度/亮度（调色更直观） */
```

**opacity vs rgba**：`opacity: 0.5` 把**整个元素连内容一起**变半透明；`rgba` 只让**颜色本身**透明。

### 6.4 背景

```css
.banner {
  background-color: #222;
  background-image: url(bg.jpg);
  background-size: cover;         /* cover=铺满裁边 / contain=完整显示 */
  background-position: center;    /* 位置 */
  background-repeat: no-repeat;
  background: #222 url(bg.jpg) center/cover no-repeat;   /* 简写一行流 */
}
```

---

## 7. 显示与定位

### 7.1 display：元素的"户口性质"

| 值              | 行为                          | 代表元素            |
| --------------- | ----------------------------- | ------------------- |
| `block`         | 独占一行，可设宽高            | div/p/h1            |
| `inline`        | 排在行内，**宽高无效**        | span/a/strong       |
| `inline-block`  | 排在行内**但**可设宽高        | button/img 天生如此 |
| `none`          | **从渲染树移除**（不占位）    | —                   |
| `flex` / `grid` | 容器切换布局模式（第 8/9 章） | —                   |

### 7.2 三种"消失"的区别

| 写法                 | 占位？ | 能交互？     | 用途       |
| -------------------- | ------ | ------------ | ---------- |
| `display: none`      | ❌ 不占 | ❌            | 真隐藏     |
| `visibility: hidden` | ✅ 占   | ❌            | 隐身占位   |
| `opacity: 0`         | ✅ 占   | ✅ **可点击** | 透明但活着 |

> 🛡️ **安全视角**：`display:none` 的表单字段照样随表单提交、`opacity:0` 的按钮照样能被点到——**"看不见"和"不存在"完全是两回事**。审计页面时搜这三兄弟。

### 7.3 position：脱离文档流的四种姿势

**文档流**：元素默认按 HTML 顺序从上到下、从左到右排队排布。position 就是"从队伍里出来/微调"的授权：

| 值               | 行为                                               | 比喻                            |
| ---------------- | -------------------------------------------------- | ------------------------------- |
| `static`（默认） | 正常排队                                           | 普通群众                        |
| `relative`       | **原地不动**，但可用 top/left 微调偏移             | 站在原地探身子                  |
| `absolute`       | **脱离队伍**，飞到"最近的非 static 祖先"的指定位置 | 离队贴到墙上某点                |
| `fixed`          | 脱离文档流，**相对浏览器窗口**定位（滚动也不动）   | 贴在玻璃上（客服按钮/吸顶导航） |
| `sticky`         | 平时正常排队，滚到阈值处"粘住"                     | 表头滚动吸顶                    |

**经典套路：absolute 必须配 relative 父元素**：

```css
.card    { position: relative; }        /* 定锚点 */
.badge   { position: absolute; top: 8px; right: 8px; }   /* 贴到卡片右上角 */
```

### 7.4 z-index 与 overflow

- `z-index: 999`：重叠时的层级（谁盖谁），只在**有定位的元素**上生效——层级大战时从"共同祖先"查起，别盲目加 9999
- `overflow: visible | hidden | auto | scroll`：内容溢出怎么办（`hidden` 裁掉、`auto` 需要时出滚动条）；裁剪+定宽高也是"图片圆角头像"的基础

---

## 8. Flex 布局

**现代布局的第一主力**——一行 CSS 解决"横排、对齐、分布"，彻底取代 float 时代。

### 8.1 启用与两根轴（理解 Flex 的钥匙）

```css
.container { display: flex; }
```

启用后，容器里的**直接子元素**变成 flex 项目，横排成一队。所有对齐规则都围绕**两根轴**：

```
主轴（main axis）＝队伍排队的方向（默认：水平，从左到右）
交叉轴（cross axis）＝与主轴垂直的方向（默认：竖直）
```

> **记忆口诀：justify 管"队伍方向"的分布，align 管"垂直方向"的对齐。** 改了 flex-direction 后两轴互换，但口诀不变。

### 8.2 容器属性六件套

```css
.container {
  display: flex;
  flex-direction: row;        /* 主轴方向：row 横 / column 竖 */
  justify-content: flex-start;/* 主轴分布：start / center / end /
                                 space-between（两端对齐）/ space-around / space-evenly */
  align-items: stretch;       /* 交叉轴对齐：stretch(拉满) / center / start / end */
  flex-wrap: wrap;            /* 放不下换行（nowrap 默认硬挤） */
  gap: 16px;                  /* 项目间距（现代写法，告别 margin hack） */
}
```

`justify-content` 五兄弟图解（最常用的三个）：

```
flex-start:    [■][■][■]................
center:      ........[■][■][■]..........
space-between: [■]........[■]........[■]   （首尾贴边，中间均分）
```

### 8.3 项目属性（孩子身上的）

```css
.item {
  flex: 1;        /* 简写：有剩余空间就按比例分（flex-grow:1 的意思） */
  flex: 0 0 200px;/* 不伸缩，固定 200px 宽 */
  order: -1;      /* 调整排队顺序（默认 0，小的在前） */
  align-self: center;  /* 单独改自己的交叉轴对齐 */
}
```

**弹性伸缩直觉**：`flex: 1` 的项目 = "大家一起把剩余空间平分"；`flex: 2` = 份额是别人的两倍。

### 8.4 三个必背套路

```css
/* ① 水平垂直居中（一劳永逸） */
.center { display: flex; justify-content: center; align-items: center; }

/* ② 导航栏：logo 左、菜单右 */
.nav { display: flex; justify-content: space-between; align-items: center; }

/* ③ 自适应卡片行：放不下自动换行、每个最小 240px */
.cards { display: flex; flex-wrap: wrap; gap: 16px; }
.card  { flex: 1 1 240px; }    /* 基准 240px，可伸可缩 */
```

---

## 9. Grid 布局

**二维布局王者**：Flex 管一维（一行或一列），Grid 同时管行和列——"表格自由布局"。

### 9.1 定义网格

```css
.gallery {
  display: grid;
  grid-template-columns: 200px 1fr 1fr;   /* 三列：固定 200px + 剩余空间二等分 */
  grid-template-rows: auto auto;          /* 两行：高度随内容 */
  gap: 16px;                              /* 行列间距（一个值=行列同距） */
}
```

**`fr` 单位**：fraction（份额）——`1fr 2fr` = 剩余空间按 1:2 分，比百分比聪明（自动处理 gap）。

### 9.2 必背神组合：自适应网格

```css
/* 每列最少 240px、尽量多排；屏幕变窄自动减列——一行 CSS 实现响应式卡片墙 */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
```

拆解：`repeat(auto-fill, minmax(240px, 1fr))` = "能塞几列塞几列，每列不小于 240px，多余空间均分"。

### 9.3 跨行跨列与选择

```css
.item-big  { grid-column: span 2; }   /* 横跨 2 列（做头图） */
.item-tall { grid-row: span 2; }      /* 纵跨 2 行 */

/* 用行号精确放置（从 1 开始数） */
.sidebar { grid-column: 1; grid-row: 1 / 3; }   /* 第 1 列，第 1~3 行 */
```

### 9.4 Flex vs Grid 怎么选

| 场景                                          | 用谁                                 |
| --------------------------------------------- | ------------------------------------ |
| 导航栏、按钮组、单行内容                      | **Flex**                             |
| 卡片墙、相册、整页骨架（页头/侧栏/内容/页脚） | **Grid**                             |
| 拿不准                                        | 内容一维流动用 Flex，二维棋盘用 Grid |

> 实战中两者混用是常态：**Grid 搭大骨架，Flex 调局部**。

---

## 10. 响应式设计

**一套代码适配手机/平板/电脑**。核心思路：不盯像素，盯比例与断点。

### 10.1 三大基石

**① viewport meta（没有它手机上一切响应式都是空谈）**：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**② 相对单位**：

| 单位        | 相对谁                  | 场景                                                        |
| ----------- | ----------------------- | ----------------------------------------------------------- |
| `%`         | 父元素                  | 宽度伸缩                                                    |
| `em`        | 本元素字号              | 行高/间距跟随字号                                           |
| `rem`       | 根元素字号（默认 16px） | **全站统一缩放**（改 html 字号=整体放大缩小）               |
| `vw` / `vh` | 视口宽/高的 1%          | 满屏横幅（`height: 100vh`）                                 |
| `clamp()`   | 自适应钳制              | `font-size: clamp(16px, 4vw, 32px)` = 最小16/理想4vw/最大32 |

**③ 媒体查询（断点切换样式）**：

```css
/* 移动优先：默认写手机版样式，屏幕变宽再增强 */
.container { width: 100%; padding: 12px; }

@media (min-width: 768px) {         /* ≥ 平板 */
  .container { width: 720px; margin: 0 auto; }
}
@media (min-width: 1024px) {        /* ≥ 桌面 */
  .container { width: 960px; }
}
```

**移动优先** = 默认样式给手机写，`min-width` 逐级加戏——代码更短、手机性能更好，是现代标准姿势。

### 10.3 响应式图片两招

```html
<!-- ① CSS 端：限宽不超容器、高度自适应 -->
<img src="a.jpg" style="max-width: 100%; height: auto;">
<!-- ② 语义化写法 -->
<img src="a.jpg" style="width: 100%; aspect-ratio: 16/9; object-fit: cover;">
```

- `aspect-ratio: 16/9`：锁定宽高比（现代神器，告别 padding-top hack）
- `object-fit: cover`：图片按"填满裁边"缩放（相当于背景的 cover，**头像/卡片图必配**）

---

## 11. 过渡与动画

### 11.1 transition：状态切换的"补间"

元素从状态 A 变到状态 B（如 hover），CSS 自动补出中间的渐变过程：

```css
.btn {
  background: #333;
  transition: background 0.3s ease, transform 0.2s;
  /*            变什么   花多久  缓动曲线（四属性简写：属性 时长 曲线 延迟） */
}
.btn:hover {
  background: #0070f3;
  transform: translateY(-2px);   /* 配合 transform 做微动效 */
}
```

**注意**：`transition` 只管"变化过程"，必须**有状态变化触发**（hover/JS 改类名）。`all` 能不用就不用（性能差且误伤）。

### 11.2 transform：不惊动别人的变形

```css
transform: translate(10px, -5px);   /* 位移（不挤开别的元素！） */
transform: scale(1.1);              /* 放大 */
transform: rotate(45deg);           /* 旋转 */
transform: translateX(-50%) rotate(45deg);   /* 可组合 */
```

> **transform 的特殊之处**：不触发布局重排，纯渲染层操作，**性能最好**——动画优先用 transform + opacity。

### 11.3 @keyframes：自主动画

```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.loading {
  animation: spin 1s linear infinite;   /* 名字 时长 曲线 次数(infinite=无限) */
}
```

经典加载圈、呼吸灯、弹跳提示全是这一套。`animation-delay`/`animation-direction: alternate`（往返）按需加。

---

## 12. 现代特性与实用技巧

### 12.1 CSS 自定义属性（变量）

```css
:root {                      /* :root = html 元素，全局变量挂这 */
  --primary: #0070f3;
  --radius: 8px;
  --spacing: 16px;
}
.btn {
  background: var(--primary);
  border-radius: var(--radius);
  padding: 10px var(--spacing);
}
```

- `--名字` 定义，`var(--名字)` 使用；**JS 可读写**（`getComputedStyle` / `style.setProperty`）
- **主题切换**：换 `.dark` 类时重定义一组变量即可全站换肤

### 12.2 calc() 与现代尺寸

```css
width: calc(100% - 40px);        /* 混合单位运算（% 减 px） */
height: calc(100vh - 64px);      /* 满屏减导航高度——吸顶布局标配 */
min-height: min(80vh, 600px);    /* 取小/取大：min() max() */
```

### 12.3 圆角/阴影/滤镜三件套

```css
.card {
  border-radius: 12px;                          /* 圆角（50%=圆形） */
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);       /* x偏移 y偏移 模糊 颜色 */
  filter: blur(2px) grayscale(0.8);             /* 模糊/灰度等滤镜 */
}
```

### 12.4 顺手好用的现代属性速览

| 属性                                   | 干嘛                         |
| -------------------------------------- | ---------------------------- |
| `gap`（flex/grid）                     | 项目间距，替代 margin hack   |
| `aspect-ratio`                         | 锁宽高比                     |
| `object-fit`                           | 图片填充策略                 |
| `user-select: none`                    | 禁止选中文字                 |
| `cursor: pointer`                      | 手型光标                     |
| `scroll-behavior: smooth`              | 锚点平滑滚动                 |
| `:root` + `prefers-color-scheme: dark` | 跟随系统深色模式（媒体查询） |

### 12.5 居中方案全家福（面试/实战双高频）

```css
/* 方案一：Flex（首选） */
.parent { display: flex; justify-content: center; align-items: center; }

/* 方案二：Grid（最短） */
.parent { display: grid; place-items: center; }

/* 方案三：absolute + transform（已知场景：弹窗遮罩） */
.child { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }

/* 方案四：margin auto（水平居中块级元素） */
.child { width: 300px; margin: 0 auto; }
```

---

## 13. 实战项目

两个完整可运行项目：**保存为 `.html` 双击即可打开**。目标不是抄，是理解每行为什么这么写。

### 13.1 项目一：登录页（表单 + 居中卡片 + 渐变背景）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>登录</title>
  <style>
    * { box-sizing: border-box; margin: 0; }

    body {
      min-height: 100vh;                       /* 至少满屏高 */
      display: flex;                           /* 方案一居中 */
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea, #764ba2);   /* 对角渐变 */
      font-family: "Microsoft YaHei", sans-serif;
    }

    .card {
      width: 360px;
      background: #fff;
      border-radius: 12px;
      padding: 40px 32px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }

    .card h1 { font-size: 22px; text-align: center; margin-bottom: 28px; }

    .field { margin-bottom: 18px; }
    .field label  { display: block; font-size: 13px; color: #555; margin-bottom: 6px; }
    .field input {
      width: 100%;                             /* border-box 下=卡片内容宽 */
      padding: 10px 12px;
      border: 1px solid #d0d7de;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .field input:focus {                       /* 聚焦高亮 */
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    }

    button {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 8px;
      background: #667eea;
      color: #fff;
      font-size: 15px;
      cursor: pointer;
      transition: transform 0.15s, background 0.2s;
    }
    button:hover { background: #5a6fd6; transform: translateY(-1px); }
    button:active { transform: translateY(0); }

    .tip { text-align: center; font-size: 12px; color: #999; margin-top: 16px; }
  </style>
</head>
<body>
  <form class="card" action="/api/login" method="POST">
    <h1>账号登录</h1>
    <div class="field">
      <label for="user">用户名</label>
      <input id="user" name="username" type="text" required autocomplete="username">
    </div>
    <div class="field">
      <label for="pwd">密码</label>
      <input id="pwd" name="password" type="password" required minlength="6">
    </div>
    <input type="hidden" name="next" value="/dashboard">
    <button type="submit">登 录</button>
    <p class="tip">忘记密码请联系管理员</p>
  </form>
</body>
</html>
```

**逐段看懂**：body 用 Flex 居中卡片；`linear-gradient` 做渐变背景；`input:focus` 做聚焦光圈（transition 让它顺滑）；hidden 字段 `next` 是登录后跳转地址（真实站点常见字段）。**改一改、抓个包，表单知识的闭环就完成了。**

### 13.2 项目二：个人主页（导航 + Hero + 响应式卡片墙）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>我的主页</title>
  <style>
    :root { --primary: #0070f3; --gray: #f5f6f8; --radius: 12px; }
    * { box-sizing: border-box; margin: 0; }
    body { font-family: "Microsoft YaHei", sans-serif; color: #1f2329; }

    /* ── 导航：Flex 经典左右布局 ── */
    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: #fff;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      position: sticky; top: 0;               /* 滚动吸顶 */
      z-index: 10;
    }
    .nav .logo { font-weight: bold; font-size: 18px; }
    .nav ul { display: flex; gap: 20px; list-style: none; }
    .nav a { text-decoration: none; color: #333; transition: color 0.2s; }
    .nav a:hover { color: var(--primary); }

    /* ── Hero：满屏横幅 ── */
    .hero {
      min-height: 60vh;
      display: grid; place-items: center;      /* Grid 一行居中 */
      text-align: center;
      background: var(--gray);
    }
    .hero h1 { font-size: clamp(28px, 5vw, 48px); margin-bottom: 12px; }  /* 字号自适应 */
    .hero p  { color: #666; }

    /* ── 卡片墙：自适应 Grid（本篇 9.2 神组合） ── */
    .section { max-width: 1024px; margin: 0 auto; padding: 48px 24px; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 20px;
    }
    .card {
      background: #fff;
      border: 1px solid #eaecef;
      border-radius: var(--radius);
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
    .card img   { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
    .card .body { padding: 16px; }
    .card h3 { font-size: 16px; margin-bottom: 8px; }
    .card p  { font-size: 13px; color: #777; line-height: 1.6; }

    footer { text-align: center; padding: 24px; color: #aaa; font-size: 13px; }
  </style>
</head>
<body>
  <nav class="nav">
    <span class="logo">MyHome</span>
    <ul>
      <li><a href="#top">首页</a></li>
      <li><a href="#works">作品</a></li>
      <li><a href="#contact">联系</a></li>
    </ul>
  </nav>

  <header class="hero" id="top">
    <div>
      <h1>你好，我是 XXX</h1>
      <p>安全研究 / 代码审计 / 什么都写一点</p>
    </div>
  </header>

  <section class="section" id="works">
    <h2 style="margin-bottom: 24px;">最新文章</h2>
    <div class="grid">
      <div class="card">
        <img src="https://picsum.photos/400/225?1" alt="封面">
        <div class="body"><h3>文章标题一</h3><p>摘要文字，两行以内自动省略……</p></div>
      </div>
      <div class="card">
        <img src="https://picsum.photos/400/225?2" alt="封面">
        <div class="body"><h3>文章标题二</h3><p>摘要文字。</p></div>
      </div>
      <div class="card">
        <img src="https://picsum.photos/400/225?3" alt="封面">
        <div class="body"><h3>文章标题三</h3><p>摘要文字。</p></div>
      </div>
    </div>
  </section>

  <footer id="contact">© 2026 MyHome · 仅供学习</footer>
</body>
</html>
```

**覆盖了本篇哪些知识点**：变量（:root）、sticky 吸顶导航、Flex 空间分布、Grid 单行居中（place-items）、`clamp()` 自适应字号、**自适应卡片墙**、`aspect-ratio` + `object-fit` 图片处理、卡片悬浮微动效。**缩放浏览器窗口看卡片列数变化，就是响应式的直观感受。**

---

## 14. 调试与速查

### 14.1 F12 开发者工具（改前端的手术台）

| 面板         | 用法                                                         |
| ------------ | ------------------------------------------------------------ |
| **Elements** | 看实时 DOM 树；双击文字/属性可直接改（改的是内存副本，刷新即还原）；右侧 Styles 看命中规则，被划掉的=被覆盖 |
| **Console**  | `document.querySelectorAll('input[type=hidden]')` 扫隐藏域；改样式试验 `document.querySelector('.card').style.padding='40px'` |
| **Network**  | 看表单实际发了什么请求/参数（对照第 2.2 的 name）            |
| **Sources**  | 断点调试 JS（本篇之外的事，知道入口即可）                    |

**调试 CSS 的万能流程**：Elements 选中元素 → Styles 里勾选/取消规则看变化 → 找到"谁覆盖了谁"（划线的是败者）→ 改出来 → 拷回源码。

### 14.2 高频速查表

**居中**

```css
display:flex; justify-content:center; align-items:center;   /* 全能 */
display:grid; place-items:center;                            /* 最短 */
position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);  /* 弹窗 */
```

**常见布局一行流**

```css
* { box-sizing: border-box; }                                 /* 全局第一行 */
.nav { display:flex; justify-content:space-between; align-items:center; }
.grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(240px,1fr)); gap:16px; }
.ellipsis { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.sticky { position:sticky; top:0; z-index:10; }
img.fit { width:100%; aspect-ratio:16/9; object-fit:cover; }
```

**易错点 TOP5**

1. 忘写 `box-sizing: border-box` → 一加 padding 就爆宽
2. `inline` 元素设宽高无效 → 改 `inline-block` 或 `block`
3. absolute 找错参照物 → 父元素忘加 `position: relative`
4. z-index 不生效 → 元素没有定位（static）
5. 动画卡顿 → 别动 width/height/top，改用 `transform` + `opacity`

---

## 15. 学习路线

### 15.1 本篇知识的前后衔接

```
本篇（HTML/CSS 骨架与皮肤）
  → JavaScript 入门（让页面动起来、读懂前端加密逻辑）
    → 浏览器安全模型（同源策略/CSP/Cookie 属性——安全视角的深入方向）
```

### 15.2 练手建议

1. **抄改 > 从零写**：看中的页面 F12 把 HTML/CSS 抠下来改样式，理解最快
2. 两个实战项目各改三遍：换配色（练变量）、换布局（练 Flex/Grid）、加响应式断点（练媒体查询）
3. 每天看一个真实网站问自己三个问题：导航怎么居中的？卡片怎么自适应的？这个效果用什么属性做的？
4. 遇到没见过的属性 → MDN（developer.mozilla.org/zh-CN）查，最权威

### 15.3 给安全人员的三句收尾

1. **前端无秘密**：HTML/CSS/JS 全部明文可读，"只在浏览器里"的检查约等于不存在
2. **结构即情报**：语义标签、class 命名、hidden 字段、注释——页面结构本身就是一张地图
3. **会改才会测**：能手写登录页，才能看懂目标站的登录逻辑；能熟练 F12，前端侦查效率翻倍

---

*完 —— HTML 告诉你有什么，CSS 告诉你什么样；而对安全人员来说，它们一起告诉你：这里能做什么。*