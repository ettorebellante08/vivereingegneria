import Link from "next/link";
import { Mail } from "lucide-react";
import { NAV, SITE } from "@/lib/site-config";
import { getSettings } from "@/lib/data/settings";
import { Logo } from "@/components/logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TelegramIcon,
} from "@/components/social-icons";

export async function SiteFooter() {
  const { contactEmail, social } = await getSettings();
  const socials = [
    { label: "Facebook", href: social.facebook, Icon: FacebookIcon },
    { label: "Instagram", href: social.instagram, Icon: InstagramIcon },
    { label: "LinkedIn", href: social.linkedin, Icon: LinkedinIcon },
    { label: "Telegram", href: social.telegram, Icon: TelegramIcon },
  ].filter((s) => s.href);

  return (
    <footer className="mt-24 border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {SITE.description}
          </p>
          <div className="flex gap-2">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Mappa del sito">
          <h3 className="mb-4 text-sm font-semibold">Naviga</h3>
          <ul className="space-y-2.5 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="mb-4 text-sm font-semibold">Contatti</h3>
          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="size-4" />
            {contactEmail}
          </a>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {SITE.fullName}. Dal {SITE.foundedYear}.
          </p>
          <p>Corsi di Laurea in Ingegneria · UniPa</p>
        </div>
      </div>
    </footer>
  );
}
