#!/bin/bash

# Smart Reveal.js + LLM Runner Startup Script
# Run this script to start both servers automatically

echo ""
echo "============================================================"
echo "  Reveal.js + LLM Runner Smart Startup"
echo "============================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js not found. Please install Node.js first."
    echo "        Download from: https://nodejs.org/"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "[WARNING] Python not found. LLM Runner will not work."
    echo "          Install Python from: https://www.python.org/"
    echo ""
    echo "Continuing with Reveal.js only..."
    sleep 2
fi

echo "Starting servers..."
echo ""

# Run the smart startup script
npm run start:llm
