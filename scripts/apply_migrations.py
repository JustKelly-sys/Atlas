"""Apply all SQL migrations in supabase/migrations/ to the remote Supabase Postgres.

Runs each file in a single transaction. Idempotent-ish: once applied, re-running
will fail on existing table errors. This script is for initial provisioning.
"""
import os
import sys
import pathlib
import psycopg

MIGRATIONS_DIR = pathlib.Path(__file__).parent.parent / "supabase" / "migrations"


def get_conn():
    return psycopg.connect(
        host="aws-1-eu-central-1.pooler.supabase.com",
        port=5432,
        dbname="postgres",
        user="postgres.lyvtxizoenxigezrqibz",
        password=os.environ["DB_PASSWORD"],
        sslmode="require",
        connect_timeout=30,
    )


def apply_migrations():
    files = sorted(MIGRATIONS_DIR.glob("*.sql"))
    if not files:
        print("No migration files found")
        return 1
    with get_conn() as conn:
        conn.autocommit = False
        for path in files:
            print(f">> Applying {path.name} ...", flush=True)
            sql = path.read_text(encoding="utf-8")
            try:
                with conn.cursor() as cur:
                    cur.execute(sql)
                conn.commit()
                print(f"  OK {path.name} applied")
            except Exception as e:
                conn.rollback()
                print(f"  FAIL {path.name} FAILED: {e}")
                return 1
    return 0


if __name__ == "__main__":
    sys.exit(apply_migrations())
