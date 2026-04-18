"""MCP stdio server for Claude Desktop integration.

Entry:  python -m app.mcp_server

Tools:
  check_date(country_iso, date)          -> cycles + holidays on that date
  list_conflicts(country_iso?, severity?) -> current unresolved conflicts
  next_cutoff(country_iso, employer_tz?)  -> multi-TZ cutoff view
"""
import asyncio
import json
import os
from datetime import date

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

from app.conflicts import next_cutoff_in_tz
from app.supabase_client import get_supabase


server = Server("atlas-calendar-sentinel")


@server.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="check_date",
            description=(
                "For a given country and date, return upcoming payroll cycles "
                "and public holidays that fall on or near that date."
            ),
            inputSchema={
                "type": "object",
                "required": ["country_iso", "date"],
                "properties": {
                    "country_iso": {"type": "string", "description": "ISO 2-letter country code"},
                    "date": {"type": "string", "description": "YYYY-MM-DD"},
                },
            },
        ),
        Tool(
            name="list_conflicts",
            description=(
                "List current calendar conflicts (holidays on cutoff, timezone misses). "
                "Filter by country_iso or severity (info|warn|crit)."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "country_iso": {"type": "string"},
                    "severity": {"type": "string", "enum": ["info", "warn", "crit"]},
                },
            },
        ),
        Tool(
            name="next_cutoff",
            description=(
                "Return the next payroll cutoff for a country, converted to UTC, "
                "country local time, and an employer timezone if provided."
            ),
            inputSchema={
                "type": "object",
                "required": ["country_iso"],
                "properties": {
                    "country_iso": {"type": "string"},
                    "employer_tz": {"type": "string", "description": "IANA TZ name (default UTC)"},
                },
            },
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    sb = get_supabase()

    if name == "check_date":
        iso = arguments["country_iso"]
        d = arguments["date"]
        cycles_resp = sb.table("payroll_cycles").select(
            "id,cycle_month,cutoff_at,status,countries(iso_code,name)"
        ).execute()
        cycles = [
            c for c in (cycles_resp.data or [])
            if c["countries"]["iso_code"] == iso
            and abs(
                (date.fromisoformat(c["cutoff_at"][:10]) - date.fromisoformat(d)).days
            ) <= 14
        ]
        holidays_resp = sb.table("public_holidays").select(
            "holiday_date,name,countries(iso_code)"
        ).execute()
        holidays = [
            h for h in (holidays_resp.data or [])
            if h["countries"]["iso_code"] == iso
            and abs((date.fromisoformat(h["holiday_date"]) - date.fromisoformat(d)).days) <= 14
        ]
        return [TextContent(type="text", text=json.dumps({
            "country": iso,
            "date": d,
            "cycles_within_14_days": cycles,
            "holidays_within_14_days": holidays,
        }, indent=2))]

    if name == "list_conflicts":
        q = sb.table("calendar_conflicts").select(
            "conflict_date,conflict_type,severity,suggested_shift_date,"
            "explanation,resolved_at,countries(iso_code,name)"
        ).is_("resolved_at", "null").order("conflict_date")
        if arguments.get("severity"):
            q = q.eq("severity", arguments["severity"])
        rows = q.execute().data or []
        if arguments.get("country_iso"):
            rows = [r for r in rows if r["countries"]["iso_code"] == arguments["country_iso"]]
        return [TextContent(type="text", text=json.dumps(rows, indent=2))]

    if name == "next_cutoff":
        iso = arguments["country_iso"]
        employer_tz = arguments.get("employer_tz", "UTC")
        today = date.today().isoformat()
        resp = sb.table("payroll_cycles").select(
            "id,cycle_month,cutoff_at,countries(iso_code)"
        ).gte("cutoff_at", today).order("cutoff_at").limit(10).execute()
        rows = [r for r in (resp.data or []) if r["countries"]["iso_code"] == iso]
        if not rows:
            return [TextContent(type="text", text=json.dumps({"error": f"no upcoming cycle for {iso}"}))]
        c = rows[0]
        cycle = {
            "cycle_id": c["id"],
            "country_iso": iso,
            "cycle_month": c["cycle_month"],
            "cutoff_at": c["cutoff_at"],
        }
        return [TextContent(type="text", text=json.dumps(next_cutoff_in_tz(cycle, employer_tz), indent=2))]

    raise ValueError(f"Unknown tool: {name}")


async def main():
    async with stdio_server() as (read, write):
        await server.run(read, write, server.create_initialization_options())


if __name__ == "__main__":
    asyncio.run(main())
