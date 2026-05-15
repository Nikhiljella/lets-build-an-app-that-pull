# Stocks At Discount

## Purpose

Find popular Indian stocks trading below their 52-week highs, grouped sector-wise, and help the user quickly inspect why a selected stock may be down.

This feature is a screening tool, not a buy/sell recommendation.

## User Workflow

1. The app pulls popular NSE stock quotes from the local backend.
2. Stocks are filtered by search text, sector, and minimum discount.
3. Results are grouped by sector.
4. The user chooses how many stocks to show per sector.
5. Selecting a stock opens its detail panel.
6. The detail panel shows price metrics, move, PE, discount from 52-week high, and a downside reason summary.

## Data Sources

### Stock Quotes

Source: `dalal` Python package.

Backend route:

```text
GET /api/stocks-at-discount
```

Returned stock rows include:

- ticker
- symbol
- company
- sector
- current price
- daily change and percent change
- 52-week high and low
- day high and low
- volume
- PE and sector PE
- sparkline points

### Stock Down Reason

Source: Google News RSS.

Backend route:

```text
GET /api/stock-reason/{symbol}
```

The backend combines live quote signals with Google News RSS results to produce a short explanation, confidence level, evidence bullets, and linked headlines.

Returned news rows include:

- publisher/category
- headline
- published date
- URL

## Discount Logic

The current discount metric is:

```text
(52-week high - current price) / 52-week high
```

This is a momentum/value screen signal. It is not intrinsic value.

## Scoring Logic

Frontend scoring combines:

- discount from 52-week high
- intraday position
- liquidity proxy from volume

Implementation:

```text
src/features/stocks-at-discount/discountStocks.js
```

## Key Files

- `src/features/stocks-at-discount/StocksAtDiscountFeature.jsx`
- `src/features/stocks-at-discount/discountStocks.js`
- `backend/app.py`
- `src/styles.css`

## Fallback Behavior

If the live `dalal` quote pull fails, the frontend falls back to sample stock data in:

```text
src/features/stocks-at-discount/discountStocks.js
```

If Google News fails, the selected stock panel shows a news-unavailable message without breaking the stock screener.

## Known Limitations

- Google News RSS results are search results, not guaranteed causal explanations for a price drop.
- The discount calculation uses 52-week high, not fair value or intrinsic value.
- `dalal` relies on upstream NSE availability and can fail or rate-limit.
- The stock universe is currently a curated static list of popular Indian stocks.

## Future Improvements

- Add a true fundamental valuation score using earnings, book value, debt, and ROE.
- Add sector-level benchmark comparison.
- Add news sentiment classification.
- Cache stock quote and news responses server-side.
- Move the stock universe to a config file or database.
