import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { getCurrentUser, roleAtLeast } from "@/lib/auth";
import { redirect } from "next/navigation";

const CARDS = [
  {
    title: "Articoli",
    description: "Scrivi e gestisci i tuoi articoli del blog.",
    href: "/dashboard/articoli",
    min: "blogger" as const,
  },
  {
    title: "Pagine",
    description: "Modifica i contenuti delle pagine statiche del sito.",
    href: "/dashboard/pagine",
    min: "web_admin" as const,
  },
  {
    title: "Impostazioni",
    description: "Contatti, social e configurazione del sito.",
    href: "/dashboard/impostazioni",
    min: "web_admin" as const,
  },
  {
    title: "Utenti",
    description: "Gestisci account e ruoli.",
    href: "/dashboard/utenti",
    min: "super_admin" as const,
  },
];

export default async function DashboardHome() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const cards = CARDS.filter((c) => roleAtLeast(user.role, c.min));

  return (
    <div className="space-y-6">
      {user.mustChangePassword && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="text-sm">
            <p className="font-semibold text-amber-700 dark:text-amber-300">
              Devi impostare una nuova password
            </p>
            <p className="mt-1 text-amber-900/80 dark:text-amber-100/80">
              Per motivi di sicurezza, cambia la password temporanea prima di
              continuare.{" "}
              <Link
                href="/dashboard/cambia-password"
                className="font-medium underline"
              >
                Cambia password
              </Link>
            </p>
          </div>
        </div>
      )}

      {cards.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Il tuo account non ha ancora permessi assegnati. Contatta
          l&apos;amministrazione.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <h2 className="font-semibold group-hover:text-primary">
                {c.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {c.description}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Apri
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
