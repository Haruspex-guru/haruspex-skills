# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-04-30

### Changed
- **Dimension catalog grew from 16 to 23.** `shared/DIMENSIONS.md` rewritten
  to document the full canonical set returned by the orchestrator's MCP
  registry: added `crypto`, `fundamentals`, `geopolitical`, `job-market`,
  `microstructure`, `options-flow`, `sentiment`, `short-interest`,
  `technical`. Documented per-dimension applicability gates (sector,
  region, symbol allowlists) for the first time.
- Retired slugs `us_china_official` and `us_china_unofficial` — consolidated
  into the new `geopolitical` dimension. `shared/DIMENSIONS.md` notes the
  rename for users coming from earlier releases.
- Updated `haruspex-thesis-tracker/reference.md` thesis archetype mapping:
  added rows for `fundamentals`, `sentiment`, `short-interest`,
  `options-flow`, `technical`, `microstructure`, `crypto`, `job-market`.
  Replaced `us_china_*` mappings with `geopolitical`.
- Removed hardcoded "16-dimension" / "16 dimensions" phrasing from skill
  descriptions, SKILL.md bodies, README, and CHANGELOG. Future dimension
  additions no longer require an across-the-board doc edit.

### Compatibility
- The live API today still returns the original 16 slugs (Firestore daily
  scores are written by an older registry version). This release
  documents the canonical 23 the API will return once score generation
  rolls onto the current orchestrator. Skills already iterate over
  whatever `topicScores` keys come back, so the change is forward-safe.

## [0.1.2] - 2026-04-30

### Changed
- Renamed all references to the MCP server package from `@haruspex/mcp-server`
  to `@haruspex-guru/mcp-server`, matching the actual published npm package
  ([npmjs.com/package/@haruspex-guru/mcp-server](https://www.npmjs.com/package/@haruspex-guru/mcp-server)).
  10 files updated. End-to-end install path (`npx -y @haruspex-guru/mcp-server`)
  re-tested in Claude Code: skill triggering and MCP connection both verified.

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
- `shared/DIMENSIONS.md` — plain-English glossary of the Haruspex topic dimensions
- `shared/DISCLAIMER.md` — canonical compliance disclaimer footer
- `shared/MCP_SETUP.md` — `@haruspex-guru/mcp-server` install instructions
- `eval/queries/` — trigger-accuracy query sets per skill
- `scripts/validate-skills.sh` — local frontmatter + structure validation
- `.github/workflows/validate.yml` — CI validation on PR/push
