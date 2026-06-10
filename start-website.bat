@echo off
chcp 65001 >nul
title Cheef Mohamed Shaban - Website
cd /d "%~dp0"

echo.
echo  ========================================
echo   Cheef Mohamed Shaban - تشغيل الموقع
echo  ========================================
echo.

:: Stop old Node processes on port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
  taskkill /F /PID %%a >nul 2>&1
)

echo [1/2] Building website...
call npm run build
if errorlevel 1 (
  echo.
  echo  ERROR: Build failed. Check errors above.
  pause
  exit /b 1
)

echo.
echo [2/2] Starting website on http://localhost:3000
echo.
echo  Keep this window open while using the site.
echo  Press Ctrl+C to stop.
echo.

call npm run start -- -p 3000

pause
