/**
 * Seed the initial accounts.
 *
 * Creates the three founding users with STRONG RANDOM passwords, marks each
 * with `must_change_password` so they're forced to change it on first login,
 * and assigns roles via user metadata (consumed by the handle_new_user
 * trigger).
 *
 * The generated passwords are printed to your terminal ONCE and are never
 * written to disk, code, or logs. Copy them somewhere safe (or, better, send
 * each person a password-reset link instead).
 *
 * Requires (server-only) env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY      <-- bypasses RLS; keep secret
 *
 * Run (Node 24+ can load the env file directly):
 *   node --env-file=.env.local scripts/seed-users.mjs
 */

import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "\n✖ Missing env. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.\n" +
      "  Example: node --env-file=.env.local scripts/seed-users.mjs\n",
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/** Cryptographically-strong, URL-safe password (~24 chars). */
function generatePassword() {
  return randomBytes(18).toString("base64url");
}

const USERS = [
  {
    email: "giovanni.barra@community.unipa.it",
    full_name: "Giovanni Barra",
    initial_role: "blogger",
  },
  {
    email: "andrea.depasquale@community.unipa.it",
    full_name: "Andrea De Pasquale",
    initial_role: "web_admin",
  },
  {
    email: "vivereingegneria@gmail.com",
    full_name: "Vivere Ingegneria",
    initial_role: "super_admin",
  },
];

const results = [];

for (const u of USERS) {
  const password = generatePassword();
  const { data, error } = await admin.auth.admin.createUser({
    email: u.email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: u.full_name,
      initial_role: u.initial_role,
      must_change_password: true,
    },
  });

  if (error) {
    results.push({ email: u.email, role: u.initial_role, status: `SKIPPED — ${error.message}`, password: "—" });
    continue;
  }

  results.push({
    email: u.email,
    role: u.initial_role,
    status: `created (${data.user.id.slice(0, 8)}…)`,
    password,
  });
}

console.log("\n=== Vivere Ingegneria — initial accounts ===\n");
for (const r of results) {
  console.log(`• ${r.role.padEnd(12)} ${r.email}`);
  console.log(`  status:   ${r.status}`);
  console.log(`  password: ${r.password}`);
  console.log("");
}
console.log(
  "⚠  Share each password over a secure channel. They are NOT stored anywhere.\n" +
    "   Every account must change its password at first login.\n",
);
