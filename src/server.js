import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildSystemMessage, normalizeMessages } from "./assistantConfig.js";
import { loadEnvFile } from "./env.js";
import { createLeadPool, initLeadDatabase, listLeads, saveLead } from "./leadStore.js";
import { chatWithOllama, streamWithOllama } from "./ollamaClient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT_DIR, "data");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const PUBLIC_DIR = existsSync(DIST_DIR) ? DIST_DIR : path.join(ROOT_DIR, "public");

loadEnvFile(path.join(ROOT_DIR, ".env"));

const PORT = Number(process.env.PORT || 3001);
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:7b";
const FAST_REPLY_TOKENS = Number(process.env.FAST_REPLY_TOKENS || 56);
const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const leadPool = createLeadPool(DATABASE_URL);
let leadDatabasePromise;

const CONTENT_TYPES = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".ico", "image/x-icon"],
]);

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(body));
}

function isAdminAuthorized(request) {
  if (!ADMIN_TOKEN) {
    return true;
  }

  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const bearerToken = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  const queryToken = requestUrl.searchParams.get("token");

  return bearerToken === ADMIN_TOKEN || queryToken === ADMIN_TOKEN;
}

async function ensureLeadDatabase() {
  if (!leadPool) {
    throw new Error("DATABASE_URL is not configured. Add your local PostgreSQL connection string to .env.");
  }

  leadDatabasePromise ??= initLeadDatabase(leadPool);
  await leadDatabasePromise;
  return leadPool;
}

async function readJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");

  if (!raw.trim()) {
    return {};
  }

  return JSON.parse(raw);
}

let assistantDataPromise;

function loadAssistantData() {
  assistantDataPromise ??= Promise.all([
    readFile(path.join(DATA_DIR, "runtime-prompt.md"), "utf8"),
    readFile(path.join(DATA_DIR, "runtime-knowledge.md"), "utf8"),
  ]).then(([systemPrompt, knowledgeBase]) => ({ systemPrompt, knowledgeBase }));

  return assistantDataPromise;
}

async function warmOllamaModel() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90_000);

  try {
    const { systemPrompt, knowledgeBase } = await loadAssistantData();

    for (const language of ["en", "fr"]) {
      await chatWithOllama({
        baseUrl: OLLAMA_BASE_URL,
        model: OLLAMA_MODEL,
        messages: [
          buildSystemMessage({ systemPrompt, knowledgeBase, language }),
          { role: "user", content: "Reply with: ready" },
        ],
        signal: controller.signal,
        numPredict: 2,
      });
    }

    console.log("Ollama model is warm.");
  } catch (error) {
    console.warn(
      `Ollama warmup skipped: ${error instanceof Error ? error.message : "Unknown warmup error"}`,
    );
  } finally {
    clearTimeout(timeout);
  }
}

async function handleChat(request, response) {
  try {
    const body = await readJsonBody(request);
    const userMessages = normalizeMessages(body.messages);
    const language = body.language === "fr" ? "fr" : "en";

    if (userMessages.length === 0) {
      sendJson(response, 400, {
        error: "Send at least one user message.",
      });
      return;
    }

    const { systemPrompt, knowledgeBase } = await loadAssistantData();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90_000);

    try {
      const reply = await chatWithOllama({
        baseUrl: OLLAMA_BASE_URL,
        model: OLLAMA_MODEL,
        messages: [
          buildSystemMessage({ systemPrompt, knowledgeBase, language }),
          ...userMessages.slice(-16),
        ],
        signal: controller.signal,
        numPredict: FAST_REPLY_TOKENS,
      });

      sendJson(response, 200, { reply, model: OLLAMA_MODEL });
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    const fallback =
      "Astro Assistant is taking a little longer than usual. You can still leave your project details, and the ASTROQODELABS team can follow up.";

    sendJson(response, 503, {
      error: error instanceof Error ? error.message : "Unknown chat error",
      fallback,
    });
  }
}

async function handleChatStream(request, response) {
  let didStartStream = false;

  try {
    const body = await readJsonBody(request);
    const userMessages = normalizeMessages(body.messages);
    const language = body.language === "fr" ? "fr" : "en";

    if (userMessages.length === 0) {
      sendJson(response, 400, {
        error: "Send at least one user message.",
      });
      return;
    }

    const { systemPrompt, knowledgeBase } = await loadAssistantData();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90_000);

    response.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    });
    didStartStream = true;

    try {
      let questionCount = 0;
      let streamedCharacters = 0;
      const maxStreamedCharacters = 420;

      for await (const token of streamWithOllama({
        baseUrl: OLLAMA_BASE_URL,
        model: OLLAMA_MODEL,
        messages: [
          buildSystemMessage({ systemPrompt, knowledgeBase, language }),
          ...userMessages.slice(-10),
        ],
        signal: controller.signal,
        numPredict: FAST_REPLY_TOKENS,
      })) {
        let safeToken = "";

        for (const character of token) {
          safeToken += character;
          streamedCharacters += 1;

          if (character === "?") {
            questionCount += 1;

            if (questionCount >= 1) {
              break;
            }
          }
        }

        response.write(safeToken);

        if (questionCount >= 1 || streamedCharacters >= maxStreamedCharacters) {
          break;
        }
      }
      response.end();
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    const fallback =
      "Astro Assistant is taking a little longer than usual. You can still leave your project details, and the ASTROQODELABS team can follow up.";

    if (didStartStream && !response.writableEnded) {
      response.write(`\n\n${fallback}`);
      response.end();
      return;
    }

    sendJson(response, 503, {
      error: error instanceof Error ? error.message : "Unknown chat error",
      fallback,
    });
  }
}

async function handleHealth(response) {
  try {
    const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    const data = await ollamaResponse.json();
    const models = Array.isArray(data.models) ? data.models.map((model) => model.name) : [];

    sendJson(response, 200, {
      ok: true,
      ollama: ollamaResponse.ok,
      model: OLLAMA_MODEL,
      models,
    });
  } catch (error) {
    sendJson(response, 200, {
      ok: true,
      ollama: false,
      model: OLLAMA_MODEL,
      error: error instanceof Error ? error.message : "Unknown health error",
    });
  }
}

async function handleSaveLead(request, response) {
  try {
    const body = await readJsonBody(request);
    const pool = await ensureLeadDatabase();
    const lead = await saveLead(pool, body);

    sendJson(response, 201, { lead });
  } catch (error) {
    sendJson(response, 503, {
      error: error instanceof Error ? error.message : "Unknown lead save error",
    });
  }
}

async function handleListLeads(request, response) {
  if (!isAdminAuthorized(request)) {
    sendJson(response, 401, { error: "Unauthorized" });
    return;
  }

  try {
    const pool = await ensureLeadDatabase();
    const leads = await listLeads(pool);

    sendJson(response, 200, { leads });
  } catch (error) {
    sendJson(response, 503, {
      error: error instanceof Error ? error.message : "Unknown lead list error",
    });
  }
}

async function serveStatic(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const safePath =
    requestUrl.pathname === "/" || requestUrl.pathname === "/admin"
      ? "/index.html"
      : requestUrl.pathname;
  const filePath = path.resolve(PUBLIC_DIR, `.${safePath}`);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const file = await readFile(filePath);
    const contentType = CONTENT_TYPES.get(path.extname(filePath)) || "application/octet-stream";

    response.writeHead(200, { "Content-Type": contentType });
    response.end(file);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

const server = createServer(async (request, response) => {
  if (request.method === "GET" && request.url?.startsWith("/api/health")) {
    await handleHealth(response);
    return;
  }

  if (request.method === "GET" && request.url?.startsWith("/api/admin/leads")) {
    await handleListLeads(request, response);
    return;
  }

  if (request.method === "POST" && request.url?.startsWith("/api/leads")) {
    await handleSaveLead(request, response);
    return;
  }

  if (request.method === "GET" && request.url === "/favicon.ico") {
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.method === "POST" && request.url?.startsWith("/api/chat")) {
    if (request.url?.startsWith("/api/chat-stream")) {
      await handleChatStream(request, response);
      return;
    }

    await handleChat(request, response);
    return;
  }

  if (request.method === "GET") {
    await serveStatic(request, response);
    return;
  }

  response.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Method not allowed");
});

server.listen(PORT, () => {
  console.log(`Astro Assistant prototype running at http://localhost:${PORT}`);
  console.log(`Using Ollama model ${OLLAMA_MODEL} at ${OLLAMA_BASE_URL}`);
  loadAssistantData().catch((error) => {
    console.warn(`Assistant data cache failed: ${error instanceof Error ? error.message : "Unknown cache error"}`);
  });
  warmOllamaModel();
});
