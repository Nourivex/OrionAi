# OrionAi Project

OrionAi adalah aplikasi roleplay AI yang memungkinkan pengguna berinteraksi dengan karakter virtual cerdas, membangun cerita, dan menyimpan memori percakapan. Backend menggunakan FastAPI (Python), frontend menggunakan React + Vite.

## Fitur Utama
- Roleplay AI dengan karakter yang dapat dikustomisasi (persona, relasi, role, dsb)
- Memory bank, scene, dan relationship antar karakter
- Chat LLM (Ollama) terintegrasi
- Logging error otomatis ke folder `logs/`

## Cara Menjalankan Project

### Interface (Frontend)
1. Buka terminal dan arahkan ke folder `interface/`.
2. Install dependencies (jika belum):
   ```bash
   npm install
   ```
3. Jalankan server Vite:
   ```bash
   npm run dev
   ```
4. Buka browser ke URL yang tertera (biasanya `http://localhost:5173`).

### Backend (FastAPI)
1. Buka terminal dan arahkan ke folder `backend/`.
2. Pastikan Python 3.11+ sudah terinstall.
3. Install dependencies (jika ada `requirements.txt`):
   ```bash
   pip install -r requirements.txt
   ```
4. Jalankan backend:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
5. API docs tersedia di: [http://localhost:8000/docs](http://localhost:8000/docs)

### Contoh Request Membuat Karakter

```bash
curl -X POST "http://127.0.0.1:8000/character" -H "Content-Type: application/json" -d '{ "name": "Alya", "user_relationship": "Kekasih", "character_role": "Protagonis", "user_persona_nickname": "Sayang", "greeting": "Hai, aku selalu di sini untukmu!", "short_description": "Alya adalah kekasih yang perhatian, penyayang, dan selalu mendukung user dalam segala situasi.", "voice_id": "", "visibility": "private", "category": "romance", "tags": [] }'
```

---

## Modular Sidebar & Highlight Logic (2025-12-06)
- Sidebar dipecah menjadi subkomponen: SidebarHeader, SidebarChatList, SidebarCharacterList, SidebarTools, SidebarModals.
- Logika highlight menu sidebar berbasis route (smart active state) diimplementasikan.
- Perbaikan error TypeScript/JSX pada SidebarHeader dan SidebarChatList.
- Penambahan .gitignore untuk backend dan frontend.
- Penambahan file commit history di docs/.

Selalu jalankan perintah dari direktori yang sesuai (`interface/` untuk frontend, `backend/` untuk backend) untuk menghindari error path.