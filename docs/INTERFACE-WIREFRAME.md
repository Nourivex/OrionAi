# INTERFACE-WIREFRAME.md

## Konsep Desain

Menggunakan layout Split View: Sidebar di kiri untuk navigasi/history, dan area utama di kanan untuk konten dinamis (Chat/Memory/Settings).

### 1. Main Interface (Chat Mode - Default)

Fokus: Langsung bisa ngobrol dengan Ollama dan melihat status model.

```
+-----------------------------------------------------------------------+
|  [Sidebar Nav]      |  [Main Content: Chat Area]                      |
|                     |                                                 |
|  [+] New Chat       |  Header: [ Model: Llama-3.2 v ] [ 🟢 Online ]   |
|                     | +---------------------------------------------+ |
|  HISTORY            | |                                             | |
|  - Projek Orion     | |  [OrionAI]: Halo Lycus, ada yang bisa       | |
|  - Resep Nasi G     | |  saya bantu terkait koding hari ini?        | |
|  - Debug Server     | |                                             | |
|                     | |                                             | |
|                     | |                                             | |
|  MENU               | |                                             | |
|  [📂 Memory Bank]   | |                                             | |
|  [⚙️ Settings]      | +---------------------------------------------+ |
|                     | +---------------------------------------------+ |
|                     | | [📎] Ketik pesan kamu di sini...        [➤] | |
|                     | +---------------------------------------------+ |
+---------------------+-------------------------------------------------+
```

**Perubahan & Peningkatan:**

- **Model Selector**: Dropdown di header untuk ganti model Ollama dengan cepat (misal: dari Llama ke Mistral).
- **Chat History**: Sidebar kiri menampilkan riwayat chat agar mudah diakses kembali.
- **Input Area**: Kolom input yang selalu terlihat di bawah, lengkap dengan tombol attachment (untuk RAG file upload).

### 2. Memory Bank Interface (RAG Management)

Fokus: Mengelola dokumen/data yang "diingat" oleh OrionAi. Bukan sekadar list, tapi manajemen knowledge.

```
+-----------------------------------------------------------------------+
|  [Sidebar Nav]      |  [Main Content: Memory Bank]                    |
|                     |                                                 |
|  [< Back to Chat]   |  Header: Knowledge Base Management              |
|                     |                                                 |
|  COLLECTIONS        |  [ 🔍 Cari Dokumen/Snippet...               ]   |
|  - Coding Docs      |                                                 |
|  - Personal Note    |  +-------------------------------------------+  |
|  - Uni Archive      |  | [ + Add Source ]  [ ↻ Re-Index ]          |  |
|                     |  +-------------------------------------------+  |
|                     |                                                 |
|                     |  List of Memories:                              |
|                     |  +-------------------------------------------+  |
|                     |  | 📄 API_Docs.md            | [Ready]  [🗑️] |  |
|                     |  | 🌐 react-docs-v18         | [Ready]  [🗑️] |  |
|                     |  | 💬 Chat_Session_2910      | [Ready]  [🗑️] |  |
|                     |  +-------------------------------------------+  |
|                     |                                                 |
|                     |  Stats: 14 Docs | 2048 Vectors Stored           |
+---------------------+-------------------------------------------------+
```

**Perubahan & Peningkatan:**

- **Collections/Tags**: Mengelompokkan memori agar RAG lebih akurat (misal: saat ngoding, hanya panggil memori "Coding Docs").
- **Status Indikator**: Menampilkan status apakah dokumen sudah di-index ke Vector DB atau belum.
- **Action Buttons**: Tombol jelas untuk menambah sumber data (File/Folder/URL) dan Re-Index.

### 3. Settings Interface (Konfigurasi)

Fokus: Pengaturan teknis koneksi ke Ollama.

```
+-----------------------------------------------------------------------+
|  [Sidebar Nav]      |  [Main Content: Settings]                       |
|                     |                                                 |
|  [< Back to Chat]   |  Header: Configuration                          |
|                     |                                                 |
|                     |  ### Ollama Connection                          |
|                     |  Endpoint: [ http://localhost:11434       ]     |
|                     |  Status: 🟢 Connected                           |
|                     |                                                 |
|                     |  ### Model Parameters                           |
|                     |  Temperature: [ 0.7 ] (Creative vs Precise)     |
|                     |  Context Window: [ 4096 ] tokens                |
|                     |                                                 |
|                     |  ### System Prompt                              |
|                     |  [ You are OrionAi, a helpful assistant...    ] |
|                     |                                                 |
|                     |         [ Save Changes ]  [ Reset ]             |
+---------------------+-------------------------------------------------+
```

**Saran Implementasi:**
- Tambahkan validasi input untuk parameter model.
- Pastikan koneksi ke endpoint Ollama stabil sebelum menyimpan perubahan.