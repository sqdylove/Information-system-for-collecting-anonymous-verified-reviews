from src.models.reply import Reply

def create_reply(db, feedback_id, text):
    reply = Reply(feedback_id=feedback_id, text=text)
    db.add(reply)
    db.commit()
    return reply