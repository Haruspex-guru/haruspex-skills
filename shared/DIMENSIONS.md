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

- **Range:** 0 to 100. Higher is more favorable for the stock on that
  dimension.
- **Direction:** every dimension follows the same convention —
  **higher score = more favorable**. For risk-themed dimensions
  (`climate-risk`, `concentration-risk`, `regulatory`, `geopolitical`,
  `supplychain`, `esg`), this means higher score = **less risk** on that
  axis. None of the 23 dimensions break this convention.
- **Change field:** every dimension also reports a `change` value — the delta
  versus the previous reading. Negative `change` means the dimension is
  trending unfavorably; positive means favorably.
- **Direction label:** the API also exposes a derived 3-state label per
  dimension (`bullish` / `neutral` / `bearish`) alongside the numeric score.
- **Zero values:** a dimension scoring exactly `0` typically means **data
  unavailable** for that dimension on that ticker, not "actually zero."
  Skills should call this out rather than treat it as a real low score.
- **Conditional dimensions:** not every dimension is computed for every
  ticker. Some are gated by sector, region, or explicit symbol allowlists
  (see "Applicability" notes below). When a dimension does not apply to a
  given ticker, it is simply absent from the response — not zero, not
  missing-error.

## Active dimension set (23)

The Haruspex API surfaces **23 topic dimensions**. Coverage rolled out
progressively: the original 16 (around v0.1 of this skills repo) covered
fundamentals + governance + geopolitics; the next 7 (around v0.2) added
market-microstructure and additional thematic axes (sentiment, options flow,
short interest, hiring, crypto, etc.). The full canonical set is below.

> **Note on response surface:** the live API may return a subset of the 23
> for any given ticker, depending on sector and region applicability (see
> "Applicability" per dimension). Skills should iterate over whatever
> `topicScores` keys come back, not assume all 23 are present. Skills should
> also treat the canonical list here as **the universe of slugs that may
> appear**, and gracefully ignore any new slug the API may add later.

### `ai-exposure`
AI adoption signals from SEC filings, patent activity, and automation risk
analysis.
**Applicability:** US-listed equities; required computation for an internal
strategic-symbol allowlist.

### `climate-risk`
Physical climate hazard exposure, facility vulnerability, and transition
readiness analysis. Higher score = lower climate-related risk.
**Applicability:** US-listed; Energy / Utilities / Real Estate / Materials /
Industrials sectors.

### `competitors`
Market share pressure and competitor dynamics. Higher score = strengthening
competitive position.

### `concentration-risk`
Customer, supplier, geographic, and key-person concentration risk analysis
from SEC filings. Higher score = more diversified (less concentration risk).
**Applicability:** US-listed (SEC data).

### `crypto`
Cryptocurrency exposure analysis for companies with blockchain / crypto
business lines.
**Applicability:** Tech / Financial Services sectors plus a crypto-aliased
sector list, scoped to a curated symbol allowlist.

### `earnings`
Quarterly results, guidance changes, and earnings surprises. Higher score =
stronger / improving earnings posture.

### `esg`
Environmental, social, and governance risk factors. Higher score = more
favorable ESG positioning. A score of `0` typically means ESG data is not
available for the ticker.

### `fundamentals`
Company revenue growth, margins, and financial health. Higher score = stronger
underlying financial profile.

### `geopolitical`
Trade policy exposure, sanctions risk, and global tensions. Higher score =
less geopolitical pressure on the stock.
**Applicability:** required computation for US-listed Chinese ADRs (TSM,
BABA, BIDU, JD, NIO, XPEV among others); applies broadly to
geopolitically-exposed names.

> *Note for users coming from earlier (≤0.1.x) releases:* `geopolitical`
> subsumes the prior `us_china_official` and `us_china_unofficial` axes.
> Skills should treat `geopolitical` as the canonical replacement.

### `github-activity`
GitHub activity analysis including commit velocity, community engagement,
and engineering output.
**Applicability:** Tech / Communication Services sectors plus a curated
~32-symbol allowlist. Most informative for software / infrastructure
companies.

### `insider-trading`
Executive and director transaction patterns. Higher score = favorable
insider activity (net buying or absence of unusual selling).
**Applicability:** US-listed (SEC data).

### `institutional`
SEC 13F analysis tracking institutional buying / selling, ownership
concentration, and smart money flows. Higher score = supportive
institutional positioning.
**Applicability:** US-listed (13F data).

### `job-market`
Hiring velocity analysis tracking job postings, engineering focus, executive
openings, and salary trends.

### `macro`
Interest rates, inflation, and economic growth signals. Higher score =
favorable macro environment for this name.

### `management`
Executive quality analysis including tenure, track record, compensation
alignment, and insider activity. Higher score = favorable management signals.

### `microstructure`
Bid-ask spreads, order flow, dark pool activity, and volume pattern
analysis. Higher score = healthier trading microstructure.

### `options-flow`
Options data analysis including put / call ratios, unusual activity, and
gamma squeeze potential. Higher score = options-market positioning skewed
favorably.
**Applicability:** US-listed.

### `patents`
USPTO patent analysis tracking innovation velocity, R&D investment, and
competitive IP position. Higher score = stronger / more defensible IP
position.
**Applicability:** US-listed; Tech / Healthcare / Industrials sectors.

### `regulatory`
Regulatory scrutiny, legal exposure, and compliance pressure. Higher score =
more favorable regulatory environment.
**Applicability:** US-listed (SEC EDGAR).

### `sentiment`
Investor positioning, analyst outlook, and market mood. Higher score =
broadly favorable sentiment.

### `short-interest`
FINRA short interest data, days to cover, squeeze potential, and borrow
rates. Higher score = short-interest configuration favorable for the long
side (e.g. low pressure or squeeze setup).
**Applicability:** US-listed (FINRA).

### `supplychain`
Production dependencies and logistics risks. Higher score = resilient supply
chain (less disruption / inflation pressure).
**Applicability:** Tech / Industrials / Consumer Discretionary / Healthcare
sectors.

### `technical`
Price trends, momentum, and chart signals. Higher score = technically
favorable setup.

## Retired slugs

Earlier releases of this repo (≤ v0.1.2) documented two slugs that have
since been consolidated:

- `us_china_official` → folded into `geopolitical`.
- `us_china_unofficial` → folded into `geopolitical`.

Skills should treat any historical reference to those slugs as equivalent to
`geopolitical` for narrative purposes. If the live API still returns either
slug for a particular ticker (legacy cached scores), skills should surface
it under the original slug name without trying to remap on the fly — the
cache will refresh.

## A note on UI vs. API

The Haruspex web UI may display a subset of the 23 dimensions on a stock's
detail page (the most-relevant ones for that ticker), and may group or
rename them for readability. The API always returns the canonical slugs as
listed above. Skills should refer to dimensions by their API slug.
