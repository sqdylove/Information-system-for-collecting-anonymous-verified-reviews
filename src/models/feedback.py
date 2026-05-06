from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from datetime import datetime
from src.db.database import Base

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True)
    box_id = Column(Integer, ForeignKey("boxes.id"))
    text = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)