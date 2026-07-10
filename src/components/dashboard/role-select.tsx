"use client";

import { updateUserRoleAction } from "@/lib/actions/admin";
import type { AppRole } from "@/lib/database.types";

/** Inline role picker that submits on change. */
export function RoleSelect({
  userId,
  role,
  disabled,
}: {
  userId: string;
  role: AppRole;
  disabled?: boolean;
}) {
  return (
    <form action={updateUserRoleAction.bind(null, userId)}>
      <select
        name="role"
        defaultValue={role}
        disabled={disabled}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="h-9 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      >
        <option value="member">Membro</option>
        <option value="blogger">Blogger</option>
        <option value="web_admin">Amministratore WEB</option>
        <option value="super_admin">Amministratore supremo</option>
      </select>
    </form>
  );
}
