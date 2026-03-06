#!/usr/bin/env node

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetScript = path.join(__dirname, "get_usercollection_document.mjs");

const incomingArgs = process.argv.slice(2);
const hasSelector =
  incomingArgs.includes("--latest") ||
  incomingArgs.includes("--list") ||
  incomingArgs.includes("--document-id");

const forwardedArgs = [
  "--resource",
  "daily_sleep",
  ...incomingArgs,
  ...(hasSelector ? [] : ["--latest"]),
];

const child = spawn(process.execPath, [targetScript, ...forwardedArgs], {
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
