import {
  ArrowDownUp,
  BadgeDollarSign,
  BarChart3,
  CheckCircle2,
  Filter,
  RefreshCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  TrendingDown
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  fetchIndianDiscountStocks,
  getDiscountPercent,
  getFallbackDiscountStocks,
  indianStockUniverse,
  scoreStock
} from "./discountStocks";

const currency = new Intl.NumberFormat("en-IN", {
  currency: "INR",
  maximumFractionDigits: 2,
  style: "currency"
});

const volume = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
  notation: "compact"
});

const sectors = ["All", ...Array.from(new Set(indianStockUniverse.map((stock) => stock.sector)))];

function Sparkline({ points }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const coords = points
    .map((point, index) => {
      const x = points.length === 1 ? 100 : (index / (points.length - 1)) * 100;
      const y = 36 - ((point - min) / (max - min || 1)) * 30;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className="sparkline" viewBox="0 0 100 40" aria-hidden="true">
      <polyline points={coords} />
    </svg>
  );
}

function StockRow({ stock, selected, onSelect }) {
  const discount = getDiscountPercent(stock);
  const score = scoreStock(stock);

  return (
    <button className={`stock-row ${selected ? "is-selected" : ""}`} onClick={onSelect}>
      <span className="ticker-block">
        <strong>{stock.ticker.replace(".NS", "")}</strong>
        <span>{stock.company}</span>
      </span>
      <span className="row-sector">{stock.sector}</span>
      <span className="row-metric">{currency.format(stock.price)}</span>
      <span className="row-metric discount">{discount}%</span>
      <span className="row-score">{score}</span>
    </button>
  );
}

export function StocksAtDiscountFeature() {
  const [stocks, setStocks] = useState(() => getFallbackDiscountStocks());
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("All");
  const [minDiscount, setMinDiscount] = useState(10);
  const [stocksPerSector, setStocksPerSector] = useState(3);
  const [sortBy, setSortBy] = useState("discount");
  const [selectedTicker, setSelectedTicker] = useState(getFallbackDiscountStocks()[0].ticker);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  async function loadStocks() {
    setLoading(true);
    setError("");

    try {
      const liveStocks = await fetchIndianDiscountStocks();
      setStocks(liveStocks);
      setSelectedTicker((currentTicker) =>
        liveStocks.some((stock) => stock.ticker === currentTicker) ? currentTicker : liveStocks[0].ticker
      );
      setLastUpdated(new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" }));
    } catch (loadError) {
      setStocks(getFallbackDiscountStocks());
      setSelectedTicker(getFallbackDiscountStocks()[0].ticker);
      setError(loadError.message);
      setLastUpdated("");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStocks();
  }, []);

  const sortedFilteredStocks = useMemo(() => {
    return stocks
      .filter((stock) => {
        const matchesQuery =
          stock.ticker.toLowerCase().includes(query.toLowerCase()) ||
          stock.company.toLowerCase().includes(query.toLowerCase());
        const matchesSector = sector === "All" || stock.sector === sector;
        const matchesDiscount = getDiscountPercent(stock) >= minDiscount;
        return matchesQuery && matchesSector && matchesDiscount;
      })
      .sort((a, b) => {
        if (sortBy === "score") return scoreStock(b) - scoreStock(a);
        if (sortBy === "price") return a.price - b.price;
        return getDiscountPercent(b) - getDiscountPercent(a);
      });
  }, [stocks, query, sector, minDiscount, sortBy]);

  const sectorGroups = useMemo(() => {
    const groups = new Map();

    sortedFilteredStocks.forEach((stock) => {
      const currentGroup = groups.get(stock.sector) ?? [];
      currentGroup.push(stock);
      groups.set(stock.sector, currentGroup);
    });

    return Array.from(groups.entries()).map(([name, groupStocks]) => ({
      name,
      total: groupStocks.length,
      stocks: groupStocks.slice(0, stocksPerSector)
    }));
  }, [sortedFilteredStocks, stocksPerSector]);

  const visibleStocks = useMemo(
    () => sectorGroups.flatMap((group) => group.stocks),
    [sectorGroups]
  );

  const selectedStock =
    visibleStocks.find((stock) => stock.ticker === selectedTicker) ?? visibleStocks[0] ?? stocks[0];

  const averageDiscount = Math.round(
    visibleStocks.reduce((sum, stock) => sum + getDiscountPercent(stock), 0) / (visibleStocks.length || 1)
  );

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <BadgeDollarSign size={28} />
          <span>ValueDesk</span>
        </div>
        <nav>
          <a className="active" href="#discounts">
            <TrendingDown size={18} />
            NSE Discounts
          </a>
          <a href="#watchlist">
            <ShieldCheck size={18} />
            Watchlist
          </a>
          <a href="#research">
            <BarChart3 size={18} />
            Research
          </a>
        </nav>
      </aside>

      <section className="workspace" id="discounts">
        <header className="topbar">
          <div>
            <p className="eyebrow">Feature 1</p>
            <h1>Indian stocks at a discount</h1>
          </div>
          <div className="topbar-actions">
            <div className="market-state">
              <CheckCircle2 size={18} />
              {loading ? "Pulling NSE quotes" : lastUpdated || "Fallback data"}
            </div>
            <button className="icon-button" onClick={loadStocks} disabled={loading} aria-label="Refresh quotes">
              <RefreshCcw size={18} />
            </button>
          </div>
        </header>

        {error && (
          <div className="source-alert">
            Live pull failed, showing fallback data. Source said: {error}
          </div>
        )}

        <section className="summary-grid" aria-label="Discount summary">
          <article>
            <span>Shown</span>
            <strong>{visibleStocks.length}</strong>
          </article>
          <article>
            <span>Average 52W discount</span>
            <strong>{averageDiscount}%</strong>
          </article>
          <article>
            <span>Sectors</span>
            <strong>{sectorGroups.length}</strong>
          </article>
        </section>

        <section className="controls" aria-label="Stock filters">
          <label className="search-field">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Indian ticker or company"
            />
          </label>

          <label className="select-field">
            <Filter size={18} />
            <select value={sector} onChange={(event) => setSector(event.target.value)}>
              {sectors.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="range-field">
            <span>Min discount</span>
            <input
              type="range"
              min="0"
              max="40"
              value={minDiscount}
              onChange={(event) => setMinDiscount(Number(event.target.value))}
            />
            <strong>{minDiscount}%</strong>
          </label>

          <label className="number-field">
            <SlidersHorizontal size={18} />
            <span>Top</span>
            <input
              type="number"
              min="1"
              max="10"
              value={stocksPerSector}
              onChange={(event) => setStocksPerSector(Math.max(1, Math.min(10, Number(event.target.value) || 1)))}
              aria-label="Stocks per sector"
            />
            <span>per sector</span>
          </label>

          <label className="select-field">
            <ArrowDownUp size={18} />
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="discount">Sort by discount</option>
              <option value="score">Sort by score</option>
              <option value="price">Sort by price</option>
            </select>
          </label>
        </section>

        <section className="content-grid">
          <div className="sector-stock-list" aria-label="Sector-wise discount stock list">
            {sectorGroups.map((group) => (
              <section className="stock-table" key={group.name}>
                <div className="sector-heading">
                  <div>
                    <span>Sector</span>
                    <strong>{group.name}</strong>
                  </div>
                  <p>
                    Showing {group.stocks.length} of {group.total}
                  </p>
                </div>
                <div className="stock-header" role="row">
                  <span>Company</span>
                  <span>Sector</span>
                  <span>Price</span>
                  <span>52W gap</span>
                  <span>Score</span>
                </div>
                {group.stocks.map((stock) => (
                  <StockRow
                    key={stock.ticker}
                    stock={stock}
                    selected={stock.ticker === selectedStock.ticker}
                    onSelect={() => setSelectedTicker(stock.ticker)}
                  />
                ))}
              </section>
            ))}
            {visibleStocks.length === 0 && (
              <div className="empty-state">No Indian stocks match the current screen.</div>
            )}
          </div>

          <aside className="stock-detail" aria-label="Selected stock details">
            <div className="detail-heading">
              <div>
                <p>{selectedStock.sector}</p>
                <h2>{selectedStock.ticker.replace(".NS", "")}</h2>
                <span>{selectedStock.company}</span>
              </div>
              <strong>{scoreStock(selectedStock)}</strong>
            </div>

            <Sparkline points={selectedStock.spark} />

            <div className="metrics-grid">
              <span>
                Price <strong>{currency.format(selectedStock.price)}</strong>
              </span>
              <span>
                {selectedStock.fairValueLabel} <strong>{currency.format(selectedStock.fairValue)}</strong>
              </span>
              <span>
                Day low <strong>{selectedStock.dayLow ? currency.format(selectedStock.dayLow) : "N/A"}</strong>
              </span>
              <span>
                Day high <strong>{selectedStock.dayHigh ? currency.format(selectedStock.dayHigh) : "N/A"}</strong>
              </span>
              <span>
                Volume <strong>{selectedStock.volume ? volume.format(selectedStock.volume) : "N/A"}</strong>
              </span>
              <span>
                Source <strong>{selectedStock.source}</strong>
              </span>
            </div>

            <div className="watch-note">
              <span>{getDiscountPercent(selectedStock)}% below 52-week high</span>
              <p>
                This is a free-data discount screen, not an intrinsic-value call. Use it to find Indian stocks
                trading well below recent highs, then confirm valuation with fundamentals before buying.
              </p>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
