const { exec } = require('child_process');
const path = require('path');

const getStockPrices = async () => {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.join(__dirname, '../utils/stockFetcher.py');
    
    exec(`python ${pythonScriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        return reject(new Error("Failed to fetch stock data"));
      }

      try {
        const result = JSON.parse(stdout);
        
        if (result.error) {
          console.error("Python script error:", result.error);
          return reject(new Error(result.error));
        }
        
        // Transform data for easier processing
        const transformedData = result.data.map(stock => ({
          symbol: stock.symbol,
          name: stock.companyName,
          currentPrice: stock.lastPrice,
          dayHigh: stock.dayHigh,
          dayLow: stock.dayLow,
          pChange: stock.pChange,
          previousClose: stock.previousClose,
          volume: stock.totalTradedVolume,
          marketCap: stock.marketCap
        }));
        
        resolve(transformedData);
      } catch (err) {
        console.error("Failed to parse stock data:", err);
        reject(new Error("Invalid stock data received"));
      }
    });
  });
};

module.exports = { getStockPrices };