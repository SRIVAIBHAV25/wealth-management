from celery import Celery
from celery.schedules import crontab
import logging
import os

logger = logging.getLogger(__name__)

# Redis URL from environment variable (Cloud Memorystore on GCP)
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Initialize Celery
celery_app = Celery(
    "wealth_management",
    broker=REDIS_URL,
    backend=REDIS_URL,
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Kolkata",
    enable_utc=False,
    broker_connection_retry_on_startup=True,
)


# Schedule tasks
celery_app.conf.beat_schedule = {
    "update-market-prices-daily": {
        "task": "app.celery_tasks.update_all_investment_prices",
        "schedule": crontab(hour=0, minute=0),  # Daily at midnight
    },
}


@celery_app.task(name="app.celery_tasks.update_all_investment_prices")
def update_all_investment_prices():
    """Task to update all investment prices"""
    try:
        from app.database import SessionLocal
        from app.alpha_vantage_service import AlphaVantageService

        db = SessionLocal()
        try:
            updated_count = AlphaVantageService.update_investment_prices(db)
            logger.info(f"Updated {updated_count} investments")
            return {"status": "success", "updated": updated_count}
        finally:
            db.close()

    except Exception as e:
        logger.exception("Error updating prices")
        return {"status": "error", "message": str(e)}


@celery_app.task(name="app.celery_tasks.update_user_investment_prices")
def update_user_investment_prices(user_id: int):
    """Task to update investment prices for a specific user"""
    try:
        from app.database import SessionLocal
        from app.alpha_vantage_service import AlphaVantageService

        db = SessionLocal()
        try:
            updated_count = AlphaVantageService.update_investment_prices(
                db, user_id=user_id
            )
            logger.info(f"Updated {updated_count} investments for user {user_id}")
            return {"status": "success", "updated": updated_count}
        finally:
            db.close()

    except Exception as e:
        logger.exception(f"Error updating prices for user {user_id}")
        return {"status": "error", "message": str(e)}


@celery_app.task(name="app.celery_tasks.generate_recommendations_task")
def generate_recommendations_task(user_id: int):
    """Task to generate recommendations for a user"""
    try:
        from app.database import SessionLocal
        from app.models import User, Recommendation
        from app.recommendation_engine import RecommendationEngine

        db = SessionLocal()
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                return {"status": "error", "message": "User not found"}

            rebalance_data = RecommendationEngine.get_rebalance_suggestions(db, user)

            if rebalance_data.get("needs_rebalance"):
                rec = Recommendation(
                    user_id=user_id,
                    title="Portfolio Rebalancing Recommendation",
                    recommendation_text=(
                        "Your portfolio allocation deviates from the "
                        "recommended allocation based on your risk profile."
                    ),
                    suggested_allocation=rebalance_data,
                )
                db.add(rec)
                db.commit()

            return {
                "status": "success",
                "needs_rebalance": rebalance_data.get("needs_rebalance"),
            }

        finally:
            db.close()

    except Exception as e:
        logger.exception(f"Error generating recommendations for user {user_id}")
        return {"status": "error", "message": str(e)}
