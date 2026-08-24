@echo off
echo ========================================================
echo   Starting BloodLink System (Microservices + React)
echo ========================================================
echo.
echo [1/3] Starting Backend Microservices via Docker Compose...
docker-compose up -d
echo.
echo [2/3] Installing Frontend Dependencies...
cd frontend
call npm install
echo.
echo [3/3] Starting React Frontend...
echo The frontend will open in your browser shortly (http://localhost:5173).
call npm run dev
