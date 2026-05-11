# 测试环境、Cloudflare Tunnel 与 VPS 部署路线

本文档用于规划 Popink Market 从本地开发验证进入 `staging / 测试环境`，再迁移到生产环境的部署路线。项目始终以上线生产为目标推进。本机主要用于开发、排错和提交前验证；在正式域名和 VPS 部署完成前，允许使用 Cloudflare 临时地址作为过渡访问入口。

## 推荐拓扑

```text
外部用户
  -> https://shop.example.com
  -> Cloudflare Tunnel 或 Nginx + TLS
  -> VPS 或测试环境主机 127.0.0.1:8080
  -> 统一代理脚本 demo-proxy.mjs 或正式反向代理
     -> /store /auth /app /admin /health /uploads -> Medusa 127.0.0.1:9000
     -> 其他页面与资源 -> Next.js 127.0.0.1:8000
```

`demo-proxy.mjs` 是历史命名的统一代理脚本，不代表当前部署目标是临时展示站。测试环境和生产环境应优先使用受进程守护管理的代理，或使用 Nginx 等正式反向代理。

## 仓库内已经准备好的文件

- `deploy/cloudflare/config.yml.example`
  Cloudflare Tunnel 的本地管理配置模板。
- `deploy/nginx/popink-market.conf`
  VPS 上可使用的单域名反向代理示例。
- `deploy/systemd/popink-backend.service`
- `deploy/systemd/popink-storefront.service`
- `deploy/systemd/popink-proxy.service`
  后端、前端、统一代理的 systemd 服务模板。
- `apps/backend/.env.production.example`
- `apps/storefront/.env.production.example`
  面向单域名部署的环境变量模板。

## 阶段一：本地开发验证

本地运行只用于开发和排错，不作为最终交付目标。

```powershell
npm run db:up
npm run backend:dev
npm run storefront:dev
npm run demo:proxy
```

统一入口：

```text
http://127.0.0.1:8080
```

## 阶段一补充：Cloudflare 临时地址过渡

在正式域名和 VPS 部署完成前，当前允许使用 Cloudflare Quick Tunnel 的临时地址作为过渡访问入口，用于外部预览、协作确认和阶段性测试。

当前记录的过渡入口：

```text
前台统一入口: https://ash-voted-alarm-ipod.trycloudflare.com/
后台入口:     https://ash-voted-alarm-ipod.trycloudflare.com/app
健康检查:     https://ash-voted-alarm-ipod.trycloudflare.com/health
```

注意：

- Quick Tunnel 地址是临时随机 `*.trycloudflare.com`，重启 tunnel 后大概率变化。
- 如果地址变化，必须同步更新 `NEXT_PUBLIC_BASE_URL`、`serverActions.allowedOrigins`、Admin allowed hosts 和相关文档。
- 该入口是正式域名和 VPS 前的过渡方案，不是最终生产入口。
- 使用该入口时仍按测试环境约束处理：不提交真实密钥，管理员密码后续必须替换，支付和物流仍按 staging 路线推进。

启动方式：

```powershell
npm run backend:dev
npm run storefront:dev
npm run demo:proxy
cloudflared tunnel --url http://127.0.0.1:8080
```

统一代理职责：

- `/store`
- `/auth`
- `/app`
- `/admin`
- `/health`
- `/uploads`

以上路径由 `scripts/demo-proxy.mjs` 转发到 Medusa backend `127.0.0.1:9000`，其他页面和前台资源转发到 storefront `127.0.0.1:8000`。

## 阶段二：测试环境运行

测试环境最低要求：

1. 使用 `npm run build` 完成构建。
2. 使用 `npm run backend:start` 启动 Medusa。
3. 使用 `npm run storefront:start` 启动 Next.js。
4. 使用 `npm run proxy:start` 或 Nginx 暴露统一入口。
5. 使用 systemd、PM2、容器编排或等价方式守护进程。
6. 配置日志、健康检查和重启策略。
7. 环境变量从 production example 派生，但使用 staging 密钥。

建议的关键环境变量：

```text
NEXT_PUBLIC_BASE_URL=https://shop.example.com
NEXT_PUBLIC_MEDUSA_BACKEND_URL=
MEDUSA_BACKEND_INTERNAL_URL=http://127.0.0.1:9000
```

浏览器继续走同域名，只有 Next.js 服务端在内部直连 Medusa。

## Cloudflare Tunnel 接入

### 1. 准备域名

需要一个已经托管到 Cloudflare 的域名，例如：

```text
shop.example.com
```

### 2. 安装 cloudflared

参考 Cloudflare 官方文档：

- [Routing](https://developers.cloudflare.com/tunnel/routing/)
- [Configuration file](https://developers.cloudflare.com/tunnel/advanced/local-management/configuration-file/)
- [Run as a service on Linux](https://developers.cloudflare.com/tunnel/advanced/local-management/as-a-service/linux/)
- [Run as a service on Windows](https://developers.cloudflare.com/tunnel/advanced/local-management/as-a-service/windows/)

### 3. 创建 named tunnel

```bash
cloudflared tunnel login
cloudflared tunnel create popink-market
cloudflared tunnel route dns popink-market shop.example.com
```

### 4. 生成配置文件

复制模板：

```bash
cp deploy/cloudflare/config.yml.example ~/.cloudflared/config.yml
```

替换真实值：

- `YOUR_TUNNEL_UUID`
- `shop.example.com`

默认服务指向：

```yaml
service: http://127.0.0.1:8080
```

### 5. 验证 ingress 规则

```bash
cloudflared tunnel ingress validate
cloudflared tunnel ingress rule https://shop.example.com
```

### 6. 作为服务运行

Linux：

```bash
sudo cloudflared --config /home/<USER>/.cloudflared/config.yml service install
sudo systemctl start cloudflared
sudo systemctl status cloudflared
```

Windows：

```powershell
cloudflared service install
```

## VPS 迁移路线

迁移时建议保持完全相同的入口结构：

```text
Cloudflare 或 Nginx -> shop.example.com -> VPS:8080 -> proxy -> 8000 / 9000
```

这样只需要迁移运行位置，不需要改应用访问模型。

### VPS 上推荐的组件分工

- PostgreSQL
- Redis
- Medusa 后端，监听 `127.0.0.1:9000`
- Next.js 前端，监听 `127.0.0.1:8000`
- 统一代理，监听 `127.0.0.1:8080` 或 `0.0.0.0:8080`
- Cloudflare Tunnel 或 Nginx

### 接入方式 A：Cloudflare Tunnel

优点：

- 不需要开放 80/443 到公网。
- 外部攻击面更小。
- 从测试环境迁移到 VPS 较平滑。

做法：

- 把 `cloudflared` 和应用一起迁到 VPS。
- `service: http://127.0.0.1:8080` 保持不变。

### 接入方式 B：Nginx + 证书

优点：

- 传统部署方式，更通用。
- 以后切其他 CDN/网关更容易。

做法：

- 使用 `deploy/nginx/popink-market.conf` 作为起点。
- 让 Nginx 反代到 `127.0.0.1:8080`。
- 再配合 Let's Encrypt 或 Cloudflare Full/Strict TLS。

## systemd 落地方式

仓库已经提供三个服务模板：

- `deploy/systemd/popink-backend.service`
- `deploy/systemd/popink-storefront.service`
- `deploy/systemd/popink-proxy.service`

这些模板默认假设：

- 项目部署目录是 `/srv/popink_market`
- 运行用户是 `popink`
- `npm` 在 `/usr/bin/npm`

在 VPS 上按实际情况替换路径和用户，然后：

```bash
sudo cp deploy/systemd/popink-*.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable popink-backend popink-storefront popink-proxy
sudo systemctl start popink-backend popink-storefront popink-proxy
```

## 支付与物流要求

测试环境进入验收前必须明确：

- 支付默认走真实服务 sandbox，本地模拟支付只能作为 fallback。
- 支付密钥按环境分层，不得提交到仓库。
- 支付成功、失败、取消、回调和幂等处理需要有测试计划。
- 物流至少支持配送配置、运费规则、人工履约和 tracking 记录。
- 接真实物流商 API 前，必须明确配送范围、费用规则、退换货责任和状态同步方案。

## 测试与交付要求

- 部署前运行相关单元测试；全量 test 可用时运行 `npm run test`。
- 运行构建检查：`npm run build`。
- 验证健康检查、首页、商品页、注册登录、checkout、支付 sandbox 或 fallback、订单查看。
- 物流模块上线前验证人工履约和 tracking 记录。
- 无法测试的部分必须记录原因和残余风险。

## 代理与公开访问排错记录

以下结论来自早期公开访问验证，作为排错依据保留；不代表推荐长期使用本机公开访问。

- 如果前台出现 hydration mismatch，且报错中包含浏览器翻译扩展注入的属性，优先确认 `apps/storefront/src/app/layout.tsx` 根 `<html>` 是否保留 `suppressHydrationWarning`。
- 如果登录或表单提交出现 `Invalid Server Actions request`，检查统一代理是否保留原始 `Host`，并正确转发 `x-forwarded-host`、`x-forwarded-proto`、`x-forwarded-for`。
- 如果 Admin `/app` 返回 `Blocked request. This host is not allowed.`，检查 `apps/backend/medusa-config.ts` 中 Medusa Admin Vite `allowedHosts` 是否包含当前测试环境 host。
- 如果 Admin 登录后又跳回登录页，且后端日志出现 Redis `ECONNRESET`、`ECONNABORTED` 或 `MaxRetriesPerRequestError`，本地环境优先使用 `REDIS_URL=redis://127.0.0.1:6379`，不要使用 `localhost`。

## 生产前必须替换

- 管理员密码
- `JWT_SECRET`
- `COOKIE_SECRET`
- 数据库和 Redis 凭据
- 支付测试密钥
- CORS 和 allowed hosts
- Cloudflare 或 TLS 证书配置
- 日志、备份、监控和恢复策略

## 推荐迁移顺序

1. 本地完成开发验证和单元测试。
2. 使用 `build/start` 路线在测试环境跑通统一入口。
3. 接入 Cloudflare Tunnel 或 Nginx 域名入口。
4. 验证首页、商品页、账号、checkout、订单、支付 sandbox 和物流人工履约。
5. 把数据库、Redis 和应用迁到 VPS 或正式测试主机。
6. 完成生产前阻塞项清单，再进入生产发布准备。
