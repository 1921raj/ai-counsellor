#!/bin/bash
set -e

echo "🚀 Starting AI Counsellor Backend..."

# Debug: Check critical environment variables
if [ -z "$GEMINI_API_KEY" ]; then
    echo "❌ ERROR: GEMINI_API_KEY is not set!"
else
    echo "✅ GEMINI_API_KEY is set."
fi

if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  WARNING: DATABASE_URL is not set. The app will fallback to SQLite."
else
    echo "✅ DATABASE_URL is found (length: ${#DATABASE_URL})."
fi

# Run database migrations (if using alembic, which requirements.txt has)
# echo "🔄 Running database migrations..."
# alembic upgrade head

# Start the application
echo "⚡ Starting Uvicorn server on port ${PORT:-8000}..."
exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
