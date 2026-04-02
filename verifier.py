import re
import secrets
import string
from datetime import datetime, timedelta, timezone

CODE_PREFIX = "ALH"  # AgentLaunchHer
CODE_LEN = 8
CODE_TTL_MIN = 30


def generate_code() -> str:
    alphabet = string.ascii_uppercase + string.digits
    token = "".join(secrets.choice(alphabet) for _ in range(CODE_LEN))
    return f"{CODE_PREFIX}-{token}"


def expiry_utc(minutes: int = CODE_TTL_MIN) -> datetime:
    return datetime.now(timezone.utc) + timedelta(minutes=minutes)


def verify_code_in_text(code: str, text: str) -> bool:
    if not text:
        return False
    pattern = re.escape(code)
    return re.search(pattern, text, re.IGNORECASE) is not None
