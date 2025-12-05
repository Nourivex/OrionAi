# memory_bank.py - Model & DB logic untuk Memory Bank
from ..core.config import get_db_connection

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
