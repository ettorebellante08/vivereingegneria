import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { CONTACT } from "@/lib/site-config";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TelegramIcon,
} from "@/components/social-icons";

export const metadata: Metadata = {
  title: "Contatti",
  description: "Scrivici o seguici sui social. Siamo qui per gli studenti di Ingegneria.",
};

const socials = [
  { label: "Facebook", href: CONTACT.social.facebook, Icon: FacebookIcon },
  { label: "Instagram", href: CONTACT.social.instagram, Icon: InstagramIcon },
  { label: "LinkedIn", href: CONTACT.social.linkedin, Icon: LinkedinIcon },
  { label: "Telegram", href: CONTACT.social.telegram, Icon: TelegramIcon },
];

export default function ContattiPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <PageHeader
        eyebrow="Contatti"
        title="Parliamone"
        description="Hai una domanda, un'idea o vuoi collaborare? Siamo a un messaggio di distanza."
      />

      <div className="mx-auto mt-12 max-w-md space-y-4">
        <a
          href={`mailto:${CONTACT.email}`}
          className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary"
        >
          <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
            <Mail className="size-5" />
          </span>
          <span>
            <span className="block text-sm text-muted-foreground">Email</span>
            <span className="font-medium">{CONTACT.email}</span>
          </span>
        </a>

        <div className="grid grid-cols-2 gap-4">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary"
            >
              <Icon className="size-5 text-primary" />
              <span className="font-medium">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
