import type { AppRole } from "@/lib/database.types";

/** Rank used for "inherits" checks: higher includes lower privileges. */
export const ROLE_RANK: Record<AppRole, number> = {
  member: 0,
  blogger: 1,
  web_admin: 2,
  super_admin: 3,
};

/** Client-safe: whether `role` includes at least `min`'s privileges. */
export function roleAtLeast(role: AppRole, min: AppRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[min];
}
