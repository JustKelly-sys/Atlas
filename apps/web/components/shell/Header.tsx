"use client";

import { usePathname, useRouter } from "next/navigation";
import { Search, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./ThemeToggle";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

function prettifySegment(seg: string) {
  return seg
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Header({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  // Breadcrumb: skip "app" prefix, prettify segments
  const parts = pathname
    .split("/")
    .filter(Boolean)
    .filter((p) => p !== "app")
    .map(prettifySegment);

  const initials = userEmail
    .split("@")[0]
    .split(/[.\-_]/)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <header className="h-14 border-b border-[color:var(--rule)] flex items-center px-6 gap-4 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm min-w-0">
        {parts.length === 0 ? (
          <span className="font-display italic text-[color:var(--ink-tertiary)]">
            Home
          </span>
        ) : (
          parts.map((p, i) => (
            <span key={`${p}-${i}`} className="flex items-center gap-2 min-w-0">
              {i > 0 ? (
                <span className="text-[color:var(--ink-tertiary)] text-xs">
                  /
                </span>
              ) : null}
              <span
                className={
                  i === parts.length - 1
                    ? "font-display italic text-[color:var(--ink-primary)] truncate"
                    : "text-[color:var(--ink-tertiary)] truncate"
                }
              >
                {p}
              </span>
            </span>
          ))
        )}
      </nav>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-[color:var(--ink-tertiary)] hover:text-[color:var(--ink-primary)] h-8 gap-2"
          aria-label="Search"
          disabled
        >
          <Search className="h-4 w-4" />
          <span className="font-mono text-xs">⌘K</span>
        </Button>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex items-center justify-center h-8 w-8 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Account menu"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-[color:var(--brand)] text-[color:var(--primary-foreground)] text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Signed in</p>
                <p className="text-xs leading-none text-muted-foreground font-mono">
                  {userEmail}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
