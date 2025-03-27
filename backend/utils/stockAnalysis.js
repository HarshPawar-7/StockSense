const axios = require("axios");

async function getStockPrice(symbol) {
  try {
    const response = await axios.get(
      `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json"
        }
      }
    );

    const data = response.data;
    return {
      symbol: symbol,
      lastPrice: data.priceInfo.lastPrice,
      change: data.priceInfo.change,
      pChange: data.priceInfo.pChange
    };
  } catch (error) {
    console.error(`Error fetching stock price for ${symbol}:`, error);
    return null;
  }
}

module.exports = { getStockPrice };
