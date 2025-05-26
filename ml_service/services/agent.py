from schemas import AgentChatRequest, AgentChatResponse


def chat_with_agent(request: AgentChatRequest) -> AgentChatResponse:
    # TODO: Integrate with LLM and vector DBs as needed
    reply = f"[{request.model}] You said: {request.user_input} (sources: {', '.join(request.sources)})"
    return AgentChatResponse(reply=reply, metadata={"model": request.model})
