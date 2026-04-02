# Gotify Tauri 重构版

这个目录是新的桌面端实现，和旧的 Electron 代码完全隔离。后续开发、构建、发布都只围绕这个目录展开。

## 重构目标

- 使用 React + Tauri 重建桌面端
- 保留 Gotify 实时接收、历史消息、本地存储、托盘运行等核心能力
- 新增黑白双皮肤
- 新增按分组屏蔽弹窗提醒
- 保持展示版本号和 Git tag 发布版本一致

## 目录结构

- `src/`
  - `App.tsx`: 应用主界面与页面状态编排
  - `components/`: 纯界面组件
  - `lib/types.ts`: 前端类型与默认配置
  - `lib/theme.ts`: 黑白皮肤切换
  - `lib/gotify-client.ts`: WebSocket 客户端
  - `lib/desktop.ts`: Tauri 运行时桥接、托盘、通知、存储命令调用
- `src-tauri/`
  - `src/models.rs`: Rust 侧数据模型
  - `src/storage.rs`: 配置、历史消息、存储目录切换命令
  - `src/lib.rs`: Tauri 插件与命令注册
  - `tauri.conf.json`: Tauri 构建配置
- `README.md`: 当前说明文档
- `ARCHITECTURE.md`: 模块职责和数据流说明

## 当前功能

- Gotify WebSocket 实时连接与断线重连
- 消息历史本地持久化
- 收藏消息
- 托盘驻留、关闭到托盘、开机自启
- 自定义窗口内通知卡片
- 按分组屏蔽弹窗提醒
- Bark 分组转发
- 白色 / 黑色双皮肤
- 设置页显示版本号
- 支持切换本地存储目录

## 开发命令

```bash
npm install
npm run tauri:dev
```

## 打包命令

```bash
npm install
npm run tauri:build
```

## 发布规则

- GitHub Actions 已切换到 `tauri-app/` 目录构建
- tag 使用 `v1.2.3` 这种格式
- 流水线会把 tag 版本同步到 `tauri-app/package.json` 和 `tauri-app/src-tauri/Cargo.toml`
- 应用内展示版本号时统一显示为 `v + app.getVersion()`，保证和发布 tag 一致

## Windows 注意事项

- `npm run tauri:dev` 和 `npm run tauri:build` 已内置 `VsDevCmd` 环境注入。
- 如果仍出现 `kernel32.lib` 或 `link.exe` 相关错误，先确认安装了 `Visual Studio 2022 Build Tools` 的 C++ 工作负载。