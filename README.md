# Tools

浏览器端开发者工具集，不上传任何数据。

技术栈：**Vite + React 19 + TypeScript + Tailwind CSS + react-router-dom + i18next + cmdk + vite-plugin-pwa**。

## 快速开始

> 在你的电脑上把项目跑起来，5 步搞定。

### 1. 装好两样东西

| 工具 | 版本要求 | 装法 |
|---|---|---|
| **Node.js** | ≥ 20 | 去 [nodejs.org](https://nodejs.org/) 下 LTS 安装包；或者 macOS 用 Homebrew：`brew install node` |
| **pnpm** | ≥ 8 | Node 装完后跑 `npm install -g pnpm`（一次就够，全局安装） |

确认装好：

```bash
node -v     # 应输出 v20.x.x 或更新
pnpm -v     # 应输出 8.x.x 或更新
```

> **为什么用 pnpm 而不是 npm/yarn？** 项目用 `pnpm-lock.yaml` 锁定依赖版本，用其他包管理器装会得到不同的依赖树，可能跑不起来。

### 2. 把代码 clone 下来

```bash
git clone https://github.com/crazygang-ai/tools.git
cd tools
```

> 用 SSH 的话：`git clone git@github.com:crazygang-ai/tools.git`

### 3. 安装依赖

```bash
pnpm install
```

第一次会下载约 200MB 的 `node_modules`，**预计 1–3 分钟**（看网速）。完成后多一个 `node_modules/` 目录，这是正常的，已经在 `.gitignore` 里。

> **如果 pnpm install 卡在某个 registry 下载** —— 国内网络可以临时换镜像：
> ```bash
> pnpm install --registry=https://registry.npmmirror.com
> ```

### 4. 启动开发服务器

```bash
pnpm dev
```

终端应该输出类似：

```
  VITE v8.0.12  ready in 320 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

**打开浏览器访问 [http://localhost:5173](http://localhost:5173)** —— 看到首页 5 个分类卡片就成功了。

之后改代码会**自动热刷新**，不用重启。退出按 `Ctrl+C`。

### 5. 跑测试 / 构建（可选）

```bash
pnpm test         # 跑一次 Vitest 单测，CI 模式
pnpm test:watch   # 监听模式，保存即重跑
pnpm lint         # ESLint 检查（flat config）
pnpm format       # Prettier 自动格式化 src/**
pnpm build        # 类型检查 + 生产构建到 dist/
pnpm preview      # 本地预览生产构建（这是验证 PWA / Service Worker 的唯一方式，dev 模式下 SW 是禁用的）
```

### 常见问题

- **`EADDRINUSE: address already in use 5173`** — 5173 端口被占了。换端口：`pnpm dev --port 5174`，或先杀掉占用进程：`lsof -i :5173` 找到 PID 后 `kill -9 <PID>`。
- **`Cannot find module '...'`** — 依赖没装全。删掉 `node_modules` 和 `pnpm-lock.yaml`、重新 `pnpm install`。
- **改了代码浏览器没刷新** — Vite HMR 偶尔抽风，硬刷一下（`Cmd+Shift+R` / `Ctrl+Shift+R`）；或重启 `pnpm dev`。
- **`pnpm: command not found`** — pnpm 没装好或 `$PATH` 没收进来。重开终端，或确认 `npm install -g pnpm` 跑过。

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
