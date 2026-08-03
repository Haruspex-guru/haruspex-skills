# Adoption log

Weekly snapshot of the four adoption proxies described in
[`adoption.md`](adoption.md). Appended every Monday by a scheduled agent.

The deltas matter, not the absolutes. A negative delta on npm weekly
downloads combined with flat clones is the early warning that something
regressed.

## Snapshots

### 2026-08-03

| Signal | Value | Window |
| --- | --- | --- |
| npm downloads, `@haruspex-guru/mcp-server` | **17** | 2026-07-27 → 2026-08-02 |
| npm downloads, last day | 1 | 2026-08-02 |
| GitHub clones | 25 (13 unique) | last 14 days |
| GitHub views | 12 (5 unique) | last 14 days |
| Stars / forks / watchers | 0 / 0 / 0 | cumulative |
| Open issues | 0 | cumulative |
| External PRs | 0 of 5 merged | cumulative |

Top referrers: Google (10 views, 3 unique), github.com (1 view, 1 unique).

Claude.ai marketplace install counts: still not exposed by the UI, so
nothing to capture. See `adoption.md` §3.

Notes — first entry, so no deltas yet. Unique cloners (13) running well
ahead of unique page views (5) suggests most installs arrive via a
direct `git clone` from documentation rather than by browsing the repo,
which is consistent with Google being the dominant referrer.
