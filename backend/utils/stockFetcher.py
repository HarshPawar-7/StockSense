import requests
import json
from bs4 import BeautifulSoup
import yfinance as yf

def get_nse_data():
    # This is a placeholder - in reality you would:
    # 1. Use NSE API or web scraping (with proper permissions)
    # 2. Or use Yahoo Finance with .NS suffix for Indian stocks
    # 3. Or use Alpha Vantage with Indian stocks
    
    # Example using yfinance for demo purposes
    symbols = [
        "HDFCBANK.NS", "INFY.NS", "TCS.NS", "RELIANCE.NS", "ITC.NS",
        "ICICIBANK.NS", "LT.NS", "SUNPHARMA.NS", "BAJFINANCE.NS",
        "PAYTM.NS", "ZOMATO.NS", "NYKAA.NS", "ADANIENT.NS"
    ]
    
    data = []
    for symbol in symbols:
        try:
            stock = yf.Ticker(symbol)
            hist = stock.history(period="1d")
            if not hist.empty:
                last_price = hist['Close'].iloc[-1]
                prev_close = hist['Open'].iloc[-1] if len(hist) > 1 else last_price
                p_change = ((last_price - prev_close) / prev_close) * 100
                
                data.append({
                    "symbol": symbol,
                    "companyName": stock.info.get('longName', symbol),
                    "lastPrice": round(last_price, 2),
                    "dayHigh": round(hist['High'].iloc[-1], 2),
                    "dayLow": round(hist['Low'].iloc[-1], 2),
                    "pChange": round(p_change, 2),
                    "previousClose": round(prev_close, 2),
                    "totalTradedVolume": int(hist['Volume'].iloc[-1]),
                    "marketCap": stock.info.get('marketCap', 0)
                })
        except Exception as e:
            print(f"Error fetching data for {symbol}: {str(e)}")
            continue
    
    return {"data": data, "error": None}

if __name__ == "__main__":
    try:
        result = get_nse_data()
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e), "data": None}))