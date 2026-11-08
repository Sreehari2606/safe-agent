@echo off
echo Starting SafeRoute Backend (FastAPI)...
cd /d "%~dp0backend"
start "SafeRoute Backend" python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
echo.
echo Backend starting on http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
timeout /t 3 >nul
echo Starting SafeRoute Frontend (Vite)...
cd /d "%~dp0frontend"
start "SafeRoute Frontend" npm run dev
echo.
echo Frontend starting on http://localhost:3737
echo.
echo Both servers starting. Open http://localhost:3737 in your browser.
pause

