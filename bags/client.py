import os
from typing import Any, Dict, List

import httpx

BAGS_BASE = "https://public-api-v2.bags.fm/api/v1"
BAGS_PUBLIC_BASE = "https://public-api-v2.bags.fm"


class BagsClient:
    def __init__(self) -> None:
        api_key = os.getenv("BAGS_API_KEY", "")
        headers = {"Content-Type": "application/json"}
        if api_key:
            headers["x-api-key"] = api_key
        self._http = httpx.AsyncClient(base_url=BAGS_BASE, headers=headers, timeout=30.0)

    async def close(self) -> None:
        await self._http.aclose()

    async def ping(self) -> Dict[str, Any]:
        # Bags health endpoint is exposed on the public base path.
        resp = await self._http.get(f"{BAGS_PUBLIC_BASE}/ping")
        resp.raise_for_status()
        return resp.json()

    async def token_feed(self) -> List[Dict[str, Any]]:
        resp = await self._http.get("/token-launch/feed")
        resp.raise_for_status()
        data = resp.json()
        if isinstance(data, dict) and data.get("success"):
            return data.get("response", [])
        return []

    async def pools(self, only_migrated: bool = False) -> List[Dict[str, Any]]:
        resp = await self._http.get("/solana/bags/pools", params={"onlyMigrated": str(only_migrated).lower()})
        resp.raise_for_status()
        data = resp.json()
        if isinstance(data, dict) and data.get("success"):
            return data.get("response", [])
        return []

    async def agent_auth_init(self, agent_username: str) -> Dict[str, Any]:
        resp = await self._http.post("/agent/auth/init", json={"agentUsername": agent_username})
        resp.raise_for_status()
        return resp.json()

    async def agent_auth_complete(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        resp = await self._http.post("/agent/auth/complete", json=payload)
        resp.raise_for_status()
        return resp.json()

    async def trade_quote(
        self,
        input_mint: str,
        output_mint: str,
        in_amount: str,
        slippage_bps: int = 100,
    ) -> Dict[str, Any]:
        resp = await self._http.get(
            "/trade/quote",
            params={
                "inputMint": input_mint,
                "outputMint": output_mint,
                "inAmount": in_amount,
                "slippageBps": slippage_bps,
            },
        )
        resp.raise_for_status()
        return resp.json()
