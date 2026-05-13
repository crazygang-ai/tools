# Tools

浏览器端开发者工具集，零数据上送。

技术栈：**Vite + React 19 + TypeScript + Tailwind CSS + react-router-dom + i18next + cmdk + vite-plugin-pwa**。

## 快速开始

```bash
pnpm install
pnpm dev          # 开发模式 (http://localhost:5173)
pnpm test         # 运行 Vitest 单测
pnpm test:watch   # 监听模式
pnpm lint         # ESLint 检查（flat config）
pnpm format       # Prettier 格式化 src/**
pnpm build        # 类型检查 + 生产构建
pnpm preview      # 预览构建产物（含 Service Worker）
```

## 工具清单

| 分类 | 工具 |
|---|---|
| Security (3) | Base64 编/解码、密码强度评估、URL 编/解码 |
| Image (4) | 二维码生成、Favicon 多尺寸生成、图像格式转换 (PNG/JPG/WebP)、代码截图（语法高亮 + 主题/字体/背景，导出 PNG / 复制到剪贴板） |
| Format (4) | JSON 格式化/校验、JSON ↔ YAML/XML/TOML/CSV 互转、JSON Diff、JSON → Go Struct |
| Text (8) | 大小写转换、正则测试器、Crontab 生成器、颜色转换 (HEX/RGB/HSL/HSV)、文本统计、日期时间转换、cURL 构建器、ASCII Art (figlet) |
| Cheatsheet (6) | Git、SSH、Vim、HTTP 状态码、SQL、tar |

## 功能特性

- 中英双语切换（i18next + 浏览器语言检测，本地持久化）
- 明 / 暗 / 跟随系统三种主题
- ⌘K / Ctrl+K 命令面板（cmdk）跨工具搜索
- PWA：可安装、可离线
- 路由级代码分割：每个工具单独 chunk，首页只加载元数据
- 工具状态持久化：`useLocalState` 把每个工具的输入/选项存进 `localStorage`，刷新即恢复（**不通过 URL 携带**——保证敏感内容不泄露到历史/分享链接）

## 目录

```
src/
  components/      # 复用组件（Layout / UI / CommandPalette / ToolCard ...）
  i18n/            # i18next 配置 + zh/en 语言包
  lib/             # 通用工具：cn / theme / copy / useLocalState / useTheme / useDocumentTitle
  pages/           # Home / CategoryPage / ToolDetailPage / NotFound
  tools/
    registry.ts    # 工具元数据单一数据源
    categories.ts  # 5 大分类常量
    security/ image/ format/ text/ cheatsheet/  # 各类工具实现
tests/tools/       # 纯函数 Vitest 单测
```

## 如何新增一个工具

1. 在 `src/tools/<分类>/` 下新建组件文件，如 `MyTool.tsx`，并写一个对应的 `.lib.ts` 放纯函数（便于单测）。
2. 在 `src/tools/registry.ts` 中：
   - `import` 一个 `lazy(() => import('@/tools/<分类>/MyTool'))`
   - 把对应那条元数据补上 `component: MyTool` 字段（若该 slug 尚未注册，则新增一条）。
3. 在 `src/i18n/locales/{zh,en}/tools.json` 添加 `<slug>.title / desc / ...`。
4. 在 `tests/tools/` 加一个 `*.test.ts`。

跑 `pnpm dev`，访问 `/tools/<slug>` 即可看到新工具。

## 验证清单

- `pnpm test` — 全部用例通过
- `pnpm lint` — 无 ESLint 报错
- `pnpm build` — 无类型错误，按工具 lazy 拆 chunk
- `pnpm preview` — DevTools → Application 面板可看到 service worker，断网后页面仍能访问
- 首页：5 大类分类卡片
- 切主题、切语言：刷新后保持
- ⌘K：搜 `json` / `git` / `base64` 应能命中

## License

GNU General Public License v3.0 — 详见 [LICENSE](./LICENSE)。

```
Copyright (C) 2026 crazygang-ai

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
```

GPL-3.0 是传染型 copyleft 协议：任何基于本仓库的衍生作品在分发时必须以同样的协议开源。商用前请确认你了解 GPL 的具体条款。
