"use client";

import Link from "next/link";
import { useState } from "react";
import { APPS } from "@/lib/apps";
import { useSession } from "@/lib/session";
import { Badge, Icon, PageHead, StatusBadge, btn } from "@/components/ui";

function Kpi({ label, icon, value, sub, tone = "text-accent", href }: { label: string; icon: string; value: string; sub: string; tone?: string; href?: string }) {
  const cls = "flex flex-col rounded-xl bg-s-lowest p-4 shadow-card";
  const body = (
    <>
      <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-muted">
        {label}
        <Icon name={icon} size={16} className={tone} />
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 flex items-center justify-between text-[12px] text-muted">
        {sub}
        {href && <Icon name="chevron_right" size={16} />}
      </div>
    </>
  );
  return href ? (
    <Link href={href} className={`${cls} transition active:scale-[0.98] hover:bg-s-low`}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

function since(iso: string | null) {
  if (!iso) return "wird geprüft …";
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  return s < 60 ? "gerade eben geprüft" : `vor ${Math.round(s / 60)} Min. geprüft`;
}

export default function Overview() {
  const { guests, appsOf, status, statusAt, reloadStatus } = useSession();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"alle" | "online" | "offline">("alle");
  const [busy, setBusy] = useState(false);

  const online = status ? APPS.filter((a) => status[a.id]?.online).length : null;
  const list = APPS.filter((a) => {
    const q = query.trim().toLowerCase();
    if (q && !`${a.name} ${a.description}`.toLowerCase().includes(q)) return false;
    if (filter === "online") return status?.[a.id]?.online;
    if (filter === "offline") return status && !status[a.id]?.online;
    return true;
  });

  const refresh = async () => {
    setBusy(true);
    await reloadStatus();
    setBusy(false);
  };

  return (
    <>
      <div className="mb-2 flex items-center justify-between gap-2">
        <Badge tone={online === APPS.length ? "ok" : online === null ? "neutral" : "warn"} dot>
          {online ?? "–"}/{APPS.length} Apps online
        </Badge>
        <button onClick={refresh} className="flex items-center gap-1 text-[12px] text-muted">
          <Icon name="sync" size={14} className={busy ? "animate-spin" : ""} /> {since(statusAt)}
        </button>
      </div>
      <PageHead
        title="Übersicht"
        sub="Alle deine Apps für Familie & Freunde"
        action={
          <Link href="/einladen" className={`${btn.primary} hidden md:inline-flex`}>
            <Icon name="person_add" size={18} /> Person einladen
          </Link>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        <Kpi label="Apps" icon="apps" value={String(APPS.length)} sub="nur für eingeladene Gäste" />
        <Kpi label="Online" icon="cloud_done" value={online === null ? "–" : String(online)} sub="gerade erreichbar" tone="text-ok" />
        <Kpi label="Gäste" icon="group" value={String(guests.length)} sub="eingeladene Personen" href="/gaeste" />
        <Kpi label="Einladen" icon="person_add" value="+" sub="neue Person" tone="text-warn" href="/einladen" />
      </div>

      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="App suchen …"
            className="h-10 w-full rounded-lg bg-s-low pl-9 pr-3 text-[13px] placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex gap-1.5">
          {(["alle", "online", "offline"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                filter === f ? "bg-accent text-on-accent" : "bg-s-mid text-muted"
              }`}
            >
              {f === "alle" ? `Alle (${APPS.length})` : f === "online" ? "Online" : "Nicht erreichbar"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2 md:gap-3">
        {list.map((a) => (
          <div key={a.id} className="flex flex-col gap-3 rounded-xl bg-s-lowest p-4 shadow-card">
            <div className="flex items-start justify-between gap-2">
              <Link href={`/apps/${a.id}`} className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-primary">
                  <Icon name={a.icon} size={22} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-semibold">{a.name}</span>
                  <span className="block truncate text-[12px] text-muted">{new URL(a.url).host}</span>
                </span>
              </Link>
              <StatusBadge s={status?.[a.id]} />
            </div>
            <p className="text-[13px] text-muted">{a.description}</p>
            <div className="flex items-center justify-between rounded-lg bg-s-low/60 px-3 py-2 text-[12px] text-muted">
              <Link href={`/gaeste?app=${a.id}`} className="flex items-center gap-1 rounded-lg py-1 pr-2 font-medium text-ink">
                <Icon name="group" size={16} /> {guests.filter((g) => appsOf(g).includes(a.id)).length} Gäste
                <Icon name="chevron_right" size={14} className="text-muted" />
              </Link>
              <span className="flex gap-1.5">
                <Link href={`/apps/${a.id}`} className="rounded-lg bg-s-lowest px-2.5 py-1 font-medium text-ink">
                  Details
                </Link>
                <a href={a.url} target="_blank" rel="noreferrer" className="flex items-center gap-0.5 rounded-lg bg-s-lowest px-2.5 py-1 font-medium text-accent">
                  Öffnen <Icon name="arrow_outward" size={14} />
                </a>
              </span>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="py-8 text-center text-[13px] text-muted">Keine App passt zur Suche.</p>}
      </div>
    </>
  );
}
