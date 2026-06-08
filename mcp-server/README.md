# @haruspex-guru/mcp-server

[![npm version](https://img.shields.io/npm/v/@haruspex-guru/mcp-server.svg)](https://www.npmjs.com/package/@haruspex-guru/mcp-server)
[![npm downloads](https://img.shields.io/npm/dm/@haruspex-guru/mcp-server.svg)](https://www.npmjs.com/package/@haruspex-guru/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> **Live multi-dimension stock scoring for Claude, Cursor, Windsurf, and any MCP-compatible client.** Ask any LLM "what's the score for AAPL?" and get a 0-100 composite score, outlook, trading signal, and 26 specialized AI dimensions — fundamentals, sentiment, geopolitical risk, supply chain health, and more.

## What you get

```
You: What's the Haruspex score for NVDA?

Claude: NVDA — Haruspex Score: 72/100 (cautiously bullish)
        Signal: BUY  |  Change: +3 (vs. yesterday)

        Top dimensions:
          AI Exposure       89/100  (+2)
          Competitors       78/100  (=)
          Fundamentals      71/100  (+1)
          Insider Activity  62/100  (-4)

        https://haruspex.guru/s/NVDA
```

Real data, real backend, real API. Not a prompt template.

## Tools

| Tool | What it does | Credits |
|------|--------------|--------:|
| `get_stock_score` | Latest score (0–100), outlook, signal, dimension breakdown, share URL | 1 |
| `get_stock_score_history` | Daily scores over a date range (trend analysis, momentum shifts) | 2 |
| `get_batch_scores` | Scores for up to 50 tickers in one call | 1/symbol |
| `search_stocks` | Find tickers by symbol or company name | 1 |
| `get_stock_news` | Recent articles driving score changes | 1 |

Free tier: 100 credits/month. Paid plans on [haruspex.guru/pricing](https://haruspex.guru/pricing).

## Quickstart

### 1. Get an API key

Sign up at [haruspex.guru](https://haruspex.guru) → Settings → API Keys → create.

Format: `hrspx_...` (different from the embed-key system used by Wix/Lovable).

### 2. Configure your MCP client

#### Claude Code

```bash
claude mcp add-json --scope user haruspex '{
  "command": "npx",
  "args": ["-y", "@haruspex-guru/mcp-server"],
  "env": {
    "HARUSPEX_API_KEY": "hrspx_your_key_here",
    "HARUSPEX_CLIENT": "claude-code"
  }
}'
```

Verify:

```bash
claude mcp list
# haruspex: ... ✓ Connected
```

#### Claude Desktop

Edit `claude_desktop_config.json`:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "haruspex": {
      "command": "npx",
      "args": ["-y", "@haruspex-guru/mcp-server"],
      "env": {
        "HARUSPEX_API_KEY": "hrspx_your_key_here",
        "HARUSPEX_CLIENT": "claude-desktop"
      }
    }
  }
}
```

Restart Claude Desktop fully (Cmd+Q on macOS, then reopen).

#### Cursor

```json
// ~/.cursor/mcp.json
{
  "mcpServers": {
    "haruspex": {
      "command": "npx",
      "args": ["-y", "@haruspex-guru/mcp-server"],
      "env": {
        "HARUSPEX_API_KEY": "hrspx_your_key_here",
        "HARUSPEX_CLIENT": "claude-code"
      }
    }
  }
}
```

#### Windsurf

Same JSON, path `~/.codeium/windsurf/mcp_config.json`.

#### Claude.ai (web) — Connectors

Settings → Connectors → Add custom MCP server. Same JSON shape.

#### Base44

[See the dedicated walkthrough](https://haruspex.guru/integrations/base44).

#### Gemini CLI

Use the dedicated [`@haruspex-guru/mcp-server-gemini`](https://www.npmjs.com/package/@haruspex-guru/mcp-server-gemini) package — same tools, optimized config + ships with the Haruspex Gemini extension.

## Example prompts

Drop these into any MCP-connected chat:

- *"What's the Haruspex score for TSLA, and how has it moved this week?"*
- *"Compare AAPL, MSFT, and GOOGL. Which has the strongest fundamentals?"*
- *"Build me a watchlist of AI-exposure stocks scoring above 70."*
- *"What's driving NVDA's score change today?"*
- *"Find 5 small-cap energy stocks with bullish Haruspex outlooks."*

## Skills

For structured analytical workflows (single-ticker analysis, watchlist review, thesis tracking), pair with the [Haruspex Skills](https://github.com/Haruspex-guru/haruspex-skills) — published in the [Anthropic Skills marketplace](https://github.com/anthropics/skills).

| Skill | Use case |
|-------|---------|
| `haruspex-stock-analyst` | Deep single-ticker analysis |
| `haruspex-stock-analyst-ja` | Same, in Japanese |
| `haruspex-watchlist-review` | Daily/weekly batch review |
| `haruspex-thesis-tracker` | Pressure-test investment theses against current data |

## Privacy

This MCP server makes outbound calls **only** to `https://haruspex.guru/api/v1`. No third-party telemetry, no LLM data, no chat content. The optional `record_skill_invocation` tool sends only a skill name + version + client tag (not your prompts, tickers, or user IDs); set `HARUSPEX_TELEMETRY=0` to disable.

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `HARUSPEX_API_KEY` | *(required)* | Your `hrspx_...` API key |
| `HARUSPEX_CLIENT` | `unknown` | Tags traffic by host (`claude-desktop`, `cursor`, `base44`, etc) so admin metrics can split by surface |
| `HARUSPEX_TELEMETRY` | `1` | Set `0` to disable the (already minimal) skill-invocation ping |

## License

MIT. The MCP server is open source. The Haruspex scoring algorithm and underlying data are proprietary; access governed by the [Haruspex API Terms of Service](https://haruspex.guru/terms).

## Links

- 🌐 [haruspex.guru](https://haruspex.guru)
- 📊 [Live demo: AAPL](https://haruspex.guru/s/AAPL)
- 📖 [Integrations](https://haruspex.guru/integrations)
- 💬 [Issues](https://github.com/Haruspex-guru/haruspex-skills/issues)
