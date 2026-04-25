# 下个对话接续上下文

本文档用于在关闭当前对话窗口后，让新的 Codex 对话快速恢复项目上下文。

## 项目定位

Popink Market 是一个面向日本纹身行业工作者的 B2B 电商 demo。

当前阶段目标不是完整商业系统，而是先基于 Medusa.js 搭建本地可运行、可演示、可扩展的电商骨架。

## 当前技术栈

- Medusa.js `2.14.0`
- Next.js `15.3.9`
- Node.js `22.22.2`
- npm `10.9.7`
- PostgreSQL `16-alpine`
- Redis `7-alpine`
- Docker Compose

## 当前项目结构

```text
apps/backend     Medusa 后端和 Admin
apps/storefront  Next.js 前台
SPEC.md          产品和技术规格说明
README.md        本地启动和运维说明
docs/MILESTONES.md
docs/WORKFLOW.md
docs/NEXT_CONTEXT.md
docker-compose.yml
```

## 当前 Git 状态

当前仓库只有本地 Git，没有 remote。

最近提交：

```text
9d7a83e docs: localize workflow rules
3b34f46 docs: localize readme and milestones
7ad75c2 feat: add japan tattoo demo foundation
77a0694 chore: establish medusa demo baseline
```

如果下个对话需要推送远端，需要先由用户提供 GitHub 仓库地址，或让 Codex 创建/配置 remote。

## 当前本地服务

常用启动命令：

```powershell
npm run db:up
npm run backend:dev
npm run storefront:dev
```

本地地址：

```text
Backend health: http://localhost:9000/health
Medusa Admin:   http://localhost:9000/app
Storefront:     http://localhost:8000
Japan demo:     http://localhost:8000/jp
```

本地管理员：

```text
Email:    admin@popink.local
Password: PopinkAdmin123
```

## 当前已完成

- 本地 Medusa + Next.js workspace 已建立。
- PostgreSQL 和 Redis 已通过 Docker Compose 配置。
- Medusa seed 已改为日本/JPY/纹身用品 sample catalog。
- 前台默认 region 已改为 `jp`。
- 首页、导航、侧边菜单、footer 已替换为 Popink Market demo 文案。
- `README.md`、`docs/MILESTONES.md`、`docs/WORKFLOW.md` 已中文化。

## 当前 sample 数据

Region：

- `Japan`
- country code: `jp`
- currency: `jpy`

分类：

- `Tattoo Consumables`
- `Tattoo Equipment`
- `Tattoo Inks`
- `Aftercare`

商品：

- `Sterile Cartridge Needles Sample Pack`
- `Professional Rotary Machine Demo Kit`
- `Black Tattoo Ink 30ml`
- `Tattoo Aftercare Balm 50ml`

说明：

- 商品名、handle、SKU 暂时使用英文。
- 商品图片目前仍使用 Medusa public demo image 占位。
- 真实商品规格由用户合伙人后续把控。

## 下个对话建议从这里开始

推荐第一步：

1. 读取 `docs/MILESTONES.md`、`docs/WORKFLOW.md`、`README.md`、`SPEC.md`。
2. 检查 `git status --short`，确保工作区干净。
3. 启动或检查本地服务。
4. 继续 M2/M3。

推荐下一批任务：

1. M2：检查首页是否因没有 collections 导致商品展示不足，必要时改成直接展示分类或新品。
2. M2：把分类和基础前台文案改成日文或日英双语占位。
3. M3：跑通加购、购物车、checkout、demo payment、订单提交。
4. M3：登录 Admin 验证商品和订单可见。
5. M4：把运行、重置、常见问题继续补进 README。

## 已知注意事项

- PowerShell 输出中文可能显示乱码，这是终端编码显示问题，不代表文件损坏。
- 不要提交 `.env`、`.env.local`、日志、`node_modules`、`.next`、`.medusa`。
- `npm audit` 会报告官方 starter 依赖树告警，不要直接执行 `npm audit fix --force`。
- 执行 `next build` 时如果 storefront dev server 正在运行，可能导致 `.next` 开发缓存临时文件错误。遇到时停止 storefront dev server，删除 `apps/storefront/.next`，再重启即可。
- 数据库重置后 publishable API key 会变化，需要同步到 `apps/storefront/.env.local`。

## 待集中询问用户的问题

当前不阻塞下一步 demo 开发的问题：

- 前台最终默认语言：日文、英文还是日英双语。
- 商品名称和分类名称是否需要日文优先。
- Popink Market 是否作为正式品牌名。
- 是否需要真实 logo、品牌色、字体方向。
- 商品图片先用占位图、生成图还是真实商品图。
- 日本消费税是否按含税价展示。
- 轻量服务器目标平台和预算。
- 后续优先支付方式：Stripe、PayPal、日本本地支付或其他。
- 是否要接真实邮件服务。
