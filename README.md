# Popink Market

Popink Market 是一个面向日本纹身行业从业者的 B2B 电商项目。项目始终以上线生产为目标推进，当前最低交付标准是可在 `staging / 测试环境` 中稳定运行、可验证、可迁移；本地运行只作为开发和排错手段。

## 文档规则

- 项目说明文档统一使用中文。
- 新增或修改文档时，正文、标题、注释和操作说明都应优先使用中文。
- 如需保留英文，仅限代码、命令、路径、环境变量、第三方固定名称和必要术语。
- 当产品范围、运行方式、支付物流策略、测试门禁或部署策略变化时，必须同步更新 `SPEC.md`、`docs/`、`AGENT.md` 和当前 `README.md`。

## 当前技术栈

- Node.js `22.22.2`
- npm `10.9.7`
- Medusa.js `2.14.0`
- Next.js `15.3.9`
- PostgreSQL `16-alpine`
- Redis `7-alpine`
- Docker Compose

## 当前项目结构

```text
apps/backend                         Medusa 后端与管理后台
apps/storefront                      Next.js 前台
apps/storefront/src/app/[countryCode]/(main)
  about                              关于页面
  contact                            联系页面
  returns                            退换货页面
  shipping                           配送页面
  wholesale                          批发说明页面
apps/storefront/src/modules/content  静态内容模板
deploy/                              Cloudflare、Nginx、systemd 部署模板
docs/MILESTONES.md                   里程碑、任务状态、进度日志
docs/WORKFLOW.md                     文档、实现、测试、交付规则
docs/NEXT_CONTEXT.md                 下个对话接续上下文
docs/LARK_SYNC.md                    Lark 文档同步与导入说明
docs/DEPLOY_CLOUDFLARE_VPS.md        测试环境与 VPS 部署路线
docs/github-pages                    GitHub Pages 静态展示页
scripts/                             运行、验证、文档同步脚本
SPEC.md                              产品与技术规格说明
docker-compose.yml                   本地 PostgreSQL / Redis
package.json                         工作区脚本入口
```

## 文档入口

- 产品范围、业务规则、测试环境标准：`SPEC.md`
- 里程碑、进度、验收状态：`docs/MILESTONES.md`
- 工作规则、测试门禁、交付规则：`docs/WORKFLOW.md`
- 下个对话恢复上下文：`docs/NEXT_CONTEXT.md`
- Lark 文档同步与导入：`docs/LARK_SYNC.md`
- 工作区操作手册：`AGENT.md`

## 中文文档查看

PowerShell 默认直接读取中文文档时，可能出现乱码；这通常是终端读取/显示编码问题，不代表文件损坏。

```powershell
npm run docs:read:utf8 -- README.md
npm run docs:read:utf8 -- README.md docs/NEXT_CONTEXT.md
```

## 本地开发验证

本地运行用于开发、排错和提交前验证，不代表交付目标。

```powershell
npm run db:up
npm run backend:dev
npm run storefront:dev
npm run demo:proxy
```

统一开发入口：

```text
后端健康检查: http://127.0.0.1:9000/health
Medusa Admin:  http://127.0.0.1:9000/app
前台开发入口: http://127.0.0.1:8000/jp
统一入口:     http://127.0.0.1:8080/jp
```

`demo:proxy` 是历史命名的统一代理入口。后续测试环境和生产环境应优先使用正式反向代理或受进程守护管理的代理服务。

## 测试环境运行方向

测试环境最低要求：

- 使用 `build/start` 或等价的非开发态启动方式。
- 通过统一域名访问前台、Store API、Admin、上传资源和健康检查。
- 环境变量按 `local / staging / production` 分层管理。
- 支付默认接真实服务 sandbox；本地可保留模拟支付 fallback。
- 物流先落地配送配置、运费规则、人工履约和 tracking 记录。
- 具备健康检查、日志、进程守护、密钥替换和备份说明。

当前已提供入口：

```powershell
npm run build
npm run backend:start
npm run storefront:start
npm run proxy:start
npm run local:dev
```

本机临时地址方案可以用 bash 脚本一键重启开发服务、统一代理和 Cloudflare Quick Tunnel：

```bash
bash scripts/restart-dev.sh
```

该脚本适合在 WSL 或 Git Bash 中运行。PowerShell 不能直接执行 `.sh` 文件；如需在 PowerShell 中调用，可以使用：

```powershell
wsl bash scripts/restart-dev.sh
```

或者在已安装 Git Bash 的情况下使用：

```powershell
bash scripts/restart-dev.sh
```

如果当前服务是从 PowerShell 窗口手动启动的，WSL 内的脚本不一定能停止这些 Windows 进程。遇到端口占用时，先在原 PowerShell 窗口按 `Ctrl + C` 停止旧服务，再运行脚本。

正式域名和 VPS 部署完成前，允许使用 Cloudflare Quick Tunnel 临时地址作为过渡访问入口。当前记录的过渡入口是：

```text
前台统一入口: https://ash-voted-alarm-ipod.trycloudflare.com/
后台入口:     https://ash-voted-alarm-ipod.trycloudflare.com/app
健康检查:     https://ash-voted-alarm-ipod.trycloudflare.com/health
```

该地址重启 tunnel 后大概率变化；变化后必须同步更新环境变量、allowed hosts 和文档。

## 管理员账号

当前本地和测试数据使用的管理员账号：

```text
邮箱: admin@popink.local
密码: PopinkAdmin123
```

公开测试环境和生产环境必须替换管理员密码、密钥、CORS、cookie secret、JWT secret 和数据库凭据。

## 当前前台内容页

- `/jp/about`
- `/jp/wholesale`
- `/jp/shipping`
- `/jp/returns`
- `/jp/contact`

## GitHub Pages 静态展示页

`docs/github-pages` 提供一个可发布到 `github.io` 的纯静态展示页，用于先公开展示 Popink Market 的项目定位、分类结构、基础页面入口和当前部署范围。

该页面不连接 Medusa 后端，不提供真实商品 API、购物车、登录、checkout、Admin、PostgreSQL 或 Redis 能力。完整电商功能仍应通过本地、staging 或正式部署环境验证。

本地预览：

```powershell
npm run pages:preview
```

GitHub Pages 发布入口：

- workflow：`.github/workflows/deploy-github-pages.yml`
- artifact 目录：`docs/github-pages`
- 触发方式：push 到当前本地分支 `master` 且改动 `docs/github-pages/**`，或在 GitHub Actions 中手动运行 `workflow_dispatch`

## 环境变量

后端环境变量文件：

```text
apps/backend/.env
apps/backend/.env.production.example
```

前台环境变量文件：

```text
apps/storefront/.env.local
apps/storefront/.env.example
apps/storefront/.env.production.example
```

不要提交真实 `.env`、`.env.local`、日志、`node_modules`、`.next`、`.medusa` 或本地构建产物。

## 测试门禁

交付采用“关键模块 + 覆盖率”门禁：

- 当前核心模块必须逐步补齐单元测试：前台购买链路、账号注册登录、配置/env、支付、物流、文档同步脚本。
- 新增功能必须同任务提交对应单元测试。
- 支付和物流相关改动除单元测试外，还必须补充 sandbox 或人工履约验证。
- 交付前必须运行相关 workspace test；全量 test 可用时运行 `npm run test`。
- 未通过测试的功能不交付；无法测试的部分必须说明原因和残余风险。

当前验证命令：

```powershell
npm run test
npm run test:demo-customer-login
npm run test:admin-login
```

当前 `npm run test` 已接入 Turbo，会执行：

- root scripts 的 Node.js tests
- `@dtc/backend` 的 Jest unit tests
- `@dtc/storefront` 的 Jest unit tests

新增核心功能时必须把对应测试加入相关 workspace，不能只依赖外部脚本验证。

当前测试基线已覆盖脚本、后端 route、前台 util、账号表单解析、checkout 地址 payload、支付 provider 查询和物流配送查询/计价。

## 构建与验证

基础构建检查：

```powershell
npm run build --workspace=@dtc/backend
npm run build --workspace=@dtc/storefront
```

如果前台开发服务正在运行，`next build` 偶尔会因 `.next` 临时文件冲突失败。遇到时先停止前台开发服务，删除 `apps/storefront/.next` 后重新执行构建。

## 数据重置

下面的命令会删除本地 Docker volume，并重新初始化测试数据：

```powershell
docker compose down -v
npm run db:up
npm run backend:migrate
Set-Location apps/backend
npx medusa user -e admin@popink.local -p PopinkAdmin123
Set-Location ../..
```

重置后需要重新读取最新的 publishable API key：

```powershell
docker exec popink_market_postgres psql -U medusa -d popink_market -t -c "select token from api_key where type = 'publishable' order by created_at desc limit 1;"
```

然后写回 `apps/storefront/.env.local`。

## Lark 文档同步

- `npm run docs:sync:lark`
  直接用块接口覆盖已有 Lark 文档，适合普通段落类文档。
- `npm run docs:import:lark`
  先把 Markdown 转成 HTML，再导入为新的 Lark 文档，适合需要保留表格效果的文档。

`SPEC.md` 和 `docs/MILESTONES.md` 都已经验证过可推送到 Lark。表格类内容推荐走导入模式。

## 后续主线

- 收口项目结构、启动方式、环境变量分层、部署文档和测试门禁。
- 结构稳定后立即推进支付模块：优先接真实支付服务 sandbox。
- 同步推进物流模块：先建立配送配置、运费规则、人工履约和 tracking 记录，再接真实物流商 API。
- 将 staging 验收作为最低交付口径，生产前必须完成安全、日志、备份、监控、密钥和访问控制检查。
