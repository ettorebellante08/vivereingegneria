import { requireRole } from "@/lib/auth";
import { getSettings } from "@/lib/data/settings";
import { SettingsForm } from "@/components/dashboard/settings-form";

export default async function SettingsPage() {
  await requireRole("web_admin");
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Impostazioni sito</h2>
        <p className="text-sm text-muted-foreground">
          Contatti e collegamenti social mostrati nel footer del sito.
        </p>
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
}
