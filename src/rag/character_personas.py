# character_personas.py - Model & DB logic untuk Character Personas (Roleplay)
from ..core.config import get_db_connection
from typing import List, Dict, Any, Optional
import json


def init_character_personas_table():
    """Buat tabel character_personas jika belum ada."""
    conn = get_db_connection()
    conn.execute('''
    CREATE TABLE IF NOT EXISTS character_personas (
        character_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        user_relationship TEXT NOT NULL,
        character_role TEXT NOT NULL,
        user_persona_nickname TEXT,
        greeting TEXT,
        short_description TEXT,
        voice_id TEXT,
        visibility TEXT DEFAULT 'private',
        category TEXT DEFAULT 'general',
        tags TEXT,
        definition TEXT,
        is_active INTEGER DEFAULT 0
    )
    ''')
    conn.commit()
    conn.close()


def get_all_character_personas() -> List[Dict[str, Any]]:
    """Ambil semua character personas."""
    conn = get_db_connection()
    rows = conn.execute('SELECT * FROM character_personas ORDER BY name ASC').fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        d['tags'] = json.loads(d.get('tags') or '[]')
        d['isActive'] = bool(d.pop('is_active', 0))
        result.append(d)
    return result


def get_character_persona(character_id: str) -> Optional[Dict[str, Any]]:
    """Ambil satu character persona berdasarkan character_id (UUID)."""
    conn = get_db_connection()
    row = conn.execute('SELECT * FROM character_personas WHERE character_id = ?', (character_id,)).fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    d['tags'] = json.loads(d.get('tags') or '[]')
    d['isActive'] = bool(d.pop('is_active', 0))
    return d


def update_character_persona(character_id: str, **kwargs) -> bool:
    """Update character persona berdasarkan character_id."""
    allowed = ['name', 'user_relationship', 'character_role', 'user_persona_nickname', 
               'greeting', 'short_description', 'voice_id', 'visibility', 'category', 
               'tags', 'definition', 'is_active']
    fields = []
    values = []
    for k, v in kwargs.items():
        if k == 'isActive':
            fields.append('is_active = ?')
            values.append(1 if v else 0)
        elif k == 'tags' and isinstance(v, list):
            fields.append('tags = ?')
            values.append(json.dumps(v))
        elif k in allowed and v is not None:
            fields.append(f"{k} = ?")
            values.append(v)
    if not fields:
        return False
    values.append(character_id)
    conn = get_db_connection()
    conn.execute(f"UPDATE character_personas SET {', '.join(fields)} WHERE character_id = ?", values)
    conn.commit()
    conn.close()
    return True


def set_active_character_persona(character_id: str) -> bool:
    """Set character persona aktif (nonaktifkan yang lain)."""
    conn = get_db_connection()
    conn.execute('UPDATE character_personas SET is_active = 0')
    conn.execute('UPDATE character_personas SET is_active = 1 WHERE character_id = ?', (character_id,))
    conn.commit()
    conn.close()
    return True


def delete_character_persona(character_id: str) -> bool:
    """Hapus character persona berdasarkan character_id."""
    conn = get_db_connection()
    conn.execute('DELETE FROM character_personas WHERE character_id = ?', (character_id,))
    conn.commit()
    conn.close()
    return True
