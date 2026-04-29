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

## Quickstart — Claude Desktop

1. Install `@haruspex/mcp-server`. Edit your
   `claude_desktop_config.json`:
   ```json
   {
     "mcpServers": {
       "haruspex": {
         "command": "npx",
         "args": ["-y", "@haruspex/mcp-server"],
         "env": { "HARUSPEX_API_KEY": "hrspx_demo_public_REPLACE_ME" }
       }
     }
   }
   ```
2. Clone the skills into your Skills directory:
   ```bash
   git clone https://github.com/Haruspex-guru/haruspex-skills.git
   cp -r haruspex-skills/skills/* ~/Library/Application\ Support/Claude/skills/
   ```
3. Restart Claude Desktop.
4. Ask a single-ticker question: "What do you think about NVDA?" — the
   `haruspex-stock-analyst` skill should auto-trigger.

## Quickstart — Claude Code

1. Set up `.claude/mcp.json` in your project (see [`shared/MCP_SETUP.md`](shared/MCP_SETUP.md)).
2. Clone into the user-level skills directory:
   ```bash
   git clone https://github.com/Haruspex-guru/haruspex-skills.git ~/haruspex-skills
   cp -r ~/haruspex-skills/skills/* ~/.claude/skills/
   ```
3. Reload your workspace in Claude Code.
4. Verify with `/mcp` and by asking a stock question.

## Quickstart — Claude.ai

1. Open Claude.ai → Settings → Skills.
2. Upload each skill folder from `skills/` as a new skill.
3. Configure `@haruspex/mcp-server` in the appropriate MCP integration
   surface.

## Quickstart — Claude API

The Claude API supports skills via the
[Skills API](https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills/overview).
Bundle the skill directory and pass it to your agent runtime alongside the
MCP server connection. See the official docs for current syntax.

## Prerequisites

All skills require **`@haruspex/mcp-server`** to be installed and connected.
Full install instructions for Claude Desktop, Claude Code, Cursor, and
Windsurf are in [`shared/MCP_SETUP.md`](shared/MCP_SETUP.md).

You'll also need a Haruspex API key. Get one at <https://haruspex.guru>.
**Never commit your API key to a repository.**

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
