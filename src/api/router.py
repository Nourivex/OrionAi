# router.py - FastAPI router untuk endpoint utama

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import asyncio
from src.llm.ollama_client import chat_with_ollama

router = APIRouter()

@router.get("/ping")
def ping():
    return {"status": "ok"}

# Request body untuk chat
class ChatRequest(BaseModel):
    prompt: str
    model: str = "orion-12b-it:latest"

@router.post("/chat")
async def chat_endpoint(req: ChatRequest):
    try:
        result = await chat_with_ollama(req.prompt, req.model)
        return {"response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
