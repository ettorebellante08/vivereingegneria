import { z } from "zod";

export const INSTITUTIONAL_DOMAIN = "@community.unipa.it";

/**
 * Explicit, documented exceptions to the institutional-email rule.
 * MUST mirror public.email_domain_exceptions in the database. The server /
 * RLS trigger is the authoritative check — this is the client-side courtesy
 * validation so users get instant feedback.
 */
export const EMAIL_EXCEPTIONS = ["vivereingegneria@gmail.com"];

/** Whether an email may be used to create an account. */
export function isAllowedEmail(email: string): boolean {
  const e = email.trim().toLowerCase();
  return e.endsWith(INSTITUTIONAL_DOMAIN) || EMAIL_EXCEPTIONS.includes(e);
}

export const loginSchema = z.object({
  email: z.string().email("Inserisci un'email valida."),
  password: z.string().min(1, "Inserisci la password."),
});

/** New-account email must satisfy the institutional rule (or an exception). */
export const institutionalEmailSchema = z
  .string()
  .email("Inserisci un'email valida.")
  .refine(isAllowedEmail, {
    message: `Sono ammesse solo email ${INSTITUTIONAL_DOMAIN} (salvo eccezioni autorizzate).`,
  });

export const passwordSchema = z
  .string()
  .min(10, "La password deve avere almeno 10 caratteri.")
  .regex(/[a-z]/, "Serve almeno una lettera minuscola.")
  .regex(/[A-Z]/, "Serve almeno una lettera maiuscola.")
  .regex(/[0-9]/, "Serve almeno un numero.");

export const changePasswordSchema = z
  .object({
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Le password non coincidono.",
    path: ["confirm"],
  });
