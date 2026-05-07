from fastapi import APIRouter, Depends, HTTPException, Request, Header, status
from sqlalchemy.orm import Session
from src.db.database import get_db
from src.middlewares.rate_limit import check_rate
from src.models.box import Box
from src.models.feedback import Feedback
from src.services.feedback_service import create_feedback
from src.services.reply_service import create_reply
from src.schemas.feedback import FeedbackCreate, FeedbackOut
from src.schemas.reply import ReplyCreate, ReplyOut
from src.schemas.box import BoxFeedbacksResponse, FeedbackOut as BoxFeedbackOut, ReplyOut as BoxReplyOut

router = APIRouter()

@router.post("/box/{uuid}/feedback", response_model=FeedbackOut, status_code=status.HTTP_200_OK)
def send_feedback(uuid: str, feedback: FeedbackCreate, request: Request, db: Session = Depends(get_db)):
    check_rate(request.client.host)
    box = db.query(Box).filter(Box.uuid == uuid).first()
    if box is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Box not found")

    created = create_feedback(db, box.id, feedback.text)
    return created

@router.get("/box/{uuid}", response_model=BoxFeedbacksResponse)
def get_feedbacks(uuid: str, db: Session = Depends(get_db)):
    box = db.query(Box).filter(Box.uuid == uuid).first()
    if box is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Box not found")

    feedbacks = []
    for fb in box.feedbacks:
        replies = [BoxReplyOut(id=reply.id, text=reply.text, created_at=reply.created_at.isoformat()) for reply in fb.replies]
        feedbacks.append(BoxFeedbackOut(id=fb.id, text=fb.text, created_at=fb.created_at.isoformat(), replies=replies))

    return BoxFeedbacksResponse(uuid=box.uuid, feedbacks=feedbacks)

@router.post("/feedback/{id}/reply", response_model=ReplyOut, status_code=status.HTTP_200_OK)
def reply(id: int, request: Request, reply_data: ReplyCreate, x_owner_token: str = Header(None, alias="X-Owner-Token"), db: Session = Depends(get_db)):
    check_rate(request.client.host)
    feedback = db.query(Feedback).filter(Feedback.id == id).first()
    if feedback is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feedback not found")

    box = db.query(Box).filter(Box.id == feedback.box_id).first()
    if box is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Box not found")

    if not x_owner_token or x_owner_token != box.owner_token:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid owner token")

    created = create_reply(db, feedback.id, reply_data.text)
    return ReplyOut(id=created.id, text=created.text, created_at=created.created_at.isoformat())