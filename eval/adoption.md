# Adoption proxies

Anthropic does not publish per-skill install counts. Until they do, we
read four indirect signals. None alone is authoritative; together they
are enough to spot a trend.

## 1. npm downloads of `@haruspex-guru/mcp-server`

Strongest proxy. Every skill in this repo requires the MCP server to
function, so server installs ≈ active skill users (with a small tail of
people who use the MCP tools freeform without the skills).

- Live chart: <https://www.npmjs.com/package/@haruspex-guru/mcp-server>
- API: `npm view @haruspex-guru/mcp-server`
- Programmatic weekly downloads:
  `https://api.npmjs.org/downloads/point/last-week/@haruspex-guru/mcp-server`

Read weekly, not daily — daily counts are noisy and include CI installs.

## 2. GitHub repo traffic

- Stars / forks: <https://github.com/Haruspex-guru/haruspex-skills>
- Clone count + unique cloners (last 14 days):
  <https://github.com/Haruspex-guru/haruspex-skills/graphs/traffic>
- Referrer breakdown on the same page shows where new users find us.

The `git clone` count is the closest GitHub gives us to install count.

## 3. Claude.ai skill marketplace

If/when Anthropic exposes per-skill install or invocation counts in the
claude.ai Skills UI, capture screenshots monthly. As of 2026-04, the UI
does not surface these.

## 4. Issue / PR signal

A weak but real proxy: people only file issues against tools they use.
Track open issue count and external (non-maintainer) PR count over time
in the GitHub Insights → Contributors view.

## How to use this doc

Once a month, paste the four numbers into a row in a running log
(spreadsheet, Notion, whatever). The deltas matter, not the absolutes.
A negative delta on npm weekly downloads + flat clones is the early
warning that something regressed.

## What this doc is not

This is the **adoption** layer — how many people have the skills. It
does not measure how often skills run, which tools they call, or
whether the output is any good. Those live in:

- `eval/usage-dashboards.md` — runtime MCP call volume (Stage 2)
- skill-invocation pings via `record_skill_invocation` (Stage 3)
- `eval/` runner — output quality (Stage 4)
