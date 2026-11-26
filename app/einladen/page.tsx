"use client";

import Link from "next/link";
import { useState } from "react";
import { APPS } from "@/lib/apps";
import { useSession } from "@/lib/session";
import { AppChips, AppPicker } from "@/components/AppPicker";
import { Avatar, Card, CardTitle, Icon, PageHead, btn } from "@/components/ui";

const validEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 200;

function inviteText(name: string, email: string, note: string, ids: string[]) {
  const hello = name.trim() ? `Hallo ${name.trim()},` : "Hallo,";
  const apps = APPS.filter((a) => ids.includes(a.id)).map((a) => `• ${a.name} – ${a.description}: ${a.url}`).join("\n");
  return [
    hello,
    "",
    note.trim() || "ich habe dich zu meinen Apps eingeladen.",
    "",
    apps,
    "",
    `Melde dich einfach mit deinem Google-Konto ${email} an – dann bist du drin.`,
    "",
    "Viele Grüße",
    "Marco",
  ].join("\n");
}

export default function Invite() {
  const { addGuest, guests } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [apps, setApps] = useState<string[]>(APPS.map((a) => a.id));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const clean = email.trim().toLowerCase();
  const already = guests.includes(clean);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validEmail(clean)) return setError("Bitte gib eine gültige E-Mail-Adresse ein.");
    if (apps.length === 0) return setError("Wähl mindestens eine App aus.");
    setBusy(true);
    const r = await addGuest(clean, apps.length === APPS.length ? null : apps);
    setBusy(false);
    if (!r.ok) return setError(r.error || "Das hat nicht geklappt.");
    setDone(clean);
  };

  if (done) {
    const text = inviteText(name, done, note, apps);
    const copy = async () => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* Kopieren nicht erlaubt */
      }
    };
    return (
      <>
        <PageHead title="Eingeladen!" sub="Jetzt nur noch Bescheid sagen" />
        <Card className="mb-3">
          <div className="flex items-center gap-3">
            <Avatar email={done} />
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold">{name.trim() || done.split("@")[0]}</div>
              <div className="truncate text-[12px] text-muted">{done}</div>
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ok-bg text-ok">
              <Icon name="check" size={18} />
            </span>
          </div>
          <p className="mt-3 text-[13px] text-muted">
            Steht jetzt auf der Gästeliste. Schick die Nachricht unten, damit die Person davon erfährt.
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            <AppChips ids={apps} />
          </div>
        </Card>
        <Card className="mb-3">
          <CardTitle icon="chat" title="Nachricht" />
          <pre className="whitespace-pre-wrap rounded-lg bg-s-low p-3 font-sans text-[13px]">{text}</pre>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <a className={btn.soft} href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer">
              <Icon name="sms" size={16} /> WhatsApp
            </a>
            <a className={btn.soft} href={`mailto:${done}?subject=${encodeURIComponent("Einladung zu meinen Apps")}&body=${encodeURIComponent(text)}`}>
              <Icon name="mail" size={16} /> E-Mail
            </a>
            <button className={btn.soft} onClick={copy}>
              <Icon name={copied ? "check" : "content_copy"} size={16} /> {copied ? "Kopiert" : "Kopieren"}
            </button>
          </div>
        </Card>
        <div className="flex gap-2">
          <button
            className={`${btn.primary} flex-1`}
            onClick={() => {
              setDone(null);
              setName("");
              setEmail("");
              setNote("");
              setApps(APPS.map((a) => a.id));
            }}
          >
            <Icon name="person_add" size={18} /> Weitere Person
          </button>
          <Link href="/gaeste" className={`${btn.soft} h-11 flex-1`}>
            Zur Gästeliste
          </Link>
        </div>
      </>
    );
  }

  return (
    <form onSubmit={submit}>
      <PageHead title="Neue Einladung" sub="Eine Person für deine Apps freischalten" />

      <Card className="mb-3">
        <CardTitle icon="badge" title="Person" />
        <label className="mb-1 block text-[12px] font-medium text-muted" htmlFor="email">
          Google-E-Mail-Adresse <span className="text-err">*</span>
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="z. B. oma.erika@gmail.com"
          className="mb-1 h-11 w-full rounded-lg bg-s-low px-3 text-[14px] placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <p className="mb-3 text-[11px] text-muted">Die Adresse, mit der sich die Person bei Google anmeldet.</p>
        <label className="mb-1 block text-[12px] font-medium text-muted" htmlFor="name">
          Vorname <span className="text-outline">(nur für die Nachricht)</span>
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="z. B. Erika"
          className="h-11 w-full rounded-lg bg-s-low px-3 text-[14px] placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </Card>

      <Card className="mb-3">
        <CardTitle
          icon="apps"
          title="Zugang zu"
          right={<span className="text-[11px] font-semibold text-muted">{apps.length === APPS.length ? "alle Apps" : `${apps.length} von ${APPS.length}`}</span>}
        />
        <AppPicker value={apps} onChange={setApps} />
      </Card>

      <Card className="mb-4">
        <CardTitle icon="chat_bubble" title="Persönliche Nachricht" right={<span className="text-[11px] text-outline">optional</span>} />
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="z. B. Schau dir mal Rumble an – perfekt für den nächsten Spieleabend!"
          className="w-full resize-none rounded-lg bg-s-low p-3 text-[14px] placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </Card>

      {already && (
        <p className="mb-3 rounded-xl bg-warn-bg p-3 text-[13px] text-warn">
          Diese Adresse steht schon auf der Gästeliste. Ihre Apps änderst du unter „Gäste“.
        </p>
      )}
      {error && <p className="mb-3 rounded-xl bg-err-bg p-3 text-[13px] text-err">{error}</p>}

      <button type="submit" className={`${btn.primary} w-full`} disabled={busy || already}>
        <Icon name={busy ? "progress_activity" : "send"} size={18} className={busy ? "animate-spin" : ""} />
        {busy ? "Wird eingetragen …" : "Auf die Gästeliste setzen"}
      </button>
    </form>
  );
}
