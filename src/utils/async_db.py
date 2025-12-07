import logging
import os
import asyncio

def async_db(fn, *args, **kwargs):
    LOG_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../logs'))
    os.makedirs(LOG_DIR, exist_ok=True)
    LOG_FILE = os.path.join(LOG_DIR, 'error.log')
    logging.basicConfig(
        level=logging.ERROR,
        format='%(asctime)s %(levelname)s %(name)s %(message)s',
        handlers=[logging.FileHandler(LOG_FILE, encoding='utf-8'), logging.StreamHandler()]
    )
    logger = logging.getLogger('orionai')
    """Jalankan fungsi DB blocking di threadpool agar tidak block event loop."""
    return asyncio.to_thread(fn, *args, **kwargs)
