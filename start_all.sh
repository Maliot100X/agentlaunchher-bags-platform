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

nohup .venv/bin/python -m uvicorn api:app --host 0.0.0.0 --port "${PORT:-3001}" > logs/api.log 2>&1 &
echo $! > logs/api.pid

nohup .venv/bin/python telegram/bot.py > logs/telegram.log 2>&1 &
echo $! > logs/telegram.pid

if [ ! -d frontend/node_modules ]; then
  (cd frontend && npm install)
fi
nohup npm --prefix frontend run dev > logs/frontend.log 2>&1 &
echo $! > logs/frontend.pid

sleep 2
for p in api telegram frontend; do
  pidfile="logs/${p}.pid"
  pid=$(cat "$pidfile")
  if ! kill -0 "$pid" 2>/dev/null; then
    echo "Failed to start $p (pid $pid). See logs/${p}.log"
    exit 1
  fi
done

echo "Started services:"
echo "  API      http://localhost:${PORT:-3001}"
echo "  Frontend http://localhost:${WEB_PORT:-3000}"
echo "  Logs     $ROOT/logs"
