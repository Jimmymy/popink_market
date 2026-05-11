# AGENT

本文件是 `popink_market` 工作区的操作手册，供后续在本仓库内工作的代理或开发者快速对齐环境、规则和常见流程。

## 项目定位

- 项目名称：`Popink Market`
- 当前阶段：生产上线目标项目，最低按 `staging / 测试环境` 标准推进
- 业务形态：面向日本纹身行业从业者的 B2B 电商项目
- 主要目标：维护一个可开发、可测试环境部署、可迁移生产的 `Medusa + Next.js` 项目
- 本地运行定位：只用于开发、排错和提交前验证，不作为项目目标

## 技术栈

- Node.js `22.22.2`
- npm `10.9.7`
- Medusa.js `2.14.0`
- Next.js `15.3.9`
- PostgreSQL `16-alpine`
- Redis `7-alpine`
- Docker Compose

## 关键目录

```text
apps/backend
apps/storefront
deploy/cloudflare
deploy/nginx
deploy/systemd
docs/
scripts/
README.md
SPEC.md
package.json
```

## 事实来源

当文档、计划和代码不一致时，按这个顺序判断和修正：

1. `SPEC.md`
2. `docs/MILESTONES.md`
3. `README.md`
4. `docs/WORKFLOW.md`
5. 代码和配置

## 文档规则

- 说明文档统一使用中文。
- 标题、正文、备注、步骤、规则说明优先使用中文。
- 允许保留英文的范围仅包括代码、命令、文件路径、环境变量、URL、第三方固定名称和必要术语。
- 当产品范围、运行方式、脚本入口、支付物流、测试门禁或部署策略变化时，必须同步更新文档。

至少同步这些文件中的相关内容：

- `README.md`
- `SPEC.md`
- `docs/WORKFLOW.md`
- `docs/NEXT_CONTEXT.md`
- `docs/MILESTONES.md`
- 必要时补充新的专题文档

## 中文乱码处理

本工作区的中文文档文件本体通常是 `UTF-8`，PowerShell 默认查看时可能乱码。不要直接根据乱码判断文件损坏。

```powershell
npm run docs:read:utf8 -- README.md
npm run docs:read:utf8 -- README.md docs/NEXT_CONTEXT.md
```

## 本地开发验证

先启动数据库和缓存：

```powershell
npm run db:up
```

后端开发：

```powershell
npm run backend:dev
```

前台开发：

```powershell
npm run storefront:dev
```

统一代理：

```powershell
npm run demo:proxy
```

`demo:proxy` 是历史命名的统一代理脚本，不代表项目定位是临时展示站。

## 测试环境和生产化入口

```powershell
npm run build
npm run backend:start
npm run storefront:start
npm run proxy:start
npm run local:dev
```

后续测试环境和生产环境应优先使用 `build/start`、正式反向代理、进程守护、日志、健康检查和密钥分层。

## 常用地址

```text
后端健康检查: http://127.0.0.1:9000/health
Medusa Admin:  http://127.0.0.1:9000/app
前台开发入口: http://127.0.0.1:8000/jp
统一入口:     http://127.0.0.1:8080/jp
```

## 环境变量结论

### storefront

`apps/storefront/.env.local` 用于本地开发验证时应保持统一入口模式：

```text
NEXT_PUBLIC_MEDUSA_BACKEND_URL=
MEDUSA_BACKEND_INTERNAL_URL=http://127.0.0.1:9000
NEXT_PUBLIC_BASE_URL=http://127.0.0.1:8080
```

### backend

当前本地 Redis 建议使用 IPv4 直连，避免 `localhost` 导致会话连接异常：

```text
REDIS_URL=redis://127.0.0.1:6379
```

公开测试环境和生产环境必须替换管理员密码、JWT secret、cookie secret、数据库凭据、支付密钥和 allowed hosts。

## 支付与物流方向

- 项目结构稳定后立即推进支付和物流模块。
- 支付第一阶段接真实支付服务 sandbox；本地可保留模拟支付 fallback。
- 物流第一阶段建立物流抽象、配送配置、运费规则、人工履约和 tracking 记录。
- 供应商确定后再接真实面单、追踪和状态同步接口。
- 涉及支付和物流的改动必须同步补测试。

## 测试门禁

交付采用“关键模块 + 覆盖率”标准：

- 核心业务模块必须逐步补齐单元测试：前台购买链路、账号注册登录、配置/env、支付、物流、文档同步脚本。
- 新增功能必须随代码一起提交单元测试。
- 修改既有核心模块时，必须补齐被触碰行为的测试。
- 交付前必须运行相关 workspace test；全量 test 可用时运行 `npm run test`。
- 未通过测试的功能不交付；无法测试的部分必须说明原因和残余风险。

当前验证命令：

```powershell
npm run test
npm run test:demo-customer-login
npm run test:admin-login
```

## 当前已知关键修复

### storefront

- `apps/storefront/src/app/layout.tsx`
  - 根 `<html>` 加了 `suppressHydrationWarning`
  - 用于规避浏览器翻译扩展注入属性导致的 hydration mismatch 告警

- `scripts/demo-proxy.mjs`
  - 保留原始 `Host`
  - 转发 `x-forwarded-host`
  - 转发 `x-forwarded-proto`
  - 转发 `x-forwarded-for`
  - 用于修复代理场景下的 Next.js Server Actions 校验

- `apps/storefront/next.config.js`
  - 已加入 `serverActions.allowedOrigins`
  - 放行 `NEXT_PUBLIC_BASE_URL` 对应 host

### backend

- `apps/backend/medusa-config.ts`
  - 已加入 Medusa Admin Vite `allowedHosts`
  - 允许按需扩展额外 host

- `apps/backend/.env`
  - `REDIS_URL` 已改为 `redis://127.0.0.1:6379`
  - 用于修复后台登录后 `unknown_error` 与 Redis 连接抖动问题

## 管理员与测试数据

当前本地和测试数据管理员账号：

```text
邮箱: admin@popink.local
密码: PopinkAdmin123
```

公开测试环境和生产环境必须替换。

## Git 与改动约束

- 工作区可能长期处于非干净状态，开发前先执行：

```powershell
git status --short
```

- 不要回滚用户已有改动。
- 不要提交真实 `.env`、日志、`.next`、`node_modules`、`.medusa` 和本地产物。
- 每完成一个稳定功能切片后再提交，不要把无关主题混在同一个提交里。

## 推荐阅读顺序

1. `AGENT.md`
2. `README.md`
3. `docs/WORKFLOW.md`
4. `docs/NEXT_CONTEXT.md`
5. `SPEC.md`
6. `docs/MILESTONES.md`
