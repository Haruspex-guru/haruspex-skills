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

## How this is collected

`.github/workflows/adoption-snapshot.yml` runs every Monday at 05:00 UTC
and appends a snapshot to `adoption-log.md`, with the numbers themselves
in `adoption-data.json`. Deltas are computed from the JSON — do not parse
the markdown for last week's values.

Collection runs in GitHub Actions rather than in the `haruspex-adoption-
weekly-snapshot` Claude routine, which fires an hour later and only sends
the email. Two hard limits forced the split, both confirmed from the
2026-08-17 run log:

- The routine's sandbox blocks `api.npmjs.org` at the egress proxy
  (`EGRESS_BLOCKED`), so download counts are unreachable from there.
  `registry.npmjs.org` is allowed, which is why version lookups worked
  and download counts did not.
- The traffic endpoints require `Administration: read`. A GitHub App's
  permission set is fixed by its author, so the Claude app installed on
  the org cannot be granted it.

`ADOPTION_PAT` must be set as a repo secret: a fine-grained token with
`Administration: read` (traffic), `Contents: write` and `Pull requests:
write` (the snapshot PR). The Actions `GITHUB_TOKEN` is not a substitute, for
three separate reasons, all confirmed by dispatching the workflow on
2026-08-20:

1. It is refused `403 Forbidden` on both traffic endpoints.
2. This repo has "Allow GitHub Actions to create and approve pull
   requests" disabled, so `gh pr create` fails with `GitHub Actions is
   not permitted to create or approve pull requests`. A PAT acts as its
   owner rather than as Actions, so it is unaffected.
3. A PR pushed with `GITHUB_TOKEN` does not trigger workflow runs, so
   `validate-skills` would never report and the required check could
   never be satisfied.

Without the secret the job still succeeds: clones and views record as
unavailable, and the PR is left open for a manual merge.

The deltas matter, not the absolutes. A negative delta on npm weekly
downloads + flat clones is the early warning that something regressed —
but on the current base a single week's npm swing is noise, so read a run
of several weeks before concluding anything.

## What this doc is not

This is the **adoption** layer — how many people have the skills. It
does not measure how often skills run, which tools they call, or
whether the output is any good. Those live in:

- `eval/usage-dashboards.md` — runtime MCP call volume (Stage 2)
- skill-invocation pings via `record_skill_invocation` (Stage 3)
- `eval/` runner — output quality (Stage 4)
