const express = require('express');
const router = express.Router();

// Enhanced Mock Data with 30+ stocks across risk categories
const STOCK_DATA = {
  low: [
    {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank',
      currentPrice: 1450.25,
      allocation: '20%',
      trend: 'positive',
      riskCategory: 'low',
      sector: 'Banking',
      marketCap: 1150000,
      peRatio: 18.5,
      dividendYield: 1.2,
      analysis: {
        priceChange: '+2.5%',
        volatility: '12.3%',
        rsi: 62,
        movingAverage: 'above',
        trendScore: 0.75
      }
    },
    {
      symbol: 'INFY',
      name: 'Infosys',
      currentPrice: 1520.75,
      allocation: '20%',
      trend: 'positive',
      riskCategory: 'low',
      sector: 'IT',
      marketCap: 650000,
      peRatio: 25.3,
      dividendYield: 2.1,
      analysis: {
        priceChange: '+1.8%',
        volatility: '11.5%',
        rsi: 58,
        movingAverage: 'above',
        trendScore: 0.68
      }
    },
    // Additional low-risk stocks
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      currentPrice: 3325.50,
      allocation: '15%',
      trend: 'neutral',
      riskCategory: 'low',
      sector: 'IT',
      marketCap: 1250000,
      peRatio: 30.1,
      dividendYield: 1.8,
      analysis: {
        priceChange: '+0.7%',
        volatility: '10.8%',
        rsi: 55,
        movingAverage: 'neutral',
        trendScore: 0.52
      }
    },
    {
      symbol: 'ITC',
      name: 'ITC Limited',
      currentPrice: 425.75,
      allocation: '15%',
      trend: 'positive',
      riskCategory: 'low',
      sector: 'FMCG',
      marketCap: 525000,
      peRatio: 22.4,
      dividendYield: 3.5,
      analysis: {
        priceChange: '+1.2%',
        volatility: '13.1%',
        rsi: 60,
        movingAverage: 'above',
        trendScore: 0.65
      }
    },
    {
      symbol: 'BHARTIARTL',
      name: 'Bharti Airtel',
      currentPrice: 785.30,
      allocation: '10%',
      trend: 'positive',
      riskCategory: 'low',
      sector: 'Telecom',
      marketCap: 445000,
      peRatio: 28.6,
      dividendYield: 0.5,
      analysis: {
        priceChange: '+2.1%',
        volatility: '14.2%',
        rsi: 63,
        movingAverage: 'above',
        trendScore: 0.72
      }
    }
  ],
  moderate: [
    {
      symbol: 'ICICIBANK',
      name: 'ICICI Bank',
      currentPrice: 890.50,
      allocation: '25%',
      trend: 'positive',
      riskCategory: 'moderate',
      sector: 'Banking',
      marketCap: 625000,
      peRatio: 20.3,
      dividendYield: 0.8,
      analysis: {
        priceChange: '+1.8%',
        volatility: '18.7%',
        rsi: 65,
        movingAverage: 'above',
        trendScore: 0.62
      }
    },
    {
      symbol: 'HINDUNILVR',
      name: 'Hindustan Unilever',
      currentPrice: 2520.75,
      allocation: '20%',
      trend: 'neutral',
      riskCategory: 'moderate',
      sector: 'FMCG',
      marketCap: 595000,
      peRatio: 55.2,
      dividendYield: 1.6,
      analysis: {
        priceChange: '+0.3%',
        volatility: '16.5%',
        rsi: 52,
        movingAverage: 'neutral',
        trendScore: 0.45
      }
    },
    // Additional moderate-risk stocks
    {
      symbol: 'KOTAKBANK',
      name: 'Kotak Mahindra Bank',
      currentPrice: 1725.40,
      allocation: '15%',
      trend: 'positive',
      riskCategory: 'moderate',
      sector: 'Banking',
      marketCap: 345000,
      peRatio: 32.7,
      dividendYield: 0.4,
      analysis: {
        priceChange: '+1.5%',
        volatility: '17.8%',
        rsi: 61,
        movingAverage: 'above',
        trendScore: 0.58
      }
    },
    {
      symbol: 'LT',
      name: 'Larsen & Toubro',
      currentPrice: 1825.60,
      allocation: '15%',
      trend: 'positive',
      riskCategory: 'moderate',
      sector: 'Construction',
      marketCap: 255000,
      peRatio: 22.1,
      dividendYield: 1.2,
      analysis: {
        priceChange: '+1.2%',
        volatility: '19.2%',
        rsi: 59,
        movingAverage: 'above',
        trendScore: 0.55
      }
    },
    {
      symbol: 'ASIANPAINT',
      name: 'Asian Paints',
      currentPrice: 3125.75,
      allocation: '10%',
      trend: 'neutral',
      riskCategory: 'moderate',
      sector: 'Paints',
      marketCap: 300000,
      peRatio: 65.3,
      dividendYield: 0.9,
      analysis: {
        priceChange: '+0.5%',
        volatility: '18.3%',
        rsi: 54,
        movingAverage: 'neutral',
        trendScore: 0.48
      }
    }
  ],
  high: [
    {
      symbol: 'TATAMOTORS',
      name: 'Tata Motors',
      currentPrice: 495.75,
      allocation: '25%',
      trend: 'negative',
      riskCategory: 'high',
      sector: 'Automobile',
      marketCap: 165000,
      peRatio: 12.5,
      dividendYield: 0.3,
      analysis: {
        priceChange: '-1.2%',
        volatility: '28.4%',
        rsi: 42,
        movingAverage: 'below',
        trendScore: -0.35
      }
    },
    {
      symbol: 'ADANIENT',
      name: 'Adani Enterprises',
      currentPrice: 2850.50,
      allocation: '20%',
      trend: 'volatile',
      riskCategory: 'high',
      sector: 'Conglomerate',
      marketCap: 325000,
      peRatio: 85.2,
      dividendYield: 0.1,
      analysis: {
        priceChange: '±5.2%',
        volatility: '35.7%',
        rsi: 48,
        movingAverage: 'neutral',
        trendScore: -0.45
      }
    },
    // Additional high-risk stocks
    {
      symbol: 'VEDL',
      name: 'Vedanta Limited',
      currentPrice: 285.75,
      allocation: '15%',
      trend: 'negative',
      riskCategory: 'high',
      sector: 'Metals',
      marketCap: 105000,
      peRatio: 8.5,
      dividendYield: 5.2,
      analysis: {
        priceChange: '-2.1%',
        volatility: '32.8%',
        rsi: 38,
        movingAverage: 'below',
        trendScore: -0.52
      }
    },
    {
      symbol: 'ZOMATO',
      name: 'Zomato',
      currentPrice: 125.40,
      allocation: '15%',
      trend: 'volatile',
      riskCategory: 'high',
      sector: 'Internet',
      marketCap: 105000,
      peRatio: -1, // Negative PE for loss-making companies
      dividendYield: 0,
      analysis: {
        priceChange: '±7.5%',
        volatility: '42.3%',
        rsi: 45,
        movingAverage: 'neutral',
        trendScore: -0.62
      }
    },
    {
      symbol: 'PAYTM',
      name: 'One97 Communications',
      currentPrice: 850.60,
      allocation: '10%',
      trend: 'negative',
      riskCategory: 'high',
      sector: 'FinTech',
      marketCap: 55000,
      peRatio: -1,
      dividendYield: 0,
      analysis: {
        priceChange: '-3.2%',
        volatility: '38.6%',
        rsi: 40,
        movingAverage: 'below',
        trendScore: -0.68
      }
    }
  ]
};

// Enhanced recommendation algorithm
router.post('/recommend', (req, res) => {
  try {
    const { amount, riskLevel } = req.body;
    
    // Validate input
    if (!['low', 'moderate', 'high'].includes(riskLevel)) {
      return res.status(400).json({ error: 'Invalid risk level' });
    }
    
    if (!amount || isNaN(amount) || amount < 1000) {
      return res.status(400).json({ error: 'Invalid amount (minimum ₹1000)' });
    }
    
    // Get base recommendations
    const baseStocks = STOCK_DATA[riskLevel];
    
    // Calculate allocation based on amount
    const recommendations = baseStocks.map(stock => {
      const allocationAmount = amount * (parseFloat(stock.allocation) / 100);
      const shares = (allocationAmount / stock.currentPrice).toFixed(2);
      
      return {
        ...stock,
        shares: parseFloat(shares),
        allocationAmount,
        expectedReturn: calculateExpectedReturn(stock),
        riskScore: calculateRiskScore(stock)
      };
    });
    
    // Sort by best risk-reward ratio
    recommendations.sort((a, b) => 
      (b.expectedReturn / b.riskScore) - (a.expectedReturn / a.riskScore)
    );
    
    res.json({ 
      recommendations,
      totalInvestment: amount,
      riskLevel,
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate recommendations',
      details: error.message 
    });
  }
});

// Helper functions
function calculateExpectedReturn(stock) {
  // Simple calculation based on trend score and dividend
  const baseReturn = stock.analysis.trendScore * 5; // 5% per trend score point
  return baseReturn + (stock.dividendYield || 0);
}

function calculateRiskScore(stock) {
  // Higher volatility and negative trends increase risk
  const volatility = parseFloat(stock.analysis.volatility) / 100;
  return volatility * (stock.analysis.trendScore < 0 ? 1.5 : 1);
}

module.exports = router;