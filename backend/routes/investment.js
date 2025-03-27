const express = require("express");
const { getStockPrice } = require("../utils/stockAnalysis");

const router = express.Router();

// Stocks categorized by risk levels
const STOCKS = {
  low: ["HDFCBANK", "INFY", "TCS", "RELIANCE"],
  moderate: ["ICICIBANK", "LT", "SUNPHARMA", "BAJFINANCE"],
  high: ["PAYTM", "ZOMATO", "NYKAA", "ADANIENT"]
};

router.post("/recommend", async (req, res) => {
  const { amount, riskLevel } = req.body;
  
  if (!amount || !riskLevel || !STOCKS[riskLevel]) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const selectedStocks = STOCKS[riskLevel];
  let stockData = [];

  for (let stock of selectedStocks) {
    const stockInfo = await getStockPrice(stock);
    if (stockInfo) {
      stockData.push(stockInfo);
    }
  }

  // Sort by best-performing stocks (highest % change)
  stockData.sort((a, b) => b.pChange - a.pChange);

  // Allocate investment based on stock ranking
  const allocation = {};
  const allocationPercents = [0.4, 0.3, 0.2, 0.1]; // Weight distribution
  for (let i = 0; i < stockData.length; i++) {
    allocation[stockData[i].symbol] = (amount * allocationPercents[i]).toFixed(2);
  }

  res.json({ riskLevel, allocation, stockData });
});

module.exports = router;
