# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-04-29

### Changed
- Rewrote `README.md` and `shared/MCP_SETUP.md` to match tested install paths.
  Documents Claude Code (`~/.claude/skills/` + `claude mcp add-json`) as the
  primary install target, Claude.ai web ZIP upload as the second target, and
  honestly notes that Claude Desktop does not load filesystem skills as of
  this release. Added a surface support matrix.
- Promoted the Japanese disclaimer wording in `shared/DISCLAIMER.md` from
  "placeholder" to canonical translation (still flagged as not legally
  reviewed; recommend a Japanese securities advisor pass before public
  launch in Japan).

## [0.1.0] - 2026-04-29

### Added
- `haruspex-stock-analyst` — single-ticker fundamental + signals analysis
- `haruspex-watchlist-review` — batch review of multi-ticker watchlists
- `haruspex-thesis-tracker` — evaluate whether an investment thesis still aligns with current data
- `haruspex-stock-analyst-ja` — Japanese-language flagship variant for JP traders trading NYSE/NASDAQ
- `shared/DIMENSIONS.md` — plain-English glossary of the 16 Haruspex topic dimensions
- `shared/DISCLAIMER.md` — canonical compliance disclaimer footer
- `shared/MCP_SETUP.md` — `@haruspex/mcp-server` install instructions
- `eval/queries/` — trigger-accuracy query sets per skill
- `scripts/validate-skills.sh` — local frontmatter + structure validation
- `.github/workflows/validate.yml` — CI validation on PR/push
