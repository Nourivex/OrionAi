@echo off
REM OrionAi Dev Runner with .env support

REM Default values
setlocal enabledelayedexpansion
set BACKEND_PORT=1810
set FRONTEND_PORT=1012

REM Load .env from root if exists
if exist "%~dp0..\..\.env" (
  for /f "usebackq tokens=1,2 delims==" %%A in ("%~dp0..\..\.env") do (
    if "%%A"=="BACKEND_PORT" set BACKEND_PORT=%%B
    if "%%A"=="FRONTEND_PORT" set FRONTEND_PORT=%%B
  )
)

REM Start backend (FastAPI) on BACKEND_PORT
start "OrionAi Backend" cmd /k "cd /d %~dp0..\\backend && uvicorn main:app --reload --port !BACKEND_PORT!"

REM Start frontend (Vite) on FRONTEND_PORT
start "OrionAi Interface" cmd /k "cd /d %~dp0..\\interface && npm run dev -- --port !FRONTEND_PORT!"

echo Both backend (port !BACKEND_PORT!) and interface (port !FRONTEND_PORT!) are starting in separate terminals.
pause