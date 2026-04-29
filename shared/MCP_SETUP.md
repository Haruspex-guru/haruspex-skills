# Installing `@haruspex/mcp-server`

The skills in this repository are instructions; they do not call the Haruspex
API directly. The data path runs through the **`@haruspex/mcp-server`** MCP
server, which exposes the Haruspex API as a set of tools that Claude can call.

If `@haruspex/mcp-server` is not installed and connected, every skill in this
repo will detect that, output the install instructions below, and stop.

## Get an API key

1. Sign up at <https://haruspex.guru>.
2. Create an API key in the developer settings.
3. Keep the key in a local config file. **Never commit it to a repository.**

For initial testing, the public demo key advertised in the `@haruspex/mcp-server`
README may be used (subject to that key's rate limits). The placeholder in the
config snippets below is `hrspx_demo_public_REPLACE_ME`.

> **Maintainer note:** the placeholder string above must match the canonical
> demo-key string used in the `@haruspex/mcp-server` README. If the upstream
> README changes, update this file. See `CONTRIBUTING.md`.

## Claude Desktop

Edit `claude_desktop_config.json`:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Add the `haruspex` entry under `mcpServers`:

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

Restart Claude Desktop. In a new conversation, you should see Haruspex tools
available. Confirm with: "list the Haruspex tools you have access to".

## Claude Code

In a project, create or edit `.claude/mcp.json`:

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

Reload the workspace. Verify with `/mcp` inside Claude Code, which lists
connected servers.

## Cursor

Cursor reads MCP config from `~/.cursor/mcp.json` (global) or
`<project>/.cursor/mcp.json` (per-project). Same JSON shape:

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

## Windsurf

Windsurf reads MCP config from `~/.codeium/windsurf/mcp_config.json`. Same
shape as above.

## Verifying the install

After installing in any of the above clients, ask:

> "List the Haruspex tools you have available."

You should see at minimum:
- `get_stock_score`
- `get_stock_score_history`
- `get_batch_scores`
- `search_stocks`
- `get_stock_news`

If any are missing, the version of `@haruspex/mcp-server` may be older than
what these skills expect. Update with `npx -y @haruspex/mcp-server@latest` and
restart your client.

## Troubleshooting

- **No tools appear.** The MCP server failed to start. Check the client's MCP
  log. Most common cause: missing or invalid `HARUSPEX_API_KEY`.
- **`INVALID_API_KEY` errors.** Replace the placeholder with a real key from
  haruspex.guru. The demo key may be rate-limited or rotated.
- **`NOT_FOUND` for a specific ticker.** That ticker is not currently in the
  Haruspex analysis universe. Skills handle this by reporting it honestly
  rather than fabricating a score.
- **Rate-limit errors.** The free tier has request-per-minute limits. The
  `meta.rateLimit` block in API responses shows current usage.

## Privacy note

The MCP server runs locally on your machine and only forwards requests to
`https://haruspex.guru/api/v1`. It does not transmit conversation content
beyond the parameters of each individual tool call (e.g., the ticker symbol).
