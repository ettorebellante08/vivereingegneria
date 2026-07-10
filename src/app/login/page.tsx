import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Area riservata",
  robots: { index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: redirectParam } = await searchParams;
  const redirectTo =
    redirectParam && redirectParam.startsWith("/") ? redirectParam : "/dashboard";

  const configured = isSupabaseConfigured();
  if (configured) {
    const user = await getCurrentUser();
    if (user) redirect(redirectTo);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="mb-8 text-center">
        <div className="mb-6 flex justify-center">
          <Logo variant="mark" className="h-12" />
        </div>
        <h1 className="text-2xl font-bold">Area riservata</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Accesso per redazione e amministrazione.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        {configured ? (
          <LoginForm redirectTo={redirectTo} />
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            L&apos;autenticazione sarà disponibile una volta collegato Supabase.
            Consulta la guida di deploy.
          </p>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Gli account sono creati dall&apos;amministrazione. Per problemi di
        accesso scrivi a{" "}
        <Link href="/contatti" className="text-primary hover:underline">
          contatti
        </Link>
        .
      </p>
    </div>
  );
}
