from pydantic import BaseModel

class BoxCreateResponse(BaseModel):
    uuid: str
    owner_token: str