# ollama_client.py - Komunikasi ke Ollama API (local server)

# ollama_client.py
import httpx
import json

OLLAMA_BASE_URL = "http://localhost:11434"

async def chat_with_ollama(prompt: str, model: str = "orion-12b-it:latest") -> str:
	url = f"{OLLAMA_BASE_URL}/api/chat"
	payload = {
		"model": model,
		"stream": True,  # streaming agar bisa gabung semua chunk
		"messages": [
			{"role": "user", "content": prompt}
		]
	}

	async with httpx.AsyncClient(timeout=60.0) as client:
		resp = await client.post(url, json=payload)
		resp.raise_for_status()

		# Ollama streaming: tiap baris adalah JSON
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
