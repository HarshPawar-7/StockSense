const STOCK_CATEGORIES = {
    low: ["HDFCBANK.NS", "INFY.NS", "TCS.NS", "RELIANCE.NS", "ITC.NS", "BHARTIARTL.NS"],
    moderate: ["ICICIBANK.NS", "LT.NS", "SUNPHARMA.NS", "BAJFINANCE.NS", "HINDUNILVR.NS", "KOTAKBANK.NS"],
    high: ["PAYTM.NS", "ZOMATO.NS", "NYKAA.NS", "ADANIENT.NS", "TATAMOTORS.NS", "JSWSTEEL.NS"]
  };
  
  const generateRecommendations = async ({ amount, riskLevel, analyzedData }) => {
    try {
      // Filter stocks by risk category first
      const candidateSymbols = STOCK_CATEGORIES[riskLevel];
      const candidates = analyzedData.filter(stock => 
        candidateSymbols.includes(stock.symbol)
      );
      
      // Sort by best combination of trend and stability
      candidates.sort((a, b) => {
        // Higher trend score is better
        // For high risk, we care more about trend
        // For low risk, we care more about stability (lower volatility)
        const aScore = riskLevel === 'high' ? 
          a.trendScore - (a.volatility * 0.2) :
          a.trendScore - (a.volatility * 0.8);
          
        const bScore = riskLevel === 'high' ? 
          b.trendScore - (b.volatility * 0.2) :
          b.trendScore - (b.volatility * 0.8);
          
        return bScore - aScore;
      });
      
      // Determine how many stocks to recommend based on amount
      const count = Math.min(
        Math.max(3, Math.floor(amount / 5000)), // At least 3, max based on amount
        6 // Maximum 6 stocks
      );
      
      // Select top stocks
      const selectedStocks = candidates.slice(0, count);
      
      // Calculate allocation - weighted by trend score
      const totalTrendScore = selectedStocks.reduce((sum, stock) => sum + stock.trendScore, 0);
      const minAllocation = 0.05; // Each stock gets at least 5%
      
      return selectedStocks.map(stock => {
        const rawWeight = (stock.trendScore / totalTrendScore) * 0.9; // 90% to weights
        const weight = Math.max(minAllocation, rawWeight);
        const allocationAmount = amount * weight;
        const shares = (allocationAmount / stock.currentPrice).toFixed(2);
        
        return {
          symbol: stock.symbol.replace('.NS', ''),
          name: stock.name,
          currentPrice: stock.currentPrice,
          shares: parseFloat(shares),
          allocation: (weight * 100).toFixed(2) + '%',
          trend: stock.momentum,
          riskCategory: stock.riskCategory,
          analysis: {
            trendScore: stock.trendScore.toFixed(2),
            volatility: (stock.volatility * 100).toFixed(2) + '%',
            priceChange: stock.pChange + '%'
          }
        };
      });
      
    } catch (error) {
      console.error("Recommendation generation error:", error);
      throw new Error("Failed to generate recommendations");
    }
  };
  
  module.exports = { generateRecommendations };