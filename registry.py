from __future__ import annotations

import sqlite3
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from verifier import expiry_utc, generate_code, verify_code_in_text

DB_PATH = Path("data/registry.db")


@dataclass
class PendingVerification:
    code: str
    requester: str
    expires_at: str


class RegistryStore:
    def __init__(self) -> None:
        DB_PATH.parent.mkdir(parents=True, exist_ok=True)
        self.conn = sqlite3.connect(DB_PATH)
        self.conn.row_factory = sqlite3.Row
        self._migrate()

    def _migrate(self) -> None:
        cur = self.conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS verification_requests (
                code TEXT PRIMARY KEY,
                requester TEXT NOT NULL,
                twitter_url TEXT,
                status TEXT NOT NULL,
                created_at TEXT NOT NULL,
                expires_at TEXT NOT NULL
            )
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS agents (
                agent_id TEXT PRIMARY KEY,
                owner_handle TEXT NOT NULL,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                image_url TEXT,
                skills_json TEXT NOT NULL,
                barrier_key TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        self.conn.commit()

    def create_verification(self, requester: str) -> PendingVerification:
        code = generate_code()
        expires = expiry_utc().isoformat()
        now = datetime.now(timezone.utc).isoformat()
        self.conn.execute(
            "INSERT INTO verification_requests(code, requester, status, created_at, expires_at) VALUES (?, ?, 'PENDING', ?, ?)",
            (code, requester, now, expires),
        )
        self.conn.commit()
        return PendingVerification(code=code, requester=requester, expires_at=expires)

    def verify_code(self, code: str, twitter_url: str, fetched_text: str) -> bool:
        row = self.conn.execute(
            "SELECT code, expires_at, status FROM verification_requests WHERE code = ?",
            (code,),
        ).fetchone()
        if not row:
            return False
        if row["status"] != "PENDING":
            return False
        if datetime.fromisoformat(row["expires_at"]) < datetime.now(timezone.utc):
            return False
        if not verify_code_in_text(code, fetched_text):
            return False
        self.conn.execute(
            "UPDATE verification_requests SET status='VERIFIED', twitter_url=? WHERE code=?",
            (twitter_url, code),
        )
        self.conn.commit()
        return True

    def save_agent(
        self,
        agent_id: str,
        owner_handle: str,
        name: str,
        description: str,
        image_url: Optional[str],
        skills_json: str,
        barrier_key: str,
    ) -> None:
        now = datetime.now(timezone.utc).isoformat()
        self.conn.execute(
            """
            INSERT OR REPLACE INTO agents(agent_id, owner_handle, name, description, image_url, skills_json, barrier_key, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (agent_id, owner_handle, name, description, image_url, skills_json, barrier_key, now),
        )
        self.conn.commit()

    def list_agents(self):
        return [dict(r) for r in self.conn.execute("SELECT * FROM agents ORDER BY created_at DESC").fetchall()]
