# Investment App

A local investment screener for finding popular Indian stocks trading at a discount, grouped sector-wise.

The app uses:

- React + Vite for the frontend
- FastAPI for the local backend
- `dalal` for NSE quote data
- A sector-wise Top N screener based on each stock's gap from its 52-week high

## Features

- Pulls popular NSE stocks through a local Python API
- Groups discounted stocks sector-wise
- Lets you choose the top N stocks per sector
- Filters by sector, search text, and minimum discount
- Sorts by discount, score, or price
- Shows price, 52-week high gap, day range, volume, PE, sector PE, and source
- Shows the top 3 Google News results for the selected stock
- Falls back to sample data if the live data source is unavailable

Feature docs live in [docs/features.md](docs/features.md). Every new feature should include a `FEATURE.md` file in its feature folder.

## Data Source

Live data is pulled with [`dalal`](https://pypi.org/project/dalal/), a Python package for Indian stock market data.

The current discount metric is:

```text
(52-week high - current price) / 52-week high
```

This is a screening signal, not intrinsic value. Use it to find candidates for research, then verify fundamentals before making investment decisions.

## Setup

Install frontend dependencies:

```bash
npm install
```

Create and install Python backend dependencies:

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

## Run Locally

Start the backend:

```bash
npm run api
```

In another terminal, start the frontend:

```bash
npm run dev -- --port 5173
```

Open:

```text
http://127.0.0.1:5173/
```

## API

Health check:

```text
GET /api/health
```

Discount stock feed:

```text
GET /api/stocks-at-discount
```

Selected-stock news:

```text
GET /api/stock-news/{symbol}
```

The Vite dev server proxies `/api` requests to the FastAPI backend on port `8000`.

## Build

```bash
npm run build
```

## Notes

- NSE/third-party data access may rate-limit or fail temporarily.
- The app is for research and education, not financial advice.
