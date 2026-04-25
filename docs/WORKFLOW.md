# Popink Market 工作规则

本文档定义项目中的规划、实现、文档和验收如何保持同步。

## 事实来源

- `SPEC.md` 定义产品意图、范围、非目标和验收标准。
- `docs/MILESTONES.md` 定义执行顺序、当前进度和里程碑验收标准。
- `README.md` 定义如何在本地启动和维护项目。
- 代码和配置定义真实实现状态。

当这些内容不一致时，按下面顺序更新：

1. 如果产品范围或业务规则变化，先更新 `SPEC.md`。
2. 如果执行计划、任务状态或验收标准变化，更新 `docs/MILESTONES.md`。
3. 如果 setup、命令、URL、账号或运行方式变化，更新 `README.md`。
4. 最后更新代码、配置和测试，使实现匹配已确认范围。

## 里程碑工作流

开始一个有意义的实现任务前：

- 确认任务属于哪个 milestone。
- 查看 `docs/MILESTONES.md` 中列出的相关 `SPEC.md` 章节。
- 如果任务已经被 milestone 跟踪，把任务状态标记为 `In Progress`。

实现过程中：

- 改动尽量限制在当前 milestone 范围内。
- 如果出现新需求，先更新 `SPEC.md`，或记录到 milestone 的待确认决策中，再实现。
- 如果任务延期，标记为 `Deferred`，并说明原因。

实现完成后：

- 运行相关验证命令。
- 更新 `docs/MILESTONES.md` 中的任务状态。
- 在进度日志中添加日期、milestone 和结果。
- 如果命令、环境变量或使用方式变化，更新 `README.md`。

## 决策记录规则

当一个决策会影响后续开发、部署或业务范围时，需要记录。

适合记录的例子：

- 前台默认语言。
- 地区和币种假设。
- 支付方式策略。
- 物流方式策略。
- 保留、定制或替换某个 Medusa starter 功能。
- 某个需求是否进入当前 demo 范围。

小的实现细节通常不需要记录，除非它会形成长期约束。

## Git 工作流

- 每完成一个稳定 milestone 或一个清晰功能切片后提交。
- 不要把无关 milestone 的改动混在同一个 commit。
- commit message 保持简洁，例如 `chore: establish local medusa baseline`。
- 不要提交 `.env`、日志、`node_modules`、构建产物或本地 Docker 数据。

## 验证工作流

每次改动使用最小但有意义的验证方式。

基础构建检查：

```powershell
npm run build --workspace=@dtc/backend
npm run build --workspace=@dtc/storefront
```

运行时检查：

```powershell
npm run db:up
npm run backend:dev
npm run storefront:dev
```

预期本地地址：

```text
后端健康检查: http://localhost:9000/health
Admin:        http://localhost:9000/app
前台:         http://localhost:8000
```

## 当前 Demo 默认原则

除非 `SPEC.md` 后续修改，否则优先遵守：

- 先 demo，后生产。
- 默认面向日本市场。
- 默认用户是纹身行业 B2B 客户。
- demo 阶段公开显示价格。
- demo 阶段不做客户审核。
- demo 阶段只使用模拟支付和模拟物流。
- 除非 milestone 需要定制，否则优先保留 Medusa 的框架惯例。
