---
title: Vue 3 组合式 API 入门笔记
date: 2026-11-10
category: 技术
tags: [Vue, 前端, JavaScript]
summary: 从选项式到组合式：setup、ref、computed、watch 与组合函数，一篇梳理清楚组合式 API 的核心概念。
---

从 Vue 2 转到 Vue 3，最大的变化就是组合式 API（Composition API）。这篇笔记梳理一下核心概念。

## 为什么需要组合式 API

选项式 API（Options API）把代码按 `data`、`methods`、`computed` 切开，**同一个功能逻辑散落在各处**。组件一大，改一个功能要上下反复横跳。

组合式 API 让同一功能的代码聚合在一起，还能抽成可复用的组合函数。

## setup 与响应式基础

`<script setup>` 是最简洁的写法：

```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const double = computed(() => count.value * 2)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">{{ count }} × 2 = {{ double }}</button>
</template>
```

几个要点：

- `ref` 包装基本类型，取值要 `.value`，模板里自动解包
- `reactive` 适合对象，但不能整体替换，解构会丢失响应性
- `computed` 有缓存，依赖不变就不重算

## watch 与 watchEffect

```js
// 明确指定监听源
watch(count, (newVal, oldVal) => {
  console.log(`${oldVal} -> ${newVal}`)
})

// 自动收集依赖，立即执行一次
watchEffect(() => {
  console.log(`count is ${count.value}`)
})
```

## 组合函数：复用的正确姿势

把逻辑抽成 `useXxx` 函数，这是组合式 API 最迷人的部分：

```js
// useMouse.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  const update = (e) => {
    x.value = e.pageX
    y.value = e.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}
```

本站的暗色模式切换就是用组合函数实现的，一个 `useTheme()` 搞定主题读取、切换与持久化。

## 小结

> 组合式 API 不是取代选项式，而是给了大型组件更好的组织方式。

小项目用选项式完全没问题；当逻辑开始缠绕时，组合式 API 会还你一片清爽。
