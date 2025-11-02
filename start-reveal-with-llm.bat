@echo off
REM Smart Reveal.js + LLM Runner Startup Script
REM Double-click this file to start both servers automatically

echo.
echo ============================================================
echo   Reveal.js + LLM Runner Smart Startup
echo ============================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found. Please install Node.js first.
    echo         Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Python not found. LLM Runner will not work.
    echo           Install Python from: https://www.python.org/
    echo.
    echo Continuing with Reveal.js only...
    timeout /t 3 >nul
)

echo Starting servers...
echo.

REM Run the smart startup script
call npm run start:llm

pause
