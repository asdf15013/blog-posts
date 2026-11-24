# 服务器备份（2026-11-24）

云服务器重置前的完整数据备份。恢复步骤见 restore.sh。

## 内容
- blog/ — 博客完整源码 + 构建产物（Vue 前端 + Node 服务）
- resources/ — 图片库(50张)/资料文件/歌单/点赞数/友链/公告 数据与文件
- systemd/ — 两个服务单元
- openresty/ — yanqi-blog.vip 虚拟主机配置

## 不包含（重置后需重新生成）
- resources/config.json 中的资料令牌（恢复脚本会生成新的）
- SSL 证书（重置后重新签发即可，acme 自动化）
- 日志
