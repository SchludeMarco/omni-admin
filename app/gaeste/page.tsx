"use client";

import Link from "next/link";
import { useState } from "react";
import { APPS } from "@/lib/apps";
import { useSession } from "@/lib/session";
import { AppChips, AppPicker } from "@/components/AppPicker";
import { Avatar, Badge, Icon, PageHead, btn } from "@/components/ui";

function GuestCard({ email }: { email: string }) {
  const { appsOf, setGuestApps, removeGuest } = useSession();
  const apps = appsOf(email);
  const [mode, setMode] = useState<"view" | "edit" | "remove">("view");
  const [draft, setDraft] = useState<string[]>(apps);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (draft.length === 0) return setError("Wähl mindestens eine App aus – oder entferne den Gast.");
    setBusy(true);
    const r = await setGuestApps(email, draft.length === APPS.length ? null : draft);
    setBusy(false);
    if (!r.ok) return setError(r.error || "Das hat nicht geklappt.");
    setError(null);
    setMode("view");
  };
  const remove = async () => {
    setBusy(true);
    const r = await removeGuest(email);
    setBusy(false);
    if (!r.ok) setError(r.error || "Das hat nicht geklappt.");
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-s-lowest p-4 shadow-card">
      <div className="flex items-center gap-3">
        <Avatar email={email} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-semibold">{email.split("@")[0]}</div>
          <div className="truncate text-[12px] text-muted">{email}</div>
        </div>
        <Badge tone="ok" dot>
          {apps.length === APPS.length ? "Alle Apps" : `${apps.length} ${apps.length === 1 ? "App" : "Apps"}`}
        </Badge>
      </div>

      {mode === "edit" ? (
        <>
          <AppPicker value={draft} onChange={setDraft} />
          {error && <p className="text-[12px] text-err">{error}</p>}
          <div className="flex justify-end gap-1.5">
            <button className={btn.soft} onClick={() => { setDraft(apps); setError(null); setMode("view"); }}>
              Abbrechen
            </button>
            <button className={btn.accentSm} disabled={busy} onClick={save}>
              <Icon name={busy ? "progress_activity" : "check"} size={14} className={busy ? "animate-spin" : ""} /> Speichern
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-1">
            <AppChips ids={apps} />
          </div>
          {error && <p className="text-[12px] text-err">{error}</p>}
          <div className="flex justify-end gap-1.5">
            {mode === "remove" ? (
              <>
                <button className={btn.soft} onClick={() => setMode("view")}>
                  Abbrechen
                </button>
                <button className={btn.danger} disabled={busy} onClick={remove}>
                  <Icon name={busy ? "progress_activity" : "block"} size={14} className={busy ? "animate-spin" : ""} /> Wirklich entfernen
                </button>
              </>
            ) : (
              <>
                <button className={btn.soft} onClick={() => { setDraft(apps); setMode("edit"); }}>
                  <Icon name="tune" size={14} /> Apps ändern
                </button>
                <button className={btn.danger} onClick={() => setMode("remove")}>
                  <Icon name="person_remove" size={14} /> Entfernen
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function Guests() {
  const { guests, admin, appsOf, reloadGuests, guestsConfigured, error } = useSession();
  const [query, setQuery] = useState("");
  const [appFilter, setAppFilter] = useState<string>("alle");

  const q = query.trim().toLowerCase();
  const list = guests.filter((g) => (!q || g.includes(q)) && (appFilter === "alle" || appsOf(g).includes(appFilter)));
  const limited = guests.filter((g) => appsOf(g).length < APPS.length).length;

  return (
    <>
      <PageHead
        title="Gäste"
        sub="Wer eingeladen ist und für welche Apps"
        action={
          <Link href="/einladen" className={`${btn.primary} h-10`}>
            <Icon name="person_add" size={18} /> Einladen
          </Link>
        }
      />

      {!guestsConfigured && (
        <p className="mb-3 rounded-xl bg-warn-bg p-3 text-[13px] text-warn">
          Die Gästeliste ist bei RetroMind noch nicht eingerichtet. Ohne sie sind die Apps für alle offen.
        </p>
      )}
      {error && <p className="mb-3 rounded-xl bg-err-bg p-3 text-[13px] text-err">{error}</p>}

      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-s-lowest py-2 text-center shadow-card">
          <div className="text-[12px] text-muted">Gäste</div>
          <div className="text-[17px] font-bold">{guests.length}</div>
        </div>
        <div className="rounded-lg bg-s-lowest py-2 text-center shadow-card">
          <div className="text-[12px] text-ok">Alle Apps</div>
          <div className="text-[17px] font-bold text-ok">{guests.length - limited}</div>
        </div>
        <div className="rounded-lg bg-s-lowest py-2 text-center shadow-card">
          <div className="text-[12px] text-warn">Einzelne Apps</div>
          <div className="text-[17px] font-bold text-warn">{limited}</div>
        </div>
      </div>

      <div className="mb-2 flex gap-2">
        <div className="relative flex-1">
          <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="E-Mail suchen …"
            className="h-10 w-full rounded-lg bg-s-lowest pl-9 pr-3 text-[13px] shadow-card placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <button aria-label="Neu laden" onClick={() => reloadGuests()} className="flex h-10 w-10 items-center justify-center rounded-lg bg-s-lowest text-muted shadow-card">
          <Icon name="refresh" />
        </button>
      </div>
      <div className="-mx-4 mb-3 flex gap-1.5 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
        {[{ id: "alle", name: "Alle" }, ...APPS].map((a) => (
          <button
            key={a.id}
            onClick={() => setAppFilter(a.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold ${
              appFilter === a.id ? "bg-accent text-on-accent" : "bg-s-mid text-muted"
            }`}
          >
            {a.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {admin && appFilter === "alle" && (!q || admin.includes(q)) && (
          <div className="flex flex-col gap-3 rounded-xl bg-s-lowest p-4 shadow-card">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-[13px] font-semibold text-s-lowest">MS</span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-semibold">Marco Schlude</div>
                <div className="truncate text-[12px] text-muted">{admin}</div>
              </div>
              <Badge tone="accent">Inhaber</Badge>
            </div>
            <div className="flex flex-wrap gap-1">
              <AppChips ids={APPS.map((a) => a.id)} />
            </div>
          </div>
        )}

        {list.map((g) => (
          <GuestCard key={g} email={g} />
        ))}

        {guests.length === 0 && (
          <div className="rounded-xl bg-s-lowest p-8 text-center shadow-card">
            <Icon name="group_add" size={32} className="text-outline" />
            <p className="mt-2 text-[13px] text-muted">Noch keine Gäste – lade die erste Person ein.</p>
          </div>
        )}
        {guests.length > 0 && list.length === 0 && <p className="py-6 text-center text-[13px] text-muted">Niemand passt zu Suche oder Filter.</p>}
      </div>

      <p className="mt-4 flex gap-1.5 text-[12px] text-muted">
        <Icon name="info" size={16} className="shrink-0" />
        Wer ganz entfernt wird, kommt spätestens nach einem Tag in keine App mehr. Nimmst du einzelne Apps weg, greift das,
        sobald der Gast dort das nächste Mal durch die Tür muss.
      </p>
    </>
  );
}
