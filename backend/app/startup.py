"""
startup.py — runs automatically when the FastAPI app starts.
Creates all database tables if they don't exist yet (safe to run multiple times).
"""
import logging
from app.database import Base, engine

logger = logging.getLogger(__name__)

def init_db():
    """Create all tables defined in models.py — skips tables that already exist."""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables ready.")
    except Exception as e:
        logger.error(f"❌ Database init failed: {e}")
        raise e
