import fs from "node:fs/promises";
import path from "node:path";

const DEFAULT_BASE_URL = "https://open.feishu.cn";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getEnv(name, fallback) {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : fallback;
}

function normalizeBaseUrl(input) {
  return input.replace(/\/+$/, "");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeInline(value) {
  let result = escapeHtml(value);
  result = result.replace(/`([^`]+)`/g, "<code>$1</code>");
  result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  result = result.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return result;
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableSeparatorRow(line) {
  const cells = splitTableRow(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function markdownToHtml(markdown, title) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let listType = null;
  let listItems = [];
  let codeFence = null;
  let codeLines = [];

  const flushParagraph = () => {
    if (!paragraph.length) {
      return;
    }
    html.push(`<p>${escapeInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!listType || !listItems.length) {
      listType = null;
      listItems = [];
      return;
    }
    const tag = listType === "ordered" ? "ol" : "ul";
    html.push(`<${tag}>`);
    for (const item of listItems) {
      html.push(`<li>${escapeInline(item)}</li>`);
    }
    html.push(`</${tag}>`);
    listType = null;
    listItems = [];
  };

  const flushCodeFence = () => {
    if (codeFence === null) {
      return;
    }
    const className = codeFence ? ` class="language-${escapeHtml(codeFence)}"` : "";
    html.push(`<pre><code${className}>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
    codeFence = null;
    codeLines = [];
  };

  html.push("<!doctype html>");
  html.push('<html lang="zh-CN">');
  html.push("<head>");
  html.push('<meta charset="utf-8">');
  html.push(`<title>${escapeHtml(title)}</title>`);
  html.push("<style>");
  html.push("body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;line-height:1.65;color:#1f2329;padding:24px;}");
  html.push("table{border-collapse:collapse;width:100%;margin:16px 0;table-layout:fixed;}");
  html.push("th,td{border:1px solid #d0d7de;padding:10px 12px;vertical-align:top;text-align:left;word-break:break-word;}");
  html.push("th{background:#f5f7fa;font-weight:700;}");
  html.push("pre{background:#f5f7fa;padding:12px;border-radius:6px;overflow:auto;}");
  html.push("code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;}");
  html.push("blockquote{margin:16px 0;padding-left:12px;border-left:4px solid #d0d7de;color:#57606a;}");
  html.push("</style>");
  html.push("</head>");
  html.push("<body>");

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const line = rawLine.trimEnd();

    if (codeFence !== null) {
      if (line.startsWith("```")) {
        flushCodeFence();
      } else {
        codeLines.push(rawLine);
      }
      continue;
    }

    const codeFenceMatch = line.match(/^```([\w-]*)\s*$/);
    if (codeFenceMatch) {
      flushParagraph();
      flushList();
      codeFence = codeFenceMatch[1] || "";
      codeLines = [];
      continue;
    }

    if (line.trim().startsWith("|")) {
      const nextLine = lines[index + 1];
      if (nextLine && nextLine.trim().startsWith("|") && isTableSeparatorRow(nextLine)) {
        flushParagraph();
        flushList();
        const headers = splitTableRow(line);
        html.push("<table>");
        html.push("<thead><tr>");
        for (const header of headers) {
          html.push(`<th>${escapeInline(header)}</th>`);
        }
        html.push("</tr></thead>");
        html.push("<tbody>");
        index += 2;
        for (; index < lines.length; index += 1) {
          const tableLine = lines[index];
          if (!tableLine.trim().startsWith("|")) {
            index -= 1;
            break;
          }
          const cells = splitTableRow(tableLine);
          html.push("<tr>");
          for (const cell of cells) {
            html.push(`<td>${escapeInline(cell)}</td>`);
          }
          html.push("</tr>");
        }
        html.push("</tbody></table>");
        continue;
      }
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      html.push(`<h${level}>${escapeInline(headingMatch[2].trim())}</h${level}>`);
      continue;
    }

    const orderedMatch = line.match(/^\s*\d+\.\s+(.*)$/);
    if (orderedMatch) {
      flushParagraph();
      if (listType && listType !== "ordered") {
        flushList();
      }
      listType = "ordered";
      listItems.push(orderedMatch[1].trim());
      continue;
    }

    const bulletMatch = line.match(/^\s*[-*]\s+(.*)$/);
    if (bulletMatch) {
      flushParagraph();
      if (listType && listType !== "bullet") {
        flushList();
      }
      listType = "bullet";
      listItems.push(bulletMatch[1].trim());
      continue;
    }

    const quoteMatch = line.match(/^\s*>\s?(.*)$/);
    if (quoteMatch) {
      flushParagraph();
      flushList();
      html.push(`<blockquote><p>${escapeInline(quoteMatch[1].trim())}</p></blockquote>`);
      continue;
    }

    if (/^\s*---+\s*$/.test(line) || /^\s*\*\*\*+\s*$/.test(line)) {
      flushParagraph();
      flushList();
      html.push("<hr>");
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  flushCodeFence();
  html.push("</body></html>");
  return html.join("\n");
}

async function getTenantAccessToken(baseUrl, appId, appSecret) {
  const response = await fetch(`${baseUrl}/open-apis/auth/v3/tenant_access_token/internal`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  });
  const payload = await response.json();
  if (!response.ok || payload.code !== 0) {
    throw new Error(`Failed to get tenant access token: ${payload.msg || response.statusText}`);
  }
  return payload.tenant_access_token;
}

async function uploadHtmlFile(baseUrl, accessToken, fileName, html) {
  const form = new FormData();
  const buffer = Buffer.from(html, "utf8");
  form.append("file_name", fileName);
  form.append("parent_type", "explorer");
  form.append("parent_node", "");
  form.append("size", String(buffer.byteLength));
  form.append("file", new Blob([buffer], { type: "text/html" }), fileName);

  const response = await fetch(`${baseUrl}/open-apis/drive/v1/files/upload_all`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: form,
  });
  const payload = await response.json();
  if (!response.ok || payload.code !== 0) {
    throw new Error(`Upload failed: ${payload.msg || response.statusText}`);
  }
  return payload.data.file_token;
}

async function createImportTask(baseUrl, accessToken, fileToken, fileName) {
  const response = await fetch(`${baseUrl}/open-apis/drive/v1/import_tasks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      file_extension: "html",
      file_token: fileToken,
      type: "docx",
      file_name: fileName,
      point: {
        mount_type: 1,
        mount_key: "",
      },
    }),
  });
  const payload = await response.json();
  if (!response.ok || payload.code !== 0) {
    throw new Error(`Create import task failed: ${payload.msg || response.statusText}`);
  }
  return payload.data.ticket;
}

async function pollImportTask(baseUrl, accessToken, ticket) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const response = await fetch(`${baseUrl}/open-apis/drive/v1/import_tasks/${ticket}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const payload = await response.json();
    if (!response.ok || payload.code !== 0) {
      throw new Error(`Query import task failed: ${payload.msg || response.statusText}`);
    }

    const result = payload.data.result;
    if (result.job_status === 0) {
      return result;
    }
    if (result.job_status === 2) {
      const message = (result.job_error_msg || "").trim();
      if (message && message.toLowerCase() !== "success") {
        throw new Error(`Import failed: ${message}`);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error(`Import task ${ticket} timed out`);
}

async function main() {
  const appId = requireEnv("LARK_APP_ID");
  const appSecret = requireEnv("LARK_APP_SECRET");
  const source = getEnv("SYNC_SOURCES", "docs/MILESTONES.md");
  const title = getEnv("LARK_DOC_TITLE", path.basename(source));
  const baseUrl = normalizeBaseUrl(getEnv("LARK_BASE_URL", DEFAULT_BASE_URL));

  const sourcePath = path.resolve(source);
  const markdown = await fs.readFile(sourcePath, "utf8");
  const html = markdownToHtml(markdown, title);

  const accessToken = await getTenantAccessToken(baseUrl, appId, appSecret);
  const uploadFileName = `${title}.html`;
  const fileToken = await uploadHtmlFile(baseUrl, accessToken, uploadFileName, html);
  const ticket = await createImportTask(baseUrl, accessToken, fileToken, title);
  const result = await pollImportTask(baseUrl, accessToken, ticket);

  console.log(
    JSON.stringify(
      {
        status: "ok",
        ticket,
        documentId: result.token,
        documentUrl: result.url,
        sourceFile: path.relative(process.cwd(), sourcePath).replaceAll("\\", "/"),
        title,
      },
      null,
      2
    )
  );
}

const isDirectRun = process.argv[1] && import.meta.url === new URL(process.argv[1], "file:").href;

if (isDirectRun) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}

export {
  escapeHtml,
  escapeInline,
  isTableSeparatorRow,
  markdownToHtml,
  normalizeBaseUrl,
  splitTableRow,
};
