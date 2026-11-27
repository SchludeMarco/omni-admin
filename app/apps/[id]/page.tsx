"use client";

import Link from "next/link";
import { use } from "react";
import { findApp } from "@/lib/apps";
import { useSession } from "@/lib/session";
import { Avatar, Card, CardTitle, Icon, StatusBadge, btn } from "@/components/ui";

function Row({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-s-low p-2.5">
      <Icon name={icon} size={18} className="text-muted" />
      <span className="w-28 shrink-0 text-[12px] text-muted">{label}</span>
      <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{children}</span>
    </div>
  );
}

export default function AppDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const app = findApp(id);
  const { status, guests: allGuests, appsOf } = useSession();

  if (!app)
    return (
      <div className="py-16 text-center">
        <p className="text-muted">Diese App gibt es nicht.</p>
        <Link href="/" className={`${btn.soft} mt-4`}>
          Zur Übersicht
        </Link>
      </div>
    );

  const s = status?.[app.id];
  const guests = allGuests.filter((g) => appsOf(g).includes(app.id));

  return (
    <>
      <Link href="/" className="mb-3 inline-flex items-center gap-1 text-[13px] text-muted">
        <Icon name="arrow_back" size={18} /> Übersicht
      </Link>

      <Card className="mb-3">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent text-on-accent">
            <Icon name={app.icon} size={34} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold">{app.name}</h1>
              <StatusBadge s={s} />
            </div>
            <p className="text-[13px] text-muted">{app.description}</p>
          </div>
          <a href={app.url} target="_blank" rel="noreferrer" className={btn.primary}>
            App öffnen <Icon name="arrow_outward" size={18} />
          </a>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardTitle icon="info" title="Steckbrief" />
          <div className="flex flex-col gap-1.5">
            <Row icon="language" label="Adresse">
              <a href={app.url} target="_blank" rel="noreferrer" className="text-accent">
                {new URL(app.url).host}
              </a>
            </Row>
            {app.extraUrls?.map((u) => (
              <Row key={u.url} icon="link" label={u.label}>
                <a href={u.url} target="_blank" rel="noreferrer" className="text-accent">
                  {u.url.replace(/^https:\/\//, "")}
                </a>
              </Row>
            ))}
            <Row icon="code" label="GitHub">
              <a href={`https://github.com/${app.repo}`} target="_blank" rel="noreferrer" className="text-accent">
                {app.repo}
              </a>
            </Row>
            <Row icon="speed" label="Antwortzeit">
              {s ? `${s.ms} ms` : "–"}
            </Row>
            <Row icon="lock" label="Zugang">
              Nur freigeschaltete Gäste
            </Row>
          </div>
          {app.note && <p className="mt-3 text-[12px] text-muted">{app.note}</p>}
        </Card>

        <Card>
          <CardTitle
            icon="group"
            title="Wer hat Zugang"
            right={
              <Link href="/einladen" className="text-[12px] font-semibold text-accent">
                + Einladen
              </Link>
            }
          />
          <p className="mb-2 text-[12px] text-muted">{guests.length} von {allGuests.length} Gästen und du.</p>
          <div className="flex max-h-72 flex-col gap-1.5 overflow-y-auto">
            {guests.map((g) => (
              <div key={g} className="flex items-center gap-2.5 rounded-lg bg-s-low p-2">
                <Avatar email={g} size={30} />
                <span className="min-w-0 truncate text-[13px]">{g}</span>
              </div>
            ))}
            {guests.length === 0 && <p className="py-4 text-center text-[13px] text-muted">Noch keine Gäste.</p>}
          </div>
          <Link href="/gaeste" className={`${btn.soft} mt-3 w-full`}>
            Gästeliste verwalten
          </Link>
        </Card>
      </div>
    </>
  );
}
