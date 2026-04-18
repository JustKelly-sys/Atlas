"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function SignInPage() {
  const [email, setEmail] = useState("demo@atlas-ops.app");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    router.push("/app/dashboard");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="eyebrow">Atlas · Sign in</p>
        <h1 className="display-lg">Welcome back.</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm text-muted-foreground">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm text-muted-foreground">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[color:var(--brand)] hover:bg-[color:var(--brand-hover)] text-[color:var(--primary-foreground)]"
          size="lg"
        >
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="text-sm text-muted-foreground space-y-2">
        <p>
          Demo login: <span className="font-mono">demo@atlas-ops.app</span> —
          password in README.
        </p>
        <p>
          Need an account?{" "}
          <Link
            href="/sign-up"
            className="underline decoration-[color:var(--brand)] underline-offset-4"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
