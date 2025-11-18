from pydantic import BaseModel
from typing import List, Optional

class AgentConfig(BaseModel):
    model_name: str
    api_key: str
    system_prompt: str
    tools: List[str] = []

class ChatRequest(BaseModel):
    message: str
    config: AgentConfig
    history: Optional[List[dict]] = [] # List of {"role": "user"|"assistant", "content": "..."}

class ChatResponse(BaseModel):
    content: str
