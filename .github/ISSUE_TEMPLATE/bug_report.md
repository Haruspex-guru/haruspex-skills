---
name: Bug report
about: A skill triggers wrongly, produces wrong output, or breaks compliance
title: "[Bug] "
labels: bug
---

## Which skill

- [ ] `haruspex-stock-analyst`
- [ ] `haruspex-watchlist-review`
- [ ] `haruspex-thesis-tracker`
- [ ] `haruspex-stock-analyst-ja`
- [ ] Multiple / unsure

## What happened

<!-- A short factual description of the misbehavior. -->

## What you expected to happen

<!-- One or two sentences. -->

## Reproduction

Paste the exact user query you sent:

```
<query here>
```

If possible, paste the full Claude output as well (redact anything sensitive).

## Environment

- Claude client (Desktop / Code / Cursor / Windsurf / Claude.ai / API):
- `@haruspex-guru/mcp-server` version: `npx -y @haruspex-guru/mcp-server@latest --version` if you can run it
- Skills installed (list them):

## Compliance breach?

If the bug is that the skill gave a direct buy/sell recommendation, predicted
a price, or removed the disclaimer footer, mark this checkbox:

- [ ] This is a compliance breach (treat as P0)
