# Popink Market 里程碑

本文档是项目执行计划。它把 `SPEC.md` 中的需求拆成阶段任务，用于记录进度、验收标准和会影响实现的决策。

## 状态说明

- `Planned`：已计划，尚未开始。
- `In Progress`：正在进行。
- `Blocked`：被决策、依赖或外部输入阻塞。
- `Done`：已实现并验证。
- `Deferred`：已明确延期，不放入当前阶段。

## 当前重点

当前里程碑：`M1 - 日本 B2B Demo 基础`

当前目标：把官方 Medusa starter 的默认假设替换成面向日本纹身用品 B2B 的 demo，同时保持本地环境容易启动和维护。

## 里程碑总览

| ID | 名称 | 状态 | 目标 |
| --- | --- | --- | --- |
| M0 | 项目环境基线 | Done | 建立可本地运行的 Medusa + Next.js + PostgreSQL + Redis 基线。 |
| M1 | 日本 B2B Demo 基础 | In Progress | 配置日本/JPY demo 电商数据和纹身商品 sample 目录。 |
| M2 | 前台内容替换 | In Progress | 把官方 starter 文案和导航替换成 Popink Market demo 内容。 |
| M3 | Demo 购买流程 | Planned | 验证浏览、购物车、checkout、demo 支付和后台订单查看。 |
| M4 | 维护和部署准备 | Planned | 准备本地运维文档和轻量服务器迁移说明。 |

## M0 - 项目环境基线

状态：`Done`

关联规格：

- `SPEC.md` 第 2.1 节：当前阶段目标
- `SPEC.md` 第 7.3 节：部署原则
- `SPEC.md` 第 10 节：一期验收标准

已完成：

- 初始化 Git 仓库。
- 使用 `.node-version` 固定 Node 版本。
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
- `Planned`：验证商品出现在 Medusa Admin。

验收标准：

- 前台可以通过日本默认路径打开。
- 商品列表显示纹身相关 sample 商品。
- 商品详情显示 JPY 价格。
- sample 商品可以加入购物车。
- Admin 可以查看新 sample 商品和库存。

待确认决策：

- Demo 前台面向客户的文案是否从 M1 开始就全部使用日文，还是推迟到 M2/M3。
- Sample 商品名称使用日文、英文还是双语。

当前默认假设：

- 前台客户可见内容优先使用日文方向，但 demo 阶段允许英文占位。
- 代码、handle、SKU、seed 标识继续使用英文。

## M2 - 前台内容替换

状态：`In Progress`

关联规格：

- `SPEC.md` 第 3 节：目标用户
- `SPEC.md` 第 4.1 节：前台功能
- `SPEC.md` 第 7.2 节：前端原则

目标：

让前台第一眼像 Popink Market 的早期 demo，而不是官方 Medusa starter。

任务：

- `Done`：替换首页 hero 文案。
- `Done`：替换导航文案。
- `Done`：替换 footer 内容。
- `Done`：移除或隐藏明显的 Medusa starter 品牌露出。
- `Done`：添加基础 B2B 定位文案。
- `Planned`：如果 starter 结构适合，添加占位内容页。
- `Planned`：保持前端改动轻量、可维护。

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

- `Planned`：记录常用本地命令。
- `Planned`：记录如何重置本地 demo 数据。
- `Planned`：记录环境变量说明。
- `Planned`：添加轻量服务器部署说明。
- `Planned`：识别后续哪些服务需要迁移为托管服务。
- `Planned`：在任何公开部署前评审安全敏感默认值。

验收标准：

- 可以根据文档重复完成本地 setup。
- Demo 数据重置路径清晰。
- 公开部署前的 blocker 已记录。

## 进度日志

| 日期 | 里程碑 | 更新 |
| --- | --- | --- |
| 2026-04-25 | M0 | 建立项目基线：Medusa 后端、Next.js 前台、PostgreSQL、Redis、本地管理员和成功构建。 |
| 2026-04-25 | M1 | 创建 milestone 工作流，开始规划日本 B2B demo 基础。 |
| 2026-04-25 | M1 | 把官方 starter seed 替换为日本/JPY 纹身商品 demo catalog，重置本地 demo 数据库，并验证 Store API、后端构建、前台构建、`/jp` 和商品详情页。 |
| 2026-04-25 | M2 | 替换首页、导航、侧边菜单和 footer 的 starter 文案，改成 Popink Market demo 定位；前台构建通过。 |
