const express = require('express');
const router = express.Router();

// Mock stock data
const STOCK_DATA = {
  low: [
    {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank',
      currentPrice: 1450.25,
      shares: 3.45,
      allocation: '34.5%',
      trend: 'positive',
      riskCategory: 'low',
      analysis: {
        priceChange: '+2.5%',
        volatility: '12.3%',
        trendScore: 0.75
      }
    },
    {
      symbol: 'INFY',
      name: 'Infosys',
      currentPrice: 1520.75,
      shares: 2.63,
      allocation: '26.3%',
      trend: 'positive',
      riskCategory: 'low',
      analysis: {
        priceChange: '+1.8%',
        volatility: '11.5%',
        trendScore: 0.68
      }
    },
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries',
      currentPrice: 2450.50,
      shares: 1.63,
      allocation: '16.3%',
      trend: 'neutral',
      riskCategory: 'low',
      analysis: {
        priceChange: '+0.5%',
        volatility: '13.8%',
        trendScore: 0.42
      }
    }
  ],
  moderate: [
    {
      symbol: 'ICICIBANK',
      name: 'ICICI Bank',
      currentPrice: 890.50,
      shares: 5.61,
      allocation: '25.0%',
      trend: 'positive',
      riskCategory: 'moderate',
      analysis: {
        priceChange: '+1.8%',
        volatility: '18.7%',
        trendScore: 0.62
      }
    }
  ],
  high: [
    {
      symbol: 'TATAMOTORS',
      name: 'Tata Motors',
      currentPrice: 495.75,
      shares: 10.08,
      allocation: '20.0%',
      trend: 'negative',
      riskCategory: 'high',
      analysis: {
        priceChange: '-1.2%',
        volatility: '28.4%',
        trendScore: -0.35
      }
    },
    {
      symbol: 'YESBANK',
      name: 'Yes Bank',
      currentPrice: 18.45,
      shares: 270.46,
      allocation: '22.5%',
      trend: 'volatile',
      riskCategory: 'high',
      analysis: {
        priceChange: '±3.5%',
        volatility: '35.2%',
        trendScore: -0.52
      }
    }
  ]
};

router.post('/recommend', (req, res) => {
  try {
    const { amount, riskLevel } = req.body;
    
    if (!['low', 'moderate', 'high'].includes(riskLevel)) {
      return res.status(400).json({ error: 'Invalid risk level' });
    }
    
    if (!amount || isNaN(amount) || amount < 1000) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    
    // Simple allocation logic
    const recommendations = STOCK_DATA[riskLevel].map(stock => ({
      ...stock,
      shares: (amount * parseFloat(stock.allocation) / 100 / stock.currentPrice
    )}))
    
    res.json({ recommendations });
    
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

module.exports = router;