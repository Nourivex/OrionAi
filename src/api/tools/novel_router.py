from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ...core.config import NOVEL_STORAGE_DIR, ensure_novel_storage
from src.llm.ollama_client import chat_with_ollama
import os

router = APIRouter()

class NovelGenerateRequest(BaseModel):
    title: Optional[str] = None
    genre: Optional[str] = "General"
    length: Optional[str] = "medium"  # short | medium | long
    language: Optional[str] = "id"  # 'id' for Indonesian, 'en' for English etc.
    model: Optional[str] = "orion-12b-it:latest"
    outlineOnly: Optional[bool] = False

@router.post("/tools/novel/generate")
async def generate_novel(req: NovelGenerateRequest):
    try:
        title = (req.title or "Untitled").strip()
        genre = req.genre or "General"
        length = req.length or "medium"
        lang = req.language or "id"
        model = req.model or "orion-12b-it:latest"
        length_map = {
            'short': 'panjang pendek (~2-5 halaman)',
            'medium': 'panjang sedang (~10-30 halaman)',
            'long': 'panjang panjang (~50+ halaman)'
        }
        human_length = length_map.get(length, length_map['medium'])
        prompt = f"Tuliskan sebuah novel berjudul '{title}' dalam genre {genre}. Tulis dalam bahasa {'Indonesia' if lang=='id' else 'English'}. "
        prompt += f"Target: {human_length}. Jika diminta outlineOnly, berikan hanya kerangka bab dan sinopsis singkat per bab."
        if req.outlineOnly:
            prompt += "\nBerikan daftar bab (10-20 bab ideal) dengan sinopsis singkat tiap bab."
        else:
            prompt += "\nTulis narasi yang kaya, deskriptif, dan terstruktur dengan pembagian bab. Gunakan dialog, deskripsi, dan alur yang jelas."
        result = await chat_with_ollama(prompt, model)
        return {"novel": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class NovelSaveRequest(BaseModel):
    title: str
    folder: Optional[str] = "default"
    filename: Optional[str] = None
    content: str

@router.post("/tools/novel/save")
def save_novel(req: NovelSaveRequest):
    try:
        ensure_novel_storage()
        folder = (req.folder or "default").strip()
        safe_folder = ''.join(c for c in folder if c.isalnum() or c in (' ', '-', '_')).strip() or 'default'
        target_dir = NOVEL_STORAGE_DIR / safe_folder
        target_dir.mkdir(parents=True, exist_ok=True)
        if req.filename:
            name = req.filename
        else:
            name = ''.join(c for c in req.title if c.isalnum() or c in (' ', '-', '_')).strip().replace(' ', '_')
            if not name:
                name = 'untitled'
        file_path = target_dir / f"{name}.md"
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(f"# {req.title}\n\n")
            f.write(req.content)
        return {"success": True, "path": str(file_path)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/tools/novel/folders')
def list_novel_folders():
    try:
        ensure_novel_storage()
        dirs = []
        for p in NOVEL_STORAGE_DIR.iterdir():
            if p.is_dir():
                dirs.append(p.name)
        return {"folders": dirs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
