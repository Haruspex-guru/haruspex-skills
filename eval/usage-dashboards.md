# Usage dashboards (admin)

Runtime usage for the skills + MCP surface lives behind the
**haruspex.guru admin API**. Four endpoints, all gated by the existing
admin role/session.

> **Status (2026-04-30):** API spec is defined; the haruspex.guru PR
> implementing these endpoints is not merged yet. Until it ships, fall
> back to `eval/adoption.md` for manual proxies. This file documents
> the target state.

## Endpoints

All under `https://haruspex.guru/admin/usage/`. Auth via the same
admin session you use elsewhere on the admin panel.

### `GET /admin/usage/skills`

How often each skill was invoked.

```
GET /admin/usage/skills?from=2026-04-01&to=2026-04-30&groupBy=day,skill
```

Response rows: `{ day, skill, client, count }`.

`client` is one of `claude-code`, `claude-ai`, `claude-api`,
`unknown` — best-effort tag set by the skill at ping time.

### `GET /admin/usage/mcp`

How often each MCP tool was called and on what tickers.

```
GET /admin/usage/mcp?from=2026-04-01&to=2026-04-30&groupBy=day,tool
GET /admin/usage/mcp?ticker=NVDA&groupBy=day
```

Response rows: `{ day, tool, ticker, count }`.

Backed by the existing API request log — this is the closest thing to
a value signal because every skill ultimately calls the MCP server.

### `GET /admin/usage/adoption`

Cached daily snapshot of npm + GitHub adoption proxies.

```
GET /admin/usage/adoption
```

Response: `{ as_of, npm: { weekly_downloads }, github: { stars,
forks, clones_14d, uniques_14d } }`.

Refresh frequency: daily cron. The endpoint serves the latest
snapshot; if the snapshot is older than 25 hours it forces a refresh
inline. See `eval/adoption.md` for the underlying source URLs and
manual fallback instructions.

### `POST /admin/usage/skill-invocation`

**Ingest only — not for human use.** This is what the MCP server's
`record_skill_invocation` tool POSTs to on every skill load. Auth is
the user's normal Haruspex API key (not an admin session). Documented
here only so on-call knows what's hitting it during incidents.

## How to read the numbers

- **Skill invocation count vs MCP call count.** A healthy skill
  invocation produces ≥1 MCP call. If `GET /admin/usage/skills`
  shows 1000 invocations and `GET /admin/usage/mcp` shows 200 calls
  for the same window, either skills are short-circuiting (no data
  fetch) or the ping is firing without a real run. Investigate.
- **`unknown` client share.** If `unknown` dominates, the skill
  instructions aren't reliably setting the `client` field — tighten
  the SKILL.md telemetry step.
- **Ticker concentration.** A few tickers will dominate; that's
  expected. Watch for *new* tickers entering the top-10 — that's a
  signal about what users are starting to ask about.

## What this does not measure

- Output quality. That's the eval runner's job
  (`eval/runner/`, planned).
- Trigger accuracy ("did the right skill load?"). Still manual,
  see `eval/README.md`.
- Per-user behavior. Aggregate only by design.

## Privacy

Pings carry only `{ skill, version, client }` plus a hashed API key
id, never conversation content or tickers from the chat. Users can
disable by setting `HARUSPEX_TELEMETRY=0` in the MCP server env;
`record_skill_invocation` becomes a no-op. MCP tool call logging is
unaffected by that flag — it's the same request log that powers
billing and rate-limit accounting.
