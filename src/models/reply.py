from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from datetime import datetime
from src.db.database import Base

class Reply(Base):
    __tablename__ = "replies"

    id = Column(Integer, primary_key=True)
    feedback_id = Column(Integer, ForeignKey("feedbacks.id"))
    text = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)