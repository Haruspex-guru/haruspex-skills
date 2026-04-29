# Contributing

Thanks for considering a contribution. This repo packages **Anthropic Agent
Skills** that turn Claude into a stock-intelligence assistant powered by the
Haruspex API. The contribution surface is intentionally narrow — most PRs will
be tweaks to skill descriptions, examples, or eval queries.

## Before you open a PR

1. **Open an issue first.** Especially for new skills, behavior changes, or
   anything touching compliance language. We'd rather discuss approach than
   review a finished PR that needs to be redone.
2. **Run validation locally:** `bash scripts/validate-skills.sh`. CI runs the
   same checks on every PR.
3. **Read [shared/DISCLAIMER.md](shared/DISCLAIMER.md) and the "Compliance
   rules" section of any `SKILL.md`.** These are non-negotiable.

## What we accept

- Improvements to skill `description` fields that demonstrably improve
  triggering accuracy (include eval results in the PR).
- Better examples in `examples.md` files — but only if the example uses **real
  captured data** from a real `@haruspex/mcp-server` call. Fabricated tickers,
  scores, or share URLs will be rejected.
- Refinements to the dimension glossary in `shared/DIMENSIONS.md` that bring
  language closer to what is publicly documented at haruspex.guru.
- New eval queries that cover under-tested trigger scenarios.

## What we reject

- PRs that document scoring methodology, weights, or formulas. The scoring
  algorithm is proprietary; this repo only describes user-facing behavior.
- PRs that loosen compliance language (the "Compliance rules" sections, the
  disclaimer footer, the buy/sell/hold prohibitions).
- PRs that add direct API client code. Skills are instructions, not code; the
  data path is the MCP server.
- PRs that include any `hrspx_live_*` or production API key.
- New skills that overlap heavily with existing ones. Four narrow skills
  trigger more reliably than one broad skill.

## Asset coverage

Stocks only. We do not accept skills for crypto, options, futures, forex, or
other asset classes — they are outside the Haruspex coverage universe.

## Adding a new skill

1. Open an issue with the proposed `name`, `description`, workflow, and the
   trigger gap it fills.
2. After discussion, build the skill following the structure of
   `skills/haruspex-stock-analyst/` (SKILL.md + reference.md + examples.md).
3. Capture **real data** for every example before writing it. No mocks.
4. Add 20+ eval queries (10 should-trigger, 10 should-not).
5. Submit a PR.

## Promoting a skill to `anthropics/skills`

This repo is the source of truth. Skills are promoted to the official
[anthropics/skills](https://github.com/anthropics/skills) catalog by a
maintainer once they have been stable here for at least one minor version.
Don't open PRs against `anthropics/skills` for these skills directly without
coordinating first.

## Validation rules (enforced by CI)

Every `SKILL.md` must have:
- YAML frontmatter with non-empty `name` and `description` fields.
- `name` matching `^[a-z][a-z0-9-]{0,63}$` (lowercase, hyphens, ≤64 chars).
- `description` ≤1024 chars, with no XML tags.
- Body ≤500 lines.
- A "Compliance rules (NEVER VIOLATE)" section.
- A reference to `shared/DISCLAIMER.md`.

## Notes for maintainers

- The placeholder API key value in `shared/MCP_SETUP.md` (currently
  `hrspx_demo_public_REPLACE_ME`) must match the canonical demo key advertised
  in the `@haruspex/mcp-server` README. If those drift, fix here.
- The dimension blurbs in `shared/DIMENSIONS.md` are written conservatively
  and should be replaced with the canonical haruspex.guru copy when that copy
  is finalized. Several entries are flagged with `<!-- TODO: align with
  canonical haruspex.guru copy -->`.
