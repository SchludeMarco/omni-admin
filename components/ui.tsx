import type { AppStatus } from "@/lib/session";

export function Icon({ name, className = "", size = 20 }: { name: string; className?: string; size?: number }) {
  return (
    <span aria-hidden className={`material-symbols-outlined ${className}`} style={{ fontSize: size }}>
      {name}
    </span>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl bg-s-lowest p-4 shadow-card ${className}`}>{children}</section>;
}

export function CardTitle({ icon, title, right }: { icon: string; title: string; right?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-s-high text-accent">
          <Icon name={icon} size={18} />
        </span>
        <h2 className="text-[15px] font-semibold">{title}</h2>
      </div>
      {right}
    </div>
  );
}

const tones = {
  ok: "bg-ok-bg text-ok",
  warn: "bg-warn-bg text-warn",
  err: "bg-err-bg text-err",
  neutral: "bg-s-high text-muted",
  accent: "bg-accent-soft text-primary",
};
const dots = { ok: "bg-ok", warn: "bg-warn", err: "bg-err", neutral: "bg-outline", accent: "bg-primary" };

export function Badge({
  tone = "neutral",
  dot = false,
  children,
}: {
  tone?: keyof typeof tones;
  dot?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dots[tone]}`} />}
      {children}
    </span>
  );
}

export function StatusBadge({ s }: { s: AppStatus | undefined }) {
  if (!s) return <Badge dot>Prüfe …</Badge>;
  return s.online ? (
    <Badge tone="ok" dot>
      Online
    </Badge>
  ) : (
    <Badge tone="err" dot>
      Nicht erreichbar
    </Badge>
  );
}

export function initials(email: string) {
  const name = email.split("@")[0].replace(/[._\-+0-9]+/g, " ").trim();
  const parts = name.split(/\s+/).filter(Boolean);
  const s = parts.length > 1 ? parts[0][0] + parts[1][0] : (parts[0] || email).slice(0, 2);
  return s.toUpperCase();
}

const avatarTones = [
  "bg-accent-soft text-primary",
  "bg-ok-bg text-ok",
  "bg-warn-bg text-warn",
  "bg-s-high text-muted",
];

export function Avatar({ email, size = 40 }: { email: string; size?: number }) {
  let h = 0;
  for (const c of email) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ${avatarTones[h % avatarTones.length]}`}
      style={{ width: size, height: size }}
    >
      {initials(email)}
    </span>
  );
}

export function PageHead({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h1>
        {sub && <p className="text-[13px] text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent px-4 h-11 text-[13px] font-semibold text-on-accent shadow-sm active:scale-[0.98] transition disabled:opacity-60",
  soft: "inline-flex items-center justify-center gap-1.5 rounded-lg bg-s-low px-3 h-9 text-[12px] font-medium text-ink hover:bg-s-mid transition",
  accentSm:
    "inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-3 h-9 text-[12px] font-semibold text-on-accent transition disabled:opacity-60",
  danger:
    "inline-flex items-center justify-center gap-1.5 rounded-lg bg-err-bg px-3 h-9 text-[12px] font-medium text-err hover:opacity-90 transition",
};
