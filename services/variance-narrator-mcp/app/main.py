"""Atlas Variance Narrator — FastAPI HTTP service.

Endpoints:
  GET  /health             — liveness
  POST /narrate/{id}       — generate a narration for a specific variance
  GET  /variances          — list variances filtered by cycle or country

Auth: X-Playroll-Auth header on mutating routes.

Also exposes MCP tools via stdio for Claude Desktop integration (see
app.mcp_server for the MCP entrypoint — separate process).
"""
import os
from fastapi import FastAPI, Header, HTTPException, Path as FPath
from pydantic import BaseModel

from app.narrate import SYSTEM_PROMPT, build_narration_prompt, classify_cause
from app.gemini_client import narrate as gemini_narrate, GEMINI_MODEL
from app.supabase_client import (
    get_supabase,
    fetch_variance_context,
    save_narration,
)


app = FastAPI(title="Atlas Variance Narrator", version="0.1.0")

SECRET = os.environ.get("PYTHON_SERVICE_SECRET", "")


def require_auth(header_value: str | None) -> None:
    if SECRET and header_value != SECRET:
        raise HTTPException(status_code=401, detail="unauthorized")


@app.get("/health")
async def health():
    return {"ok": True, "service": "variance-narrator", "version": "0.1.0"}


class NarrateResponse(BaseModel):
    variance_id: str
    narration: str
    cause_category: str
    model: str
    tokens: int


@app.post("/narrate/{variance_id}", response_model=NarrateResponse)
async def narrate_variance(
    variance_id: str = FPath(...),
    x_playroll_auth: str | None = Header(default=None),
):
    require_auth(x_playroll_auth)

    try:
        ctx = fetch_variance_context(variance_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"variance not found: {e}")

    cause = classify_cause(ctx["variance"], ctx["events"])
    user_prompt = build_narration_prompt(ctx["cycle"], ctx["variance"], ctx["events"])

    try:
        text, tokens = await gemini_narrate(SYSTEM_PROMPT, user_prompt, max_tokens=400)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"narration generation failed: {e}")

    # Persist
    save_narration(variance_id, text, GEMINI_MODEL, tokens)

    # Also update the cause_category if it was empty
    if not ctx["variance"]["cause_hint"]:
        sb = get_supabase()
        sb.table("variances").update({"cause_category": cause}).eq("id", variance_id).execute()

    return NarrateResponse(
        variance_id=variance_id,
        narration=text,
        cause_category=cause,
        model=GEMINI_MODEL,
        tokens=tokens,
    )


@app.get("/variances")
async def list_variances(
    cycle_id: str | None = None,
    country_iso: str | None = None,
    limit: int = 50,
):
    """Unauthed read for UI polling. RLS is bypassed here via service role,
    but the Next.js API route that calls this enforces its own org scoping."""
    sb = get_supabase()
    q = sb.table("variances").select(
        "id,cycle_id,country_id,variance_amount,variance_pct,cause_category,"
        "narration_text,narration_model,flagged_for_review,created_at,"
        "countries(iso_code,name)"
    ).order("created_at", desc=True).limit(limit)
    if cycle_id:
        q = q.eq("cycle_id", cycle_id)
    if country_iso:
        q = q.eq("countries.iso_code", country_iso)
    resp = q.execute()
    return {"variances": resp.data or []}
