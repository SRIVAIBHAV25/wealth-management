from typing import Dict, List
from app.models import User, Investment, Goal, RiskProfile
from sqlalchemy.orm import Session


class RecommendationEngine:
    """Generate personalized investment recommendations based on risk profile"""

    # Asset allocation strategies based on risk profile
    ALLOCATIONS = {
        RiskProfile.conservative: {
            "stocks": 30,
            "bonds": 50,
            "cash": 20
        },
        RiskProfile.moderate: {
            "stocks": 60,
            "bonds": 30,
            "cash": 10
        },
        RiskProfile.aggressive: {
            "stocks": 80,
            "bonds": 15,
            "cash": 5
        }
    }

    @staticmethod
    def get_recommended_allocation(user: User) -> Dict[str, int]:
        """Get recommended asset allocation for user"""
        return RecommendationEngine.ALLOCATIONS.get(
            user.risk_profile,
            RecommendationEngine.ALLOCATIONS[RiskProfile.moderate]
        )

    @staticmethod
    def calculate_current_allocation(db: Session, user_id: int) -> Dict[str, float]:
        """Calculate current portfolio allocation"""
        investments = db.query(Investment).filter(
            Investment.user_id == user_id
        ).all()

        if not investments:
            return {"stocks": 0, "bonds": 0, "cash": 0}

        total_value = sum(inv.current_value for inv in investments)
        if total_value == 0:
            return {"stocks": 0, "bonds": 0, "cash": 0}

        allocation = {"stocks": 0, "bonds": 0, "cash": 0}

        for inv in investments:
            weight = (inv.current_value / total_value) * 100
            if inv.asset_type in ["stock", "etf", "mutual_fund"]:
                allocation["stocks"] += weight
            elif inv.asset_type == "bond":
                allocation["bonds"] += weight
            elif inv.asset_type == "cash":
                allocation["cash"] += weight

        return allocation

    @staticmethod
    def get_rebalance_suggestions(db: Session, user: User) -> Dict:
        """Generate rebalancing suggestions"""
        recommended = RecommendationEngine.get_recommended_allocation(user)
        current = RecommendationEngine.calculate_current_allocation(db, user.id)

        suggestions = {}
        needs_rebalance = False

        for asset_class, target_pct in recommended.items():
            current_pct = current.get(asset_class, 0)
            diff = target_pct - current_pct

            if abs(diff) > 5:  # More than 5% deviation
                needs_rebalance = True
                action = "increase" if diff > 0 else "decrease"
                suggestions[asset_class] = {
                    "current": round(current_pct, 2),
                    "target": target_pct,
                    "difference": round(diff, 2),
                    "action": action
                }

        return {
            "needs_rebalance": needs_rebalance,
            "suggestions": suggestions,
            "recommended_allocation": recommended,
            "current_allocation": {k: round(v, 2) for k, v in current.items()}
        }

    @staticmethod
    def generate_goal_recommendations(db: Session, user: User, goal: Goal) -> str:
        """Generate recommendations for achieving a specific goal"""
        months_remaining = 0
        if goal.target_date:
            from datetime import datetime
            today = datetime.now().date()
            months_remaining = max(0, (goal.target_date.year - today.year) * 12 + (goal.target_date.month - today.month))

        amount_needed = goal.target_amount - goal.saved_amount
        
        if months_remaining > 0:
            monthly_needed = amount_needed / months_remaining
        else:
            monthly_needed = amount_needed

        # Simple recommendation text
        rec_text = f"To achieve your {goal.title} goal:\n\n"
        
        if amount_needed <= 0:
            rec_text += "✅ Congratulations! You've already reached this goal!\n"
        elif months_remaining > 0:
            rec_text += f"💰 Amount needed: ₹{amount_needed:,.2f}\n"
            rec_text += f"📅 Months remaining: {months_remaining}\n"
            rec_text += f"💵 Required monthly investment: ₹{monthly_needed:,.2f}\n\n"
            
            # Add risk-based recommendation
            if user.risk_profile == RiskProfile.aggressive:
                rec_text += "Based on your aggressive risk profile, consider equity-focused investments with higher growth potential."
            elif user.risk_profile == RiskProfile.moderate:
                rec_text += "Based on your moderate risk profile, consider a balanced mix of equity and debt investments."
            else:
                rec_text += "Based on your conservative risk profile, consider debt-focused investments for capital protection."
        else:
            rec_text += f"⚠️ Target date has passed. Amount still needed: ₹{amount_needed:,.2f}\n"
            rec_text += "Consider extending the target date or increasing your contributions."

        return rec_text
