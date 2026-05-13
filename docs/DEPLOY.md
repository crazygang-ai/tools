# 部署到你自己的 GitHub Pages

主仓库自动部署到 <https://crazygang-ai.github.io/tools/>。如果你 fork 了这个项目，想把它发布到自己账号下的 Pages，按下面的步骤改 4 个地方即可。

## 前置条件

- Fork 仓库到你自己的账号 / 组织
- 已经把 fork clone 到本地，能跑 `pnpm dev`

下文以你的仓库地址为 `https://github.com/<owner>/<repo>` 为例（fork 时仓库名可以自由改）。GitHub Pages 项目页地址会是 `https://<owner>.github.io/<repo>/`。

## 1. 修改 Vite `base`

`vite.config.ts` 里的 `base` 默认指向 `/tools/`（来自上游仓库名）。改成你的仓库名：

```ts
// vite.config.ts
const base = process.env.VITE_BASE ?? '/<repo>/';
```

如果你的仓库名就叫 `<owner>.github.io`（用户/组织主页），把 `base` 设为 `'/'`。

## 2. 修改 PWA manifest 中的 brand（可选）

`vite.config.ts` 的 `VitePWA(...)` → `manifest`：

```ts
manifest: {
  name: '你的产品名',
  short_name: '你的产品名',
  description: '...',
  // start_url 和 scope 自动跟随上面的 base，无需手改
  ...
}
```

## 3. 在 GitHub 启用 Pages 的 Actions Source

仓库主页 → **Settings** → **Pages** → **Build and deployment** → **Source** 下拉框选 **GitHub Actions**。

这一步必须在 GitHub UI 操作，CI 改不了。一次设置后 Pages 会接收 workflow 上传的产物。

## 4. 推送到 main

```bash
git add vite.config.ts
git commit -m "chore: configure deploy for <owner>/<repo>"
git push origin main
```

`.github/workflows/deploy.yml` 监听 `push: branches: [main]`，几十秒内即完成构建和发布。可以在仓库的 **Actions** 标签页看进度。

## 验证

部署完成后访问：

```
https://<owner>.github.io/<repo>/
```

| 项目 | 应观察到 |
|---|---|
| 首页加载 | 5 个分类卡片正常显示 |
| 进入任意工具，按 F5 刷新 | 不应该 404（GitHub Pages 把 `dist/404.html` 当成 SPA fallback） |
| DevTools → Application → Service Worker | `sw.js` 已激活 |
| DevTools → Application → Manifest | `start_url` / `scope` 是 `/<repo>/` |

## 自定义域名（可选）

GitHub Pages 支持把站点绑定到 `<your-domain>` 或 `tools.<your-domain>`。

1. 在你的 DNS 控制台为目标域名添加 CNAME 指向 `<owner>.github.io`（注意：不带 `/<repo>` 后缀，DNS 不识别路径）
2. 仓库 **Settings** → **Pages** → **Custom domain** 填入域名 → Save
3. GitHub 会在仓库根目录生成一个 `CNAME` 文件并自动签发 Let's Encrypt 证书
4. 把 `vite.config.ts` 的 `base` 改成 `'/'`（自定义域名指向站点根，不再是子路径）
5. 同步把 `BrowserRouter` 的 `basename` 行为留给 `import.meta.env.BASE_URL` 自动处理（无需改 `App.tsx`）
6. 推送，等 CI 跑完即生效

## 常见问题

**Q: 推送后 Actions 跑成功了，但页面 404 / 资源 404？**
A: 99% 是 `vite.config.ts` 的 `base` 没改。检查 `dist/index.html` 里资源 URL 是否带正确前缀。

**Q: 工具页面刷新 404？**
A: workflow 里有 `cp dist/index.html dist/404.html` 这一步，确认它没被你删掉。这是 GitHub Pages 静态托管下 SPA 路由刷新能正常工作的关键。

**Q: 我想把页面部署到 `gh-pages` 分支而不是 GitHub Actions Artifact？**
A: 老办法。本仓库用的是 GitHub 推荐的新方式（`actions/deploy-pages@v4`），无需 `gh-pages` 分支，权限更严格、回滚更干净。如果你坚持要用旧方式，需要重写 `.github/workflows/deploy.yml` —— 不在本文档覆盖范围内。

**Q: 本地 `pnpm dev` 时访问根路径正常，但部署后必须加 `/<repo>/` 前缀，能否统一？**
A: Vite 的 `base` 在 dev 模式下也会生效。设了 `/<repo>/` 后，`pnpm dev` 也得访问 `http://localhost:5173/<repo>/`。如果不想这样，在 dev 时用环境变量覆盖：

```bash
VITE_BASE=/ pnpm dev
```

或干脆在 shell 里 export 这个变量。
