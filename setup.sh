#!/bin/bash

# SnapStock Setup Script
echo "🚀 SnapStock Setup Script"
echo "========================="
echo ""

# Check for required tools
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
echo "✅ Node.js $(node -v)"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop first."
    exit 1
fi
echo "✅ Docker $(docker -v)"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ .env.local created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env.local and add your API keys:"
    echo "   1. OpenAI API Key (required)"
    echo "   2. Resend API Key (required)"
    echo "   3. Stripe keys (optional for payments)"
    echo ""
    echo "Press Enter to continue after adding your keys..."
    read
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Start database
echo ""
echo "🐘 Starting PostgreSQL database..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Setup database
echo ""
echo "🗄️ Setting up database..."
npm run db:generate
npm run db:push

echo ""
echo "✨ Setup complete!"
echo ""
echo "To start the application, run:"
echo "  npm run dev"
echo ""
echo "The app will be available at http://localhost:3000"
echo ""
echo "📚 For detailed setup instructions, see README.md"