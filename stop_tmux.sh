#!/usr/bin/env bash
set -euo pipefail

SESSION="agentlaunchher"
if tmux has-session -t "$SESSION" 2>/dev/null; then
  tmux kill-session -t "$SESSION"
  echo "Stopped $SESSION"
else
  echo "No active $SESSION session"
fi
