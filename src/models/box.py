from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from src.db.database import Base


class Box(Base):
    __tablename__ = "boxes"

    id = Column(Integer, primary_key=True)
    uuid = Column(String, unique=True, nullable=False)
    owner_token = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    feedbacks = relationship(
        "Feedback", back_populates="box", cascade="all, delete-orphan"
    )
    user = relationship("User", back_populates="boxes")
