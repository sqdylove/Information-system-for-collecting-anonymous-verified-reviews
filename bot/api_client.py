import logging
import httpx
from dataclasses import dataclass
from typing import Any, Optional

logger = logging.getLogger(__name__)


@dataclass
class ApiError(Exception):
    status_code: int
    detail: str


class ApiClient:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip("/")
        self._client: Optional[httpx.AsyncClient] = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None:
            # Improved timeout: connect, read, write, pool
            self._client = httpx.AsyncClient(
                timeout=httpx.Timeout(10.0, connect=5.0, read=8.0, write=5.0),
                limits=httpx.Limits(max_connections=10, max_keepalive_connections=5),
                http2=False,
            )
        return self._client

    async def aclose(self) -> None:
        if self._client is not None:
            try:
                await self._client.aclose()
            except Exception as exc:
                logger.error("Error closing API client: %s", exc)
            self._client = None

    async def _request(self, method: str, path: str, *, params: dict[str, Any] | None = None, json: Any | None = None) -> Any:
        try:
            client = await self._get_client()
            url = f"{self.base_url}{path}"
            resp = await client.request(method, url, params=params, json=json)

            if 200 <= resp.status_code < 300:
                return resp.json() if resp.content else None

            # FastAPI typically returns {"detail": "..."} for HTTPException.
            detail = None
            try:
                payload = resp.json()
                if isinstance(payload, dict):
                    detail = payload.get("detail")
            except Exception:
                detail = None

            raise ApiError(status_code=resp.status_code, detail=detail or resp.text or "API error")
        except httpx.TimeoutException as exc:
            logger.error("API request timeout: %s", exc)
            raise ApiError(status_code=504, detail="API request timeout")
        except httpx.ConnectError as exc:
            logger.error("API connection error: %s", exc)
            raise ApiError(status_code=503, detail="API service unavailable")
        except Exception as exc:
            logger.error("Unexpected API error: %s", exc)
            raise ApiError(status_code=500, detail="Unexpected error")

    async def create_box(self) -> dict[str, Any]:
        return await self._request("POST", "/box")

    async def send_feedback(self, box_uuid: str, text: str) -> dict[str, Any]:
        return await self._request("POST", f"/box/{box_uuid}/feedback", json={"text": text})

    async def get_box_feedbacks(self, box_uuid: str, token: str) -> dict[str, Any]:
        return await self._request("GET", f"/box/{box_uuid}", params={"token": token})

    async def send_reply(self, feedback_id: int, token: str, text: str) -> dict[str, Any]:
        return await self._request(
            "POST",
            f"/feedback/{feedback_id}/reply",
            params={"token": token},
            json={"text": text},
        )

