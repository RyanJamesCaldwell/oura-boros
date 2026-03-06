---
name: oura-boros
description: Call Oura Cloud v2 health endpoints with OAuth2 bearer tokens. Use when implementing, testing, or debugging Oura pulls for sleep, stress, readiness, activity, heartrate, workouts, sessions, tags, and profile data.
---

Use this skill to make reliable Oura v2 API calls with minimal setup.

## Workflow

1. Ensure OAuth is completed and token data exists.
2. Run `scripts/get_usercollection_document.mjs` with:
- `--resource <name>` to select endpoint family.
- `--latest` for newest entry in the requested window.
- `--document-id <id>` for direct single-document fetch (for resources that support it).
- `--list` when list payloads are preferred.
3. Confirm response JSON and copy only the fields needed for downstream tasks.

## Commands

Latest daily sleep:

```bash
node skills/oura-boros/scripts/get_usercollection_document.mjs --resource daily_sleep --latest
```

Latest daily stress:

```bash
node skills/oura-boros/scripts/get_usercollection_document.mjs --resource daily_stress --latest
```

Latest workout:

```bash
node skills/oura-boros/scripts/get_usercollection_document.mjs --resource workout --latest
```

Latest heartrate point (datetime window):

```bash
node skills/oura-boros/scripts/get_usercollection_document.mjs --resource heartrate --latest --start-datetime 2026-03-05T00:00:00Z --end-datetime 2026-03-06T00:00:00Z
```

Personal info singleton:

```bash
node skills/oura-boros/scripts/get_usercollection_document.mjs --resource personal_info
```

Direct known document:

```bash
node skills/oura-boros/scripts/get_usercollection_document.mjs --resource daily_sleep --document-id <document_id>
```

Backwards compatibility (`daily_sleep` wrapper):

```bash
node skills/oura-boros/scripts/get_daily_sleep_document.mjs
```

## Token Handling

Token resolution order:
1. `OURA_ACCESS_TOKEN` env var.
2. JSON token file at `--token-file`.
3. `OURA_TOKEN_FILE` env var.
4. Default user path:
`$XDG_CONFIG_HOME/oura-boros/token.json` or `~/.config/oura-boros/token.json`.
5. Legacy fallback: `.context/oura-token.json` in current working directory
   (used when present and the default user path file is missing).

If token file includes `refresh_token`, the script auto-refreshes when expired (or near expiry) using:
- `OURA_CLIENT_ID`
- `OURA_CLIENT_SECRET`

## Supported Resources

- `daily_activity`
- `daily_cardiovascular_age`
- `daily_readiness`
- `daily_resilience`
- `daily_sleep`
- `daily_spo2`
- `daily_stress`
- `enhanced_tag`
- `heartrate`
- `personal_info`
- `rest_mode_period`
- `ring_configuration`
- `session`
- `sleep`
- `sleep_time`
- `tag`
- `vo2_max` (alias accepted: `vO2_max`)
- `workout`

## References

- Endpoint + params: `references/oura-v2-usercollection.md`
