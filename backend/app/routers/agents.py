from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.schemas.agent import ChatRequest
from app.graph.workflow import create_agent_graph
from langchain_core.messages import HumanMessage, AIMessage
import json
import asyncio
import traceback

router = APIRouter()

@router.post("/chat")
async def chat_agent(request: ChatRequest):
    try:
        # Reconstruct history
        messages = []
        history = request.history or []
        for msg in history:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                messages.append(AIMessage(content=msg["content"]))
        
        # Add current message
        messages.append(HumanMessage(content=request.message))
        
        # Create graph
        app = create_agent_graph(
            api_key=request.config.api_key,
            model_name=request.config.model_name,
            system_prompt=request.config.system_prompt,
            tools=request.config.tools
        )
        
        async def event_generator():
            try:
                # Stream the output
                async for event in app.astream_events({"messages": messages}, version="v1"):
                    kind = event["event"]
                    
                    # Stream LLM tokens
                    if kind == "on_chat_model_stream":
                        content = event["data"]["chunk"].content
                        if content:
                            yield f"data: {json.dumps({'content': content})}\n\n"
                    
                    # Stream Tool Calls (Optional: could add a specific event type for UI to show 'Thinking...')
                    elif kind == "on_tool_start":
                        yield f"data: {json.dumps({'type': 'status', 'content': 'Checking weather...'})}\n\n"
                        
                yield "data: [DONE]\n\n"
            except Exception as e:
                print(f"Error in event_generator: {e}")
                traceback.print_exc()
                yield f"data: {json.dumps({'content': f'Error: {str(e)}'})}\n\n"
                yield "data: [DONE]\n\n"

        return StreamingResponse(event_generator(), media_type="text/event-stream")

    except Exception as e:
        print(f"Error in chat_agent: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
