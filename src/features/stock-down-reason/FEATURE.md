# Stock Down Reason

## Purpose

Generate a concise explanation for why a selected Indian stock may be down or trading weakly.

The feature combines live NSE quote signals with the top three Google News results. It gives the user a short narrative, confidence level, and evidence bullets instead of only showing raw headlines.

## User Workflow

1. User selects a stock in the discount screener.
2. The frontend requests a reason summary for that stock.
3. The backend pulls the latest quote from `dalal`.
4. The backend pulls the top three Google News RSS results.
5. A heuristic reason engine combines price action, 52-week discount, intraday position, valuation context, and headline tags.
6. The UI displays the summary, confidence, evidence bullets, and linked headlines.

## Data Sources

### Quote And Valuation Signals

Source: `dalal` Python package.

Signals used:

- daily price change
- daily percent change
- 52-week high gap
- intraday range position
- P/E vs sector P/E

### News Signals

Source: Google News RSS.

The backend searches by company name, NSE symbol, stock/share terms, NSE, and India.

## API

```text
GET /api/stock-reason/{symbol}
```

Example response fields:

- `summary`
- `confidence`
- `reasons`
- `news`
- `source`

## Heuristic Rules

The backend adds reason bullets for:

- negative daily move
- meaningful or deep 52-week discount
- weak intraday price position
- high P/E versus sector P/E
- headline tags such as price weakness, earnings pressure, valuation concern, analyst concern, regulatory pressure, or sector pressure

## Key Files

- `backend/app.py`
- `src/features/stocks-at-discount/StocksAtDiscountFeature.jsx`
- `src/features/stocks-at-discount/discountStocks.js`
- `src/styles.css`

## Known Limitations

- The summary is heuristic, not a verified causal explanation.
- Google News results may include broad market articles that mention the stock without being the direct cause.
- There is no large language model or sentiment model yet.
- The backend does not cache Google News or quote responses yet.

## Future Improvements

- Add source weighting by publisher and recency.
- Add sector and NIFTY benchmark comparison.
- Add a lightweight sentiment classifier.
- Cache reason responses for a short time.
- Add user-facing citations grouped by reason.
