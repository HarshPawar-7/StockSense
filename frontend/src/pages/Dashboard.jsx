import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import StockRecommendationCard from "../components/StockRecommendationCard";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [amount, setAmount] = useState("");
  const [riskLevel, setRiskLevel] = useState("moderate");
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [quote, setQuote] = useState({
    text: "The stock market is filled with individuals who know the price of everything, but the value of nothing.",
    author: "Philip Fisher"
  });
  const [riskDistribution, setRiskDistribution] = useState({
    low: 30,
    moderate: 50,
    high: 20
  });

  // Array of investment quotes
  const investmentQuotes = [
    {
      text: "The stock market is a device for transferring money from the impatient to the patient.",
      author: "Warren Buffett"
    },
    {
      text: "Invest for the long haul. Don't get too greedy and don't get too scared.",
      author: "Shelby M.C. Davis"
    },
    {
      text: "Risk comes from not knowing what you're doing.",
      author: "Warren Buffett"
    },
    {
      text: "The four most dangerous words in investing are: 'this time it's different.'",
      author: "Sir John Templeton"
    },
    {
      text: "In investing, what is comfortable is rarely profitable.",
      author: "Robert Arnott"
    }
  ];

  // Pie chart data configuration
  const pieChartData = {
    labels: ['Low Risk', 'Moderate Risk', 'High Risk'],
    datasets: [
      {
        data: [riskDistribution.low, riskDistribution.moderate, riskDistribution.high],
        backgroundColor: [
          '#10b981',  // green for low
          '#f59e0b',  // yellow for moderate
          '#ef4444'   // red for high
        ],
        borderColor: [
          '#fff',
          '#fff',
          '#fff'
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    },
    maintainAspectRatio: false,
    responsive: true
  };

  // Rotate quotes every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * investmentQuotes.length);
      setQuote(investmentQuotes[randomIndex]);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || isNaN(amount) || amount < 1000) {
      setError("Please enter a valid amount (minimum ₹1000)");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch("http://localhost:5000/api/stocks/recommend", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, riskLevel }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setRecommendations(data.recommendations || []);
        // Update risk distribution based on selected risk level
        const newDistribution = {
          low: riskLevel === 'low' ? 70 : riskLevel === 'moderate' ? 30 : 10,
          moderate: riskLevel === 'low' ? 20 : riskLevel === 'moderate' ? 50 : 30,
          high: riskLevel === 'low' ? 10 : riskLevel === 'moderate' ? 20 : 60
        };
        setRiskDistribution(newDistribution);
      } else {
        setError(data.error || "Failed to get recommendations");
      }
    } catch (error) {
      setError(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardContainer>
      <header>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="header-content"
        >
          <h1>StockSense</h1>
        </motion.div>
      </header>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="quote-banner"
      >
        <div className="quote-content">
          <motion.p 
            key={quote.text}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="quote-text"
          >
            "{quote.text}"
          </motion.p>
          <motion.p
            key={quote.author}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="quote-author"
          >
            — {quote.author}
          </motion.p>
        </div>
      </motion.div>
      
      <main>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="form-container"
        >
          <h2>Get Personalized Stock Recommendations</h2>
          <p className="subtitle">
            Enter your investment amount and risk preference to get started
          </p>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="error-message"
            >
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="amount">Investment Amount (₹)</label>
              <input
                type="number"
                id="amount"
                placeholder="5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1000"
                step="500"
                required
              />
            </div>
            
            <div className="input-group">
              <label>Risk Level</label>
              <div className="risk-options">
                {["low", "moderate", "high"].map((level) => (
                  <motion.div
                    key={level}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`risk-option ${riskLevel === level ? "active" : ""}`}
                    onClick={() => setRiskLevel(level)}
                  >
                    <div className="risk-indicator">
                      <div className={`dot ${level}`} />
                    </div>
                    <span>{level.charAt(0).toUpperCase() + level.slice(1)}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                "Get Recommendations"
              )}
            </motion.button>
          </form>

          <div className="risk-distribution">
            <h3>Risk Level Distribution</h3>
            <p className="subtitle">
              Typical portfolio allocation based on your risk preference
            </p>
            <div className="pie-chart-container">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>
        </motion.div>
        
        {recommendations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="results-container"
          >
            <h3>Your Personalized Portfolio</h3>
            <p className="subtitle">
              Based on ₹{amount} investment with {riskLevel} risk tolerance
            </p>
            
            <div className="portfolio-summary">
              <div className="summary-card">
                <span>Total Investment</span>
                <h4>₹{amount}</h4>
              </div>
              <div className="summary-card">
                <span>Risk Level</span>
                <h4>{riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}</h4>
              </div>
              <div className="summary-card">
                <span>Stocks Recommended</span>
                <h4>{recommendations.length}</h4>
              </div>
            </div>
            
            <div className="recommendations-grid">
              {recommendations.map((stock, index) => (
                <StockRecommendationCard 
                  key={index}
                  stock={stock}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  
  header {
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 16px 0;
    
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      h1 {
        font-size: 24px;
        font-weight: 700;
        color: #4f46e5;
        margin: 0;
      }
      
      .logout-btn {
        background: none;
        border: 1px solid #e2e8f0;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        color: #64748b;
        cursor: pointer;
        transition: all 0.2s;
        
        &:hover {
          background: #f1f5f9;
          color: #475569;
        }
      }
    }
  }

  .quote-banner {
    background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
    color: white;
    padding: 24px 0;
    margin-bottom: 32px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    
    .quote-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 20px;
      text-align: center;
      
      .quote-text {
        font-size: 1.2rem;
        font-weight: 500;
        line-height: 1.6;
        margin-bottom: 8px;
        font-style: italic;
      }
      
      .quote-author {
        font-size: 0.9rem;
        opacity: 0.9;
      }
    }
  }
  
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px 40px;
    
    .form-container, .results-container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.03);
      padding: 32px;
      margin-bottom: 32px;
      
      h2, h3 {
        font-size: 22px;
        color: #1e293b;
        margin-bottom: 8px;
      }
      
      .subtitle {
        color: #64748b;
        margin-bottom: 24px;
        font-size: 14px;
      }
      
      .error-message {
        background: #fee2e2;
        color: #dc2626;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 20px;
        font-size: 14px;
      }
      
      form {
        display: flex;
        flex-direction: column;
        gap: 24px;
        
        .input-group {
          label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            color: #475569;
            font-weight: 500;
          }
          
          input {
            width: 90%;
            padding: 12px 16px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 16px;
            transition: all 0.2s;
            background-color: #f8fafc;
            
            &:focus {
              outline: none;
              border-color: #4f46e5;
              box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
            }
          }
          
          .risk-options {
            display: flex;
            gap: 12px;
            
            .risk-option {
              flex: 1;
              padding: 16px;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
              cursor: pointer;
              transition: all 0.2s;
              
              &.active {
                border-color: #4f46e5;
                background-color: #f5f3ff;
              }
              
              .risk-indicator {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                
                .dot {
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  
                  &.low {
                    background-color: #10b981;
                  }
                  
                  &.moderate {
                    background-color: #f59e0b;
                  }
                  
                  &.high {
                    background-color: #ef4444;
                  }
                }
              }
              
              span {
                font-size: 14px;
                font-weight: 500;
                color: #1e293b;
              }
            }
          }
        }
        
        button {
          background: linear-gradient(90deg, #4f46e5, #06b6d4);
          color: white;
          border: none;
          padding: 16px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          
          .spinner {
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        }
      }
    }

    .risk-distribution {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;

      h3 {
        font-size: 18px;
        color: #1e293b;
        margin-bottom: 8px;
      }

      .subtitle {
        color: #64748b;
        margin-bottom: 16px;
        font-size: 14px;
      }

      .pie-chart-container {
        height: 300px;
        margin: 0 auto;
        max-width: 400px;
      }
    }
    
    .portfolio-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin: 24px 0;
      
      .summary-card {
        background: #f8fafc;
        border-radius: 8px;
        padding: 16px;
        text-align: center;
        
        span {
          font-size: 14px;
          color: #64748b;
          display: block;
          margin-bottom: 8px;
        }
        
        h4 {
          font-size: 20px;
          color: #1e293b;
          margin: 0;
        }
      }
    }
    
    .recommendations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      margin-top: 24px;
    }
  }
`;

export default Dashboard;