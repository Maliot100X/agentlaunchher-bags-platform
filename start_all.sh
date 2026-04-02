#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

mkdir -p logs

if [ ! -d .venv ]; then
  python3 -m venv .venv
fi
source .venv/bin/activate
pip install -q -r requirements.txt

# Clean stale processes so startup is deterministic.
pkill -f 'python3 api.py' || true
pkill -f 'telegram/bot.py' || true
pkill -f 'next dev -p 3000' || true
fuser -k 3000/tcp >/dev/null 2>&1 || true

nohup python3 api.py > logs/api.log 2>&1 &
echo $! > logs/api.pid

nohup python3 telegram/bot.py > logs/telegram.log 2>&1 &
echo $! > logs/telegram.pid

cd frontend
if [ ! -d node_modules ]; then
  npm install
fi
nohup npm run dev > ../logs/frontend.log 2>&1 &
echo $! > ../logs/frontend.pid

echo "Started services:"
echo "  API      http://localhost:${PORT:-3001}"
echo "  Frontend http://localhost:${WEB_PORT:-3000}"
echo "  Logs     $ROOT/logs"
