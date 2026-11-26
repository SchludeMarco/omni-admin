"use client";

import Link from "next/link";
import { useState } from "react";
import { APPS } from "@/lib/apps";
import { useSession } from "@/lib/session";
import { Avatar, Badge, Icon, PageHead, btn } from "@/components/ui";

export default function Guests() {
  const { guests, admin, removeGuest, reloadGuests, guestsConfigured, error } = useSession();
  const [query, setQuery] = useState("");
  const [confirm, setConfirm] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const list = guests.filter((g) => !q || g.includes(q));

  const remove = async (email: string) => {
    setBusy(email);
    const r = await removeGuest(email);
    setBusy(null);
    setConfirm(null);
    setMsg(r.ok ? `${email} hat keinen Zugang mehr.` : r.error || "Fehler");
  };

  return (
    <>
      <PageHead
        title="Gäste"
        sub="Eine Liste für alle Apps"
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
      {msg && (
        <p className="mb-3 flex items-center justify-between rounded-xl bg-ok-bg p-3 text-[13px] text-ok">
          {msg}
          <button onClick={() => setMsg(null)} aria-label="Schließen">
            <Icon name="close" size={16} />
          </button>
        </p>
      )}

      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-s-lowest py-2 text-center shadow-card">
          <div className="text-[12px] text-muted">Gäste</div>
          <div className="text-[17px] font-bold">{guests.length}</div>
        </div>
        <div className="rounded-lg bg-s-lowest py-2 text-center shadow-card">
          <div className="text-[12px] text-ok">Apps</div>
          <div className="text-[17px] font-bold text-ok">{APPS.length}</div>
        </div>
        <div className="rounded-lg bg-s-lowest py-2 text-center shadow-card">
          <div className="text-[12px] text-muted">Prüfung</div>
          <div className="text-[17px] font-bold">täglich</div>
        </div>
      </div>

      <div className="mb-3 flex gap-2">
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

      <div className="flex flex-col gap-2">
        {admin && (!q || admin.includes(q)) && (
          <div className="flex items-center gap-3 rounded-xl bg-s-lowest p-4 shadow-card">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-[13px] font-semibold text-s-lowest">MS</span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-semibold">Marco Schlude</div>
              <div className="truncate text-[12px] text-muted">{admin}</div>
            </div>
            <Badge tone="accent">Inhaber</Badge>
          </div>
        )}

        {list.map((g) => (
          <div key={g} className="flex flex-col gap-3 rounded-xl bg-s-lowest p-4 shadow-card">
            <div className="flex items-center gap-3">
              <Avatar email={g} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-semibold">{g.split("@")[0]}</div>
                <div className="truncate text-[12px] text-muted">{g}</div>
              </div>
              <Badge tone="ok" dot>
                Eingeladen
              </Badge>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] text-muted">Zugang: alle {APPS.length} Apps</span>
              {confirm === g ? (
                <span className="flex gap-1.5">
                  <button className={btn.soft} onClick={() => setConfirm(null)}>
                    Abbrechen
                  </button>
                  <button className={btn.danger} disabled={busy === g} onClick={() => remove(g)}>
                    <Icon name={busy === g ? "progress_activity" : "block"} size={14} className={busy === g ? "animate-spin" : ""} />
                    Wirklich entfernen
                  </button>
                </span>
              ) : (
                <button className={btn.danger} onClick={() => setConfirm(g)}>
                  <Icon name="person_remove" size={14} /> Entfernen
                </button>
              )}
            </div>
          </div>
        ))}

        {guests.length === 0 && (
          <div className="rounded-xl bg-s-lowest p-8 text-center shadow-card">
            <Icon name="group_add" size={32} className="text-outline" />
            <p className="mt-2 text-[13px] text-muted">Noch keine Gäste – lade die erste Person ein.</p>
          </div>
        )}
        {guests.length > 0 && list.length === 0 && <p className="py-6 text-center text-[13px] text-muted">Niemand passt zur Suche.</p>}
      </div>

      <p className="mt-4 flex gap-1.5 text-[12px] text-muted">
        <Icon name="info" size={16} className="shrink-0" />
        Wer entfernt wird, kommt spätestens nach einem Tag nicht mehr in die Apps – dann prüfen sie die Liste neu.
      </p>
    </>
  );
}
