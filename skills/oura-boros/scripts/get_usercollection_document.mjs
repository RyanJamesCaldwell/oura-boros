#!/usr/bin/env node

import { existsSync, promises as fs } from "node:fs";
import path from "node:path";

const RESOURCE_CONFIG = {
  daily_activity: {
    kind: "list",
    listPath: "/v2/usercollection/daily_activity",
    singlePath: "/v2/usercollection/daily_activity/{document_id}",
    windowType: "date",
  },
  daily_cardiovascular_age: {
    kind: "list",
    listPath: "/v2/usercollection/daily_cardiovascular_age",
    singlePath: "/v2/usercollection/daily_cardiovascular_age/{document_id}",
    windowType: "date",
  },
  daily_readiness: {
    kind: "list",
    listPath: "/v2/usercollection/daily_readiness",
    singlePath: "/v2/usercollection/daily_readiness/{document_id}",
    windowType: "date",
  },
  daily_resilience: {
    kind: "list",
    listPath: "/v2/usercollection/daily_resilience",
    singlePath: "/v2/usercollection/daily_resilience/{document_id}",
    windowType: "date",
  },
  daily_sleep: {
    kind: "list",
    listPath: "/v2/usercollection/daily_sleep",
    singlePath: "/v2/usercollection/daily_sleep/{document_id}",
    windowType: "date",
  },
  daily_spo2: {
    kind: "list",
    listPath: "/v2/usercollection/daily_spo2",
    singlePath: "/v2/usercollection/daily_spo2/{document_id}",
    windowType: "date",
  },
  daily_stress: {
    kind: "list",
    listPath: "/v2/usercollection/daily_stress",
    singlePath: "/v2/usercollection/daily_stress/{document_id}",
    windowType: "date",
  },
  enhanced_tag: {
    kind: "list",
    listPath: "/v2/usercollection/enhanced_tag",
    singlePath: "/v2/usercollection/enhanced_tag/{document_id}",
    windowType: "date",
  },
  heartrate: {
    kind: "list",
    listPath: "/v2/usercollection/heartrate",
    singlePath: null,
    windowType: "datetime",
  },
  personal_info: {
    kind: "singleton",
    singletonPath: "/v2/usercollection/personal_info",
  },
  rest_mode_period: {
    kind: "list",
    listPath: "/v2/usercollection/rest_mode_period",
    singlePath: "/v2/usercollection/rest_mode_period/{document_id}",
    windowType: "date",
  },
  ring_configuration: {
    kind: "list",
    listPath: "/v2/usercollection/ring_configuration",
    singlePath: "/v2/usercollection/ring_configuration/{document_id}",
    windowType: "none",
    allowLimit: false,
  },
  session: {
    kind: "list",
    listPath: "/v2/usercollection/session",
    singlePath: "/v2/usercollection/session/{document_id}",
    windowType: "date",
  },
  sleep: {
    kind: "list",
    listPath: "/v2/usercollection/sleep",
    singlePath: "/v2/usercollection/sleep/{document_id}",
    windowType: "date",
  },
  sleep_time: {
    kind: "list",
    listPath: "/v2/usercollection/sleep_time",
    singlePath: "/v2/usercollection/sleep_time/{document_id}",
    windowType: "date",
  },
  tag: {
    kind: "list",
    listPath: "/v2/usercollection/tag",
    singlePath: "/v2/usercollection/tag/{document_id}",
    windowType: "date",
  },
  vo2_max: {
    kind: "list",
    listPath: "/v2/usercollection/vO2_max",
    singlePath: "/v2/usercollection/vO2_max/{document_id}",
    windowType: "date",
  },
  workout: {
    kind: "list",
    listPath: "/v2/usercollection/workout",
    singlePath: "/v2/usercollection/workout/{document_id}",
    windowType: "date",
  },
};

function normalizeResource(resource) {
  const normalized = resource.trim();
  if (!normalized) {
    return normalized;
  }

  const lowered = normalized.toLowerCase();
  if (lowered === "vo2max" || lowered === "vo2-max" || lowered === "vo2") {
    return "vo2_max";
  }
  if (normalized === "vO2_max") {
    return "vo2_max";
  }

  return lowered;
}

function parseArgs(argv) {
  const args = {
    resource: "daily_sleep",
    documentId: "",
    latest: false,
    listOnly: false,
    startDate: "",
    endDate: "",
    startDatetime: "",
    endDatetime: "",
    nextToken: "",
    limit: 50,
    apiBase: "https://api.ouraring.com",
    tokenFile: "",
    pretty: true,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    const next = argv[i + 1];

    if (token === "--resource" && next) {
      args.resource = normalizeResource(next);
      i += 1;
      continue;
    }
    if (token === "--document-id" && next) {
      args.documentId = next;
      i += 1;
      continue;
    }
    if (token === "--latest") {
      args.latest = true;
      continue;
    }
    if (token === "--list") {
      args.listOnly = true;
      continue;
    }
    if (token === "--start-date" && next) {
      args.startDate = next;
      i += 1;
      continue;
    }
    if (token === "--end-date" && next) {
      args.endDate = next;
      i += 1;
      continue;
    }
    if (token === "--start-datetime" && next) {
      args.startDatetime = next;
      i += 1;
      continue;
    }
    if (token === "--end-datetime" && next) {
      args.endDatetime = next;
      i += 1;
      continue;
    }
    if (token === "--next-token" && next) {
      args.nextToken = next;
      i += 1;
      continue;
    }
    if (token === "--limit" && next) {
      const parsed = Number(next);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new Error(`Invalid --limit: ${next}`);
      }
      args.limit = Math.floor(parsed);
      i += 1;
      continue;
    }
    if (token === "--api-base" && next) {
      args.apiBase = next.replace(/\/$/, "");
      i += 1;
      continue;
    }
    if (token === "--token-file" && next) {
      args.tokenFile = next;
      i += 1;
      continue;
    }
    if (token === "--no-pretty") {
      args.pretty = false;
      continue;
    }
    if (token === "--help" || token === "-h") {
      printHelp();
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  args.resource = normalizeResource(args.resource);
  if (!RESOURCE_CONFIG[args.resource]) {
    throw new Error(
      `Unsupported resource "${args.resource}". Supported: ${Object.keys(
        RESOURCE_CONFIG
      ).join(", ")}`
    );
  }

  return args;
}

function printHelp() {
  const supportedResources = Object.keys(RESOURCE_CONFIG).join(", ");
  const defaultTokenFile = resolveDefaultTokenFile();
  console.log(`Usage:
  get_usercollection_document.mjs [options]

Options:
  --resource <name>         Health resource (default: daily_sleep)
  --document-id <id>        Fetch a specific document (resources with single-doc routes)
  --latest                  Get latest item from list route (and single-doc hydrate when available)
  --list                    Return list response for selected resource
  --start-date YYYY-MM-DD   Date window start (date-based resources)
  --end-date YYYY-MM-DD     Date window end (date-based resources)
  --start-datetime ISO8601  Datetime window start (heartrate)
  --end-datetime ISO8601    Datetime window end (heartrate)
  --next-token <token>      Pagination token for list mode
  --limit <n>               List page size hint (default: 50)
  --api-base <url>          API base (default: https://api.ouraring.com)
  --token-file <path>       Token file path override
  --no-pretty               Print compact JSON
  -h, --help                Show help

Supported resources:
  ${supportedResources}

Special case:
  personal_info is a singleton endpoint. Call with only --resource personal_info.

Token sources (in order):
  1) OURA_ACCESS_TOKEN env
  2) --token-file path
  3) OURA_TOKEN_FILE env
  4) ${defaultTokenFile}
  5) Legacy fallback: .context/oura-token.json in current directory
     (used only if present and default token path does not exist)

Refresh support:
  If token file has refresh_token and expiry_date is near/expired,
  the script refreshes via /oauth/token when OURA_CLIENT_ID and
  OURA_CLIENT_SECRET are present.
`);
}

function isoDate(offsetDays = 0) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isoDatetime(offsetHours = 0) {
  const d = new Date(Date.now() + offsetHours * 60 * 60 * 1000);
  return d.toISOString();
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function writeJson(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), {
    encoding: "utf8",
    mode: 0o600,
  });
  await fs.chmod(filePath, 0o600);
}

function resolveDefaultTokenFile() {
  const xdgConfigHome = process.env.XDG_CONFIG_HOME?.trim();
  if (xdgConfigHome) {
    return path.resolve(xdgConfigHome, "oura-boros", "token.json");
  }

  if (process.platform === "win32") {
    const appData = process.env.APPDATA?.trim() || process.env.LOCALAPPDATA?.trim();
    if (appData) {
      return path.resolve(appData, "oura-boros", "token.json");
    }
  }

  const homeDir = process.env.HOME?.trim() || process.env.USERPROFILE?.trim();
  if (homeDir) {
    return path.resolve(homeDir, ".config", "oura-boros", "token.json");
  }

  return path.resolve(process.cwd(), ".context/oura-token.json");
}

function resolveTokenFile(explicitPath) {
  if (explicitPath?.trim()) {
    return path.resolve(explicitPath.trim());
  }

  if (process.env.OURA_TOKEN_FILE?.trim()) {
    return path.resolve(process.env.OURA_TOKEN_FILE.trim());
  }

  const defaultTokenFile = resolveDefaultTokenFile();
  const legacyTokenFile = path.resolve(process.cwd(), ".context/oura-token.json");
  if (existsSync(legacyTokenFile) && !existsSync(defaultTokenFile)) {
    return legacyTokenFile;
  }

  return defaultTokenFile;
}

async function refreshTokenIfNeeded({ apiBase, tokenFile, tokenData }) {
  const expiresAt = Number(tokenData?.expiry_date ?? 0);
  const refreshToken = String(tokenData?.refresh_token ?? "").trim();
  const clientId = process.env.OURA_CLIENT_ID?.trim() || "";
  const clientSecret = process.env.OURA_CLIENT_SECRET?.trim() || "";

  const expiresSoon =
    Number.isFinite(expiresAt) && expiresAt > 0 && expiresAt - Date.now() <= 60_000;
  if (!expiresSoon) {
    return tokenData;
  }
  if (!refreshToken || !clientId || !clientSecret) {
    return tokenData;
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(`${apiBase}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed (${response.status})`);
  }

  const payload = await response.json();
  const updated = {
    ...tokenData,
    access_token: payload.access_token,
    refresh_token: payload.refresh_token ?? tokenData.refresh_token,
    token_type: payload.token_type ?? tokenData.token_type,
    scope: payload.scope ?? tokenData.scope,
    expiry_date: payload.expires_in
      ? Date.now() + payload.expires_in * 1000
      : tokenData.expiry_date,
    updated_at: Date.now(),
  };

  await writeJson(tokenFile, updated);
  return updated;
}

async function resolveAccessToken({ apiBase, tokenFile }) {
  const envToken = process.env.OURA_ACCESS_TOKEN?.trim();
  if (envToken) {
    return { accessToken: envToken, source: "OURA_ACCESS_TOKEN" };
  }

  let tokenData;
  try {
    tokenData = await readJson(tokenFile);
  } catch {
    throw new Error(
      `No access token found. Set OURA_ACCESS_TOKEN or provide a token file at ${tokenFile}`
    );
  }

  const maybeRefreshed = await refreshTokenIfNeeded({
    apiBase,
    tokenFile,
    tokenData,
  });
  const accessToken = String(maybeRefreshed?.access_token ?? "").trim();
  if (!accessToken) {
    throw new Error(`Token file exists but access_token is missing: ${tokenFile}`);
  }

  return { accessToken, source: tokenFile };
}

async function getJson(url, accessToken) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { raw: text };
  }

  if (!response.ok) {
    const err = new Error(`Request failed ${response.status}`);
    err.status = response.status;
    err.payload = payload;
    throw err;
  }

  return payload;
}

function toEpochCandidate(item) {
  if (!item || typeof item !== "object") {
    return Number.NaN;
  }
  const ts = typeof item.timestamp === "string" ? Date.parse(item.timestamp) : Number.NaN;
  if (Number.isFinite(ts)) {
    return ts;
  }
  const dayTs = typeof item.day === "string" ? Date.parse(`${item.day}T00:00:00Z`) : Number.NaN;
  if (Number.isFinite(dayTs)) {
    return dayTs;
  }
  return Number.NaN;
}

function pickLatestItem(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  let latest = data[0];
  let latestEpoch = toEpochCandidate(latest);

  for (let i = 1; i < data.length; i += 1) {
    const candidate = data[i];
    const candidateEpoch = toEpochCandidate(candidate);
    if (!Number.isFinite(candidateEpoch)) {
      continue;
    }
    if (!Number.isFinite(latestEpoch) || candidateEpoch > latestEpoch) {
      latest = candidate;
      latestEpoch = candidateEpoch;
    }
  }

  return latest;
}

function buildListUrl(args, config) {
  if (!config.listPath) {
    throw new Error(`Resource \"${args.resource}\" does not support list access.`);
  }

  const url = new URL(`${args.apiBase}${config.listPath}`);

  if (config.allowLimit !== false) {
    url.searchParams.set("limit", String(args.limit));
  }
  if (args.nextToken) {
    url.searchParams.set("next_token", args.nextToken);
  }

  if (config.windowType === "date") {
    url.searchParams.set("start_date", args.startDate || isoDate(-7));
    url.searchParams.set("end_date", args.endDate || isoDate(0));
  } else if (config.windowType === "datetime") {
    url.searchParams.set("start_datetime", args.startDatetime || isoDatetime(-24));
    url.searchParams.set("end_datetime", args.endDatetime || isoDatetime(0));
  }

  return url.toString();
}

function buildSingleUrl(args, config, documentId) {
  if (!config.singlePath) {
    return null;
  }
  return `${args.apiBase}${config.singlePath.replace(
    "{document_id}",
    encodeURIComponent(documentId)
  )}`;
}

async function main() {
  const args = parseArgs(process.argv);
  const config = RESOURCE_CONFIG[args.resource];
  const tokenFile = resolveTokenFile(args.tokenFile);

  const { accessToken, source } = await resolveAccessToken({
    apiBase: args.apiBase,
    tokenFile,
  });

  if (config.kind === "singleton") {
    if (args.documentId || args.listOnly || args.latest) {
      throw new Error(
        `Resource \"${args.resource}\" is singleton. Call without --document-id, --list, or --latest.`
      );
    }

    const url = `${args.apiBase}${config.singletonPath}`;
    const data = await getJson(url, accessToken);
    console.log(
      JSON.stringify(
        {
          ok: true,
          mode: "singleton",
          resource: args.resource,
          endpoint: config.singletonPath,
          tokenSource: source,
          data,
        },
        null,
        args.pretty ? 2 : 0
      )
    );
    return;
  }

  if (args.documentId) {
    if (!config.singlePath) {
      throw new Error(`Resource "${args.resource}" does not support --document-id`);
    }
    const singleUrl = buildSingleUrl(args, config, args.documentId);
    const data = await getJson(singleUrl, accessToken);
    console.log(
      JSON.stringify(
        {
          ok: true,
          mode: "single",
          resource: args.resource,
          endpoint: config.singlePath,
          documentId: args.documentId,
          tokenSource: source,
          data,
        },
        null,
        args.pretty ? 2 : 0
      )
    );
    return;
  }

  const listUrl = buildListUrl(args, config);
  const listData = await getJson(listUrl, accessToken);

  if (args.listOnly && !args.latest) {
    console.log(
      JSON.stringify(
        {
          ok: true,
          mode: "list",
          resource: args.resource,
          endpoint: config.listPath,
          tokenSource: source,
          data: listData,
        },
        null,
        args.pretty ? 2 : 0
      )
    );
    return;
  }

  if (!args.latest) {
    throw new Error(
      "Missing selector. Use one of: --document-id <id>, --latest, or --list."
    );
  }

  const latest = pickLatestItem(listData?.data);
  if (!latest) {
    throw new Error("No records found for the requested window.");
  }

  const latestId = typeof latest.id === "string" ? latest.id : "";
  if (latestId && config.singlePath) {
    const singleUrl = buildSingleUrl(args, config, latestId);
    const hydrated = await getJson(singleUrl, accessToken);
    console.log(
      JSON.stringify(
        {
          ok: true,
          mode: "latest-single",
          resource: args.resource,
          endpoint: config.singlePath,
          listEndpoint: config.listPath,
          documentId: latestId,
          tokenSource: source,
          data: hydrated,
        },
        null,
        args.pretty ? 2 : 0
      )
    );
    return;
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        mode: "latest-list-item",
        resource: args.resource,
        endpoint: config.listPath,
        tokenSource: source,
        data: latest,
      },
      null,
      args.pretty ? 2 : 0
    )
  );
}

main().catch((error) => {
  const status = typeof error?.status === "number" ? error.status : null;
  const payload = error?.payload ?? null;

  console.error(
    JSON.stringify(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        status,
        details: payload,
      },
      null,
      2
    )
  );
  process.exit(1);
});
