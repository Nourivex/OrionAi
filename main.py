# main.py - Entry point FastAPI backend
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.router import router
from src.api.tools.tools_router import router as tools_router
from src.rag.memory_bank import init_memory_bank_table
from src.rag.conversations import init_conversations_table
from src.rag.characters import init_characters_table
from src.rag.character_personas import init_character_personas_table
from src.rag.migrations import (
    init_character_memories_table,
    init_scenes_table,
    init_conversation_scenes_table,
    init_character_relationships_table
)

app = FastAPI(title="OrionAI Backend")

# CORS untuk integrasi dengan frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inisialisasi DB table saat startup
@app.on_event("startup")
def startup_event():
    init_memory_bank_table()
    init_conversations_table()
    init_characters_table()
    init_character_personas_table()
    # Advanced roleplay tables
    init_character_memories_table()
    init_scenes_table()
    init_conversation_scenes_table()
    init_character_relationships_table()

# Register router utama
app.include_router(router)
app.include_router(tools_router)
