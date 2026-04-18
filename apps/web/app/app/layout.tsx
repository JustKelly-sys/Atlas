import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  // Shell (Sidebar + Header) wired in Task 1.15.
  return (
    <div className="min-h-screen flex bg-background">
      <main className="flex-1 p-8 max-w-[1440px] mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
