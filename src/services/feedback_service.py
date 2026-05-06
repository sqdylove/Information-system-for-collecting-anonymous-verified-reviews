from src.models.feedback import Feedback
from src.utils.validators import validate_text

def create_feedback(db, box_id, text):
    text = validate_text(text)

    fb = Feedback(box_id=box_id, text=text)
    db.add(fb)
    db.commit()
    return fb