from __future__ import annotations

import json
import os
import secrets
import uuid
from contextlib import asynccontextmanager
from typing import Any, Dict, List, Optional

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from agents import AgentManager, ManagedAgent
from bags.client import BagsClient
from providers.providers import ProviderManager
from registry import RegistryStore

load_dotenv()


class RequestCodeIn(BaseModel):
    requester: str = Field(min_length=2, max_length=100)


class VerifyCodeIn(BaseModel):
    code: str
    twitter_url: str


class RegisterAgentIn(BaseModel):
    owner_handle: str
    name: str
    description: str
    image_url: Optional[str] = None
    skills: List[str] = Field(default_factory=list)


class AskIn(BaseModel):
    message: str


class WalletIn(BaseModel):
    wallet: str


@asynccontextmanager
async def lifespan(app: FastAPI):
    bags = BagsClient()
    providers = ProviderManager()
    store = RegistryStore()
    manager = AgentManager(bags, providers)
    app.state.bags = bags
    app.state.providers = providers
    app.state.store = store
    app.state.manager = manager
    try:
        yield
    finally:
        await bags.close()
        await providers.close()


app = FastAPI(title="AgentLaunchHer API", version="0.1.0", lifespan=lifespan)


@app.get("/health")
async def health() -> Dict[str, Any]:
    bags_ok = False
    ollama_ok = False
    bags_error = None
    ollama_error = None

    try:
        ping = await app.state.bags.ping()
        bags_ok = bool(ping)
    except Exception as e:
        bags_error = str(e)

    try:
        tags = await app.state.providers.health()
        ollama_ok = "models" in tags or isinstance(tags, dict)
    except Exception as e:
        ollama_error = str(e)

    return {
        "service": "agentlaunchher-api",
        "status": "ok" if (bags_ok and ollama_ok) else "degraded",
        "bags": {"ok": bags_ok, "error": bags_error},
        "ollama": {"ok": ollama_ok, "error": ollama_error},
    }


@app.post("/registry/request-code")
async def request_code(payload: RequestCodeIn):
    row = app.state.store.create_verification(payload.requester)
    return {"code": row.code, "expires_at": row.expires_at}


@app.post("/registry/verify")
async def verify_code(payload: VerifyCodeIn):
    try:
        resp = await httpx.AsyncClient(timeout=20).get(payload.twitter_url)
        text = resp.text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not fetch twitter url: {e}")

    ok = app.state.store.verify_code(payload.code, payload.twitter_url, text)
    if not ok:
        raise HTTPException(status_code=400, detail="Verification failed")
    return {"verified": True}


@app.post("/agents/register")
async def register_agent(payload: RegisterAgentIn):
    agent_id = f"agt_{uuid.uuid4().hex[:10]}"
    barrier_key = secrets.token_urlsafe(24)
    app.state.store.save_agent(
        agent_id=agent_id,
        owner_handle=payload.owner_handle,
        name=payload.name,
        description=payload.description,
        image_url=payload.image_url,
        skills_json=json.dumps(payload.skills),
        barrier_key=barrier_key,
    )

    agent = ManagedAgent(
        agent_id=agent_id,
        name=payload.name,
        description=payload.description,
        owner_handle=payload.owner_handle,
        skills=payload.skills,
    )
    app.state.manager.upsert(agent)
    return {"agent_id": agent_id, "barrier_key": barrier_key}


@app.get("/agents")
async def list_agents():
    return {
        "db_agents": app.state.store.list_agents(),
        "runtime_agents": [a.__dict__ for a in app.state.manager.list()],
    }


@app.post("/agents/{agent_id}/start")
async def start_agent(agent_id: str):
    agent = app.state.manager.get(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    result = await app.state.manager.start(agent_id)
    return {"started": True, "agent": result.__dict__}


@app.post("/agents/{agent_id}/stop")
async def stop_agent(agent_id: str):
    agent = app.state.manager.get(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    result = await app.state.manager.stop(agent_id)
    return {"stopped": True, "agent": result.__dict__}


@app.get("/scan")
async def scan_market():
    tokens = await app.state.bags.token_feed()
    pools = await app.state.bags.pools(False)
    return {
        "tokens_count": len(tokens),
        "pools_count": len(pools),
        "top_tokens": tokens[:10],
    }


@app.post("/portfolio")
async def portfolio(payload: WalletIn):
    # Bags public endpoints vary over time; for now return structured placeholder
    # with live market context so Telegram/dashboard always has actionable output.
    tokens = await app.state.bags.token_feed()
    return {
        "wallet": payload.wallet,
        "summary": {
            "tracked_assets": len(tokens[:5]),
            "source": "bags-public-feed",
        },
        "positions": [
            {
                "symbol": t.get("symbol", "UNKNOWN"),
                "status": t.get("status", "unknown"),
                "market_cap": t.get("marketCap", 0),
            }
            for t in tokens[:5]
        ],
    }


@app.post("/positions")
async def positions(payload: WalletIn):
    pf = await portfolio(payload)
    return {
        "wallet": payload.wallet,
        "positions": pf["positions"],
    }


@app.post("/ask")
async def ask(payload: AskIn):
    out = await app.state.providers.chat([
        {"role": "system", "content": "You are AgentLaunchHer assistant. Keep answers concise and actionable."},
        {"role": "user", "content": payload.message},
    ])
    return {"answer": out}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("api:app", host="0.0.0.0", port=int(os.getenv("PORT", "3001")), reload=False)
