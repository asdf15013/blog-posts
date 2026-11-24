---
title: 从零搭一台趁手的开发机
date: 2025-12-20
category: 技术
tags: [Linux, 工具, 环境配置]
summary: 换了新工作机，把环境配置流程完整走了一遍：终端、Shell、编辑器与常用工具链，留档备用。
---

换了台新机器，把搭环境的流程完整记录一份，下次照抄。

## 基础三件套

```bash
# 基础工具
sudo apt update && sudo apt install -y git curl wget build-essential

# Node 版本管理不用 nvm，改用更轻的 fnm
curl -fsSL https://fnm.vercel.app/install | bash
fnm install --lts
```

## 终端与 Shell

终端是一天盯八小时的东西，值得认真调：

- **Shell**：zsh + 历史建议插件
- **提示符**：Starship，一处配置处处生效
- **字体**：Nerd Font 是图标显示的前提

```toml
# ~/.config/starship.toml
[directory]
truncation_length = 3
truncate_to_repo = true

[git_status]
ahead = "⇡${count}"
behind = "⇣${count}"
```

## 编辑器

VS Code 的设置同步开起来，插件清单用 Settings Sync 管着，核心就这几个：

| 插件 | 用途 |
| --- | --- |
| Vue (Official) | Vue 3 开发必备 |
| Error Lens | 行内错误，省去悬停 |
| GitLens | blame 一眼看清谁写的 |

## 那些相见恨晚的小工具

- `zoxide`：智能 cd，`z blog` 直达项目目录
- `fzf`：历史命令模糊搜索，`Ctrl+R` 焕然新生
- `lazygit`：终端里的 Git 神器

## 最后

环境配置的原则只有一条：

> 每次重复超过两遍的操作，都值得被脚本化。

我把这些步骤写成了 `setup.sh` 放在 dotfiles 仓库里，下次新机器十分钟搞定。
