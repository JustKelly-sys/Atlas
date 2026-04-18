"""Thin Gemini client for variance narration.

Uses the REST API directly (no SDK dep needed). Disables thinking so
output is fast and deterministic.
"""
import os
import json
import httpx


GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_URL_TEMPLATE = (
    "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
)


async def narrate(
    system_prompt: str,
    user_prompt: str,
    max_tokens: int = 400,
) -> tuple[str, int]:
    """Return (narration_text, output_tokens_used).

    Raises httpx errors for upstream failures. Caller handles retries.
    """
    api_key = os.environ["GEMINI_API_KEY"]
    url = GEMINI_URL_TEMPLATE.format(model=GEMINI_MODEL) + f"?key={api_key}"

    body = {
        "systemInstruction": {"parts": [{"text": system_prompt}]},
        "contents": [{"role": "user", "parts": [{"text": user_prompt}]}],
        "generationConfig": {
            "temperature": 0.4,
            "maxOutputTokens": max_tokens,
            "thinkingConfig": {"thinkingBudget": 0},
        },
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(url, json=body)
        resp.raise_for_status()
        data = resp.json()

    candidates = data.get("candidates") or []
    if not candidates:
        raise RuntimeError(f"No candidates in Gemini response: {data}")
    parts = candidates[0].get("content", {}).get("parts") or []
    if not parts:
        raise RuntimeError(f"No parts in candidate: {candidates[0]}")
    text = parts[0].get("text", "").strip()

    usage = data.get("usageMetadata") or {}
    out_tokens = int(usage.get("candidatesTokenCount") or 0)

    return text, out_tokens
