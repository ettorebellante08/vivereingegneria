import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import type { AppRole } from "@/lib/database.types";

const ROLE_LABEL: Record<AppRole, string> = {
  member: "Membro",
  blogger: "Blogger",
  web_admin: "Amministratore WEB",
  super_admin: "Amministratore supremo",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/dashboard");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Area riservata</h1>
          <p className="text-sm text-muted-foreground">
            {user.fullName ?? user.email} ·{" "}
            <span className="font-medium text-foreground">
              {ROLE_LABEL[user.role]}
            </span>
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <LogOut className="size-4" />
            Esci
          </button>
        </form>
      </div>

      <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
        <aside>
          <DashboardNav role={user.role} />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
