# Trigger-accuracy evals

This directory contains test queries to evaluate whether each skill triggers
when it should and stays silent when it shouldn't. Skills evaluation is
manual in v0.1.0 — there is no automated runner here, just a structured
manual procedure.

## Why this matters

Anthropic's published guidance on Skills observes that skills tend to
**under-trigger** more than they over-trigger. If your skill description is
too cautious, Claude won't load it when the user actually wants it. The
queries here are the test set for catching that.

The skills in this repo intentionally use slightly pushy descriptions to
counteract under-triggering. The eval queries verify the pushiness hasn't
crossed into over-triggering on unrelated topics.

## Files

- `queries/stock-analyst-queries.json` — flagship single-ticker triggers.
- `queries/watchlist-queries.json` — multi-ticker / batch triggers.
- `queries/thesis-queries.json` — position-with-rationale triggers.
- `queries/japan-queries.json` — Japanese-language triggers.

Each file has the same shape:

```json
[
  { "query": "<example user input>", "should_trigger": true,  "expected_skill": "haruspex-stock-analyst" },
  { "query": "<example user input>", "should_trigger": false, "expected_skill": null }
]
```

A `should_trigger: false` entry with a non-null `expected_skill` means: this
input should not trigger *the skill being tested*, but it **should** trigger
that other skill. These are the cross-skill ambiguity cases.

## Manual evaluation procedure

1. Install one skill at a time into a Claude client (Claude Desktop, Claude
   Code, or Claude.ai) — see [`../README.md`](../README.md) for install
   instructions.
2. For each query in that skill's JSON file, paste it into a new
   conversation.
3. Observe whether the skill loaded (in Claude Desktop, watch the skill
   indicator; in Claude Code, watch for the skill banner; in Claude.ai,
   watch the activity panel).
4. Record:
   - **Triggered correctly** (`should_trigger: true` and skill loaded) → ✓
   - **Did not trigger when expected** (`should_trigger: true` but skill
     did not load) → ✗ (the description needs to be more inclusive)
   - **Triggered incorrectly** (`should_trigger: false` but skill loaded)
     → ✗ (the description is over-claiming)
   - **Did not trigger when shouldn't** → ✓
5. Aim for ≥ 90% accuracy across the file before considering the skill
   stable. Below 90% means the description needs revision.

## Cross-skill ambiguity tests

The hardest cases are the cross-skill ones — e.g., "I'm long NVDA because
of AI demand" should trigger `haruspex-thesis-tracker` and **not** the
flagship `haruspex-stock-analyst`. To test these:

1. Install **all four skills** into the same client.
2. Run the cross-skill queries (the entries where `should_trigger: false`
   but `expected_skill` is non-null).
3. Verify that the **expected** skill triggers and the others do not.

This is where description writing earns its money. If you find a
cross-skill query that triggers the wrong skill, the descriptions of both
skills involved usually need a small tweak — typically a "defer to X when
Y" sentence in the over-eager skill, and a more aggressive trigger phrase
in the under-eager one.

## Recording results

When you run an eval pass, save the result alongside the query file as
`results/<skill-name>-<YYYY-MM-DD>.md` (this directory is gitignored by
default — opt in to commit specific runs if you want a public history).

Suggested results format:

```markdown
# Eval results: haruspex-stock-analyst

Run: 2026-04-29
Client: Claude Desktop, all 4 skills installed

| # | Query                                | Expected | Got    | ✓/✗ |
|---|--------------------------------------|----------|--------|-----|
| 1 | what do you think about NVDA?        | analyst  | analyst | ✓   |
| 2 | score on AAPL?                       | analyst  | analyst | ✓   |
| ... |

Score: 22/22 (100%) on the analyst file.
Cross-skill: 3/3 routed correctly.

Findings: none requiring description changes.
```

## When to add new queries

Add new queries any time a real user query in the wild produces a wrong
trigger result. Each such query is a test case worth keeping. Keep the
real-world queries in their own subsection so you can grep for them later.

## Future automation

Eval automation requires a programmatic way to ask Claude "would you load
this skill for this query?" — that's not currently exposed by the public
API, so this stays manual until it is.
