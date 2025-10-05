#!/bin/bash

echo "🚀 Starting AI Medicine News Reporter..."

# Kill any existing processes on ports 3000, 5000, 5001
echo "🔧 Cleaning up existing processes..."
pkill -f "node server" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true

# Start backend on port 5001
echo "📡 Starting backend server on port 5001..."
PORT=5001 node server/index.js &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🌐 Starting frontend on port 3000..."
cd client
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Application is starting!"
echo "📡 Backend API: http://localhost:5001"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait