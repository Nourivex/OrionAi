# TODOS.md

## Progress Update (2025-12-06)
- [x] Rangka utama interface modern (chat, sidebar, settings, memory bank, tools) selesai.
- [x] Backend Character Personas dengan smart generation (Ollama LLM).
- [x] Frontend Character Chat Page mirip Character.ai dengan side panel.
- [x] View All Conversations dan View All Characters pages.
- [x] Character Conversation Persistence (1 conversation per character, auto-save, reset via "New Chat").
- [x] Sidebar active state logic fixed untuk semua routes.
- [x] Folder `characterchat/` dengan komponen modular (Header, Input, MessageBubble, MessageList, SidePanel).
- [x] Settings tab Character Roleplay untuk manage characters.
- [x] CreateCharacterPage dengan form dan smart generation toggle.
- [x] Sidebar "New Character" button.
- [x] Routes update: `/characterchat/:characterId`, `/character/new`.
- [x] Sidebar responsive untuk tablet (breakpoint 1024px).
- [x] SidePanel menu items berfungsi dengan submenu system.
- [x] CharacterDetailPage dengan tab About & Chat Starters.
- [x] EditCharacterPage dengan form lengkap mirip Character.ai.
- [x] Klik avatar di SidePanel membuka halaman detail karakter.
- [x] Header: Hapus tombol back (fix bug), tambah Reset Chat & Delete Chat.
- [x] Buat PLAN_CharacterRoleplay.md untuk roadmap fitur lanjutan.
- [x] Modularisasi sidebar menjadi subkomponen (SidebarHeader, SidebarChatList, SidebarCharacterList, SidebarTools, SidebarModals).
- [x] Smart active-state logic untuk sidebar (highlight menu sesuai route).
- [x] Fix error TypeScript/JSX pada SidebarHeader, SidebarChatList, dan subkomponen lain.
- [x] Penambahan .gitignore backend/frontend.
- [x] Penambahan endpoint POST/DELETE message & conversation di backend agar sinkron dengan frontend.
- [x] Perbaikan mapping tags karakter agar tidak error jika string/null.
- [x] Sinkronisasi fitur CharacterChatPage dan API backend (hapus fitur frontend yang tidak ada di backend, dan sebaliknya).
- [x] Penambahan animasi fade-in pada bubble chat.
- [x] Update README.md dan docs/COMMIT_HISTORY.md.

# TODOS.md

## Progress Update (2025-12-07)
 - [x] Review dan update roadmap RAG (Retrieval-Augmented Generation) untuk conversation memory.
 - [x] Diskusi dan perencanaan endpoint retrieval backend (RAG) untuk memory/conversation.
 - [x] Sinkronisasi frontend-backend untuk endpoint conversation dan message deletion.
 - [x] Update dokumentasi (TODOS.md, Completed.md, PLAN_CharacterRoleplay.md) sesuai progress terbaru.
 - [x] Validasi semua flow utama (sidebar, chat, character, conversation) sudah error-free dan terdokumentasi.

## Daftar Tugas
 - [ ] Implementasi endpoint retrieval RAG di backend (conversation memory/context).
 - [ ] Integrasi API frontend untuk retrieval dan context augmentation.
 - [ ] Siapkan logic indexing memory dan retrieval untuk RAG.

### Prioritas Tinggi
- [x] Integrasi API Ollama ke dalam aplikasi (chat & character generation).
- [x] Character Conversation Persistence dengan auto-save ke database.
- [x] Create Character Form UI.
- [x] Edit Character Page.
- [x] Reset/Delete chat functions di header.
- [ ] Desain dan implementasi komponen Memory Bank (lanjutan).
- [ ] Konfigurasi ESLint untuk linting TypeScript.

### Prioritas Menengah
- [x] Character Persona CRUD API (`/character_personas`, `/character/{id}`).
- [x] Character Chat dengan roleplay context dan side panel.
- [x] Conversation history context (recent 6 messages) untuk LLM.
- [x] Character Detail Page dengan About & Chat Starters.
- [ ] Long-term Memory System (lihat PLAN_CharacterRoleplay.md).
- [ ] Scene System untuk setting percakapan.
- [ ] Tambahkan dokumentasi untuk pengembang.
- [ ] Pengujian unit untuk komponen utama.

### Prioritas Rendah
- [ ] Character stats (interaction_count, likes) di backend.
- [ ] Voice selection integration.
- [ ] Avatar system dengan expressions.
- [ ] Relationship progression system.
- [ ] Optimasi performa aplikasi.
- [ ] Tambahkan fitur tambahan berdasarkan masukan pengguna.