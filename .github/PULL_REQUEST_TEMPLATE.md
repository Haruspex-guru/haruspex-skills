## What this PR does

<!-- One or two sentences. -->

## Type of change

- [ ] Skill `description` revision (include eval results)
- [ ] New example in an `examples.md` (must use real captured data)
- [ ] Edit to `shared/DIMENSIONS.md`, `shared/DISCLAIMER.md`, or `shared/MCP_SETUP.md`
- [ ] New eval queries in `eval/queries/`
- [ ] New skill (please open an issue first to discuss scope)
- [ ] Tooling / CI / scripts
- [ ] Other (describe below)

## Compliance check

- [ ] No direct buy/sell/hold recommendations were added or relaxed.
- [ ] No price predictions were added.
- [ ] The disclaimer footer is intact in every `SKILL.md` and example.
- [ ] No `hrspx_live_*` keys are present in any committed file.
- [ ] No claims that Haruspex is built on / powered by Claude or Anthropic.

## Validation

- [ ] `bash scripts/validate-skills.sh` exits 0 locally.
- [ ] Affected `SKILL.md` files are still ≤ 500 lines and have valid frontmatter.

## If the change touches a `description`

- [ ] Eval queries were re-run for that skill (paste a summary in the PR comments).
- [ ] Cross-skill ambiguity queries still route to the expected skill.

## Related issues

<!-- Closes #N, references #M -->
