# Tools

23 个浏览器端开发者工具，零数据上送。

技术栈：**Vite + React 19 + TypeScript + Tailwind CSS + react-router-dom + i18next + cmdk + vite-plugin-pwa**。

## 快速开始

```bash
pnpm install
pnpm dev          # 开发模式 (http://localhost:5173)
pnpm test         # 运行 Vitest 单测
pnpm build        # 类型检查 + 生产构建
pnpm preview      # 预览构建产物（含 Service Worker）
```

## 工具清单（23 个）

| 分类 | 工具 |
|---|---|
| Security (3) | Base64 编/解码、密码强度评估、URL 编/解码 |
| Image (3) | 二维码生成、Favicon 多尺寸生成、图像格式转换 (PNG/JPG/WebP) |
| Format (4) | JSON 格式化/校验、JSON ↔ YAML/XML/TOML/CSV 互转、JSON Diff、JSON → Go Struct |
| Text (7) | 大小写转换、正则测试器、Crontab 生成器、颜色转换 (HEX/RGB/HSL/HSV)、文本统计、日期时间转换、cURL 构建器 |
| Cheatsheet (6) | Git、SSH、Vim、HTTP 状态码、SQL、tar |

## 功能特性

- 中英双语切换（i18next + 浏览器语言检测，本地持久化）
- 明 / 暗 / 跟随系统三种主题
- ⌘K / Ctrl+K 命令面板（cmdk）跨工具搜索
- PWA：可安装、可离线
- 路由级代码分割：每个工具单独 chunk，首页只加载元数据

## 目录

```
src/
  components/      # 复用组件（Layout / UI / CommandPalette / ToolCard ...）
  i18n/            # i18next 配置 + zh/en 语言包
  lib/             # 通用工具：cn / theme / copy / useTheme / useDocumentTitle / useUrlState
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
- `pnpm build` — 无类型错误，按工具 lazy 拆 chunk
- `pnpm preview` — DevTools → Application 面板可看到 service worker，断网后页面仍能访问
- 首页：5 大类卡片，23 个工具
- 切主题、切语言：刷新后保持
- ⌘K：搜 `json` / `git` / `base64` 应能命中
