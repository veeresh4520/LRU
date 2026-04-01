#!/bin/bash

echo "========================================"
echo "  LRU Cache Search Engine"
echo "========================================"
echo ""

if [ ! -f ".env" ]; then
    echo "ERROR: .env file not found!"
    echo "Please create .env file with your GROQ_API_KEY"
    exit 1
fi

if ! grep -q "GROQ_API_KEY=" .env || grep -q "your_groq_api_key_here" .env; then
    echo "WARNING: GROQ_API_KEY not configured in .env"
    echo "AI features will not work without a valid Groq API key"
    echo ""
    echo "Get your key from: https://console.groq.com"
    echo ""
fi

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd client && npm install --legacy-peer-deps && cd ..
fi

if [ ! -d "client/dist" ]; then
    echo "Building frontend..."
    cd client && npm run build && cd ..
fi

echo ""
echo "Starting server..."
echo "Access the application at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

node server.js
