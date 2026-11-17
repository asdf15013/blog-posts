---
title: 零基础 Java 教程
date: 2026-11-17
category: 基础知识
tags: [编程语言, JAVA]
---

# 零基础 Java 教程

> 一份写给**完全没写过代码的人**的 Java 教程：从"程序是什么、JDK 怎么装"讲起，一路走到面向对象、集合、多线程、JVM 内存模型，最后用 Maven + JUnit + Spring Boot 完成第一个真正的后端项目。每章末尾附练习题与参考答案。

---

## 这份教程适合谁

- 从来没写过程序、想系统学习 Java 的人；
- 想走 Java 后端、大数据、Android 方向，需要一块扎实地基的人；
- 学过一点但面向对象、集合、多线程一直似懂非懂的人。

**不需要任何前置知识。** 从装软件开始一步步带你走。

## 教程的四条主线

| 主线         | 对应章节              | 解决什么问题                                                 |
| ------------ | --------------------- | ------------------------------------------------------------ |
| 完整入门主线 | 第 1~11 章            | 从语法到集合、IO、Stream、多线程，Java SE 体系完整走一遍     |
| 面向对象深入 | 第 5~7 章（贯穿全书） | 类、继承、多态、接口、record——用"图纸与实例"的比喻彻底讲透 OOP |
| JVM 与底层   | 第 1、12 章（贯穿）   | `.java` 怎么变成字节码、JVM 内存长什么样、GC 怎么回收、OOM 怎么排查 |
| 工程与后端   | 第 10、13 章（贯穿）  | Maven、JUnit 测试、日志、HTTP、Spring Boot 写出第一个 REST API |

## 环境约定

- **JDK 21（LTS）**，教程统一使用现代 Java 写法（`var`、switch 表达式、文本块、record 等）；
- 编辑器：前 4 章用**记事本/VS Code + 命令行**编译（先把"编译与运行"两件事看清）；第 5 章起推荐 **IntelliJ IDEA Community**（免费）；
- Windows 为主，Linux/macOS 命令完全一致。

<a id="toc"></a>

## 目录

- [第 1 章　初识 Java 与环境搭建](#j01) —— Java/JDK/JVM、装 JDK 21、第一个程序、jshell
- [第 2 章　变量、数据类型与运算符](#j02) —— 八种基本类型、引用初见、浮点真相、Scanner
- [第 3 章　分支与循环](#j03) —— switch 表达式、三大循环、经典题、菜单骨架
- [第 4 章　方法与数组](#j04) —— 值传递真相、Arrays 工具箱、递归调用栈
- [第 5 章　面向对象（一）：类、对象与封装](#j05) —— 图纸与实例、构造器、this、static、包
- [第 6 章　面向对象（二）：继承、多态与抽象](#j06) —— extends、动态绑定、Object 三件套
- [第 7 章　面向对象（三）：接口、枚举、record 与 Lambda](#j07) —— 能力合同、enum、record
- [第 8 章　常用 API：字符串、包装类与时间](#j08) —— String 池、BigDecimal、java.time、正则
- [第 9 章　集合框架与泛型](#j09) —— List/Set/Map、HashMap 原理、排序、遍历陷阱
- [第 10 章　异常处理与文件 IO](#j10) —— 异常体系、try-with-resources、Path/Files、编码
- [第 11 章　Lambda 进阶、Stream 与多线程](#j11) —— 流水线、竞态与锁、线程池、虚拟线程
- [第 12 章　JVM 入门](#j12) —— 内存区域、GC、javap 字节码、OOM 排查
- [第 13 章　工程化与 Spring Boot 实战](#j13) —— Maven、JUnit、REST API、三层架构
- [附录　排错手册 · 速查表 · 进阶路线](#appendix)

## 怎么用这份教程

1. **按顺序读。** 第 5~7 章的 OOP 三部曲环环相扣；第 9 章集合依赖泛型；第 11 章多线程依赖前面的接口与 Lambda。
2. **代码必须亲手敲。** 每段示例都自己敲、编译、运行，再故意改坏看报什么错。
3. **做每章练习。** 先自己做，再对参考答案；做不出来回读对应小节。
4. **报错不要慌。** 附录有"javac/运行期报错对照表"，`NullPointerException` 之类高频错误都有排查路径。

## 建议节奏

- 第 1~4 章是语法地基（有其他语言经验的人可以快进）；
- 第 5~7 章 OOP 三部曲是 Java 的灵魂，值得放慢到两天一章；
- 第 8~11 章是"写真正程序"的四大件（字符串/集合/异常 IO/Stream 多线程）；
- 第 12~13 章拉开差距：懂 JVM、会工程化，就跨过了"会语法"和"能干活"的门槛。

全教程正文约 3 万字、可运行示例 80 余个。学完你应该能：独立写出几百行的 Java 程序、读懂绝大多数 Java 项目代码、并用 Spring Boot 做出一个小而完整的 Web 接口服务。

## 学习心法

**Java 的知识点比 C 多得多，但难度曲线更平缓**——没有指针运算、没有手动内存回收，代价是概念多（类、接口、泛型、Stream、JVM……）。给三条针对性心法：

1. **别背 API，建"能力地图"**。记住"有 List/Set/Map 三类容器、有 Files 这个文件工具箱"这种粒度就够了，具体方法用时查（IDEA 的自动补全就是你的速查表）。背 API 是学 Java 最大的弯路；
2. **概念追到内存画面**。变量是遥控器、对象在堆、static 在方法区、线程各有一条栈——脑子里有这张图，equals/hashCode、GC、并发的一切结论都能自己推出来，不用背；
3. **例子跑起来改坏它**。每段示例代码运行后，故意改错一处看报什么错（把 equals 改成 ==、把 final 去掉、往 HashMap 塞可变键）——**报错信息是免费的一对一教学**；
4. **别在工具上内耗**。IDEA 的补全、报错红线、一键生成（构造器/重写/格式化）都是学习加速器而不是拐杖——用起来，把精力省给思想。同样，卡住超过半小时就去搜/问（带上完整报错与最小复现），死磕的收益远没有传说中那么大。祝学习顺利，我们第 1 章见。

---

---

---

<a id="j01"></a>

# 第 1 章 初识 Java 与环境搭建

> 本章目标：搞清 Java、JDK、JVM 三者的关系；装好 JDK 21；编译运行第一个程序；避开新手最容易撞上的坑。

---

## 1.1 程序、源代码与"一次编写、到处运行"

计算机只会执行指令。你用人类能读的语言（编程语言）写好**源代码**，再由工具翻译成机器能执行的指令，这个翻译工具就是编译器。

Java 的特别之处在翻译方式。C 语言把源代码直接翻译成某一种 CPU 的机器码（Windows 编译出的 exe 在 Mac 上跑不了）；Java 则把源代码翻译成一种**通用的中间格式——字节码（bytecode）**，然后交给一个"虚拟计算机"——**JVM（Java Virtual Machine，Java 虚拟机）**去执行。不同操作系统各装各的 JVM，同一份字节码在哪儿都能跑：

```
                 javac 编译                 JVM 执行
 Hello.java ───────────────▶ Hello.class ───────────────▶ Windows / macOS / Linux
 （源代码，人读）              （字节码，通用）              （哪台机器装了 JVM 哪就能跑）
```

这就是 Java 的口号 **"Write Once, Run Anywhere"（一次编写、到处运行）**，也是它三十年来统治企业级后端、Android、大数据领域的根基之一。

> 顺带一提：JVM 只认字节码，不关心字节码从哪来。所以 Groovy、Kotlin、Scala 等语言也编译成字节码跑在 JVM 上——Java 先是语言，更是一个**平台**。

### Java 的三十年与版本族谱

了解一点家史，版本恐惧立刻消失。Java 由 Sun 公司的 James Gosling 团队于 1995 年发布；2009 年 Oracle 收购 Sun，Java 归 Oracle。发布节奏两阶段：早期大版本慢（2004 年 Java 5 是分水岭，引入泛型/枚举/增强 for），2017 年起**每半年一版**、每两年一个 LTS：

| 版本    | 年份 | 地位              | 关键特性                              |
| ------- | ---- | ----------------- | ------------------------------------- |
| Java 8  | 2014 | **LTS，存量王者** | Lambda、Stream、新时间 API            |
| Java 11 | 2018 | LTS               | `var`、单文件直跑、HTTP Client        |
| Java 17 | 2021 | LTS               | sealed 类、模式匹配（instanceof）     |
| Java 21 | 2023 | **LTS，本教程**   | 虚拟线程、record 模式匹配、序列化改进 |

企业界 Java 8 存量巨大（大量系统"能用就不动"），新项目多选 17/21。看招聘要求写"Java 8"，别慌——语法内核一脉相承，本教程知识可直接迁移，差别主要是"哪些新语法可以用"。

## 1.2 JDK、JRE、JVM：俄罗斯套娃

三个词天天见，一张图分清：

```
┌─ JDK（开发工具包）───────────────────┐
│  javac（编译器） java（启动器）       │
│  javap、jshell、javadoc 等工具        │
│  ┌─ JRE（运行环境）───────────────┐  │
│  │   类库（写好的工具箱：String、   │  │
│  │   集合、IO……几万个类）           │  │
│  │  ┌─ JVM（虚拟机）────────────┐ │  │
│  │  │  真正执行字节码的“虚拟电脑”  │ │  │
│  │  └───────────────────────────┘ │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

- **开发**要装 JDK（含编译器）；**只运行**别人的 Java 程序装 JRE 就够。我们是开发者，装 JDK；
- JDK 11 之后 Oracle 不再单独发 JRE 了，装 JDK 即可。

版本怎么选：Java 每 6 个月发一版，**LTS（长期支持）版**每两年一个。本教程用 **JDK 21**（2023 年的 LTS）。顺带说明：企业存量代码里 JDK 8 和 17 也很多，教程的现代写法绝大部分在 17 上同样能跑，个别差异会标注。

## 1.3 安装 JDK 21（Windows 为主）

推荐 **Eclipse Temurin**（免费、无授权坑，业界主流）：

1. 打开 <https://adoptium.net>，选择 **Temurin 21 (LTS)**，Windows x64，下载 `.msi` 安装包；
2. 安装时一路下一步，**注意勾选 "Set JAVA_HOME variable" 和 "Add to PATH"**（新版安装器有这两个选项，勾上就免了手动配环境变量）；
3. 验证：按 `Win+R` 输入 `cmd` 回车，执行：

```
java -version
javac -version
```

两条都显示 `21.x.x` 即成功。若提示"不是内部或外部命令"，说明 PATH 没配好：环境变量里把 `C:\Program Files\Eclipse Adoptium\jdk-21.x\bin` 加进 Path，**重开 cmd** 再试。

**Linux/macOS**：macOS 用 `brew install --cask temurin@21`；Ubuntu 可从 Adoptium 仓库安装（详见官网说明）。

### 编辑器选择

- 前 4 章：**记事本 / VS Code** + 命令行编译。别嫌原始——亲手敲 `javac` 和 `java`，你才能把"编译"和"运行"两件事彻底分开，这是理解 Java 的第一块基石；
- 第 5 章起：装 **IntelliJ IDEA Community 版**（<https://www.jetbrains.com/idea/>，免费），装的时候它会自动探测 JDK。IDE 会帮你编译、提示报错、一键运行——但前提是你已经手动编译过，知道它在替你干什么。

## 1.4 第一个程序：Hello, World!

新建文件夹（如 `D:\jlec`），新建文件 `Hello.java`（**文件名必须与 public 类名完全一致**，含大小写），敲入：

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

命令行进入该目录，编译并运行：

```
javac Hello.java      ← 编译：生成 Hello.class（字节码）
java Hello            ← 运行：把类名交给 JVM（注意没有 .class 后缀！）
```

输出：

```
Hello, World!
```

逐行拆解（现在只需"知其然"，每块都会在后文专章讲解）：

| 代码                                     | 含义                                                         | 详解位置   |
| ---------------------------------------- | ------------------------------------------------------------ | ---------- |
| `public class Hello`                     | 定义一个公开的类，名叫 Hello。Java 的一切代码都必须装在类里  | 第 5 章    |
| `public static void main(String[] args)` | 主方法：程序入口，JVM 从这里开始执行。这个签名是铁律，一个字母都不能错 | 第 4、5 章 |
| `System.out.println(...)`                | 向标准输出打印一行。`System.out` 是 JDK 类库自带的"屏幕"对象 | 第 2 章    |
| 每行末尾的 `;`                           | 语句结束符。**漏分号是新手第一大报错来源**                   | —          |

三个高频坑：

- **文件名 ≠ 类名**：`public class Hello` 必须存在 `Hello.java` 里，否则编译报错；
- **所有标点必须英文半角**：中文引号、中文分号必报错；
- `java Hello.class` 是错的——java 后面跟**类名**不是文件名。

### 单文件直跑（JDK 11+ 的小福利）

学习期的小程序可以跳过 javac，直接：

```
java Hello.java
```

JVM 会自动编译再运行。**但请前期老实用 javac + java 两步走**——分清两步，后面理解"类路径""字节码"才不虚。

## 1.5 编译期与运行期：错误分两种

从写代码到看到结果，中间有两道关卡：

```
你写的 Hello.java ──javac──▶ Hello.class ──java/JVM──▶ 输出
                   编译期                  运行期
             语法不对在这拦下           逻辑不对在这爆发
```

- **编译期错误（compilation error）**：拼写、漏分号、类型不匹配……javac 直接拒绝生成 .class，报错带行号，最好修；
- **运行期错误（runtime error / 异常）**：程序编译通过，跑起来才炸，比如 `NullPointerException`（空指针）、数组越界。附录有高频异常对照表。

记住这个分工，报错时先问自己："这是编译期还是运行期？"——排查方向立刻清晰一半。

### jshell：随敲随跑的草稿纸

JDK 9 起自带 REPL（交互式解释器）：命令行敲 `jshell`，进去直接写 Java 表达式，回车立刻见结果，不用建文件、不用写类和 main：

```
jshell> 1 + 2
$1 ==> 3

jshell> System.out.println("Hello".repeat(3))
HelloHelloHello

jshell> int[] a = {3, 1, 2};
a ==> int[3] { 3, 1, 2 }

jshell> Arrays.sort(a); Arrays.toString(a)
$4 ==> "[1, 2, 3]"

jshell> /exit
```

`$1`、`$2` 是自动给结果编的号，可以接着引用。学新 API、试一行代码拿不准结果时，jshell 比建文件快十倍——**把它当计算器和草稿纸用**。老规矩：正式代码还是要走"文件 → javac → java"完整流程，两条腿走路。

## 1.6 新手四大坑速查

**坑 1：`错误: 找不到或无法加载主类 Hello`。** 九成是执行了 `java Hello.class`（应 `java Hello`），或不在 .class 所在目录，或类定义在包（package）里却没带包名执行。前期我们不建包，第 5 章讲。

**坑 2：中文乱码。** JDK 18 起默认编码就是 UTF-8，配合 Windows Terminal/PowerShell 一般没问题；老版 PowerShell 显示乱码时执行 `chcp 65001` 切 UTF-8。

**坑 3：改了代码没反应。** 只重新执行了 `java`，忘了 `javac`。IDEA 用户对应"改完没 Ctrl+S 就运行"——养成改、存、编译、运行一条龙。

**坑 4：`javac` 可以、`java -version` 不行（或反过来）。** PATH 里混了多个 JDK，`where java`（Windows）看看哪个在前。装新版前卸干净旧版能省很多事。

### 认识你的 JDK 目录

装好后去 `C:\Program Files\Eclipse Adoptium\jdk-21.x\` 逛一圈，混个脸熟：

```
jdk-21/
├── bin/        javac.exe java.exe javap.exe jshell.exe javadoc.exe …（你敲的所有命令）
├── lib/        类库 jar 包（src.zip 里还有 JDK 源码，IDEA 可一键跳进去看）
├── conf/       配置文件
└── include/    本地接口头文件（JNI 开发用，初学忽略）
```

两个实用彩蛋：① IDEA 里按住 Ctrl 点任何 JDK 方法（如 `println`）能直接跳进 JDK **源码**——"标准库是怎么写的"从此可自学；② `javadoc` 工具能从注释生成 API 文档，JDK 官方文档就是这么来的（写好 `/** */` 注释的习惯以后进团队会感谢自己）。

## 1.7 心法：从报错里学

和所有教程一样，把这三条刻在脑子里：

1. **报错从第一条读起**——后面的错误常是第一条的连锁反应；
2. **先看行号**，跳到那一行和它的**上一行**找问题（漏分号通常报在下一行）；
3. **万能二分**：把可疑代码复制到一个新的小 .java 里单独编译；或在怀疑点前后加 `System.out.println("到这了1");`，看断在哪。

从今天起，每个报错都练"先读信息 → 猜原因 → 动手验证"的循环，这就是手感。

## 1.8 小结

- Java 源码 →（javac）→ 字节码 →（JVM）→ 任意平台执行；JDK ⊃ JRE ⊃ JVM；
- 开发装 JDK（本教程 JDK 21 LTS），验证 `java -version`；
- `public class Hello` 必须放在 `Hello.java`；`main` 方法签名是铁律入口；
- `javac` 编译到 .class，`java 类名` 运行；错误分编译期与运行期两种。

## 练习 1

1.（概念）用一句话说清 JDK、JRE、JVM 的关系。为什么说"Java 是跨平台的，但 JVM 不是"？
2.（概念）`.java` 和 `.class` 文件分别是什么？谁生成了 `.class`，谁执行它？
3.（操作）把 `System.out.println` 误写成 `System.out.printn`，编译一次，记下报错的样子，再改回来。
4.（编程）写程序分三行打印你的名字、爱好、`I am learning Java.`。
5.（编程）打印如下图案：

```
  *
 ***
*****
```

## 参考答案

**1.** JDK = JRE + 开发工具（javac 等）；JRE = JVM + 类库。Java 程序编译成通用字节码，所以跨平台；但每种操作系统需要各自版本的 JVM 来执行字节码——JVM 本身是平台相关的。

**2.** `.java` 是人写的源代码（文本）；`.class` 是 javac 编译出的字节码（二进制）；由 JVM（`java` 命令启动）执行。

**3.** 报错类似：`错误: 找不到符号  符号: 变量 printn`，并标出出错行号——"找不到符号"是拼错方法/变量名时的标准报错，以后天天见。

**4.**

```java
public class Intro {
    public static void main(String[] args) {
        System.out.println("张三");
        System.out.println("编程");
        System.out.println("I am learning Java.");
    }
}
```

**5.**

```java
public class Tree {
    public static void main(String[] args) {
        System.out.println("  *");
        System.out.println(" ***");
        System.out.println("*****");
    }
}
```

**[▲ 返回目录](#toc)**

---

<a id="j02"></a>

# 第 2 章 变量、数据类型与运算符

> 本章目标：掌握 Java 的八种基本类型与引用类型初印象；熟练使用运算符与类型转换；会用 Scanner 读键盘输入、printf 格式化输出。Java 是**强类型语言**，类型这张地基图必须先打牢。

---

## 2.1 变量：贴了类型标签的盒子

变量 = 内存里一块有名字的空间。Java 与某些语言不同，**每个变量声明时必须先报类型**，而且这辈子只能装这种类型的值：

```java
int age = 18;          // 一个 int 盒子，名叫 age，装 18
age = 20;              // OK：还是 int
// age = "二十岁";     // 编译错误！int 盒子装不进字符串
```

好处：错误在**编译期**就被拦下（IDE 里红波浪线直接标出来），而不是运行到一半才炸。这就是"强类型"。

```java
var score = 95;        // JDK 10+：var 让编译器自动推断类型
// 等价于 int score = 95; var 只是少打字，变量依然有确定类型，不是“随便装”
var name = "Zhang";    // 推断为 String
// name = 42;          // 编译错误：name 已经是 String 了
```

局部变量（方法里）不初始化就使用，编译器直接报错；这个比"默认给垃圾值"的语言友好得多。

## 2.2 八种基本类型（primitive types）

Java 把"赤裸裸的数据"定为八种基本类型，大小全部写死在规范里（跨平台一致）：

| 类型      | 大小   | 范围/说明                                              | 用途                                 |
| --------- | ------ | ------------------------------------------------------ | ------------------------------------ |
| `byte`    | 1 字节 | −128 ~ 127                                             | 省空间的原始字节                     |
| `short`   | 2 字节 | ±3.3 万                                                | 少用                                 |
| `int`     | 4 字节 | ±21.5 亿                                               | **整数默认选它**                     |
| `long`    | 8 字节 | ±9.2×10¹⁸                                              | 大整数（字面量加 L：`10000000000L`） |
| `float`   | 4 字节 | ≈7 位有效数字                                          | 少用（精度低）                       |
| `double`  | 8 字节 | ≈15 位有效数字                                         | **小数默认选它**                     |
| `char`    | 2 字节 | 一个字符，用单引号：`'A'`（本质是 0~65535 的无符号数） | 字符                                 |
| `boolean` | —      | 只有 `true` / `false`                                  | 逻辑判断                             |

四条要点：

1. **整数默认 int，小数默认 double**：`long big = 9000000000L;` 不加 L 会编译错（超 int 范围）；`float f = 1.5f;` 不加 f 也会错；
2. **char 是"小整数"**：`char c = 'A';` 里存的是 65，可以参与运算：`c + 1` 得 66，`(char)(c + 1)` 得 `'B'`；
3. **boolean 不是数字**：不能 `if (1)`，条件必须是 boolean——C 语言习惯在这里会翻车；
4. **基本类型的变量，盒子里装的就是值本身**。下一小节对照着看"引用类型"，这个区别是 Java 世界的第一分水岭。

### 引用类型初见

除了八种基本类型，其余一切（String、数组、以及第 5 章的所有对象）都是**引用类型**：

```java
int a = 10;                // 盅量 a 里直接躺着 10
String s = "hello";        // 变量 s 里躺的不是 "hello”本身，而是“hello”对象在另一处的地址
```

```
基本类型：   a ┌────┐          引用类型：  s ┌──────┐      ┌───────────┐
              │ 10 │                        │ 地址●─┼────▶│ "hello"    │
              └────┘                        └──────┘      └───────────┘
              盒子里就是值                    盒子里是地址（引用）
```

现在只需记住对比：**基本类型装值，引用类型装"遥控器"**。这个"遥控器"在方法传参、比较、垃圾回收处都会反复出现（第 4、6、12 章）。

### 浮点数的真相：为什么 0.1 + 0.2 != 0.3

double/float 按 IEEE 754 标准存储：符号位 + 指数位 + 尾数位，本质是"二进制科学计数法"。问题在于，十进制的 0.1 换成二进制是无限循环小数（类似 1/3 在十进制是 0.333…），尾数位有限，于是**绝大多数十进制小数在计算机里都是近似值**：

```java
System.out.println(0.1 + 0.2 == 0.3);          // false ！
System.out.printf("%.20f%n", 0.1 + 0.2);        // 0.30000000000000004441
```

由此三条纪律：

1. **浮点不用 `==` 比较**。判等用差值：`Math.abs(a - b) < 1e-9`；
2. **金额绝不用 double**（累计误差会"对不上账"），用第 8 章的 BigDecimal，或直接以"分"为 int 计算；
3. **float 几乎不用**，中间计算一律 double。

两个特殊值也要认识：除以 0.0 不抛异常而得 `Infinity`（整数除 0 才抛异常）、`0.0/0.0` 得 `NaN`（Not a Number，与任何值都不相等，包括自己：`NaN == NaN` 是 false，判断用 `Double.isNaN(x)`）。记住心智模型：**浮点数轴离 0 越近越密、越大越稀疏**；要精确就别用浮点。

## 2.3 常量、进制与溢出

```java
final double PI = 3.14159;    // final = 常量，赋值后不可再改
// PI = 3.14;                 // 编译错误

int dec = 65;                 // 十进制
int hex = 0x41;               // 十六进制 → 65
int bin = 0b01000001;         // 二进制 → 65（JDK 7+）
int big = 1_000_000_000;      // 数字里可加下划线便于阅读（JDK 7+）
```

**溢出是真实存在的**：

```java
int max = Integer.MAX_VALUE;              // 2147483647
System.out.println(max + 1);              // -2147483648，绕回到最小值！
```

多提一嘴 JDK 8 加入的"宁可抛异常不要错答案"的运算：`Math.addExact(max, 1)` 会在溢出时抛异常而不是悄悄绕回——对金额、数量类敏感运算很有用。

### char 与字符编码初见

`char` 是 2 字节的无符号整数（0~65535），存的是字符的 **Unicode 码点**：

```java
char c = 'A';                    // 实际存 65
char zh = '中';                  // 存 20013 —— 中文也是普通字符
System.out.println((int) zh);    // 20013
System.out.println((char) 65);   // A：数字与字符自由互转

char d = 'a';
if (d >= 'a' && d <= 'z') {           // 判断小写：利用码点连续性
    char upper = (char) (d - 32);     // 转大写（'a'-'A' 恰好 32）
    System.out.println(upper);        // A
}
// 更地道的写法：Character 工具类
Character.toUpperCase(d);
Character.isDigit('5');               // true
Character.isLetter('x');              // true
```

三件事记住：① `'5'` 和 `5` 是两回事（字符 `'5'` 的码点是 53），字符转数字用 `c - '0'`；② 大小写差 32、数字连续排列，是一批字符处理的底层原理；③ Character 工具类的方法能查能转，处理用户输入前先 `isDigit`/`isLetter` 过滤是好习惯。至于"Unicode/UTF-8/GBK"这套编码体系与乱码问题，第 10 章文件读写时展开。

## 2.4 运算符

### 算术：`+ - * / % ++ --`

```java
int a = 7, b = 2;
a / b      // 3：整数除法砍小数！
a % b      // 1
7.0 / 2    // 3.5：有一边是浮点就是浮点除法
(double) a / b   // 3.5：强制转换先算
```

`++`/`--` 前置后置的区别与 C 相同：`y = x++`（先用旧值）vs `y = ++x`（先加再用）。建议单独成行，别混进复杂表达式。

**字符串拼接 `+`**：Java 里 `+` 遇到 String 就变成"连接"：

```java
System.out.println("得分：" + 95);          // 得分：95
System.out.println(1 + 2 + "元");           // 3元（先算 1+2）
System.out.println("价格" + 1 + 2);         // 价格12（从左到右，遇字符串后全变拼接）
```

第三行是经典陷阱：从左到右算，`"价格"+1` 先变成 `"价格1"`。要求数字先加，请加括号。

### 比较：`== != < > <= >=`，结果 boolean

```java
boolean adult = age >= 18;
boolean eq = (score == 100);
```

逻辑：`&& || !`，同样有短路求值（`&&` 左边假则右边不算）：

```java
if (s != null && s.length() > 0) { ... }   // 先判空再取长度——短路救命的日常写法
```

**注意没有 C 风格的 `0 <= x < 10`**，必须 `0 <= x && x < 10`。

赋值与复合赋值：`= += -= *= /= %=`。三目：`条件 ? 真值 : 假值`。

优先级记三条就够：`!` > 算术 > 比较 > `&&` > `||` > 赋值；拿不准加括号；括号不要钱。

### 类型转换

小 → 大自动升（`int → long → double`）；大 → 小必须强转（可能丢精度）：

```java
int i = 100;
long l = i;            // 自动
double d = i;          // 自动
int j = (int) 3.99;    // 强转，直接截断 → 3（不是四舍五入！）
byte k = (byte) 200;   // 强转溢出 → -56（高位被砍）
```

浮点精度问题（0.1 + 0.2 != 0.3）与 C 一致存在，涉及钱的计算第 8 章用 BigDecimal 专治。

### Math 工具箱

`java.lang.Math` 全是静态方法，不用 import：

```java
Math.abs(-5)                // 5：绝对值
Math.max(3, 9)              // 9；Math.min 同理
Math.pow(2, 10)             // 1024.0：幂（返回 double）
Math.sqrt(16)               // 4.0：平方根
Math.round(3.6)             // 4：四舍五入（返回 long）
Math.ceil(3.1) / Math.floor(3.9)   // 4.0 / 3.0：向上/向下取整
Math.PI                     // 3.14159...：常量
Math.random()               // [0,1) 随机数（第 3 章细讲随机）
```

三个易踩点：① `Math.pow` 与 `Math.sqrt` 返回 double，赋给 int 要显式强转；② `Math.round(-3.6)` 是 −4，但 `Math.round(-3.5)` 也是 −4（注意"四舍五入"对负数的边界）；③ 溢出安全的加乘 `Math.addExact / multiplyExact`——宁可抛异常也别悄悄绕回。日常算法题里 Math 是常客，混个熟练即可。

## 2.5 输出三件套：println / print / printf

```java
System.out.println("自带换行");
System.out.print("不带换行");
System.out.printf("格式化：%d %s %.2f%n", 42, "文本", 3.14159);
// 输出：格式化：42 文本 3.14
```

常用占位符：`%d` 整数、`%f` 小数（`%.2f` 两位）、`%s` 字符串、`%c` 字符、`%b` 布尔、`%%` 百分号本身、`%n` 换行。还有 String.format 把格式化的结果存成字符串：

```java
String msg = String.format("平均分 %.1f", 89.46);   // "平均分 89.5"（四舍五入）
```

## 2.6 Scanner：读键盘输入

Scanner 是 JDK 自带的输入工具（`java.util.Scanner`）：

```java
import java.util.Scanner;

public class InputDemo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("输入年龄：");
        int age = sc.nextInt();

        System.out.print("输入身高(米)：");
        double h = sc.nextDouble();

        System.out.printf("年龄 %d，身高 %.2f%n", age, h);
    }
}
```

要点与坑：

- 输入类型要对口：`nextInt` 只吃整数，用户输 `abc` 会抛 `InputMismatchException`（运行期异常，见第 10 章）；
- **nextInt/nextDouble 不吃行尾回车**，随后再调 `nextLine()` 会读到空行——和 C 的 scanf 换行坑同款。解法统一：重要程序里**只用 `nextLine()` 读整行，再用 `Integer.parseInt(line)` 转数字**，转失败 catch 住（第 10 章组合完整防御）；
- 检查输入是否存在：`sc.hasNextInt()` 先问再读，比直接读更稳。

### 输入缓冲区：为什么数字后面读不到字符串

Scanner 读的其实是"输入缓冲区"——你敲的字（含回车）先排队，Scanner 逐个取。事故现场：

```java
int age = sc.nextInt();     // 输入 18回车：18 被取走，回车 '\n' 还留在队列
String name = sc.nextLine();// nextLine 来者不拒：把残留的回车读成了“空行”！
```

规律：`nextInt/nextDouble` 取完数字**不吃行尾回车**；`nextLine` 连空白一起吞。解法两条：

```java
// 方案一：nextLine 前先清一次残留
sc.nextLine();                       // 吃掉回车
String name = sc.nextLine();

// 方案二（推荐）：全部用 nextLine 读行，再转型
int age = Integer.parseInt(sc.nextLine().trim());
```

方案二还有个附带好处：输错时抛的是可控的 `NumberFormatException`（第 10 章 catch 它给默认值），而 nextInt 输错会把非法字符留在缓冲区、后续全部失灵。**严肃程序一律按行读 + 手动转型**，这是 Java 输入处理的标准姿势。

## 2.7 小结

- 八种基本类型装值，引用类型装地址（遥控器）；Java 强类型，错误编译期拦；
- 整数 int、小数 double、大数 long 加 L；`/` 整数除法砍小数；`+` 遇 String 变拼接；
- 转换：小转大自动、大转小强转且可能丢数据；浮点别用 `==` 比；
- 输出 printf/`String.format`；输入 Scanner，警惕数字与 nextLine 的换行坑。

## 练习 2

1.（概念）下面哪些编译不过？为什么？`int a = 3.5;`、`double d = 10;`、`long x = 10000000000;`、`float f = 1.5;`、`char c = "A";`
2.（概念）`System.out.println("结果" + 1 + 2)` 和 `System.out.println(1 + 2 + "结果")` 各输出什么？
3.（改错）以下代码想读入姓名和年龄，运行时姓名读到了空字符串，找出原因并修复：

```java
Scanner sc = new Scanner(System.in);
System.out.print("年龄：");
int age = sc.nextInt();
System.out.print("姓名：");
String name = sc.nextLine();
```

4.（编程）读入一个三位整数，输出它的个、十、百位之和。
5.（编程）读入半径和高（浮点），输出圆柱体积，保留 3 位小数。

## 参考答案

**1.** 编译不过的：`int a = 3.5`（double 塞不进 int，要强转）；`long x = 10000000000`（默认按 int 字面量解析，超出 int 范围，须加 L）；`float f = 1.5`（1.5 是 double，须加 f 或强转）；`char c = "A"`（双引号是字符串不是字符）。能过的是 `double d = 10`（int 自动升 double）。

**2.** 第一个输出 `结果12`（先 `"结果"+1` 变字符串再拼 2）；第二个输出 `3结果`（先算 1+2 再拼接）。

**3.** `nextInt()` 只取走数字，行尾回车留在输入流里，`nextLine()` 立刻读到这个空行。修复：在 nextLine 前再调一次 `sc.nextLine();` 吃掉残留回车；或统一改为 `int age = Integer.parseInt(sc.nextLine().trim());`。

**4.**

```java
import java.util.Scanner;

public class DigitSum {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(n / 100 + n / 10 % 10 + n % 10);
    }
}
```

**5.**

```java
import java.util.Scanner;

public class Cylinder {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double r = sc.nextDouble();
        double h = sc.nextDouble();
        System.out.printf("体积：%.3f%n", Math.PI * r * r * h);
    }
}
```

**[▲ 返回目录](#toc)**

---

<a id="j03"></a>

# 第 3 章 分支与循环

> 本章目标：if/else、switch（含 JDK 14+ 的 switch 表达式）、三大循环、break/continue，配一套经典练手题。学完你能写真正的算法雏形。

---

## 3.1 if / else

```java
if (score >= 60) {
    System.out.println("及格");
} else {
    System.out.println("不及格");
}
```

规则：

- 条件必须是 **boolean**（没有"非零即真"这回事）；
- 只管一条语句时可省花括号，但**强烈建议永远写花括号**——缩进骗人，括号不骗人；
- 多分支用 `else if` 链，顺序从大到小（先 `>= 90` 再 `>= 80`……）。

**头号坑：`==` 写成 `=`。** 好消息：Java 里 `if (x = 5)` 直接编译不过（int 不是 boolean）——强类型替你挡了 C 语言最经典的坑。

## 3.2 switch：老写法与新写法

### 传统 switch 语句（处处可见于老代码）

```java
switch (day) {
    case 1:  System.out.println("周一"); break;
    case 2:  System.out.println("周二"); break;
    case 6:
    case 7:  System.out.println("周末"); break;     // 贯穿：6、7 共用
    default: System.out.println("非法输入");
}
```

忘 break 会"贯穿"到下一个 case 继续执行——少数是有意利用，多数是 bug。

### switch 表达式（JDK 14+，推荐）

现代写法：`->` 箭头、不贯穿、有返回值、多值并列：

```java
String type = switch (day) {
    case 1, 2, 3, 4, 5 -> "工作日";
    case 6, 7          -> "周末";
    default            -> "非法输入";
};
System.out.println(type);
```

要点：

- 一个 case 可列多个值（`case 1, 2, 3`）；
- 作为**表达式**可以直接把结果赋给变量；
- 用作表达式时必须"穷尽"——要么 default 兜底，要么（enum/密封类）覆盖所有取值；
- 需要多行逻辑时用 `-> { ... yield 结果; }`。

```java
int season = 8;
String s = switch (season) {
    case 3, 4, 5  -> "春";
    case 6, 7, 8  -> "夏";
    case 9, 10, 11 -> { System.out.println("计算中..."); yield "秋"; }
    case 12, 1, 2 -> "冬";
    default       -> "未知";
};
```

## 3.3 三大循环

```java
// 1. while：条件为真就一直干
int i = 1;
while (i <= 5) {
    System.out.println("第 " + i + " 圈");
    i++;
}

// 2. do-while：先干一次再判断（菜单场景）
int choice;
do {
    System.out.println("1.开始 2.退出");
    choice = new java.util.Scanner(System.in).nextInt();
} while (choice != 1 && choice != 2);

// 3. for：三要素一行写齐
for (int j = 1; j <= 5; j++) {
    System.out.println("第 " + j + " 圈");
}
```

循环三要素：初始化、条件、更新。忘更新就死循环（Ctrl+C 强杀）。

嵌套循环——九九乘法表：

```java
for (int row = 1; row <= 9; row++) {
    for (int col = 1; col <= row; col++) {
        System.out.printf("%d*%d=%-4d", col, row, row * col);
    }
    System.out.println();
}
```

外层一步、内层一圈。打印矩阵/图形题的万能心法。

### break、continue 与标签

```java
for (int i = 1; i <= 100; i++) {
    if (i % 7 == 0) { System.out.println(i); break; }   // 找到第一个 7 的倍数就收工
}

for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) continue;                            // 跳过偶数
    System.out.print(i + " ");                           // 1 3 5 7 9
}
```

break 只跳最内层。Java 独有的**标签**可以一次跳出多层（别的地方少见）：

```java
outer:
for (int i = 1; i <= 10; i++) {
    for (int j = 1; j <= 10; j++) {
        if (i * j > 50) break outer;      // 直接跳出两层
    }
}
```

### 随机数：Random 与种子

三种常见写法，认识即可：

```java
// ① Random 对象（推荐）：方法名直白
Random rnd = new Random();
int a = rnd.nextInt(100);          // [0, 100)
int b = rnd.nextInt(100) + 1;      // [1, 100]
double x = rnd.nextDouble();       // [0.0, 1.0)
boolean luck = rnd.nextBoolean();

// ② Math.random()：返回 [0,1) 的 double
int c = (int) (Math.random() * 100);   // [0,100)

// ③ 指定范围通式：[min, max]
int min = 10, max = 20;
int v = rnd.nextInt(max - min + 1) + min;
```

`Random` 是**伪随机**：内部靠"种子"推演序列。`new Random(42)` 固定种子后每次运行序列完全一致——测试时想要"可复现的随机"，就用它；正常使用 `new Random()`（以时间为种）即可。加密场景请用 `SecureRandom`（此处留名，安全话题另学）。

### 嵌套循环阅读法 + 复杂度直觉

双层循环读不懂时，用"追踪表"手玩一遍（打印九九表外层 row=1 那轮）：

```
row=1：内层 col 从 1 到 1 —— 打 1 个乘式，换行
row=2：内层 col 从 1 到 2 —— 打 2 个乘式，换行
row=3：内层 col 从 1 到 3 —— 打 3 个乘式，换行
```

一句话心法：**外层每走一步，内层完整跑完一遍**。追踪时永远盯两样东西——每个变量此刻的值、下一句要执行什么。

顺便建立"复杂度直觉"（算法之路的地基）：循环跑 n 次，工作量约 n；双层嵌套约 n²；`i *= 2` 式翻倍约 log n。n=10 万时：单层循环瞬间（10 万步），双层嵌套就是 100 亿步——**程序"莫名卡死"九成是嵌套层数与数据量不匹配**。写双层循环前先估一眼 n² 大不大，这个习惯值很多性能事故。

## 3.4 经典例题

### 例 1：猜数字（Random + while）

```java
import java.util.Random;
import java.util.Scanner;

public class Guess {
    public static void main(String[] args) {
        Random rnd = new Random();
        int secret = rnd.nextInt(100) + 1;      // 1~100
        Scanner sc = new Scanner(System.in);
        int guess = 0, count = 0;

        System.out.println("我想好了 1~100 的数");
        while (guess != secret) {
            guess = sc.nextInt();
            count++;
            if (guess > secret)      System.out.println("大了");
            else if (guess < secret) System.out.println("小了");
            else                     System.out.println("猜中！用了 " + count + " 次");
        }
    }
}
```

`Random.nextInt(n)` 生成 [0, n) 的随机整数；`rnd.nextInt(100) + 1` 平移到 1~100。

### 例 2：最大公约数（辗转相除）

```java
int a = 1998, b = 629;
while (b != 0) {
    int r = a % b;
    a = b;
    b = r;
}
System.out.println("GCD = " + a);      // 17
```

### 例 3：判断素数

```java
static boolean isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; (long) i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}
```

循环条件 `i * i <= n`（只试到 √n）配上 `(long)` 防大数平方溢出——枚举边界永远是算法的第一效率来源。方法定义在 main 外面、用 `static` 修饰（第 4、5 章正式讲方法与 static 的含义）。

### 例 4：水仙花数（拆数字 + 穷举）

```java
for (int n = 100; n < 1000; n++) {
    int a = n / 100, b = n / 10 % 10, c = n % 10;
    if (a*a*a + b*b*b + c*c*c == n) {
        System.out.print(n + " ");      // 153 370 371 407
    }
}
```

### 例 5：百钱百鸡（穷举法的祖师爷）

公鸡 5 元一只，母鸡 3 元一只，小鸡 1 元三只，100 元买 100 只鸡，各有几只？

```java
for (int cock = 0; cock <= 20; cock++) {            // 公鸡最多 100/5=20 只
    for (int hen = 0; hen <= 33; hen++) {           // 母鸡最多 33 只
        int chick = 100 - cock - hen;               // 用总数约束反推小鸡
        if (chick % 3 == 0 && cock * 5 + hen * 3 + chick / 3 == 100)
            System.out.printf("公%d 母%d 小%d%n", cock, hen, chick);
    }
}
```

两个值得学的点：**循环边界先估算**（枚举范围越小越聪明），以及**用约束反推变量**（少一层循环，还消灭一类不一致）。穷举法的通用套路永远是"枚举候选 → if 过滤"，电脑最擅长干这个。

### while (true) + break：交互程序的标准骨架

菜单类程序（第 13 章项目、所有命令行工具）的通用骨架：

```java
Scanner sc = new Scanner(System.in);
while (true) {
    System.out.print("\n1.添加 2.查询 3.删除 0.退出 > ");
    String choice = sc.nextLine().trim();

    if (choice.equals("0")) {
        System.out.println("再见");
        break;                                        // 唯一出口
    }
    switch (choice) {
        case "1" -> System.out.println("执行添加……");
        case "2" -> System.out.println("执行查询……");
        case "3" -> System.out.println("执行删除……");
        default  -> System.out.println("没这个选项");
    }
}
```

两个细节：**读选项用字符串**而不是数字（用户输字母也不会炸，default 兜住）；退出条件放循环最前面，一眼可辨。这个骨架直接抄进你的第一个项目。

## 3.5 循环三大经典 Bug（自查清单）

**1. 差一错误**：数组 `int[] a = new int[5]` 下标 0~4，循环条件必须是 `i < a.length`，写 `<=` 就越界（Java 会抛 `ArrayIndexOutOfBoundsException`，比 C "温柔"——至少会炸给你看，第 4 章展开）。

**2. 改循环变量图省事**：想退出循环请 break，别 `i = 大数;` 这种黑魔法。

**3. 浮点当条件**：`for (double x = 0; x != 1.0; x += 0.1)` 死循环——0.1 累加精确不到 1.0。改 `x < 1.0` 或用整数计数。

## 3.6 小结

- 条件必须是 boolean；switch 表达式（`->`、多值、yield）是现代首选；
- while/do-while/for 等价，do-while 适合"至少问一次"的菜单；
- break 跳一层（标签可跳多层），continue 跳过本轮；
- 枚举边界、拆数字 `%` 与 `/`、打擂台/累加，是最常用的三个套路。

## 练习 3

1.（概念）传统 switch 忘写 break 会怎样？switch 表达式还会吗？
2.（编程）读入 n，输出 1~n 中所有能被 3 整除但不能被 5 整除的数。
3.（编程）求斐波那契数列第 20 项（用循环，别用递归）。
4.（编程）打印 n 层星号金字塔（n 从键盘读入），如 n=3 输出：

```
  *
 ***
*****
```

5.（编程）读入若干整数（0 结束），输出个数、总和、最大值、最小值。

## 参考答案

**1.** 传统 switch 会贯穿到下一个 case 继续执行直到遇到 break；switch 表达式用 `->` 天然不贯穿，每个分支独立。

**2.**

```java
import java.util.Scanner;

public class Div35 {
    public static void main(String[] args) {
        int n = new Scanner(System.in).nextInt();
        for (int i = 1; i <= n; i++) {
            if (i % 3 == 0 && i % 5 != 0) System.out.print(i + " ");
        }
        System.out.println();
    }
}
```

**3.**

```java
int a = 1, b = 1;
for (int i = 3; i <= 20; i++) {
    int next = a + b;
    a = b;
    b = next;
}
System.out.println(b);       // 6765
```

**4.**

```java
import java.util.Scanner;

public class Pyramid {
    public static void main(String[] args) {
        int n = new Scanner(System.in).nextInt();
        for (int i = 1; i <= n; i++) {
            for (int s = 0; s < n - i; s++) System.out.print(" ");
            for (int k = 0; k < 2 * i - 1; k++) System.out.print("*");
            System.out.println();
        }
    }
}
```

**5.**

```java
import java.util.Scanner;

public class Stats {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int count = 0, sum = 0;
        int max = Integer.MIN_VALUE, min = Integer.MAX_VALUE;  // 打擂台先立极端值

        int x = sc.nextInt();
        while (x != 0) {
            count++;
            sum += x;
            if (x > max) max = x;
            if (x < min) min = x;
            x = sc.nextInt();
        }
        System.out.printf("个数 %d 总和 %d 最大 %d 最小 %d%n", count, sum, max, min);
    }
}
```

（max/min 初值用 `Integer.MIN_VALUE/MAX_VALUE` 而不是 0——输入可能全是负数。）

**[▲ 返回目录](#toc)**

---

<a id="j04"></a>

# 第 4 章 方法与数组

> 本章目标：把代码切成方法（Java 叫 method，不叫函数）；彻底搞懂 Java 的"值传递"到底是什么；玩转数组与 `Arrays` 工具箱；初识方法重载与递归。

---

## 4.1 定义方法

方法 = 打包好的、有名字、可复用的代码段。定义在**类里面、其他方法外面**（Java 不允许方法套方法）：

```java
public class MethodDemo {

    static int max2(int a, int b) {       // 修饰符 返回类型 方法名(参数列表)
        return a > b ? a : b;
    }

    static void greet() {                 // void：无返回值
        System.out.println("你好！");
    }

    public static void main(String[] args) {
        int m = max2(3, 7);
        greet();
        System.out.println(m);            // 7
    }
}
```

解剖 `static int max2(int a, int b)`：

- `static`：静态方法，属于类本身，`main` 里直接调用（第 5 章讲 static 与非 static 的区别，前期一律加 static）；
- `int`：返回类型，`return` 交回结果并立刻结束方法；不返回就写 `void`；
- `(int a, int b)`：形参列表，每个都要带类型。

**方法名规范**：小驼峰 `lowerCamelCase`（`getMax`、`isPrime`），见名知义。

### 方法重载（overload）

**同名不同参**（参数个数或类型不同）——一个名字，多种入口：

```java
static int    max2(int a, int b)           { return a > b ? a : b; }
static double max2(double a, double b)     { return a > b ? a : b; }
static int    max2(int a, int b, int c)    { return max2(max2(a, b), c); }
```

调用时编译器按实参类型自动挑。JDK 里到处都是：`System.out.println` 有 10 个重载（int、double、String……各一个）。注意：**只有返回值不同不算重载**，编译器拒绝。

### 可变参数（varargs）

参数个数不定时，用 `类型... 名字`，方法内部当数组用：

```java
static int sum(int... nums) {              // 可传任意个 int
    int total = 0;
    for (int n : nums) total += n;
    return total;
}
// sum(1, 2) → 3；sum(1, 2, 3, 4) → 10；sum() → 0
```

### 方法设计的五条原则

写方法前用这五条过一遍，代码质量立刻不同：

1. **一个方法只做一件事**。`readAndSortAndPrint` 拆成三个方法，名字自己就把文档写了；
2. **一屏原则**：方法体超过 30~40 行，该拆了；
3. **参数能少则少**：超过 4 个参数，通常该定义一个参数对象（record）打包（第 7 章后这是标准动作）；
4. **先写签名再写实现**：返回类型、方法名、参数列表——签名是方法与世界的合同，合同想清楚，实现只是填空；
5. **防御性返回**：非法参数尽早 `return`/抛异常（fail fast），别带着脏数据往下算。

```java
// 签名优先的例子：名字与参数已经说明一切
static boolean isLeapYear(int year) { ... }
static int[] minMax(int[] data) { ... }         // 多返回值：返回数组/record
```

### Arrays.asList 与 List.of：三个易混工厂

数组与 List 互转时有两对工具，脾气不同：

```java
Integer[] arr = { 1, 2, 3 };

List<Integer> a = Arrays.asList(arr);    // 数组的“视图”：能 get/set，不能 add/remove！
// a.add(4);                              // UnsupportedOperationException
a.set(0, 99);                             // OK，且 arr[0] 也变成 99（同一块内存）

int[] raw = { 1, 2, 3 };
// Arrays.asList(raw)                     // 坑！得到 List<int[]>，长度 1

List<Integer> b = List.of(1, 2, 3);      // 不可变列表：get 可以，set/add/remove 全禁
Integer[] copy = b.toArray(new Integer[0]);   // List → 数组
```

记法：`Arrays.asList` 是"数组换皮"（定长、可改元素）；`List.of` 是"冻结列表"（全只读）；要能增删的普通列表就老老实实 `new ArrayList<>(List.of(...))`。

## 4.2 Java 的值传递：一个必须想通的问题

先立结论：**Java 只有值传递，永远复印。** 妙处在于要分两种复印：

**基本类型：复印值本身。**

```java
static void tryChange(int x) {
    x = 100;
}
int a = 10;
tryChange(a);
System.out.println(a);      // 10，纹丝不动
```

**引用类型：复印"遥控器"（地址）。** 遥控器复印了两台，但遥控的是同一台电视：

```java
static void fill(int[] arr) {
    arr[0] = 99;               // 顺着遥控器改电视里的内容 —— 外面看得到！
}
static void tryRepoint(int[] arr) {
    arr = new int[3];          // 把复印的遥控器对准另一台新电视 —— 与外面无关
}

int[] a = { 1, 2, 3 };
fill(a);
System.out.println(a[0]);      // 99
tryRepoint(a);
System.out.println(a[0]);      // 仍是 99：外面的 a 从没变过指向
```

```
main:  a ──┐            fill(arr)：arr（a 的复印件）──┐
           ├────▶ [1,2,3]                           ├─▶ 同一个数组
           ┆            tryRepoint: arr ──▶ new int[3]（另一台电视）
```

一句话记牢：**改"遥控器指向的内容"对外可见；改"遥控器本身的指向"对外不可见。** Java 没有指针运算、没有取地址符，但引用的语义处处都在。

## 4.3 数组

```java
int[] scores = new int[5];                    // 定长！创建后长度不可变
int[] primes  = { 2, 3, 5, 7, 11 };           // 静态初始化
String[] names = new String[3];               // 引用类型数组，默认值是 null！

scores[0] = 90;                               // 下标从 0 开始
System.out.println(scores.length);            // 5：length 是属性（没有括号）
```

三条铁律：

1. **长度创建时定死**，想变长要 new 新数组再拷贝（或用第 9 章的 ArrayList）；
2. **new 出来的数值数组默认补 0**（int[] 全是 0），boolean[] 全是 false——不给垃圾值，但引用类型数组默认 **null**，直接用会 `NullPointerException`；
3. 越界必抛 `ArrayIndexOutOfBoundsException`，带下标信息，比 C 友好得多——但逻辑上依然是 bug。

### 遍历：普通 for 与 for-each

```java
int[] a = { 90, 85, 78, 92, 66 };

for (int i = 0; i < a.length; i++) { ... }    // 要下标时用

for (int x : a) {                             // 只要值时用 for-each（只读遍历首选）
    System.out.println(x);
}
```

### Arrays 工具箱（`java.util.Arrays`）

数组没有方法可调，JDK 把常用操作做成静态工具类：

```java
import java.util.Arrays;

int[] a = { 5, 1, 9, 3 };

System.out.println(Arrays.toString(a));       // [5, 1, 9, 3]：打印数组必用它
                                               //（直接 println(a) 只会打出 [I@十六进制 之类的“遥控器指纹”）
Arrays.sort(a);                                // 原地升序排序 → [1, 3, 5, 9]
int[] b = Arrays.copyOf(a, 7);                 // 复制并扩长（多出补 0）
int[] c = Arrays.copyOfRange(a, 1, 3);         // 下标 [1,3) 的切片
System.out.println(Arrays.equals(a, b));       // 内容比较（== 比的是地址！）
int pos = Arrays.binarySearch(a, 5);           // 二分查找（需先有序）
Arrays.fill(c, 0);                             // 填充
```

**高频坑：`println(数组)` vs `Arrays.toString(数组)`**。前者打印的是 `[I@1b6d3586` 这种"类型+地址指纹"——数组变量是遥控器，println 打印遥控器不打印电视。这一坑与 `==` 比地址同源，第 6 章 equals 一节收网。

### 二维数组

```java
int[][] m = {
    { 1,  2,  3,  4 },
    { 5,  6,  7,  8 },
    { 9, 10, 11, 12 }
};
System.out.println(m.length);        // 3：行数
System.out.println(m[0].length);     // 4：第 0 行的列数

for (int[] row : m) {                // 二维数组 = 数组的数组
    for (int v : row) {
        System.out.printf("%4d", v);
    }
    System.out.println();
}
```

Java 的二维数组是"数组的数组"，每行长度可以不同（不规则数组）：`int[][] t = new int[3][]; t[0] = new int[5]; t[1] = new int[2];`。

### javadoc 注释：给方法写说明书

`//` 行注释给自己看；`/** */` 文档注释是给**所有调用者**看的说明书，IDEA 悬浮提示和官方 API 文档都从它生成：

```java
/**
 * 判断一个数是否为素数。
 * <p>只试除到 √n，时间复杂度 O(√n)。
 *
 * @param n 待判断的整数
 * @return 是素数返回 true；n < 2 返回 false
 * @throws IllegalArgumentException 当 n 为 Integer.MIN_VALUE 时
 */
static boolean isPrime(int n) { ... }
```

写什么：一句话职责 + 特殊行为说明（边界、异常、复杂度）。不写什么："遍历 i 从 2 到 n"这种翻译代码的废话。团队协作里，**方法签名 + javadoc 就是接口合同**，别人不看实现也能放心调用。养成习惯：公开方法动笔前先写一行 javadoc——写不清楚职责，多半是设计还没想清楚。IDEA 里输入 `/**` 回车自动生成骨架，`javadoc` 工具可导出整套 HTML 文档（第 1 章 JDK 目录一节的伏笔在此收回）。

## 4.4 递归

方法调用自己。两板斧：**出口 + 缩小**。

```java
static long fact(int n) {
    if (n <= 1) return 1;              // 出口
    return n * fact(n - 1);            // 缩小：n-1 朝出口走
}
System.out.println(fact(10));          // 3628800
```

忘了出口 → 无限递归 → 每层调用占一帧栈 → `StackOverflowError`（Java 版栈溢出，第 12 章用 JVM 视角再看它）。汉诺塔、斐波那契与 C 教程同理：递归写起来优美，但有重复子问题的（如朴素 fib）性能崩塌，工程上换循环或缓存。选型口诀：**问题本身是"套娃"结构的用递归；线性重复的活用循环。**

### 递归的调用栈：一步一步看懂

以 `fact(4)` 为例，把"压栈 → 回卷"写在纸上（配合第 12 章 JVM 栈帧食用）：

```
调用压栈（自上而下生长）：          回卷返回（自下而上结算）：
main 调 fact(4)                    fact(1) 返回 1
  fact(4) 要等 fact(3)             fact(2) = 2 * 1  = 2
    fact(3) 要等 fact(2)           fact(3) = 3 * 2  = 6
      fact(2) 要等 fact(1)         fact(4) = 4 * 6  = 24
        fact(1) 到达出口，返回 1    main 得到 24
```

四个帧同时在栈上——每个帧有自己的 `n`。这解释三件事：深度就是内存开销（StackOverflowError）；各层变量互不干扰；以及"递归效率低于循环"的原因（方法调用本身有压栈开销）。**写递归先画这张图，画得出就写得对**。

### 二维数组实战：杨辉三角

杨辉三角：每行首尾是 1，中间的数 = 上一行左右两数之和。二维数组 + 规则填充的标准练习：

```java
int n = 8;
int[][] tri = new int[n][];
for (int i = 0; i < n; i++) {
    tri[i] = new int[i + 1];               // 不规则数组：第 i 行有 i+1 个
    tri[i][0] = tri[i][i] = 1;             // 首尾置 1（链式赋值）
    for (int j = 1; j < i; j++) {
        tri[i][j] = tri[i - 1][j - 1] + tri[i - 1][j];   // 上行左右之和
    }
}
for (int[] row : tri) {
    System.out.println(java.util.Arrays.toString(row));
}
// [1]
// [1, 1]
// [1, 2, 1]
// [1, 3, 3, 1] ...
```

三个考点一次练完：**不规则二维数组**（每行长度不同）、**先填边界再填中间**的填充顺序、**依赖上一行**的状态推导（这正是动态规划的雏形，算法之路从这行代码开始）。

## 4.5 main 的参数

```java
public static void main(String[] args)
```

`args` 是命令行参数（不含程序名，这点与 C 不同）：

```
java Demo hello 42
// args = ["hello", "42"]，都是字符串，数字要自己 Integer.parseInt(args[1])
```

## 4.6 小结

- 方法定义在类里；重载 = 同名不同参；varargs 让参数个数灵活；
- **Java 只有值传递**：基本类型复印值，引用类型复印遥控器——改内容可见、改指向不可见；
- 数组定长、默认值 0/null、越界抛异常；打印用 `Arrays.toString`；
- Arrays 工具箱：sort/copyOf/equals/binarySearch；二维数组是数组的数组；
- 递归 = 出口 + 缩小，StackOverflowError 是它的死亡方式。

## 练习 4

1.（概念）为什么下面代码输出 3 而不是 100？

```java
static void change(int[] arr) { arr = new int[]{ 100 }; }
public static void main(String[] a) {
    int[] x = { 3 };
    change(x);
    System.out.println(x[0]);
}
```

2.（概念）`int[] a = {1,2}; int[] b = {1,2};` 则 `a == b` 和 `Arrays.equals(a, b)` 各是什么？
3.（编程）写方法 `static int[] stats(int[] a)`，一次遍历返回 `[最小值, 最大值]`（返回数组），main 中验证。
4.（编程）写方法 `static boolean isPalindrome(String s)` 判断回文（提示：`s.charAt(i)` 取第 i 个字符，`s.length()` 取长度）。
5.（编程）递归实现 `static int sumDigits(int n)`：数字之和，`sumDigits(1234)` = 10。

## 参考答案

**1.** change 里把**复印的遥控器** arr 指向了新数组，main 里的 x 依旧指着原来的 `{3}`——改"指向"对外不可见。若写成 `arr[0] = 100;` 输出才会是 100。

**2.** `a == b` 为 **false**（两个遥控器指向两个不同数组对象，比的是地址）；`Arrays.equals(a, b)` 为 **true**（逐元素比较内容）。

**3.**

```java
static int[] stats(int[] a) {
    int min = a[0], max = a[0];
    for (int x : a) {
        if (x < min) min = x;
        if (x > max) max = x;
    }
    return new int[] { min, max };       // 匿名数组直接返回
}
```

**4.**

```java
static boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        if (s.charAt(left) != s.charAt(right)) return false;
        left++;
        right--;
    }
    return true;
}
```

**5.**

```java
static int sumDigits(int n) {
    if (n < 10) return n;
    return n % 10 + sumDigits(n / 10);
}
```

**[▲ 返回目录](#toc)**

---

<a id="j05"></a>

# 第 5 章 面向对象（一）：类、对象与封装

> 本章目标：从"变量装数据、方法装逻辑"升级到"对象 = 数据 + 行为的一体化包装"。搞懂类与对象的关系、构造器、this、封装、static。从本章起建议改用 IntelliJ IDEA（Community 版）写代码。

---

## 5.1 为什么需要面向对象

用现有知识也能写程序：变量 + 数组装数据，方法装逻辑。但规模一大就乱：学生的数据散落各处，改一处要全局搜；相关的方法和数据没有归属，谁都能乱改。

**面向对象（OOP）的核心主张：把"数据"和"操作这些数据的行为"打包在一起，起个名字，叫类（class）。**

- **类 = 图纸**：定义一类东西有哪些属性（字段）和行为（方法）。写好类不占业务内存，只是模板；
- **对象（object）= 按图纸造出的实例**：`new` 一次造一个，各有各的数据，互不干扰。

```
类 Student（图纸）                对象 s1、s2、s3（实例）
┌───────────────────────┐        ┌─────────┐  ┌─────────┐  ┌─────────┐
│ 属性：name, score      │  new ─▶│ 张三 90 │  │ 李四 66 │  │ 王五 95 │
│ 行为：study(), print() │        └─────────┘  └─────────┘  └─────────┘
└───────────────────────┘         同一张图纸，三份独立的数据
```

一张图纸造千万实例——这就是 Java 代码的基本组织方式。整个 JDK 就是几万个类的集合。

## 5.2 定义第一个类

```java
public class Student {
    // 字段（属性）：对象的数据
    String name;
    int score;

    // 方法（行为）：对象能干什么
    void study() {
        System.out.println(name + " 正在学习");
    }

    void print() {
        System.out.printf("%s：%d 分%n", name, score);
    }
}
```

**文件与类**：`public class Student` 必须放在 `Student.java`。一个文件可有多个类，但**只能有一个 public 类**（文件名与它一致）。

创建与使用对象：

```java
public class School {
    public static void main(String[] args) {
        Student s1 = new Student();     // new：按图纸造实例，返回遥控器
        s1.name = "张三";               // 对象.字段
        s1.score = 90;
        s1.study();                      // 对象.方法 —— 张三 正在学习
        s1.print();                      // 张三：90 分

        Student s2 = new Student();
        s2.name = "李四";
        s2.score = 66;
        s2.print();                      // 李四：66 分 —— 实例数据互不干扰
    }
}
```

注意 `School` 和 `Student` 可以放在同一目录分别编译，也可以写在两个文件——一个文件一个 public 类最清晰。还要重新理解一句话：**`Student s1` 这个变量装的是遥控器，对象本体在堆（JVM 内存区）里**（第 12 章配 JVM 全景图）。`s1 = s2;` 之后两个变量遥控同一个对象——第 4 章"引用"的落地。

### 对象在内存里的样子（把第 2、4 章的图接上）

现在把三张图拼成一张，这是理解 Java 内存的**核心图**：

```
栈（main 的栈帧）                    堆（对象住的地方）
┌─────────────────┐
│ s1 ─────────────┼───────▶ ┌──────────────────────┐
│ s2 ─────────────┼───────▶ │ Student 对象①          │
└─────────────────┘         │  name ──▶ "张三"(字符串池)│
                            │  score = 90             │
                            └──────────────────────┘
                            ┌──────────────────────┐
                            │ Student 对象②          │
                            │  name ──▶ "李四"        │
                            │  score = 66             │
                            └──────────────────────┘
```

四个推论（后面章节全部用到）：

1. `s1 = s2` 之后：两个遥控器指同一对象，对象①变成"无主孤儿"（会被 GC 回收，第 12 章）；
2. `s1 == s2` 比的是遥控器是否指向同一对象；`s1.equals(s2)` 才该比内容（第 6 章重写）；
3. 方法调用 `s1.study()` 时，`this` 就是对象①——study 的代码只有一份（存在类信息里），执行时"绑"到具体对象上；
4. `s1.name = null` 后调 `s1.study()` 若里面用 `name.length()` → `NullPointerException`：堆里对象在，字段却是 null。

## 5.3 构造器：对象的出生仪式

构造器（constructor）是特殊方法：**与类同名、无返回类型**，`new` 的时候自动调用，专职初始化：

```java
public class Student {
    String name;
    int score;

    Student(String name, int score) {     // 构造器
        this.name = name;                 // this.name 是字段，name 是参数
        this.score = score;
    }

    void print() {
        System.out.printf("%s：%d 分%n", name, score);
    }
}

// 使用
Student s1 = new Student("张三", 90);      // 创建即初始化，杜绝“忘了赋值”
```

三条规则：

1. **不写构造器时，编译器送一个无参空构造器**（默认构造器）；你一旦写了任何构造器，白送的立刻收回——`new Student()` 就编译不过了；
2. 构造器也能重载（`Student(String name)` 与 `Student(String name, int score)` 并存）；
3. `this` = "当前对象自己"。字段与参数同名时，`this.name` 指字段、裸 `name` 指参数——这是 this 最常见的用武之地。

```java
Student() {                               // 无参构造器：给默认值
    this("无名", 0);                       // this(...) 调用另一个构造器，必须放第一行
}
```

## 5.4 封装：private + getter/setter

到目前为止，外界可以 `s1.score = -999;`——数据裸奔，谁都能塞脏东西。**封装（encapsulation）**：字段藏起来（private），只开门营业（公有方法）：

```java
public class Student {
    private String name;                  // 私有：只有本类的方法能碰
    private int score;

    public Student(String name, int score) {
        this.name = name;
        setScore(score);                  // 构造器里也走校验
    }

    public String getName() {             // getter：读
        return name;
    }

    public void setScore(int score) {     // setter：写，带守门员
        if (score < 0 || score > 100) {
            throw new IllegalArgumentException("成绩必须在 0~100：" + score);
        }
        this.score = score;
    }
    public int getScore() {
        return score;
    }
}

// 外界：
s1.setScore(-999);                        // 抛异常，脏数据进不来
System.out.println(s1.getName());
```

封装的收益：**数据只能通过你开的门进出，门里就能立规矩**（校验、联动、日志）。private 字段 + public getter/setter 是 Java 最普遍的类写法，IDEA 里 `Alt+Insert`（或右键 Generate）一键生成。

### 封装问答：为什么不直接 public

**问：字段都 public，代码短一半，凭什么要写 getter/setter？**

答分三层，越往后越值钱：

1. **现在**：setter 里能立规矩。`setScore(-999)` 被 5.4 节的校验拦下；全 public 的话，全项目搜"谁塞了脏数"去吧；
2. **下个月**：只读/只写随你控。只给 getter 不给 setter，成绩就成了"创建后不可改"——**用访问权限表达业务规则**；
3. **明年**：内部实现随便换。字段 score 想改成"等级 + 折算"，getter 内部换算法，调用方一行不改——外界依赖的是"门"，不是"房间布局"。

这就是封装的长期回报：**把"数据怎么存"和"外界怎么用"隔开**，中间留出演进空间。JDK 的 String 内部从 char[] 换成 byte[]（JDK 9），全世界几十亿行调用 String 的代码毫无感知——这就是教科书级的封装红利。

## 5.5 访问修饰符：四档门禁

| 修饰符         | 本类 | 同包 | 子类 | 全世界 | 用途                  |
| -------------- | ---- | ---- | ---- | ------ | --------------------- |
| `private`      | ✓    | ✗    | ✗    | ✗      | 字段、内部辅助方法    |
| （不写，默认） | ✓    | ✓    | ✗    | ✗      | 包内协作              |
| `protected`    | ✓    | ✓    | ✓    | ✗      | 供子类使用（第 6 章） |
| `public`       | ✓    | ✓    | ✓    | ✓      | 对外的门面            |

原则：**能小不大**。字段默认 private，方法从 public 开始收窄。

### this 的三副面孔

`this` = 当前对象的引用，三种用法按出场率排：

```java
public Student(String name, int score) {
    this.name = name;                 // ① 区分字段与同名参数（最高频）
    this.score = score;
}

public Student(String name) {
    this(name, 0);                    // ② 调用另一个构造器（必须第一行，避免重复初始化代码）
}

public void print() {
    System.out.println(this.name);    // ③ 显式指“当前对象的 name”
    introduce(this);                  //    把自己传给别人（回调场景常见）
}
```

第③种场景平时可省（裸写 name 默认就是 this.name），但在 Lambda、匿名类、事件回调里"把当前对象递出去"时是真本事。**static 方法里没有 this**——它不属于任何对象，这再次解释了 5.2 节 main 的问题。

## 5.6 static：属于类，不属于对象

不加 static 的字段/方法属于**每个对象**；加 static 后属于**类本身**，全体实例共享一份：

```java
public class Student {
    private static int totalCount = 0;         // 全体学生共享的计数器

    public Student(String name, int score) {
        ...
        totalCount++;                          // 每造一个学生 +1
    }

    public static int getTotalCount() {        // 静态方法
        return totalCount;
    }
}

Student.getTotalCount();                       // 用类名调用，不需要任何实例
```

特征与规矩：

- 静态成员随类加载而存在（第 12 章讲类加载），没有实例也存在；
- **静态方法里不能直接用实例成员**（没有"当前对象"，用谁的字段？），要用必须先 new 或通过参数传入——`main` 是 static 的，所以它调用的方法前期都写成 static，谜底在此揭晓；
- 常量标配 `public static final`：`public static final double PI = 3.14159;`

```
类 Student（静态区）                 实例们（堆）
┌──────────────────┐              ┌─────────┐ ┌─────────┐
│ totalCount = 3   │◀── 共享 ──  │ 张三 90  │ │ 李四 66  │ ...
└──────────────────┘              └─────────┘ └─────────┘
```

## 5.7 包（package）：类的文件夹

项目一大，几百个类必须分目录管理。包 = 文件夹 + 命名空间：

```java
package com.school.model;            // 文件第一行声明所在包（对应目录 com/school/model）

public class Student { ... }
```

使用其他包的类要 import：

```java
import com.school.model.Student;     // 单个类
import com.school.model.*;           // 整包（慎用，容易撞名）
import java.util.ArrayList;          // JDK 类也在包里：java.util
```

规则：

- 包名全小写、倒置域名开头（`com.company.project`）是行业惯例；
- 同一个包里的类互相使用不用 import——这就是"默认（不写）修饰符 = 包内可见"的适用场景；
- IDEA 里 New Package / New Class 一路点，目录结构自动建好。

### 包与目录实战：命令行编译带包的类

IDEA 帮你把包管理得无感，但亲手走一遍命令行，"包=目录"的本质才扎实。目录结构：

```
demo/
└── com/
    └── example/
        └── Person.java      （首行 package com.example;）
└── com/example/Student.java （package com.example;）
└── Main.java                （package 可以不写——“默认包”，仅学习期用）
```

在 `demo` 目录下：

```
javac -d . com/example/Person.java com/example/Student.java Main.java
java Main                       ← 运行默认包里的 Main
```

`-d .` 让编译产物按包结构输出到当前目录（`com/example/Person.class`）。Main 若也想进包（`package com;`），运行就要用**全限定名**：`java com.Main`——这正是第 1 章"找不到或无法加载主类"坑的谜底之一：**带包的类必须带包名运行**。IDE 里点运行没事，是因为 IDE 在替你拼这条命令。

## 5.8 toString：让对象能"打印"

直接 `System.out.println(s1)` 会输出 `Student@1b6d3586`（类名@地址指纹）——因为 println 默认调用对象的 `toString()`，而 Object 类默认的 toString 就这么敷衍（Object 是所有类的祖先，第 6 章展开）。**重写它**：

```java
public class Student {
    ...
    @Override                            // 注解：告诉编译器“我在重写父类方法”，拼错会报错
    public String toString() {
        return "Student{name='" + name + "', score=" + score + "}";
    }
}

System.out.println(s1);                  // Student{name='张三', score=90}
```

`@Override` 不是装饰品：写上它，编译器帮你核对方法签名是否真的重写了父类方法，防手滑。IDEA：`Alt+Insert → toString()` 一键生成（record 类第 7 章自动全带）。

## 5.9 小结

- 类是图纸，对象是 new 出来的实例；对象变量装的是遥控器；
- 构造器与类同名、管出生初始化、可重载；`this` 指当前对象；
- 封装 = private 字段 + public getter/setter，门口立规矩；
- 四档访问修饰符，字段默认 private；static 属于类全体共享，静态方法里摸不到实例成员；
- 包管理类的命名空间；重写 toString 让对象可读地打印。

## 练习 5

1.（概念）类和对象的关系是什么？`new Student()` 时 JVM 做了什么（按你现在的理解描述）？
2.（概念）为什么 `main` 方法里直接调用非 static 方法会编译错误？
3.（编程）设计 `BankAccount` 类：private 字段 `owner`（户主）、`balance`（余额，double），构造器初始化；`deposit(double)` 存款（负数抛异常）、`withdraw(double)` 取款（余额不足抛异常）、`getBalance()` 查询。写 main 演示"存 1000、取 300、再取 800 会怎样"。
4.（编程）给 `Student` 加静态字段统计已创建的学生数，并加静态方法查询，验证多 new 几个后计数正确。
5.（概念）`s1 == s2` 与 `s1.equals(s2)` 判断学生是否同一人有什么区别？现在你会怎么实现"按学号比较两个学生是否同一人"？（equals 的标准重写第 6 章补全）

## 参考答案

**1.** 类是模板/图纸，对象是按图纸在堆内存中创建的实例；`new Student()` 分配内存、字段给默认值、执行构造器初始化、返回对象的引用（遥控器）。

**2.** static 方法属于类、没有当前对象（this 不存在）；非 static 方法属于具体实例，必须"某个对象.方法()"来调用——main 执行时可能一个实例都没有，无处依附。要调用需先 `new` 一个对象。

**3.**

```java
public class BankAccount {
    private final String owner;
    private double balance;

    public BankAccount(String owner, double balance) {
        this.owner = owner;
        this.balance = balance;
    }

    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("存款必须为正数");
        balance += amount;
    }

    public void withdraw(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("取款必须为正数");
        if (amount > balance) throw new IllegalStateException("余额不足");
        balance -= amount;
    }

    public double getBalance() { return balance; }

    public static void main(String[] args) {
        BankAccount acc = new BankAccount("张三", 0);
        acc.deposit(1000);
        acc.withdraw(300);
        System.out.println(acc.getBalance());    // 700.0
        acc.withdraw(800);                        // 抛 IllegalStateException: 余额不足
    }
}
```

（练习抛异常即可，异常处理语法第 10 章专讲。）

**4.** 在 5.6 节代码基础上验证：new 三个学生后 `Student.getTotalCount()` 返回 3。

**5.** `==` 比较两个变量是否遥控**同一个对象**（地址）；`equals` 默认（Object 提供）与 == 等价，重写后可按业务内容（如学号）判断"同一人"。现阶段实现：比较 `s1.getId() == s2.getId()`；标准 equals 重写第 6 章学。

**[▲ 返回目录](#toc)**

---

<a id="j06"></a>

# 第 6 章 面向对象（二）：继承、多态与抽象

> 本章目标：掌握 extends、方法重写、动态绑定（多态的发动机）、抽象类、Object 三件套（toString/equals/hashCode）。学完你将理解 Java 类型系统的骨架，以及"面向接口编程"的前置一半。

---

## 6.1 继承（extends）：站在父类的肩膀上

场景：学生、教师都有姓名、年龄，都要"自我介绍"，但介绍内容不同。复制粘贴两份代码？改一处忘一处。**继承**让子类自动获得父类的字段和方法：

```java
public class Person {                              // 父类（基类）
    protected String name;
    protected int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void introduce() {
        System.out.println("我叫 " + name + "，" + age + " 岁");
    }
}

public class Student extends Person {              // 子类：is-a 学生是人
    private double score;

    public Student(String name, int age, double score) {
        super(name, age);                          // 调用父类构造器，必须第一行
        this.score = score;
    }

    public double getScore() { return score; }
}

public class Teacher extends Person {
    private String subject;

    public Teacher(String name, int age, String subject) {
        super(name, age);
        this.subject = subject;
    }
}
```

使用：

```java
Student s = new Student("张三", 19, 90);
s.introduce();          // 我叫 张三，19 岁 —— 父类方法直接继承
System.out.println(s.getScore());
```

规则：

- Java **单继承**：一个类只能 extends 一个父类（多继承的混乱被设计者直接砍掉，"多个能力"用第 7 章的接口实现）；
- 构造器不可继承；子类构造器**必须**先调 `super(...)`（不写编译器自动插一个无参 `super()`，父类没有无参构造器时必须显式写）；
- `super` = 父类那一份：`super(...)` 调父类构造器，`super.方法()` 调父类版本；
- 所有类最终都继承自 `java.lang.Object`——不写 extends 也默认继承它；
- `final class` 不能被继承（String 就是）；`final` 方法不能被重写。

## 6.2 方法重写（override）：子类改进行为

学生介绍时想带上成绩——**重写**父类方法：

```java
public class Student extends Person {
    ...
    @Override
    public void introduce() {                      // 同名同参同返回
        super.introduce();                         // 复用父类逻辑（可选）
        System.out.println("学生，成绩 " + score);
    }
}
```

重写（override）与重载（overload）一字之差，天壤之别：

|          | 重载 overload            | 重写 override                  |
| -------- | ------------------------ | ------------------------------ |
| 发生在   | 同一个类（或继承关系里） | 子类对父类                     |
| 要求     | **同名不同参**           | **同名同参同返回**（签名一致） |
| 绑定时机 | 编译期按参数类型挑选     | 运行期按对象实际类型挑选       |

规矩：重写方法的访问权限**只能放大不能缩小**（protected → public 可以，→ private 不行）；`@Override` 注解永远带上。

## 6.3 多态：同一个调用，多种行为（OOP 的发动机)

看这段"魔法"：

```java
Person p1 = new Student("张三", 19, 90);
Person p2 = new Teacher("李四", 35, "物理");

p1.introduce();
// 我叫 张三，19 岁
// 学生，成绩 90.0
p2.introduce();
// 我叫 李四，35 岁  ←（Teacher 若未重写，就用 Person 版本）
```

变量声明为 `Person`，装的实际是 Student/Teacher——**调用 introduce 时执行的是"实际对象"的版本**。这叫**动态绑定/运行期多态**：编译期只查"Person 有没有这个方法"，运行期按遥控器指向的真身执行。

三条要点：

1. **向上转型自动**（子类遥控器塞给父类变量，安全：学生一定是人）；**向下转型必须强转且先用 `instanceof` 检查**：

```java
if (p1 instanceof Student st) {          // JDK 16+ 模式匹配：判断+转型+命名一步到位
    System.out.println(st.getScore());   // 父类变量没有 getScore，转回 Student 才能用
}
// JDK 8/11 老写法：if (p1 instanceof Student) { Student st = (Student) p1; ... }
```

强转错了类型抛 `ClassCastException`——instanceof 先把关。

2. **父类引用看不见子类新增成员**：`Person p` 变量上调 `getScore()` 编译不过（Person 图纸上没有这个方法），尽管真身是 Student。想用，转型。

3. 多态的真正威力在**批量处理**：

```java
Person[] people = {
    new Student("张三", 19, 90),
    new Teacher("李四", 35, "物理"),
    new Student("王五", 20, 66)
};

for (Person p : people) {
    p.introduce();                        // 一行代码，各喊各的 —— 新增子类这行不用改
}
```

未来加一个 `Admin extends Person`，循环一行不改照常工作——这就是"对扩展开放"的最直观体验，也是框架代码到处是 `父类/接口 变量` 的原因。

### 多态三问三答（把 6.3 想通）

**问一：编译器怎么决定"能不能调"？** 只看变量声明类型。`Person p` 只能调 Person 声明过的方法，哪怕真身是 Student——图纸没画的功能，遥控器上没有那个按钮。

**问二：运行时怎么决定"执行哪个版本"？** 按对象实际类型（new 的时候定死的那个类）动态绑定。变量只是遥控器，电视自己知道自己的节目单。

**问三：父类方法里调子类重写的方法行吗？** 行，而且这是框架的日常：

```java
public abstract class Game {
    public final void run() {              // 模板方法：流程定死
        start();
        int turns = play();                // 调“抽象/可重写”的钩子
        end(turns);
    }
    protected void start() { System.out.println("初始化"); }
    protected abstract int play();         // 子类填空
    protected void end(int n) { System.out.println("结束，共 " + n + " 回合"); }
}
```

Game.run() 写死流程，把 play() 留给子类——**父类定骨架、子类填血肉**（模板方法模式）。Spring 的很多回调机制就是它的工业化版本。

### 里氏替换原则（直觉版）

继承的隐形合同：**凡是父类出现的地方，换成任何子类，程序行为必须依然正确**。反例：

```java
class Bird { void fly() { ... } }
class Penguin extends Bird {
    @Override void fly() { throw new UnsupportedOperationException("企鹅不会飞"); }
}
// 某方法接收 Bird 调 fly() —— 传 Penguin 进去当场爆炸
```

企鹅是鸟（生物学），但"Penguin 能替换 Bird"不成立（工程上）——继承看的是**行为兼容**，不是现实分类。当子类开始抛异常、偷偷改语义、削弱前置条件，就是在违反里氏替换，此时改用组合/接口。这一原则（SOLID 中的 L）是第 7 章"面向接口编程"的另一半理论基础。

## 6.4 抽象类（abstract）：只设计、不出厂

有时父类只该当图纸、不该被 new（"一个人"太抽象，该造的总是学生或教师）。加 `abstract`：

```java
public abstract class Person {
    protected String name;
    protected int age;

    public abstract void work();          // 抽象方法：只有声明没有实现

    public void sleep() {                 // 普通方法照常有实现
        System.out.println(name + " 在睡觉");
    }
}

public class Student extends Person {
    @Override
    public void work() {                  // 子类必须实现所有抽象方法
        System.out.println(name + " 在学习");
    }
}
```

规矩：抽象方法只有签名无方法体；**含抽象方法的类必须声明为抽象类**；抽象类不能 new，只能被继承；子类要么实现全部抽象方法，要么自己也抽象。

用途定位：**抽象类 = "半成品图纸"**，把公共实现（sleep）放这儿，把"必须由子类回答的问题"（work）留成抽象方法。

## 6.5 Object 三件套：toString / equals / hashCode

所有类的祖先 Object 有三个最常被重写的方法。

### toString：打印成什么样（第 5 章已见）

### equals：什么算"相等"

`==` 比遥控器（同一对象才 true）；**equals 供你定义"内容相等"**：

```java
public class Student {
    private final String id;              // 学号唯一
    private String name;

    public Student(String id, String name) {
        this.id = id;
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;                        // 同一对象，快路径
        if (!(o instanceof Student)) return false;         // 类型都不对
        Student other = (Student) o;
        return id.equals(other.id);                        // 业务规则：学号同即同一人
    }

    @Override
    public int hashCode() {
        return id.hashCode();              // 铁律见下
    }
}
```

**equals 与 hashCode 的铁律**：两个对象 equals 相等，hashCode 必须相等（反过来不要求）。HashSet/HashMap（第 9 章）先按 hashCode 分桶再按 equals 精判——违反铁律，对象放进集合后"找不到"。

IDEA `Alt+Insert` 可一键生成规范的两兄弟；record 类（第 7 章）自动实现。另外注意 `id.equals(other.id)`——字段比较也要用 equals（String 也是引用）。

### Object 类还藏了什么

除了三件套，Object 还有几个常见方法，混个脸熟：

```java
Class<?> c = s1.getClass();     // 运行时拿到“真身类”的元信息（反射的入口）
System.out.println(c.getName()); // com.example.Student

s1.hashCode();                  // 对象的哈希码（与 equals 成对出现，见 6.5）
```

`getClass()` 是"运行时才知道的类型"——多态变量声明是 Person，`p.getClass()` 返回的是 Student。它是反射与很多框架（Spring 扫描注解、JSON 序列化）的地基。另两个历史包袱了解即可：`finalize()`（对象回收前回调，JDK 9 起废弃——清理资源请用 try-with-resources）、`clone()`（克隆对象，深浅拷贝坑多，**生产代码用拷贝构造器或工具类**，如 `new ArrayList<>(list)`）。

## 6.6 组合优先于继承（进阶心智）

继承解决 is-a（学生**是**人）；另一个常见关系是 has-a（汽车**有**引擎）：

```java
public class Engine {
    void start() { System.out.println("引擎启动"); }
}

public class Car {
    private final Engine engine = new Engine();    // 组合：成员变量

    void drive() {
        engine.start();                            // 委托
        System.out.println("出发");
    }
}
```

组合更灵活（换引擎不动汽车代码）、不破坏封装。行业经验：**能用组合就别硬上继承**——继承是强耦合，父类改动会波及所有子类。

### final 家族：三处用法一次理清

`final` 出现在三个位置，含义都是"到此为止，不许再变"：

```java
final int MAX = 100;                  // ① final 变量：只能赋值一次（常量）
final Student s = new Student(...);   //    final 引用：遥控器钉死 —— 但对象内容仍可改！
s.setScore(95);                        //    OK：改的是堆里的电视
// s = new Student(...);               //    编译错误：遥控器不能再指向别处

final class StringX { }               // ② final 类：不许继承（String 就是）
class P { final void m() { } }         //    final 方法：不许重写（可重载）

record Point(int x, int y) { }         // ③ record 字段天然 final —— 不可变类的语法基石
```

最容易想错的是 ① 中"final 引用"：**钉住的是引用，不是对象**。把字段声明成 `final` 能保证"这个字段永远指向同一个对象"（构造完成后线程可见性也有保证），是构建不可变类与线程安全代码的基础件。

## 6.7 小结

- extends 单继承；子类构造器第一行 super(...)；super 访问父类那一份；
- 重写 = 子类同名同参同返回 + @Override；与重载（同名不同参、编译期挑选）相对；
- **多态**：父类变量装子类对象，方法调用按实际类型执行；向上转型自动，向下转型先 instanceof；
- 抽象类不能 new，抽象方法逼子类实现；Object 三件套常重写，equals/hashCode 必须成对；
- is-a 用继承，has-a 用组合，组合优先。

## 练习 6

1.（概念）子类构造器不写 `super(...)` 会怎样？父类只有带参构造器时又怎样？
2.（概念）`Person p = new Student(...)` 后，`p.getScore()`（getScore 是 Student 特有方法）为什么编译不过？怎么解决？
3.（概念）重载和重写的区别，各在什么时机决定调用哪个方法？
4.（编程）设计抽象类 `Shape`（字段 name，抽象方法 `double area()`，普通方法 `void report()` 打印名称和面积），子类 `Circle`（半径）与 `Rect`（宽高）。main 里用 `Shape[]` 装入若干图形，统一 report。
5.（编程）给第 5 章的 `Student`（含学号字段）重写 equals 和 hashCode，并用 `new Student("001","张三").equals(new Student("001","李四"))` 验证。

## 参考答案

**1.** 编译器自动插入无参 `super()`；若父类**只有**带参构造器（无参版不存在），插入的 `super()` 找不到目标，编译错误——必须手动在第一行写 `super(实参)`。

**2.** 编译器按**变量声明类型**（Person）检查方法存在性，Person 图纸上没有 getScore；解决：`if (p instanceof Student st) st.getScore();`（向下转型）。

**3.** 重载：同名不同参，同一个类里多个版本，**编译期**按实参类型定；重写：子类覆盖父类同名同参方法，**运行期**按对象实际类型动态绑定。

**4.**

```java
public abstract class Shape {
    private final String name;

    protected Shape(String name) { this.name = name; }

    public abstract double area();

    public void report() {
        System.out.printf("%s 面积 %.2f%n", name, area());
    }
}

class Circle extends Shape {
    private final double r;
    Circle(double r) { super("圆"); this.r = r; }
    @Override public double area() { return Math.PI * r * r; }
}

class Rect extends Shape {
    private final double w, h;
    Rect(double w, double h) { super("矩形"); this.w = w; this.h = h; }
    @Override public double area() { return w * h; }
}

class Main {
    public static void main(String[] args) {
        Shape[] shapes = { new Circle(2), new Rect(3, 4), new Circle(1) };
        for (Shape s : shapes) s.report();
    }
}
```

**5.** 按第 6.5 节模板，把判断字段换成 id（String），`equals` 里 `return id.equals(other.id);`、`hashCode()` 返回 `id.hashCode()`。验证输出 true（业务上"同一学号 = 同一学生"）。

**[▲ 返回目录](#toc)**

---

<a id="j07"></a>

# 第 7 章 面向对象（三）：接口、枚举、record 与 Lambda

> 本章目标：接口（多继承的正规解法、面向抽象编程的钥匙）、Lambda 表达式初见、枚举、record。本章收束 OOP 三部曲，同时为第 9 章集合、第 11 章 Stream/多线程备好弹药。

---

## 7.1 接口（interface）：能力的合同

继承表达 is-a，但"能干什么"往往跨越家族：学生能游泳，鱼也能游泳，它们却没有共同父类。**接口 = 一份能力合同**：只声明"要会什么"，不规定"你是谁"：

```java
public interface Swimmer {
    void swim();                       // 接口方法默认 public abstract，不用写修饰符
}

public interface Comparable2<T> {      // JDK 真有 Comparable，见第 9 章
    int compareTo(T other);
}
```

类用 `implements` 签合同，而且**可以同时签多份**：

```java
public class Student extends Person implements Swimmer, Comparable2<Student> {
    private double score;
    ...

    @Override
    public void swim() {                       // 必须实现合同的每个条款
        System.out.println(name + " 用自由泳");
    }

    @Override
    public int compareTo(Student other) {
        return Double.compare(this.score, other.score);
    }
}

public class Fish implements Swimmer {         // 鱼和学生没有血缘，却签同一份合同
    @Override
    public void swim() {
        System.out.println("摆尾巴游");
    }
}
```

接口的价值在使用方——**按能力编程**：

```java
Swimmer[] pool = { new Student("张三", 19, 90), new Fish() };
for (Swimmer s : pool) {
    s.swim();                          // 各游各的 —— 多态的接口版
}
```

接口要点：

- 接口可以声明**常量**（自动 public static final）和（JDK 8+）**default 默认方法**（带实现，解决定型后追加功能的兼容问题）：

```java
public interface Swimmer {
    void swim();

    default void rest() {                       // 默认方法：实现类不写也能用
        System.out.println("休息一下");
    }
}
```

- 接口之间可以继承（`interface A extends B, C` 多继承没问题，因为无实现冲突问题）；
- 一个类只能 extends 一个类，但可以 implements **多个**接口——"多继承"的正规解法；
- JDK 17+ 还有 sealed 接口/类（限制谁可继承实现），进阶话题，混个脸熟即可。

### 抽象类 vs 接口：怎么选

|          | 抽象类                           | 接口                    |
| -------- | -------------------------------- | ----------------------- |
| 关系语义 | is-a（血缘，共享状态与部分实现） | can-do（能力，纯合同）  |
| 字段     | 可有实例字段                     | 只有常量                |
| 方法     | 可有已实现方法                   | 抽象方法 + default 方法 |
| 数量     | 只继承一个                       | 实现多个                |

经验：**描述"是什么"且有公共代码 → 抽象类；描述"能干什么" → 接口**。两者常搭配：接口定义合同，抽象类做中间层公共实现。

### 接口的演进：default / static / private 方法

接口并非死板清单，JDK 8 后它可以有三类"带身体"的方法：

```java
public interface Loggable {
    void log(String msg);                       // 抽象方法：合同主体

    default void info(String msg) {             // default：给默认实现
        log("[INFO] " + msg);                   // 实现类白捡一个 info
    }

    static Loggable console() {                 // static：工具工厂，接口名直接调
        return msg -> System.out.println(msg);  // 返回一个打到控制台的实现
    }

    private String format(String msg) {         // private（JDK 9+）：default 之间的公共代码
        return "[" + System.currentTimeMillis() + "] " + msg;
    }
}

Loggable l = Loggable.console();                // 静态方法当工厂
l.info("启动完成");                              // default 方法直接用
```

演进动机：接口一旦发布（如 JDK 的 List），给它加抽象方法会毁掉全球所有实现类；default 方法让"老接口长新本事"不破坏任何人（List.sort、Collection.stream 都是这么长出来的）。生产代码照抄这个模式：**抽象方法定合同，default 提供组合好的默认行为**。

## 7.2 函数式接口与 Lambda 初见

看一个"按规则排序"的需求。JDK 排序工具接受一个"比较器"——传统写法要造一个实现 Comparator 接口的类，非常啰嗦：

```java
// 匿名内部类：接口只有一个抽象方法时可用 Lambda 替代
students.sort(new Comparator<Student>() {
    @Override
    public int compare(Student a, Student b) {
        return Double.compare(a.getScore(), b.getScore());
    }
});

// Lambda：把“方法”当值传来传去
students.sort((a, b) -> Double.compare(a.getScore(), b.getScore()));
```

**只有一个抽象方法的接口叫函数式接口**（可加 `@FunctionalInterface` 注解让编译器把关），它的实例可以用 **Lambda** 直接写：

```java
Swimmer s = () -> System.out.println("蛙泳");   // 参数空、一行体：() -> 表达式
s.swim();
```

读法：`参数 -> 做的事`。类型自动推断、单行可省 return 和花括号。这不是新语法糖那么简单——**方法（行为）从此可以像数据一样存进变量、传来传去**。第 11 章的 Stream 和线程全靠它，此处先立概念。JDK 内置一批函数式接口（`Predicate<T>`、`Function<T,R>`、`Consumer<T>` 等），第 11 章专讲。

### Lambda 的边界：变量捕获与 effectively final

Lambda 体里可以用外部的局部变量，但有一条铁律：**只能捕获不再修改的变量**（effectively final）：

```java
int base = 10;
Runnable ok = () -> System.out.println(base);    // 只读：可以

int counter = 0;
// Runnable bad = () -> counter++;               // 编译错误：lambda 里不许改捕获的局部变量
```

为什么这么设计？Lambda 可能在**另一个线程、另一个时刻**执行（第 11 章的线程池），而局部变量随方法出栈就没了——Java 实际是**把变量的值拷贝进 Lambda**。如果允许修改，两边各改各的拷贝，程序语义就裂开了（C/C++ 里"悬垂引用"的教训）。绕过姿势：把状态装进数组或对象（`int[] counter = {0}; counter[0]++;`——捕获的是遥控器，改的是堆里的内容）或用 AtomicInteger。同理也解释了循环变量：`for (int i = 0; ...) { tasks.add(() -> use(i)); }` 里 i 每轮是新变量所以合法，而增强 for 的变量同理可用不可改。

### 匿名内部类：Lambda 的前世（读老代码必备）

Lambda 出现（JDK 8）之前，"把行为当参数传"靠**匿名内部类**——现场继承/实现一个没有名字的类：

```java
// 语法：new 接口/父类() { 类体 }
Runnable r = new Runnable() {
    @Override
    public void run() {
        System.out.println("干活");
    }
};

button.addActionListener(new ActionListener() {       // 老 GUI 代码满屏都是它
    public void actionPerformed(ActionEvent e) {
        System.out.println("被点了");
    }
});

// JDK 8+ 等价写法
Runnable r2 = () -> System.out.println("干活");
```

读法：`new Runnable() { ... }` = "造一个 Runnable 的匿名子类实例，顺便把类体写在花括号里"。它比 Lambda 啰嗦十倍，但能做 Lambda 做不到的事：**实现有多个方法的接口、添加字段、带构造逻辑**。所以两者是并存关系——函数式接口用 Lambda，其余场景用匿名类或普通类。今天写新代码 95% 用 Lambda，但读十年前的代码（Android 老项目、Swing、老线程代码）必须认识它。

## 7.3 枚举（enum）：有名字的常量，且是类

第 3 章用整数代表状态（1=周一）容易出错传。枚举给常量正式的名分：

```java
public enum Direction {
    UP, DOWN, LEFT, RIGHT
}

Direction d = Direction.LEFT;          // 取值只能从列表里挑，编译器把关

switch (d) {
    case UP    -> System.out.println("向上");
    case DOWN  -> System.out.println("向下");
    case LEFT  -> System.out.println("向左");
    case RIGHT -> System.out.println("向右");
    // 无需 default：枚举穷尽，漏写编译器会提醒
}
```

Java 的枚举**本质是类**，可以有字段、构造器、方法——"带行为的常量"：

```java
public enum Planet {
    MERCURY(3.3e23, 2.4e6),
    EARTH(5.97e24, 6.37e6);            // 常量(参数)，枚举列表必须第一行

    private final double mass;         // 每个常量一份
    private final double radius;

    Planet(double mass, double radius) {   // 构造器默认私有
        this.mass = mass;
        this.radius = radius;
    }

    public double surfaceGravity() {
        return 6.67e-11 * mass / (radius * radius);
    }
}

double g = Planet.EARTH.surfaceGravity();   // 9.79...
```

常用：`values()` 拿所有常量、`valueOf("UP")` 按名取、`ordinal()` 取序号（别依赖它做业务）。枚举天生单例、线程安全，也是"状态机"的标配载体。

### 枚举进阶：实现接口与天生的单例

枚举是类，所以也能实现接口——"每个常量一个行为"：

```java
public interface Operation {
    double apply(double a, double b);
}

public enum Calc implements Operation {
    PLUS  { public double apply(double a, double b) { return a + b; } },
    MINUS { public double apply(double a, double b) { return a - b; } },
    TIMES { public double apply(double a, double b) { return a * b; } };

    public static void main(String[] args) {
        System.out.println(Calc.PLUS.apply(3, 4));      // 7.0
        Operation op = Calc.TIMES;                       // 枚举常量当接口用
        System.out.println(op.apply(3, 4));              // 12.0
    }
}
```

这比"switch(运算符) 分发"优雅得多：**行为跟着常量走，加常量不用改任何旧代码**。

另一个冷知识：**枚举是 Java 里最简单的线程安全单例**——`enum Config { INSTANCE; ... }` 一行搞定，JVM 保证每个常量只实例化一次，《Effective Java》作者钦定的单例首选写法。

## 7.4 record：不可变数据类的终结者（JDK 16+）

写一个"纯装数据"的类（字段 + 构造器 + getter + equals + hashCode + toString），按第 5、6 章套路要五六十行。JDK 16 的 **record** 一行顶全套：

```java
public record Point(int x, int y) { }

Point p = new Point(3, 4);
System.out.println(p.x());              // 访问器是字段名()，不是 getX()
System.out.println(p);                  // Point[x=3, y=4] —— toString 自动生成
System.out.println(p.equals(new Point(3, 4)));   // true —— equals/hashCode 自动生成
```

要点：

- record 是**不可变**的：没有 setter，字段 final，天生线程友好；
- 自动生成：全参构造器、访问器、equals、hashCode、toString；
- 可加**紧凑构造器**做校验：

```java
public record Score(String name, int value) {
    public Score {                          // 紧凑构造器：没有参数列表
        if (value < 0 || value > 100)
            throw new IllegalArgumentException("非法成绩 " + value);
        name = name.trim();                 // 可修正参数；无需再手动赋值
    }
}
```

什么时候用：DTO（数据传输对象）、map 的复合键、函数的多返回值……"只是装数据"就 record；需要可变状态或有复杂行为就写普通类。本教程后续项目大量使用。

## 7.5 面向接口编程：一条黄金守则

综合三部曲，给出贯穿后续所有代码的守则：

```java
List<String> list = new ArrayList<>();     // 左边接口，右边实现类
```

为什么不写 `ArrayList<String> list = new ArrayList<>();`？——左边是"我需要的能力"（List），右边是"今天选的实现"。哪天发现 LinkedList 更合适，**只改右边一个词**，其余代码零改动。方法参数、返回类型同理尽量用接口/父类。这条守则源自设计原则"依赖抽象而非实现"，第 13 章的 Spring 就把这一思想做到了机制化（依赖注入）。

## 7.6 小结

- 接口 = 能力合同，implements 可多签；default 方法带默认实现；
- 抽象类答 is-a，接口答 can-do，常搭配使用；
- 函数式接口（单抽象方法）可用 Lambda `参数 -> 行为` 实例化——行为当值传；
- enum 是带字段/方法的常量类；record 一行生成不可变数据类全套；
- 声明变量用接口/父类类型，实现随便换——面向接口编程。

## 练习 7

1.（概念）类实现接口但没实现全部抽象方法，会怎样？抽象类实现接口呢？
2.（概念）`Runnable r = () -> System.out.println("run");` 为什么能编译过？（Runnable 是什么？）
3.（编程）定义接口 `Measurable { double measure(); }`，让 `Circle`（面积）与 `Person2`（身高）实现它；main 里用 `Measurable[]` 求所有 measure 的最大值。
4.（编程）定义 enum `Season`，每个常量带中文描述字段和 `String getDesc()` 方法，for-each 打印全部。
5.（编程）定义 record `Rect2(int w, int h)`，加紧凑构造器要求 w、h 为正；提供实例方法 `int area()`；验证 `new Rect2(3, 4).area()` 与非法构造的报错。

## 参考答案

**1.** 普通类必须实现全部抽象方法，否则编译错误；抽象类可以留空不实现（把合同继续传给它的子类）。

**2.** `Runnable` 是 JDK 的函数式接口，唯一抽象方法 `void run()` 无参无返回——`() -> System.out.println(...)` 恰好匹配该签名，Lambda 自动成为它的实现。

**3.**

```java
interface Measurable { double measure(); }

class Circle implements Measurable {
    private final double r;
    Circle(double r) { this.r = r; }
    @Override public double measure() { return Math.PI * r * r; }
}

class Person2 implements Measurable {
    private final double height;
    Person2(double height) { this.height = height; }
    @Override public double measure() { return height; }
}

class Main {
    public static void main(String[] args) {
        Measurable[] all = { new Circle(2), new Person2(1.75), new Circle(0.5) };
        Measurable best = all[0];
        for (Measurable m : all)
            if (m.measure() > best.measure()) best = m;
        System.out.println("最大测度：" + best.measure());
    }
}
```

**4.**

```java
public enum Season {
    SPRING("春暖花开"), SUMMER("烈日炎炎"),
    AUTUMN("秋高气爽"), WINTER("天寒地冻");

    private final String desc;
    Season(String desc) { this.desc = desc; }
    public String getDesc() { return desc; }
}

for (Season s : Season.values())
    System.out.println(s + "：" + s.getDesc());
```

**5.**

```java
public record Rect2(int w, int h) {
    public Rect2 {
        if (w <= 0 || h <= 0)
            throw new IllegalArgumentException("宽高必须为正");
    }
    public int area() { return w * h; }
}
// new Rect2(3, 4).area() → 12；new Rect2(0, 5) → 抛 IllegalArgumentException
```

**[▲ 返回目录](#toc)**

---

<a id="j08"></a>

# 第 8 章 常用 API：字符串、包装类与时间

> 本章目标：吃透 String 的不可变与字符串池、`==` vs equals 的终极答案、StringBuilder、包装类与自动装箱、BigDecimal 算钱、现代时间 API。这些是日常代码出场率最高的一批工具。

---

## 8.1 String：不可变的字符序列

```java
String s = "hello";
String t = s.toUpperCase();      // 生成新串，s 本体纹丝不动
System.out.println(s);           // hello
System.out.println(t);           // HELLO
```

**String 一旦创建，内容永不改变**——所有"修改"方法（toUpperCase、replace、substring、concat…）都返回**新对象**。这不是缺陷，是设计：不可变让字符串可以安全共享、缓存 hashCode、跨线程使用。

经典陷阱：循环里拼字符串。

```java
String result = "";
for (int i = 1; i <= 1000; i++) {
    result = result + i;         // 每次都造新串、拷贝旧内容 —— O(n²) 灾难
}
```

### 字符串池与 `==` 的终极答案

```java
String a = "hello";
String b = "hello";
String c = new String("hello");

System.out.println(a == b);        // true：字面量进“字符串池”，a、b 共享同一对象
System.out.println(a == c);        // false：new 强制在堆上造新对象
System.out.println(a.equals(c));   // true：内容相同
```

```
字符串池（方法区）： "hello" ◀── a, b          堆： new String("hello") ◀── c
```

**结论（背下来）**：比较字符串内容**永远用 `equals`**，`==` 只在比较"是否同一对象"时才有意义。翻遍 JDK 源码你都会发现这条铁律。

### String 常用方法

```java
String s = "Hello, Java";

s.length()                 // 11（注意：这是带括号的方法，数组才是不带括号的 length）
s.charAt(0)                // 'H'
s.indexOf("Java")          // 7（找不到返回 -1）
s.substring(7)             // "Java"
s.substring(0, 5)          // "Hello"（[0,5) 左闭右开）
s.replace("Java", "World") // "Hello, World"
s.toUpperCase() / s.toLowerCase()
s.trim() / s.strip()       // 去首尾空白（strip 能处理全角空格，JDK 11+）
s.isEmpty() / s.isBlank()  // 空 / 全空白
s.contains("lo,")          // true
s.split(", ")              // ["Hello", "Java"] → String[]
String.join("-", "a", "b", "c")   // "a-b-c"
"  x  ".repeat(3)          // JDK 11+ 重复
```

判等三连：`equals`、忽略大小写 `equalsIgnoreCase("HELLO")`、空安全 `Objects.equals(a, b)`（任一为 null 不抛异常）。

### 字符串池实验：intern() 与证据

用一段小代码把"池"看实（结果在 JDK 17/21 实测一致）：

```java
String a = "hello";
String b = "hel" + "lo";                 // 编译期常量折叠 → 还是池里的 "hello"
String c = "hel";
String d = c + "lo";                     // 运行期拼接 → 堆上新对象
String e = (c + "lo").intern();          // intern：主动去池里找同内容串

System.out.println(a == b);              // true
System.out.println(a == d);              // false
System.out.println(a == e);              // true：intern 把它指回了池对象
```

三行输出验证了三件事：字面量进池共享；运行期拼接产新对象；`intern()` 能"回家"。**看懂这段实验即可**——日常代码依旧一条铁律：比内容用 equals。intern 在面试和底层优化话题里会出现，知道它在干嘛就够了。

## 8.2 StringBuilder：拼接的正确姿势

可变的字符序列，专为拼接而生：

```java
StringBuilder sb = new StringBuilder();
for (int i = 1; i <= 1000; i++) {
    sb.append(i);                  // 在内部缓冲区上追加，O(n) 总量
}
String result = sb.toString();     // 最后转回 String
```

常用：`append(任意类型)`、`insert`、`deleteCharAt`、`reverse`、`length`。单线程场景用它；多线程拼接用 `StringBuffer`（线程安全、更慢，基本只在面试出现）。

### 文本块（JDK 15+）

多行文本不再一行行拼 `\n`：

```java
String json = """
        {
          "name": "张三",
          "score": 90
        }
        """;
```

三引号包裹，公共缩进自动剥离。写 SQL、JSON、提示词时极其舒服。

## 8.3 包装类与自动装箱

每种基本类型都有对应的**包装类**（引用类型）：`int→Integer`、`long→Long`、`double→Double`、`char→Character`、`boolean→Boolean`……

```java
Integer boxed = 42;              // 自动装箱：int → Integer
int raw = boxed;                 // 自动拆箱：Integer → int
```

为什么需要它？泛型集合只收引用类型（第 9 章 `List<int>` 不行，`List<Integer>` 可以）；`Integer` 还提供一批静态工具：

```java
Integer.parseInt("123")          // 字符串 → int（核心工具，输入处理天天用）
Integer.MAX_VALUE / MIN_VALUE
Integer.compare(a, b)            // 返回 -1/0/1，比手写 a-b 更稳（不会溢出）
Double.compare(x, y)
```

**必考陷阱：Integer 的 ==**。

```java
Integer a = 127, b = 127;
Integer c = 128, d = 128;
System.out.println(a == b);      // true：[-128,127] 有缓存，装箱复用同一对象
System.out.println(c == d);      // false：超出缓存范围，两个新对象
System.out.println(c.equals(d)); // true
```

**包装类比较一律 equals**。另一个暗坑：`Integer x = null; int y = x;` 自动拆箱直接 `NullPointerException`——包装类型字段记得给默认值。

## 8.4 BigDecimal：算钱的唯一正确方式

`double` 是二进制近似值，算钱必出鬼账（0.1 + 0.2 = 0.30000000000000004）。**金额计算用 BigDecimal**：

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

BigDecimal price = new BigDecimal("19.99");     // 用字符串构造！别用 new BigDecimal(19.99)
BigDecimal qty   = new BigDecimal("3");

BigDecimal total = price.multiply(qty);                  // 59.97
System.out.println(total);

BigDecimal avg = total.divide(new BigDecimal("2"), 2, RoundingMode.HALF_UP);  // 保留2位四舍五入
System.out.println(avg);                                 // 29.99（scale=2）

BigDecimal a = new BigDecimal("1.0");
BigDecimal b = new BigDecimal("1.00");
System.out.println(a.equals(b));         // false：equals 连 scale（小数位数）一起比！
System.out.println(a.compareTo(b) == 0); // true：比数值用 compareTo
```

三条纪律：① 构造用字符串；② 比较用 compareTo；③ 除法必须给精度和舍入模式（否则除不尽直接抛异常）。

### 正则表达式初见：更锋利的字符串工具

`String.matches/matcher` 支持正则——用一串符号描述"文本长什么样"：

```java
"13812345678".matches("1[3-9]\\d{9}")            // 手机号形状：1 + [3-9] + 9 位数字
"abc123".matches("[a-z]+\\d+")                    // 字母段 + 数字段
"  ".matches("\\s*")                              // 纯空白
"a@b.com".matches("[\\w.]+@[\\w.]+")              // 朴素邮箱形状

// split 的参数就是正则
"a,b,,c".split(",")            // [a, b, , c]
"a, b , c".split("\\s*,\\s*")  // [a, b, c] 连分隔符旁的空白一起切

// replaceAll 也是正则
"abc123".replaceAll("\\d+", "#")   // abc#
```

速记几个最常用的：`\\d` 数字、`\\w` 字母数字下划线、`\\s` 空白、`.` 任意字符、`+` 一或多、`*` 零或多、`[abc]` 字符集合、`^...$` 首尾锚定。**正则是"描述形状"的迷你语言**，电话/邮箱/车牌校验、日志解析全靠它。提醒：Java 字符串里反斜杠要双写（`\\d`）；复杂正则可读性差，写完务必用几个正反例测一遍；进阶玩法（分组捕获 Pattern/Matcher）用到再学。

## 8.5 现代时间 API（java.time，JDK 8+）

老的 `Date`/`SimpleDateFormat` 设计糟糕且非线程安全，现代代码一律用 `java.time`：

```java
import java.time.*;
import java.time.format.DateTimeFormatter;

LocalDate today = LocalDate.now();                  // 2026-11-17（日期）
LocalTime now   = LocalTime.now();                  // 10:30:45.123（时间）
LocalDateTime dt = LocalDateTime.now();             // 日期+时间

LocalDate d = LocalDate.of(2026, 11, 17);           // 构造
LocalDate birthday = LocalDate.parse("2006-09-01"); // 解析 ISO 格式

today.getYear()            // 2026
today.getMonthValue()      // 11
today.getDayOfWeek()       // TUESDAY（DayOfWeek 枚举）
today.getDayOfMonth()      // 17

today.plusDays(7)          // 一周后（返回新对象——不可变设计，同 String）
today.minusMonths(1)       // 一个月前
today.isBefore(d)          // 比较
today.isLeapYear()         // 闰年判断

Period.between(birthday, today).getYears()          // 相差 20 年
Duration.between(LocalTime.NOON, LocalTime.now()).toMinutes()   // 时分差

// 格式化与解析
DateTimeFormatter f = DateTimeFormatter.ofPattern("yyyy年MM月dd日 HH:mm:ss");
String text = dt.format(f);                          // 2026年11月17日 10:30:45
LocalDateTime parsed = LocalDateTime.parse(text, f); // 解析回来
```

时间戳转换（和旧 API 打交道的桥）：

```java
Instant inst = Instant.now();                    // UTC 时间戳对象
long millis = inst.toEpochMilli();               // 毫秒数
Instant back = Instant.ofEpochMilli(millis);
```

## 8.6 Objects 工具类

`java.util.Objects` 一组空安全静态工具：

```java
Objects.equals(a, b)              // 两个都 null 也安全，都 null 返回 true
Objects.requireNonNull(user, "用户不能为空");   // 为 null 直接抛异常，快速失败
Objects.isNull(x) / nonNull(x)
Objects.hash(a, b, c)             // 多字段 hashCode
```

### 日期实战三连

时间 API 用三个真实小需求练手，覆盖八成日常场景：

```java
LocalDate today = LocalDate.now();

// ① 距离期末还有多少天？
LocalDate exam = LocalDate.of(2027, 1, 15);
long days = java.time.temporal.ChronoUnit.DAYS.between(today, exam);

// ② 这个月有几个周一？
int mondays = 0;
LocalDate d = today.withDayOfMonth(1);                  // 本月 1 号
while (d.getMonthValue() == today.getMonthValue()) {
    if (d.getDayOfWeek() == DayOfWeek.MONDAY) mondays++;
    d = d.plusDays(1);
}

// ③ 7 天后是几月几号，星期几？
LocalDate week = today.plusWeeks(1);
System.out.printf("%tF %s%n", week, week.getDayOfWeek().getDisplayName(
        java.time.format.TextStyle.FULL, java.util.Locale.CHINESE));   // 2026-11-24 星期二
```

思路都是同一条：**从锚点日期出发，plus/minus 游标推进，DayOfWeek/MonthValue 做判断**。加上 8.5 节的 `DateTimeFormatter` 格式化，日常报表、倒计时、考勤类需求就已经全能写了。

## 8.7 小结

- String 不可变，改操作都返回新串；**内容比较永远 equals**，`==` 比的是对象身份；
- 循环拼接用 StringBuilder；多行文本用文本块；
- 包装类与基本类型自动装箱拆箱；**Integer 比较用 equals**（缓存陷阱）；null 拆箱会 NPE；
- 金额计算 BigDecimal：字符串构造、compareTo 比较、除法给舍入模式；
- 时间用 java.time 家族（LocalDate/LocalDateTime/DateTimeFormatter），不可变、线程安全。

## 练习 8

1.（概念）`"abc" == "ab" + "c"` 与 `"abc" == new String("abc")` 各是 true 还是 false？解释原因。
2.（改错）找出下面代码的两处问题：

```java
double price = 0.1;
double total = price * 3;
if (total == 0.3) { System.out.println("正好"); }

Integer x = null;
int y = x + 1;
```

3.（编程）读入一行英文，统计其中单词个数（空格分隔，忽略多余空格），并把每个单词首字母转大写后输出。
4.（编程）用 BigDecimal 计算 3 件单价 19.99 的商品总价，再打 85 折，保留 2 位小数输出。
5.（编程）打印今天的日期、一年后的今天、以及你出生到今天过了多少天（Period 或手算均可）。

## 参考答案

**1.** 第一个 **true**：编译期常量折叠，`"ab" + "c"` 在编译时拼成 `"abc"`，与字面量池中同一对象。第二个 **false**：new 在堆上强制造新对象。结论依旧是：比内容用 equals。

**2.** ① `0.1 * 3` 得 0.30000000000000004，`== 0.3` 永远不成立（浮点不能用 == 判等；算钱用 BigDecimal）；② `x` 为 null，`x + 1` 自动拆箱时抛 NullPointerException。

**3.**

```java
import java.util.Scanner;

public class Words {
    public static void main(String[] args) {
        String line = new Scanner(System.in).nextLine().trim();
        if (line.isEmpty()) { System.out.println("0 个单词"); return; }

        String[] words = line.split("\\s+");          // 正则：一个及以上空白
        StringBuilder sb = new StringBuilder();
        for (String w : words) {
            sb.append(Character.toUpperCase(w.charAt(0)))
              .append(w.substring(1)).append(" ");
        }
        System.out.println(words.length + " 个单词：" + sb.toString().trim());
    }
}
```

**4.**

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

BigDecimal total = new BigDecimal("19.99")
        .multiply(new BigDecimal("3"))
        .multiply(new BigDecimal("0.85"))
        .setScale(2, RoundingMode.HALF_UP);
System.out.println(total);       // 50.97
```

**5.**

```java
import java.time.LocalDate;
import java.time.Period;
import java.time.temporal.ChronoUnit;

LocalDate today = LocalDate.now();
System.out.println(today);
System.out.println(today.plusYears(1));
LocalDate birth = LocalDate.parse("2006-09-01");
System.out.println(ChronoUnit.DAYS.between(birth, today));   // 精确天数
```

**[▲ 返回目录](#toc)**

---

<a id="j09"></a>

# 第 9 章 集合框架与泛型

> 本章目标：掌握 List/Set/Map 三大容器与选型、ArrayList/HashMap 的底层原理初探、Comparable/Comparator 排序、泛型的语法与意义、遍历删除陷阱。**集合是 Java 日常代码出场率最高的知识，没有之一。**

---

## 9.1 为什么需要集合

数组两大硬伤：长度定死、功能贫乏（插入、删除、查找全要手写）。JDK 的**集合框架（Collections Framework）**提供一套现成的动态容器。先看全家福（简化版）：

```
Collection（接口）                        Map（接口）
├── List（有序、可重复、有下标）            ├── HashMap     （键值对，键唯一）
│   ├── ArrayList   （数组实现，查快）      ├── TreeMap     （键有序）
│   └── LinkedList  （链表实现，插删快）      └── LinkedHashMap（键有序=插入序）
└── Set（不重复）
    ├── HashSet      （哈希实现，无序）
    └── TreeSet      （排序实现，有序）
```

选型口诀：

- **要下标、可重复 → List**（默认 ArrayList）；
- **去重 → Set**（默认 HashSet；要排序用 TreeSet）；
- **按键查值 → Map**（默认 HashMap）。

并记住第 7 章守则：**变量声明用接口类型**。

## 9.2 List：ArrayList 为主角

```java
import java.util.ArrayList;
import java.util.List;

List<String> list = new ArrayList<>();     // <> 里装“元素类型”，<>（钻石操作符）右侧可省
list.add("Java");
list.add("Python");
list.add("Java");                          // 允许重复

list.size()                                // 3（方法！数组才是不带括号的属性 length）
list.get(0)                                // "Java" —— 按下标取
list.set(1, "Go")                          // 替换下标 1 → [Java, Go, Java]
list.remove(0)                             // 按下标删（也有按对象删的重载：remove(Object)）
list.contains("Go")                        // true
list.indexOf("Java")                       // 0（第一次出现位置）
list.isEmpty()                             // false

for (String s : list) System.out.println(s);   // for-each 遍历
System.out.println(list);                  // [Go, Java] —— toString 已实现，直接可打

List<Integer> nums = List.of(1, 2, 3);     // 不可变快捷列表（JDK 9+，不能 add/remove）
```

**注意装的是包装类型**：`List<int>` 非法（泛型只收引用类型），基本类型自动装箱为 `Integer`。

### ArrayList 底层一瞥

ArrayList 内部就是一个 `Object[]` 数组：装满时自动开一个 **1.5 倍**新数组、把旧内容拷过去（`Arrays.copyOf`）——"长度可变"是错觉，是"边搬家边长大"。由此得到性能画像：**尾部 add 均摊 O(1)、随机 get/set O(1)、中间插删要挪后面一排 O(n)**。LinkedList 双向链表反之，但常数大、缓存不友好，**实践里 95% 场景选 ArrayList**。

### ArrayList 扩容实验：亲眼看它长大

第 9.2 节说 ArrayList "装满自动扩 1.5 倍"，动手验证（反射小窥内部数组，看不懂反射没关系，看结果）：

```java
import java.lang.reflect.Field;
import java.util.ArrayList;

public class GrowDemo {
    public static void main(String[] args) throws Exception {
        ArrayList<Integer> list = new ArrayList<>();       // 初始是空数组
        Field f = ArrayList.class.getDeclaredField("elementData");
        f.setAccessible(true);

        for (int i = 1; i <= 20; i++) {
            list.add(i);
            Object[] inner = (Object[]) f.get(list);
            System.out.println(i + " 个元素，内部数组长度 " + inner.length);
        }
    }
}
```

输出节选（JDK 21 实测）：

```
1 个元素，内部数组长度 10     ← 第一次 add 时按 10 开张
10 个元素，内部数组长度 10
11 个元素，内部数组长度 15    ← 10 + 10/2 = 15，1.5 倍
16 个元素，内部数组长度 15
17 个元素，内部数组长度 22    ← 15 + 15/2 取整
```

**理论落地成证据**。顺带得到两个实用推论：能预估容量就 `new ArrayList<>(10_000)` 一次到位（省掉反复搬家的拷贝）；中间插删 O(n) 的"n"就是内部数组长度，量大时别在 ArrayList 头部插元素。

## 9.3 Set：去重专家

```java
import java.util.HashSet;
import java.util.Set;

Set<String> set = new HashSet<>();
set.add("Java");
set.add("Python");
set.add("Java");                          // 第二次加同样的内容 —— 被忽略

System.out.println(set.size());           // 2
System.out.println(set.contains("Java")); // true
```

HashSet 判重靠 hashCode + equals（第 6 章铁律的原因在此）：**想用自己的类当 Set 元素或 Map 的键，必须正确重写这两个方法**（record 自动正确，又一推荐理由）。

```java
Set<Integer> seen = new HashSet<>();
for (int x : new int[]{ 5, 1, 5, 3, 1 }) {
    if (!seen.add(x))                     // add 返回 false = 已存在
        System.out.println("重复：" + x);
}
```

## 9.4 Map：键值对字典

```java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> scores = new HashMap<>();
scores.put("张三", 90);
scores.put("李四", 66);
scores.put("张三", 95);                    // 键已存在 → 覆盖旧值

scores.get("张三")                         // 95
scores.getOrDefault("王五", 0)             // 0：取不到给默认值（超高频好用）
scores.containsKey("李四")                 // true
scores.remove("李四")
scores.size()

// 遍历方式一：entrySet（最常用）
for (Map.Entry<String, Integer> e : scores.entrySet()) {
    System.out.println(e.getKey() + " → " + e.getValue());
}
// 方式二：只要键或只要值
for (String name : scores.keySet())   { ... }
for (int v : scores.values())         { ... }

// 好用三连（JDK 8+）
scores.putIfAbsent("王五", 60);
scores.merge("张三", 5, Integer::sum);     // 张三成绩 +5 → 100
scores.computeIfAbsent("组A", k -> new ArrayList<>()).add("成员");   // 分组基石
```

**经典应用——词频统计**：

```java
Map<Character, Integer> freq = new HashMap<>();
for (char c : "hello java".toCharArray()) {
    if (c != ' ') freq.merge(c, 1, Integer::sum);   // 有则 +1，无则置 1
}
System.out.println(freq);     // {a=2, e=1, h=1, j=1, l=2, o=1, v=1}
```

### HashMap 底层一瞥

数组 + 链表（+ 红黑树，链表过长时）的哈希表：`index = hash(key) % 桶数`，同桶冲突用链表挂。所以：**get/put 均摊 O(1)**；键需正确实现 hashCode/equals；键应为不可变类型（键变了哈希对不上，对象"丢"在表里）。

### 队列与栈：Deque 一专多能

排队（先进先出 FIFO）与摞盘子（后进先出 LIFO）是两类经典结构，JDK 用一个 `Deque`（双端队列）接口全包了：

```java
import java.util.ArrayDeque;
import java.util.Deque;

// 当队列用（FIFO）
Deque<String> queue = new ArrayDeque<>();
queue.offer("A");                    // 入队（尾部）
queue.offer("B");
System.out.println(queue.poll());    // A（从头部出队——先进先出）
System.out.println(queue.peek());    // B（看队头不出队）

// 当栈用（LIFO）
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);                       // 压栈（头部）
stack.push(2);
stack.push(3);
System.out.println(stack.pop());     // 3（后进先出）
System.out.println(stack.pop());     // 2
```

实际用途：队列——任务调度、消息缓冲（打印队列、客服排队）；栈——撤销操作、括号匹配、浏览器后退、函数调用栈（第 12 章的 JVM 栈就是它）。**不要再 java.util.Stack**（历史遗留类，性能差且设计失误，面试还会扣分），一律 ArrayDeque。

## 9.5 泛型：类型的参数化

`List<String>` 里的 `<String>` 就是**泛型**：把"元素类型"当参数传给容器。没有它的世界（老代码）是这样的：

```java
List list = new ArrayList();       // 裸类型
list.add("abc");
list.add(42);                      // 什么都能塞
String s = (String) list.get(1);   // 取出强转 —— 运行时 ClassCastException 炸
```

泛型的两大价值：

1. **编译期类型检查**：`List<String>` 塞 Integer 直接红线，把 ClassCastException 从运行期提前到编译期；
2. **取出免强转**：`list.get(0)` 天然是 String。

进阶语法两枚（读懂框架源码够用）：

```java
// 泛型方法：类型参数声明在返回类型前
static <T> T first(List<T> list) { return list.get(0); }
// 有界类型：T 必须是 Comparable 或其子类型
static <T extends Comparable<T>> T max(List<T> list) { ... }
```

规矩：泛型不支持基本类型（用包装类）；`List<Object>` 与 `List<String>` 没有继承关系（不协变）。

### 不可变集合：List.of / Set.of / Map.of

JDK 9+ 提供一批"冻结"工厂，防手滑、线程安全的常量数据首选：

```java
List<String> colors = List.of("红", "绿", "蓝");       // 只读
Set<Integer> ids = Set.of(1, 2, 3);
Map<String, Integer> price = Map.of("苹果", 5, "香蕉", 3);
// Map.entry 版本超过 10 对时用 Map.ofEntries(Map.entry("k", 1), ...)

// colors.add("黄");          // UnsupportedOperationException —— 冻结的
// Set.of(1, 1, 2)            // 运行时 IllegalArgumentException：不允许重复

List<String> mutable = new ArrayList<>(colors);        // 要可变：包一层
mutable.add("黄");                                     // OK

List<String> frozen = List.copyOf(mutable);            // 再冻回去（JDK 10+）
```

设计意图：常量配置（菜单项、状态码表）声明成不可变，**编译后的世界没有"误改"这种事故**；null 一律禁止塞入（冻结家族不接受 null 元素）。

## 9.6 排序：Comparable 与 Comparator

**自然排序**——类实现 `Comparable<T>`，定义"天生的大小"：

```java
public record Student(String name, int score) implements Comparable<Student> {
    @Override
    public int compareTo(Student other) {
        return Integer.compare(this.score, other.score);   // 升序；反转即降序
    }
}

List<Student> list = new ArrayList<>(...);
Collections.sort(list);                 // 按 compareTo 排
list.sort(null);                        // 等价写法
```

**定制排序**——Comparator（比较器），随用随写、不侵入类：

```java
list.sort((a, b) -> b.score() - a.score());                      // Lambda：按分数降序

list.sort(Comparator.comparingInt(Student::score)                // 方法引用版
                    .reversed()
                    .thenComparing(Student::name));              // 次级排序：同名按名字
```

`Comparator.comparing / comparingInt / reversed / thenComparing` 链式组合是生产代码标准姿势。**约定**：compareTo 返回负/零/正 表示 小于/相等/大于；违反约定排序会乱。

### Collections 工具类与集合互转

注意区分：`Collection`（接口）与 `Collections`（工具类，全是静态方法），一个字母之差：

```java
import java.util.Collections;

List<Integer> list = new ArrayList<>(List.of(3, 1, 2));
Collections.sort(list);                        // 排序（List 专享）
Collections.reverse(list);                     // 反转
Collections.shuffle(list);                     // 随机打乱（洗牌）
Collections.max(list);  Collections.min(list); // 最值
Collections.swap(list, 0, 1);                  // 交换两个位置
Collections.fill(list, 0);                     // 全部填充
int i = Collections.binarySearch(list, 2);     // 二分查找（需先有序）

// 数组 ↔ 集合
Integer[] arr = list.toArray(new Integer[0]);
List<Integer> back = new ArrayList<>(Arrays.asList(arr));
```

日常高频其实是 Stream（第 11 章）逐步替代了这些方法，但读老代码、写算法题时 Collections 一把梭依然高效。

## 9.7 遍历中删除：ConcurrentModificationException

头号高频坑：

```java
for (String s : list) {
    if (s.length() > 3) list.remove(s);   // 运行时 ConcurrentModificationException！
}
```

for-each 底层是迭代器，集合"被外人动手脚"后迭代器立刻察觉并自爆（fail-fast 机制）。正确姿势两招：

```java
list.removeIf(s -> s.length() > 3);                    // 首选：内部安全删除（JDK 8+）

Iterator<String> it = list.iterator();                  // 传统：迭代器自己删
while (it.hasNext()) {
    if (it.next().length() > 3) it.remove();
}
```

Map 同理：遍历中改结构请用 `entrySet` 的迭代器或先收集后修改。

### HashMap 的 key 怎么选

Map 的键是"身份证"，选择不当后患无穷。四条守则：

1. **首选不可变类型**：String、Integer、record——键一旦放进 Map 就不该再变（hashCode 变了，对象在桶里"失踪"）；
2. **自定义类做键 = record 或正确重写 equals/hashCode**（第 6 章铁律的落地现场）；
3. **可变对象做键是自残**：

```java
List<Integer> key = new ArrayList<>(List.of(1));
Map<List<Integer>, String> m = new HashMap<>();
m.put(key, "A");
key.add(2);                        // 键的内容变了，hashCode 随之改变
System.out.println(m.get(key));    // null —— 它还躺在旧桶里，新 hashCode 找不到
```

4. **键要有业务唯一性**：学生用学号不是用姓名（同名撞车）；反之，把自增序号当业务键，重启后对不上号也是经典设计事故。

## 9.8 小结

- 三大件选型：List 有序可重复（ArrayList）、Set 去重（HashSet）、Map 键值对（HashMap）；
- 变量声明用接口类型；泛型 = 编译期类型安全 + 免强转；
- hashCode/equals 铁律是 HashSet/HashMap 正确性的前提（record 免操心）；
- 排序：Comparable 定天性，Comparator 定场景，比较链组合用；
- 遍历删除用 `removeIf`，别在 for-each 里删。

## 练习 9

1.（概念）ArrayList 和数组的三个主要区别？为什么 `List<int>` 非法、怎么解决？
2.（概念）把自定义类放进 HashSet 去重，需要满足什么条件？record 为什么天然满足？
3.（编程）读入一行单词（空格分隔），用 `Map<String,Integer>` 统计词频，按出现次数从高到低输出（次数同按字典序）。
4.（编程）用 `Set<Integer>` 生成 10 个 1~20 不重复的随机数并升序输出（提示：TreeSet）。
5.（编程）给定 `List<Student>`（record，字段 name/score），分别按分数降序输出前 3 名、以及平均分（double）。

## 参考答案

**1.** ① 长度：数组定死，集合自动扩容；② 类型：数组可存基本类型，集合只能存引用类型（基本类型装箱）；③ 功能：集合自带增删查改/排序/判空等丰富方法，数组只有 length。`List<int>` 非法是泛型不支持基本类型，用 `List<Integer>`（自动装箱）。

**2.** 必须重写 `hashCode` 与 `equals` 并满足：equals 相等 → hashCode 相等。record 自动按全部字段生成两者，天然正确。

**3.**

```java
import java.util.*;
import java.util.stream.*;

public class WordFreq {
    public static void main(String[] args) {
        String line = new Scanner(System.in).nextLine();
        Map<String, Integer> freq = new HashMap<>();
        for (String w : line.trim().split("\\s+"))
            freq.merge(w, 1, Integer::sum);

        freq.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed()
                    .thenComparing(Map.Entry.comparingByKey()))
            .forEach(e -> System.out.println(e.getKey() + " " + e.getValue()));
    }
}
```

（用到了第 11 章的 Stream，也可用 List 排序 entrySet 后打印。）

**4.**

```java
import java.util.Random;
import java.util.Set;
import java.util.TreeSet;

Set<Integer> nums = new TreeSet<>();          // TreeSet：自动升序
Random rnd = new Random();
while (nums.size() < 10) {
    nums.add(rnd.nextInt(20) + 1);            // 重复自动忽略
}
System.out.println(nums);
```

**5.**

```java
List<Student> list = List.of(
        new Student("张三", 90), new Student("李四", 66),
        new Student("王五", 95), new Student("赵六", 78));

list.stream()
    .sorted(Comparator.comparingInt(Student::score).reversed())
    .limit(3)
    .forEach(s -> System.out.println(s.name() + " " + s.score()));

double avg = list.stream().mapToInt(Student::score).average().orElse(0);
System.out.println("平均 " + avg);
```

**[▲ 返回目录](#toc)**

---

<a id="j10"></a>

# 第 10 章 异常处理与文件 IO

> 本章目标：搞懂 Java 异常体系与 checked/unchecked 之分；熟练 try/catch/finally 与 try-with-resources；用现代 NIO（Path/Files）读写文件；完成文件复制与"学生存档"两个实战。

---

## 10.1 异常体系：Throwable 家族

程序运行出岔子时，JVM 抛出一个**异常对象**（Exception 的实例），带着类型、消息、出错位置（堆栈跟踪）。家族谱系：

```
Throwable
├── Error                     —— JVM 级致命伤，不用你管：
│     OutOfMemoryError、StackOverflowError
└── Exception
    ├── RuntimeException     —— “ unchecked 非受检”：编译器不强迫处理
    │     NullPointerException（空指针）
    │     ArrayIndexOutOfBoundsException（数组越界）
    │     ClassCastException（强转错型）
    │     NumberFormatException（"abc" 转数字）
    │     IllegalArgumentException、ArithmeticException（整数除零）
    └── 其他（IOException、SQLException…）—— “checked 受检”：编译器强迫你表态
```

两种异常的哲学区别：

- **unchecked（RuntimeException 子类）**：多为**程序写错了**（该判空没判空、下标没管住）——修代码，不是到处 try；
- **checked**：多为**环境问题**（文件不存在、网络断了）——编译器逼你"要么处理、要么上抛声明"，不许装看不见。

## 10.2 try / catch / finally：抓与收拾

```java
import java.io.IOException;
import java.nio.file.*;

public class ExDemo {
    public static void main(String[] args) {
        System.out.print("输入一个数字字符串：");
        String s = new java.util.Scanner(System.in).next();

        try {
            int n = Integer.parseInt(s);              // 可能抛 NumberFormatException
            System.out.println("平方 = " + n * n);
        } catch (NumberFormatException e) {
            System.out.println("这不是数字：" + s);     // 接住，程序不死
        } finally {
            System.out.println("无论如何都执行（收尾）");
        }
        System.out.println("程序继续运行");
    }
}
```

规则：

- `try` 圈住危险代码，`catch (异常类型 变量)` 接住对应类型的异常；类型不匹配的异常照抛不误；
- **finally 几乎必执行**（即使 try 里 return）——放"必须收尾"的代码（关文件、释放资源）；
- 多 catch 从小到大排：

```java
try {
    ...
} catch (NumberFormatException e) {      // 小（具体）的在前
    ...
} catch (Exception e) {                  // 大（宽泛）的在后，兜底
    e.printStackTrace();                 // 打印完整堆栈 —— 排查必用
}
```

- **抛出**：方法内 `throw new IllegalArgumentException("成绩非法: " + x);`；
- **上抛声明**：方法签名加 `throws IOException`，表示"我不处理，谁调用谁负责"。checked 异常必须二选一（处理或上抛）；main 上抛就交给 JVM（程序终止打印堆栈）。

**治理原则**：能预防的别用异常（下标、判空写对就永不越界）；异常信息要带上下文（消息里带上参数值）；不要 `catch (Exception e) {}` 空吞——出问题毫无痕迹，是最恶劣的写法。

### 异常处理十条军规（生产代码自查表）

1. 能用 if 预防的别用 try（下标、判空写对根本不会有异常）；
2. catch 要具体：`catch (NumberFormatException e)` 优于 `catch (Exception e)`；
3. **永不空 catch**：`catch (Exception e) {}` 吞掉一切，出事无迹可寻，最恶劣写法；
4. 要么处理、要么上抛，别"处理一半"（catch 后又原样 throw 等于没处理还添乱）；
5. 异常消息带上下文：`"解析第 " + lineNo + " 行失败：" + e.getMessage()`；
6. 日志与异常二选一别双打：log.error 后又 throw，同一错误打两遍；
7. finally 里别写 return/break——会吞掉 try 里的 return 和异常；
8. 资源关闭一律 try-with-resources（10.4 节），手 close 总有一天漏；
9. checked 异常优先上抛到"有能力决策的层"再统一处理（分层架构）；
10. 自定义异常继承 RuntimeException，并起一个"一看就懂这是什么错"的名字。

## 10.3 自定义异常

```java
public class BizException extends RuntimeException {       // 继承 RuntimeException = unchecked
    public BizException(String message) {
        super(message);
    }
}

// 业务代码
static void withdraw(double balance, double amount) {
    if (amount > balance)
        throw new BizException("余额不足：" + balance + " < " + amount);
    ...
}
```

自定义异常让"业务错误"有名字、带信息，调用方能精确 catch。

## 10.4 try-with-resources：自动关闭（现代标准写法）

文件、网络连接等资源用完必须关。老写法 finally 里 close 又啰嗦又容易漏。**凡是实现了 AutoCloseable 的资源，都可以放进 try 的圆括号，自动关闭**：

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.*;

try (BufferedReader br = Files.newBufferedReader(Path.of("data.txt"))) {
    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    e.printStackTrace();
}
// 离开 try 自动 br.close()，无论正常结束还是抛异常 —— 手写 close 的时代结束了
```

可以同时管多个资源：`try (var in = ...; var out = ...) { ... }`，关闭顺序与声明相反。

### IO 老体系一图流：读得懂祖传代码

Path/Files 是现代首选，但存量代码里到处是"流"体系。一张图看懂家谱（**字节流**管一切二进制，**字符流**管文本）：

```
字节流（抽象基类）            装饰器（套上去加速/加功能）
InputStream  ── FileInputStream ──┬─ BufferedInputStream（缓冲，快）
OutputStream ── FileOutputStream ─┴─ DataInputStream（读 int/double…）

字符流（文本专用）
Reader  ── FileReader ──┬─ BufferedReader（readLine 按行读，最常用）
Writer  ── FileWriter ──┴─ PrintWriter（println 风格写）
```

对照翻译（老代码 → 新写法）：

```java
// 老体系：装饰器一层层套（IDEA 会提示可替换）
try (BufferedReader br = new BufferedReader(new FileReader("a.txt"))) {
    String line = br.readLine();
} catch (IOException e) { ... }

// 新体系：一步到位
try (var br = Files.newBufferedReader(Path.of("a.txt"))) { ... }
```

设计思想值得带走：**装饰器模式**——BufferedReader 不取代 FileReader，而是"包着它干活"，按需叠功能。JDK 的 IO 是学设计模式最好的活教材（读到框架源码里层层包装的流时，你就认识了它）。

## 10.5 现代文件 IO：Path 与 Files

Java 7 引入 NIO.2，`java.nio.file.Path`（路径）+ `Files`（操作工具）是现代首选。

### 读写文本

```java
import java.nio.file.*;
import java.util.List;
import java.io.IOException;

Path p = Path.of("note.txt");                 // 相对路径；Path.of 老写法 Paths.get

// 一次全读（小文件）
List<String> lines = Files.readAllLines(p);
String all = Files.readString(p);             // 整个文件一个字符串（JDK 11+）

// 写
Files.writeString(p, "第一行\n");              // 覆盖写
Files.writeString(p, "追加的一行\n",
                  StandardOpenOption.APPEND);  // 追加
Files.write(p, lines);                        // 写 List<String>

// 流式逐行（大文件，内存友好）
try (var reader = Files.newBufferedReader(p)) {
    String line;
    while ((line = reader.readLine()) != null) { ... }
}
// 或一行流（第 11 章讲 Stream）
Files.lines(p).forEach(System.out::println);
```

### 二进制与信息

```java
byte[] data = Files.readAllBytes(Path.of("a.jpg"));
Files.write(Path.of("copy.jpg"), data);

Files.exists(p)                               // 存在？
Files.size(p)                                 // 字节数
Files.delete(p)                               // 删除
Files.createDirectories(Path.of("a/b/c"));    // 建目录（含父级）
```

字符编码：`readString/writeString` 默认 UTF-8；需要指定时 `Files.readString(p, Charset.forName("GBK"))`——处理 Windows 老文件乱码的钥匙。

### 字符编码与乱码：一次说清

乱码的本质：**写入和读取用了不同的编码本**。三个主角：

- **ASCII**：128 个英文字符，1 字节（第 2 章）；
- **GBK**：中文 Windows 传统编码，汉字 2 字节；
- **UTF-8**：Unicode 的可变长编码（英文 1 字节、汉字 3 字节），**互联网事实标准**。

同一个"中"字，GBK 是 `D6 D0`，UTF-8 是 `E4 B8 AD`。用 A 编码写入、B 编码读取，屏幕上就是乱码——数据没坏，只是解码本拿错了。

```java
String s = "中文字";
byte[] gbk = s.getBytes("GBK");            // 按 GBK 编码成字节
String back = new String(gbk, "GBK");      // 同一本解码 → 正常
String wrong = new String(gbk, "UTF-8");   // 拿错本 → 乱码“涓枃”

Files.readString(p);                        // 默认 UTF-8
Files.readString(p, Charset.forName("GBK"));// 读老 Windows 文件时指定
```

工程守则：**新文件一律 UTF-8**（JDK 18 起默认就是）；接到乱码文件先问"它当年是什么编码"，再显式指定读。IDEA 右下角能看到当前文件的编码，sublime/记事本"另存为"可转码。

## 10.6 实战 1：文件复制（copy 命令迷你版）

```java
import java.io.IOException;
import java.nio.file.*;

public class MyCopy {
    public static void main(String[] args) {
        if (args.length != 2) {
            System.out.println("用法：java MyCopy 源文件 目标文件");
            return;
        }
        try {
            Files.copy(Path.of(args[0]), Path.of(args[1]),
                       StandardCopyOption.REPLACE_EXISTING);
            System.out.println("复制完成：" + Files.size(Path.of(args[1])) + " 字节");
        } catch (NoSuchFileException e) {
            System.out.println("源文件不存在：" + e.getFile());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

运行：`java MyCopy a.jpg b.jpg`。JDK 一个 Files.copy 替代了 C 语言里逐字节搬运的循环——**先懂原理（缓冲区搬运），再享受工具**。

### 为什么"关流"如此重要

try-with-resources 背后发生了什么，值得单独说清。写文件的完整链路：

```
你的代码 → 缓冲区（内存，攒一批）→ 操作系统 → 磁盘
```

`write` 通常只是把数据放进**缓冲区**，攒够一批才真正落盘（每次直接写磁盘太慢）。`close()` 的隐藏职责之一就是 **flush**：把缓冲区剩余数据压出去。不关流的三个后果：

1. **数据丢一半**：缓冲区里还没落盘的内容随对象消亡；
2. **句柄泄漏**：文件/连接被占用，Windows 上表现为"文件被另一进程占用，删不掉"；
3. **资源耗尽**：高并发下打开的文件数撑爆系统上限。

所以铁律是 try-with-resources（10.4 节），以及一个调试技巧：怀疑"写入没生效"时，先确认流真的被关闭了（或手动调 `flush()`）。

## 10.7 实战 2：学生对象存档（序列化思路）

把 `List<Student>` 存盘、启动时读回。record 对象不能直接写文件，思路一：转成文本行（`张三,90`），读回时解析——这是配置/CSV 的通用做法：

```java
import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.stream.*;

public class Store {
    record Student(String name, int score) { }

    static final Path FILE = Path.of("students.txt");
    static List<Student> students = new ArrayList<>();

    static void save() throws IOException {
        List<String> lines = students.stream()
                .map(s -> s.name() + "," + s.score())
                .collect(Collectors.toList());
        Files.write(FILE, lines);
    }

    static void load() throws IOException {
        if (!Files.exists(FILE)) return;                 // 首次运行：空库
        for (String line : Files.readAllLines(FILE)) {
            String[] parts = line.split(",");
            if (parts.length == 2)
                students.add(new Student(parts[0], Integer.parseInt(parts[1])));
        }
    }

    public static void main(String[] args) throws IOException {
        load();
        students.add(new Student("张三", 90));            // 演示：每次运行加一个
        students.forEach(s -> System.out.println(s.name() + " " + s.score()));
        save();
    }
}
```

`main throws IOException` 是学习期的偷懒（异常直接交给 JVM）；生产代码应在合适层级 catch 并给出用户友好的信息。

## 10.8 小结

- Error 不管；RuntimeException（unchecked）修代码预防，checked 异常必须处理或上抛；
- try/catch/finally；catch 从小到大；finally 管收尾；printStackTrace 看堆栈；
- 资源关闭一律 try-with-resources；
- 文件 IO 用 Path/Files：readAllLines/readString/writeString/lines/copy；
- 对象持久化的朴素方案：转文本行存取（CSV 思想）。

## 练习 10

1.（概念）unchecked 和 checked 异常的区别？分别举两例，各该怎么对待？
2.（概念）finally 什么时候执行？try 里有 return 它还执行吗？
3.（编程）统计一个文本文件的行数、字符数、最长的一行。
4.（编程）写"日记本"：程序读入多行输入（单独一行 `#end` 结束），追加写入 `diary.txt`，每条前带时间戳（LocalDateTime + DateTimeFormatter）。
5.（编程）修改 Store 程序：删掉成绩低于 60 的学生后再保存，运行两次验证数据持久化生效。

## 参考答案

**1.** unchecked = RuntimeException 子类（如 NullPointerException、NumberFormatException），是代码缺陷，修代码预防，编译器不强迫 try；checked = 其他 Exception（如 IOException、SQLException），是环境风险，编译器强迫 catch 或 throws 上抛。

**2.** try 块结束（正常/异常/return）后必然执行（除非 System.exit 或 JVM 崩溃）；**有 return 也执行**——return 的值先算好暂存，跑完 finally 再真正返回（finally 里 return 会"吞掉"原值，别这么写）。

**3.**

```java
import java.nio.file.*;
import java.util.*;

Path p = Path.of("test.txt");
List<String> lines = Files.readAllLines(p);
int chars = lines.stream().mapToInt(String::length).sum();
String longest = lines.stream().max(Comparator.comparingInt(String::length)).orElse("");
System.out.printf("行 %d，字符 %d，最长：%s%n", lines.size(), chars, longest);
```

**4.**

```java
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class Diary {
    public static void main(String[] args) throws Exception {
        StringBuilder sb = new StringBuilder();
        sb.append("==== ").append(LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append(" ====\n");
        Scanner sc = new Scanner(System.in);
        while (true) {
            String line = sc.nextLine();
            if (line.equals("#end")) break;
            sb.append(line).append('\n');
        }
        Files.writeString(Path.of("diary.txt"), sb.toString(),
                          StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        System.out.println("已保存到 diary.txt");
    }
}
```

**5.** 在 save 前加 `students.removeIf(s -> s.score() < 60);`；第一次运行添加 `("张三", 55)` 与 `("李四", 90)` 并保存；第二次运行 load 后打印应只剩李四——证明数据在磁盘上延续。

**[▲ 返回目录](#toc)**

---

<a id="j11"></a>

# 第 11 章 Lambda 进阶、Stream 与多线程

> 本章目标：掌握 JDK 内置函数式接口与方法引用；用 Stream 做声明式数据处理；理解线程、竞态条件与 synchronized；会用线程池，见识 JDK 21 的虚拟线程。本章是 Java SE 的最后一块高地。

---

## 11.1 函数式接口四君子

Lambda 的地基是"单抽象方法接口"。JDK 在 `java.util.function` 预置了一批，最常用四个：

| 接口            | 抽象方法            | 意思                 | 示例 Lambda                    |
| --------------- | ------------------- | -------------------- | ------------------------------ |
| `Predicate<T>`  | `boolean test(T t)` | 判断真假的规则       | `s -> s.isEmpty()`             |
| `Function<T,R>` | `R apply(T t)`      | 输入 T 变换出 R      | `s -> s.length()`              |
| `Consumer<T>`   | `void accept(T t)`  | 消费一个值（副作用） | `s -> System.out.println(s)`   |
| `Supplier<T>`   | `T get()`           | 无中生有造一个值     | `() -> new Random().nextInt()` |

它们把"行为"做成了标准零件：removeIf 收 Predicate，forEach 收 Consumer，map 收 Function……你此前已经在用（`s -> s.length() > 3`），现在认识了零件本身。

### 方法引用：Lambda 的简写

当 Lambda 体只是"调用一个现成方法"时，可以再简：

```java
list.forEach(s -> System.out.println(s));
list.forEach(System.out::println);            // 对象::实例方法

list.sort((a, b) -> a.compareTo(b));
list.sort(String::compareTo);                 // 类::实例方法（第一个参当接收者）

names.stream().map(n -> n.length());
names.stream().map(String::length);           // 类::实例方法

list.stream().map(x -> new Student(x, 0));
list.stream().map(x -> new Student(x, 0))     // 类::new（构造引用）
     .forEach(s -> list2.add(s));
```

读法：`属主::方法名`，参数自动对号入座。可读性更好，看到要认识。

## 11.2 Stream：数据处理的流水线

需求语言变了：从"怎么循环"变成"要什么结果"。**Stream 把"描述处理步骤"和"执行"分开**——流水线三段式：

```java
list.stream()                     // 1. 水源：集合/数组/Files.lines/Stream.of
    .filter(s -> s.length() > 3)  // 2. 中间操作：惰性，只登记不执行
    .map(String::toUpperCase)     //    （可串多个）
    .sorted()                     //
    .forEach(System.out::println);// 3. 终端操作：点火，整条流水线开跑
```

**没有终端操作（forEach/collect/count…），中间操作一步都不执行**（惰性求值）——登记完计划才一次性过流水线。

### 常用操作速览

准备数据：

```java
record Student(String name, String cls, int score) { }
List<Student> list = List.of(
    new Student("张三", "A", 90), new Student("李四", "B", 66),
    new Student("王五", "A", 95), new Student("赵六", "B", 43),
    new Student("钱七", "A", 78));
```

```java
// 过滤 + 收集
List<Student> passed = list.stream()
        .filter(s -> s.score() >= 60)
        .collect(Collectors.toList());          // 老写法；JDK16+ 可 .toList()

// 变换
List<String> names = list.stream()
        .map(Student::name)
        .toList();

// 排序（定制）
List<Student> byScore = list.stream()
        .sorted(Comparator.comparingInt(Student::score).reversed())
        .toList();

// 匹配与查找
boolean allPassed = list.stream().allMatch(s -> s.score() >= 60);
boolean anyFailed = list.stream().anyMatch(s -> s.score() < 60);
Student first = list.stream().filter(s -> s.cls().equals("A")).findFirst().orElse(null);

// 数值统计
double avg = list.stream().mapToInt(Student::score).average().orElse(0);
int max = list.stream().mapToInt(Student::score).max().orElse(0);
IntSummaryStatistics st = list.stream()
        .mapToInt(Student::score).summaryStatistics();   // 一次拿 count/avg/max/min/sum
System.out.println(st);

// 拼接字符串
String joined = names.stream().collect(Collectors.joining(", ", "[", "]"));

// 分组（神级好用）
Map<String, List<Student>> byClass = list.stream()
        .collect(Collectors.groupingBy(Student::cls));
// {A=[张三, 王五, 钱七], B=[李四, 赵六]}

Map<String, Long> countByClass = list.stream()
        .collect(Collectors.groupingBy(Student::cls, Collectors.counting()));

Map<String, Double> avgByClass = list.stream()
        .collect(Collectors.groupingBy(Student::cls,
                 Collectors.averagingInt(Student::score)));

// 去重、截断、跳过
list.stream().distinct().limit(3).skip(1)...
```

`Files.lines(p)` 让文件行直接进流水线（第 10 章已见）；`Arrays.stream(arr)` 数组同款。

**何时用 Stream**：数据的过滤/映射/分组/统计，链式一写就非常清晰；复杂的循环逻辑（多重依赖、提前 break 的精细控制）用普通 for 循环更直白。工具为需求服务，不反过来。

### Stream 进阶：并行流一瞥

把 `stream()` 换成 `parallelStream()`，流水线自动拆成多线程并行跑：

```java
long count = java.nio.file.Files.lines(Path.of("big.log"))
        .parallel()
        .filter(s -> s.contains("ERROR"))
        .count();
```

适用判断：**数据量大（万级以上） + 每个元素的计算重** 才值得并行（线程调度本身有开销）；小数据并行反而更慢。两个坑：并行流内部用公共 ForkJoinPool，**元素处理里不能有阻塞操作**（会饿死别的任务）；操作的顺序性（findFirst 等）在并行下语义要小心。入门口诀：**先写串行，量出来了再加 parallel 一词实测**，别为了炫技预支复杂度。

## 11.3 Optional：给 null 上枷锁

`null` 是 NPE 万恶之源。Optional 把"可能没有值"显式化：

```java
Optional<Student> found = list.stream()
        .filter(s -> s.name().equals("王五"))
        .findFirst();

found.ifPresent(s -> System.out.println(s.score()));     // 有则消费
Student s0 = found.orElse(new Student("无", "-", 0));     // 没有则给默认
Student s1 = found.orElseThrow(() -> new NoSuchElementException("查无此人"));
```

原则：**返回值可能为空就返回 Optional**，调用者被迫面对"可能没有"；自己别 `get()` 裸取（不如判空），别拿 Optional 当字段/参数（只做返回值）。

## 11.4 多线程：并发世界第一课

现代 CPU 多核、服务器动辄处理上千并发请求——单线程排队太浪费。**线程（thread）= 程序里独立奔跑的一条执行流**。

```java
public class ThreadDemo {
    public static void main(String[] args) {
        Runnable task = () -> {                       // 任务 = Runnable（函数式接口）
            for (int i = 1; i <= 5; i++) {
                System.out.println(Thread.currentThread().getName() + " 第 " + i + " 圈");
                try {
                    Thread.sleep(200);                // 睡 200ms：模拟干活
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        };

        Thread t1 = new Thread(task, "跑者A");
        Thread t2 = new Thread(task, "跑者B");
        t1.start();                                    // 注意是 start 不是 run！
        t2.start();                                    // 两条流同时奔跑
        System.out.println("main 已经跑完自己的活了");
    }
}
```

两个要点：

- **start() 开新线程，run() 只是普通方法调用**（在当前线程里顺序执行，没有并发）——经典面试题；
- 输出交错无规律：线程调度由操作系统决定，每次运行顺序都可能不同。

### 竞态条件：并发的第一杀手

```java
class Counter {
    int count = 0;
    void increment() { count++; }             // 看着一行，实际 = 读出/加一/写回 三步
}

Counter c = new Counter();
Runnable r = () -> { for (int i = 0; i < 100000; i++) c.increment(); };
Thread a = new Thread(r), b = new Thread(r);
a.start(); b.start();
a.join(); b.join();                            // join：等线程干完再往下
System.out.println(c.count);                   // 期望 200000，实际 18xxxx —— 丢了更新！
```

两条线程同时"读出→加一→写回"，互相覆盖成果——**竞态条件（race condition）**。解法：给"三步"上锁，保证原子：

```java
class Counter {
    private int count = 0;
    public synchronized void increment() { count++; }   // 同一时刻只有一个线程能进入
    public synchronized int get() { return count; }
}
```

`synchronized` 方法/代码块 = 互斥锁：一个线程进去，别人门口排队。代价是吞吐下降，**只锁真正冲突的最小片段**。补充两个词：`volatile`（保证可见性，不保证原子性）；`AtomicInteger`（CAS 无锁原子计数，`incrementAndGet()`）。

线程安全的纪律：`HashMap`/`ArrayList` **不是**线程安全的，并发场景用 `ConcurrentHashMap`、`CopyOnWriteArrayList` 或加锁。

### volatile 与可见性（一句话版）

多核 CPU 各自带缓存，一个线程改了变量，另一个线程可能**看不见**（读到的是自己缓存里的旧值）。`volatile` 修饰的变量：写时立刻刷回主存、读时强制拉最新——**保证可见性，但不保证原子性**：

```java
volatile boolean running = true;      // 标志位场景：volatile 的正解

// 线程 A：while (running) { 干活 }
// 线程 B：running = false;            ← A 能立刻看到，停下
```

经典分工：**状态标志用 volatile；计数累加用 AtomicInteger；复合操作用 synchronized**。"i++ 加 volatile 行不行？"——不行（三步丢失问题依旧），这是面试必考的认知点。背后是 Java 内存模型（JMM）的 happens-before 规则体系，初学记结论，深入留到读《Java 并发编程实战》。

### 线程的状态与死锁

线程的一生六种状态（`Thread.State`）：NEW（创建未启动）→ RUNNABLE（可运行/运行中）⇄ BLOCKED（等锁）/ WAITING（等 notify/join）/ TIMED_WAITING（带超时的等待）→ TERMINATED（结束）。`jstack <pid>`（第 12 章）能打印每条线程卡在哪个状态、哪行代码——**排查"程序卡住不动"的神器**。

并发第二杀手**死锁**：两条线程各持一把锁、互相等对方：

```java
Object lockA = new Object(), lockB = new Object();

new Thread(() -> {
    synchronized (lockA) {
        try { Thread.sleep(100); } catch (InterruptedException e) { return; }
        synchronized (lockB) { }       // 等 B
    }
}).start();

new Thread(() -> {
    synchronized (lockB) {
        try { Thread.sleep(100); } catch (InterruptedException e) { return; }
        synchronized (lockA) { }       // 等 A —— 互相等，永远等
    }
}).start();
```

jstack 会直接打印 `Found one Java-level deadlock` 和两条持有/等待关系。预防三条：**所有线程按相同顺序拿锁**（都先 A 后 B 就死不了）；用 tryLock 带超时；能无锁（Atomic）就无锁。

## 11.5 线程池：不要裸 new 线程

线程是昂贵资源（各占约 1MB 栈），高频创建销毁是灾难。**线程池 = 一批常驻工人，任务排队投递**：

```java
import java.util.concurrent.*;

ExecutorService pool = Executors.newFixedThreadPool(4);    // 4 个常驻工人

Future<Integer> f = pool.submit(() -> {                    // 任务有返回值：Callable
    Thread.sleep(500);
    return 42;
});

Integer result = f.get();                                   // 阻塞等结果
System.out.println(result);

pool.shutdown();                                            // 用完关闭（不然程序不退出）
```

- `newFixedThreadPool(n)` 固定 n 线程；`newCachedThreadPool()` 弹性伸缩；
- `Future` = 取货凭证，`get()` 等结果；
- 生产建议直接用 `ThreadPoolExecutor` 显式配参数（corePoolSize、队列、拒绝策略），Executors 的快捷方法在大流量下有坑（队列无界可能 OOM）——面试高频。

### JDK 21 之光：虚拟线程

传统（平台）线程 1:1 映射系统线程，几千个就到顶。**虚拟线程**由 JVM 调度、轻如对象，百万级并发随便开，写法却和普通线程一样：

```java
// JDK 21+
Thread.startVirtualThread(() -> System.out.println("我是一个虚拟线程"));

try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 100_000; i++) {                    // 十万个任务，照单全收
        int id = i;
        pool.submit(() -> { /* IO 密集任务，如调接口、查数据库 */ return id; });
    }
}
```

虚拟线程最适合 **IO 密集**任务（等待网络/磁盘），CPU 密集任务帮不上忙。它是 Java 后端吞吐的革命性更新，知道它、敢用它是 JDK 21 时代的加分项。

### CompletableFuture：异步编排一瞥（进阶选读）

Future 的痛点：`f.get()` 只能干等。CompletableFuture 让异步任务**像 Stream 一样编排**——"先查用户，再查订单，两边并行，最后合并"：

```java
import java.util.concurrent.CompletableFuture;

CompletableFuture<String> userF = CompletableFuture.supplyAsync(() -> {
    // 假装查数据库/调接口（阻塞 500ms）
    sleep(500);
    return "张三";
});
CompletableFuture<Integer> orderF = CompletableFuture.supplyAsync(() -> {
    sleep(600);
    return 3;
});

userF.thenCombine(orderF, (user, orders) ->
        user + " 有 " + orders + " 个订单")
     .thenAccept(System.out::println);          // 张三 有 3 个订单（总耗时 ≈600ms 而非 1100ms）

// 大量任务的并行收集
var results = java.util.stream.IntStream.rangeClosed(1, 10)
        .mapToObj(i -> CompletableFuture.supplyAsync(() -> i * i))
        .toList().stream().map(CompletableFuture::join).toList();
System.out.println(results);
```

微服务调用的"并发聚合"（一个页面同时调 5 个下游接口）就是这套 API 的工业化用法。入门阶段读懂 thenCombine/thenAccept 的"流水线感"即可，真写异步服务时再回来精学。

### 线程间协作：生产者与消费者（选读）

锁解决"别踩脚"，协作解决"配合干"：生产者往队列放数据，消费者取，队列空了消费者等、满了生产者等。`wait/notifyAll` 是最底层的协作原语（必须在 synchronized 内使用）：

```java
import java.util.*;

class Buffer {
    private final Queue<Integer> q = new ArrayDeque<>();
    private final int cap = 3;

    public synchronized void put(int v) throws InterruptedException {
        while (q.size() == cap) wait();          // 满了：等待（并释放锁）
        q.offer(v);
        notifyAll();                              // 叫醒等数据的消费者
    }

    public synchronized int take() throws InterruptedException {
        while (q.isEmpty()) wait();              // 空了：等待
        int v = q.poll();
        notifyAll();                              // 叫醒等空间的生产者
        return v;
    }
}
// 两个线程分别循环 put / take 即可观察协作
```

三个细节是面试常客：① `wait` 会**释放锁**（sleep 不会）——等的时候让别人干活；② 等待条件用 **while 而不是 if**（被叫醒后条件可能又变了，必须重查）；③ `notifyAll` 比 `notify` 稳（notify 随机叫一个，可能叫错人）。现代代码更常用 `BlockingQueue`（`put/take` 自带这套逻辑）或虚拟线程 + `SynchronousQueue`，但底层原理就这段——读懂它，并发就"入门的入门"了。

## 11.6 小结

- 四君子：Predicate 判 / Function 变 / Consumer 吃 / Supplier 造；方法引用 `属主::方法`；
- Stream 三段式：源 → 惰性中间操作（filter/map/sorted）→ 终端（collect/forEach/count）；groupingBy 分组神技；
- Optional 显式表达"可能没有"，返回值场景用；
- `start()` 才开线程；`++` 不是原子的，竞态用 synchronized/AtomicInteger；
- 高并发用线程池，IO 密集的新代码可以上 JDK 21 虚拟线程。

## 练习 11

1.（概念）Stream 的中间操作和终端操作区别？没有终端操作会怎样？
2.（概念）为什么 `count++` 在两个线程里会丢更新？说出两种修复方案。
3.（编程）给定 `List<Integer>`（含重复），用 Stream 输出：去重后的偶数、按平方值升序的前 5 个。
4.（编程）用 `Files.lines` + Stream 统计某文件中包含 "error"（忽略大小写）的行数。
5.（编程）开 4 个线程各跑 10 万次 `AtomicInteger.incrementAndGet()`，验证最终值恰为 40 万。

## 参考答案

**1.** 中间操作返回新 Stream、只登记步骤不执行（惰性）；终端操作触发整条流水线求值并产出结果。没有终端操作，中间操作一步都不跑（连源都不会被遍历）。

**2.** `count++` 实际是读出、加一、写回三步，两个线程交错执行时互相覆盖对方成果（更新丢失）。修复：`synchronized` 方法/块保证互斥；或改用 `AtomicInteger.incrementAndGet()`（CPU 原子指令 CAS）。

**3.**

```java
import java.util.*;
import java.util.stream.*;

List<Integer> nums = List.of(4, 2, 7, 2, 9, 4, 6, 8, 5, 3, 1, 10);

List<Integer> top5 = nums.stream()
        .distinct()
        .filter(n -> n % 2 == 0)
        .sorted(Comparator.comparingInt(n -> n * n))
        .limit(5)
        .toList();
System.out.println(top5);       // [2, 4, 6, 8, 10]
```

**4.**

```java
import java.nio.file.*;
import java.util.stream.*;

long n;
try (Stream<String> lines = Files.lines(Path.of("app.log"))) {
    n = lines.filter(s -> s.toLowerCase().contains("error")).count();
}
System.out.println("error 行数：" + n);
```

（Files.lines 打开的资源要关闭，放进 try-with-resources。）

**5.**

```java
import java.util.concurrent.atomic.AtomicInteger;

AtomicInteger counter = new AtomicInteger();
Thread[] ts = new Thread[4];
for (int i = 0; i < 4; i++) {
    ts[i] = new Thread(() -> {
        for (int k = 0; k < 100_000; k++) counter.incrementAndGet();
    });
    ts[i].start();
}
for (Thread t : ts) t.join();
System.out.println(counter.get());     // 400000，每次都精确
```

**[▲ 返回目录](#toc)**

---

<a id="j12"></a>

# 第 12 章 JVM 入门：内存、GC 与字节码

> 本章目标：建立 JVM 内存区域的全景图；理解 GC 怎么判断垃圾、怎么回收；亲手用 javap 看字节码；复现并诊断两大经典崩溃：StackOverflowError 与 OutOfMemoryError。这是"会写 Java"与"懂 Java"的分水岭。学这章不需要背参数，需要的是把前十一章的每个概念在内存图上找到住址——你会发现所有"玄学行为"瞬间都有了物理坐标。

---

## 12.1 运行时数据区：程序在内存里的样子

`java Hello` 启动后，JVM 向操作系统要一大块内存，划区治理（JDK 8+ 版本）：

```
┌───────────────────────────────────────────────┐
│ 线程共享区                                      │
│ ┌───────────────────────┐ ┌─────────────────┐ │
│ │ 堆 Heap               │ │ 方法区/元空间      │ │
│ │ 所有对象住这里          │ │ 类信息、静态变量、  │ │
│ │ ┌────────┬──────────┐ │ │ 运行时常量池       │ │
│ │ │ 新生代   │ 老年代    │ │ （字符串池在此）    │ │
│ │ │(伊甸园+幸存区)│      │ └─────────────────┘ │
│ │ └────────┴──────────┘ │                     │
│ └───────────────────────┘                     │
├───────────────────────────────────────────────┤
│ 线程私有区（每条线程一套）                          │
│ ┌──────────────┐ ┌─────────┐ ┌──────────────┐ │
│ │ 虚拟机栈       │ │ 本地方法栈│ │ 程序计数器     │ │
│ │ 每个方法一帧：  │ │ (JNI)   │ │ 记录执行到哪   │ │
│ │ 局部变量/操作数 │ └─────────┘ └──────────────┘ │
│ │ 栈/返回地址    │                                │
│ └──────────────┘                                │
└───────────────────────────────────────────────┘
```

现在能回答前面各章埋下的伏笔了：

- **第 4/5 章的"遥控器"**：`Student s = new Student(...)` 中，变量 `s`（遥控器）在**栈帧**的局部变量表里，对象本体在**堆**里；
- **第 5 章 static**：静态变量、类信息住**方法区**，全体共享、随类加载而生；
- **第 4 章递归的 StackOverflowError**：每层方法调用压一个栈帧，无限递归把**虚拟机栈**撑爆（典型栈深万级，可用 `-Xss` 调大小）；
- **第 8 章字符串池**：字符串字面量存在方法区的运行时常量池，所以两个 `"hello"` 是同一对象。

## 12.2 堆与对象的一生

对象的一生：`new` → 在**新生代伊甸园**出生 → 挂机幸存（经历多轮 Minor GC 后搬进**老年代**）→ 无人引用 → 被回收。堆大小用 `-Xms`（初始）/`-Xmx`（最大）控制，学习期固定一下避免干扰：

```
java -Xms256m -Xmx256m Hello
```

对象内存布局小知识：对象头（标记字+类型指针）+ 实例数据 + 对齐填充——所以空对象也占 16 字节左右，`new` 不是免费的；但分代+TLAB 等优化让分配本身极快（指针碰撞，纳秒级）。

## 12.3 GC：怎么判断垃圾、怎么回收

**判活标准：可达性分析**。从 GC Roots（各线程栈帧里的局部变量、静态变量、常量引用等）出发，沿引用链遍历，能到达的对象活着；**到不了的就是垃圾**。

```
GC Roots ──▶ s ──▶ Student 对象        活
GC Roots ──▶ t ──▶ 旧 Student 对象？
            t = null 之后：旧对象从 roots 出发到不了 → 垃圾 → 回收
```

注意：**把引用置 null（或让变量出作用域）即"断链"**，这是程序员影响 GC 的主要手段；`System.gc()` 只是"建议"，别指望它。

**分代回收**（为什么划分新生代/老年代）：

- **Minor GC**：频繁、快速，清理新生代——朝生夕死的对象在这里批量消失（绝大多数对象活不过第一次 GC）；
- **Full GC**：整体清理（含老年代），较慢，停顿明显——调优的核心目标就是少触发它。

常见垃圾收集器混个脸熟：Serial（单线程，学习用）、Parallel（吞吐优先，JDK 8 默认）、G1（区域化，JDK 9+ 默认）、ZGC（低停顿，大内存新宠）。会用 `-XX:+UseG1GC` 级别的开关即可，深入属于面试八股。

## 12.4 亲手复现两大经典崩溃

### StackOverflowError：栈爆了

```java
public class SOF {
    static int depth = 0;
    static void dive() {
        depth++;
        dive();                              // 无出口递归
    }
    public static void main(String[] args) {
        try {
            dive();
        } catch (StackOverflowError e) {
            System.out.println("栈深约 " + depth + " 层后爆栈");
        }
    }
}
```

报错堆栈会打印长长的 `at SOF.dive(SOF.java:5)` 列表——堆栈跟踪直接告诉你死循环的路径，这就是堆栈的价值。修复思路：改出口或改循环。

### OutOfMemoryError：堆满了

```java
import java.util.ArrayList;
import java.util.List;

public class OOM {
    public static void main(String[] args) {
        List<byte[]> hold = new ArrayList<>();
        try {
            while (true) {
                hold.add(new byte[1024 * 1024]);    // 每次抓 1MB 且不放（集合一直引用着）
            }
        } catch (OutOfMemoryError e) {
            System.out.println("堆装满了：" + e);      // Java heap space
        }
    }
}
// 建议：java -Xmx256m OOM   （限小堆，快点炸完）
```

OOM 的通用诊断思路：错误消息 + `-XX:+HeapDumpOnOutOfMemoryError`（崩溃时导出堆快照）+ MAT/VisualVM 分析快照里"谁抓着内存不放"。日常 90% 的 OOM 是**集合当缓存只进不出**、**大文件一次性 readAllBytes**、**流没关**这三宗罪。

## 12.5 javap：亲眼看看字节码

字节码不是玄学，`javap -c` 直接看。写个 `Add.java`：

```java
public class Add {
    public static int add(int a, int b) {
        return a + b;
    }
}
```

```
javac Add.java
javap -c Add
```

输出（节选）：

```
public static int add(int, int);
  Code:
     0: iload_0        ← 把第 0 个 int 参数压入操作数栈
     1: iload_1        ← 第 1 个参数入栈
     2: iadd           ← 弹出两个，相加，结果入栈
     3: ireturn        ← 返回栈顶 int
```

JVM 是**基于栈的虚拟机**：指令对"操作数栈"压栈弹出，与 CPU 的寄存器风格不同。再看一个字符串拼接，用字节码解释第 8 章"循环里 `+` 慢"的结论：

```java
public static String concat(String a) {
    String s = "";
    for (int i = 0; i < 3; i++) s = s + a;
    return s;
}
```

`javap -c Add` 的真实输出（JDK 17/21 实测）：

```
public static java.lang.String concat(java.lang.String);
  Code:
      ...
     10: aload_1
     11: aload_0
     12: invokedynamic #9, 0   // makeConcatWithConstants:(String;String;)String
     17: astore_1
     18: iinc          2, 1
     21: goto          5        ← 回到循环开头，下一轮再来一次 invokedynamic
```

每一轮循环都执行一次 `invokedynamic makeConcatWithConstants`——这是 JDK 9 起（JEP 280）字符串拼接的新编译方式：不再生成显式的 `new StringBuilder` 指令，而是把"怎么拼"交给运行时的字符串拼接工厂决定。**底层机制变了，但结论没变**：循环里每次 `+` 都触发一次拼接调用、造出中间字符串，O(n²) 的总量没变——所以第 8 章"循环外建一个 StringBuilder 复用 append"依然是正确姿势。顺便这也演示了字节码研究的一个素养：**教程/网文的说法要用 javap 实测验证**，JDK 在进化，十年前的结论可能已经过时（比如老书上说的 StringBuilder 指令在 JDK 9+ 就已消失）。

## 12.6 编译执行 vs JIT：Java 为什么也能飞

JVM 执行字节码两套机制并存：

- **解释执行**：逐条读字节码逐条执行——启动快，跑得慢；
- **JIT（即时编译）**：发现某方法/循环是热点（默认阈值 1 万次调用左右），把它的字节码编译成本机机器码，此后全速奔跑。

所以 Java 程序的典型性能曲线是"先热身、后起飞"——加压测前要预热的服务器代码就是这个原因。逃逸分析等激进优化还能干掉部分对象分配/锁。结论：**Java 慢"半步"编译型语言的旧印象早已过时，长期运行的服务里 Java 性能第一梯队**。

### 常用 JVM 参数速查

```
java [参数] 主类
```

| 参数                              | 作用               | 典型用法                                     |
| --------------------------------- | ------------------ | -------------------------------------------- |
| `-Xms512m`                        | 堆初始大小         | 与 Xmx 设成一样，避免运行中扩容抖动          |
| `-Xmx2g`                          | 堆最大值           | 容器/小内存机器必设，防 OOM 杀进程           |
| `-Xss256k`                        | 每线程栈大小       | 需要百万线程前的知识铺垫（虚拟线程不占这个） |
| `-XX:+UseG1GC`                    | 指定 G1 收集器     | 大堆服务常用                                 |
| `-XX:+HeapDumpOnOutOfMemoryError` | OOM 时自动导堆快照 | **生产标配**，排查内存泄漏的现场证据         |
| `-XX:MaxMetaspaceSize=256m`       | 元空间上限         | 动态生成类过多的框架场景                     |

经验三条：学习期给小程序 `java -Xmx64m Xxx` 主动限堆，OOM 实验更快复现；生产内存 = 堆 + 元空间 + 线程栈 + 直接内存，**别把机器内存全分给 Xmx**；看到 `-XX:` 开头别慌，它就是 JVM 的"高级设置项"开关而已。

## 12.7 观测工具三件套

```
jps          # 列出本机 Java 进程（类似 ps）
jmap -histo <pid>          # 堆里对象统计：哪个类的对象最多、占多少
jstack <pid>               # 打印所有线程栈：死锁、卡死排查神器
```

图形化：**VisualVM**（免费，看堆/线程/GPU 曲线）或 JDK Mission Control（`jcmd JFR.start` 飞行记录器）。排查口诀：**卡死看 jstack，内存看 jmap，趋势看 VisualVM**。

### 类加载器与"同一个类"

三层加载器自顶向下：**启动类加载器**（加载 JDK 核心类库）→ **平台类加载器**（扩展/平台模块）→ **应用类加载器**（加载你 classpath 上的类）。工作流程是**双亲委派**：收到加载请求先原样转发给父级，父级说"我管不了"才自己动手——核心类（如 java.lang.String）永远由最顶层加载，你想自己写一个 java.lang.String 冒名顶替？门都没有，这是 JVM 安全的基石之一。

一个冷门但重要的推论：**判断"两个类是否相同"，要看类名 + 加载器**。两个加载器各加载一份同名类，JVM 视为两个不同的类，互相 cast 会 ClassCastException——Web 容器、热部署、插件系统的诸多"玄学问题"根源于此。

## 12.8 类加载：类是什么时候进 JVM 的

`.class` 文件不会全量装进内存，**用到才加载**（懒加载）。生命周期：加载 → 链接（验证/准备/解析）→ 初始化（执行静态初始化块和 static 字段赋值）。验证一个冷知识：

```java
class A {
    static { System.out.println("A 被初始化了"); }
}
public class LazyLoad {
    public static void main(String[] args) throws Exception {
        var c = A.class;                    // 只拿 Class 对象：不初始化！
        System.out.println("还没输出 A");
        Class.forName("A");                 // 强制初始化 → 打印“A 被初始化了”
    }
}
```

类加载器层次（启动类加载器 → 平台类加载器 → 应用类加载器）与"双亲委派"是面试经典，原理：**子加载器先委托父级，父级找不到才自己找**——防止核心类被冒名顶替。入门阶段建立"类是懒加载的、加载分阶段"的印象即可。

### 从 .java 到运行：完整旅程（全书总结图）

把全书的主线拼成一张图，这就是 Java 程序的一生：

```
你写的 Student.java
   │ javac 编译（查语法、类型检查、把 + 拼接优化成 invokedynamic……）
   ▼
Student.class（字节码，平台无关的“中间指令”）
   │ java Student 启动 JVM
   ▼
┌─ JVM 启动 ──────────────────────────────────────┐
│ 1. 类加载：按需把 .class 装进方法区（双亲委派）      │
│    static 字段初始化 → main 入栈                   │
│ 2. 运行：                                        │
│    每次方法调用压一个栈帧（局部变量在栈）             │
│    每次 new 在堆里造对象（变量只是遥控器）           │
│    方法调用先解释执行，热点交 JIT 编译成机器码        │
│ 3. GC：从栈/静态区出发做可达性分析，回收堆中孤岛      │
└─────────────────────────────────────────────────┘
   ▼
程序退出 / 栈溢出 / 堆耗尽（OOM）→ 你已经认识全部三种结局
```

回头看每章在这张图上的位置：第 2、4 章（变量、值传递）说的是栈帧里的格子；第 5~7 章（对象、static）说的是堆与方法区；第 8 章 String 池在方法区的常量池；第 10 章异常是 JVM 的"快速失败"机制；第 11 章多线程是"每条线程一套栈，共享同一个堆"；本章把它们全部接通。**Java 没有黑盒，只有还没拆开的盒。**

## 12.9 小结

- 内存分区：堆（对象）、方法区/元空间（类信息/静态变量/字符串池）、虚拟机栈（每方法一帧）——线程私有 vs 共享；
- GC 判活靠从 GC Roots 出发的可达性；新生代 Minor GC 快而频繁，老年代 Full GC 慢而少；
- StackOverflowError = 栈深超限（死递归），OOM = 堆满（集合只进不出等三宗罪），堆栈跟踪与 HeapDump 是排查钥匙；
- javap -c 能亲眼看字节码：基于操作数栈；JIT 把热点编译成机器码，越跑越快；
- jps/jmap/jstack + VisualVM 是观测三件套；类是懒加载的。

## 练习 12

1.（概念）局部变量 `int x`、`Student s`、`new Student(...)` 的对象本体、static 常量，分别住在 JVM 哪块内存？
2.（概念）GC 怎么判断一个对象是垃圾？`s = null` 在其中起什么作用？
3.（操作）编译并运行本文的 SOF 与 OOM 程序（OOM 用 `-Xmx256m`），记录两者的错误信息长什么样。
4.（操作）写一个 `String concat(String a)`（循环 + 拼接 100 次），`javap -c` 观察，找到循环里反复出现的 `StringBuilder` 相关指令。
5.（概念）为什么说"Java 程序要先预热"？JIT 做了什么？

## 参考答案

**1.** `int x` 在当前方法的**栈帧**（局部变量表）里；`s`（引用/遥控器）同样在栈帧里；对象本体在**堆**；static 常量在**方法区/元空间**。

**2.** 可达性分析：从 GC Roots（栈上局部变量、静态变量等）沿引用链走，走到不了的对象即垃圾。`s = null` 切断了 roots 到对象的引用链，使对象不可达，从而可被回收。

**3.** SOF 输出类似 `StackOverflowError` + 大量 `at SOF.dive(SOF.java:N)` 堆栈行；OOM 输出 `Exception in thread "main" java.lang.OutOfMemoryError: Java heap space`（在 256m 堆下通常几秒内触发）。

**4.** 循环体里能看到每轮都有 `new StringBuilder`（`invokespecial` 构造）与结尾 `invokevirtual toString`，佐证"+"在循环里反复建临时 StringBuilder；循环外建一个 StringBuilder 复用即可优化。

**5.** JVM 起初解释执行字节码；热点代码被 JIT 编译为本机机器码后按编译版执行。刚启动时热点还没编译，跑的是慢的解释版；跑一段时间热点编译完成、性能爬升——即"预热"。

**[▲ 返回目录](#toc)**

---

<a id="j13"></a>

# 第 13 章 工程化与 Spring Boot 实战

> 本章目标：学会用 Maven 管理项目与依赖、用 JUnit 写测试、认识日志；理解 HTTP 与 REST；用 Spring Boot 写出第一个真正意义的后端服务——学生管理 REST API。本章完成后，你与"Java 开发者"之间只差项目经验。

---

## 13.1 真实项目长什么样

至今我们的代码是"裸奔"的：手工 javac、依赖零外部库。真实工程的标准结构：

```
student-api/
├── pom.xml                 ← Maven 配置：项目坐标 + 依赖 + 插件
└── src/
    ├── main/
    │   ├── java/           ← 源代码（按包分目录）
    │   └── resources/      ← 配置文件（application.yml 等）
    └── test/
        └── java/           ← 测试代码（与 main 镜像）
```

**Maven** 是 Java 世界的"包管家"（同类：Gradle）：声明依赖坐标，它自动从中央仓库下载 jar 并配置好编译路径；`mvn` 一条命令完成编译、测试、打包。

安装：从 <https://maven.apache.org> 下载解压，把 `bin` 目录加入 PATH（IDEA 自带 Maven，可用它内置的）；验证 `mvn -version`。**IDEA 的做法**：New Project 选 Maven（或 Spring Initializr），勾选自动导入，从此命令都由 IDE 代劳。

## 13.2 pom.xml：项目身份证

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>       <!-- 组织坐标 -->
    <artifactId>student-api</artifactId> <!-- 项目名 -->
    <version>1.0-SNAPSHOT</version>      <!-- 版本 -->

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>                      <!-- 一个依赖 = 一个坐标 -->
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>5.10.2</version>
            <scope>test</scope>           <!-- 只在测试期可用 -->
        </dependency>
    </dependencies>
</project>
```

去哪找坐标？<https://mvnrepository.com> 搜库名复制 XML 即可。常用命令：`mvn compile`（编译）、`mvn test`（跑测试）、`mvn package`（打 jar）。

## 13.3 JUnit 5：代码的体检中心

**没有测试的代码 = 不知道自己坏没坏的代码。** JUnit 5 是标准测试框架：

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {

    @Test                                   // 一个测试方法
    void addShouldWork() {
        assertEquals(4, 2 + 2);             // 断言：期望 4
    }

    @Test
    void divideShouldThrow() {
        ArithmeticException e = assertThrows(ArithmeticException.class,
                () -> 10 / 0);              // 断言“应该抛异常”
        assertEquals("/ by zero", e.getMessage());
    }
}
```

常用断言：`assertEquals(期望, 实际)`、`assertTrue/assertFalse`、`assertNull/assertNotNull`、`assertThrows`。**测试方法三段式**：准备（Arrange）→ 执行（Act）→ 断言（Assert）。规矩：测试类命名 `XxxTest`、方法名说人话（`withdrawShouldFailWhenBalanceIsLow`）、一个测试只验证一件事。`mvn test` 全量跑，绿了才算合格——这就是"回归测试"的底气：改代码后一键确认没改坏。

## 13.4 日志：System.out.println 的正规替代

打印调试在大项目里会失控（关不掉、没级别、没时间戳）。标准做法 **SLF4J + Logback**（Spring Boot 自带）：

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class PayService {
    private static final Logger log = LoggerFactory.getLogger(PayService.class);

    void pay(double amount) {
        log.info("开始支付，金额 {}", amount);          // {} 占位，不拼字符串
        log.debug("进入 pay 方法");                     // 开发期细节
        log.warn("余额偏低：{}", amount);
        log.error("支付失败", exceptionObject);          // 异常对象单独传，打印堆栈
    }
}
```

级别从低到高：`trace < debug < info < warn < error`，配置文件控制输出哪级（如生产只留 info 以上）。日志是线上排障的眼睛——"出了问题只有日志能告诉你当时发生了什么"。

## 13.5 HTTP 与 REST：后端的世界语

浏览器/手机 App 与服务器对话的协议是 **HTTP**：客户端发**请求**（方法 + 路径 + 数据），服务器回**响应**（状态码 + 数据）。

| 方法   | 语义 | 例           |
| ------ | ---- | ------------ |
| GET    | 查   | 获取学生列表 |
| POST   | 增   | 新建学生     |
| PUT    | 改   | 更新学生     |
| DELETE | 删   | 删除学生     |

**REST 风格**：用 URL 表示资源（名词），用 HTTP 方法表示动作：

```
GET    /students        全部学生
GET    /students/1      学号为 1 的学生
POST   /students        新增（请求体带 JSON）
DELETE /students/1      删除学号为 1 的
```

常用状态码：200 成功、201 已创建、400 请求有误、404 没找到、500 服务器内部错误。数据格式通用 **JSON**：`{"name": "张三", "score": 90}`。

### Spring 的核心思想：IoC 与 DI（一分钟直觉）

写代码时我们自然地 `new StudentStore()`——但每个类都自己 new 自己的依赖，改实现就要改一片（第 7 章"依赖实现"的痛点）。Spring 的解法一句话：

> **对象的创建和组装交给框架（IoC 容器），你只声明"我需要什么"，框架把做好的递给你（依赖注入，DI）。**

```java
@RestController
class StudentController {
    private final StudentService service;

    public StudentController(StudentService service) {   // 框架自动传入实现 —— DI
        this.service = service;
    }
}
```

你从不 new Controller/Service，Spring 启动时全部造好、互相接好线（像工厂流水线装配整机）。价值正是第 7 章守则的机制化：**依赖接口 + 框架换装**——今天注入内存实现，明天换成数据库实现，Controller 一行不改。"控制反转"就是"new 的权力从我手里反转到框架手里"。理解这一段，Spring 就不再神秘：剩下的全是注解驱动的各种自动化。

## 13.6 Spring Boot：二十分钟一个后端服务

Spring 是 Java 后端事实标准；**Spring Boot** 把配置削到接近零，"开箱即用"。

**创建项目**：去 <https://start.spring.io>（IDEA 内同款）——Maven、Java 21、Jar；依赖只勾 **Spring Web**；生成下载，IDEA 打开。目录里关键文件：`pom.xml`（多了 spring-boot-starter-web）、`src/main/resources/application.yml`（配置）、启动类。

**写接口**（一个文件搞定最小服务）：

```java
// src/main/java/com/example/student/StudentApi.java
package com.example.student;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@SpringBootApplication
public class StudentApi {
    public static void main(String[] args) {
        SpringApplication.run(StudentApi.class, args);
    }
}

// ---------- 数据层（教学简化：内存存储，重启即失；生产换数据库） ----------
record Student(Integer id, String name, int score) { }

class StudentStore {
    private final Map<Integer, Student> db = new ConcurrentHashMap<>();
    private final AtomicInteger idGen = new AtomicInteger(0);

    Student add(String name, int score) {
        int id = idGen.incrementAndGet();
        Student s = new Student(id, name, score);
        db.put(id, s);
        return s;
    }
    List<Student> all() { return List.copyOf(db.values()); }
    Student get(int id) { return db.get(id); }
    Student update(int id, String name, int score) {
        Student s = new Student(id, name, score);
        db.replace(id, s);                    // replace：键不存在时不动
        return db.get(id);
    }
    boolean delete(int id) { return db.remove(id) != null; }
}

// ---------- 接口层 ----------
@RestController
@RequestMapping("/students")
class StudentController {
    private final StudentStore store = new StudentStore();

    @GetMapping
    List<Student> all() {
        return store.all();
    }

    @GetMapping("/{id}")
    Student one(@PathVariable int id) {
        Student s = store.get(id);
        if (s == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "没有这个学生");
        return s;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)                   // 返回 201
    Student create(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        int score = (Integer) body.get("score");
        if (name == null || name.isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "name 必填");
        if (score < 0 || score > 100)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "score 需在 0~100");
        return store.add(name, score);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)                // 204
    void delete(@PathVariable int id) {
        if (!store.delete(id))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
}
```

（教学把三层写在一个文件里；真实项目按 `controller/service/repository` 分包。）

**运行**：IDEA 点启动类绿三角，或 `mvn spring-boot:run`。控制台出现 Spring logo 和 `Tomcat started on port 8080` 即成功。

**测试接口**（新开命令行）：

```
curl -X POST http://localhost:8080/students -H "Content-Type: application/json" -d "{\"name\":\"张三\",\"score\":90}"

curl http://localhost:8080/students

curl http://localhost:8080/students/1

curl -X DELETE http://localhost:8080/students/1
```

返回的 JSON 长这样：`{"id":1,"name":"张三","score":90}`。没有 curl 可用 IDEA HTTP Client / Postman / 浏览器（GET 直接访问）。

**发生了什么**：Tomcat（内嵌服务器）监听 8080 收 HTTP 请求 → Spring 根据注解路由（`@GetMapping` = "GET /students 归我"）→ 调你的方法 → 返回值自动转 JSON。`record Student` 直接当响应体（第 7 章的 record 在真实工程的第一场演出）。第 7 章"面向接口编程 + 依赖注入"在 Spring 里的形态：`StudentStore` 通常声明为接口、由 Spring 创建单例注入 Controller——思想完全一致，机制化而已。

### application.yml 与打包运行

**配置文件** `src/main/resources/application.yml`（或 .properties）让"参数改文件不动代码"：

```yaml
server:
  port: 8081                # 改端口，重启生效

spring:
  application:
    name: student-api
```

代码里读取配置的姿势（@Value 注入）：

```java
@RestController
class ConfigController {
    @Value("${server.port:8080}")        // 冒号后是缺省值
    private String port;

    @GetMapping("/port")
    String port() { return "当前端口 " + port; }
}
```

**打包部署**：`mvn package` 产出 `target/student-api-1.0-SNAPSHOT.jar`（内嵌 Tomcat 的"胖 jar"），拷到任何有 JDK 的机器：

```
java -jar student-api-1.0-SNAPSHOT.jar
```

一条命令，服务就起来了——这就是"一次编写、到处运行"在第 1 章承诺的兑现时刻。生产环境再配 `nohup`/`systemd`（Linux 常驻）、`-Xmx` 限内存（第 12 章），一个朴素但真实的部署链就通了。

### 三层架构与项目分包

教学代码挤一个文件，真实项目按**职责分层**拆包——这是 Java 后端千篇一律又异常有效的组织法：

```
com.example.student/
├── controller/     ← 接口层：收 HTTP 请求、校验参数、返回响应（不写业务）
│   └── StudentController.java
├── service/        ← 业务层：真正的业务规则、事务边界（系统的“大脑”）
│   ├── StudentService.java          （接口）
│   └── impl/StudentServiceImpl.java （实现）
├── repository/     ← 数据层：只管“怎么存取”（内存/数据库/缓存）
│   └── StudentRepository.java
└── model/          ← 数据结构：record / 实体类
    └── Student.java
```

一次"查学生"的完整旅程：

```
HTTP 请求 → Controller（接单登记）
              → Service（校验+业务规则，如“查不到抛 404”）
                  → Repository（只管取数）
              ← 组装业务结果
          ← 转 JSON 响应
```

分层的价值：**每层只操一份心**（改数据库不动接口层）、可测试（Service 可以脱离 HTTP 单测，第 13.3 节的用武之地）、新人心智负担小（改哪层去哪层）。这套 Controller/Service/Dao 的分层语法定了江湖规矩，几乎所有 Java 项目都长这样——**学会一个，看懂一片**。

### 接口测试速成：curl 与 IDEA HTTP Client

写完接口必须亲手测一遍，两个工具够用一辈子：

**curl**（命令行，Windows 10+ 自带）：

```
curl http://localhost:8081/students                          # GET
curl -X POST http://localhost:8081/students ^
     -H "Content-Type: application/json" ^
     -d "{\"name\":\"李四\",\"score\":88}"                    # POST（CMD 用 ^ 续行；Git Bash 用 \）
curl -X DELETE http://localhost:8081/students/2              # DELETE
curl -i http://localhost:8081/students/999                   # -i 显示状态码（应见 404）
```

**IDEA HTTP Client**（图形化更省心）：项目里新建 `api.http` 文件：

```
### 查全部
GET http://localhost:8081/students

### 新增
POST http://localhost:8081/students
Content-Type: application/json

{"name": "王五", "score": 77}
```

每个 `###` 块旁边会出现绿色运行箭头，点击即发请求，响应直接显示在旁边——还能把请求提交进 Git，团队共享接口用例。测试习惯的最低标准：**每个接口至少跑一遍正例（200/201）和反例（400/404）**，别等前端来告诉你接口是坏的。

## 13.7 扩展路线（按这个顺序完善它）

1. 拆分三层包结构，`StudentService` 封装业务逻辑，Controller 变薄；
2. 用 `ConcurrentHashMap` → 接数据库（Spring Data JPA + H2/MySQL，加实体与 Repository）；
3. 参数校验换 `spring-boot-starter-validation`（`@Valid` + 注解）；
4. 补 JUnit 测试：给 Service 写单元测试（本第 13.3 节套路）；
5. 统一异常处理 `@RestControllerAdvice`，错误返回规范 JSON；
6. 看懂 `application.yml`：改端口 `server.port: 8081`、配数据源。

## 13.8 小结

- Maven 管依赖与构建：坐标（groupId/artifactId/version）+ pom.xml + mvn 命令；
- JUnit 5 三段式测试 + assertThrows，`mvn test` 回归；
- 日志用 SLF4J，占位符 `{}`，分级别；别再用 println 调试生产代码；
- HTTP：方法表语义（GET 查/POST 增/PUT 改/DELETE 删），URL 表资源，JSON 表数据；
- Spring Boot 注解路由 + 自动 JSON + 内嵌 Tomcat；record 直接当 DTO。

## 练习 13

1.（概念）`<scope>test</scope>` 的依赖，打进最终 jar 吗？为什么 JUnit 要这么配？
2.（概念）POST /students 与 GET /students/1 分别对应 CRUD 的什么操作？各自典型的成功状态码？
3.（编程）给 StudentApi 加"改成绩"接口：`PUT /students/{id}`，请求体 `{"name":...,"score":...}`，键不存在返回 404。
4.（编程）给 `StudentStore` 写 JUnit 测试：add 后 all().size() 加一；delete 不存在的 id 返回 false；update 前先 add。
5.（概念）把 `StudentStore` 声明为接口、`MemoryStudentStore` 做实现，好处是什么？这呼应了第 7 章哪条守则？

## 参考答案

**1.** 不会。test 作用域只在编译和运行**测试**时可见，不参与打包——JUnit 是开发工具不是运行时功能，塞进生产包纯属浪费体积。

**2.** POST = 增，成功 201 Created；GET 单个 = 查，成功 200（不存在 404）。GET 列表 200。

**3.**

```java
@PutMapping("/{id}")
Student update(@PathVariable int id, @RequestBody Map<String, Object> body) {
    String name = (String) body.get("name");
    int score = (Integer) body.get("score");
    Student updated = store.update(id, name, score);
    if (updated == null)
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "没有这个学生");
    return updated;
}
```

（注意 `update` 方法里 `db.replace` 键不存在时不动、返回 `db.get(id)` 为 null，正好用它判 404。）

**4.**

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class StudentStoreTest {
    private final StudentStore store = new StudentStore();

    @Test
    void addShouldGrowList() {
        store.add("张三", 90);
        assertEquals(1, store.all().size());
        store.add("李四", 66);
        assertEquals(2, store.all().size());
    }

    @Test
    void deleteMissingIdShouldFail() {
        assertFalse(store.delete(999));
    }

    @Test
    void updateShouldReplaceExisting() {
        Student s = store.add("王五", 50);
        Student u = store.update(s.id(), "王五", 100);
        assertEquals(100, u.score());
    }
}
```

**5.** 调用方依赖"能力合同"而非具体实现；换数据库实现（Memory→MySQL）时 Controller 一行不改。呼应第 7 章"面向接口编程 / 依赖抽象而非实现"——Spring 的依赖注入把它机制化了。

**[▲ 返回目录](#toc)**

---

<a id="appendix"></a>

# 附录：排错手册 · 速查表 · 进阶路线

> 遇到报错先来这里查。三部分：A. 编译期/运行期常见报错对照与 NPE 排查法；B. 速查表；C. 进阶路线与书单。

---

## A.1 编译期错误对照

| 报错信息（典型）                                 | 中文含义                   | 最常见原因                                                  |
| ------------------------------------------------ | -------------------------- | ----------------------------------------------------------- |
| `找不到符号` (cannot find symbol)                | 用了未声明的名字           | 拼写错误、忘 import、变量作用域外使用                       |
| `需要';'` / `需要进行 xxx 转换` 等               | 语句格式不对               | 漏分号、中文标点、括号不配对                                |
| `类 X 是公共的, 应在名称为 X.java 的文件中声明`  | 文件名与 public 类名不一致 | 大小写也要完全一致                                          |
| `找不到或无法加载主类 X`                         | 运行时定位不到类           | `java X.class`（多了 .class）、目录不对、在包里没带全名执行 |
| `不兼容的类型: xxx 无法转换为 yyy`               | 类型不匹配                 | int 塞 String、double 塞 int（要强转）、父类转子类没强转    |
| `已捕获到异常异常 XxxException` / `未报告的异常` | checked 异常没处理         | try/catch 或方法加 throws                                   |
| `无法从静态上下文中引用非静态 变量/方法 x`       | static 方法里摸实例成员    | main 里调非 static 成员：先 new 对象                        |
| `xxx 不是语句`                                   | 语法结构崩了               | 上一行的错误传染（先修第一条错误）                          |
| `可能尚未初始化变量 x`                           | 局部变量没初值就用         | 声明时给初值                                                |
| `对 x 的引用不明确`                              | 重载版本分不清             | 参数传 null 或类型两可时强转指定                            |

## A.2 运行期异常速查

| 异常                                | 意思             | 一线原因                                             | 修法方向                                      |
| ----------------------------------- | ---------------- | ---------------------------------------------------- | --------------------------------------------- |
| `NullPointerException`              | 解引用 null      | 该 new 的没 new、方法返回 null 直接用、自动拆箱 null | 判空/Optional/Objects.requireNonNull 快速失败 |
| `ArrayIndexOutOfBoundsException`    | 数组越界         | `i <= length`（差一）、下标算错                      | 循环 `< length`；打印下标对照                 |
| `IndexOutOfBoundsException`（list） | 集合越界         | get(越界)/空列表取 0                                 | isEmpty 判断                                  |
| `ClassCastException`                | 强转错型         | 向下转型没 instanceof                                | 模式匹配 `if (x instanceof T t)`              |
| `NumberFormatException`             | 字符串转数字失败 | `Integer.parseInt("abc")`                            | 先校验/try-catch 给默认值                     |
| `ConcurrentModificationException`   | 遍历中改集合     | for-each 里 remove                                   | `removeIf` 或迭代器删                         |
| `ArithmeticException: / by zero`    | 整数除零         | 除数没判（注意：double 除 0 不抛，得 Infinity）      | 除前判零                                      |
| `StackOverflowError`                | 栈溢出           | 无出口递归、超大局部数组                             | 加出口/改循环/调 -Xss                         |
| `OutOfMemoryError: Java heap space` | 堆满             | 集合只进不出、大文件全量读入                         | 见第 12 章三宗罪与排查法                      |

### NPE 三分钟排查法

Java 的"段错误"。看堆栈第一行 `at 包.类.方法(文件:行号)`，跳到那一行，找 `.` 调用链上的每个引用变量，问：**它此刻可能是 null 吗？** 八成是：方法返回 null 没接住、Map.get 没找到、字段没初始化。防御顺序：`Objects.requireNonNull` 契约式拦截 → `if (x != null)` 判空 → `Optional` 封装 → 返回空集合而非 null（`Collections.emptyList()`）。

## A.3 求助的艺术

1. 目标一句话；2. **完整报错与堆栈**原样复制；3. **最小可复现示例**（删到"再删一行就不报"为止，通常 10~20 行，复制粘贴即可复现）；4. 已尝试过什么；5. 环境（JDK 版本、IDE/命令行）。删代码找最小复现的过程有一半概率自己发现 bug——这叫二分调试。

### 面试八股地图（按本教程章节对照）

校招/社招 Java 面试的高频板块，与本教程的对应关系——学完就能开始系统复习：

| 板块   | 核心问题                                                     | 本教程出处    |
| ------ | ------------------------------------------------------------ | ------------- |
| 集合   | HashMap 底层/扩容/树化？ArrayList vs LinkedList？fail-fast？ | 第 9 章       |
| 并发   | synchronized 原理？volatile 可见性？线程池参数与拒绝策略？CAS？ | 第 11 章      |
| JVM    | 内存区域？GC 算法与收集器？类加载双亲委派？OOM 排查？        | 第 12 章      |
| 语言   | == 与 equals/hashCode？String 不可变/池？重载 vs 重写？值传递？ | 第 6、8、4 章 |
| 异常   | checked vs unchecked？try-with-resources？                   | 第 10 章      |
| 新特性 | record/密封类/虚拟线程 各解决什么问题？                      | 第 7、11 章   |

提醒：八股是"对已有理解的压缩记忆"，先有画面再背结论；本教程每章的内存图/实验就是画面来源。

## B.1 速查表

**printf 占位符**：`%d` 整数、`%f` 小数（`%.2f`）、`%s` 字符串、`%c` 字符、`%b` 布尔、`%n` 换行、`%%` 百分号。

**String 高频**：`length charAt indexOf substring(a,b) contains startsWith endsWith equals equalsIgnoreCase compareTo toUpperCase toLowerCase trim/strip split replace isEmpty isBlank chars repeat`。

**集合高频**：`add get set remove size contains isEmpty indexOf sort`（List）；`add contains remove`（Set）；`put get getOrDefault containsKey remove keySet values entrySet merge computeIfAbsent putIfAbsent`（Map）；`Collections.sort/reverse/shuffle/max`。

**Stream 三段式**：`stream()` → `filter map mapToInt sorted distinct limit skip peek` → `collect(toList()/joining()/groupingBy()/counting()/averagingInt())` 或 `forEach count sum average max min findFirst anyMatch allMatch`。

**Scanner 输入**：`nextInt nextDouble nextLine`；数字后接 nextLine 先吃回车；健壮方案 `Integer.parseInt(sc.nextLine().trim())`。

**JVM 参数**：`-Xms/-Xmx` 堆、`-Xss` 栈、`-XX:+HeapDumpOnOutOfMemoryError`、`-XX:+UseG1GC`；工具 `jps jmap jstack VisualVM`。

## C. 进阶路线

**第一步：补全 Java SE**。枚举进阶、注解与反射、IO 流全貌（InputStream/Reader 体系）、网络编程 Socket、泛型进阶（通配符 PECS）。书：《Java 核心技术·卷I》通读。

**第二步：数据库与 Web 基础**。SQL 熟练（增删改查 + 联表 + 索引概念）；JDBC → MyBatis；HTTP/JSON 深入；把第 13 章项目接上 MySQL。

**第三步：Spring 生态**。Spring Boot 全家桶：Spring MVC → Spring Data JPA/MyBatis-Plus → Spring Security（认证授权）→ Redis 缓存 → 消息队列初识。做一个带登录、分页、文件上传的完整项目部署到服务器（Linux + 打 jar 跑起来）。

**第四步：深入与面试**。并发编程（JUC：锁、线程池参数、并发容器）、《深入理解 Java 虚拟机》（周志明）啃完、MySQL 索引与事务、Redis 数据结构、分布式入门。书：《Effective Java》（写地道 Java 的圣经）、《Java 并发编程实战》。

**分方向**：后端微服务（Spring Cloud）、大数据（Flink/Spark，Java/Scala）、Android（Kotlin 优先但 Java 底子照样吃）、或转 Go。

### 三个月学习时间表（供参考）

| 阶段    | 时间      | 任务                                | 产出检验                                                |
| ------- | --------- | ----------------------------------- | ------------------------------------------------------- |
| 第 1 月 | 第 1~2 周 | 本教程第 1~7 章：语法 + OOP 三部曲  | 每章练习全对；能独立设计 3 个类的迷你系统（如图书借阅） |
|         | 第 3~4 周 | 第 8~10 章：常用 API、集合、异常 IO | 词频统计器 + 记事本（文件版）跑通                       |
| 第 2 月 | 第 1~2 周 | 第 11~12 章：Stream、多线程、JVM    | 并发下载器；看懂 javap 输出                             |
|         | 第 3~4 周 | 第 13 章 + SQL 基础                 | 学生 REST API 接上 MySQL，部署到一台 Linux              |
| 第 3 月 | 全月      | 完整项目 + 八股复习 + 简历          | 一个能拿得出手的项目（带登录/分页/部署），刷面经补底层  |

节奏因人而异，但"**每阶段有产出**"这条别打折——知识没变成能运行的东西，一周后就还回去了。

**三个持续习惯**：

1. 读源码：从 JDK 集合类开始（ArrayList/HashMap 源码短小精悍），再到 Spring Boot 的自动配置；
2. 用工具：IDEA 调试器（断点/条件断点/watch）替代 println；Postman/HTTP Client 测接口；Git 管版本（另一门必修小课）；
3. 做项目：给第 13 章的 API 加数据库、登录、部署——**真实项目踩的坑，是最快的老师**。

**书单速记**：《Java 核心技术·卷I》（入门完备）→ 《Effective Java》（进阶必读）→ 《深入理解 Java 虚拟机》（底层）→ 《Java 并发编程实战》（并发）→ 《Spring 实战》（框架）。

最后一句：Java 的世界庞大，但**语言本身只是入场券**——类型系统、集合、并发、JVM 这四块硬功底（本教程第 5~12 章的骨架）才是走到哪儿都值钱的东西。

**[▲ 返回目录](#toc)**

---

（完 · Happy Coding）