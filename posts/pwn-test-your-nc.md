---
title: PWN入门 Test_your_nc
date: 2026-11-18
category: CTF
tags: [CTF, CTFSHOW, PWN]
---

# PWN0

提示连上就有flag直接连靶场

<!-- 这是一张图片，ocr 内容为： -->
![](/api/res/download/d57716c7db0d)

获取flag

<!-- 这是一张图片，ocr 内容为： -->
![](/api/res/download/03f35f3101ff)

# PWN1

可以看到是64位程序，关闭canary保护

<!-- 这是一张图片，ocr 内容为： -->
![](/api/res/download/8b68851b2d27)

接着进入ida分析文件可以看到程序直接执行了后面函数

<!-- 这是一张图片，ocr 内容为： -->
![](/api/res/download/068128dfd740)

所以连上就可以获得flag

<!-- 这是一张图片，ocr 内容为： -->
![](/api/res/download/323f0df9388c)

# PWN2

分析程序发现是64位并且无canary保护

<!-- 这是一张图片，ocr 内容为： -->
![](/api/res/download/c0a1f26c4bd2)

在ida分析程序，发现连上就可以获得shell

<!-- 这是一张图片，ocr 内容为： -->
![](/api/res/download/ec99a442b393)

<!-- 这是一张图片，ocr 内容为： -->
![](/api/res/download/7f61973caebb)

# PWN3

64位程序开启canary保护

<!-- 这是一张图片，ocr 内容为： -->
![](/api/res/download/c9504acae771)

在ida发现有条件语句，我们连上靶场后可以通过控制输入来获取flag

<!-- 这是一张图片，ocr 内容为： -->
![](/api/res/download/1f8442918eda)<!-- 这是一张图片，ocr 内容为： -->
![](/api/res/download/27bce16f8a04)

# PWN4

题目要求我们输入一串神秘的字符串获取flag

发现64位程序并且保护全开

<!-- 这是一张图片，ocr 内容为： -->
![](/api/res/download/7ce991f5e096)

ida分析程序

<!-- 这是一张图片，ocr 内容为： -->
![](/api/res/download/0d9a17941ca0)

当s1=s2就可以获得shell从而来获取flag

<!-- 这是一张图片，ocr 内容为： -->
![](/api/res/download/b2ae3c902176)



