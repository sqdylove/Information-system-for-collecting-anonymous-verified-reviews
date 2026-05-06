from src.models.box import Box
from src.utils.security import generate_uuid, generate_token

def create_box(db):
    box = Box(
        uuid=generate_uuid(),
        owner_token=generate_token()
    )
    db.add(box)
    db.commit()
    db.refresh(box)
    return box