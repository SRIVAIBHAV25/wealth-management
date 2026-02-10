from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, List
from datetime import datetime, date
from enum import Enum


# Enums
class RiskProfileEnum(str, Enum):
    conservative = "conservative"
    moderate = "moderate"
    aggressive = "aggressive"


class KYCStatusEnum(str, Enum):
    unverified = "unverified"
    verified = "verified"


class GoalTypeEnum(str, Enum):
    retirement = "retirement"
    home = "home"
    education = "education"
    custom = "custom"


class GoalStatusEnum(str, Enum):
    active = "active"
    paused = "paused"
    completed = "completed"


class AssetTypeEnum(str, Enum):
    stock = "stock"
    etf = "etf"
    mutual_fund = "mutual_fund"
    bond = "bond"
    cash = "cash"


class TransactionTypeEnum(str, Enum):
    buy = "buy"
    sell = "sell"
    dividend = "dividend"
    contribution = "contribution"
    withdrawal = "withdrawal"


# User Schemas
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    risk_profile: Optional[RiskProfileEnum] = None
    kyc_status: Optional[KYCStatusEnum] = None
    created_at: datetime

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    risk_profile: Optional[RiskProfileEnum] = None
    kyc_status: Optional[KYCStatusEnum] = None


# Goal Schemas
class GoalCreate(BaseModel):
    title: str
    goal_type: Optional[GoalTypeEnum] = GoalTypeEnum.custom
    target_amount: float
    target_date: Optional[date] = None
    monthly_contribution: Optional[float] = 0
    saved_amount: Optional[float] = 0


class GoalUpdate(BaseModel):
    saved_amount: Optional[float] = None
    status: Optional[GoalStatusEnum] = None
    monthly_contribution: Optional[float] = None


class GoalOut(BaseModel):
    id: int
    title: str
    goal_type: GoalTypeEnum
    target_amount: float
    target_date: Optional[date] = None
    monthly_contribution: float
    saved_amount: float
    status: GoalStatusEnum
    created_at: datetime

    class Config:
        from_attributes = True


# Investment Schemas
class InvestmentCreate(BaseModel):
    asset_type: AssetTypeEnum
    symbol: str
    units: float
    avg_buy_price: float


class InvestmentOut(BaseModel):
    id: int
    asset_type: AssetTypeEnum
    symbol: str
    units: float
    avg_buy_price: float
    cost_basis: float
    current_value: float
    last_price: float
    last_price_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Transaction Schemas
class TransactionCreate(BaseModel):
    symbol: str
    type: TransactionTypeEnum
    quantity: float
    price: float
    fees: Optional[float] = 0


class TransactionOut(BaseModel):
    id: int
    user_id: int
    symbol: str
    type: str
    quantity: float
    price: float
    fees: float
    executed_at: datetime

    class Config:
        from_attributes = True


# Simulation Schemas
class SimulationCreate(BaseModel):
    scenario_name: str
    goal_id: Optional[int] = None
    assumptions: Dict[str, Any]


class SimulationOut(BaseModel):
    id: int
    scenario_name: str
    goal_id: Optional[int] = None
    assumptions: Dict[str, Any]
    results: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True


# Recommendation Schemas
class RecommendationOut(BaseModel):
    id: int
    title: str
    recommendation_text: str
    suggested_allocation: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Calculator Schemas
class SIPCalculatorInput(BaseModel):
    monthly_investment: float
    expected_return_rate: float
    time_period_years: int


class RetirementCalculatorInput(BaseModel):
    current_age: int
    retirement_age: int
    current_savings: float
    monthly_contribution: float
    expected_return_rate: float
    desired_monthly_income: float


class LoanPayoffCalculatorInput(BaseModel):
    principal: float
    annual_interest_rate: float
    tenure_months: int
    extra_payment: Optional[float] = 0


# Market Data Schemas
class MarketDataOut(BaseModel):
    symbol: str
    current_price: float
    change: float
    change_percent: float
    last_updated: datetime
