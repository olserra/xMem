from pydantic import BaseModel


class TextIn(BaseModel):
    text: str
