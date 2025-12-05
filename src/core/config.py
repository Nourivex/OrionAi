# config.py - konfigurasi dan koneksi database
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent.parent.parent / 'orion_ai.db'

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn
