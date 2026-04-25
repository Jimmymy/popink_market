# Popink Market 里程碑

本文档是项目执行计划。它把 `SPEC.md` 中的需求拆成阶段任务，用于记录进度、验收标准和会影响实现的决策。

## 状态说明

- `Planned`：已计划，尚未开始。
- `In Progress`：正在进行。
- `Blocked`：被决策、依赖或外部输入阻塞。
- `Done`：已实现并验证。
- `Deferred`：已明确延期，不放入当前阶段。

## 当前重点

当前里程碑：`M2 - 前台内容替换` 和 `M3 - Demo 购买流程`

当前目标：在现有 Medusa + Next.js demo 基线上，把前台继续改成 Popink Market 的业务 demo，并跑通从浏览商品到后台查看订单的闭环。

## 里程碑总览

| ID | 名称 | 状态 | 目标 |
| --- | --- | --- | --- |
| M0 | 项目环境基线 | Done | 建立可本地运行的 Medusa + Next.js + PostgreSQL + Redis 基线。 |
| M1 | 日本 B2B Demo 基础 | In Progress | 配置日本/JPY demo 电商数据和纹身商品 sample 目录。 |
| M2 | 前台内容替换 | In Progress | 把官方 starter 文案和导航替换成 Popink Market demo 内容。 |
| M3 | Demo 购买流程 | Planned | 验证浏览、购物车、checkout、demo 支付和后台订单查看。 |
| M4 | 维护和部署准备 | Planned | 准备本地运维文档和轻量服务器迁移说明。 |
| M5 | 商品和内容深化 | Planned | 扩展真实业务所需的商品字段、分类、内容页和基础运营信息。 |
| M6 | B2B 能力预留 | Planned | 为后续客户审核、批发价、企业资料和询价能力预留清晰路线。 |
| M7 | 支付、物流、邮件集成准备 | Planned | 梳理后续真实集成方案，不在 demo 阶段直接接入生产服务。 |
| M8 | 生产化和部署路线 | Planned | 为轻量服务器和后续专业服务器部署建立迁移路径。 |

## M0 - 项目环境基线

状态：`Done`

关联规格：

- `SPEC.md` 第 2.1 节：当前阶段目标
- `SPEC.md` 第 7.3 节：部署原则
- `SPEC.md` 第 10 节：一期验收标准

已完成：

- 初始化 Git 仓库。
- 使用 `.node-version` 固定 Node 版本为 `22.22.2`。
- 通过 `fnm` 安装并选择 Node `22.22.2`。
- 创建 Medusa 后端：`apps/backend`。
- 创建 Next.js 前台：`apps/storefront`。
- 添加 Docker PostgreSQL 和 Redis 服务。
- 执行 Medusa migrations 和 seed。
- 创建本地管理员账号。
- 验证后端构建。
- 验证前台构建。
- 验证本地后端和前台 URL。
- 在 `README.md` 中添加本地启动说明。

验证方式：

- `npm run build --workspace=@dtc/backend`
- `npm run build --workspace=@dtc/storefront`
- `http://localhost:9000/health`
- `http://localhost:8000`

已知后续项：

- `npm audit` 会报告官方 starter 依赖树中的安全告警。不要在没有单独依赖评审的情况下执行 `npm audit fix --force`。

## M1 - 日本 B2B Demo 基础

状态：`In Progress`

关联规格：

- `SPEC.md` 第 4.3 节：示例商品
- `SPEC.md` 第 6.1 节：商品价格
- `SPEC.md` 第 6.4 节：支付
- `SPEC.md` 第 6.5 节：物流
- `SPEC.md` 第 8.4 节：国际化准备

目标：

把官方 starter 的默认 demo 数据替换成适合纹身用品的日本市场 demo 数据。

任务：

- `Done`：配置日本作为 demo region。
- `Done`：配置 JPY 作为前台默认价格币种。
- `Done`：把默认分类结构替换为纹身用品分类。
- `Done`：添加耗材、设备、色料、护理产品 sample 商品。
- `Done`：为 sample 商品添加基础库存。
- `Done`：保留 demo/manual payment。
- `Done`：保留 demo/manual shipping。
- `Done`：把前台默认 region 从 starter 默认值改为日本。
- `Done`：验证商品出现在前台。
- `Planned`：登录 Medusa Admin，人工确认商品、库存、region、shipping、payment 可见。

验收标准：

- 前台可以通过 `/jp` 打开。
- 商品列表显示纹身相关 sample 商品。
- 商品详情显示 JPY 价格。
- sample 商品可以加入购物车。
- Admin 可以查看新 sample 商品和库存。

当前默认假设：

- 前台客户可见内容优先向日文方向发展，但 demo 阶段允许英文占位。
- 代码、handle、SKU、seed 标识继续使用英文。
- 当前 sample 商品不追求真实 SKU 完整性，后续由业务合伙人补充真实商品体系。

## M2 - 前台内容替换

状态：`In Progress`

关联规格：

- `SPEC.md` 第 3 节：目标用户
- `SPEC.md` 第 4.1 节：前台功能
- `SPEC.md` 第 7.2 节：前端原则

目标：

让前台第一眼像 Popink Market 的早期 demo，而不是官方 Medusa starter。

已完成：

- `Done`：替换首页 hero 文案。
- `Done`：替换导航文案。
- `Done`：替换 footer 内容。
- `Done`：移除或隐藏明显的 Medusa starter 品牌露出。
- `Done`：添加基础 B2B 定位文案。

下一步任务：

- `Planned`：检查首页是否仍依赖 collection 数据；如果没有 collection，决定是否改为直接展示商品分类或 featured products。
- `Planned`：替换商品分类名称展示语言，决定英文、日文或双语策略。
- `Planned`：添加基础内容页入口，例如关于我们、批发说明、配送说明、退换货说明、联系信息。
- `Planned`：检查移动端视口，保证导航、首页、商品页不明显错位。
- `Planned`：保留轻量改造，不做大规模视觉重构，避免偏离 demo 验证目标。

验收标准：

- 首屏能清楚识别 Popink Market。
- 导航支持商品发现。
- Footer 不再像通用 starter。
- 虽然第一目标是 PC，移动端视口仍保持可用。

## M3 - Demo 购买流程

状态：`Planned`

关联规格：

- `SPEC.md` 第 4.1 节：前台功能
- `SPEC.md` 第 6.2 节：用户注册
- `SPEC.md` 第 6.3 节：下单信息
- `SPEC.md` 第 10 节：一期验收标准

目标：

确认 demo 支持完整的基础购买流程。

建议执行顺序：

1. 启动 Docker 服务、后端、前台。
2. 打开 `/jp/store` 或某个 `/jp/products/...` 商品详情页。
3. 选择 sample 商品 variant。
4. 加入购物车。
5. 进入 cart。
6. 进入 checkout。
7. 注册或登录 demo 客户。
8. 填写日本地址 sample。
9. 选择 demo shipping。
10. 选择 demo/manual payment。
11. 提交 demo 订单。
12. 登录 Admin 确认订单可见。

任务：

- `Planned`：注册 demo 客户。
- `Planned`：登录 demo 客户。
- `Planned`：把商品加入购物车。
- `Planned`：填写日本地址格式 sample。
- `Planned`：选择 demo shipping。
- `Planned`：选择 demo payment。
- `Planned`：提交 demo 订单。
- `Planned`：确认订单出现在 Admin。
- `Planned`：把发现的问题记录到 `docs/DECISIONS.md` 或当前里程碑文档。

验收标准：

- 非技术评审者可以在本地完成一笔 demo 订单。
- 订单可以在 Admin 中看到。
- 在深入定制前，starter 中存在的流程问题已经被记录。

## M4 - 维护和部署准备

状态：`Planned`

关联规格：

- `SPEC.md` 第 7.3 节：部署原则
- `SPEC.md` 第 8.1 节：可维护性
- `SPEC.md` 第 8.2 节：可扩展性
- `SPEC.md` 第 8.3 节：可移植性

目标：

为稳定本地运行和后续轻量服务器部署做准备。

任务：

- `Planned`：整理常用本地命令。
- `Planned`：完善本地 demo 数据重置流程。
- `Planned`：记录环境变量说明。
- `Planned`：添加轻量服务器部署说明。
- `Planned`：识别后续哪些服务需要迁移为托管服务。
- `Planned`：在任何公开部署前评审安全敏感默认值。
- `Planned`：明确 Docker Compose 在本地、轻量服务器、生产环境中的边界。

验收标准：

- 可以根据文档重复完成本地 setup。
- Demo 数据重置路径清晰。
- 公开部署前的 blocker 已记录。

## M5 - 商品和内容深化

状态：`Planned`

目标：

把 sample 商品从“能演示”推进到“更像真实纹身用品 B2B catalog”。

任务：

- `Planned`：和业务合伙人确认真实商品分类体系。
- `Planned`：确认商品规格模型，例如针型号、色料颜色、容量、机器规格、套装。
- `Planned`：确认商品图片策略，先用占位图还是准备真实素材。
- `Planned`：确认商品描述语言，日文、英文或双语。
- `Planned`：确认税务展示方式，日本消费税是否含税展示。
- `Planned`：确认库存策略，demo 库存、真实库存、预售或缺货处理。

验收标准：

- 商品数据结构可以承载真实业务输入。
- 不需要重构核心商品模型即可替换 sample 数据。

## M6 - B2B 能力预留

状态：`Planned`

目标：

为后续 B2B 能力预留路线，但不在当前 demo 过早实现复杂功能。

任务：

- `Planned`：记录“登录后看价格”作为后续能力，不进入当前 demo。
- `Planned`：记录“客户注册审核”作为后续能力，不进入当前 demo。
- `Planned`：记录企业资料字段，例如店铺名、负责人、地址、联系方式、社交账号。
- `Planned`：评估 Medusa customer group 或 custom module 是否适合承载批发等级。
- `Planned`：评估后续是否需要询价单、批量下单、历史订单复购。

验收标准：

- 当前 demo 不被复杂 B2B 功能拖慢。
- 后续扩展点和潜在技术方向已记录。

## M7 - 支付、物流、邮件集成准备

状态：`Planned`

目标：

为真实支付、物流、邮件做调研和技术准备，但当前 demo 继续使用模拟能力。

任务：

- `Planned`：确认日本市场优先支付方式，例如信用卡、Stripe、PayPal、日本本地支付。
- `Planned`：确认是否需要 Konbini、PayPay、银行转账等日本本地支付选项。
- `Planned`：确认物流服务候选，例如 Yamato、Sagawa、日本邮便，或先人工发货。
- `Planned`：确认邮件服务候选，例如 SendGrid、Mailgun、Amazon SES。
- `Planned`：记录接入真实支付前的安全和合规前置条件。

验收标准：

- 不直接接入生产支付，但知道下一阶段如何接。
- 不直接接入真实物流，但知道订单履约流程如何扩展。

## M8 - 生产化和部署路线

状态：`Planned`

目标：

从本地 demo 走向轻量服务器，再预留专业服务器或云基础设施迁移路径。

任务：

- `Planned`：确认轻量服务器目标系统和规格。
- `Planned`：确认数据库是否继续 Docker 本机跑，还是迁移到托管 PostgreSQL。
- `Planned`：确认 Redis 是否继续本机 Docker，还是迁移到托管 Redis。
- `Planned`：整理环境变量分层：local、staging、production。
- `Planned`：准备生产前安全清单：secret、CORS、admin 账号、日志、备份。
- `Planned`：准备基础监控和备份策略。

验收标准：

- 有清晰的本地到轻量服务器部署路线。
- 生产化前必须解决的问题已列出。

## 待集中询问用户的问题

这些问题暂时不阻塞 demo 开发，等积累到合适节点再集中确认：

- 前台最终默认语言是日文、英文还是日英双语。
- 商品名称和分类名称是否需要日文优先。
- Popink Market 是否作为正式品牌名。
- 是否需要准备真实 logo、品牌色、字体方向。
- 商品图片先使用占位图、生成图还是真实商品图。
- 日本消费税是否按含税价展示。
- 轻量服务器目标平台和预算。
- 后续是否优先支持 Stripe、PayPal 或日本本地支付。
- 是否要接真实邮件服务，还是继续 demo 占位。

## 进度日志

| 日期 | 里程碑 | 更新 |
| --- | --- | --- |
| 2026-04-25 | M0 | 建立项目基线：Medusa 后端、Next.js 前台、PostgreSQL、Redis、本地管理员和成功构建。 |
| 2026-04-25 | M1 | 创建 milestone 工作流，开始规划日本 B2B demo 基础。 |
| 2026-04-25 | M1 | 把官方 starter seed 替换为日本/JPY 纹身商品 demo catalog，重置本地 demo 数据库，并验证 Store API、后端构建、前台构建、`/jp` 和商品详情页。 |
| 2026-04-25 | M2 | 替换首页、导航、侧边菜单和 footer 的 starter 文案，改成 Popink Market demo 定位；前台构建通过。 |
| 2026-04-25 | Planning | 扩展 M5-M8 后续路线，并新增待集中询问用户的问题列表。 |
