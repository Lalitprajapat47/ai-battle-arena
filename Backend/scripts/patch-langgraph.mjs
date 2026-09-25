import fs from "node:fs";
import path from "node:path";

const file = path.resolve(
  "node_modules/@langchain/langgraph/dist/index.js"
);

if (!fs.existsSync(file)) {
  console.log("LangGraph index.js not found, skipping patch.");
  process.exit(0);
}

let content = fs.readFileSync(file, "utf8");

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
  fs.writeFileSync(file, content);
  console.log("LangGraph node.js import patched successfully.");
} else {
  console.log("LangGraph import already patched or changed.");
}