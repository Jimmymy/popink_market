import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { markdownToHtml } from "../import-markdown-to-lark-html.mjs"
import { markdownToBlocks, normalizeBaseUrl, parseDocumentUrl } from "../sync-docs-to-lark.mjs"

describe("Lark markdown conversion", () => {
  it("converts headings, lists, tables, and code fences to docx blocks", () => {
    const blocks = markdownToBlocks(`# Title

- One

| A | B |
| --- | --- |
| 1 | 2 |

\`\`\`ts
const value = 1
\`\`\`
`)

    assert.equal(blocks[0].block_type, 3)
    assert.equal(blocks.some((block) => block.block_type === 12), true)
    assert.equal(blocks.some((block) => block.block_type === 14), true)
  })

  it("converts markdown tables and inline formatting to HTML", () => {
    const html = markdownToHtml(`| A | B |
| --- | --- |
| **x** | \`y\` |
`, "Doc")

    assert.match(html, /<table>/)
    assert.match(html, /<strong>x<\/strong>/)
    assert.match(html, /<code>y<\/code>/)
  })

  it("normalizes Lark base URLs and parses document URLs", () => {
    assert.equal(normalizeBaseUrl("https://open.feishu.cn///"), "https://open.feishu.cn")

    assert.deepEqual(
      parseDocumentUrl("https://example.feishu.cn/docx/AbCdEf123"),
      { type: "docx", token: "AbCdEf123" }
    )

    assert.deepEqual(
      parseDocumentUrl("https://example.feishu.cn/wiki/wikcnToken"),
      { type: "wiki", token: "wikcnToken" }
    )
  })
})
