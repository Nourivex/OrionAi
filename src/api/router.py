

from src.utils.async_db import async_db






# =====================
# MAIN ROUTER AGGREGATOR
# =====================


# Health check endpoint
from fastapi import APIRouter
from .roleplay_router import router as roleplay_router
from .conversation_router import router as conversation_router
from .memory_router import router as memory_router

router = APIRouter()

# Custom root endpoint for backend info
from fastapi.responses import HTMLResponse

@router.get("/", include_in_schema=False)
async def root():
	return HTMLResponse(
		"""
		<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OrionAI Backend Service</title>
    <style>
        :root {
            --bg-color: #09090b;
            --card-bg: rgba(24, 24, 27, 0.6);
            --primary: #3b82f6;
            --primary-glow: #3b82f6aa;
            --accent: #8b5cf6;
            --text-main: #f4f4f5;
            --text-muted: #a1a1aa;
            --success: #10b981;
        }

        /* Reset & Base Typography - Pakai System Font biar offline & kenceng */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-color);
            background-image: 
                radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.08), transparent 25%),
                radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.08), transparent 25%);
            color: var(--text-main);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        /* Container Card dengan Glassmorphism */
        .container {
            position: relative;
            width: 100%;
            max-width: 480px;
            padding: 2.5rem;
            border-radius: 24px;
            background: var(--card-bg);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            text-align: center;
            animation: float 6s ease-in-out infinite;
        }

        /* Status Indicator */
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.2);
            border-radius: 9999px;
            font-size: 0.85rem;
            color: var(--success);
            font-weight: 600;
            margin-bottom: 1.5rem;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            background-color: var(--success);
            border-radius: 50%;
            box-shadow: 0 0 8px var(--success);
            animation: pulse 2s infinite;
        }

        /* Typography */
        h1 {
            font-size: 2rem;
            font-weight: 800;
            letter-spacing: -0.025em;
            margin-bottom: 0.5rem;
            background: linear-gradient(to right, #fff, #94a3b8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        p {
            color: var(--text-muted);
            line-height: 1.6;
            margin-bottom: 2rem;
            font-size: 1rem;
        }

        .highlight {
            color: var(--primary);
            font-weight: 500;
        }

        /* Call to Action Button */
        .btn-docs {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            color: white;
            padding: 14px 32px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
            border: 1px solid rgba(255,255,255,0.1);
        }

        .btn-docs:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
            filter: brightness(1.1);
        }

        /* Footer Info */
        .footer-info {
            margin-top: 2rem;
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.2);
            font-family: monospace;
        }

        /* Animations */
        @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
        }

        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }

        /* SVG Icons */
        svg { vertical-align: middle; }
    </style>
</head>
<body>

    <div class="container">
        <div class="status-badge">
            <span class="status-dot"></span>
            SYSTEM OPERATIONAL
        </div>

        <h1>OrionAI Backend</h1>
        <p>
            Gateway server is active and running.<br>
            Tidak ada antarmuka pengguna di endpoint ini.<br>
            Silakan akses dokumentasi untuk integrasi.
        </p>

        <a href="/docs" class="btn-docs">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            Buka Dokumentasi API
        </a>

        <div class="footer-info">
            ORION-AI-CORE v1.0.4 &bull; SECURE CONNECTION
        </div>
    </div>

</body>
</html>
		""",
		status_code=200
	)

@router.get(
	"/health",
	tags=["Health"],
	summary="Health Check",
	description="Cek status API dan daftar router yang tersedia. Endpoint ini mengembalikan status dan list router yang terdaftar di backend."
)
async def health_check():
	routers = [
		{"name": "Roleplay", "prefix": "/character, /character_personas"},
		{"name": "Conversation", "prefix": "/conversations, /chat"},
		{"name": "Memory", "prefix": "/memory"},
		{"name": "Tools", "prefix": "/tools/novel"}
	]
	return {
		"status": "ok",
		"routers": routers
	}


# Register subrouters
router.include_router(roleplay_router, tags=["Roleplay"])
router.include_router(conversation_router, tags=["Conversation"])
router.include_router(memory_router, tags=["Memory"])
from .tools.novel_router import router as novel_router
router.include_router(novel_router, tags=["Tools"])







# =====================
# CHAT ENDPOINT
# =====================




