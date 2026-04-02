#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

echo "Starting API on :${PORT:-3001}"
nohup python3 api.py > logs/api.log 2>&1 &

sleep 2

echo "Starting Telegram bot"
nohup python3 telegram/bot.py > logs/telegram.log 2>&1 &

echo "Done. Logs: logs/api.log logs/telegram.log"
