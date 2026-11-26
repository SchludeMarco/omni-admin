"use client";

import { APPS } from "@/lib/apps";
import { useSession, type Theme } from "@/lib/session";
import { Badge, Card, CardTitle, Icon, PageHead, btn } from "@/components/ui";

const THEMES: { id: Theme; label: string; icon: string }[] = [
  { id: "hell", label: "Hell", icon: "light_mode" },
  { id: "dunkel", label: "Dunkel", icon: "dark_mode" },
  { id: "system", label: "System", icon: "settings_suggest" },
];

function Fact({ icon, title, sub, badge }: { icon: string; title: string; sub: string; badge?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-s-low p-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-s-lowest">
        <Icon name={icon} size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium">{title}</span>
        <span className="block text-[12px] text-muted">{sub}</span>
      </span>
      {badge}
    </div>
  );
}

export default function Settings() {
  const { theme, setTheme, admin, signOut, guestsConfigured } = useSession();

  return (
    <>
      <PageHead title="Einstellungen" sub={`Gilt für alle ${APPS.length} Apps`} />

      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardTitle icon="palette" title="Erscheinungsbild" />
          <p className="mb-2 text-[12px] text-muted">Farbschema von Omni Admin auf diesem Gerät</p>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl p-3 text-[12px] ${
                  theme === t.id ? "bg-s-high font-semibold text-accent" : "bg-s-low text-muted"
                }`}
              >
                <Icon name={t.icon} />
                {t.label}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle
            icon="security"
            title="Login & Sicherheit"
            right={
              <Badge tone={guestsConfigured ? "ok" : "warn"} dot>
                {guestsConfigured ? "Nur auf Einladung" : "Nicht eingerichtet"}
              </Badge>
            }
          />
          <div className="flex flex-col gap-2">
            <Fact icon="passkey" title="Anmeldung mit Google" sub="Gäste melden sich mit ihrem Google-Konto an" badge={<Icon name="check_circle" className="text-ok" />} />
            <Fact icon="timer" title="Angemeldet bleiben" sub="30 Tage pro Gerät" />
            <Fact icon="update" title="Gästeliste prüfen" sub="Einmal am Tag – Entfernte fliegen spätestens nach 24 Std. raus" />
            <Fact icon="door_front" title="Gästetür" sub="retromind.vercel.app – alle Apps nutzen sie" />
          </div>
        </Card>

        <Card>
          <CardTitle icon="person" title="Inhaber" />
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-[13px] font-semibold text-s-lowest">MS</span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">Marco Schlude</span>
              <span className="block truncate text-[12px] text-muted">{admin}</span>
            </span>
          </div>
          <p className="mt-3 text-[12px] text-muted">Nur dieses Konto kann Omni Admin öffnen und die Gästeliste ändern.</p>
          <button className={`${btn.soft} mt-3 w-full`} onClick={signOut}>
            <Icon name="logout" size={16} /> Abmelden
          </button>
        </Card>

        <Card>
          <CardTitle icon="lightbulb" title="Kommt als Nächstes" />
          <ul className="flex flex-col gap-1.5 text-[13px] text-muted">
            <li className="flex gap-2"><Icon name="radio_button_unchecked" size={16} /> Zugang nur zu einzelnen Apps</li>
            <li className="flex gap-2"><Icon name="radio_button_unchecked" size={16} /> Rollen (Gast, Tester)</li>
            <li className="flex gap-2"><Icon name="radio_button_unchecked" size={16} /> Gemeinsames Farbschema & Impressum für alle Apps</li>
          </ul>
        </Card>
      </div>
    </>
  );
}
