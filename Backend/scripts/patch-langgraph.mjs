import fs from "node:fs";
import path from "node:path";

// --- Patch 1: @langchain/langgraph's untraceable "./node.js" import ---
const langgraphFile = path.resolve(
  "node_modules/@langchain/langgraph/dist/index.js"
);

if (fs.existsSync(langgraphFile)) {
  let content = fs.readFileSync(langgraphFile, "utf8");

  const oldImport =
    'import { initializeAsyncLocalStorageSingleton } from "./node.js";';

  const newCode = `import { AsyncLocalStorageProviderSingleton } from "@langchain/core/singletons";
import { AsyncLocalStorage } from "node:async_hooks";

function initializeAsyncLocalStorageSingleton() {
  AsyncLocalStorageProviderSingleton.initializeGlobalInstance(
    new AsyncLocalStorage()
  );
}`;

  if (content.includes(oldImport)) {
    content = content.replace(oldImport, newCode);
    fs.writeFileSync(langgraphFile, content);
    console.log("LangGraph node.js import patched successfully.");
  } else {
    console.log("LangGraph import already patched or changed.");
  }
} else {
  console.log("LangGraph index.js not found, skipping patch.");
}

// --- Patch 2: @langchain/core's block_translators registry ---
// This file statically imports 11 provider translator files. Vercel's
// serverless file-tracer intermittently fails to include some of these
// nested files in the deployment bundle, causing ERR_MODULE_NOT_FOUND at
// runtime. We only ever use Google and OpenAI-compatible providers in this
// project, so we strip the registry down to just those two, removing the
// untraceable imports entirely instead of hoping Vercel includes them.
const coreTranslatorsFile = path.resolve(
  "node_modules/@langchain/core/dist/messages/block_translators/index.js"
);

if (fs.existsSync(coreTranslatorsFile)) {
  const content = fs.readFileSync(coreTranslatorsFile, "utf8");

  const alreadyPatched = content.includes("PATCHED_BLOCK_TRANSLATORS");

  if (!alreadyPatched) {
    const newContent = `// PATCHED_BLOCK_TRANSLATORS: trimmed to only the providers this project uses
import { ChatOpenAITranslator } from "./openai.js";
import { ChatGoogleTranslator } from "./google.js";

globalThis.lc_block_translators_registry ??= /* @__PURE__ */ new Map([
\t["google", ChatGoogleTranslator],
\t["openai", ChatOpenAITranslator]
]);

function getTranslator(modelProvider) {
\treturn globalThis.lc_block_translators_registry.get(modelProvider);
}

export { getTranslator };
`;
    fs.writeFileSync(coreTranslatorsFile, newContent);
    console.log("langchain/core block_translators patched successfully.");
  } else {
    console.log("langchain/core block_translators already patched.");
  }
} else {
  console.log("langchain/core block_translators/index.js not found, skipping patch.");
}