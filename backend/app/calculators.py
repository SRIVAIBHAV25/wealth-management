from typing import Dict
import math


class FinancialCalculators:
    """Financial calculators for SIP, retirement, and loan payoff"""

    @staticmethod
    def calculate_sip(
        monthly_investment: float,
        expected_return_rate: float,
        time_period_years: int
    ) -> Dict:
        """
        Calculate SIP (Systematic Investment Plan) returns
        
        Args:
            monthly_investment: Monthly investment amount
            expected_return_rate: Expected annual return rate (%)
            time_period_years: Investment period in years
        """
        monthly_rate = expected_return_rate / 12 / 100
        months = time_period_years * 12

        if monthly_rate == 0:
            future_value = monthly_investment * months
        else:
            # Future Value of Annuity formula
            future_value = monthly_investment * (
                ((1 + monthly_rate) ** months - 1) / monthly_rate
            ) * (1 + monthly_rate)

        total_invested = monthly_investment * months
        total_returns = future_value - total_invested

        return {
            "monthly_investment": monthly_investment,
            "time_period_years": time_period_years,
            "expected_return_rate": expected_return_rate,
            "total_invested": round(total_invested, 2),
            "future_value": round(future_value, 2),
            "total_returns": round(total_returns, 2),
            "wealth_gained": round((total_returns / total_invested) * 100, 2) if total_invested > 0 else 0
        }

    @staticmethod
    def calculate_retirement(
        current_age: int,
        retirement_age: int,
        current_savings: float,
        monthly_contribution: float,
        expected_return_rate: float,
        desired_monthly_income: float
    ) -> Dict:
        """
        Calculate retirement corpus and feasibility
        
        Args:
            current_age: Current age
            retirement_age: Target retirement age
            current_savings: Current retirement savings
            monthly_contribution: Monthly contribution
            expected_return_rate: Expected annual return (%)
            desired_monthly_income: Desired monthly income post-retirement
        """
        years_to_retirement = retirement_age - current_age
        
        if years_to_retirement <= 0:
            return {
                "error": "Retirement age must be greater than current age"
            }

        # Calculate corpus at retirement
        monthly_rate = expected_return_rate / 12 / 100
        months = years_to_retirement * 12

        # Future value of current savings
        fv_current = current_savings * ((1 + monthly_rate) ** months)

        # Future value of monthly contributions
        if monthly_rate == 0:
            fv_contributions = monthly_contribution * months
        else:
            fv_contributions = monthly_contribution * (
                ((1 + monthly_rate) ** months - 1) / monthly_rate
            ) * (1 + monthly_rate)

        total_corpus = fv_current + fv_contributions

        # Calculate required corpus for desired income
        # Assuming 4% withdrawal rate (safe withdrawal rate)
        withdrawal_rate = 4 / 100
        required_corpus = (desired_monthly_income * 12) / withdrawal_rate

        # Monthly income possible from accumulated corpus
        possible_monthly_income = (total_corpus * withdrawal_rate) / 12

        total_invested = current_savings + (monthly_contribution * months)

        return {
            "years_to_retirement": years_to_retirement,
            "total_corpus_at_retirement": round(total_corpus, 2),
            "required_corpus": round(required_corpus, 2),
            "corpus_sufficient": total_corpus >= required_corpus,
            "shortfall": round(max(0, required_corpus - total_corpus), 2),
            "possible_monthly_income": round(possible_monthly_income, 2),
            "desired_monthly_income": desired_monthly_income,
            "total_invested": round(total_invested, 2),
            "total_returns": round(total_corpus - total_invested, 2)
        }

    @staticmethod
    def calculate_loan_payoff(
        principal: float,
        annual_interest_rate: float,
        tenure_months: int,
        extra_payment: float = 0
    ) -> Dict:
        """
        Calculate loan EMI and payoff details
        
        Args:
            principal: Loan principal amount
            annual_interest_rate: Annual interest rate (%)
            tenure_months: Loan tenure in months
            extra_payment: Extra monthly payment towards principal
        """
        monthly_rate = annual_interest_rate / 12 / 100

        if monthly_rate == 0:
            emi = principal / tenure_months
        else:
            # EMI formula
            emi = principal * monthly_rate * (
                (1 + monthly_rate) ** tenure_months
            ) / (
                ((1 + monthly_rate) ** tenure_months) - 1
            )

        total_payment = emi * tenure_months
        total_interest = total_payment - principal

        # Calculate with extra payment
        if extra_payment > 0:
            balance = principal
            month = 0
            total_paid = 0
            total_interest_with_extra = 0

            while balance > 0 and month < tenure_months * 2:  # Safety limit
                month += 1
                interest = balance * monthly_rate
                principal_payment = emi - interest + extra_payment
                
                if principal_payment > balance:
                    principal_payment = balance
                
                balance -= principal_payment
                total_paid += interest + principal_payment
                total_interest_with_extra += interest

            months_saved = tenure_months - month
            interest_saved = total_interest - total_interest_with_extra

            return {
                "loan_amount": principal,
                "annual_interest_rate": annual_interest_rate,
                "tenure_months": tenure_months,
                "monthly_emi": round(emi, 2),
                "total_payment": round(total_payment, 2),
                "total_interest": round(total_interest, 2),
                "with_extra_payment": {
                    "extra_monthly_payment": extra_payment,
                    "new_tenure_months": month,
                    "months_saved": months_saved,
                    "total_payment": round(total_paid, 2),
                    "total_interest": round(total_interest_with_extra, 2),
                    "interest_saved": round(interest_saved, 2)
                }
            }
        else:
            return {
                "loan_amount": principal,
                "annual_interest_rate": annual_interest_rate,
                "tenure_months": tenure_months,
                "monthly_emi": round(emi, 2),
                "total_payment": round(total_payment, 2),
                "total_interest": round(total_interest, 2)
            }

    @staticmethod
    def calculate_compound_interest(
        principal: float,
        annual_rate: float,
        years: int,
        compounding_frequency: int = 12
    ) -> Dict:
        """
        Calculate compound interest
        
        Args:
            principal: Initial principal
            annual_rate: Annual interest rate (%)
            years: Time period in years
            compounding_frequency: Times compounded per year (12 for monthly, 4 for quarterly, 1 for yearly)
        """
        rate = annual_rate / 100
        amount = principal * (1 + rate / compounding_frequency) ** (compounding_frequency * years)
        interest = amount - principal

        return {
            "principal": principal,
            "annual_rate": annual_rate,
            "years": years,
            "compounding_frequency": compounding_frequency,
            "final_amount": round(amount, 2),
            "interest_earned": round(interest, 2)
        }
