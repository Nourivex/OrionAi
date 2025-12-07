from fastapi import APIRouter, HTTPException
from src.rag.memory_bank import get_all_memory_items, get_memory_item, create_memory_item, update_memory_item, delete_memory_item
from ..core.config import get_db_connection
from typing import Optional
from ..api.router import async_db
from pydantic import BaseModel

router = APIRouter()

class MemoryItemCreate(BaseModel):
    name: str
    type: str
    size: str
    source: str
    status: Optional[str] = "Pending"

class MemoryItemUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    size: Optional[str] = None
    source: Optional[str] = None

@router.get("/memory")
async def list_memory_items():
    return await async_db(get_all_memory_items)

@router.get("/memory/{item_id}")
async def get_memory(item_id: int):
    item = await async_db(get_memory_item, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Memory item not found")
    return item

@router.post("/memory")
async def add_memory_item(body: MemoryItemCreate):
    new_id = await async_db(
        create_memory_item,
        body.name,
        body.type,
        body.size,
        body.source,
        body.status or "Pending"
    )
    return {"id": new_id}

@router.put("/memory/{item_id}")
async def edit_memory_item(item_id: int, body: MemoryItemUpdate):
    data = body.dict(exclude_unset=True)
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update")
    await async_db(update_memory_item, item_id, **data)
    return {"success": True}

@router.delete("/memory/{item_id}")
async def remove_memory_item(item_id: int):
    await async_db(delete_memory_item, item_id)
    return {"success": True}
