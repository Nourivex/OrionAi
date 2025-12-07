# memory_bank.py - Model & DB logic untuk Memory Bank
from ..core.config import get_db_connection
from typing import List, Dict, Any, Optional

def init_memory_bank_table():
    conn = get_db_connection()
    conn.execute('''
    CREATE TABLE IF NOT EXISTS memory_bank (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        type TEXT,
        size TEXT,
        source TEXT,
        status TEXT
    )
    ''')
    conn.commit()
    conn.close()

def get_all_memory_items() -> List[Dict[str, Any]]:
    """Ambil semua item memory bank."""
    conn = get_db_connection()
    rows = conn.execute('SELECT * FROM memory_bank ORDER BY id DESC').fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_memory_item(item_id: int) -> Optional[Dict[str, Any]]:
    """Ambil satu item berdasarkan id."""
    conn = get_db_connection()
    row = conn.execute('SELECT * FROM memory_bank WHERE id = ?', (item_id,)).fetchone()
    conn.close()
    return dict(row) if row else None

def create_memory_item(name: str, type: str, size: str, source: str, status: str = "Pending") -> int:
    """Buat item memory baru."""
    conn = get_db_connection()
    cur = conn.execute(
        'INSERT INTO memory_bank (name, type, size, source, status) VALUES (?, ?, ?, ?, ?)',
        (name, type, size, source, status)
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return new_id

def update_memory_item(item_id: int, **kwargs) -> bool:
    """Update item memory berdasarkan id."""
    allowed = ['name', 'type', 'size', 'source', 'status']
    fields = []
    values = []
    for k, v in kwargs.items():
        if k in allowed and v is not None:
            fields.append(f"{k} = ?")
            values.append(v)
    if not fields:
        return False
    values.append(item_id)
    conn = get_db_connection()
    conn.execute(f"UPDATE memory_bank SET {', '.join(fields)} WHERE id = ?", values)
    conn.commit()
    conn.close()
    return True

def delete_memory_item(item_id: int) -> bool:
    """Hapus item memory berdasarkan id."""
    conn = get_db_connection()
    conn.execute('DELETE FROM memory_bank WHERE id = ?', (item_id,))
    conn.commit()
    conn.close()
    return True
