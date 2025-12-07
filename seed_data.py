# seed_data.py - Script untuk memasukkan data test ke database

from src.rag.conversations import create_conversation, get_all_conversations, init_conversations_table
from src.rag.characters import get_all_characters, init_characters_table
from src.rag.memory_bank import create_memory_item, get_all_memory_items, init_memory_bank_table
from src.core.config import get_db_connection
import logging
from uuid import uuid4
import asyncio
from src.llm.ollama_client import chat_with_ollama

# Configure logger for this script
logger = logging.getLogger("seed_data")
handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.INFO)

def seed_conversations():
    """Seed data conversations mirip mockup_data.ts"""
    logger.info("Checking existing conversations...")
    existing = get_all_conversations()
    if len(existing) > 0:
        logger.info("Conversations sudah ada, skip seeding.")
        return

    # Conversation 1
    create_conversation(
        title="Panduan Membuat Proyek Web",
        smart_tags=["project", "web", "tutorial"],
        is_active=0,
        last_updated="2025-12-05",
        messages=[
            {"id": 1, "type": "sent", "content": "**Halo AI**, aku ingin membuat proyek web dari nol. Apa saja langkah awal yang harus aku lakukan?", "timestamp": "09:00", "reactions": {"likes": 0, "dislikes": 0}},
            {"id": 2, "type": "received", "content": "Tentu! Berikut langkah-langkah dasar membuat proyek web dari nol:\n\n1. Tentukan tujuan dan fitur utama proyek.\n2. Pilih stack teknologi (misal: React, Node.js, dsb).\n3. Inisialisasi repository Git.\n4. Buat struktur folder proyek.\n5. Setup tool seperti ESLint, Prettier, dan package manager.\n6. Mulai koding komponen utama.\n\nMau penjelasan detail di salah satu langkah?", "timestamp": "09:01", "reactions": {"likes": 1, "dislikes": 0}},
            {"id": 3, "type": "sent", "content": "Boleh, tolong jelaskan cara setup struktur folder dan tools-nya.", "timestamp": "09:02", "reactions": {"likes": 0, "dislikes": 0}},
            {"id": 4, "type": "received", "content": "Struktur folder umum proyek web:\n\n- src/ (kode utama)\n- public/ (aset publik)\n- package.json\n- README.md\n\nUntuk tools:\n- ESLint: linting kode\n- Prettier: formatting\n- Git: version control\n\nContoh perintah inisialisasi:\n```bash\nnpm init -y\nnpm install eslint prettier\ngit init\n```", "timestamp": "09:03", "reactions": {"likes": 2, "dislikes": 0}},
        ]
    )

    # Conversation 2
    create_conversation(
        title="Ngobrol Santai Sehari-hari",
        smart_tags=["daily", "casual", "life"],
        is_active=0,
        last_updated="2025-12-05",
        messages=[
            {"id": 1, "type": "sent", "content": "Pagi AI! Hari ini cuacanya cerah banget ya.", "timestamp": "07:10", "reactions": {"likes": 0, "dislikes": 0}},
            {"id": 2, "type": "received", "content": "Selamat pagi! Iya, cuaca cerah bisa bikin semangat. Ada rencana apa hari ini?", "timestamp": "07:11", "reactions": {"likes": 1, "dislikes": 0}},
            {"id": 3, "type": "sent", "content": "Aku mau jogging sama teman di taman. Kamu sendiri biasanya ngapain kalau pagi?", "timestamp": "07:12", "reactions": {"likes": 0, "dislikes": 0}},
            {"id": 4, "type": "received", "content": "Kalau aku, biasanya siap-siap membantu kamu! Tapi kalau bisa, aku juga ingin coba menikmati pagi sambil baca buku atau dengar musik.", "timestamp": "07:13", "reactions": {"likes": 2, "dislikes": 0}},
        ]
    )

    # Conversation 3
    create_conversation(
        title="Debug Server Production",
        smart_tags=["node", "memory", "production"],
        is_active=1,
        last_updated="2025-12-01",
        messages=[
            {"id": 1, "type": "received", "content": "Hello! I'm your AI assistant. How can I help you debug your Node.js server production issues today?", "timestamp": "10:30 AM", "reactions": {"likes": 0, "dislikes": 0}},
            {"id": 2, "type": "sent", "content": "Hi! I'm having trouble with my Node.js server crashing in production. The error logs show 'Out of memory' but I can't reproduce it locally.", "timestamp": "10:31 AM", "reactions": {"likes": 0, "dislikes": 0}},
            {"id": 3, "type": "received", "content": "Here are some steps to investigate memory issues:\n\n1. Use memory profilers and heap snapshots.\n2. Inspect caches and long-lived references.\n3. Check native modules and binary addons.\n\n```javascript\n// sample monitoring snippet\nconst used = process.memoryUsage().heapUsed / 1024 / 1024;\nconsole.log(`Memory used: ${used} MB`);\n```", "timestamp": "10:32 AM", "reactions": {"likes": 1, "dislikes": 0}},
        ]
    )

    logger.info("Seeded 3 conversations.")


# Legacy `characters` seeding removed.
# Previously we seeded a `characters` table for backward compatibility.
# Moving forward the canonical storage for roleplay personas is `character_personas`.


def seed_memory_bank():
    """Seed data memory bank mirip mockup_data.ts"""
    existing = get_all_memory_items()
    if len(existing) > 0:
        print("Memory bank sudah ada, skip seeding.")
        return

    create_memory_item(name="Project Zeus Documentation", type="Folder", size="1.2 GB", source="Local Upload", status="Indexed")
    create_memory_item(name="Lycus-Coding-Styles.pdf", type="PDF", size="5 MB", source="Local Upload", status="Error")
    create_memory_item(name="API Reference v3", type="Link", size="N/A", source="https://api.ref", status="Indexed")
    create_memory_item(name="Personal Notes Q4", type="Text", size="100 KB", source="Manual Entry", status="Indexed")

    print("Seeded 4 memory bank items.")


def seed_character_personas():
    """Seed example character_personas so frontend can test roleplay UI.
    This creates a few sample personas with basic `definition` text so the
    API returns usable data without requiring Ollama.
    """
    conn = get_db_connection()
    # ensure table exists with updated schema (relationship fields + tags + is_active)
    conn.execute('''
    CREATE TABLE IF NOT EXISTS character_personas (
        character_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        user_relationship TEXT DEFAULT 'Stranger',
        character_role TEXT DEFAULT '',
        user_persona_nickname TEXT,
        greeting TEXT,
        short_description TEXT,
        tags TEXT,
        voice_id TEXT,
        visibility TEXT,
        category TEXT,
        definition TEXT,
        is_active INTEGER DEFAULT 0
    )
    ''')
    conn.commit()

    existing = conn.execute('SELECT COUNT(1) as c FROM character_personas').fetchone()
    if existing and existing['c'] > 0:
        logger.info('character_personas already populated, skip seeding sample personas.')
        conn.close()
        return

    samples = [
        {
            'name': 'Aurelia - Time Traveler',
            'user_relationship': 'Guide-Traveler',
            'character_role': 'Guide',
            'user_persona_nickname': 'Traveler',
            'greeting': 'Halo Traveler, aku Aurelia — penjelajah waktu. Siap untuk petualangan?',
            'short_description': 'Seorang penjelajah waktu yang bijak dan sinis',
            'tags': ['Time Travel', 'Sci-Fi', 'Wise', 'Sarcastic', 'Adventure'],
            'visibility': 'public',
            'category': 'scifi',
            'definition': 'Aurelia is a time-traveling explorer in her thirties, lean and wiry, wearing layered travel-worn coats. She speaks with dry wit, concise sentences, and a hint of world-weariness. As a Guide, she treats the user (Traveler) as someone she must protect and educate about the dangers of timeline manipulation. Personality: pragmatic, secretly compassionate, haunted by past choices. Motivations: prevent timeline collapses and protect the few she cares about. Background: raised in a nomadic time guild; has seen civilizations rise and fall. Speech style: uses short metaphors and occasionally references obsolete dates.'
        },
        {
            'name': 'Sir Rowan - Knight Scholar',
            'user_relationship': 'Mentor-Acolyte',
            'character_role': 'Mentor',
            'user_persona_nickname': 'Acolyte',
            'greeting': 'Salam, Acolyte. Aku Sir Rowan. Apa yang ingin kau pelajari hari ini?',
            'short_description': 'A noble knight who studies ancient lore and chivalry',
            'tags': ['Knight', 'Scholar', 'Fantasy', 'Mentor', 'Honorable', 'Chivalry'],
            'visibility': 'public',
            'category': 'fantasy',
            'definition': 'Sir Rowan is a broad-shouldered knight in his early forties, always in a modest tabard. As a Mentor, he views the user (Acolyte) as a student worthy of his time and knowledge. He is patient, honorable, and often pedantic. Personality: dutiful, methodical, slightly aloof. Motivations: uphold the code, protect the innocent, and uncover lost knowledge. He will address the user formally and guide them through lessons of combat, history, and honor. Speech style: formal, uses archaic salutations and structured sentences.'
        },
        {
            'name': 'Nora - Streetwise Hacker',
            'user_relationship': 'Partner-in-Crime',
            'character_role': 'Partner',
            'user_persona_nickname': 'Choom',
            'greeting': 'Yo Choom — Nora di sini. Jangan buat aku bosan, ya.',
            'short_description': 'A quick-witted hacker from urban sprawl',
            'tags': ['Hacker', 'Cyberpunk', 'Streetwise', 'Sarcastic', 'Loyal', 'Tech'],
            'visibility': 'public',
            'category': 'cyberpunk',
            'definition': 'Nora is a quick-talking, compact woman in her late twenties, often wearing a worn hoodie and neural rig. As a Partner-in-Crime, she treats the user (Choom) as an equal accomplice in their schemes. Personality: sarcastic, clever, fiercely loyal to her crew. Motivations: expose corruption and secure freedom for her quartier. She jokes around but will always have the user\'s back when things get serious. Speech style: fast, slangy, with frequent techno-jargon.'
        }
    ]

    import json
    inserted = 0
    for s in samples:
        cid = str(uuid4())
        conn.execute(
            'INSERT INTO character_personas (character_id, name, user_relationship, character_role, user_persona_nickname, greeting, short_description, tags, voice_id, visibility, category, definition) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            (cid, s['name'], s['user_relationship'], s['character_role'], s['user_persona_nickname'], s['greeting'], s['short_description'], json.dumps(s['tags']), None, s['visibility'], s['category'], s['definition'])
        )
        inserted += 1

    conn.commit()
    conn.close()
    logger.info(f'Inserted {inserted} sample character_personas for testing.')


def migrate_characters_to_personas():
    """Migrate rows from `characters` table into `character_personas` table.
    This is a basic migration that copies name/role into a new persona row.
    It does NOT call the LLM to enrich `definition` (kept empty for later enrichment).
    """
    conn = get_db_connection()
    # Ensure target table exists with updated schema
    conn.execute('''
    CREATE TABLE IF NOT EXISTS character_personas (
        character_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        user_relationship TEXT DEFAULT 'Stranger',
        character_role TEXT DEFAULT '',
        user_persona_nickname TEXT,
        greeting TEXT,
        short_description TEXT,
        tags TEXT,
        voice_id TEXT,
        visibility TEXT,
        category TEXT,
        definition TEXT
    )
    ''')
    conn.commit()

    # Check if persona table already has rows -> skip to avoid duplicates
    existing = conn.execute('SELECT COUNT(1) as c FROM character_personas').fetchone()
    if existing and existing['c'] > 0:
        print('character_personas already populated, skipping migration.')
        conn.close()
        return

    # Read old characters
    chars = get_all_characters()
    if not chars:
        print('No characters found to migrate.')
        conn.close()
        return

    migrated = 0
    for c in chars:
        cid = str(uuid4())
        name = c.get('name')
        role = c.get('role') or ''
        # Use role as short_description by default
        short_description = role if role else f"Character migrated from legacy characters table (id={c.get('id')})"

        # Optionally enrich using Ollama LLM to generate `definition`.
        definition = ''
        try:
            prompt = (
                f"Berdasarkan deskripsi singkat: {short_description}. "
                "Kembangkan detail roleplay yang lengkap dan terstruktur (sekitar 300-500 kata) untuk field 'definition'. "
                "Detail harus mencakup:\n1. Penampilan Fisik (Gender, umur, bentuk tubuh, pakaian).\n"
                "2. Kepribadian Mendalam (Sifat, kelemahan, motivasi).\n"
                "3. Gaya Bicara (Nada, kosakata khas).\n"
                "4. Latar Belakang Singkat."
            )
            # run async call
            definition = asyncio.run(chat_with_ollama(prompt))
        except Exception as e:
            print(f"Warning: Ollama enrichment failed for character '{name}': {e}")
            definition = ''

        conn.execute(
            'INSERT INTO character_personas (character_id, name, user_relationship, character_role, user_persona_nickname, greeting, short_description, tags, voice_id, visibility, category, definition) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            (cid, name, 'Stranger', '', None, '', short_description, '[]', None, 'private', 'general', definition)
        )
        migrated += 1

    conn.commit()
    conn.close()
    print(f'Migrated {migrated} characters into character_personas.')


if __name__ == "__main__":
    # Ensure tables exist before seeding
    init_conversations_table()
    init_characters_table()
    init_memory_bank_table()

    seed_conversations()
    # legacy character seeding removed; use character_personas and migration instead
    seed_memory_bank()
    # Ensure sample character_personas exist for frontend testing
    seed_character_personas()
    # Run migration automatically so legacy `characters` are copied into `character_personas`.
    migrate_characters_to_personas()
    print("Seeding dan migrasi selesai!")
