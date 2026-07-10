import { requireRole } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AppRole } from "@/lib/database.types";
import { CreateUserForm } from "@/components/dashboard/create-user-form";
import { RoleSelect } from "@/components/dashboard/role-select";

export default async function UsersPage() {
  const current = await requireRole("super_admin");

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">
        La gestione utenti richiede la variabile d&apos;ambiente{" "}
        <code>SUPABASE_SERVICE_ROLE_KEY</code>. Aggiungila su Vercel per
        abilitare creazione utenti e assegnazione ruoli.
      </div>
    );
  }

  const admin = createAdminClient();
  const [{ data: list }, { data: profiles }] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 200 }),
    admin.from("profiles").select("id, full_name, role"),
  ]);

  const roleById = new Map(
    (profiles ?? []).map((p) => [p.id, { role: p.role as AppRole, name: p.full_name }]),
  );

  const users = (list?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? "—",
    role: roleById.get(u.id)?.role ?? ("member" as AppRole),
    name: roleById.get(u.id)?.name ?? null,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold">Utenti</h2>
        <p className="text-sm text-muted-foreground">
          Crea account e assegna ruoli. Le password temporanee sono mostrate una
          sola volta alla creazione.
        </p>
      </div>

      <section className="rounded-xl border border-border p-5">
        <h3 className="mb-4 text-sm font-semibold">Nuovo utente</h3>
        <CreateUserForm />
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold">
          Account esistenti ({users.length})
        </h3>
        <ul className="divide-y divide-border rounded-xl border border-border">
          {users.map((u) => (
            <li
              key={u.id}
              className="flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{u.name ?? u.email}</p>
                <p className="truncate text-xs text-muted-foreground">{u.email}</p>
              </div>
              <RoleSelect
                userId={u.id}
                role={u.role}
                disabled={u.id === current.id}
              />
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">
          Non puoi modificare il ruolo del tuo stesso account (previene il
          blocco accidentale).
        </p>
      </section>
    </div>
  );
}
