# Popink Market 里程碑

本文档将 `SPEC.md` 中的范围拆分为执行阶段，用于记录当前状态、验收标准与进度日志。

## 状态说明

- `Planned`：已规划，尚未开始。
- `In Progress`：正在进行。
- `Blocked`：被外部依赖、权限或决策阻塞。
- `Done`：已实现并完成基本验证。
- `Deferred`：明确延期，不纳入当前阶段。

## 当前重点

当前重点从“本地可运行”转向“测试环境基线、生产化路径、支付物流和测试覆盖”。

当前并行关注点：

- `M2 - 前台内容替换`
- `M4 - 维护、文档与同步准备`
- `M8 - 测试环境与生产化路线`
- `M9 - 测试覆盖与交付门禁`

结构稳定后立即进入：

- `M7 - 支付、物流与履约实装`

当前目标：

- 保持前台内容页与首页业务状态一致；
- 补齐中文文档、项目结构说明和测试门禁；
- 让 `SPEC.md`、`README.md`、`docs/` 和 Lark 同步能力保持同步；
- 形成 staging 最低交付标准；
- 为支付 sandbox 和物流人工履约模块进入实现做好准备。

## 里程碑总览

- `M0`
  名称：项目环境基线
  状态：`Done`
  目标：建立可开发、可构建、可继续部署的 Medusa + Next.js + PostgreSQL + Redis 基线。
- `M1`
  名称：日本 B2B 测试数据基础
  状态：`Done`
  目标：配置日本/JPY 测试数据和纹身商品 sample 目录。
- `M2`
  名称：前台内容替换
  状态：`In Progress`
  目标：把官方 starter 内容改造成 Popink Market 业务前台。
- `M3`
  名称：购买流程验证
  状态：`Done`
  目标：验证浏览、购物车、checkout、测试支付和后台订单查看。
- `M4`
  名称：维护、文档与同步准备
  状态：`In Progress`
  目标：完善中文文档、Lark 同步方案、测试门禁和后续部署准备。
- `M5`
  名称：商品和内容深化
  状态：`Planned`
  目标：扩展真实业务所需的商品字段、内容与运营信息。
- `M6`
  名称：B2B 能力预留
  状态：`Planned`
  目标：为客户审核、批发价、企业资料和询价路线预留清晰结构。
- `M7`
  名称：支付、物流与履约实装
  状态：`Planned`
  目标：支付优先接真实服务 sandbox；物流先建立配送配置、人工履约和 tracking 记录。
- `M8`
  名称：测试环境与生产化路线
  状态：`In Progress`
  目标：为 staging、轻量服务器和后续生产部署建立迁移路径。
- `M9`
  名称：测试覆盖与交付门禁
  状态：`In Progress`
  目标：建立关键模块单元测试和交付前测试通过规则。

## M0 - 项目环境基线

状态：`Done`

已完成：

- 初始化 Git 仓库。
- 使用 `.node-version` 固定 Node 版本为 `22.22.2`。
- 创建 `apps/backend` 与 `apps/storefront` 工作区。
- 接入 Docker PostgreSQL 与 Redis。
- 完成 Medusa migration、seed 与本地管理员初始化。
- 验证后端与前台构建。
- 在 `README.md` 中记录本地开发验证方式。

验证方式：

- `npm run build --workspace=@dtc/backend`
- `npm run build --workspace=@dtc/storefront`
- `http://localhost:9000/health`
- `http://localhost:8000`

## M1 - 日本 B2B 测试数据基础

状态：`Done`

目标：

把官方 starter 默认数据替换为适合日本纹身用品业务的测试数据。

已完成：

- 配置 Japan region。
- 配置 JPY 价格币种。
- 替换默认分类结构。
- 新增耗材、设备、色料和护理 sample 商品。
- 保留测试阶段 payment 与 shipping fallback。
- 验证 `/jp`、商品列表和商品详情可用。
- 在 Admin 中确认商品、库存、region 与支付配送配置可见。

验收标准：

- 前台通过 `/jp` 打开。
- 商品列表显示纹身业务 sample 商品。
- 商品详情展示 JPY 价格。
- sample 商品可加入购物车。

## M2 - 前台内容替换

状态：`In Progress`

目标：

让前台从官方 starter 站点转变为 Popink Market 业务站点，并达到测试环境可验收的基础内容完整度。

已完成：

- 替换首页 hero 文案。
- 替换导航、侧边菜单与 footer 内容。
- 移除明显的 Medusa starter 品牌露出。
- 首页改为直接展示主要分类与最新商品，不再依赖 collection 数据。
- 新增基础静态内容页入口和页面：
  - `/jp/about`
  - `/jp/wholesale`
  - `/jp/shipping`
  - `/jp/returns`
  - `/jp/contact`
- 新增 `docs/github-pages` 纯静态展示页，用于先发布到 `github.io` 展示项目定位、分类结构、页面入口和当前能力边界。

下一步任务：

- `Planned`：检查移动端视口，保证导航、首页和商品页不明显错位。
- `Planned`：决定前台正式语言策略，是中文说明、日文优先还是双语。
- `Planned`：继续收敛首页和分类文案，减少临时占位感。

验收标准：

- 首屏能识别 Popink Market。
- 导航可支持商品发现和内容页访问。
- 内容页结构完整，站点不再像通用 starter。
- 移动端视口保持基本可用。

## M3 - 购买流程验证

状态：`Done`

目标：

确认当前系统支持完整的基础购买流程，为后续支付 sandbox 和物流履约实装提供基线。

已完成：

- 验证客户注册与登录。
- 验证商品加入购物车。
- 验证填写日本地址。
- 验证选择 `Standard Japan Shipping`。
- 验证选择 `pp_system_default` 测试支付 fallback。
- 验证订单提交成功。
- 通过 Admin API 确认订单与 sample 商品可见。

验收标准：

- 可以在本地开发环境完成一笔测试订单。
- 订单可在 Admin 中查看。
- 后续支付与物流实装不得破坏该基础购买链路。

## M4 - 维护、文档与同步准备

状态：`In Progress`

目标：

把项目文档、Lark 同步方式、测试门禁和后续运行维护信息整理完整。

已完成：

- `Done`：新增 `scripts/sync-docs-to-lark.mjs`，支持块级覆盖写入 Lark 文档。
- `Done`：新增 `scripts/import-markdown-to-lark-html.mjs`，支持通过 HTML 导入新建 Lark 文档。
- `Done`：验证 `SPEC.md` 可同步到 Lark。
- `Done`：验证 `docs/MILESTONES.md` 可通过 HTML 导入保留表格效果。
- `Done`：新增 `docs/LARK_SYNC.md` 记录同步方式。
- `Done`：开始统一将仓库文档改为中文。
- `Done`：将项目定位改为 production-first，最低按测试环境标准验收。

下一步任务：

- `In Progress`：统一所有项目说明文档为中文，并保持 production-first 口径。
- `In Progress`：补齐 `SPEC.md` 中的项目文件结构、测试环境标准、生产前阻塞项。
- `Done`：新增 GitHub Pages 静态展示页与 `.github/workflows/deploy-github-pages.yml`，用于发布 `docs/github-pages`。
- `Planned`：整理 GitHub Actions 中与 Lark 同步相关的正式配置说明。
- `Planned`：补充部署与环境变量说明，作为后续 M8 的基础。

验收标准：

- `README.md`、`SPEC.md`、`docs/` 与当前实现一致。
- 文档说明默认使用中文。
- 文档不再把本地运行描述为项目目标。
- `SPEC.md` 和 `docs/MILESTONES.md` 至少各有一条可用的 Lark 输出路径。

## M5 - 商品和内容深化

状态：`Planned`

目标：

把 sample 商品推进到更像真实纹身用品 B2B catalog。

任务：

- 确认真实商品分类体系。
- 确认规格模型，例如针型号、颜色、容量、机器规格、套装。
- 确认商品图片策略。
- 确认描述语言策略。
- 确认税务展示方式与库存策略。

## M6 - B2B 能力预留

状态：`Planned`

目标：

为后续 B2B 能力保留路线，但不在当前结构稳定前过早引入复杂功能。

任务：

- 记录登录后看价格需求。
- 记录客户注册审核需求。
- 记录企业资料字段。
- 评估 Medusa customer group 或自定义模块路线。
- 评估询价单、批量下单与复购路径。

## M7 - 支付、物流与履约实装

状态：`Planned`

目标：

项目结构稳定后立即推进。支付优先接真实服务 sandbox；物流先建立接口、配置和人工履约能力。

任务：

- `Planned`：确认首个支付供应商候选和 sandbox 接入条件。
- `Planned`：建立支付配置分层，本地 fallback 与 staging sandbox 分离。
- `Planned`：梳理支付成功、失败、取消、回调和幂等处理。
- `Planned`：建立物流抽象、配送方式配置和运费规则。
- `Planned`：建立后台人工履约、tracking 记录和履约状态说明。
- `Planned`：为支付与物流模块同步补单元测试。

验收标准：

- staging 默认不以模拟支付作为最终验收。
- 物流至少支持人工履约和 tracking 信息记录。
- 支付和物流相关单元测试通过。

## M8 - 测试环境与生产化路线

状态：`In Progress`

目标：

从本地开发验证走向 staging，再预留生产部署迁移路径。

任务：

- `In Progress`：确认 `local / staging / production` 环境变量分层。
- `In Progress`：验证 `build/start` 或等价非开发态启动方式。
- `Planned`：确认测试环境目标规格。
- `Planned`：确认 PostgreSQL 与 Redis 的托管策略。
- `Planned`：准备生产前安全清单、监控与备份策略。

验收标准：

- 有清晰的 staging 部署路线。
- 生产前必须解决的问题已列出。
- 不再把本机公网访问作为长期运行方案。

## M9 - 测试覆盖与交付门禁

状态：`In Progress`

目标：

建立关键模块单元测试和交付前测试通过规则。

任务：

- `In Progress`：记录“关键模块 + 覆盖率”作为交付门禁。
- `Done`：梳理现有测试框架和 test 脚本缺口。
- `Done`：补齐 root `npm run test` 可执行入口，使 Turbo 实际运行 backend 和 storefront 测试。
- `Done`：将 root scripts 测试纳入 `npm run test`，覆盖统一代理路由和 Lark Markdown 转换。
- `Done`：补齐后端 Jest 跨平台运行脚本，避免 Windows 下 Unix 环境变量写法失效。
- `Done`：新增首批后端 route 单元测试。
- `Done`：新增首批前台 util 单元测试，覆盖 env、金额格式化和地址比较。
- `Done`：新增前台账号表单解析测试，覆盖登录和注册 payload。
- `Done`：新增前台 checkout 地址 payload 测试，覆盖同账单地址和独立账单地址。
- `Done`：新增前台支付和物流数据入口测试，覆盖 payment provider、shipping option、shipping price 计算和失败 fallback。
- `In Progress`：继续补齐前台购买链路、账号注册登录、配置/env、支付、物流、文档同步脚本测试。
- `Planned`：为新增功能建立同任务测试要求。
- `Planned`：根据测试基线设置核心模块覆盖率阈值。

验收标准：

- 新增功能必须带单元测试。
- 修改核心模块必须补被触碰行为的测试。
- 测试不通过不交付。
- 无法测试的部分必须说明原因和残余风险。

## 待集中确认的问题

- 前台正式默认语言是中文、日文还是双语。
- 商品名称和分类名称是否需要日文优先。
- Popink Market 是否作为正式品牌名。
- 是否需要真实 logo、品牌色和字体方案。
- 商品图片先用占位图还是准备真实素材。
- 日本消费税是否按含税价展示。
- 测试环境和生产环境目标平台与预算。
- 首个支付供应商候选。
- 物流服务候选。
- 后续优先邮件服务方案。

## 进度日志

- `2026-04-25` · `M0`
  建立项目基线：Medusa 后端、Next.js 前台、PostgreSQL、Redis、本地管理员和成功构建。
- `2026-04-25` · `M1`
  把官方 starter seed 替换为日本/JPY 纹身商品测试 catalog，并验证 `/jp` 与商品详情页。
- `2026-04-25` · `M2`
  替换首页、导航、侧边菜单和 footer 的 starter 文案，改成 Popink Market 业务定位。
- `2026-04-25` · `M2`
  首页改为直接展示主要分类和最新商品，不再依赖 collection 数据；新增关于、批发、配送、退换货、联系信息页面。
- `2026-04-25` · `M3`
  通过 Store API 验证客户注册/登录、加购、日本地址、测试 payment fallback 和订单提交；通过 Admin API 确认订单可见。
- `2026-04-27` · `M4`
  新增 Lark 块写入同步脚本，可把 `SPEC.md` 推送到 Bot 创建的 Lark 文档。
- `2026-04-27` · `M4`
  新增 HTML 导入脚本，可把 `docs/MILESTONES.md` 导入为保留表格效果的 Lark 文档。
- `2026-04-28` · `M4`
  统一更新项目中文文档，补充 `SPEC.md` 文件结构、Lark 同步说明和当前进度。
- `2026-05-04` · `M4`
  完成公网访问验证记录：前台公网访问可用，后台管理员接口与账号验证通过，但开发态后台不作为稳定交付页面。
- `2026-05-04` · `M4`
  新增验证脚本：`npm run test:demo-customer-login` 和 `npm run test:admin-login`。
- `2026-05-04` · `M8`
  明确后续重点转向后台页面完善与更接近生产的启动方式。
- `2026-05-05` · `M4/M7/M8/M9`
  将项目方向统一为生产上线目标，最低按测试环境标准推进；支付物流提升为结构稳定后的第一主线；新增关键模块测试门禁。
- `2026-05-05` · `M9`
  补齐后端和前台 workspace 的 `test` 脚本；新增首批单元测试；确认 root `npm run test` 可实际执行并通过，当前结果为 backend 2 个测试、storefront 6 个测试通过。
- `2026-05-05` · `M9`
  将脚本测试纳入 root `npm run test`，覆盖 `demo-proxy` 路由判断和 Lark Markdown 转换；当前完整测试结果为 scripts 6 个、backend 2 个、storefront 6 个测试通过。
- `2026-05-05` · `M9`
  补充前台账号、checkout 地址、支付和物流数据入口测试；修复 `setAddresses` 中读取 cart id 缺少 `await` 的问题；当前完整测试结果为 scripts 6 个、backend 2 个、storefront 16 个测试通过。
