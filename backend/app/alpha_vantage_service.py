import os
import requests
from typing import Dict, List, Optional
from datetime import datetime
import logging
import time

logger = logging.getLogger(__name__)

class AlphaVantageService:
    """Service for fetching market data from Alpha Vantage"""
    
    # Get your free API key from: https://www.alphavantage.co/support/#api-key
    API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY", "YOUR_API_KEY_HERE")
    BASE_URL = "https://www.alphavantage.co/query"
    
    @staticmethod
    def get_current_price(symbol: str) -> Optional[float]:
        """Get current price for a symbol"""
        try:
            params = {
                'function': 'GLOBAL_QUOTE',
                'symbol': symbol,
                'apikey': AlphaVantageService.API_KEY
            }
            
            response = requests.get(AlphaVantageService.BASE_URL, params=params, timeout=10)
            data = response.json()
            
            if 'Global Quote' in data and data['Global Quote']:
                price = float(data['Global Quote']['05. price'])
                return price
            
            logger.warning(f"No price data for {symbol}")
            return None
            
        except Exception as e:
            logger.error(f"Error fetching price for {symbol}: {e}")
            return None
    
    @staticmethod
    def get_multiple_prices(symbols: List[str]) -> Dict[str, float]:
        """Get prices for multiple symbols (with rate limiting)"""
        prices = {}
        
        for i, symbol in enumerate(symbols):
            price = AlphaVantageService.get_current_price(symbol)
            if price:
                prices[symbol] = price
            
            # Alpha Vantage free tier: 5 requests/minute
            # Add delay between requests
            if i < len(symbols) - 1:
                time.sleep(12)  # 12 seconds between requests
        
        return prices
    
    @staticmethod
    def get_market_data(symbol: str) -> Optional[Dict]:
        """Get detailed market data"""
        try:
            params = {
                'function': 'GLOBAL_QUOTE',
                'symbol': symbol,
                'apikey': AlphaVantageService.API_KEY
            }
            
            response = requests.get(AlphaVantageService.BASE_URL, params=params, timeout=10)
            data = response.json()
            
            if 'Global Quote' not in data or not data['Global Quote']:
                return None
            
            quote = data['Global Quote']
            
            return {
                "symbol": symbol,
                "current_price": float(quote['05. price']),
                "change": float(quote['09. change']),
                "change_percent": float(quote['10. change percent'].rstrip('%')),
                "last_updated": datetime.utcnow(),
                "volume": int(quote['06. volume']),
                "previous_close": float(quote['08. previous close']),
                "open": float(quote['02. open']),
                "high": float(quote['03. high']),
                "low": float(quote['04. low']),
            }
            
        except Exception as e:
            logger.error(f"Error fetching market data for {symbol}: {e}")
            return None
    
    @staticmethod
    def update_investment_prices(db, user_id: int = None):
        """Update prices for all investments"""
        from app.models import Investment
        
        query = db.query(Investment)
        if user_id:
            query = query.filter(Investment.user_id == user_id)
        
        investments = query.all()
        
        # Group by symbol to avoid duplicate API calls
        symbols = list(set([inv.symbol for inv in investments]))
        prices = AlphaVantageService.get_multiple_prices(symbols)
        
        updated_count = 0
        for investment in investments:
            if investment.symbol in prices:
                new_price = prices[investment.symbol]
                investment.last_price = new_price
                investment.current_value = investment.units * new_price
                investment.last_price_at = datetime.utcnow()
                updated_count += 1
        
        db.commit()
        return updated_count