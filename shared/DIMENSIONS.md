# Haruspex Topic Dimensions

Every Haruspex score returns a set of **topic dimensions**, each scored
independently from 0 to 100, alongside the headline score. The dimensions are
a way to see *why* a stock scores the way it does — which forces are pushing
favorably, which are pushing unfavorably.

This file describes what each dimension measures at a user-facing level. It
intentionally does **not** describe scoring methodology, weights, or the
algorithmic combination of dimensions into the headline score — those are
proprietary.

## How dimensions work

- **Range:** 0 to 100. Higher is more favorable for the stock on that dimension.
- **Direction:** a higher score on a *risk* dimension (e.g. `concentration-risk`,
  `climate-risk`) means **less risk**, not more risk. A high climate-risk score
  is a stock with low climate exposure. A low climate-risk score is a stock
  with high climate exposure.
- **Change field:** every dimension also reports a `change` value — the delta
  versus the previous reading. Negative `change` means the dimension is
  trending unfavorably; positive means favorably.
- **Zero values:** a dimension scoring exactly `0` typically means **data
  unavailable** for that dimension on that ticker, not "actually zero." Skills
  should call this out rather than treat it as a real low score.
- **Universe:** not every dimension is equally informative for every ticker.
  Software companies will see strong signal in `github-activity`; physical
  retailers will not.

## The 16 dimensions

### `ai-exposure`
Measures the company's positioning relative to the AI build-out — both as a
beneficiary of AI demand and as a candidate for AI-driven disruption. A high
score indicates favorable AI positioning. A low score indicates exposure to
displacement or weak participation in AI-driven growth.

### `climate-risk`
Measures the company's exposure to climate-related operational and regulatory
risk. A high score indicates **lower** climate-related risk to the business.

### `competitors`
Measures the company's competitive position within its industry — market
share dynamics, pricing power, and relative growth versus peers. A high score
indicates a strengthening competitive position.

### `concentration-risk`
Measures concentration in customers, suppliers, geography, or product mix.
A high score indicates **lower** concentration risk (more diversified). A low
score flags vulnerability to a single customer, region, or product line.

### `earnings`
Measures the strength and trajectory of reported earnings — beats vs.
expectations, analyst revision direction, quality of earnings. A high score
indicates strong, improving earnings.

### `esg`
Measures environmental, social, and governance signals as reported in public
filings and third-party data. A high score indicates favorable ESG
positioning. A score of `0` typically means ESG data is not available for
this ticker.

### `github-activity`
Measures public open-source development activity associated with the company
— commit cadence, contributor diversity, repo footprint. Most informative for
software and infrastructure companies; less informative for non-tech firms.

### `insider-trading`
Measures recent insider transaction patterns — buying versus selling, by whom,
and at what scale. A high score indicates favorable insider activity (net
buying, or absence of unusual selling).

### `institutional`
Measures institutional ownership and recent institutional flows — ownership
percentage, net share changes, buying pressure. A high score indicates
supportive institutional positioning.

### `macro`
Measures the company's exposure to macroeconomic conditions — rates,
inflation, growth, currency. A high score indicates favorable macro tailwinds
or low macro sensitivity.

### `management`
Measures management quality and execution signals — track record, capital
allocation, governance. A high score indicates favorable management signals.

### `patents`
Measures the company's patent portfolio and recent IP activity — filing
cadence, citations, technology breadth. A high score indicates a strong and
defensible IP position.

### `regulatory`
Measures the regulatory environment facing the company — pending rules, recent
rulings, jurisdictional exposure. A high score indicates favorable or stable
regulatory conditions.

### `supplychain`
Measures supply-chain resilience and stress — input cost trajectory, freight
indices, single-source vulnerabilities. A high score indicates a resilient
supply chain. A low score flags inflationary or disruption pressure.

### `us_china_official`
Measures geopolitical risk to the company arising from **official** US–China
policy actions: tariffs, export controls, sanctions, formal restrictions. A
high score indicates lower exposure or favorable conditions; a low score
indicates active or worsening official pressure.

### `us_china_unofficial`
Measures geopolitical risk arising from **unofficial** US–China dynamics:
boycotts, informal procurement preferences, consumer sentiment, retaliatory
business practices. A high score indicates lower exposure; a low score
indicates active or worsening unofficial pressure.

## A note on UI vs. API

The Haruspex web UI may display a subset of these dimensions on a stock's
detail page (the most-relevant ones for that ticker), and may group or rename
them for readability. The API always returns the canonical 16 with the slugs
above. Skills should refer to dimensions by their API slug.
