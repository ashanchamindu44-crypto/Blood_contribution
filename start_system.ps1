# One-Click Professional System Launcher for Blood Donation System
$repoDir = $PSScriptRoot

Write-Host "=========================================================" -ForegroundColor Red
Write-Host "   🩸 BLOOD DONATION SYSTEM - SYSTEM LAUNCHER 🩸" -ForegroundColor Yellow
Write-Host "=========================================================" -ForegroundColor Red

# 1. Start Frontend
Write-Host "[1/2] Starting React Frontend Web Application..." -ForegroundColor Cyan
$frontendDir = Join-Path $repoDir "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendDir'; npm run dev" -WindowStyle Normal

# 2. Wait and Open Browser
Write-Host "[2/2] Opening Application Dashboard..." -ForegroundColor Green
Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"

Write-Host "`nSystem successfully launched!" -ForegroundColor Green
Write-Host "Frontend Dashboard: http://localhost:5173" -ForegroundColor Yellow
Write-Host "Gateway API:        http://localhost:8080" -ForegroundColor Yellow
Write-Host "MongoDB Server:     mongodb://localhost:27017" -ForegroundColor Yellow
