# characters.py - Model & DB logic untuk Characters (AI persona characters)
from ..core.config import get_db_connection
from typing import List, Dict, Any, Optional

def init_characters_table():
    """Buat tabel characters jika belum ada."""
    conn = get_db_connection()
    conn.execute('''
    CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT,
        is_active INTEGER DEFAULT 0,
        avatar_gradient TEXT
    )
    ''')
    conn.commit()
    conn.close()

def get_all_characters() -> List[Dict[str, Any]]:
    """Ambil semua characters."""
    conn = get_db_connection()
    rows = conn.execute('SELECT * FROM characters ORDER BY id ASC').fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        d['isActive'] = bool(d.pop('is_active', 0))
        d['avatarGradient'] = d.pop('avatar_gradient', '')
        result.append(d)
    return result

def get_character(char_id: int) -> Optional[Dict[str, Any]]:
    """Ambil satu character berdasarkan id."""
    conn = get_db_connection()
    row = conn.execute('SELECT * FROM characters WHERE id = ?', (char_id,)).fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    d['isActive'] = bool(d.pop('is_active', 0))
    d['avatarGradient'] = d.pop('avatar_gradient', '')
    return d

def create_character(name: str, role: str = "", is_active: int = 0, avatar_gradient: str = "") -> int:
    """Buat character baru."""
    conn = get_db_connection()
    cur = conn.execute(
        'INSERT INTO characters (name, role, is_active, avatar_gradient) VALUES (?, ?, ?, ?)',
        (name, role, is_active, avatar_gradient)
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return new_id

def update_character(char_id: int, **kwargs) -> bool:
    """Update character berdasarkan id."""
    allowed = ['name', 'role', 'is_active', 'avatar_gradient']
    fields = []
    values = []
    for k, v in kwargs.items():
        if k == 'isActive':
            fields.append('is_active = ?')
            values.append(1 if v else 0)
        elif k == 'avatarGradient':
            fields.append('avatar_gradient = ?')
            values.append(v)
        elif k in allowed and v is not None:
            fields.append(f"{k} = ?")
            values.append(v)
    if not fields:
        return False
    values.append(char_id)
    conn = get_db_connection()
    conn.execute(f"UPDATE characters SET {', '.join(fields)} WHERE id = ?", values)
    conn.commit()
    conn.close()
    return True

def set_active_character(char_id: int) -> bool:
    """Set character aktif (nonaktifkan yang lain)."""
    conn = get_db_connection()
    conn.execute('UPDATE characters SET is_active = 0')
    conn.execute('UPDATE characters SET is_active = 1 WHERE id = ?', (char_id,))
    conn.commit()
    conn.close()
    return True

def delete_character(char_id: int) -> bool:
    """Hapus character berdasarkan id."""
    conn = get_db_connection()
    conn.execute('DELETE FROM characters WHERE id = ?', (char_id,))
    conn.commit()
    conn.close()
    return True
