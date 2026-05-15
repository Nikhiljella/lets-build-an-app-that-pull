export const indianStockUniverse = [
  { ticker: "RELIANCE.NS", company: "Reliance Industries", sector: "Energy", popularity: 1 },
  { ticker: "TCS.NS", company: "Tata Consultancy Services", sector: "Information Technology", popularity: 2 },
  { ticker: "HDFCBANK.NS", company: "HDFC Bank", sector: "Financials", popularity: 3 },
  { ticker: "ICICIBANK.NS", company: "ICICI Bank", sector: "Financials", popularity: 4 },
  { ticker: "INFY.NS", company: "Infosys", sector: "Information Technology", popularity: 5 },
  { ticker: "SBIN.NS", company: "State Bank of India", sector: "Financials", popularity: 6 },
  { ticker: "BHARTIARTL.NS", company: "Bharti Airtel", sector: "Communication Services", popularity: 7 },
  { ticker: "ITC.NS", company: "ITC", sector: "Consumer Staples", popularity: 8 },
  { ticker: "LT.NS", company: "Larsen & Toubro", sector: "Industrials", popularity: 9 },
  { ticker: "HINDUNILVR.NS", company: "Hindustan Unilever", sector: "Consumer Staples", popularity: 10 },
  { ticker: "BAJFINANCE.NS", company: "Bajaj Finance", sector: "Financials", popularity: 11 },
  { ticker: "MARUTI.NS", company: "Maruti Suzuki India", sector: "Consumer Discretionary", popularity: 12 },
  { ticker: "SUNPHARMA.NS", company: "Sun Pharmaceutical", sector: "Healthcare", popularity: 13 },
  { ticker: "TMPV.NS", company: "Tata Motors Passenger Vehicles", sector: "Consumer Discretionary", popularity: 14 },
  { ticker: "AXISBANK.NS", company: "Axis Bank", sector: "Financials", popularity: 15 },
  { ticker: "KOTAKBANK.NS", company: "Kotak Mahindra Bank", sector: "Financials", popularity: 16 },
  { ticker: "M&M.NS", company: "Mahindra & Mahindra", sector: "Consumer Discretionary", popularity: 17 },
  { ticker: "ULTRACEMCO.NS", company: "UltraTech Cement", sector: "Materials", popularity: 18 },
  { ticker: "ASIANPAINT.NS", company: "Asian Paints", sector: "Materials", popularity: 19 },
  { ticker: "WIPRO.NS", company: "Wipro", sector: "Information Technology", popularity: 20 },
  { ticker: "HCLTECH.NS", company: "HCL Technologies", sector: "Information Technology", popularity: 21 },
  { ticker: "TITAN.NS", company: "Titan Company", sector: "Consumer Discretionary", popularity: 22 },
  { ticker: "NTPC.NS", company: "NTPC", sector: "Utilities", popularity: 23 },
  { ticker: "POWERGRID.NS", company: "Power Grid Corporation", sector: "Utilities", popularity: 24 },
  { ticker: "ONGC.NS", company: "Oil and Natural Gas Corporation", sector: "Energy", popularity: 25 },
  { ticker: "COALINDIA.NS", company: "Coal India", sector: "Energy", popularity: 26 },
  { ticker: "NESTLEIND.NS", company: "Nestle India", sector: "Consumer Staples", popularity: 27 },
  { ticker: "DRREDDY.NS", company: "Dr. Reddy's Laboratories", sector: "Healthcare", popularity: 28 },
  { ticker: "CIPLA.NS", company: "Cipla", sector: "Healthcare", popularity: 29 },
  { ticker: "ADANIPORTS.NS", company: "Adani Ports", sector: "Industrials", popularity: 30 },
  { ticker: "GRASIM.NS", company: "Grasim Industries", sector: "Materials", popularity: 31 },
  { ticker: "TECHM.NS", company: "Tech Mahindra", sector: "Information Technology", popularity: 32 }
];

const fallbackMetrics = {
  "RELIANCE.NS": [1336.4, 1611.8, 1329.2, 1364.8, 19976192],
  "TCS.NS": [3868.2, 4590, 3830, 3914, 1842000],
  "HDFCBANK.NS": [1516.5, 1794, 1502, 1534, 14100000],
  "ICICIBANK.NS": [1087.1, 1287, 1078, 1104, 15600000],
  "INFY.NS": [1478.7, 1903, 1466, 1501, 6200000],
  "SBIN.NS": [742.8, 912, 735, 754, 21000000],
  "BHARTIARTL.NS": [1388.4, 1716, 1374, 1405, 3600000],
  "ITC.NS": [421.6, 528, 418, 427, 10600000],
  "LT.NS": [3280.2, 3963, 3252, 3324, 2300000],
  "HINDUNILVR.NS": [2244.8, 3021, 2228, 2276, 1700000],
  "BAJFINANCE.NS": [6812.1, 8192, 6740, 6904, 1100000],
  "MARUTI.NS": [11876.5, 13680, 11790, 12040, 470000],
  "SUNPHARMA.NS": [1638.4, 1960, 1621, 1668, 2200000],
  "TMPV.NS": [356.15, 744, 352.2, 365.4, 28500000],
  "AXISBANK.NS": [1114.7, 1340, 1102, 1128, 8700000],
  "KOTAKBANK.NS": [1748.3, 2057, 1731, 1766, 3600000],
  "M&M.NS": [2812.9, 3270, 2788, 2858, 1900000],
  "ULTRACEMCO.NS": [10444.4, 12145, 10330, 10590, 310000],
  "ASIANPAINT.NS": [2388.5, 3394, 2371, 2422, 1300000],
  "WIPRO.NS": [487.2, 579, 482, 493, 8100000],
  "HCLTECH.NS": [1527.6, 1880, 1510, 1548, 2700000],
  "TITAN.NS": [3216.5, 3886, 3184, 3268, 970000],
  "NTPC.NS": [338.4, 448, 334, 344, 16900000],
  "POWERGRID.NS": [287.6, 366, 284, 292, 14200000],
  "ONGC.NS": [248.8, 345, 246, 253, 14800000],
  "COALINDIA.NS": [394.3, 544, 389, 401, 9600000],
  "NESTLEIND.NS": [2210.6, 2778, 2192, 2240, 780000],
  "DRREDDY.NS": [6144.9, 7100, 6088, 6218, 430000],
  "CIPLA.NS": [1428.2, 1702, 1414, 1452, 1800000],
  "ADANIPORTS.NS": [1198.4, 1621, 1185, 1219, 6900000],
  "GRASIM.NS": [2484.5, 2877, 2460, 2521, 820000],
  "TECHM.NS": [1296.4, 1807, 1284, 1318, 2600000]
};

const fallbackStocks = indianStockUniverse.map((stock) => {
  const [price, fairValue, dayLow, dayHigh, volume] = fallbackMetrics[stock.ticker];

  return {
    ...stock,
    price,
    fairValue,
    fairValueLabel: "52W high",
    dayLow,
    dayHigh,
    volume,
    currency: "INR",
    source: "Fallback sample",
    updatedAt: null,
    spark: [fairValue * 0.92, price * 1.05, price * 1.02, price * 0.99, price]
  };
});

export async function fetchIndianDiscountStocks() {
  const response = await fetch("/api/stocks-at-discount");

  if (!response.ok) {
    throw new Error(`dalal API returned ${response.status}`);
  }

  const data = await response.json();

  if (!data.stocks?.length) {
    throw new Error(data.errors?.[0]?.message ?? "No live Indian stock quotes were returned.");
  }

  return data.stocks;
}

export function getFallbackDiscountStocks() {
  return fallbackStocks;
}

export function scoreStock(stock) {
  const discount = getDiscountPercent(stock);
  const discountScore = Math.min(Math.max(discount, 0) * 2, 65);
  const rangeScore =
    stock.dayHigh && stock.dayLow && stock.dayHigh > stock.dayLow
      ? Math.min(((stock.price - stock.dayLow) / (stock.dayHigh - stock.dayLow)) * 15, 15)
      : 8;
  const liquidityScore = stock.volume ? Math.min(Math.log10(stock.volume) * 3, 20) : 8;

  return Math.round(discountScore + rangeScore + liquidityScore);
}

export function getDiscountPercent(stock) {
  if (!stock.fairValue || stock.fairValue <= 0) return 0;
  return Math.round(((stock.fairValue - stock.price) / stock.fairValue) * 100);
}
