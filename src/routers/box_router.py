from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.db.database import SessionLocal
from src.services.box_service import create_box

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/box")
def create():
    return create_box(next(get_db()))