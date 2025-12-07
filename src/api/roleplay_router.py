from fastapi import APIRouter, HTTPException
from src.rag.character_personas import get_all_character_personas, get_character_persona, update_character_persona, set_active_character_persona, delete_character_persona
from ..core.config import get_db_connection
from typing import Optional, List
from src.utils.async_db import async_db
from pydantic import BaseModel

router = APIRouter()

# =====================
# CHARACTER PERSONAS ENDPOINTS (Roleplay)
# =====================

class CharacterPersonaCreate(BaseModel):
    name: str
    user_relationship: str
    character_role: str
    user_persona_nickname: Optional[str] = None
    greeting: Optional[str] = ""
    short_description: str
    voice_id: Optional[str] = None
    visibility: Optional[str] = "private"
    category: Optional[str] = "general"
    tags: Optional[List[str]] = []


import uuid
import json
from src.llm.ollama_client import chat_with_ollama

@router.post("/character")
async def create_character_persona(body: CharacterPersonaCreate):
    try:
        short_desc = body.short_description
        relationship = body.user_relationship
        role = body.character_role
        nickname = body.user_persona_nickname or "Tuan"
        prompt = (
            f"Berdasarkan deskripsi singkat: {short_desc}.\n"
            f"Karakter ini memiliki hubungan '{relationship}' dengan User dan berperan sebagai '{role}'.\n"
            f"Karakter akan memanggil User dengan sebutan '{nickname}'.\n\n"
            "Kembangkan detail roleplay yang lengkap dan terstruktur (sekitar 500 kata) untuk field 'definition'. "
            "Detail harus mencakup:\n"
            "1. Penampilan Fisik (Gender, umur, bentuk tubuh, pakaian).\n"
            "2. Kepribadian Mendalam (Sifat, kelemahan, motivasi).\n"
            "3. Gaya Bicara (Nada, kosakata khas, cara memanggil User).\n"
            "4. Latar Belakang dan Dinamika Hubungan dengan User.\n"
            "5. Perilaku Khas dalam Roleplay."
        )
        definition = await chat_with_ollama(prompt)
        character_id = str(uuid.uuid4())
        tags_json = json.dumps(body.tags or [])
        conn = get_db_connection()
        conn.execute(
            '''INSERT INTO character_personas 
               (character_id, name, user_relationship, character_role, user_persona_nickname, 
                greeting, short_description, voice_id, visibility, category, tags, definition) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            (
                character_id,
                body.name,
                body.user_relationship,
                body.character_role,
                body.user_persona_nickname,
                body.greeting or "",
                body.short_description,
                body.voice_id,
                str(body.visibility),
                body.category or "general",
                tags_json,
                definition
            )
        )
        conn.commit()
        row = conn.execute('SELECT * FROM character_personas WHERE character_id = ?', (character_id,)).fetchone()
        conn.close()
        if not row:
            raise HTTPException(status_code=500, detail="Failed to create character persona")
        return dict(row)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/character_personas")
def list_character_personas():
    try:
        conn = get_db_connection()
        rows = conn.execute('SELECT * FROM character_personas ORDER BY name ASC').fetchall()
        conn.close()
        result = []
        for r in rows:
            result.append(dict(r))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/character/{character_id}")
def get_character_persona(character_id: str):
    try:
        conn = get_db_connection()
        row = conn.execute('SELECT * FROM character_personas WHERE character_id = ?', (character_id,)).fetchone()
        conn.close()
        if not row:
            raise HTTPException(status_code=404, detail="Character persona not found")
        return dict(row)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class CharacterPersonaUpdate(BaseModel):
    name: Optional[str] = None
    user_relationship: Optional[str] = None
    character_role: Optional[str] = None
    user_persona_nickname: Optional[str] = None
    greeting: Optional[str] = None
    short_description: Optional[str] = None
    voice_id: Optional[str] = None
    visibility: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    definition: Optional[str] = None
    isActive: Optional[bool] = None

@router.put("/character/{character_id}")
def edit_character_persona(character_id: str, body: CharacterPersonaUpdate):
    data = body.dict(exclude_unset=True)
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update")
    success = update_character_persona(character_id, **data)
    if not success:
        raise HTTPException(status_code=404, detail="Character persona not found or no changes made")
    return {"success": True}

@router.put("/character/{character_id}/activate")
def activate_character_persona(character_id: str):
    set_active_character_persona(character_id)
    return {"success": True}

@router.delete("/character/{character_id}")
def remove_character_persona(character_id: str):
    delete_character_persona(character_id)
    return {"success": True}

# CHARACTER CONVERSATION ENDPOINTS
import datetime
class CharacterConversationMessage(BaseModel):
    type: str
    content: str
    timestamp: str

class CharacterConversationUpdate(BaseModel):
    messages: List[CharacterConversationMessage]

@router.get("/character/{character_id}/conversation")
def get_character_conversation(character_id: str):
    try:
        conn = get_db_connection()
        conn.execute('''
        CREATE TABLE IF NOT EXISTS character_conversations (
            character_id TEXT PRIMARY KEY,
            messages TEXT,
            created_at TEXT,
            updated_at TEXT
        )
        ''')
        conn.commit()
        row = conn.execute(
            'SELECT * FROM character_conversations WHERE character_id = ?',
            (character_id,)
        ).fetchone()
        conn.close()
        if not row:
            return {"character_id": character_id, "messages": [], "exists": False}
        messages = json.loads(row['messages']) if row['messages'] else []
        return {
            "character_id": row['character_id'],
            "messages": messages,
            "created_at": row['created_at'],
            "updated_at": row['updated_at'],
            "exists": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/character/{character_id}/conversation")
def save_character_conversation(character_id: str, body: CharacterConversationUpdate):
    try:
        conn = get_db_connection()
        conn.execute('''
        CREATE TABLE IF NOT EXISTS character_conversations (
            character_id TEXT PRIMARY KEY,
            messages TEXT,
            created_at TEXT,
            updated_at TEXT
        )
        ''')
        now = datetime.datetime.now().isoformat()
        messages_json = json.dumps([m.dict() for m in body.messages])
        existing = conn.execute(
            'SELECT character_id FROM character_conversations WHERE character_id = ?',
            (character_id,)
        ).fetchone()
        if existing:
            conn.execute(
                'UPDATE character_conversations SET messages = ?, updated_at = ? WHERE character_id = ?',
                (messages_json, now, character_id)
            )
        else:
            conn.execute(
                'INSERT INTO character_conversations (character_id, messages, created_at, updated_at) VALUES (?, ?, ?, ?)',
                (character_id, messages_json, now, now)
            )
        conn.commit()
        conn.close()
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/character/{character_id}/conversation")
def delete_character_conversation(character_id: str):
    try:
        conn = get_db_connection()
        conn.execute(
            'DELETE FROM character_conversations WHERE character_id = ?',
            (character_id,)
        )
        conn.commit()
        conn.close()
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
