# Adoption log

Weekly snapshot of the four adoption proxies described in
[`adoption.md`](adoption.md). Appended every Monday by a scheduled agent.

The deltas matter, not the absolutes. A negative delta on npm weekly
downloads combined with flat clones is the early warning that something
regressed.

## Snapshots

### 2026-08-17

| Signal | Value | Delta vs 2026-08-03 | Window |
| --- | --- | --- | --- |
| npm downloads, `@haruspex-guru/mcp-server` | **15** | −2 | 2026-08-10 → 2026-08-16 |
| npm downloads, last day | 1 | 0 | 2026-08-16 |
| GitHub clones | 31 (17 unique) | +6 (+4 unique) | last 14 days |
| GitHub views | 9 (6 unique) | −3 (+1 unique) | last 14 days |
| Stars / forks / watchers | 1 / 0 / 0 | +1 star | cumulative |
| Open issues | 0 | 0 | cumulative |
| External PRs | 0 of 6 merged | 0 | cumulative |

Top referrers: github.com (1 view, 1 unique). Google, which supplied 10 of
12 views in the previous snapshot, produced none this window.

Sibling packages, for context (not adoption proxies for this repo, but
they share the same MCP backend): `@haruspex-guru/mcp-server-gemini` 4
weekly, `@haruspex-guru/react` 5 weekly.

Claude.ai marketplace install counts: still not exposed by the UI. See
`adoption.md` §3.

Notes — treat the npm delta as noise, not decline. The weekly series
since late June runs 18, 24, 9, 10, 30, 7, 18, 10: range 7–30 around a
mean near 16, on a base small enough that a single CI matrix explains any
week's swing. Two consecutive snapshots are not a trend line; only a
sustained move outside that band is.

The clone/view divergence from the first snapshot widened — unique
cloners rose to 17 while unique viewers sat at 6. Same reading as before
(installs arrive from documentation, not from browsing the repo), except
the Google referrer that supported that story has now vanished, so the
inbound path is currently unexplained.

Method note: GitHub traffic figures were fetched 2026-08-19, so their
14-day window trails the snapshot date by two days. The scheduled run for
2026-08-17 could not write this entry — the Claude GitHub App was not
installed on the `Haruspex-guru` org, so the push 403'd and the commit was
lost with the runner. The app is now installed org-wide with
`contents: write` and `pull_requests: write`. Two further runner-env gaps
remain open: `api.npmjs.org` is blocked by that environment's egress proxy,
and the `gh` CLI is not installed there, so both npm and traffic numbers
above were collected by hand.

Correction to the 2026-08-17 run's own summary, which reported "+1
watcher (0 → 1)": that was `watchers_count` from the REST API, which
GitHub aliases to the star count. Real subscribers (`subscribers_count`)
are still 0. Future runs should read `subscribers_count`.


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
