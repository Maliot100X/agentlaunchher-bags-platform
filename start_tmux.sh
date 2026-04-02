#!/usr/bin/env bash
set -euo pipefail

SESSION="agentlaunchher"
ROOT="$(cd "$(dirname "$0")" && pwd)"

cd "$ROOT"

if [ ! -d .venv ]; then
  python3 -m venv .venv
fi
source .venv/bin/activate
pip install -q -r requirements.txt
if [ ! -d frontend/node_modules ]; then
  (cd frontend && npm install)
fi

if tmux has-session -t "$SESSION" 2>/dev/null; then
  tmux kill-session -t "$SESSION"
fi

tmux new-session -d -s "$SESSION" -n api "cd $ROOT && source .venv/bin/activate && python -m uvicorn api:app --host 0.0.0.0 --port ${PORT:-3001}"
tmux new-window -t "$SESSION" -n bot "cd $ROOT && source .venv/bin/activate && python telegram/bot.py"
tmux new-window -t "$SESSION" -n web "cd $ROOT/frontend && npm run dev"

echo "Started tmux session: $SESSION"
echo "Attach with: tmux attach -t $SESSION"
echo "Windows: api | bot | web"
