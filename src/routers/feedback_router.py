from fastapi import APIRouter

router = APIRouter()

@router.post("/box/{uuid}/feedback")
def send_feedback():
    return {"status": "ok"}

@router.get("/box/{uuid}")
def get_feedbacks():
    return []

@router.post("/feedback/{id}/reply")
def reply():
    return {"status": "ok"}