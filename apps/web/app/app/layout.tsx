import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/shell/Sidebar";
import { Header } from "@/components/shell/Header";

export default async function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const name = cookieStore.get("atlas_name")?.value;
  if (!name) redirect("/sign-in");

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar userName={decodeURIComponent(name)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header userName={decodeURIComponent(name)} />
        <main className="flex-1 p-8 max-w-[1440px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
