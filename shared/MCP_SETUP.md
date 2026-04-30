# Installing `@haruspex-guru/mcp-server`

The skills in this repository are instructions; they do not call the Haruspex
API directly. The data path runs through the **`@haruspex-guru/mcp-server`** MCP
server, which exposes the Haruspex API as a set of tools that Claude can call.

If `@haruspex-guru/mcp-server` is not installed and connected, every skill in this
repo will detect that, output the install instructions below, and stop.

## Get an API key

1. Sign up at <https://haruspex.guru>.
2. Create an API key in the developer settings.
3. Keep the key in a local config file. **Never commit it to a repository.**

For initial testing, the public demo key advertised in the
`@haruspex-guru/mcp-server` README may be used (subject to that key's rate
limits). The placeholder used throughout this file is
`hrspx_demo_public_REPLACE_ME`.

> **Maintainer note:** the placeholder string above must match the canonical
> demo-key string used in the `@haruspex-guru/mcp-server` README. If the upstream
> README changes, update this file. See `CONTRIBUTING.md`.

## Surface compatibility, at a glance

| Surface | MCP supported? | Skills supported? |
|---|---|---|
| Claude Code (terminal CLI) | ✅ | ✅ filesystem `~/.claude/skills/` |
| Claude.ai web (browser) | ✅ via Connectors | ✅ ZIP upload via Settings |
| Claude API / SDK | ✅ | ✅ bundle in request |
| Claude Desktop | ✅ via `claude_desktop_config.json` | ❌ as of v0.1.0 |
| Cursor | ✅ via `~/.cursor/mcp.json` | ❌ no skills runtime |
| Windsurf | ✅ via `~/.codeium/windsurf/mcp_config.json` | ❌ no skills runtime |

The skills in this repo run on **Claude Code, Claude.ai, or the Claude API**.
For Cursor, Windsurf, and Claude Desktop you can wire up the MCP server and
call its tools freeform, but you won't get the structured workflows the
skills enforce.

## Claude Code — the recommended path

This is the surface we test against. Two ways to register the MCP server:

### Option A — `claude mcp add-json` (canonical, recommended)

User-scope (works in every project):

```bash
claude mcp add-json --scope user haruspex '{
  "command": "npx",
  "args": ["-y", "@haruspex-guru/mcp-server"],
  "env": { "HARUSPEX_API_KEY": "hrspx_demo_public_REPLACE_ME" }
}'
```

Project-scope (checked into git, team-shared) — same command with
`--scope project`. This writes a `.mcp.json` at the project root that other
team members will be prompted to approve.

### Option B — import from Claude Desktop config

If you already have `haruspex` configured in `claude_desktop_config.json`:

```bash
claude mcp add-from-claude-desktop --scope user
```

It prompts for confirmation and copies the entry over.

### Verify

```bash
claude mcp list
# Expect: haruspex: ... ✓ Connected
```

Inside a Claude Code session:

```
/mcp                  # browse Haruspex tools
/skills               # see haruspex-stock-analyst, watchlist, thesis, ja
```

You should see at minimum these MCP tools exposed:
- `get_stock_score`
- `get_stock_score_history`
- `get_batch_scores`
- `search_stocks`
- `get_stock_news`

## Claude.ai web

Claude.ai has its own Connectors UI for MCP servers, separate from any local
config files. Open Settings → Connectors → Add custom server. Use the same
shape:

- **Command:** `npx`
- **Arguments:** `-y @haruspex-guru/mcp-server`
- **Environment:** `HARUSPEX_API_KEY=<your key>`

Save. The Haruspex tools become available in your chats. Skills uploaded via
Settings → Customize → Skills will use them.

> Note: the exact UI labels in claude.ai may vary as the product evolves.
> Look for "Connectors", "Custom MCP servers", or "Add server".

## Claude Desktop (MCP only — skills not supported here)

Edit `claude_desktop_config.json`:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Shortcut: in Claude Desktop go to **Settings → Developer → Edit Config**;
the file opens in your default editor (auto-creates if missing).

Add the `haruspex` entry under `mcpServers`:

```json
{
  "mcpServers": {
    "haruspex": {
      "command": "npx",
      "args": ["-y", "@haruspex-guru/mcp-server"],
      "env": { "HARUSPEX_API_KEY": "hrspx_demo_public_REPLACE_ME" }
    }
  }
}
```

Fully quit Claude Desktop (Cmd+Q on macOS, not just close window) and
reopen. The Haruspex MCP tools will appear in chats.

> ⚠️ Filesystem skills (the `SKILL.md`-based packages in this repo) are
> **not** loaded by Claude Desktop as of v0.1.0 of this repo. Copying the
> `skills/` folders to `~/Library/Application Support/Claude/skills/` has
> no effect. For the structured skill workflows, use **Claude Code** or
> **Claude.ai web** instead. You can still call the Haruspex MCP tools
> freeform from Desktop, but Claude won't follow the skill-defined
> compliance rules and output formats.

## Cursor

Cursor reads MCP config from `~/.cursor/mcp.json` (global) or
`<project>/.cursor/mcp.json` (per-project). Same JSON shape:

```json
{
  "mcpServers": {
    "haruspex": {
      "command": "npx",
      "args": ["-y", "@haruspex-guru/mcp-server"],
      "env": { "HARUSPEX_API_KEY": "hrspx_demo_public_REPLACE_ME" }
    }
  }
}
```

Cursor does not run Anthropic Agent Skills. The Haruspex MCP tools will
work, but no skill-enforced workflow.

## Windsurf

Windsurf reads MCP config from `~/.codeium/windsurf/mcp_config.json`. Same
shape as above. Same caveat: no Agent Skills runtime.

## Troubleshooting

- **No tools appear in `claude mcp list` / `/mcp`.** The MCP server failed
  to start. Run `claude mcp list` for the failure message. Most common
  cause: missing or invalid `HARUSPEX_API_KEY`.
- **`INVALID_API_KEY` errors.** Replace the placeholder with a real key
  from haruspex.guru. The demo key may be rate-limited or rotated.
- **`NOT_FOUND` for a specific ticker.** That ticker is not currently in
  the Haruspex analysis universe. The skills handle this by reporting it
  honestly rather than fabricating a score. Coverage is currently primarily
  US large-caps.
- **Rate-limit errors.** The free tier has request-per-minute limits. The
  `meta.rateLimit` block in API responses shows current usage.
- **Skills not auto-triggering in Claude Code.** Confirm
  `~/.claude/skills/<skill-name>/SKILL.md` exists for each of the 4 skills,
  and that `/skills` in Claude Code shows them as `✔ on`. If they're listed
  but not triggering, the user query may not match the description's
  trigger patterns — see `eval/queries/` for known-good triggers.

## Privacy note

The MCP server runs locally on your machine and only forwards requests to
`https://haruspex.guru/api/v1`. It does not transmit conversation content
beyond the parameters of each individual tool call (e.g., the ticker
symbol).
