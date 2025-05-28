from schemas import AgentChatRequest, AgentChatResponse


def chat_with_agent(request: AgentChatRequest) -> AgentChatResponse:
    # Minimal dummy agent for MVP
    return AgentChatResponse(
        reply=f"[MVP Agent] You said: {request.user_input}",
        metadata={"model": request.model},
    )
