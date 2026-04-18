import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-xl space-y-6 text-center">
        <p className="eyebrow">Coming 20 April · Atlas</p>
        <h1 className="display-xl">Payroll operations, reconsidered.</h1>
        <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
          A global payroll suite with five AI-powered automations. Built for
          Playroll. By Tshepiso Jafta.
        </p>
        <div className="pt-4">
          <Link
            href="/sign-in"
            className="underline decoration-[color:var(--brand)] underline-offset-4 hover:decoration-[color:var(--brand-hover)]"
          >
            Sign in →
          </Link>
        </div>
      </div>
    </main>
  );
}
