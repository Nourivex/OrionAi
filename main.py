# main.py - Entry point FastAPI backend
from fastapi import FastAPI
from src.api.router import router
from src.rag.memory_bank import init_memory_bank_table

app = FastAPI(title="OrionAI Backend")

# Inisialisasi DB table saat startup
@app.on_event("startup")
def startup_event():
    init_memory_bank_table()

# Register router utama
app.include_router(router)
