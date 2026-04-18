import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const firstName =
    (user?.user_metadata as { full_name?: string })?.full_name?.split(" ")[0] ??
    "there";

  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <p className="eyebrow">Operations · April 2026</p>
        <h1 className="display-xl">Good morning, {firstName}.</h1>
        <p className="text-muted-foreground max-w-xl">
          Dashboard home lands Saturday afternoon (Task 3.5-3.8).
          Shell wiring in 1.15, then real widgets.
        </p>
      </div>
    </div>
  );
}
