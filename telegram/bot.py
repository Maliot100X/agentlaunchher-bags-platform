from __future__ import annotations

import os

import httpx
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

load_dotenv()

API_BASE = f"http://127.0.0.1:{os.getenv('PORT', '3001')}"
BOT_TOKEN = os.getenv("TELEGRAM_LAUNCHER_BOT_TOKEN", "")


async def _api_get(path: str):
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.get(f"{API_BASE}{path}")
        r.raise_for_status()
        return r.json()


async def _api_post(path: str, payload: dict):
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post(f"{API_BASE}{path}", json=payload)
        r.raise_for_status()
        return r.json()


async def cmd_help(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (
        "/createagent <name> - register a new agent\n"
        "/agents - list agents\n"
        "/startagent <agent_id>\n"
        "/stopagent <agent_id>\n"
        "/scan - quick market feed check\n"
        "/portfolio <wallet>\n"
        "/positions <wallet>\n"
        "/status - service health\n"
        "/ask <question> - ask ollama assistant\n"
    )
    await update.message.reply_text(text)


async def cmd_new(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text("Usage: /new <agent-name>")
        return
    name = " ".join(context.args)
    payload = {
        "owner_handle": str(update.effective_user.username or update.effective_user.id),
        "name": name,
        "description": f"Agent created via telegram by @{update.effective_user.username or update.effective_user.id}",
        "skills": ["market_scanner"],
    }
    data = await _api_post("/agents/register", payload)
    await update.message.reply_text(f"Registered {name}\nAgent ID: {data['agent_id']}")


async def cmd_agents(update: Update, context: ContextTypes.DEFAULT_TYPE):
    data = await _api_get("/agents")
    rows = data.get("runtime_agents", [])
    if not rows:
        await update.message.reply_text("No agents yet")
        return
    lines = [f"{r['agent_id']} | {r['name']} | {'running' if r['running'] else 'stopped'}" for r in rows]
    await update.message.reply_text("\n".join(lines[:20]))


async def cmd_startagent(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text("Usage: /startagent <agent_id>")
        return
    aid = context.args[0]
    data = await _api_post(f"/agents/{aid}/start", {})
    await update.message.reply_text(f"Started {data['agent']['name']}")


async def cmd_stopagent(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text("Usage: /stopagent <agent_id>")
        return
    aid = context.args[0]
    data = await _api_post(f"/agents/{aid}/stop", {})
    await update.message.reply_text(f"Stopped {data['agent']['name']}")


async def cmd_status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    data = await _api_get("/health")
    await update.message.reply_text(str(data))


async def cmd_scan(update: Update, context: ContextTypes.DEFAULT_TYPE):
    data = await _api_get("/scan")
    await update.message.reply_text(
        f"Tokens: {data.get('tokens_count', 0)} | Pools: {data.get('pools_count', 0)}"
    )


async def cmd_portfolio(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text("Usage: /portfolio <wallet>")
        return
    wallet = context.args[0]
    data = await _api_post("/portfolio", {"wallet": wallet})
    await update.message.reply_text(str(data))


async def cmd_positions(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text("Usage: /positions <wallet>")
        return
    wallet = context.args[0]
    data = await _api_post("/positions", {"wallet": wallet})
    await update.message.reply_text(str(data))


async def cmd_ask(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text("Usage: /ask <message>")
        return
    prompt = " ".join(context.args)
    out = await _api_post("/ask", {"message": prompt})
    await update.message.reply_text(out.get("answer", "(no response)"))


def run() -> None:
    if not BOT_TOKEN:
        raise RuntimeError("TELEGRAM_LAUNCHER_BOT_TOKEN is not set")

    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("help", cmd_help))
    app.add_handler(CommandHandler("createagent", cmd_new))
    app.add_handler(CommandHandler("new", cmd_new))
    app.add_handler(CommandHandler("agents", cmd_agents))
    app.add_handler(CommandHandler("startagent", cmd_startagent))
    app.add_handler(CommandHandler("stopagent", cmd_stopagent))
    app.add_handler(CommandHandler("status", cmd_status))
    app.add_handler(CommandHandler("scan", cmd_scan))
    app.add_handler(CommandHandler("portfolio", cmd_portfolio))
    app.add_handler(CommandHandler("positions", cmd_positions))
    app.add_handler(CommandHandler("ask", cmd_ask))
    app.run_polling(drop_pending_updates=True)


if __name__ == "__main__":
    run()
