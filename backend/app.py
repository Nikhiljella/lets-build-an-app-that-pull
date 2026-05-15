from concurrent.futures import ThreadPoolExecutor, as_completed
from html import unescape
from typing import Any
from urllib.parse import quote_plus
from xml.etree import ElementTree

import dalal
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware


POPULAR_INDIAN_STOCKS = [
    {"ticker": "RELIANCE.NS", "symbol": "RELIANCE", "company": "Reliance Industries", "sector": "Energy", "popularity": 1},
    {"ticker": "TCS.NS", "symbol": "TCS", "company": "Tata Consultancy Services", "sector": "Information Technology", "popularity": 2},
    {"ticker": "HDFCBANK.NS", "symbol": "HDFCBANK", "company": "HDFC Bank", "sector": "Financials", "popularity": 3},
    {"ticker": "ICICIBANK.NS", "symbol": "ICICIBANK", "company": "ICICI Bank", "sector": "Financials", "popularity": 4},
    {"ticker": "INFY.NS", "symbol": "INFY", "company": "Infosys", "sector": "Information Technology", "popularity": 5},
    {"ticker": "SBIN.NS", "symbol": "SBIN", "company": "State Bank of India", "sector": "Financials", "popularity": 6},
    {"ticker": "BHARTIARTL.NS", "symbol": "BHARTIARTL", "company": "Bharti Airtel", "sector": "Communication Services", "popularity": 7},
    {"ticker": "ITC.NS", "symbol": "ITC", "company": "ITC", "sector": "Consumer Staples", "popularity": 8},
    {"ticker": "LT.NS", "symbol": "LT", "company": "Larsen & Toubro", "sector": "Industrials", "popularity": 9},
    {"ticker": "HINDUNILVR.NS", "symbol": "HINDUNILVR", "company": "Hindustan Unilever", "sector": "Consumer Staples", "popularity": 10},
    {"ticker": "BAJFINANCE.NS", "symbol": "BAJFINANCE", "company": "Bajaj Finance", "sector": "Financials", "popularity": 11},
    {"ticker": "MARUTI.NS", "symbol": "MARUTI", "company": "Maruti Suzuki India", "sector": "Consumer Discretionary", "popularity": 12},
    {"ticker": "SUNPHARMA.NS", "symbol": "SUNPHARMA", "company": "Sun Pharmaceutical", "sector": "Healthcare", "popularity": 13},
    {"ticker": "TMPV.NS", "symbol": "TMPV", "company": "Tata Motors Passenger Vehicles", "sector": "Consumer Discretionary", "popularity": 14},
    {"ticker": "AXISBANK.NS", "symbol": "AXISBANK", "company": "Axis Bank", "sector": "Financials", "popularity": 15},
    {"ticker": "KOTAKBANK.NS", "symbol": "KOTAKBANK", "company": "Kotak Mahindra Bank", "sector": "Financials", "popularity": 16},
    {"ticker": "M&M.NS", "symbol": "M&M", "company": "Mahindra & Mahindra", "sector": "Consumer Discretionary", "popularity": 17},
    {"ticker": "ULTRACEMCO.NS", "symbol": "ULTRACEMCO", "company": "UltraTech Cement", "sector": "Materials", "popularity": 18},
    {"ticker": "ASIANPAINT.NS", "symbol": "ASIANPAINT", "company": "Asian Paints", "sector": "Materials", "popularity": 19},
    {"ticker": "WIPRO.NS", "symbol": "WIPRO", "company": "Wipro", "sector": "Information Technology", "popularity": 20},
    {"ticker": "HCLTECH.NS", "symbol": "HCLTECH", "company": "HCL Technologies", "sector": "Information Technology", "popularity": 21},
    {"ticker": "TITAN.NS", "symbol": "TITAN", "company": "Titan Company", "sector": "Consumer Discretionary", "popularity": 22},
    {"ticker": "NTPC.NS", "symbol": "NTPC", "company": "NTPC", "sector": "Utilities", "popularity": 23},
    {"ticker": "POWERGRID.NS", "symbol": "POWERGRID", "company": "Power Grid Corporation", "sector": "Utilities", "popularity": 24},
    {"ticker": "ONGC.NS", "symbol": "ONGC", "company": "Oil and Natural Gas Corporation", "sector": "Energy", "popularity": 25},
    {"ticker": "COALINDIA.NS", "symbol": "COALINDIA", "company": "Coal India", "sector": "Energy", "popularity": 26},
    {"ticker": "NESTLEIND.NS", "symbol": "NESTLEIND", "company": "Nestle India", "sector": "Consumer Staples", "popularity": 27},
    {"ticker": "DRREDDY.NS", "symbol": "DRREDDY", "company": "Dr. Reddy's Laboratories", "sector": "Healthcare", "popularity": 28},
    {"ticker": "CIPLA.NS", "symbol": "CIPLA", "company": "Cipla", "sector": "Healthcare", "popularity": 29},
    {"ticker": "ADANIPORTS.NS", "symbol": "ADANIPORTS", "company": "Adani Ports", "sector": "Industrials", "popularity": 30},
    {"ticker": "GRASIM.NS", "symbol": "GRASIM", "company": "Grasim Industries", "sector": "Materials", "popularity": 31},
    {"ticker": "TECHM.NS", "symbol": "TECHM", "company": "Tech Mahindra", "sector": "Information Technology", "popularity": 32},
]


app = FastAPI(title="Investment App API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5175"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


def _num(value: Any) -> float | None:
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _normalize_quote(profile: dict[str, Any]) -> dict[str, Any]:
    quote = dalal.quote(profile["symbol"])
    price_info = quote.get("priceInfo") or {}
    week_range = price_info.get("weekHighLow") or {}
    day_range = price_info.get("intraDayHighLow") or {}
    metadata = quote.get("metadata") or {}
    info = quote.get("info") or {}
    industry_info = quote.get("industryInfo") or {}
    preopen = quote.get("preOpenMarket") or {}

    price = _num(price_info.get("lastPrice")) or _num(price_info.get("close"))
    fair_value = _num(week_range.get("max"))

    if not price or not fair_value:
        raise ValueError(f"{profile['symbol']} did not include price and 52-week high")

    spark = [
        _num(price_info.get("previousClose")),
        _num(price_info.get("open")),
        _num(day_range.get("min")),
        _num(day_range.get("max")),
        price,
    ]
    spark = [point for point in spark if point is not None]

    return {
        "ticker": profile["ticker"],
        "symbol": profile["symbol"],
        "company": info.get("companyName") or profile["company"],
        "sector": industry_info.get("macro") or profile["sector"],
        "price": price,
        "change": _num(price_info.get("change")),
        "changePercent": _num(price_info.get("pChange")),
        "fairValue": fair_value,
        "fairValueLabel": "52W high",
        "dayLow": _num(day_range.get("min")),
        "dayHigh": _num(day_range.get("max")),
        "weekLow": _num(week_range.get("min")),
        "volume": _num(preopen.get("totalTradedVolume")),
        "pe": _num(metadata.get("pdSymbolPe")),
        "sectorPe": _num(metadata.get("pdSectorPe")),
        "currency": "INR",
        "source": "dalal / NSE",
        "updatedAt": metadata.get("lastUpdateTime"),
        "popularity": profile["popularity"],
        "spark": spark or [price],
    }


def _profile_for_symbol(symbol: str) -> dict[str, Any] | None:
    return next((profile for profile in POPULAR_INDIAN_STOCKS if profile["symbol"] == symbol), None)


def _google_news_url(profile: dict[str, Any]) -> str:
    query = f'"{profile["company"]}" OR {profile["symbol"]} stock shares NSE India'
    return (
        "https://news.google.com/rss/search?"
        f"q={quote_plus(query)}&hl=en-IN&gl=IN&ceid=IN:en"
    )


def _normalize_google_item(item: ElementTree.Element) -> dict[str, Any]:
    title = unescape(item.findtext("title") or "Google News item")
    source = item.findtext("source") or "Google News"

    return {
        "category": unescape(source),
        "headline": title,
        "date": item.findtext("pubDate"),
        "source": "Google News",
        "url": item.findtext("link"),
    }


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "source": "dalal"}


@app.get("/api/stocks-at-discount")
def stocks_at_discount() -> dict[str, Any]:
    stocks: list[dict[str, Any]] = []
    errors: list[dict[str, str]] = []

    with ThreadPoolExecutor(max_workers=6) as executor:
        future_to_profile = {
            executor.submit(_normalize_quote, profile): profile for profile in POPULAR_INDIAN_STOCKS
        }

        for future in as_completed(future_to_profile):
            profile = future_to_profile[future]
            try:
                stocks.append(future.result())
            except Exception as exc:
                errors.append({"ticker": profile["ticker"], "message": str(exc)})

    stocks.sort(key=lambda stock: stock["popularity"])

    return {
        "source": "dalal",
        "count": len(stocks),
        "errors": errors,
        "stocks": stocks,
    }


@app.get("/api/stock-news/{symbol}")
def stock_news(symbol: str) -> dict[str, Any]:
    clean_symbol = symbol.upper().replace(".NS", "")
    profile = _profile_for_symbol(clean_symbol)

    if not profile:
        raise HTTPException(status_code=404, detail=f"Unknown stock symbol: {symbol}")

    try:
        response = requests.get(
            _google_news_url(profile),
            headers={
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/rss+xml,application/xml,text/xml",
            },
            timeout=8,
        )
        response.raise_for_status()
        root = ElementTree.fromstring(response.content)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Google News fetch failed: {exc}") from exc

    items = root.findall("./channel/item")
    news = [_normalize_google_item(item) for item in items[:3]]

    return {
        "symbol": clean_symbol,
        "source": "Google News RSS",
        "count": len(news),
        "news": news,
    }
