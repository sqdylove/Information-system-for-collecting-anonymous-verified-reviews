from src.models.reply import Reply
from src.utils.validators import validate_text

def create_reply(db, feedback_id, text):
    text = validate_text(text)
    reply = Reply(feedback_id=feedback_id, text=text)
    db.add(reply)
    db.commit()
    db.refresh(reply)
    return reply