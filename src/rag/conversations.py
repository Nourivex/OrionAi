# conversations.py - Model & DB logic untuk Conversations (history chat)
from ..core.config import get_db_connection
from typing import List, Dict, Any, Optional
import json

def init_conversations_table():
    """Buat tabel conversations jika belum ada."""
    conn = get_db_connection()
    conn.execute('''
    CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        smart_tags TEXT,
        is_active INTEGER DEFAULT 0,
        last_updated TEXT,
        messages TEXT
    )
    ''')
    conn.commit()
    conn.close()

def get_all_conversations() -> List[Dict[str, Any]]:
    """Ambil semua conversations."""
    conn = get_db_connection()
    rows = conn.execute('SELECT * FROM conversations ORDER BY id DESC').fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        d['smartTags'] = json.loads(d.get('smart_tags') or '[]')
        d['messages'] = json.loads(d.get('messages') or '[]')
        del d['smart_tags']
        result.append(d)
    return result

def get_conversation(conv_id: int) -> Optional[Dict[str, Any]]:
    """Ambil satu conversation berdasarkan id."""
    conn = get_db_connection()
    row = conn.execute('SELECT * FROM conversations WHERE id = ?', (conv_id,)).fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    d['smartTags'] = json.loads(d.get('smart_tags') or '[]')
    d['messages'] = json.loads(d.get('messages') or '[]')
    del d['smart_tags']
    return d

def create_conversation(title: str, smart_tags: List[str] = [], is_active: int = 0, last_updated: str = "", messages: List[Dict] = []) -> int:
    """Buat conversation baru."""
    conn = get_db_connection()
    cur = conn.execute(
        'INSERT INTO conversations (title, smart_tags, is_active, last_updated, messages) VALUES (?, ?, ?, ?, ?)',
        (title, json.dumps(smart_tags), is_active, last_updated, json.dumps(messages))
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return new_id

def update_conversation(conv_id: int, **kwargs) -> bool:
    """Update conversation berdasarkan id."""
    allowed = ['title', 'smart_tags', 'is_active', 'last_updated', 'messages']
    fields = []
    values = []
    for k, v in kwargs.items():
        if k == 'smartTags':
            fields.append('smart_tags = ?')
            values.append(json.dumps(v))
        elif k == 'messages':
            fields.append('messages = ?')
            values.append(json.dumps(v))
        elif k in allowed and v is not None:
            fields.append(f"{k} = ?")
            values.append(v)
    if not fields:
        return False
    values.append(conv_id)
    conn = get_db_connection()
    conn.execute(f"UPDATE conversations SET {', '.join(fields)} WHERE id = ?", values)
    conn.commit()
    conn.close()
    return True

def delete_conversation(conv_id: int) -> bool:
    """Hapus conversation berdasarkan id."""
    conn = get_db_connection()
    conn.execute('DELETE FROM conversations WHERE id = ?', (conv_id,))
    conn.commit()
    conn.close()
    return True

def add_message_to_conversation(conv_id: int, message: Dict) -> bool:
    """Tambah pesan ke conversation."""
    conv = get_conversation(conv_id)
    if not conv:
        return False
    msgs = conv.get('messages', [])
    msgs.append(message)
    return update_conversation(conv_id, messages=msgs)
