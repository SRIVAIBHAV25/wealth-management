import yfinance as yf
from typing import Dict, List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class MarketDataService:
    """Service for fetching market data from Yahoo Finance"""

    @staticmethod
    def get_current_price(symbol: str) -> Optional[float]:
        """Get current price for a symbol"""
        try:
            ticker = yf.Ticker(symbol)
            data = ticker.history(period="1d")
            if not data.empty:
                return float(data['Close'].iloc[-1])
            return None
        except Exception as e:
            logger.error(f"Error fetching price for {symbol}: {e}")
            return None

    @staticmethod
    def get_multiple_prices(symbols: List[str]) -> Dict[str, float]:
        """Get prices for multiple symbols"""
        prices = {}
        for symbol in symbols:
            price = MarketDataService.get_current_price(symbol)
            if price:
                prices[symbol] = price
        return prices

    @staticmethod
    def get_market_data(symbol: str) -> Optional[Dict]:
        """Get detailed market data including price, change, etc."""
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            history = ticker.history(period="5d")
            
            if history.empty:
                return None

            current_price = float(history['Close'].iloc[-1])
            previous_close = float(history['Close'].iloc[-2]) if len(history) > 1 else current_price
            
            change = current_price - previous_close
            change_percent = (change / previous_close) * 100 if previous_close != 0 else 0

            return {
                "symbol": symbol,
                "current_price": current_price,
                "change": change,
                "change_percent": change_percent,
                "last_updated": datetime.utcnow(),
                "volume": int(history['Volume'].iloc[-1]) if 'Volume' in history else 0,
                "market_cap": info.get('marketCap', 0),
                "pe_ratio": info.get('trailingPE', 0)
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
        prices = MarketDataService.get_multiple_prices(symbols)
        
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
