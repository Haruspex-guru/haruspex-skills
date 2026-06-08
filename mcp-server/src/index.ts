#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_BASE = "https://haruspex.guru/api/v1";
const API_KEY = process.env.HARUSPEX_API_KEY || "";
const TELEMETRY_DISABLED = process.env.HARUSPEX_TELEMETRY === "0";
// Sent on every API call so the backend can attribute credit usage to the
// MCP host. Defaults to "unknown" because this package serves multiple hosts
// (Claude Desktop, Claude Code, Cursor, Base44, …); set HARUSPEX_CLIENT in
// the host's MCP config to override (e.g. "base44", "claude-desktop").
const PACKAGE_VERSION = "1.3.0";
const CLIENT_OVERRIDE = process.env.HARUSPEX_CLIENT || "unknown";
const CLIENT_HEADER = `${CLIENT_OVERRIDE}@${PACKAGE_VERSION}`;

if (!API_KEY) {
  console.error(
    "HARUSPEX_API_KEY environment variable is required. " +
    "Get your API key from https://haruspex.guru/settings"
  );
  process.exit(1);
}

// ── Haruspex API client ──────────────────────────────────────────────

async function haruspexFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "X-Haruspex-Client": CLIENT_HEADER,
      ...init?.headers,
    },
  });

  const body = (await res.json()) as { status: string; data?: T; error?: { message: string } };

  if (!res.ok || body.status === "error") {
    const msg = body.error?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return body.data as T;
}

// ── Tool definitions ─────────────────────────────────────────────────

const TOOLS = [
  {
    name: "get_stock_score",
    description:
      "Get the latest Haruspex Score (0-100) for a stock. " +
      "Returns score, outlook, trading signal, topic breakdowns, and a shareable URL. " +
      "Use this to inform stock commentary on social media.",
    inputSchema: {
      type: "object" as const,
      properties: {
        symbol: {
          type: "string",
          description: "Stock ticker symbol (e.g. TSLA, AAPL, NVDA)",
        },
      },
      required: ["symbol"],
    },
  },
  {
    name: "get_stock_score_history",
    description:
      "Get historical daily Haruspex Scores for a stock over a date range. " +
      "Useful for trend analysis and identifying momentum shifts.",
    inputSchema: {
      type: "object" as const,
      properties: {
        symbol: {
          type: "string",
          description: "Stock ticker symbol",
        },
        from: {
          type: "string",
          description: "Start date (YYYY-MM-DD). Defaults to 30 days ago.",
        },
        to: {
          type: "string",
          description: "End date (YYYY-MM-DD). Defaults to today.",
        },
        limit: {
          type: "number",
          description: "Max scores to return (1-90). Default 30.",
        },
      },
      required: ["symbol"],
    },
  },
  {
    name: "get_batch_scores",
    description:
      "Get latest Haruspex Scores for multiple stocks at once (up to 50). " +
      "Great for comparing several tickers or building a watchlist overview.",
    inputSchema: {
      type: "object" as const,
      properties: {
        symbols: {
          type: "array",
          items: { type: "string" },
          description: "Array of stock ticker symbols (max 50)",
        },
      },
      required: ["symbols"],
    },
  },
  {
    name: "search_stocks",
    description:
      "Search for stocks by symbol or company name. " +
      "Use this to find the correct ticker symbol before fetching a score.",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "Search query (symbol or company name)",
        },
        limit: {
          type: "number",
          description: "Max results (1-20). Default 10.",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_stock_news",
    description:
      "Get recent news articles for a stock. " +
      "Useful for understanding what's driving score changes.",
    inputSchema: {
      type: "object" as const,
      properties: {
        symbol: {
          type: "string",
          description: "Stock ticker symbol",
        },
        limit: {
          type: "number",
          description: "Max articles (1-20). Default 10.",
        },
      },
      required: ["symbol"],
    },
  },
  {
    name: "record_skill_invocation",
    description:
      "Record that a Haruspex skill is starting a run. Called once at the very " +
      "beginning of each skill workflow for aggregate usage telemetry. " +
      "Sends only the skill name, version, and client tag — no conversation " +
      "content, no tickers, no user identifiers. Fails silently if telemetry " +
      "is unavailable; never blocks the skill.",
    inputSchema: {
      type: "object" as const,
      properties: {
        skill: {
          type: "string",
          description:
            "Skill name as declared in SKILL.md (e.g. 'haruspex-stock-analyst')",
        },
        version: {
          type: "string",
          description:
            "Skill version from SKILL.md frontmatter (optional)",
        },
        client: {
          type: "string",
          enum: [
            "claude-code",
            "claude-ai",
            "claude-api",
            "claude-desktop",
            "chatgpt-apps",
            "base44",
            "unknown",
          ],
          description:
            "Best-guess client surface running the skill. Use 'base44' when invoked from the Base44.com AI app builder.",
        },
        notes: {
          type: "string",
          description: "Optional free-form note (max 500 chars)",
        },
      },
      required: ["skill"],
    },
  },
];

// ── Tool handlers ────────────────────────────────────────────────────

interface ScoreResult {
  symbol: string;
  score: number;
  previousScore: number | null;
  change: number;
  outlook: string;
  signal: string;
  shareUrl: string | null;
  date: string;
  topicScores: Record<string, { name: string; score: number; change: number }>;
  [key: string]: unknown;
}

interface HistoryResult {
  symbol: string;
  from: string;
  to: string;
  count: number;
  scores: ScoreResult[];
}

interface BatchResult {
  count: number;
  scores: Array<ScoreResult | { symbol: string; error: string }>;
}

interface SearchResult {
  results: Array<{ symbol: string; name: string; exchange: string | null; type: string }>;
}

interface NewsResult {
  symbol: string;
  articles: Array<{
    title: string;
    url: string;
    publishedAt: string;
    source: string;
  }>;
}

interface InvocationResult {
  id: string;
  recorded: boolean;
}

function formatScore(data: ScoreResult): string {
  const lines: string[] = [
    `**${data.symbol}** — Haruspex Score: **${data.score}/100** (${data.outlook})`,
    `Signal: ${data.signal.replace(/_/g, " ")} | Change: ${data.change >= 0 ? "+" : ""}${data.change}`,
    "",
  ];

  if (data.shareUrl) {
    lines.push(`Share URL: ${data.shareUrl}`);
    lines.push("");
  }

  const topics = Object.entries(data.topicScores || {});
  if (topics.length > 0) {
    lines.push("Topic Scores:");
    for (const [, t] of topics) {
      const arrow = t.change > 0 ? "+" : t.change < 0 ? "" : "=";
      lines.push(`  ${t.name}: ${t.score}/100 (${arrow}${t.change})`);
    }
  }

  return lines.join("\n");
}

async function handleTool(name: string, args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case "get_stock_score": {
      const data = await haruspexFetch<ScoreResult>(
        `/scores/${encodeURIComponent(args.symbol as string)}`
      );
      return formatScore(data);
    }

    case "get_stock_score_history": {
      const params = new URLSearchParams();
      if (args.from) params.set("from", args.from as string);
      if (args.to) params.set("to", args.to as string);
      if (args.limit) params.set("limit", String(args.limit));
      const qs = params.toString() ? `?${params}` : "";
      const data = await haruspexFetch<HistoryResult>(
        `/scores/${encodeURIComponent(args.symbol as string)}/history${qs}`
      );
      const lines = [`**${data.symbol}** — ${data.count} scores from ${data.from} to ${data.to}\n`];
      for (const s of data.scores) {
        lines.push(`${s.date}: ${s.score}/100 (${s.outlook}, ${s.change >= 0 ? "+" : ""}${s.change})`);
      }
      return lines.join("\n");
    }

    case "get_batch_scores": {
      const data = await haruspexFetch<BatchResult>("/scores/batch", {
        method: "POST",
        body: JSON.stringify({ symbols: args.symbols }),
      });
      const lines: string[] = [];
      for (const entry of data.scores) {
        if ("error" in entry) {
          lines.push(`**${entry.symbol}**: ${entry.error}`);
        } else {
          lines.push(formatScore(entry));
          lines.push("");
        }
      }
      return lines.join("\n");
    }

    case "search_stocks": {
      const params = new URLSearchParams({ q: args.query as string });
      if (args.limit) params.set("limit", String(args.limit));
      const data = await haruspexFetch<SearchResult>(`/search?${params}`);
      if (data.results.length === 0) return "No stocks found.";
      return data.results
        .map((r) => `${r.symbol} — ${r.name} (${r.exchange || "N/A"}, ${r.type})`)
        .join("\n");
    }

    case "get_stock_news": {
      const params = new URLSearchParams();
      if (args.limit) params.set("limit", String(args.limit));
      const qs = params.toString() ? `?${params}` : "";
      const data = await haruspexFetch<NewsResult>(
        `/stocks/${encodeURIComponent(args.symbol as string)}/news${qs}`
      );
      if (data.articles.length === 0) return `No recent news for ${data.symbol}.`;
      return data.articles
        .map((a) => `[${a.source}] ${a.title}\n  ${a.url} (${a.publishedAt})`)
        .join("\n\n");
    }

    case "record_skill_invocation": {
      if (TELEMETRY_DISABLED) {
        return "Telemetry disabled (HARUSPEX_TELEMETRY=0). Skipped.";
      }
      try {
        const data = await haruspexFetch<InvocationResult>("/skills/invocation", {
          method: "POST",
          body: JSON.stringify({
            skill: args.skill,
            version: args.version,
            client: args.client,
            notes: args.notes,
          }),
        });
        return `Recorded skill invocation ${data.id}.`;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return `Telemetry ping failed (non-fatal): ${msg}`;
      }
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ── MCP server setup ─────────────────────────────────────────────────

const server = new Server(
  { name: "haruspex", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const result = await handleTool(name, (args || {}) as Record<string, unknown>);
    return { content: [{ type: "text", text: result }] };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
