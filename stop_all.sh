#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

for p in api telegram frontend; do
  pidfile="logs/${p}.pid"
  if [ -f "$pidfile" ]; then
    pid=$(cat "$pidfile")
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" || true
      echo "Stopped $p ($pid)"
    fi
    rm -f "$pidfile"
  fi
done

pkill -f 'python3 api.py' || true
pkill -f 'telegram/bot.py' || true
pkill -f 'next dev -p 3000' || true
fuser -k 3000/tcp >/dev/null 2>&1 || true
