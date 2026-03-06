# Oura Boros Skill

<p align="center">
  <img src="./assets/oura-boros.png" alt="Oura Boros" />
</p>

`oura-boros` is a portable skill package for reading Oura Cloud v2 health data through OAuth2 bearer tokens.

Skill path in this repo:
- `skills/oura-boros`

## Install

### GitHub Copilot CLI

Install directly from GitHub:

```bash
copilot plugin install github.com/ryanjamescaldwell/oura-boros
```

### Codex

Install directly from GitHub:

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo ryanjamescaldwell/oura-boros \
  --path skills/oura-boros
```

Restart Codex after install.

### Claude Code

Fetch from GitHub, then run Claude with the plugin directory:

```bash
git clone https://github.com/ryanjamescaldwell/oura-boros.git
claude --plugin-dir ./oura-boros
```

## Oura API Access

See API access instructions here: https://cloud.ouraring.com/v2/docs#section/Getting-Started/Quick-Start-Guide

## Required Environment

- `OURA_CLIENT_ID`
- `OURA_CLIENT_SECRET`
- Optional `OURA_TOKEN_FILE`
  (default: `$XDG_CONFIG_HOME/oura-boros/token.json` or `~/.config/oura-boros/token.json`;
  legacy fallback: `.context/oura-token.json` in current working directory if present and default file is missing)
- Optional `OURA_ACCESS_TOKEN` (overrides token file if set)

## Quick Verify

From this repo root:

```bash
OURA_TOKEN_FILE=/absolute/path/to/oura-token.json \
  node skills/oura-boros/scripts/get_usercollection_document.mjs --resource personal_info

OURA_TOKEN_FILE=/absolute/path/to/oura-token.json \
  node skills/oura-boros/scripts/get_usercollection_document.mjs --resource daily_sleep --latest

OURA_TOKEN_FILE=/absolute/path/to/oura-token.json \
  node skills/oura-boros/scripts/get_usercollection_document.mjs --resource heartrate --latest --start-datetime 2026-03-05T00:00:00Z --end-datetime 2026-03-06T00:00:00Z
```

## Common Errors

- `401` with scope detail:
  - Re-run OAuth with expanded `OURA_SCOPES` and reconnect.
- `No records found for the requested window.`:
  - widen date/datetime range.

## Notes

- `skills/oura-boros/scripts/get_daily_sleep_document.mjs` is a compatibility wrapper for daily sleep.
- Main multi-endpoint entrypoint is `skills/oura-boros/scripts/get_usercollection_document.mjs`.
