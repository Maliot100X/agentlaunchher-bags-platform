from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Dict, List

from bags.client import BagsClient
from providers.providers import ProviderManager


@dataclass
class ManagedAgent:
    agent_id: str
    name: str
    description: str
    owner_handle: str
    skills: List[str] = field(default_factory=list)
    running: bool = False
    last_run_at: str | None = None
    total_runs: int = 0


class AgentManager:
    def __init__(self, bags: BagsClient, providers: ProviderManager) -> None:
        self._bags = bags
        self._providers = providers
        self._agents: Dict[str, ManagedAgent] = {}
        self._tasks: Dict[str, asyncio.Task] = {}

    def upsert(self, agent: ManagedAgent) -> ManagedAgent:
        self._agents[agent.agent_id] = agent
        return agent

    def list(self) -> List[ManagedAgent]:
        return list(self._agents.values())

    def get(self, agent_id: str) -> ManagedAgent | None:
        return self._agents.get(agent_id)

    async def start(self, agent_id: str) -> ManagedAgent:
        agent = self._agents[agent_id]
        if agent.running:
            return agent
        agent.running = True
        self._tasks[agent_id] = asyncio.create_task(self._loop(agent_id))
        return agent

    async def stop(self, agent_id: str) -> ManagedAgent:
        agent = self._agents[agent_id]
        agent.running = False
        task = self._tasks.pop(agent_id, None)
        if task:
            task.cancel()
        return agent

    async def _loop(self, agent_id: str) -> None:
        while True:
            agent = self._agents.get(agent_id)
            if not agent or not agent.running:
                return
            try:
                tokens = await self._bags.token_feed()
                top = tokens[:15]
                prompt = [
                    {"role": "system", "content": "You are a Bags market analyzer. Output short actionable insight."},
                    {"role": "user", "content": f"Analyze these token feed items and suggest watch opportunities: {top}"},
                ]
                _ = await self._providers.chat(prompt)
                agent.total_runs += 1
                agent.last_run_at = datetime.now(timezone.utc).isoformat()
            except Exception:
                pass
            await asyncio.sleep(60)
