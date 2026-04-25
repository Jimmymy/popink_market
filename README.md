# Popink Market

Popink Market 是一个早期 B2B 电商 demo，面向日本纹身行业工作者，销售纹身耗材、设备、色料和护理产品。项目使用 Medusa.js 作为电商后端，使用官方 Next.js starter 作为前台基础。

## 本地技术栈

- Node.js `22.22.2`
- npm `10.9.7`
- Docker PostgreSQL `16-alpine`
- Docker Redis `7-alpine`
- Medusa.js `2.14.0`
- Next.js `15.3.9`

## 项目结构

```text
apps/backend     Medusa 后端和 Admin
apps/storefront  Next.js 前台
SPEC.md          产品和技术规格说明
docs/            里程碑和工作流规则
docker-compose.yml
```

## 规划工作流

- 产品范围记录在 `SPEC.md`。
- 执行计划和进度记录在 `docs/MILESTONES.md`。
- 工作规则记录在 `docs/WORKFLOW.md`。
- 下个对话接续上下文记录在 `docs/NEXT_CONTEXT.md`。
- 本地启动和运维说明记录在当前 `README.md`。

## 首次启动

启动本地依赖服务：

```powershell
npm run db:up
```

启动 Medusa 后端和 Admin：

```powershell
npm run backend:dev
```

在第二个终端启动前台：

```powershell
npm run storefront:dev
```

本地访问地址：

```text
Medusa 后端 API: http://localhost:9000
Medusa Admin:    http://localhost:9000/app
前台页面:        http://localhost:8000
PostgreSQL:      127.0.0.1:5432
Redis:           127.0.0.1:6379
```

本地 demo 管理员账号：

```text
Email:    admin@popink.local
Password: PopinkAdmin123
```

## 环境变量

本地后端环境变量文件：

```text
apps/backend/.env
```

本地前台环境变量文件：

```text
apps/storefront/.env.local
```

不要提交真实 `.env` 文件。参考模板如下：

```text
apps/backend/.env.template
apps/storefront/.env.example
```

## 注意事项

- 当前本地 demo 数据已经通过 Medusa migration seed 初始化。
- 当前 demo 面向日本市场，使用 JPY 日元价格。
- `npm audit` 目前会报告官方 starter 依赖树中的安全告警。不要直接执行 `npm audit fix --force`，它可能破坏 Medusa 官方锁定的依赖组合。

## 重置本地 Demo 数据

下面命令会删除本地 Docker 数据库 volume，并重新通过 Medusa migration seed 创建 demo 数据：

```powershell
docker compose down -v
npm run db:up
npm run backend:migrate
cd apps/backend
npx medusa user -e admin@popink.local -p PopinkAdmin123
```

重置后，需要读取新生成的 publishable API key：

```powershell
docker exec popink_market_postgres psql -U medusa -d popink_market -t -c "select token from api_key where type = 'publishable' order by created_at desc limit 1;"
```

然后把读取到的 key 写入：

```text
apps/storefront/.env.local
```

最后重新启动应用：

```powershell
npm run backend:dev
npm run storefront:dev
```
