import os
import unicorn
from fastapi import FastAPI, Depends, HTTPException, status, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from fastapi import Header
from jose import jwt, JWTError
from typing import List, Dict, Any
from io import BytesIO
from datetime import datetime

from app.database import Base, engine, SessionLocal
from app.models import (
    User, Goal, Investment, Transaction, Recommendation, Simulation,
    RiskProfile, GoalType, AssetType, TransactionType
)
from app.schemas import (
    UserCreate, UserLogin, UserOut, UserProfileUpdate,
    GoalCreate, GoalUpdate, GoalOut,
    InvestmentCreate, InvestmentOut,
    TransactionCreate, TransactionOut,
    SimulationCreate, SimulationOut,
    RecommendationOut,
    SIPCalculatorInput, RetirementCalculatorInput, LoanPayoffCalculatorInput,
    MarketDataOut
)
from app.security import hash_password, verify_password, create_access_token
from app.alpha_vantage_service import AlphaVantageService
from app.recommendation_engine import RecommendationEngine
from app.simulation_engine import SimulationEngine
from app.calculators import FinancialCalculators
from app.report_generator import ReportGenerator
from app.startup import init_db

# =========================
# CONFIG
# =========================
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key-change-in-production")
ALGORITHM = "HS256"

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app):
    """Startup: create DB tables. Shutdown: nothing needed."""
    init_db()
    yield

app = FastAPI(title="Wealth Management API", version="2.0", lifespan=lifespan)

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("FRONTEND_URL", "http://localhost:5173"),
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

# =========================
# HEALTH CHECK
# =========================
@app.get("/health")
def health_check():
    """Health check endpoint for Cloud Run."""
    return {"status": "ok"}




# =========================
# DATABASE
# =========================
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =========================
# AUTH
# =========================


def get_current_user(
    authorization: str = Header(None),
    db: Session = Depends(get_db),
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    token = authorization.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user
# =========================
# ROUTES
# =========================

@app.get("/")
def root():
    return {"status": "Wealth Management API v2.0 running"}

# ---------- AUTH ROUTES ----------
@app.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    access_token = create_access_token({"sub": db_user.id})
    return {"access_token": access_token, "token_type": "bearer"}

# ---------- USER PROFILE ROUTES ----------
@app.get("/profile", response_model=UserOut)
def get_profile(user: User = Depends(get_current_user)):
    return user

@app.put("/profile", response_model=UserOut)
def update_profile(
    profile_data: UserProfileUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if profile_data.name:
        user.name = profile_data.name
    if profile_data.risk_profile:
        user.risk_profile = profile_data.risk_profile
    if profile_data.kyc_status:
        user.kyc_status = profile_data.kyc_status
    
    db.commit()
    db.refresh(user)
    return user

# ---------- GOALS ROUTES ----------
@app.post("/goals", response_model=GoalOut)
def create_goal(
    goal: GoalCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    new_goal = Goal(
        title=goal.title,
        goal_type=goal.goal_type,
        target_amount=goal.target_amount,
        target_date=goal.target_date,
        monthly_contribution=goal.monthly_contribution,
        saved_amount=goal.saved_amount,
        user_id=user.id,
    )

    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal

@app.get("/goals", response_model=List[GoalOut])
def get_goals(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return db.query(Goal).filter(Goal.user_id == user.id).all()

@app.put("/goals/{goal_id}", response_model=GoalOut)
def update_goal(
    goal_id: int,
    payload: GoalUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == user.id,
    ).first()

    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    if payload.saved_amount is not None:
        goal.saved_amount = payload.saved_amount
    if payload.status is not None:
        goal.status = payload.status
    if payload.monthly_contribution is not None:
        goal.monthly_contribution = payload.monthly_contribution

    db.commit()
    db.refresh(goal)
    return goal

@app.delete("/goals/{goal_id}", status_code=204)
def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == user.id,
    ).first()

    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    db.delete(goal)
    db.commit()

# ---------- INVESTMENTS & PORTFOLIO ROUTES ----------
@app.post("/investments", response_model=InvestmentOut)
def create_investment(
    investment: InvestmentCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    from datetime import datetime
    
    cost_basis = investment.units * investment.avg_buy_price

    # Create investment
    inv = Investment(
        user_id=user.id,
        asset_type=investment.asset_type,
        symbol=investment.symbol,
        units=investment.units,
        avg_buy_price=investment.avg_buy_price,
        cost_basis=cost_basis,
        current_value=cost_basis,
    )

    db.add(inv)
    db.flush()  # Get the investment ID before committing
    
    # AUTO-CREATE TRANSACTION
    try:
        transaction = Transaction(
            user_id=user.id,
            symbol=investment.symbol,
            type=TransactionType.buy,
            quantity=investment.units,
            price=investment.avg_buy_price,
            fees=0.0,
            executed_at=datetime.utcnow()
        )
        db.add(transaction)
        db.commit()
        db.refresh(inv)
        print(f"✅ Created transaction for {investment.symbol}")  # Debug log
    except Exception as e:
        print(f"❌ Error creating transaction: {e}")  # Debug log
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create transaction: {str(e)}")
    
    return inv

@app.get("/portfolio", response_model=List[InvestmentOut])
def get_portfolio(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return db.query(Investment).filter(
        Investment.user_id == user.id
    ).all()

@app.delete("/investments/{investment_id}", status_code=204)
def delete_investment(
    investment_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    investment = db.query(Investment).filter(
        Investment.id == investment_id,
        Investment.user_id == user.id
    ).first()
    
    if not investment:
        raise HTTPException(status_code=404, detail="Investment not found")
    
    db.delete(investment)
    db.commit()

# ---------- TRANSACTIONS ROUTES ----------
@app.post("/transactions", response_model=TransactionOut)
def create_transaction(
    tx: TransactionCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    transaction = Transaction(
        user_id=user.id,
        symbol=tx.symbol,
        type=tx.type,
        quantity=tx.quantity,
        price=tx.price,
        fees=tx.fees,
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction

# ---------- TRANSACTIONS ROUTES ----------
@app.post("/transactions", response_model=TransactionOut)
def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    from datetime import datetime
    
    new_tx = Transaction(
        user_id=user.id,
        symbol=transaction.symbol,
        type=transaction.type,
        quantity=transaction.quantity,
        price=transaction.price,
        fees=transaction.fees if transaction.fees else 0.0,
        executed_at=transaction.executed_at if transaction.executed_at else datetime.utcnow(),
    )

    db.add(new_tx)
    db.commit()
    db.refresh(new_tx)
    return new_tx

@app.get("/transactions", response_model=List[TransactionOut])
def get_transactions(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    transactions = db.query(Transaction).filter(
        Transaction.user_id == user.id
    ).order_by(Transaction.executed_at.desc()).all()
    
    print(f"📊 Found {len(transactions)} transactions for user {user.id}")  # Debug log
    return transactions

@app.delete("/transactions/{transaction_id}", status_code=204)
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == user.id
    ).first()

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(transaction)
    db.commit()
    return Response(status_code=204)

# ---------- MARKET DATA ROUTES ----------
@app.get("/market/{symbol}")
def get_market_data(symbol: str):
    data = AlphaVantageService.get_market_data(symbol)
    if not data:
        raise HTTPException(status_code=404, detail="Market data not available")
    return data

@app.post("/portfolio/refresh-prices")
def refresh_portfolio_prices(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    updated_count = AlphaVantageService.update_investment_prices(db, user.id)
    return {"status": "success", "updated": updated_count}

# ---------- RECOMMENDATIONS ROUTES ----------
@app.get("/recommendations", response_model=List[RecommendationOut])
def get_recommendations(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return db.query(Recommendation).filter(
        Recommendation.user_id == user.id
    ).order_by(Recommendation.created_at.desc()).all()

@app.post("/recommendations/generate")
def generate_recommendations(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    rebalance_data = RecommendationEngine.get_rebalance_suggestions(db, user)
    
    rec = Recommendation(
        user_id=user.id,
        title="Portfolio Rebalancing Recommendation",
        recommendation_text="Based on your risk profile, here are your personalized recommendations.",
        suggested_allocation=rebalance_data
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    
    return rec

@app.get("/recommendations/allocation")
def get_allocation_recommendation(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return RecommendationEngine.get_rebalance_suggestions(db, user)

@app.get("/recommendations/goal/{goal_id}")
def get_goal_recommendation(
    goal_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == user.id
    ).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    recommendation_text = RecommendationEngine.generate_goal_recommendations(db, user, goal)
    return {"goal_id": goal_id, "recommendation": recommendation_text}

@app.delete("/recommendations/clear")
def clear_recommendations(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Clear all recommendations for the current user"""
    deleted_count = db.query(Recommendation).filter(
        Recommendation.user_id == user.id
    ).delete()
    db.commit()
    return {"message": f"Cleared {deleted_count} recommendations"}

# ---------- SIMULATIONS ROUTES ----------
@app.post("/simulations", response_model=SimulationOut)
def create_simulation(
    sim: SimulationCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # Extract assumptions
    assumptions = sim.assumptions
    current_amount = assumptions.get('current_amount', 0)
    target_amount = assumptions.get('target_amount', 0)
    monthly_contribution = assumptions.get('monthly_contribution', 0)
    expected_return = assumptions.get('expected_return', 12)
    years = assumptions.get('years', 10)
    
    # Run simulation
    results = SimulationEngine.simulate_goal_achievement(
        current_amount=current_amount,
        target_amount=target_amount,
        monthly_contribution=monthly_contribution,
        expected_return_rate=expected_return,
        years=years
    )
    
    simulation = Simulation(
        user_id=user.id,
        goal_id=sim.goal_id,
        scenario_name=sim.scenario_name,
        assumptions=assumptions,
        results=results
    )
    
    db.add(simulation)
    db.commit()
    db.refresh(simulation)
    return simulation

@app.get("/simulations", response_model=List[SimulationOut])
def get_simulations(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return db.query(Simulation).filter(
        Simulation.user_id == user.id
    ).order_by(Simulation.created_at.desc()).all()

@app.post("/simulations/what-if/returns")
def what_if_returns(
    data: Dict[str, Any],
    user: User = Depends(get_current_user)
):
    scenarios = SimulationEngine.what_if_return_change(
        current_amount=data.get('current_amount', 0),
        monthly_contribution=data.get('monthly_contribution', 0),
        years=data.get('years', 10),
        return_rates=data.get('return_rates', [8, 10, 12, 15])
    )
    return scenarios

@app.post("/simulations/what-if/contributions")
def what_if_contributions(
    data: Dict[str, Any],
    user: User = Depends(get_current_user)
):
    scenarios = SimulationEngine.what_if_contribution_change(
        current_amount=data.get('current_amount', 0),
        target_amount=data.get('target_amount', 0),
        expected_return=data.get('expected_return', 12),
        years=data.get('years', 10),
        contribution_amounts=data.get('contribution_amounts', [5000, 10000, 15000, 20000])
    )
    return scenarios

@app.post("/simulations/monte-carlo")
def monte_carlo(
    data: Dict[str, Any],
    user: User = Depends(get_current_user)
):
    results = SimulationEngine.monte_carlo_simulation(
        current_amount=data.get('current_amount', 0),
        monthly_contribution=data.get('monthly_contribution', 0),
        expected_return=data.get('expected_return', 12),
        volatility=data.get('volatility', 15),
        years=data.get('years', 10),
        simulations=data.get('simulations', 1000)
    )
    return results
# ---------- GOAL-SPECIFIC SIMULATION ROUTES (NEW) ----------
@app.post("/goals/{goal_id}/simulate-completion")
def simulate_goal_completion(
    goal_id: int,
    data: Dict[str, Any],
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Calculate when a goal will be completed with given parameters
    """
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == user.id
    ).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    result = SimulationEngine.calculate_goal_completion_time(
        current_amount=data.get('current_amount', goal.saved_amount),
        target_amount=goal.target_amount,
        monthly_contribution=data.get('monthly_contribution', goal.monthly_contribution),
        expected_return=data.get('expected_return', 12.0)
    )
    
    return result

@app.post("/goals/{goal_id}/minimum-contribution")
def calculate_minimum_contribution(
    goal_id: int,
    data: Dict[str, Any],
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Calculate minimum monthly contribution needed to achieve goal by target date
    """
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == user.id
    ).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    # Calculate months until target date
    target_date = datetime.strptime(str(goal.target_date), '%Y-%m-%d') if isinstance(goal.target_date, str) else goal.target_date
    today = datetime.now()
    months_remaining = max(1, ((target_date.year - today.year) * 12 + (target_date.month - today.month)))
    
    result = SimulationEngine.calculate_minimum_monthly_contribution(
        current_amount=data.get('current_amount', goal.saved_amount),
        target_amount=goal.target_amount,
        expected_return=data.get('expected_return', 12.0),
        target_months=months_remaining
    )
    
    return result

# ---------- INVESTMENT SIMULATION ROUTES (NEW) ----------
@app.post("/investments/simulate-growth")
def simulate_investment_growth(
    data: Dict[str, Any],
    user: User = Depends(get_current_user)
):
    """
    Simulate investment growth without goal-specific parameters
    Auto-calculate completion time
    """
    current_amount = data.get('current_amount', 0)
    target_amount = data.get('target_amount', 1000000)
    monthly_contribution = data.get('monthly_contribution', 10000)
    expected_return = data.get('expected_return', 12.0)
    
    # Calculate completion time
    time_result = SimulationEngine.calculate_goal_completion_time(
        current_amount=current_amount,
        target_amount=target_amount,
        monthly_contribution=monthly_contribution,
        expected_return=expected_return
    )
    
    # If achievable, run full simulation
    if time_result.get('possible'):
        years = int(time_result.get('years', 10)) + 1  # Round up
        simulation_result = SimulationEngine.simulate_goal_achievement(
            current_amount=current_amount,
            target_amount=target_amount,
            monthly_contribution=monthly_contribution,
            expected_return_rate=expected_return,
            years=years
        )
        
        return {
            **time_result,
            **simulation_result,
            "auto_calculated": True
        }
    else:
        return time_result

@app.post("/investments/minimum-for-target")
def calculate_investment_minimum(
    data: Dict[str, Any],
    user: User = Depends(get_current_user)
):
    """
    Calculate minimum monthly investment to reach target in given timeframe
    """
    current_amount = data.get('current_amount', 0)
    target_amount = data.get('target_amount', 1000000)
    years = data.get('years', 10)
    expected_return = data.get('expected_return', 12.0)
    
    result = SimulationEngine.calculate_minimum_monthly_contribution(
        current_amount=current_amount,
        target_amount=target_amount,
        expected_return=expected_return,
        target_months=years * 12
    )
    
    return result

# ---------- CALCULATORS ROUTES ----------
@app.post("/calculators/sip")
def calculate_sip(calc_input: SIPCalculatorInput):
    return FinancialCalculators.calculate_sip(
        monthly_investment=calc_input.monthly_investment,
        expected_return_rate=calc_input.expected_return_rate,
        time_period_years=calc_input.time_period_years
    )

@app.post("/calculators/retirement")
def calculate_retirement(calc_input: RetirementCalculatorInput):
    return FinancialCalculators.calculate_retirement(
        current_age=calc_input.current_age,
        retirement_age=calc_input.retirement_age,
        current_savings=calc_input.current_savings,
        monthly_contribution=calc_input.monthly_contribution,
        expected_return_rate=calc_input.expected_return_rate,
        desired_monthly_income=calc_input.desired_monthly_income
    )

@app.post("/calculators/loan")
def calculate_loan(calc_input: LoanPayoffCalculatorInput):
    return FinancialCalculators.calculate_loan_payoff(
        principal=calc_input.principal,
        annual_interest_rate=calc_input.annual_interest_rate,
        tenure_months=calc_input.tenure_months,
        extra_payment=calc_input.extra_payment
    )

# ---------- REPORTS ROUTES ----------
@app.get("/reports/portfolio/pdf")
def download_portfolio_pdf(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    user_data = {
        'name': user.name,
        'email': user.email,
        'risk_profile': user.risk_profile.value if user.risk_profile else 'moderate'
    }
    
    investments = [
        {
            'symbol': inv.symbol,
            'asset_type': inv.asset_type.value,
            'units': inv.units,
            'avg_buy_price': inv.avg_buy_price,
            'cost_basis': inv.cost_basis,
            'current_value': inv.current_value
        }
        for inv in db.query(Investment).filter(Investment.user_id == user.id).all()
    ]
    
    transactions = [
        {
            'symbol': tx.symbol,
            'type': tx.type.value,
            'quantity': tx.quantity,
            'price': tx.price,
            'fees': tx.fees,
            'executed_at': tx.executed_at
        }
        for tx in db.query(Transaction).filter(Transaction.user_id == user.id).order_by(Transaction.executed_at.desc()).limit(20).all()
    ]
    
    pdf_buffer = ReportGenerator.generate_portfolio_pdf(user_data, investments, transactions)
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=portfolio_report.pdf"}
    )

@app.get("/reports/goals/pdf")
def download_goals_pdf(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    user_data = {
        'name': user.name,
        'email': user.email
    }
    
    goals = [
        {
            'title': g.title,
            'goal_type': g.goal_type.value,
            'target_amount': g.target_amount,
            'saved_amount': g.saved_amount,
            'status': g.status.value
        }
        for g in db.query(Goal).filter(Goal.user_id == user.id).all()
    ]
    
    pdf_buffer = ReportGenerator.generate_goals_pdf(user_data, goals)
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=goals_report.pdf"}
    )

@app.get("/reports/portfolio/csv")
def download_portfolio_csv(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    investments = [
        {
            'symbol': inv.symbol,
            'asset_type': inv.asset_type.value,
            'units': inv.units,
            'avg_buy_price': inv.avg_buy_price,
            'cost_basis': inv.cost_basis,
            'current_value': inv.current_value
        }
        for inv in db.query(Investment).filter(Investment.user_id == user.id).all()
    ]
    
    csv_data = ReportGenerator.generate_portfolio_csv(investments)
    
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=portfolio.csv"}
    )

@app.get("/reports/transactions/csv")
def download_transactions_csv(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    transactions = [
        {
            'symbol': tx.symbol,
            'type': tx.type.value,
            'quantity': tx.quantity,
            'price': tx.price,
            'fees': tx.fees,
            'executed_at': tx.executed_at
        }
        for tx in db.query(Transaction).filter(Transaction.user_id == user.id).order_by(Transaction.executed_at.desc()).all()
    ]
    
    csv_data = ReportGenerator.generate_transactions_csv(transactions)
    
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=transactions.csv"}
    )

# ---------- DASHBOARD ROUTES ----------
@app.get("/dashboard/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # Portfolio summary
    investments = db.query(Investment).filter(Investment.user_id == user.id).all()
    total_investment = sum(inv.cost_basis for inv in investments)
    total_value = sum(inv.current_value for inv in investments)
    total_gain = total_value - total_investment
    gain_percent = (total_gain / total_investment * 100) if total_investment > 0 else 0
    
    # Goals summary
    goals = db.query(Goal).filter(Goal.user_id == user.id).all()
    total_goals = len(goals)
    active_goals = len([g for g in goals if g.status.value == 'active'])
    completed_goals = len([g for g in goals if g.status.value == 'completed'])
    total_goal_target = sum(g.target_amount for g in goals)
    total_goal_saved = sum(g.saved_amount for g in goals)
    
    # Transactions summary
    recent_transactions = db.query(Transaction).filter(
        Transaction.user_id == user.id
    ).order_by(Transaction.executed_at.desc()).limit(5).all()
    
    return {
        "portfolio": {
            "total_investment": round(total_investment, 2),
            "current_value": round(total_value, 2),
            "total_gain": round(total_gain, 2),
            "gain_percent": round(gain_percent, 2),
            "holdings_count": len(investments)
        },
        "goals": {
            "total": total_goals,
            "active": active_goals,
            "completed": completed_goals,
            "total_target": round(total_goal_target, 2),
            "total_saved": round(total_goal_saved, 2),
            "progress_percent": round((total_goal_saved / total_goal_target * 100) if total_goal_target > 0 else 0, 2)
        },
        "recent_transactions": [
            {
                "id": tx.id,
                "symbol": tx.symbol,
                "type": tx.type.value,
                "quantity": tx.quantity,
                "price": tx.price,
                "executed_at": tx.executed_at.isoformat()
            }
            for tx in recent_transactions
        ]
    }

if __name__ == "__main__":
    import uvicorn
    if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
