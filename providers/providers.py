import os
from typing import Any, Dict, List

import httpx


class ProviderManager:
    def __init__(self) -> None:
        self.ollama_host = os.getenv("OLLAMA_URL", "http://localhost:11434")
        self.model = os.getenv("ACTIVE_AI_MODEL", "deepseek-v3.2:cloud").replace(":cloud", "")
        self._http = httpx.AsyncClient(timeout=60.0)

    async def close(self) -> None:
        await self._http.aclose()

    async def health(self) -> Dict[str, Any]:
        url = f"{self.ollama_host}/api/tags"
        resp = await self._http.get(url)
        resp.raise_for_status()
        return resp.json()

    async def chat(self, messages: List[Dict[str, str]], model: str | None = None) -> str:
        payload = {
            "model": (model or self.model),
            "messages": messages,
            "stream": False,
        }
        resp = await self._http.post(f"{self.ollama_host}/api/chat", json=payload)
        resp.raise_for_status()
        data = resp.json()
        return (data.get("message") or {}).get("content", "")
