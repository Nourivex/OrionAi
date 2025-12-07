# ollama_client.py - Komunikasi ke Ollama API (local server)


import httpx
import json
from typing import Optional, Dict, Any
from src.core.config import OLLAMA_BASE_URL

def build_system_prompt(persona: Optional[Dict[str, Any]]) -> str:
    """Bangun system prompt dari persona aktif."""
    if not persona:
        return ""
    
    ai_name = persona.get("ai_name", "AI")
    persona_desc = persona.get("persona", "")
    user_nickname = persona.get("user_nickname", "User")
    greeting = persona.get("greeting", "")
    style = persona.get("style", "")

    parts = []
    parts.append(f"Kamu adalah {ai_name}.")
    if persona_desc:
        parts.append(persona_desc)
    parts.append(f"Panggil pengguna dengan sebutan '{user_nickname}'.")
    if style:
        parts.append(f"Gaya bicara: {style}")
    if greeting:
        parts.append(f"Sapa pengguna dengan: {greeting}")
    
    return " ".join(parts)

async def chat_with_ollama(prompt: str, model: str = "orion-12b-it:latest", persona: Optional[Dict[str, Any]] = None, history: Optional[list] = None) -> str:
    url = f"{OLLAMA_BASE_URL}/api/chat"
    messages = []
    system_prompt = build_system_prompt(persona)
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    # Tambahkan history chat (jika ada)
    if history:
        for msg in history:
            role = "user" if msg.get("type") == "sent" else "assistant"
            messages.append({"role": role, "content": msg.get("content", "")})
    # Tambahkan prompt user terakhir
    messages.append({"role": "user", "content": prompt})

    payload = {
        "model": model,
        "stream": True,
        "messages": messages
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(url, json=payload)
        resp.raise_for_status()

        full_content = ""
        async for line in resp.aiter_lines():
            if not line.strip():
                continue
            try:
                data = json.loads(line)
            except Exception:
                continue
            if data.get("done"):
                break
            msg = data.get("message", {})
            full_content += msg.get("content", "")
        return full_content.strip()
