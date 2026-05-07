from time import time
from fastapi import HTTPException, status

requests = {}
MAX_REQUESTS = 10
WINDOW_SECONDS = 60


def check_rate(ip: str):
    if not ip:
        return

    now = int(time())
    window_start = now - WINDOW_SECONDS
    history = requests.get(ip, [])
    history = [timestamp for timestamp in history if timestamp > window_start]
    history.append(now)
    requests[ip] = history

    if len(history) > MAX_REQUESTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests, please wait a minute"
        )
