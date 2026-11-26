"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APPS } from "@/lib/apps";
import { useSession } from "@/lib/session";
import { Badge, Icon, btn } from "./ui";

const NAV = [
  { href: "/", label: "Übersicht", icon: "dashboard" },
  { href: "/gaeste", label: "Gäste", icon: "group" },
  { href: "/einladen", label: "Einladen", icon: "person_add" },
  { href: "/einstellungen", label: "Optionen", icon: "settings" },
];

function Logo() {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-on-accent">
      <Icon name="hub" size={20} />
    </span>
  );
}

function SignIn() {
  const { signIn, error } = useSession();
  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl bg-s-lowest p-6 text-center shadow-card">
        <div className="mx-auto mb-4 w-fit">
          <Logo />
        </div>
        <h1 className="text-xl font-semibold">Omni Admin</h1>
        <p className="mt-1 text-[13px] text-muted">Einstellungen und Einladungen für alle deine Apps an einem Ort.</p>
        <button className={`${btn.primary} mt-6 w-full`} onClick={signIn}>
          <Icon name="login" size={18} /> Mit Google anmelden
        </button>
        {error && <p className="mt-3 text-[12px] text-err">{error}</p>}
        <p className="mt-4 text-[11px] text-outline">Nur für den Inhaber. Gäste melden sich direkt in den Apps an.</p>
      </div>
    </div>
  );
}

function Denied() {
  const { signOut } = useSession();
  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl bg-s-lowest p-6 text-center shadow-card">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-err-bg text-err">
          <Icon name="lock" />
        </div>
        <h1 className="text-lg font-semibold">Kein Zugriff</h1>
        <p className="mt-1 text-[13px] text-muted">Mit diesem Google-Konto kannst du Omni Admin nicht verwalten.</p>
        <button className={`${btn.soft} mt-5 w-full`} onClick={signOut}>
          Anderes Konto verwenden
        </button>
      </div>
    </div>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const { phase, status, admin, guests, signOut } = useSession();
  const path = usePathname();

  if (phase === "loading")
    return (
      <div className="flex min-h-dvh items-center justify-center text-muted">
        <Icon name="progress_activity" className="animate-spin" />
      </div>
    );
  if (phase === "signedOut") return <SignIn />;
  if (phase === "denied") return <Denied />;

  const online = status ? Object.values(status).filter((s) => s.online).length : null;
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <div className="min-h-dvh md:flex">
      {/* Sidebar (Desktop) */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line/40 bg-s-lowest md:flex">
        <div className="flex items-center gap-3 px-5 py-5">
          <Logo />
          <div className="min-w-0">
            <div className="text-[15px] font-semibold">Omni Admin</div>
            <div className="truncate text-[12px] text-muted">Zentrale App-Steuerung</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] ${
                active(n.href) ? "bg-accent text-on-accent" : "text-ink hover:bg-s-low"
              }`}
            >
              <Icon name={n.icon} size={20} />
              {n.label === "Optionen" ? "Einstellungen" : n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 flex items-center justify-between px-6 text-[11px] font-semibold uppercase tracking-wider text-muted">
          Verbundene Apps <Badge tone="ok">{APPS.length}</Badge>
        </div>
        <nav className="mt-2 flex flex-col gap-0.5 overflow-y-auto px-3">
          {APPS.map((a) => (
            <Link
              key={a.id}
              href={`/apps/${a.id}`}
              className={`flex items-center gap-3 rounded-lg px-3 py-1.5 text-[13px] ${
                path === `/apps/${a.id}` ? "bg-s-high font-semibold" : "hover:bg-s-low"
              }`}
            >
              <Icon name={a.icon} size={18} className="text-muted" />
              <span className="truncate">{a.name}</span>
              <span
                className={`ml-auto h-1.5 w-1.5 rounded-full ${
                  !status ? "bg-outline" : status[a.id]?.online ? "bg-ok" : "bg-err"
                }`}
              />
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-line/40 p-4">
          <div className="mb-3 flex items-center justify-between rounded-lg bg-s-low px-3 py-2 text-[12px]">
            Systemstatus
            <Badge tone={online === APPS.length ? "ok" : online === null ? "neutral" : "warn"} dot>
              {online ?? "–"}/{APPS.length} online
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[12px] font-semibold text-s-lowest">
              MS
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-semibold">Marco Schlude</div>
              <div className="truncate text-[11px] text-muted">{admin ?? "Inhaber"}</div>
            </div>
            <button aria-label="Abmelden" className="rounded-lg p-2 text-muted hover:bg-s-low" onClick={signOut}>
              <Icon name="logout" size={20} />
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Kopfzeile (Mobil) */}
        <header className="sticky top-0 z-40 bg-surface/85 backdrop-blur-xl md:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex min-w-0 items-center gap-2">
              <Logo />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[15px] font-semibold">
                  Omni Admin <Badge tone="ok" dot>{guests.length} Gäste</Badge>
                </div>
                <div className="truncate text-[12px] text-muted">Marco Schlude</div>
              </div>
            </div>
            <Link href="/einstellungen" aria-label="Einstellungen" className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[12px] font-semibold text-s-lowest">
              MS
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-3 md:px-8 md:pb-12 md:pt-8">{children}</main>

        {/* Navigation unten (Mobil) */}
        <nav className="pb-safe fixed inset-x-0 bottom-0 z-50 bg-surface/90 shadow-[0_-2px_10px_rgba(11,28,48,0.06)] backdrop-blur-xl md:hidden">
          <div className="flex h-16 items-center justify-around">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`flex h-12 min-w-[70px] flex-col items-center justify-center gap-0.5 text-[11px] ${
                  active(n.href) ? "font-semibold text-accent" : "text-muted"
                }`}
              >
                <Icon name={n.icon} size={22} />
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
