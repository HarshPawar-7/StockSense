import { motion } from "framer-motion";
import styled from "styled-components";

const StockRecommendationCard = ({ stock, delay }) => {
  return (
    <CardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <CardHeader>
        <h3>{stock.symbol}</h3>
        <RiskTag className={stock.riskCategory}>
          {stock.riskCategory}
        </RiskTag>
      </CardHeader>
      <CompanyName>{stock.name}</CompanyName>
      
      <StockDetails>
        <DetailRow>
          <span>Current Price</span>
          <span>₹{stock.currentPrice}</span>
        </DetailRow>
        <DetailRow>
          <span>Shares to Buy</span>
          <span>{stock.shares}</span>
        </DetailRow>
        <DetailRow>
          <span>Allocation</span>
          <span>{stock.allocation}</span>
        </DetailRow>
      </StockDetails>
      
      <TrendIndicator>
        <Trend className={stock.trend}>
          {stock.trend === "positive" ? "↑" : "↓"} {stock.analysis.priceChange}
        </Trend>
        <Volatility>
          Volatility: {stock.analysis.volatility}
        </Volatility>
      </TrendIndicator>
    </CardContainer>
  );
};

// Styled Components
const CardContainer = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  
  h3 {
    font-size: 18px;
    color: #1e293b;
    margin: 0;
  }
`;

const RiskTag = styled.span`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
  
  &.low {
    background: #dcfce7;
    color: #166534;
  }
  
  &.moderate {
    background: #fef9c3;
    color: #854d0e;
  }
  
  &.high {
    background: #fee2e2;
    color: #991b1b;
  }
`;

const CompanyName = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0 0 16px 0;
`;

const StockDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  
  span:first-child {
    color: #64748b;
    font-size: 14px;
  }
  
  span:last-child {
    color: #1e293b;
    font-weight: 500;
  }
`;

const TrendIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Trend = styled.div`
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  
  &.positive {
    color: #166534;
    background: #dcfce7;
  }
  
  &.negative {
    color: #991b1b;
    background: #fee2e2;
  }
`;

const Volatility = styled.div`
  font-size: 12px;
  color: #64748b;
`;

export default StockRecommendationCard;