import { PageHeader } from "@/components/shell/PageHeader";
import { FxWatchdogGrid } from "@/components/payroll/FxWatchdogGrid";

export default function FxPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operations · FX Watchdog"
        title="FX spread opacity detector"
        subtitle="Compares the mid-market rate to the rate your EOR/payroll provider actually applies, per cycle. Most providers embed 0.5-5% spread invisibly. We surface it in dollars."
        status="live"
      />
      <FxWatchdogGrid />
    </div>
  );
}
