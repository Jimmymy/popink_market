import fs from "node:fs/promises";
import path from "node:path";

const DEFAULT_BASE_URL = "https://open.feishu.cn";
const DEFAULT_DOC_TITLE = "Popink Market Docs Sync";
const MAX_BLOCKS_PER_REQUEST = 50;

const languageMap = new Map([
  ["bash", 46],
  ["shell", 46],
  ["sh", 46],
  ["zsh", 46],
  ["powershell", 42],
  ["ps1", 42],
  ["javascript", 23],
  ["js", 23],
  ["typescript", 49],
  ["ts", 49],
  ["tsx", 49],
  ["json", 24],
  ["html", 21],
  ["css", 17],
  ["sql", 47],
  ["python", 40],
  ["py", 40],
  ["go", 20],
  ["java", 22],
  ["rust", 44],
  ["rs", 44],
  ["yaml", 53],
  ["yml", 53],
  ["markdown", 30],
  ["md", 30],
]);

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

function chunk(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function textElements(content) {
  return [{ text_run: { content } }];
}

function makeParagraphBlock(content) {
  return {
    block_type: 2,
    text: {
      elements: textElements(content),
      style: { align: 1 },
    },
  };
}

function makeHeadingBlock(level, content) {
  const safeLevel = Math.min(Math.max(level, 1), 9);
  return {
    block_type: 2 + safeLevel,
    [`heading${safeLevel}`]: {
      elements: textElements(content),
      style: { align: 1 },
    },
  };
}

function makeBulletBlock(content) {
  return {
    block_type: 12,
    bullet: {
      elements: textElements(content),
      style: { align: 1 },
    },
  };
}

function makeOrderedBlock(content) {
  return {
    block_type: 13,
    ordered: {
      elements: textElements(content),
      style: { align: 1 },
    },
  };
}

function makeQuoteBlock(content) {
  return {
    block_type: 15,
    quote: {
      elements: textElements(content),
      style: { align: 1 },
    },
  };
}

function makeCodeBlock(content, language) {
  return {
    block_type: 14,
    code: {
      elements: textElements(content),
      style: {
        language: languageMap.get(language.toLowerCase()) ?? 1,
        wrap: true,
      },
    },
  };
}

function makeDividerBlock() {
  return {
    block_type: 22,
    divider: {},
  };
}

function splitTableRow(line) {
  const trimmed = line.trim();
  const normalized = trimmed.replace(/^\|/, "").replace(/\|$/, "");
  return normalized.split("|").map((cell) => cell.trim());
}

function isTableSeparatorRow(line) {
  const cells = splitTableRow(line);
  return (
    cells.length > 0 &&
    cells.every((cell) => /^:?-{3,}:?$/.test(cell))
  );
}

function makeTableRowBlock(headers, cells) {
  const parts = headers.map((header, index) => {
    const value = cells[index] ?? "";
    return `${header}: ${value}`;
  });
  return makeBulletBlock(parts.join(" | "));
}

function markdownToBlocks(markdown) {
  const blocks = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let paragraph = [];
  let codeFence = null;
  let codeLines = [];
  let tableHeader = null;

  const flushParagraph = () => {
    if (!paragraph.length) {
      return;
    }
    blocks.push(makeParagraphBlock(paragraph.join(" ").trim()));
    paragraph = [];
  };

  const flushCodeFence = () => {
    if (codeFence === null) {
      return;
    }
    blocks.push(makeCodeBlock(codeLines.join("\n"), codeFence));
    codeFence = null;
    codeLines = [];
  };

  const flushTable = () => {
    tableHeader = null;
  };

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const rawLine = lines[lineIndex];
    const line = rawLine.replace(/\t/g, "  ");

    if (codeFence !== null) {
      if (line.startsWith("```")) {
        flushCodeFence();
      } else {
        codeLines.push(rawLine);
      }
      continue;
    }

    if (tableHeader && line.trim().startsWith("|")) {
      blocks.push(makeTableRowBlock(tableHeader, splitTableRow(line)));
      continue;
    }

    flushTable();

    const codeFenceMatch = line.match(/^```([\w-]*)\s*$/);
    if (codeFenceMatch) {
      flushParagraph();
      codeFence = codeFenceMatch[1] || "plaintext";
      codeLines = [];
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      blocks.push(makeHeadingBlock(headingMatch[1].length, headingMatch[2].trim()));
      continue;
    }

    if (line.trim().startsWith("|")) {
      const nextLine = lines[lineIndex + 1];
      if (nextLine && nextLine.trim().startsWith("|") && isTableSeparatorRow(nextLine)) {
        flushParagraph();
        tableHeader = splitTableRow(line);
        blocks.push(makeParagraphBlock(tableHeader.join(" | ")));
        lineIndex += 1;
        continue;
      }
    }

    const bulletMatch = line.match(/^\s*[-*]\s+(.*)$/);
    if (bulletMatch) {
      flushParagraph();
      blocks.push(makeBulletBlock(bulletMatch[1].trim()));
      continue;
    }

    const orderedMatch = line.match(/^\s*\d+\.\s+(.*)$/);
    if (orderedMatch) {
      flushParagraph();
      blocks.push(makeOrderedBlock(orderedMatch[1].trim()));
      continue;
    }

    const quoteMatch = line.match(/^\s*>\s?(.*)$/);
    if (quoteMatch) {
      flushParagraph();
      blocks.push(makeQuoteBlock(quoteMatch[1].trim()));
      continue;
    }

    if (/^\s*---+\s*$/.test(line) || /^\s*\*\*\*+\s*$/.test(line)) {
      flushParagraph();
      blocks.push(makeDividerBlock());
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  flushCodeFence();
  return blocks;
}

async function listMarkdownFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(fullPath)));
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
}

async function buildContentFromFiles(files) {
  if (!files.length) {
    throw new Error("No markdown files selected for sync");
  }

  const rendered = [];
  const timestamp = new Date().toISOString();
  rendered.push(`# Docs Sync`);
  rendered.push("");
  rendered.push(`Updated at: ${timestamp}`);

  for (const file of files) {
    const relativePath = path.relative(process.cwd(), file).replaceAll("\\", "/");
    const content = await fs.readFile(file, "utf8");
    rendered.push("");
    rendered.push("---");
    rendered.push("");
    rendered.push(`## ${relativePath}`);
    rendered.push("");
    rendered.push(content.trim());
    rendered.push("");
  }

  return rendered.join("\n");
}

async function resolveSourceFiles() {
  const sources = getEnv("SYNC_SOURCES", "SPEC.md")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!sources.length) {
    throw new Error("SYNC_SOURCES is empty");
  }

  const resolved = [];
  for (const source of sources) {
    const absolutePath = path.resolve(source);
    const stats = await fs.stat(absolutePath).catch(() => null);
    if (!stats) {
      throw new Error(`Sync source does not exist: ${source}`);
    }

    if (stats.isDirectory()) {
      const files = await listMarkdownFiles(absolutePath);
      resolved.push(...files);
      continue;
    }

    resolved.push(absolutePath);
  }

  return [...new Set(resolved)].sort((left, right) => left.localeCompare(right));
}

async function larkRequest(baseUrl, accessToken, method, pathname, body) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const raw = await response.text();
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    throw new Error(
      `Lark API ${method} ${pathname} returned non-JSON response with status ${response.status}: ${raw.slice(0, 300)}`
    );
  }
  if (!response.ok || payload.code !== 0) {
    const message = payload.msg || response.statusText;
    throw new Error(`Lark API ${method} ${pathname} failed: ${message}`);
  }

  return payload.data;
}

async function getTenantAccessToken(baseUrl, appId, appSecret) {
  const response = await fetch(`${baseUrl}/open-apis/auth/v3/tenant_access_token/internal`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  });

  const raw = await response.text();
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    throw new Error(
      `Failed to get tenant access token: non-JSON response with status ${response.status}: ${raw.slice(0, 300)}`
    );
  }
  if (!response.ok || payload.code !== 0) {
    const message = payload.msg || response.statusText;
    throw new Error(`Failed to get tenant access token: ${message}`);
  }

  return payload.tenant_access_token;
}

function parseDocumentUrl(rawUrl) {
  if (!rawUrl) {
    return null;
  }

  const url = new URL(rawUrl);
  const docMatch = url.pathname.match(/\/docx\/([A-Za-z0-9]+)/);
  if (docMatch) {
    return { type: "docx", token: docMatch[1] };
  }

  const wikiMatch = url.pathname.match(/\/wiki\/([A-Za-z0-9]+)/);
  if (wikiMatch) {
    return { type: "wiki", token: wikiMatch[1] };
  }

  throw new Error(`Unsupported Lark document URL: ${rawUrl}`);
}

async function resolveDocumentIdFromWikiNode(baseUrl, accessToken, wikiNodeToken) {
  const params = new URLSearchParams({ token: wikiNodeToken });
  const data = await larkRequest(
    baseUrl,
    accessToken,
    "GET",
    `/open-apis/wiki/v2/spaces/get_node?${params.toString()}`,
  );

  const node = data.node ?? data;
  if (node.obj_type !== "docx" || !node.obj_token) {
    throw new Error(`Wiki node ${wikiNodeToken} is not backed by a docx document`);
  }

  return node.obj_token;
}

async function ensureDocument(baseUrl, accessToken, documentId, title, folderToken) {
  if (documentId) {
    return documentId;
  }

  const data = await larkRequest(baseUrl, accessToken, "POST", "/open-apis/docx/v1/documents", {
    title,
    ...(folderToken ? { folder_token: folderToken } : {}),
  });

  return data.document?.document_id ?? data.document_id;
}

async function listAllBlocks(baseUrl, accessToken, documentId) {
  let hasMore = true;
  let pageToken = null;
  const items = [];

  while (hasMore) {
    const params = new URLSearchParams({ page_size: "500" });
    if (pageToken) {
      params.set("page_token", pageToken);
    }

    const data = await larkRequest(
      baseUrl,
      accessToken,
      "GET",
      `/open-apis/docx/v1/documents/${documentId}/blocks?${params.toString()}`
    );

    items.push(...data.items);
    hasMore = Boolean(data.has_more);
    pageToken = data.page_token || null;
  }

  return items;
}

async function deleteAllChildren(baseUrl, accessToken, documentId, rootBlock) {
  const childCount = Array.isArray(rootBlock.children) ? rootBlock.children.length : 0;
  if (!childCount) {
    return;
  }

  await larkRequest(
    baseUrl,
    accessToken,
    "DELETE",
    `/open-apis/docx/v1/documents/${documentId}/blocks/${rootBlock.block_id}/children/batch_delete`,
    {
      start_index: 0,
      end_index: childCount,
    }
  );
}

async function appendBlocks(baseUrl, accessToken, documentId, rootBlockId, blocks) {
  const groups = chunk(blocks, MAX_BLOCKS_PER_REQUEST);

  for (const group of groups) {
    await larkRequest(
      baseUrl,
      accessToken,
      "POST",
      `/open-apis/docx/v1/documents/${documentId}/blocks/${rootBlockId}/children`,
      {
        children: group,
        index: -1,
      }
    );
  }
}

async function main() {
  const appId = requireEnv("LARK_APP_ID");
  const appSecret = requireEnv("LARK_APP_SECRET");
  const baseUrl = normalizeBaseUrl(getEnv("LARK_BASE_URL", DEFAULT_BASE_URL));
  const documentTitle = getEnv("LARK_DOC_TITLE", DEFAULT_DOC_TITLE);
  const folderToken = getEnv("LARK_DOC_FOLDER_TOKEN", "");
  const providedDocumentId = getEnv("LARK_DOC_ID", "");
  const providedDocumentUrl = getEnv("LARK_DOC_URL", "");

  const sourceFiles = await resolveSourceFiles();
  const markdown = await buildContentFromFiles(sourceFiles);
  const blocks = markdownToBlocks(markdown);
  if (!blocks.length) {
    throw new Error("No blocks generated from markdown content");
  }

  const accessToken = await getTenantAccessToken(baseUrl, appId, appSecret);
  let resolvedDocumentId = providedDocumentId;

  if (!resolvedDocumentId && providedDocumentUrl) {
    const parsedUrl = parseDocumentUrl(providedDocumentUrl);
    if (parsedUrl?.type === "docx") {
      resolvedDocumentId = parsedUrl.token;
    } else if (parsedUrl?.type === "wiki") {
      resolvedDocumentId = await resolveDocumentIdFromWikiNode(baseUrl, accessToken, parsedUrl.token);
    }
  }

  const documentId = await ensureDocument(
    baseUrl,
    accessToken,
    resolvedDocumentId,
    documentTitle,
    folderToken
  );

  const blockList = await listAllBlocks(baseUrl, accessToken, documentId);
  const rootBlock = blockList.find((item) => item.block_type === 1);
  if (!rootBlock) {
    throw new Error(`Failed to find root block for document ${documentId}`);
  }

  await deleteAllChildren(baseUrl, accessToken, documentId, rootBlock);
  await appendBlocks(baseUrl, accessToken, documentId, rootBlock.block_id, blocks);

  console.log(
    JSON.stringify(
      {
        status: "ok",
        documentId,
        documentUrl: `https://feishu.cn/docx/${documentId}`,
        sourceFiles: sourceFiles.map((file) => path.relative(process.cwd(), file).replaceAll("\\", "/")),
        blockCount: blocks.length,
      },
      null,
      2
    )
  );

  if (!resolvedDocumentId && !providedDocumentUrl) {
    console.log("Save this document ID into LARK_DOC_ID for future scheduled runs:", documentId);
  }
}

const isDirectRun = process.argv[1] && import.meta.url === new URL(process.argv[1], "file:").href;

if (isDirectRun) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}

export {
  chunk,
  isTableSeparatorRow,
  markdownToBlocks,
  normalizeBaseUrl,
  parseDocumentUrl,
  splitTableRow,
};
