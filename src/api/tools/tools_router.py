# tools_router.py - endpoint tools untuk OrionAi
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import datetime
import subprocess
import platform

router = APIRouter(prefix="/api/tools", tags=["tools"])

# Endpoint: GET /api/tools/datetime
@router.get("/datetime")
def get_datetime():
    now = datetime.datetime.now()
    return {"datetime": now.isoformat(), "message": f"Waktu server: {now.strftime('%Y-%m-%d %H:%M:%S')}"}

# Model untuk open_app
class OpenAppRequest(BaseModel):
    app_name: str
    confirm: bool = False

# Whitelist aplikasi yang boleh dibuka
ALLOWED_APPS = {
    "notepad": {
        "windows": "notepad.exe",
        "linux": "gedit",
        "darwin": "TextEdit"
    }
}

# Endpoint: POST /api/tools/open_app
@router.post("/open_app")
def open_app(req: OpenAppRequest):
    app = req.app_name.lower()
    sys = platform.system().lower()
    exe = ALLOWED_APPS.get(app, {}).get(sys)
    if not exe:
        return JSONResponse(status_code=400, content={"success": False, "message": f"Aplikasi '{app}' tidak diizinkan atau tidak ditemukan."})
    if not req.confirm:
        return {"action_required": True, "message": f"Buka aplikasi '{app}'?", "app_name": app}
    try:
        subprocess.Popen([exe])
        return {"success": True, "message": f"Aplikasi '{app}' berhasil dibuka."}
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "message": f"Gagal membuka aplikasi: {str(e)}"})
