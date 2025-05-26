from pydantic import BaseModel


class TextIn(BaseModel):
    text: str


class AgentChatRequest(BaseModel):
    model: str
    sources: list[str]
    history: list[dict]
    user_input: str


class AgentChatResponse(BaseModel):
    reply: str
    metadata: dict = {}
