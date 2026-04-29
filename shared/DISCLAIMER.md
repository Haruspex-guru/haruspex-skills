# Canonical Disclaimer Footer

This is the single source of truth for the compliance footer that **every**
skill output must include. If you change it here, all skills update.

## English (default)

```
> **Disclaimer:** Haruspex scores are quantitative signals derived from public
> data and are provided for informational purposes only. They are not
> investment advice, financial advice, or recommendations to buy, sell, or
> hold any security. Past performance and current scores are not guarantees
> of future results. Always do your own research and consider consulting a
> licensed financial advisor before making investment decisions. Data via
> haruspex.guru.
```

## Japanese (placeholder — TODO: replace with maintainer-supplied wording)

<!-- TODO: replace with legally-reviewed Japanese disclaimer text. -->

```
> **免責事項:** Haruspex のスコアは公開データから導出された定量的シグナルで
> あり、情報提供のみを目的としています。投資助言、金融助言、または有価証券
> の売買・保有の推奨ではありません。過去のパフォーマンスや現在のスコアは将
> 来の結果を保証するものではありません。投資判断を行う前に必ずご自身で調
> 査を行い、必要に応じて有資格の金融アドバイザーにご相談ください。データ
> は haruspex.guru より。
```

## When the footer must appear

Every analytical output produced by any skill in this repository — every
single-ticker analysis, every watchlist table, every thesis evaluation — must
end with the disclaimer footer in the language matching the user's input.

If a skill responds without producing analysis (e.g. it stops because the MCP
server is unavailable, or because the ticker returned `NOT_FOUND`), the
footer is not required for that response, but the skill should still avoid
giving advice in any form.

## Why this exists

Haruspex scores are signals, not recommendations. The legal and ethical
positioning of the entire product depends on this distinction being
maintained at every output. Treat this footer as load-bearing.
