---
name: New skill request
about: Propose a new skill for this repo
title: "[Skill] "
labels: enhancement
---

> **Read this first:** four narrow skills typically trigger more reliably
> than one broad skill. If your idea overlaps with an existing skill,
> consider whether it's better as a refinement to that skill's description
> or `reference.md` rather than a new skill. We will close PRs for new
> skills that overlap heavily with existing ones.

## Proposed skill name

<!-- Must be lowercase letters, numbers, hyphens; ≤64 chars. -->

`haruspex-`

## What this skill does

<!-- One paragraph: what workflow it runs, what tools it calls, what output
the user gets. -->

## When should it trigger

List 5+ concrete user queries that should trigger this skill but **don't**
currently trigger any of the four existing skills.

1.
2.
3.
4.
5.

## Why is this not a fit for the existing skills?

<!-- Be specific. Which existing skill comes closest, and why isn't a
description tweak enough? -->

## Proposed `description` field draft

```
<300-800 char description that aggressively claims the trigger scenarios
above, while explicitly deferring to existing skills for cases they handle>
```

## Asset coverage

This repo only accepts skills for **stocks**. Confirm:

- [ ] My proposed skill is for stock analysis (not crypto, options,
  futures, forex, etc.)
- [ ] My proposed skill works against the Haruspex MCP server's existing
  tools (or I have a plan for the data path).

## Compliance considerations

- [ ] My proposed skill does not give direct buy/sell/hold recommendations.
- [ ] My proposed skill does not predict prices.
- [ ] My proposed skill includes the disclaimer footer in every output.
