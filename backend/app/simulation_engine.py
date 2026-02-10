from typing import Dict, List
import numpy as np
from datetime import datetime, timedelta


class SimulationEngine:
    """Engine for running financial simulations and what-if scenarios"""

    @staticmethod
    def simulate_goal_achievement(
        current_amount: float,
        target_amount: float,
        monthly_contribution: float,
        expected_return_rate: float,
        years: int
    ) -> Dict:
        """
        Simulate goal achievement with given parameters
        
        Args:
            current_amount: Starting amount
            expected_return_rate: Annual return rate (e.g., 12 for 12%)
            years: Time period in years
        """
        monthly_rate = expected_return_rate / 12 / 100
        months = years * 12
        
        # Calculate future value
        if monthly_rate == 0:
            future_value = current_amount + (monthly_contribution * months)
        else:
            # FV of current amount
            fv_current = current_amount * ((1 + monthly_rate) ** months)
            
            # FV of monthly contributions (annuity)
            fv_contributions = monthly_contribution * (((1 + monthly_rate) ** months - 1) / monthly_rate)
            
            future_value = fv_current + fv_contributions

        # Generate month-by-month projection
        projections = []
        balance = current_amount
        
        for month in range(1, months + 1):
            balance = balance * (1 + monthly_rate) + monthly_contribution
            projections.append({
                "month": month,
                "balance": round(balance, 2)
            })

        goal_achievable = future_value >= target_amount
        shortfall = max(0, target_amount - future_value)

        return {
            "future_value": round(future_value, 2),
            "target_amount": target_amount,
            "goal_achievable": goal_achievable,
            "shortfall": round(shortfall, 2),
            "total_invested": round(current_amount + (monthly_contribution * months), 2),
            "total_returns": round(future_value - current_amount - (monthly_contribution * months), 2),
            "projections": projections[-12:],  # Last 12 months only
            "parameters": {
                "current_amount": current_amount,
                "monthly_contribution": monthly_contribution,
                "expected_return_rate": expected_return_rate,
                "years": years
            }
        }

    @staticmethod
    def monte_carlo_simulation(
        current_amount: float,
        monthly_contribution: float,
        expected_return: float,
        volatility: float,
        years: int,
        simulations: int = 1000
    ) -> Dict:
        """
        Run Monte Carlo simulation for portfolio projections
        
        Args:
            expected_return: Expected annual return (%)
            volatility: Annual volatility/standard deviation (%)
            simulations: Number of simulation runs
        """
        months = years * 12
        monthly_return = expected_return / 12 / 100
        monthly_volatility = volatility / np.sqrt(12) / 100

        results = []
        
        for _ in range(simulations):
            balance = current_amount
            for month in range(months):
                # Generate random return based on normal distribution
                random_return = np.random.normal(monthly_return, monthly_volatility)
                balance = balance * (1 + random_return) + monthly_contribution
            results.append(balance)

        results = np.array(results)
        
        return {
            "mean": round(float(np.mean(results)), 2),
            "median": round(float(np.median(results)), 2),
            "percentile_10": round(float(np.percentile(results, 10)), 2),
            "percentile_25": round(float(np.percentile(results, 25)), 2),
            "percentile_75": round(float(np.percentile(results, 75)), 2),
            "percentile_90": round(float(np.percentile(results, 90)), 2),
            "min": round(float(np.min(results)), 2),
            "max": round(float(np.max(results)), 2),
            "std_dev": round(float(np.std(results)), 2)
        }

    @staticmethod
    def what_if_return_change(
        current_amount: float,
        monthly_contribution: float,
        years: int,
        return_rates: List[float]
    ) -> Dict:
        """Compare outcomes with different return rates"""
        scenarios = {}
        
        for rate in return_rates:
            monthly_rate = rate / 12 / 100
            months = years * 12
            
            if monthly_rate == 0:
                future_value = current_amount + (monthly_contribution * months)
            else:
                fv_current = current_amount * ((1 + monthly_rate) ** months)
                fv_contributions = monthly_contribution * (((1 + monthly_rate) ** months - 1) / monthly_rate)
                future_value = fv_current + fv_contributions

            scenarios[f"{rate}%"] = {
                "return_rate": rate,
                "future_value": round(future_value, 2),
                "total_invested": round(current_amount + (monthly_contribution * months), 2),
                "total_returns": round(future_value - current_amount - (monthly_contribution * months), 2)
            }

        return scenarios

    @staticmethod
    def what_if_contribution_change(
        current_amount: float,
        target_amount: float,
        expected_return: float,
        years: int,
        contribution_amounts: List[float]
    ) -> Dict:
        """Compare outcomes with different contribution amounts"""
        scenarios = {}
        
        for contribution in contribution_amounts:
            monthly_rate = expected_return / 12 / 100
            months = years * 12
            
            if monthly_rate == 0:
                future_value = current_amount + (contribution * months)
            else:
                fv_current = current_amount * ((1 + monthly_rate) ** months)
                fv_contributions = contribution * (((1 + monthly_rate) ** months - 1) / monthly_rate)
                future_value = fv_current + fv_contributions

            goal_achievable = future_value >= target_amount

            scenarios[f"₹{contribution:,.0f}"] = {
                "monthly_contribution": contribution,
                "future_value": round(future_value, 2),
                "goal_achievable": goal_achievable,
                "shortfall": round(max(0, target_amount - future_value), 2)
            }

        return scenarios

    @staticmethod
    def calculate_required_contribution(
        current_amount: float,
        target_amount: float,
        expected_return: float,
        years: int
    ) -> float:
        """Calculate required monthly contribution to achieve goal"""
        monthly_rate = expected_return / 12 / 100
        months = years * 12
        
        if months == 0:
            return target_amount - current_amount
        
        # FV of current amount
        fv_current = current_amount * ((1 + monthly_rate) ** months)
        
        # Remaining amount needed from contributions
        remaining = target_amount - fv_current
        
        if remaining <= 0:
            return 0
        
        if monthly_rate == 0:
            return remaining / months
        
        # Calculate monthly contribution using FV of annuity formula
        monthly_contribution = remaining / (((1 + monthly_rate) ** months - 1) / monthly_rate)
        
        return round(max(0, monthly_contribution), 2)
    
    @staticmethod
    def calculate_goal_completion_time(
        current_amount: float,
        target_amount: float,
        monthly_contribution: float,
        expected_return: float
    ) -> Dict:
        """
        Calculate how long it takes to achieve a goal
        Returns time in months and years
        """
        if monthly_contribution <= 0:
            return {
                "possible": False,
                "message": "Monthly contribution must be greater than 0"
            }
        
        monthly_rate = expected_return / 12 / 100
        
        # If already at or past target
        if current_amount >= target_amount:
            return {
                "possible": True,
                "months": 0,
                "years": 0,
                "message": "Goal already achieved!",
                "final_amount": current_amount,
                "total_invested": current_amount,
                "total_returns": 0
            }
        
        # Calculate months needed using iterative approach
        months = 0
        balance = current_amount
        max_months = 600  # 50 years max
        
        if monthly_rate == 0:
            # No returns, simple calculation
            remaining = target_amount - current_amount
            months = remaining / monthly_contribution
            balance = target_amount
        else:
            # With compound returns - iterative approach
            while balance < target_amount and months < max_months:
                balance = balance * (1 + monthly_rate) + monthly_contribution
                months += 1
            
            if months >= max_months:
                return {
                    "possible": False,
                    "message": f"Goal requires more than 50 years with current parameters. Consider increasing monthly contribution or expected returns."
                }
        
        years = months / 12
        
        return {
            "possible": True,
            "months": round(months, 1),
            "years": round(years, 1),
            "final_amount": round(balance, 2),
            "total_invested": round(current_amount + (monthly_contribution * months), 2),
            "total_returns": round(balance - current_amount - (monthly_contribution * months), 2),
            "message": f"You can achieve this goal in {round(years, 1)} years with consistent contributions"
        }

    @staticmethod
    def calculate_minimum_monthly_contribution(
        current_amount: float,
        target_amount: float,
        expected_return: float,
        target_months: int
    ) -> Dict:
        """
        Calculate minimum monthly contribution needed to achieve goal in target timeframe
        """
        if target_months <= 0:
            return {
                "valid": False,
                "message": "Target timeframe must be greater than 0"
            }
        
        monthly_rate = expected_return / 12 / 100
        
        # If already at target
        if current_amount >= target_amount:
            return {
                "valid": True,
                "monthly_contribution": 0,
                "total_to_invest": 0,
                "expected_returns": 0,
                "message": "Goal already achieved! No additional contributions needed."
            }
        
        # Calculate future value of current amount
        fv_current = current_amount * ((1 + monthly_rate) ** target_months)
        
        # Remaining amount needed from contributions
        remaining = target_amount - fv_current
        
        if remaining <= 0:
            return {
                "valid": True,
                "monthly_contribution": 0,
                "total_to_invest": 0,
                "expected_returns": round(fv_current - current_amount, 2),
                "message": "Your current amount will grow to the target without additional contributions!"
            }
        
        if monthly_rate == 0:
            # No returns case
            monthly_contribution = remaining / target_months
        else:
            # With compound returns
            # PMT = Remaining / [((1+r)^n - 1) / r]
            monthly_contribution = remaining / (((1 + monthly_rate) ** target_months - 1) / monthly_rate)
        
        total_to_invest = monthly_contribution * target_months
        expected_returns = target_amount - current_amount - total_to_invest
        
        return {
            "valid": True,
            "monthly_contribution": round(monthly_contribution, 2),
            "total_to_invest": round(total_to_invest, 2),
            "expected_returns": round(expected_returns, 2),
            "target_years": round(target_months / 12, 1),
            "message": f"Invest ₹{round(monthly_contribution, 2):,.0f} per month to reach your goal"
        }
