"""Create or reset the two demo users via Supabase Admin API.

Idempotent: if a user exists, updates their password (so passwords are
always captured). Writes credentials to scripts/demo_users.json (gitignored).
"""
import os
import json
import secrets
import sys
import urllib.request
import urllib.error
import urllib.parse


SUPABASE_URL = "https://lyvtxizoenxigezrqibz.supabase.co"
SERVICE_ROLE = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

USERS = [
    {"email": "demo@atlas-ops.app", "full_name": "Tshepiso Jafta", "role": "owner"},
    {"email": "viewer@atlas-ops.app", "full_name": "Demo Viewer", "role": "viewer"},
]


def gen_password() -> str:
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
    parts = ["".join(secrets.choice(alphabet) for _ in range(4)) for _ in range(3)]
    return "-".join(parts)


def api_call(method: str, path: str, body: dict | None = None):
    url = f"{SUPABASE_URL}{path}"
    data = json.dumps(body).encode("utf-8") if body else None
    req = urllib.request.Request(
        url,
        method=method,
        data=data,
        headers={
            "apikey": SERVICE_ROLE,
            "Authorization": f"Bearer {SERVICE_ROLE}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req) as resp:
            body_text = resp.read().decode("utf-8")
            return resp.status, (json.loads(body_text) if body_text else {})
    except urllib.error.HTTPError as e:
        body_text = e.read().decode("utf-8")
        return e.code, (json.loads(body_text) if body_text else {"error": str(e)})


def list_all_users():
    users = []
    page = 1
    while True:
        status, data = api_call("GET", f"/auth/v1/admin/users?page={page}&per_page=100")
        if status != 200:
            raise RuntimeError(f"list users failed: {status} {data}")
        batch = data.get("users", [])
        users.extend(batch)
        if len(batch) < 100:
            break
        page += 1
    return users


def find_user_by_email(email: str, users: list[dict]):
    for u in users:
        if u.get("email", "").lower() == email.lower():
            return u
    return None


def create_user(email: str, password: str, full_name: str):
    status, data = api_call(
        "POST",
        "/auth/v1/admin/users",
        {
            "email": email,
            "password": password,
            "email_confirm": True,
            "user_metadata": {"full_name": full_name},
        },
    )
    if status not in (200, 201):
        raise RuntimeError(f"create {email} failed: {status} {data}")
    return data


def reset_password(user_id: str, password: str, full_name: str):
    status, data = api_call(
        "PUT",
        f"/auth/v1/admin/users/{user_id}",
        {
            "password": password,
            "email_confirm": True,
            "user_metadata": {"full_name": full_name},
        },
    )
    if status not in (200, 201):
        raise RuntimeError(f"reset {user_id} failed: {status} {data}")
    return data


def main() -> int:
    print("Listing existing users ...")
    existing = list_all_users()
    print(f"  found {len(existing)} user(s)")

    results = []
    for spec in USERS:
        email = spec["email"]
        password = gen_password()
        match = find_user_by_email(email, existing)
        if match:
            reset_password(match["id"], password, spec["full_name"])
            print(f"  reset {email} (id {match['id']})")
            uid = match["id"]
        else:
            created = create_user(email, password, spec["full_name"])
            uid = created["id"]
            print(f"  created {email} (id {uid})")
        results.append({
            "email": email,
            "id": uid,
            "full_name": spec["full_name"],
            "role": spec["role"],
            "password": password,
        })

    out_path = os.path.join(os.path.dirname(__file__), "demo_users.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print(f"\nWrote {out_path} (gitignored).")
    print("\nPasswords:")
    for r in results:
        print(f"  {r['email']:30s} {r['password']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
