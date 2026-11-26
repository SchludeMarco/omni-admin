"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APPS } from "@/lib/apps";
import { useSession } from "@/lib/session";
import { Galaxy } from "./Galaxy";
import { HubLogo } from "./HubLogo";
import { Badge, Icon, btn } from "./ui";

const NAV = [
  { href: "/", label: "Übersicht", icon: "dashboard" },
  { href: "/gaeste", label: "Gäste", icon: "group" },
  { href: "/einladen", label: "Einladen", icon: "person_add" },
  { href: "/einstellungen", label: "Optionen", icon: "settings" },
];

function Logo() {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent">
      <HubLogo size={28} />
    </span>
  );
}

function Space({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden p-6 text-white">
      <Galaxy />
      <div className="relative z-10 w-full max-w-sm">{children}</div>
    </div>
  );
}

function SignIn() {
  const { signIn, error } = useSession();
  return (
    <Space>
      <div className="flex flex-col items-center text-center">
        <div className="hub-glow mb-6 flex h-32 w-32 items-center justify-center rounded-[2rem] bg-gradient-to-br from-[#5b4ff0] to-[#3525b8] ring-1 ring-white/20">
          <HubLogo size={116} animated />
        </div>
        <h1 className="bg-gradient-to-r from-white via-[#d9d6ff] to-[#a5b4fc] bg-clip-text text-4xl font-bold tracking-tight text-transparent">
          Omni Admin
        </h1>
        <p className="mt-2 text-[14px] text-white/70">Einstellungen und Einladungen für alle deine Apps an einem Ort.</p>
        <button
          className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white/95 text-[14px] font-semibold text-[#1e1b4b] shadow-[0_0_30px_rgba(129,140,248,0.45)] transition active:scale-[0.98]"
          onClick={signIn}
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
          </svg>
          Mit Google anmelden
        </button>
        {error && <p className="mt-3 text-[12px] text-red-300">{error}</p>}
        <p className="mt-5 text-[11px] text-white/45">Nur für den Inhaber. Gäste melden sich direkt in den Apps an.</p>
      </div>
    </Space>
  );
}

function Denied() {
  const { signOut } = useSession();
  return (
    <Space>
      <div className="rounded-2xl bg-white/5 p-6 text-center ring-1 ring-white/10 backdrop-blur-md">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 text-red-300">
          <Icon name="lock" />
        </div>
        <h1 className="text-lg font-semibold">Kein Zugriff</h1>
        <p className="mt-1 text-[13px] text-white/70">Mit diesem Google-Konto kannst du Omni Admin nicht verwalten.</p>
        <button className="mt-5 h-10 w-full rounded-lg bg-white/10 text-[13px] font-medium" onClick={signOut}>
          Anderes Konto verwenden
        </button>
      </div>
    </Space>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const { phase, status, admin, guests, signOut } = useSession();
  const path = usePathname();

  if (phase === "loading")
    return (
      <Space>
        <div className="hub-glow mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#5b4ff0] to-[#3525b8]">
          <HubLogo size={78} animated />
        </div>
      </Space>
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
