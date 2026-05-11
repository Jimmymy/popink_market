# Lark 文档同步说明

本文档说明仓库内的 Lark 文档同步方式、适用场景和当前结论。

## 两种同步方式

### 1. 块写入同步

脚本：

- `scripts/sync-docs-to-lark.mjs`

命令：

```powershell
npm run docs:sync:lark
```

适用场景：

- 目标文档已经存在；
- 文档内容以标题、段落、列表、引用、代码块为主；
- 可以接受 Markdown 表格退化为普通文本或列表结构。

特点：

- 直接覆盖已有 Bot 文档正文；
- 支持 `SPEC.md` 这类普通结构文档；
- 不适合需要原生表格显示的文档。

### 2. HTML 导入同步

脚本：

- `scripts/import-markdown-to-lark-html.mjs`

命令：

```powershell
npm run docs:import:lark
```

适用场景：

- 文档中包含 Markdown 表格；
- 需要在 Lark 中尽量保留表格结构和更稳定的排版；
- 可以接受“导入后生成一个新的 Lark 文档”，而不是覆盖旧文档。

特点：

- 先把 Markdown 转为 HTML；
- 再通过导入任务生成新的 Lark `docx` 文档；
- 已验证适合 `docs/MILESTONES.md`。

## 必要环境变量

必填：

- `LARK_APP_ID`
- `LARK_APP_SECRET`
- `LARK_BASE_URL`

常用可选项：

- `LARK_DOC_ID`
- `LARK_DOC_URL`
- `LARK_DOC_TITLE`
- `LARK_DOC_FOLDER_TOKEN`
- `SYNC_SOURCES`

国际版 Lark 示例：

```powershell
$env:LARK_BASE_URL="https://open.larksuite.com"
```

## 常见命令示例

### 把 `SPEC.md` 同步到已有 Lark 文档

```powershell
$env:LARK_APP_ID="你的 app id"
$env:LARK_APP_SECRET="你的 app secret"
$env:LARK_BASE_URL="https://open.larksuite.com"
$env:LARK_DOC_ID="目标文档 id"
$env:SYNC_SOURCES="SPEC.md"
npm run docs:sync:lark
```

### 把 `docs/MILESTONES.md` 导入为新的 Lark 文档

```powershell
$env:LARK_APP_ID="你的 app id"
$env:LARK_APP_SECRET="你的 app secret"
$env:LARK_BASE_URL="https://open.larksuite.com"
$env:LARK_DOC_TITLE="MILESTONES.md"
$env:SYNC_SOURCES="docs/MILESTONES.md"
npm run docs:import:lark
```

## 当前结论

- `SPEC.md` 推荐使用块写入同步。
- `docs/MILESTONES.md` 推荐使用 HTML 导入同步，因为其“里程碑总览”和“进度日志”需要保留表格效果。
- 如果已有 Lark 文档是由别人创建，Bot 可能只有读权限或无法覆盖正文。
- 如果 Lark 文档由 Bot 创建，通常更容易继续被 Bot 维护。

## GitHub Actions 说明

仓库内已有：

- `.github/workflows/sync-lark-docs.yml`

当前它更接近基础示例。若要正式启用，建议先根据实际需要收口：

- 明确同步目标是 `SPEC.md` 还是其他文档；
- 明确使用块写入还是 HTML 导入；
- 在 GitHub Secrets 中配置正式使用的文档 ID、URL 和凭证。

## 注意事项

- 块写入同步不会保留真正的表格块。
- HTML 导入会新建文档，不会覆盖原有 `docx`。
- Bot 创建的 Lark 文档通常由 Bot 持有文档级控制权限。
- 项目中的 Lark 同步相关说明文档也必须保持中文。
