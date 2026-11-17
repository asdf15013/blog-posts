---
title: JavaScript教程
date: 2026-11-17
category: 基础知识
tags: [前端]
---

# 前端 JavaScript 教程

> 适用对象：有编程经验、需要看懂和分析网页脚本的安全人员（配套前端 HTML/CSS 篇风格）
> 范围：语言基础 → DOM/事件 → 异步/网络 → **前端加密与混淆分析** → 实战项目
> 深度：全面但务实——每个主题讲"是什么、怎么用、分析时怎么对付"，不深入实现原理

---

## 目录

0. [写给安全人员的 JS 课](#0-写给安全人员的-js-课)
1. [语法基础](#1-语法基础)
2. [函数](#2-函数)
3. [对象与数组](#3-对象与数组)
4. [核心 API 工具箱](#4-核心-api-工具箱)
5. [正则表达式](#5-正则表达式)
6. [DOM 操作](#6-dom-操作)
7. [事件](#7-事件)
8. [浏览器存储](#8-浏览器存储)
9. [异步与网络请求](#9-异步与网络请求)
10. [前端加密与混淆分析](#10-前端加密与混淆分析)
11. [实战项目](#11-实战项目)
12. [调试与速查](#12-调试与速查)
13. [学习路线](#13-学习路线)

---

## 0. 写给安全人员的 JS 课

**JavaScript = 网页的"行为层"**：HTML 定结构，CSS 定样式，JS 让页面动起来——响应点击、校验表单、发请求、加密数据、画图表。

> **通俗理解**：HTML 是剧本的"人物表"，CSS 是"服装化妆"，JS 是"演员的表演"——用户每点击一次按钮、每敲一个字，背后都是 JS 在跑代码。

### 0.1 为什么安全人员必须懂 JS

| 场景         | JS 知识怎么用                                           |
| ------------ | ------------------------------------------------------- |
| 读页面逻辑   | 登录校验、权限判断、跳转控制全在 JS 里                  |
| 破前端加密   | 密码 md5、请求签名、token 生成的核心都在 JS             |
| 分析接口     | fetch/axios 请求的构造、参数加密逻辑                    |
| 挖客户端漏洞 | DOM 操作不当 = DOM XSS；postMessage 滥用 = 跨域消息泄露 |
| 识别危险代码 | `eval`、`document.write`、动态拼 HTML 都是热点          |

### 0.2 JS 在哪跑、怎么跑

```html
<!-- 三种引入方式（同 CSS） -->
<script src="app.js"></script>      <!-- 外部文件 -->
<script> console.log('hi'); </script>  <!-- 内嵌 -->
<button onclick="alert('x')">点我</button>  <!-- 内联事件属性 -->
```

**自己动手跑 JS 的三个途径**：

1. **F12 Console**：直接敲代码立即执行（分析首选）
2. **Node.js**：命令行 `node test.js` 跑本地脚本（无浏览器环境，没有 `document`）
3. **HTML 里写 `<script>`**：完整页面调试

> 🛡️ **安全视角**：Console 是你的"脚本试验场"——页面里看到的任何函数都可以在这里直接调用（第 10 章的核心打法）。

### 0.3 三句话心法

1. **JS 是单线程的**——一次只干一件事，所以才有"异步"这套机制（第 9 章）
2. **JS 的世界万物皆对象**——字符串、数组、函数都是对象，都能挂属性和方法
3. **前端代码对用户 100% 公开**——所有加密逻辑都"加密在明文里"，只是加了门槛

---

## 1. 语法基础

### 1.1 变量：let / const / var

```js
let a = 1;          // 声明可变变量（现代标准）
const b = 2;        // 常量：不能重新赋值（现代标准首选）
var c = 3;          // 老写法（作用域规则怪，读老代码时认识即可）
```

**规则**：默认写 `const`，需要重新赋值才用 `let`，别再写 `var`。JS 是**动态类型**——变量不固定类型，`let x = 1; x = 'abc';` 完全合法。

### 1.2 数据类型（7 种原始 + object）

| 类型        | 例子                        | 说明                                           |
| ----------- | --------------------------- | ---------------------------------------------- |
| `number`    | `1`、`3.14`、`NaN`          | 不分整数浮点；`NaN`=不是数字（计算失败的结果） |
| `string`    | `'abc'`、`` `hi ${name}` `` | 单双引号等价；反引号=模板字符串                |
| `boolean`   | `true` / `false`            |                                                |
| `undefined` | 声明了没赋值                | "还没定"                                       |
| `null`      | `let x = null`              | "故意为空"                                     |
| `object`    | `{}`、`[]`、`document`      | 复合类型总称                                   |
| `function`  | `function f(){}`            | 函数也是值！                                   |

**模板字符串**（现代高频，读代码必会）：

```js
const name = 'ctf';
console.log(`Hello, ${name}! 你第 ${1 + 1} 次登录`);   // 反引号 + ${表达式}
```

### 1.3 类型转换与 == 陷阱

```js
'5' == 5          // true！  == 会先做类型转换（大坑）
'5' === 5         // false   === 严格相等（推荐永远用它）
Number('3.14')    // 3.14    显式转数字
String(42)        // '42'
parseInt('12px')  // 12      取开头整数（parseFloat 同理）
!!'abc'           // true    转布尔（空串/0/undefined/null 是 false，其余 true）
```

### 1.4 流程控制

```js
if (score >= 90) { ... } else if (score >= 60) { ... } else { ... }

for (let i = 0; i < 10; i++) { ... }            // 经典计数循环
for (const item of arr) { ... }                 // 遍历数组值
for (const key in obj) { ... }                  // 遍历对象键名

switch (action) {
  case 'login': ...; break;
  default: ...;
}

// 三元表达式（读压缩代码高频）
const msg = ok ? '成功' : '失败';
```

> **短路求值**（读源码高频）：`a && b()`（a 真才执行 b）、`a || b()`（a 假才执行 b）、`value = x || '默认值'`。

---

## 2. 函数

### 2.1 三种写法

```js
// ① 函数声明（可先调用后声明）
function add(a, b) { return a + b; }

// ② 函数表达式（函数是值，可以存变量、传参数）
const sub = function(a, b) { return a - b; };

// ③ 箭头函数（现代主流，读新代码必会）
const mul = (a, b) => a * b;              // 单表达式可省 return 和花括号
const log = () => console.log('hi');      // 无参数
const body = x => { const t = x * 2; return t + 1; };  // 多语句要花括号+return
```

### 2.2 参数的灵活玩法

```js
function greet(name = 'guest') { return `hi ${name}`; }   // 默认参数
greet();                       // 'hi guest'

const sum = (...nums) => nums.reduce((a, b) => a + b, 0);  // 剩余参数收进数组
sum(1, 2, 3);                  // 6
```

### 2.3 作用域与闭包（读到就认识的层面）

- **作用域**：变量在哪个 `{}` 里声明，就只在里面活（`let/const`）；函数能访问外层变量
- **闭包**：函数把外层变量"打包带走"——`counter` 类的经典模式：

```js
function makeCounter() {
  let n = 0;
  return () => ++n;          // 返回的函数一直记得 n
}
const next = makeCounter();
next(); next();              // 1, 2 —— n 被藏起来了
```

> 🛡️ **安全视角**：混淆/加密代码爱用闭包藏密钥——**密钥不在全局变量里，在闭包的"口袋"里**。但只要函数能算出结果，Console 里调用它，密钥效果照样到手。

### 2.4 回调：函数当参数

```js
setTimeout(() => console.log('2秒后'), 2000);   // 定时器（异步，第 9 章）
arr.forEach(item => console.log(item));          // 数组遍历回调
btn.addEventListener('click', () => { ... });    // 事件回调（第 7 章）
```

**回调 = "到时候再调用你的函数"**——JS 事件驱动世界的基石。

---

## 3. 对象与数组

### 3.1 对象：键值对的集合

```js
const user = {
  name: 'admin',
  role: 'superadmin',                      // 属性
  login() { console.log(`${this.name} 登录了`); },   // 方法（this=当前对象）
};
user.name;              // 点号访问
user['role'];           // 方括号访问（键是变量/带特殊字符时用）
user.token = 'abc';     // 动态加属性
delete user.role;       // 删除
Object.keys(user);      // ['name', 'token', 'login'] —— 枚举键
'role' in user;         // true —— 检查属性存在
```

**this**：方法里 `this` 指调用者（`user.login()` 里 this=user）。箭头函数没有自己的 this（分析时知道这点就够）。

### 3.2 数组与工具方法（读代码最高频）

```js
const arr = [3, 1, 4, 1, 5];

arr.length;                 // 5
arr[0];                     // 3（下标从 0 开始）
arr.at(-1);                 // 5（负数从尾数）

// ── 查找/判断类 ──
arr.indexOf(4);             // 2（找不到=-1）
arr.includes(4);            // true
arr.find(x => x > 3);       // 4（第一个满足的元素）
arr.filter(x => x > 2);     // [3, 4, 5]（所有满足的）

// ── 变换类（返回新数组，不改原数组） ──
arr.map(x => x * 2);        // [6, 2, 8, 2, 10]（逐个变换）
arr.sort((a, b) => a - b);  // 升序（不加比较器会按字符串排！[1,10,2] 的坑）
arr.slice(1, 3);            // [1, 4]（切出片段，不含尾）
arr.concat([9]);            // 拼接
arr.join('-');              // '3-1-4-1-5'（拼成字符串）

// ── 修改原数组类 ──
arr.push(6); arr.pop();     // 尾部进/出
arr.shift(); arr.unshift(0);// 头部出/进
arr.splice(1, 2, 'x');      // 从下标1删2个、插入'x'（最强手术刀）

// ── 聚合类 ──
arr.reduce((sum, x) => sum + x, 0);   // 求和（累加器模式）
arr.forEach(x => console.log(x));     // 纯遍历
```

**解构与展开**（现代代码高频）：

```js
const [a, b] = [1, 2];                    // 数组解构
const { name, role = 'guest' } = user;    // 对象解构（带默认值）
const merged = [...arr1, ...arr2];        // 展开合并数组
const clone = { ...user, extra: 1 };      // 展开复制对象（顺带加字段）
```

### 3.3 JSON：前后端通用的数据格式

```js
const s = JSON.stringify(user);    // 对象 → JSON 字符串（发送前）
const o = JSON.parse(s);           // JSON 字符串 → 对象（收到后）
```

**接口返回的一定是 JSON 字符串**，要 `parse` 一次才能用点号取值——读代码看到 `.json()` 或 `JSON.parse` 就是"拆包"动作。

---

## 4. 核心 API 工具箱

### 4.1 字符串方法（分析时最高频）

```js
const s = '  Hello World  ';

s.trim();                     // 'Hello World'（去首尾空格）
s.length;                     // 15（length 是属性不是方法，无括号！）
s.toLowerCase() / toUpperCase();
s.charAt(2) / s.at(2);        // 'e'（取第 n 个字符）
s.slice(2, 7);                // 'ello '（切片，支持负数）
s.substring(2, 7);            // 同 slice 但不支持负数（老代码常见）
s.indexOf('World');           // 8
s.includes('World');          // true
s.replace('World', 'JS');     // 替换第一个；全替换用 replaceAll 或正则 g 标志
s.split(' ');                 // ['Hello', 'World']（字符串→数组）
'ab'.repeat(3);               // 'ababab'
'5'.padStart(3, '0');         // '005'（补零神器）
Array.from('abc');            // ['a','b','c']（伪数组/字符串转真数组）
```

> **字符串拼接**：`+` 号对字符串是拼接（`'a' + 1 = 'a1'`）——读加密代码时，长串 `+` 大概率是在"拼 payload"。

### 4.2 编码/解码全家（安全向必背）

```js
// URL 编码（发请求前把特殊字符转 %xx）
encodeURIComponent('a=1&b=中')   // 'a%3D1%26b%3D%E4%B8%AD'
decodeURIComponent('...')        // 反向

// Base64（注意：只认 Latin1，中文要先转码）
btoa('hello')                    // 'aGVsbG8='（编码）
atob('aGVsbG8=')                 // 'hello'（解码）
btoa(unescape(encodeURIComponent('中文')))       // 中文正确 Base64 姿势
decodeURIComponent(escape(atob('...')))         // 反向

// URI 整体编解码（保留 URL 结构字符）
encodeURI('https://a.com/路径') / decodeURI(...)
```

### 4.3 常用全局对象

```js
// Math
Math.random()          // 0~1 随机小数（不加密安全！第 8 章会打它）
Math.floor(3.9)        // 3（向下取整）
Math.max/min/abs/pow/sqrt

// Date
Date.now()             // 当前毫秒时间戳（签名/时间参数的常客）
new Date().toISOString()
new Date().getFullYear() / getMonth()（0起算）/ getHours()

// Number
Number.isInteger(3) / parseInt('ff', 16)   // 255（16进制解析）
(255).toString(16)                          // 'ff'（转16进制字符串）
```

> 🛡️ **安全视角**：看到 `Date.now()` 出现在请求参数里 = **时间戳防重放/参与签名**；`Math.random()` 用于 token = **可预测随机数**（它不是密码学随机）。

---

## 5. 正则表达式

**正则 = 字符串的模式匹配语法**，校验/搜索/替换三合一。前端读代码逃不掉。

### 5.1 创建与基本使用

```js
const re = /pattern/flags;              // 字面量（主流）
const re2 = new RegExp('pattern', 'flags');  // 构造器（模式是变量时用）

/\d+/.test('abc123');                   // true —— test：有没有匹配
'abc123'.match(/\d+/);                  // ['123', ...] —— match：提取匹配
'abc123'.replace(/\d+/, 'X');           // 'abcX'
```

### 5.2 语法速查表

| 符号      | 含义               | 符号     | 含义                      |
| --------- | ------------------ | -------- | ------------------------- |
| `\d`      | 数字 0-9           | `*`      | 0 次或多次                |
| `\w`      | 字母数字下划线     | `+`      | 1 次或多次                |
| `\s`      | 空白字符           | `?`      | 0 或 1 次（也代表非贪婪） |
| `.`       | 任意字符（除换行） | `{2,5}`  | 2~5 次                    |
| `^` / `$` | 开头 / 结尾        | `a\|b`   | a 或 b                    |
| `[abc]`   | a/b/c 任一         | `[^abc]` | **不是** a/b/c            |
| `( )`     | 分组（捕获）       | `(?: )`  | 分组（不捕获）            |

**标志位**：`g` 全局（全部匹配）、`i` 忽略大小写、`m` 多行模式。

### 5.3 高频实战模式

```js
/^1[3-9]\d{9}$/.test(phone)          // 手机号
/^[\w.-]+@[\w-]+\.\w+$/              // 简版邮箱
/flag\{.*?\}/g                        // 提取 flag{...}（.*? 非贪婪到最近 }）
/(\d{4})-(\d{2})-(\d{2})/            // 分组：match 后取 [1][2][3]
str.replace(/<\/?[^>]+>/g, '')        // 剥掉 HTML 标签
```

> 🛡️ **安全视角**：① 前端校验的正则（手机号/邮箱/密码强度）**全部可绕**——照抄到自己的 payload 工具里通过即可；② 正则 `.*` 贪婪回溯在特定写法下会造成正则 DOS（ReDoS），审计点之一；③ 提取密钥/token 常用 `match` 分组——正则是从 JS 里"抠数据"的第一工具。

---

## 6. DOM 操作

**DOM（Document Object Model）**：浏览器把 HTML 解析成的"对象树"——JS 通过它增删改查页面元素。

### 6.1 树结构与选元素

```
document（根）
└─ html
   ├─ head ── title
   └─ body ── div#app ── h1, p, button
```

```js
document.getElementById('app');            // 按 id（单数）
document.querySelector('.card > h3');      // CSS 选择器选第一个（主流写法）
document.querySelectorAll('input[type=hidden]');  // 选全部（返回 NodeList）
```

`querySelector` 直接复用 CSS 选择器语法——**你在 Elements 面板右键 Copy selector，粘进来就能用**。

### 6.2 读改元素

```js
const el = document.querySelector('#user');

// 读
el.textContent;         // 纯文本内容（安全：不解析 HTML）
el.innerHTML;           // HTML 内容（危险：会解析标签！）
el.value;               // 表单元素的当前值（input/textarea）
el.getAttribute('href');el.dataset.userid;   // 自定义 data-userid

// 改
el.textContent = '新文字';               // 改文字
el.value = '已注入';                     // 改输入框值
el.style.color = 'red';                  // 改内联样式
el.style.display = 'none';               // 藏起来
el.classList.add('active');              // 类名三连（推荐方式）
el.classList.remove('hide');
el.classList.toggle('open');             // 有则删无则加
el.setAttribute('href', 'https://x');    // 改属性
```

**textContent vs innerHTML**（安全分水岭）：`textContent` 把内容当纯文本；`innerHTML` 把内容**当 HTML 解析执行**——后者接收用户输入 = 标签注入（DOM XSS 的头号源头）。

> 🛡️ **安全视角**：审计时全局搜 `innerHTML =`、`document.write(`、`insertAdjacentHTML`，追它的数据来源——若能到 URL 参数/用户输入，就是一个 DOM 注入点。

### 6.3 创建与删除元素

```js
const div = document.createElement('div');   // 创建（还没上树）
div.textContent = '新节点';
document.body.appendChild(div);              // 挂到 body 末尾
el.remove();                                 // 删除
parent.replaceChild(newEl, oldEl);           // 替换
```

---

## 7. 事件

### 7.1 监听事件（现代标准）

```js
const btn = document.querySelector('button');

btn.addEventListener('click', (e) => {      // 事件名不带 on
  console.log('被点了', e.target);          // e = 事件对象（谁触发、坐标、键值…）
});

// 一次性事件 + 移除
btn.addEventListener('click', handler, { once: true });
btn.removeEventListener('click', handler);   // 需同一个函数引用
```

**高频事件类型速查**：

| 类别 | 事件                                                         |
| ---- | ------------------------------------------------------------ |
| 鼠标 | `click`、`dblclick`、`contextmenu`（右键）、`mouseover/out`  |
| 键盘 | `keydown`、`keyup`（`e.key` 是按的键名，如 'Enter'）         |
| 表单 | `submit`（表单提交）、`input`（每敲一个字都触发）、`change`（值变了且失焦）、`focus/blur` |
| 页面 | `load`、`DOMContentLoaded`（DOM 就绪）、`beforeunload`       |

> 🛡️ **安全视角**：读交互逻辑的两步定位法——① Elements 里选中按钮 → Event Listeners 面板看它挂了什么事件 → 跳到处理函数；② 全局搜 `addEventListener` 逐个看。**前端加密通常就发生在 submit/input 事件的处理器里。**

### 7.2 冒泡与捕获

事件触发时会**沿 DOM 树传播**：

```
捕获阶段：window → document → ... → target（从外往里）
目标阶段：target 上执行
冒泡阶段：target → ... → window（从里往外，默认在这阶段调处理器）
```

```js
el.addEventListener('click', fn, true);   // 第三参 true = 在捕获阶段响应
e.stopPropagation();                      // 中断传播（不让冒上去）
e.preventDefault();                       // 阻止默认行为（最常用：表单不提交/链接不跳转）
```

**事件委托**（利用冒泡的工程套路）：给父元素挂一个监听，靠 `e.target` 分流处理子元素——动态列表不用逐个绑定：

```js
list.addEventListener('click', (e) => {
  if (e.target.matches('.del-btn')) e.target.closest('li').remove();
});
```

### 7.3 防抖与节流（读代码认识级）

```js
function debounce(fn, delay) {          // 防抖：停手 delay 毫秒后才执行（搜索框输入）
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}
function throttle(fn, interval) { /* 节流：最多每 interval 毫秒执行一次（滚动/点击） */ }
```

---

## 8. 浏览器存储

| 存储               | 容量   | 生命周期       | 谁能读                                               |
| ------------------ | ------ | -------------- | ---------------------------------------------------- |
| **Cookie**         | 4KB    | 可设过期       | **每次请求自动带给服务器**（可设 HttpOnly 禁 JS 读） |
| **localStorage**   | 5~10MB | 永久（手动清） | 仅 JS、同源                                          |
| **sessionStorage** | 5~10MB | 标签页关闭即没 | 仅 JS、同源、单标签页                                |

```js
localStorage.setItem('token', 'abc123');
localStorage.getItem('token');          // 'abc123'
localStorage.removeItem('token');
localStorage.clear();
// 存对象要过 JSON：setItem('u', JSON.stringify(obj)) → JSON.parse(getItem('u'))

document.cookie = 'k=v; path=/; max-age=3600';   // 写 cookie（一次一条）
```

> 🛡️ **安全视角**：token 存 localStorage 而不是 HttpOnly Cookie = **XSS 偷 token 无阻力**（localStorage 是 JS 的自助仓库）。分析登录态时，先看 Application 面板三处仓库里各存了什么。Cookie 属性安全位（HttpOnly/Secure/SameSite）属于 HTTP 知识域，此处知道"JS 能不能读到"即可。

---

## 9. 异步与网络请求

### 9.1 为什么需要异步

JS **单线程**——发网络请求要等几秒，如果"傻等"，页面就卡死。所以耗时操作（请求/定时器）走**异步**：发起后不阻塞，结果好了再回调。**读异步代码的一切难度，都在"结果回来之前代码先往下跑了"这个顺序上。**

### 9.2 Promise：异步结果的"欠条"

```js
const p = fetch('/api/user');     // fetch 返回一个 Promise（欠条）
p.then(res => res.json())         // then：欠条兑现后干什么（.json() 也是异步，返回新欠条）
 .then(data => console.log(data)) // 可链式续接
 .catch(err => console.error(err));  // catch：中间任何一步失败
```

**三种状态**：pending（等待）→ fulfilled（成功，触发 then）/ rejected（失败，触发 catch）。**状态一旦定死不可再变。**

```js
Promise.all([p1, p2, p3])     // 全部成功才成功（并发合并）
Promise.race([p1, p2])        // 谁快用谁
Promise.resolve(v)            // 造一个已成功的欠条
```

### 9.3 async/await：把异步写成同步的样子（现代主流）

```js
async function loadUser() {              // async 函数里才能用 await
  try {
    const res = await fetch('/api/user'); // await = "停在这等欠条兑现"（不卡页面）
    const data = await res.json();
    return data;
  } catch (err) {                        // await 的报错用 try/catch 接
    console.error('请求失败', err);
  }
}
loadUser().then(render);                  // async 函数本身返回 Promise
```

> **读代码直觉**：看到 `await` 就当"这里等了结果再往下"，整段按同步顺序理解即可——这就是它存在的意义。

### 9.4 fetch 完整姿势（对照抓包）

```js
// GET（默认）
const res = await fetch('/api/list?page=2', {
  headers: { 'Authorization': 'Bearer eyJhbGci...' }   // 自定义请求头
});

// POST JSON（现代接口标准形态）
const res = await fetch('/api/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',          // 告诉服务器体是 JSON
    'X-Sign': sign                               // 常见：自定义签名头
  },
  body: JSON.stringify({ user: 'admin', pwd: md5(pwd) })  // 对象→JSON 字符串
});
const data = await res.json();       // 响应体拆 JSON
res.status;                          // 200/403/500
res.ok;                              // 2xx 为 true
```

**与抓包对照**：`method`→请求行、`headers`→请求头、`body`→请求体——**Network 面板里看到的每个请求，源头就是某处这样的 fetch 调用**。

### 9.5 老代码长相（认识即可）

```js
// XMLHttpRequest（XHR）：axios 库的底层，老项目多
const xhr = new XMLHttpRequest();
xhr.open('POST', '/api');
xhr.onload = () => console.log(xhr.responseText);
xhr.send('a=1');

// axios：工程常用库（返回 Promise，自动 JSON）
axios.post('/api/login', { user, pwd }).then(({ data }) => { ... });

// jQuery：老古董
$.ajax({ url, type: 'POST', success(d) { ... } });
```

> 🛡️ **安全视角**：分析接口的完整链条——Network 面板找到可疑请求 → Initiator 列点击跳到发起代码 → 顺藤摸瓜看参数怎么构造（尤其加密字段）→ Console 复现调用。**请求头里的自定义字段（X-Sign/X-Token）是"前端有加密"的最强信号。**

---

## 10. 前端加密与混淆分析

本章是安全向的核心增量：**页面把数据加密后才发请求，怎么破？**

### 10.1 前端加密的三大场景

| 场景         | 长相                                                         | 目的          |
| ------------ | ------------------------------------------------------------ | ------------- |
| **密码类**   | 登录前 `pwd` 被换成 64 位 hex（SHA256）或 172 位 Base64（RSA 块） | 防明文传输    |
| **接口签名** | 请求多出 `sign=xxx` 参数（多字段+时间戳拼一起做哈希）        | 防篡改/防重放 |
| **数据加密** | 响应体是乱码（AES/自定义 XOR），前端解密后渲染               | 防爬虫/防分析 |

**真相**：前端加密的密钥和算法**就在你眼前的 JS 里**——它是"混淆"不是"保密"，目标永远是"拖慢分析"而非"挡住分析"。

### 10.2 常见加密实现长什么样（识别库）

```js
// CryptoJS（最流行）—— 看到 CryptoJS.AES / .MD5 / .HmacSHA256
CryptoJS.MD5('abc').toString()                  // e900bb8bf5ca7355...
CryptoJS.AES.encrypt('hi', 'key123').toString() // U2FsdGVkX1+...（OpenSSL 风格盐头）
CryptoJS.enc.Base64 / .Utf8 / .Hex              // 编码转换器

// jsencrypt —— RSA（1024/2048 位长 Base64 块）
const rsa = new JSEncrypt();
rsa.setPublicKey(pubKey);
rsa.encrypt('password')            // → 长 Base64

// Web Crypto API（原生异步）
crypto.subtle.digest('SHA-256', data)    // 返回 Promise
crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data)

// 小众函数库长相：md5()、sha1()、base64.encode()、sha256() 全局函数
```

### 10.3 分析套路五步法（通用打法）

```
① 定位：Network 找到目标请求 → 看哪个参数是加密结果（乱码/定长 hex）
② 找源头：请求 Initiator 跳到代码；或全局搜索参数名、'encrypt'、'sign'、
   'md5'、'aes'、'token'（搜索是第一生产力）
③ 读逻辑：从加密函数往上读——输入是什么（明文+时间戳+盐？）、拼接顺序、
   算法名、密钥常量
④ 验证：Console 里直接调用该函数喂已知输入，比对结果
⑤ 复现：把逻辑翻译成 Python（或直接在 Console 批量调用）
```

**Console 大杀器三招**：

```js
// ① 直接调页面里的函数（找到函数名后）
window.encryptData('test')          // 看输出是否即请求里的格式

// ② Hook（劫持）函数看谁在调用、参数是什么
const orig = window.md5;
window.md5 = function(x) { console.log('md5 入参:', x); return orig(x); };
// 之后页面上任何 md5 调用都会先打印入参 —— 加密前的明文直接现形！

// ③ 断点：Sources 面板找到加密行 → 行号打断点 → 触发请求 → 看 Scope 里的变量值
```

> 🛡️ **安全视角**：**Hook 是前端分析的核武器**——不用读懂混淆代码，只要"堵在函数门口"看进出的数据。同理可 Hook `JSON.stringify`（看所有发出去的数据）、`fetch/XMLHttpRequest`（看所有请求构造）。

### 10.4 代码混淆的常见形态与还原

| 形态                                 | 长相                                                         | 还原                                                         |
| ------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **压缩 minify**                      | 变量名成 a/b/c、全挤一行                                     | Chrome Sources 的 `{}` 按钮（Pretty Print）一键美化          |
| **字符串数组型**（obfuscator.io 系） | 头部一大串字符串数组 + `atob`/异或解码函数 + `_0x3f2a('0x1f')` 取值 | 美化后在 Console 里**直接调用解码函数**拿到明文；或 Hook `atob`/解码函数 |
| **Unicode/转义**                     | `'\x61\x62'`、`\u4f60`                                       | Console 里 `eval` 字符串本身或手动解码（JS 引擎会自动解）    |
| **JSFuck**                           | `[][(![]+[])[+[]]]...`                                       | Console 粘贴回车直接执行出结果                               |
| **AAEncode**                         | `ﾟωﾟﾉ= /｀ｍ´）ﾉ ┴──┴ …`                                     | 同上，直接执行                                               |
| **控制流平坦化**                     | 巨型 `while(switch(_0xabc[++i]))` 转盘                       | 耐心按 case 顺序读；或动调看执行序列                         |
| **自护（debugger 死循环/自检）**     | 格式化后行为异常、无限 debugger                              | 对 `debugger` 语句右键 Never Pause Here；或 Hook 掉检测函数  |

**实战优先级**：能 Hook 就别硬读——**目标是数据，不是读懂代码本身**。

### 10.5 前端加密的通用弱点（出题/审计视角）

- 密钥硬编码在 JS/HTML/请求里（搜 `key`、`secret`、16/32 位奇怪常量）
- 纯前端校验（签名算法公开 = 签名可伪造）
- `Math.random()` 参与 token/密钥生成（可预测）
- 加密逻辑在闭包/全局任何地方都可被 Console 调用复现

---

## 11. 实战项目

**目标**：手写一个"带前端加密的登录页"——**即会被分析的目标，也是分析工具**。保存为 `.html` 双击运行，F12 全程可断点调试。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>加密登录 Demo</title>
  <style>
    * { box-sizing: border-box; margin: 0; }
    body { min-height: 100vh; display: flex; justify-content: center; align-items: center;
           background: #1a1d24; font-family: "Microsoft YaHei", sans-serif; color: #eee; }
    .card { width: 380px; background: #23272f; border-radius: 12px; padding: 36px 30px;
            box-shadow: 0 8px 32px rgba(0,0,0,.4); }
    h1 { font-size: 20px; margin-bottom: 24px; text-align: center; }
    input { width: 100%; padding: 10px 12px; margin-bottom: 14px; border: 1px solid #3a3f4b;
            border-radius: 8px; background: #2b303a; color: #eee; outline: none; }
    input:focus { border-color: #667eea; }
    button { width: 100%; padding: 12px; border: none; border-radius: 8px;
             background: #667eea; color: #fff; cursor: pointer; }
    button:hover { background: #5a6fd6; }
    .msg { margin-top: 14px; font-size: 13px; min-height: 18px; }
    .msg.ok { color: #4ade80; }  .msg.err { color: #f87171; }
    .log { margin-top: 18px; padding: 12px; background: #171a20; border-radius: 8px;
           font-size: 12px; color: #9ca3af; word-break: break-all; }
  </style>
</head>
<body>
  <form class="card" id="loginForm">
    <h1>SHA-256 加密登录 Demo</h1>
    <input id="user" placeholder="用户名" autocomplete="username">
    <input id="pwd" type="password" placeholder="密码" autocomplete="current-password">
    <button type="submit">登 录</button>
    <div class="msg" id="msg"></div>
    <div class="log" id="log">提交日志将显示在这里</div>
  </form>

  <script>
    /* ── 工具：SHA-256（原生 Web Crypto API，异步）── */
    async function sha256Hex(str) {
      const buf = await crypto.subtle.digest('SHA-256',
                    new TextEncoder().encode(str));
      return Array.from(new Uint8Array(buf))            // 字节数组
                  .map(b => b.toString(16).padStart(2, '0'))  // 每字节转2位hex
                  .join('');
    }

    /* ── 工具：伪签名（演示"多字段拼接+哈希"的签名套路）── */
    async function makeSign(payload, ts) {
      const salt = 'demo_salt_2026';                    // 硬编码盐（真实站点的通病）
      return await sha256Hex(`${payload.user}|${ts}|${salt}`);
    }

    /* ── 表单提交处理 ── */
    document.getElementById('loginForm')
      .addEventListener('submit', async (e) => {
        e.preventDefault();                              // 拦下默认提交（改用 fetch）
        const user = document.getElementById('user').value.trim();
        const pwd  = document.getElementById('pwd').value;
        const msg  = document.getElementById('msg');

        /* 前端校验（示例：真实校验必须在服务端重做） */
        if (!user || pwd.length < 6) {
          msg.className = 'msg err';
          msg.textContent = '用户名不能为空，密码至少 6 位';
          return;
        }

        /* 加密流程：pwd → SHA-256；payload+时间戳 → 签名 */
        const ts = Date.now();
        const pwdHash = await sha256Hex(pwd);
        const payload = { user, pwd: pwdHash };
        const sign   = await makeSign(payload, ts);

        /* 展示"发出去的是什么"（= 抓包视角） */
        document.getElementById('log').textContent =
          JSON.stringify({ ...payload, ts, sign });

        /* 模拟提交（本地演示：不真发请求） */
        msg.className = 'msg ok';
        msg.textContent = `已构造加密请求：user=${user}，签名=${sign.slice(0, 16)}…`;
        console.log('完整请求体：', { ...payload, ts, sign });
      });

    /* ── 防抖演示：输入时实时回显（input 事件）── */
    let t;
    document.getElementById('user').addEventListener('input', (e) => {
      clearTimeout(t);
      t = setTimeout(() => console.log('防抖后取值：', e.target.value), 300);
    });
  </script>
</body>
</html>
```

**这个 Demo 自带"分析靶场"**——用自己的教程破自己的题：

```
① Network/Console 看到 sign 乱码参数
② 搜 'sign' / 'makeSign' 找到生成函数
③ Console 直接调用：await makeSign({user:'a',pwd:'b'}, 123) 验证算法
④ Hook sha256Hex 看明文入参：
   const o = sha256Hex; sha256Hex = async s => { console.log('入参:', s); return o(s); }
   —— 密码哈希前的原始密码、盐值 'demo_salt_2026' 全部现形
```

**知识点覆盖**：`addEventListener`+`preventDefault`、async/await、Web Crypto API、模板字符串、`JSON.stringify`、`padStart`+`map`+`join` 链式转换、防抖、Console Hook 分析法。

---

## 12. 调试与速查

### 12.1 Sources 面板调试四步

```
① 定位代码：Network→Initiator 跳转 / 全局搜索（Ctrl+Shift+F 全项目搜）
② 下断点：行号点击；或代码里写 debugger 语句
③ 触发：操作页面让代码跑到断点（暂停）
④ 看现场：右侧 Watch 加表达式、Scope 看局部变量、
   Console 面板（暂停时可访问当前作用域变量！）
⑤ 单步：F8 继续 / F10 步过 / F11 步入
```

**快捷必会**：`Ctrl+Shift+F`（全局搜索源码，找加密函数第一神器）、`Ctrl+Shift+P`（命令面板，输 pretty 可美化）。

### 12.2 Console 常用 API

```js
console.log(obj)            // 打印（对象要点开看实时值）
console.table(arr)          // 表格化（数组/对象数组神器）
console.dir(dom)            // 看元素的对象结构
copy(JSON.stringify(data))  // 把大对象复制到剪贴板
debugger;                   // 代码级断点
monitorEvents(window, 'click')  // 监控事件（fun 期调试）
```

### 12.3 高频速查表

**选元素与取值**

```js
document.querySelector('#id');                  // CSS 选择器选一个
document.querySelectorAll('input[type=hidden]');// 选全部（扫隐藏域）
el.value / el.textContent / el.getAttribute('x');
```

**分析套路一行流**

```js
// 扫隐藏域和危险函数
document.querySelectorAll('[type=hidden]').forEach(e => console.log(e.name, e.value));
// Hook 一切：md5 / fetch / JSON.stringify / atob
const _f = window.f; window.f = (...a) => (console.log('f:', a), _f(...a));
```

**易错点 TOP5**

1. `==` vs `===`：永远用 `===`（`'5'==5` 是 true）
2. `innerHTML` 接用户输入 = 注入点（用 `textContent`）
3. `arr.sort()` 不加比较器按字符串排（`[1,10,2]`）
4. `await` 忘写 → 拿到 Promise 不是值（`Promise {<pending>}`）
5. `length` 是属性（`s.length` 无括号），方法是方法（`s.trim()` 有括号）

---

## 13. 学习路线

### 13.1 本篇的衔接位置

```
HTML/CSS（骨架与皮肤）
  → 本篇（JS 行为 + 分析方法论）
    → 浏览器安全模型（同源策略/CORS/CSP/沙箱）
      → 前端框架（Vue/React 的产物长相与 Hook 点）→ 进阶逆向（AST/卸混淆）
```

### 13.2 练手建议

1. **每天 Console 五分钟**：对着任何页面练 querySelector 取值、Hook 任一函数
2. 实战项目改三遍：换算法（SHA→异或）、加假签名、把盐改成时间相关——每改一次，用第 10 章五步法破一次自己
3. 找真实站点练"识别加密"（只看不绕）：搜请求参数乱码 → Initiator → 读构造逻辑
4. 遇到没见过的库 → 搜"库名 + GitHub"，看 README 即懂长相对应的 API

### 13.3 给安全人员的三句收尾

1. **JS 是明文的**：所有前端加密都是"把钥匙和锁一起寄给你"，分析的目标是速度不是可行性
2. **Hook 优先于硬读**：堵在函数门口看数据，性价比永远高于啃混淆代码
3. **DOM 即攻击面**：每一处 `innerHTML =`、`location =`、`postMessage` 都是潜在的注入/跳转点——搜索这些危险函数名，是 JS 审计的第一遍扫描

---

*完 —— JavaScript 的本质：页面的一切行为都写在明文里；所谓前端加密，只是把明文绕了个弯。*