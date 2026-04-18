"""MCP stdio server — lets Claude Desktop query variance data conversationally.

Entry point:  python -m app.mcp_server

Exposes 3 tools:
  - list_variances(cycle_id?, country_iso?) -> array of variances
  - narrate_variance(variance_id) -> new narration (generates if missing)
  - query_cycle_summary(cycle_id) -> totals + variance summary for a cycle

Reads Supabase via service role (read-only access pattern). For the
narrate tool, also calls Gemini.
"""
import asyncio
import json
import os
import sys
from datetime import date, timedelta

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

from app.narrate import SYSTEM_PROMPT, build_narration_prompt, classify_cause
from app.gemini_client import narrate as gemini_narrate, GEMINI_MODEL
from app.supabase_client import (
    get_supabase,
    fetch_variance_context,
    save_narration,
)


server = Server("atlas-variance-narrator")


@server.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="list_variances",
            description=(
                "List payroll variances for Atlas, optionally filtered by "
                "cycle_id or country ISO code. Returns up to 20 variances "
                "with cause category, amounts, and existing narration."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "cycle_id": {"type": "string", "description": "Payroll cycle UUID (optional)"},
                    "country_iso": {"type": "string", "description": "Country ISO code (ZA, GB, US, DE, AU, AE) (optional)"},
                },
            },
        ),
        Tool(
            name="narrate_variance",
            description=(
                "Generate or regenerate a human-readable explanation of why "
                "a specific variance occurred. Uses Gemini. Persists the "
                "narration back to the variance row."
            ),
            inputSchema={
                "type": "object",
                "required": ["variance_id"],
                "properties": {
                    "variance_id": {"type": "string", "description": "Variance UUID"},
                },
            },
        ),
        Tool(
            name="query_cycle_summary",
            description=(
                "Return aggregate summary for a payroll cycle: total gross, "
                "net, employee count, variance count, and the narration of "
                "the biggest variance."
            ),
            inputSchema={
                "type": "object",
                "required": ["cycle_id"],
                "properties": {
                    "cycle_id": {"type": "string", "description": "Payroll cycle UUID"},
                },
            },
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    sb = get_supabase()
    if name == "list_variances":
        q = sb.table("variances").select(
            "id,variance_amount,variance_pct,cause_category,narration_text,"
            "cycle_id,countries(iso_code,name)"
        ).order("created_at", desc=True).limit(20)
        if arguments.get("cycle_id"):
            q = q.eq("cycle_id", arguments["cycle_id"])
        if arguments.get("country_iso"):
            q = q.eq("countries.iso_code", arguments["country_iso"])
        resp = q.execute()
        return [TextContent(type="text", text=json.dumps(resp.data or [], indent=2))]

    if name == "narrate_variance":
        vid = arguments["variance_id"]
        ctx = fetch_variance_context(vid)
        cause = classify_cause(ctx["variance"], ctx["events"])
        prompt = build_narration_prompt(ctx["cycle"], ctx["variance"], ctx["events"])
        text, tokens = await gemini_narrate(SYSTEM_PROMPT, prompt)
        save_narration(vid, text, GEMINI_MODEL, tokens)
        if not ctx["variance"]["cause_hint"]:
            sb.table("variances").update({"cause_category": cause}).eq("id", vid).execute()
        return [TextContent(type="text", text=json.dumps({
            "narration": text, "cause": cause, "model": GEMINI_MODEL, "tokens": tokens
        }, indent=2))]

    if name == "query_cycle_summary":
        cid = arguments["cycle_id"]
        cycle = sb.table("payroll_cycles").select(
            "*,countries(iso_code,name,currency)"
        ).eq("id", cid).single().execute().data
        variances = sb.table("variances").select(
            "id,variance_amount,variance_pct,cause_category,narration_text"
        ).eq("cycle_id", cid).order("variance_amount", desc=True).execute().data or []
        biggest = variances[0] if variances else None
        summary = {
            "cycle_month": cycle["cycle_month"],
            "country": cycle["countries"]["name"],
            "status": cycle["status"],
            "total_gross": cycle["total_gross_amount"],
            "total_net": cycle["total_net_amount"],
            "employee_count": cycle["employee_count"],
            "variance_count": len(variances),
            "biggest_variance": biggest,
        }
        return [TextContent(type="text", text=json.dumps(summary, indent=2))]

    raise ValueError(f"Unknown tool: {name}")


async def main():
    async with stdio_server() as (read, write):
        await server.run(read, write, server.create_initialization_options())


if __name__ == "__main__":
    asyncio.run(main())
