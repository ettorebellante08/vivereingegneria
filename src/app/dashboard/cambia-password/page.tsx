import { requireRole } from "@/lib/auth";
import { ChangePasswordForm } from "@/components/auth/change-password-form";

export default async function ChangePasswordPage() {
  // Accessible to any signed-in user; does not force-redirect here.
  await requireRole("member", { allowPasswordChange: true });

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold">Cambia password</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Scegli una nuova password sicura.
      </p>
      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
