# 下个对话接续上下文

本文档用于在关闭当前对话后，让新的 Codex 对话快速恢复项目上下文。

## 项目定位

Popink Market 是一个面向日本纹身行业从业者的 B2B 电商项目。项目始终以上线生产为目标推进，当前最低交付口径是 `staging / 测试环境` 可运行、可验证、可迁移；本地运行只用于开发和排错。

## 当前技术栈

- Medusa.js `2.14.0`
- Next.js `15.3.9`
- Node.js `22.22.2`
- npm `10.9.7`
- PostgreSQL `16-alpine`
- Redis `7-alpine`
- Docker Compose

## 当前关键目录

```text
AGENT.md
apps/backend
apps/storefront
deploy/cloudflare
deploy/nginx
deploy/systemd
docs/github-pages
docs/MILESTONES.md
docs/WORKFLOW.md
docs/LARK_SYNC.md
docs/DEPLOY_CLOUDFLARE_VPS.md
scripts/demo-proxy.mjs
scripts/local-dev.mjs
README.md
SPEC.md
```

## Git 状态提示

工作区不是干净状态。继续开发前先执行：

```powershell
git status --short
```

不要回滚用户已有改动。

## 当前已完成内容

- 本地 Medusa + Next.js 工作区已建立。
- PostgreSQL 和 Redis 已通过 Docker Compose 配置。
- 日本 `jp` 区域与 `JPY` 测试数据已可用。
- 前端首页、导航、footer 和多页静态内容已替换为 Popink Market 业务内容。
- 基础购买流程已跑通。
- Lark 同步脚本与 HTML 导入脚本已存在。
- 已补充部署骨架：
  - `deploy/cloudflare/config.yml.example`
  - `deploy/nginx/popink-market.conf`
  - `deploy/systemd/popink-backend.service`
  - `deploy/systemd/popink-storefront.service`
  - `deploy/systemd/popink-proxy.service`
  - `apps/backend/.env.production.example`
  - `apps/storefront/.env.production.example`
  - `docs/DEPLOY_CLOUDFLARE_VPS.md`
- 已新增 GitHub Pages 静态展示页：
  - `docs/github-pages/index.html`
  - `docs/github-pages/styles.css`
  - `docs/github-pages/assets/popink-preview.jpg`
  - `.github/workflows/deploy-github-pages.yml`

## 当前运行方式

本地开发验证：

```powershell
npm run db:up
npm run backend:dev
npm run storefront:dev
npm run demo:proxy
```

更接近测试环境和生产的入口：

```powershell
npm run build
npm run backend:start
npm run storefront:start
npm run proxy:start
npm run local:dev
```

GitHub Pages 静态展示页本地预览：

```powershell
npm run pages:preview
```

该预览只用于公开展示项目定位、页面跳转和内容结构，不连接 Medusa 后端、checkout、Admin、PostgreSQL 或 Redis。

`demo:proxy` 是历史命名的统一代理脚本，不代表项目定位是临时展示站。

## 当前地址与状态

```text
后端健康检查:  http://127.0.0.1:9000/health
Medusa Admin:   http://127.0.0.1:9000/app
前端开发入口:  http://127.0.0.1:8000/jp
统一访问入口:  http://127.0.0.1:8080/jp
```

正式域名和 VPS 部署完成前，允许使用 Cloudflare Quick Tunnel 临时地址作为过渡访问入口：

```text
前台统一入口: https://ash-voted-alarm-ipod.trycloudflare.com/
后台入口:     https://ash-voted-alarm-ipod.trycloudflare.com/app
健康检查:     https://ash-voted-alarm-ipod.trycloudflare.com/health
```

该地址来自 Cloudflare Quick Tunnel，重启后大概率变化。若地址变化，必须同步更新 `NEXT_PUBLIC_BASE_URL`、`serverActions.allowedOrigins`、Admin allowed hosts 和相关文档。

2026-05-05 已确认：

- `http://127.0.0.1:8080/jp` 返回 `200`
- 之前的 `500` 是因为前端仍在使用旧的 ngrok 环境变量和旧进程
- 修正 `apps/storefront/.env.local` 并重启 `storefront:dev` 与 `demo:proxy` 后已恢复正常

## 当前前端环境变量结论

`apps/storefront/.env.local` 用于本地开发验证时应保持统一入口模式：

```text
NEXT_PUBLIC_MEDUSA_BACKEND_URL=
MEDUSA_BACKEND_INTERNAL_URL=http://127.0.0.1:9000
NEXT_PUBLIC_BASE_URL=http://127.0.0.1:8080
```

含义：

- 浏览器侧走同源入口
- Next.js 服务端与 middleware 直连本机 Medusa

## 当前方向

- 当前主线是结构稳定、测试环境、支付物流和测试覆盖。
- 支付模块在结构稳定后立即推进，第一阶段接真实支付服务 sandbox。
- 物流模块在结构稳定后立即推进，第一阶段建立配送配置、运费规则、人工履约和 tracking 记录。
- 新增和修改功能必须同步补单元测试；测试不通过不交付。
- `npm run test` 已能实际执行 root scripts、backend 和 storefront 测试，不再是 0 task；当前测试覆盖 `demo-proxy` 路由、Lark Markdown 转换、后端 custom route、前台 env、金额格式化、地址比较、账号表单解析、checkout 地址 payload、支付 provider 查询和物流配送查询/计价。
- `apps/storefront/src/lib/data/cart.ts` 的 `setAddresses` 已修复为 `await getCartId()`，避免缺 cart 时错误判断失效。

## 文档与部署说明

- 测试环境与 VPS 扩展路径说明见：
  [DEPLOY_CLOUDFLARE_VPS.md](/C:/Users/JY/Documents/popink_market/docs/DEPLOY_CLOUDFLARE_VPS.md)
- Lark 同步说明见：
  [LARK_SYNC.md](/C:/Users/JY/Documents/popink_market/docs/LARK_SYNC.md)

## 已知注意事项

- PowerShell 直接查看中文文件时可能出现乱码，通常是终端编码显示问题，不代表文件内容损坏。
- 已新增 `scripts/read-utf8.ps1` 与 `npm run docs:read:utf8 -- <path>`，后续查看中文文档优先使用这两个入口。
- `next build` 在前端开发服务运行时，偶尔可能因 `.next` 临时文件冲突失败。
- 不要把真实 `.env`、日志、`.next`、`node_modules`、`.medusa` 提交到仓库。
- 后台 `/app` 仍是 Medusa 默认 Admin，公开测试和生产前必须明确访问控制、host、CORS 和密钥策略。

## 已知关键修复

- `apps/storefront/src/app/layout.tsx`
  根 `<html>` 已添加 `suppressHydrationWarning`，用于规避浏览器翻译扩展注入属性导致的 hydration mismatch 告警。
- `scripts/demo-proxy.mjs`
  统一代理需要保留原始 `Host`，并转发 `x-forwarded-host`、`x-forwarded-proto`、`x-forwarded-for`，否则 Next.js Server Actions 可能拒绝代理场景下的请求。
- `apps/storefront/next.config.js`
  已加入 `serverActions.allowedOrigins`，用于放行 `NEXT_PUBLIC_BASE_URL` 对应 host。
- `apps/backend/medusa-config.ts`
  已加入 Medusa Admin Vite `allowedHosts`，用于按需放行测试环境或 Tunnel host。
- `apps/backend/.env`
  本地 Redis 建议使用 `REDIS_URL=redis://127.0.0.1:6379`，避免 `localhost` 解析和连接抖动导致后台登录后出现 `unknown_error`。

## 建议下一步

1. 收口测试环境启动方式、环境变量分层、部署说明和测试门禁。
2. 梳理核心模块测试缺口，先补购买链路、账号、配置/env、支付、物流和文档同步脚本测试入口。
3. 项目结构稳定后立即进入支付 sandbox 与物流人工履约模块。
