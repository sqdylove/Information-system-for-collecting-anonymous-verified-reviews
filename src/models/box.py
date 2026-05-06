from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from src.db.database import Base

class Box(Base):
    __tablename__ = "boxes"

    id = Column(Integer, primary_key=True)
    uuid = Column(String, unique=True)
    owner_token = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)