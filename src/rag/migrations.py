# migrations.py - Inisialisasi tabel baru untuk fitur roleplay advanced
from ..core.config import get_db_connection

def init_character_memories_table():
    conn = get_db_connection()
    conn.execute('''
    CREATE TABLE IF NOT EXISTS character_memories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id TEXT NOT NULL,
        memory_type TEXT NOT NULL,  -- 'fact', 'experience', 'preference'
        content TEXT NOT NULL,
        importance INTEGER DEFAULT 5,
        created_at TEXT,
        last_referenced TEXT,
        FOREIGN KEY (character_id) REFERENCES character_personas(character_id)
    )
    ''')
    conn.commit()
    conn.close()

def init_scenes_table():
    conn = get_db_connection()
    conn.execute('''
    CREATE TABLE IF NOT EXISTS scenes (
        scene_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        location TEXT,
        time_of_day TEXT,
        weather TEXT,
        mood TEXT,
        background_url TEXT,
        is_custom INTEGER DEFAULT 0
    )
    ''')
    conn.commit()
    conn.close()

def init_conversation_scenes_table():
    conn = get_db_connection()
    conn.execute('''
    CREATE TABLE IF NOT EXISTS conversation_scenes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        character_id TEXT NOT NULL,
        scene_id TEXT,
        activated_at TEXT,
        FOREIGN KEY (character_id) REFERENCES character_personas(character_id),
        FOREIGN KEY (scene_id) REFERENCES scenes(scene_id)
    )
    ''')
    conn.commit()
    conn.close()

def init_character_relationships_table():
    conn = get_db_connection()
    conn.execute('''
    CREATE TABLE IF NOT EXISTS character_relationships (
        character_id TEXT PRIMARY KEY,
        level INTEGER DEFAULT 1,
        stage TEXT DEFAULT 'stranger',
        affection INTEGER DEFAULT 0,
        trust INTEGER DEFAULT 0,
        interactions INTEGER DEFAULT 0,
        first_met TEXT,
        FOREIGN KEY (character_id) REFERENCES character_personas(character_id)
    )
    ''')
    conn.commit()
    conn.close()
