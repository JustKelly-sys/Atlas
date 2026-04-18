import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shell/PageHeader";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const firstName =
    (user?.user_metadata as { full_name?: string })?.full_name?.split(" ")[0] ??
    "there";

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Operations · April 2026"
        title={`Good morning, ${firstName}.`}
        subtitle="Payroll cycle 12 of 12 · 6 countries · current cutoff in 3 days."
      />

      {/* Placeholder content — widgets arrive in Tasks 3.5 through 4.1 */}
      <div className="rounded-sm border border-[color:var(--rule)] bg-card p-8 text-center space-y-3">
        <p className="eyebrow">Under construction</p>
        <p className="font-display text-2xl">
          Widgets arriving Saturday afternoon.
        </p>
        <p className="text-sm text-muted-foreground">
          Cycle status · Critical alerts · The Five · KPI strip · Country grid ·
          Activity feed · Upcoming filings
        </p>
      </div>
    </div>
  );
}
