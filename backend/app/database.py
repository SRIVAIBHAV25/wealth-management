import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://neondb_owner:npg_mn5hJ4quAOaN@ep-wandering-rain-a17vok4o-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
