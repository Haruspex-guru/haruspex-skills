# haruspex-skills

**Anthropic Skills for stock traders, powered by Haruspex.**

This repository packages a small, focused set of [Anthropic Agent Skills](https://github.com/anthropics/skills)
that turn Claude into a stock-intelligence assistant. The skills wrap the
Haruspex 16-dimension scoring system and ship the analysis workflows traders
actually use day-to-day — single-ticker reads, watchlist scans, thesis
checks, and a Japanese-language flagship variant.

The skills depend on **`@haruspex/mcp-server`** for live data. Without the MCP
server installed, the skills will detect that, output install instructions,
and stop — they will never fabricate analysis.

## What's in this repo

| Skill | Purpose |
|-------|---------|
| [`haruspex-stock-analyst`](skills/haruspex-stock-analyst/) | Single-ticker fundamental + signals analysis. The default for any "what about [TICKER]?" question. |
| [`haruspex-watchlist-review`](skills/haruspex-watchlist-review/) | Batched review of a multi-ticker watchlist. Ranked tables, biggest movers, dimensional flags. |
| [`haruspex-thesis-tracker`](skills/haruspex-thesis-tracker/) | Maps a stated investment thesis to the relevant Haruspex dimensions and reports whether the data still aligns. |
| [`haruspex-stock-analyst-ja`](skills/haruspex-stock-analyst-ja/) | 日本語版 of the flagship analyst, for traders working in Japanese on US-listed equities (NYSE/NASDAQ). |

Each skill is a folder containing a `SKILL.md` with YAML frontmatter, a
`reference.md` for deeper docs, and an `examples.md` with full example
dialogues using **real captured data**.

## Surface support matrix

| Surface | Skills | MCP | Status |
|---|---|---|---|
| **Claude Code** (terminal CLI) | ✅ filesystem `~/.claude/skills/` | ✅ `claude mcp add-json` | Fully tested |
| **Claude.ai web** (browser) | ✅ ZIP upload via Settings → Customize → Skills | ✅ via Connectors | Supported |
| **Claude API** (SDK) | ✅ bundle in request | ✅ pass server config | See Anthropic docs |
| **Claude Desktop app** | ❌ user-installable skills not supported as of v0.1.0 | ✅ `claude_desktop_config.json` | MCP works; skills don't (use Claude Code instead) |
| **Cursor / Windsurf** | ❌ Anthropic Agent Skills not natively supported | ✅ MCP works | MCP-only; no skills runtime |

## Quickstart — Claude Code (recommended)

This is the path we test against.

1. **Install skills.** From this repo:
   ```bash
   git clone https://github.com/Haruspex-guru/haruspex-skills.git
   mkdir -p ~/.claude/skills
   cp -r haruspex-skills/skills/* ~/.claude/skills/
   ```
2. **Register the MCP server** at user scope (works in any project):
   ```bash
   claude mcp add-json --scope user haruspex '{
     "command": "npx",
     "args": ["-y", "@haruspex/mcp-server"],
     "env": { "HARUSPEX_API_KEY": "hrspx_demo_public_REPLACE_ME" }
   }'
   ```
   Replace `hrspx_demo_public_REPLACE_ME` with your real key from
   <https://haruspex.guru>.
3. **Verify:**
   ```bash
   claude mcp list           # haruspex should show ✓ Connected
   ```
   Then in a Claude Code session:
   ```
   /mcp                      # browse Haruspex tools
   /skills                   # see all 4 haruspex skills (✔ on)
   ```
4. **Try a query:**
   ```
   What do you think about NVDA?
   ```
   The `haruspex-stock-analyst` skill auto-triggers, calls the MCP tools, and
   returns structured analysis with a verifiable share URL.

## Quickstart — Claude.ai (web)

1. **Enable code execution** in Claude.ai if you haven't already
   (Settings → Capabilities).
2. **Package each skill as a ZIP.** From this repo:
   ```bash
   cd skills
   for d in */; do (cd "$d" && zip -r "../${d%/}.zip" .); done
   ```
   Produces 4 ZIPs in the `skills/` directory.
3. **Upload each ZIP:** claude.ai → Settings → Customize → Skills → "+" →
   Upload a skill. Repeat for all four.
4. **Configure `@haruspex/mcp-server`** via Connectors (the Connectors UI is
   separate from local Desktop config). Use your Haruspex API key.
5. **Try a query** in any chat: "What do you think about NVDA?"

> Heads-up: skills uploaded to claude.ai are subject to Anthropic's review
> guidelines for third-party content. "Only install skills from trusted
> sources" applies — Haruspex skills do not execute arbitrary code, but
> users should still review the SKILL.md files before installing.

## Quickstart — Claude API / SDK

The Claude API supports Agent Skills programmatically. Bundle the skill
directories with your request and pass the MCP server configuration
alongside. See Anthropic's official Skills API docs for current syntax.

## Claude Desktop — current limitation

The native Claude Desktop app does **not** load user-installable filesystem
skills as of v0.1.0 of this repo (April 2026). Desktop's skills runtime
currently only surfaces a built-in set (docx, pdf, pptx, etc.).

The MCP server side does work in Claude Desktop — see
[`shared/MCP_SETUP.md`](shared/MCP_SETUP.md) for `claude_desktop_config.json`
setup. But without a skills runtime, you'd be left calling MCP tools
freeform rather than getting the structured workflow these skills enforce.

**For Desktop users today: install Claude Code and use it from your
terminal**, or use claude.ai web with the ZIP upload flow above. Anthropic
may add filesystem-skills support to Desktop later; this repo will update
when that ships.

## Prerequisites

- A Haruspex API key — sign up at <https://haruspex.guru>. **Never commit
  your API key to a repository.**
- One of: Claude Code, Claude.ai web, or the Claude API.
- Node.js 18+ if you're running `@haruspex/mcp-server` via `npx`.

Full per-surface MCP setup details live in
[`shared/MCP_SETUP.md`](shared/MCP_SETUP.md).

## Compliance & disclaimer

These skills produce **analysis, not advice**. Every skill is hard-coded with
compliance rules that prohibit direct buy/sell/hold recommendations, price
predictions, position sizing, and stop-loss/take-profit specifics. Every
skill output includes the canonical disclaimer footer.

The full disclaimer language and the rationale behind each compliance rule
are in [`shared/DISCLAIMER.md`](shared/DISCLAIMER.md). Treat that file and
the "Compliance rules (NEVER VIOLATE)" sections of each `SKILL.md` as
load-bearing.

Nothing in this repository is investment advice. Haruspex scores are
quantitative signals derived from public data, provided for informational
purposes only.

## Topic dimensions

The Haruspex score is a composite of 16 topic dimensions (e.g. `competitors`,
`earnings`, `supplychain`, `us_china_official`). Plain-English descriptions of
all 16 are in [`shared/DIMENSIONS.md`](shared/DIMENSIONS.md). The scoring
methodology itself is proprietary and intentionally not documented here.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md). The short version:

- Open an issue before opening a PR for non-trivial changes.
- Run `bash scripts/validate-skills.sh` before submitting.
- Examples must use **real captured data** from the live API. Fabrication
  will be rejected.
- Compliance language is non-negotiable.

## Eval queries

[`eval/queries/`](eval/queries/) contains ~20 trigger-test queries per skill
(half should-trigger, half should-not, with cross-skill ambiguity cases). Use
them when revising any skill's `description` field. See
[`eval/README.md`](eval/README.md) for the manual evaluation procedure.

## License

[MIT](LICENSE). The skills (instructions and examples in this repository)
are MIT-licensed. The Haruspex scoring algorithm and underlying data are
proprietary; access is governed by the
[Haruspex API Terms of Service](https://haruspex.guru).

## Where this came from

Built for the Haruspex community, inspired by patterns we've seen work in
real trader workflows. Submissions to the official
[`anthropics/skills`](https://github.com/anthropics/skills) catalog will
follow once the skills have a stable shape here.
