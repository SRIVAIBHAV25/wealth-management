from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum as SQLEnum, Date, JSON, Text, DECIMAL, TIMESTAMP
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import enum


class RiskProfile(str, enum.Enum):
    conservative = "conservative"
    moderate = "moderate"
    aggressive = "aggressive"


class KYCStatus(str, enum.Enum):
    unverified = "unverified"
    verified = "verified"


class GoalType(str, enum.Enum):
    retirement = "retirement"
    home = "home"
    education = "education"
    custom = "custom"


class GoalStatus(str, enum.Enum):
    active = "active"
    paused = "paused"
    completed = "completed"


class AssetType(str, enum.Enum):
    stock = "stock"
    etf = "etf"
    mutual_fund = "mutual_fund"
    bond = "bond"
    cash = "cash"


class TransactionType(str, enum.Enum):
    buy = "buy"
    sell = "sell"
    dividend = "dividend"
    contribution = "contribution"
    withdrawal = "withdrawal"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    risk_profile = Column(SQLEnum(RiskProfile), default=RiskProfile.moderate)
    kyc_status = Column(SQLEnum(KYCStatus), default=KYCStatus.unverified)
    created_at = Column(DateTime, default=datetime.utcnow)

    # relationships
    goals = relationship("Goal", back_populates="user", cascade="all, delete")
    investments = relationship("Investment", back_populates="user", cascade="all, delete")
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete")
    recommendations = relationship("Recommendation", back_populates="user", cascade="all, delete")
    simulations = relationship("Simulation", back_populates="user", cascade="all, delete")


class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    goal_type = Column(SQLEnum(GoalType), default=GoalType.custom)
    target_amount = Column(Float, nullable=False)
    target_date = Column(Date, nullable=True)
    monthly_contribution = Column(Float, default=0)
    saved_amount = Column(Float, default=0)
    status = Column(SQLEnum(GoalStatus), default=GoalStatus.active)
    created_at = Column(DateTime, default=datetime.utcnow)

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    user = relationship("User", back_populates="goals")
    simulations = relationship("Simulation", back_populates="goal", cascade="all, delete")


class Investment(Base):
    __tablename__ = "investments"

    id = Column(Integer, primary_key=True, index=True)
    asset_type = Column(SQLEnum(AssetType), nullable=False)
    symbol = Column(String, nullable=False)
    units = Column(Float, nullable=False)
    avg_buy_price = Column(Float, nullable=False)
    cost_basis = Column(Float, nullable=False)
    current_value = Column(Float, default=0)
    last_price = Column(Float, default=0)
    last_price_at = Column(DateTime, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    user = relationship("User", back_populates="investments")

    transactions = relationship("Transaction", back_populates="investment")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, nullable=False)
    type = Column(SQLEnum(TransactionType), nullable=False)
    quantity = Column(Float, nullable=False)
    price = Column(Float, nullable=False)
    fees = Column(Float, default=0)
    executed_at = Column(DateTime, default=datetime.utcnow)

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    investment_id = Column(Integer, ForeignKey("investments.id"), nullable=True)

    user = relationship("User", back_populates="transactions")
    investment = relationship("Investment", back_populates="transactions")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    recommendation_text = Column(Text, nullable=False)
    suggested_allocation = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    user = relationship("User", back_populates="recommendations")


class Simulation(Base):
    __tablename__ = "simulations"

    id = Column(Integer, primary_key=True, index=True)
    scenario_name = Column(String, nullable=False)
    assumptions = Column(JSON, nullable=False)
    results = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    goal_id = Column(Integer, ForeignKey("goals.id", ondelete="SET NULL"), nullable=True)

    user = relationship("User", back_populates="simulations")
    goal = relationship("Goal", back_populates="simulations")
