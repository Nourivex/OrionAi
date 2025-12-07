# config.py - konfigurasi dan koneksi database

import sqlite3
from pathlib import Path
import os

DB_PATH = Path(os.environ.get('ORIONAI_DB_PATH', Path(__file__).parent.parent.parent / 'orion_ai.db'))
OLLAMA_BASE_URL = os.environ.get('OLLAMA_BASE_URL', 'http://localhost:11434')

# Directory to store generated novels
NOVEL_STORAGE_DIR = Path(__file__).parent.parent.parent / 'novels'

def ensure_novel_storage():
    try:
        NOVEL_STORAGE_DIR.mkdir(parents=True, exist_ok=True)
    except Exception:
        pass

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn
