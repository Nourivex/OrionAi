from fastapi import APIRouter, HTTPException
from src.rag.conversations import get_all_conversations, get_conversation, create_conversation, update_conversation, delete_conversation, add_message_to_conversation
from ..core.config import get_db_connection
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from src.llm.ollama_client import chat_with_ollama
import httpx
from ..api.router import async_db

router = APIRouter()

# Get a single conversation by id
@router.get("/conversations/{conv_id}")
async def get_conversation_endpoint(conv_id: int):
    try:
        conv = await async_db(get_conversation, conv_id)
        if not conv:
            raise HTTPException(status_code=404, detail="Conversation not found")
        return conv
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =====================
# CONVERSATIONS ENDPOINTS
# =====================

class ConversationCreate(BaseModel):
    title: str
    smartTags: Optional[List[str]] = []
    is_active: Optional[int] = 0
    last_updated: Optional[str] = ""
    messages: Optional[List[Dict[str, Any]]] = []

class ConversationUpdate(BaseModel):
    title: Optional[str] = None
    smartTags: Optional[List[str]] = None
    is_active: Optional[int] = None
    last_updated: Optional[str] = None
    messages: Optional[List[Dict[str, Any]]] = None

class MessageAdd(BaseModel):
    id: int
    type: str
    content: str
    timestamp: str
    reactions: Optional[Dict[str, int]] = {"likes": 0, "dislikes": 0}
    tool_action: Optional[Dict[str, Any]] = None

# =====================
# CHAT ENDPOINT
# =====================


class ChatRequest(BaseModel):
    prompt: str
    model: str = "orion-12b-it:latest"

def detect_intent(prompt: str):
    p = prompt.lower()
    if "jam berapa" in p or "waktu" in p:
        return "get_datetime", None
    if "buka" in p and "notepad" in p:
        return "open_app", "notepad"
    return None, None


@router.post("/chat")
async def chat_endpoint(req: ChatRequest, conv_id: Optional[int] = None):
    # Intent detection
    intent, app_name = detect_intent(req.prompt)
    history = None
    if conv_id:
        conv = await async_db(get_conversation, conv_id)
        if conv and "messages" in conv:
            history = conv["messages"][-5:]

    # Jika intent terdeteksi, ambil hasil tool dan gabungkan ke prompt user
    if intent == "get_datetime":
        async with httpx.AsyncClient() as client:
            r = await client.get("http://localhost:1810/api/tools/datetime")
            if r.status_code == 200:
                data = r.json()
                # Gabungkan hasil tool ke prompt user
                smart_prompt = f"{req.prompt}\n\nInfo waktu server: {data['message']}"
                result = await chat_with_ollama(smart_prompt, req.model, None, history)
                return {"response": result, "tool_action": {"type": "tool_action", "tool": "datetime", "result": data["message"]}}
            else:
                return {"type": "tool_action", "tool": "datetime", "result": "Gagal mengambil waktu server."}
    if intent == "open_app" and app_name:
        async with httpx.AsyncClient() as client:
            r = await client.post("http://localhost:1810/api/tools/open_app", json={"app_name": app_name, "confirm": False})
            data = r.json()
            smart_prompt = f"{req.prompt}\n\nStatus aplikasi: {data.get('message', '')}"
            result = await chat_with_ollama(smart_prompt, req.model, None, history)
            return {"response": result, "tool_action": {"type": "tool_action", "tool": "open_app", "action_required": data.get("action_required", False), "message": data.get("message", ""), "app_name": app_name}}

    # Default: LLM response, gunakan context/history jika ada
    try:
        result = await chat_with_ollama(req.prompt, req.model, None, history)
        return {"response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/conversations")
async def create_conversation_endpoint(conv: ConversationCreate):
    try:
        new_id = await async_db(
            create_conversation,
            conv.title,
            conv.smartTags or [],
            conv.is_active or 0,
            conv.last_updated or "",
            conv.messages or []
        )
        return {"id": new_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/conversations")
async def list_conversations():
    return await async_db(get_all_conversations)


# Endpoint untuk menambah message ke conversation tertentu
@router.post("/conversations/{conv_id}/message")
async def add_message_to_conv(conv_id: int, msg: MessageAdd):
    try:
        ok = await async_db(add_message_to_conversation, conv_id, msg.dict())
        if not ok:
            raise HTTPException(status_code=404, detail="Conversation not found or failed to add message")
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/conversations/{conv_id}")
async def delete_conversation_endpoint(conv_id: int):
    try:
        ok = await async_db(delete_conversation, conv_id)
        if not ok:
            raise HTTPException(status_code=404, detail="Conversation not found or failed to delete")
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# Endpoint untuk menghapus conversation
@router.delete("/conversations/{conv_id}")
async def delete_conversation_endpoint(conv_id: int):
    try:
        ok = await async_db(delete_conversation, conv_id)
        if not ok:
            raise HTTPException(status_code=404, detail="Conversation not found or failed to delete")
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))