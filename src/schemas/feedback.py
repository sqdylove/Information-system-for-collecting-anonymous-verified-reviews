from pydantic import BaseModel

class FeedbackCreate(BaseModel):
    text: str

class FeedbackOut(BaseModel):
    id: int
    text: str