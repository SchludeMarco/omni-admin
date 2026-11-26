"use client";

// Anmeldung (Google, wie bei RetroMind), Gästeliste, App-Status und Farbschema
// für die ganze App. Das Google-Token bleibt nur in diesem Browser-Tab
// (sessionStorage) und läuft nach etwa einer Stunde ab.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type Token = { accessToken: string; expiresAt: number };
export type AppStatus = { online: boolean; code: number; ms: number };
export type Theme = "hell" | "dunkel" | "system";

type Ctx = {
  phase: "loading" | "signedOut" | "denied" | "ready";
  error: string | null;
  signIn: () => void;
  signOut: () => void;
  guests: string[];
  admin: string | null;
  guestsConfigured: boolean;
  reloadGuests: () => Promise<void>;
  addGuest: (email: string) => Promise<{ ok: boolean; error?: string }>;
  removeGuest: (email: string) => Promise<{ ok: boolean; error?: string }>;
  status: Record<string, AppStatus> | null;
  statusAt: string | null;
  reloadStatus: () => Promise<void>;
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const SessionContext = createContext<Ctx | null>(null);
export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("SessionProvider fehlt");
  return ctx;
};

const TOKEN_KEY = "omni.google.token";
const THEME_KEY = "omni.theme";

function readToken(): Token | null {
  try {
    const t = JSON.parse(sessionStorage.getItem(TOKEN_KEY) || "null") as Token | null;
    return t && t.expiresAt - Date.now() > 60_000 ? t : null;
  } catch {
    return null;
  }
}
function saveToken(t: Token | null) {
  try {
    if (t) sessionStorage.setItem(TOKEN_KEY, JSON.stringify(t));
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* Speicher nicht verfügbar – dann eben nur im Speicher */
  }
}

type TokenResponse = { access_token?: string; expires_in?: number; error?: string };
type TokenClient = { requestAccessToken: (o?: { prompt?: string }) => void };
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (cfg: {
            client_id: string;
            scope: string;
            callback: (r: TokenResponse) => void;
            error_callback?: (e: { type: string }) => void;
          }) => TokenClient;
          revoke: (token: string, done?: () => void) => void;
        };
      };
    };
  }
}

function loadGis(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("gis"));
    document.head.appendChild(s);
  });
}

function applyTheme(t: Theme) {
  const dark = t === "dunkel" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Ctx["phase"]>("loading");
  const [error, setError] = useState<string | null>(null);
  const [guests, setGuests] = useState<string[]>([]);
  const [admin, setAdmin] = useState<string | null>(null);
  const [guestsConfigured, setGuestsConfigured] = useState(true);
  const [status, setStatus] = useState<Record<string, AppStatus> | null>(null);
  const [statusAt, setStatusAt] = useState<string | null>(null);
  const [theme, setThemeState] = useState<Theme>("dunkel");
  const tokenRef = useRef<Token | null>(null);
  const clientRef = useRef<TokenClient | null>(null);

  // Farbschema
  useEffect(() => {
    let t: Theme = "dunkel";
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === "hell" || stored === "dunkel" || stored === "system") t = stored;
    } catch {}
    setThemeState(t);
    applyTheme(t);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      let cur: Theme = "dunkel";
      try {
        cur = (localStorage.getItem(THEME_KEY) as Theme) || "dunkel";
      } catch {}
      if (cur === "system") applyTheme("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch {}
    applyTheme(t);
  }, []);

  const authHeader = (): Record<string, string> =>
    tokenRef.current ? { Authorization: `Bearer ${tokenRef.current.accessToken}` } : {};

  const expired = useCallback(() => {
    tokenRef.current = null;
    saveToken(null);
    setPhase("signedOut");
    setError("Deine Anmeldung ist abgelaufen. Bitte melde dich erneut an.");
  }, []);

  const reloadGuests = useCallback(async () => {
    if (!tokenRef.current) return;
    const res = await fetch("/api/guests", { headers: authHeader(), cache: "no-store" });
    if (res.status === 403) {
      // Abgelaufenes Token oder falsches Konto
      if (!tokenRef.current || tokenRef.current.expiresAt < Date.now()) return expired();
      setPhase("denied");
      return;
    }
    if (!res.ok) {
      setError("Die Gästeliste ist gerade nicht erreichbar. Versuch es gleich noch einmal.");
      setPhase("ready");
      return;
    }
    const data = (await res.json()) as { guests: string[]; admin: string; configured: boolean };
    setGuests(data.guests || []);
    setAdmin(data.admin || null);
    setGuestsConfigured(data.configured !== false);
    setError(null);
    setPhase("ready");
  }, [expired]);

  const reloadStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      const data = (await res.json()) as { apps: Record<string, AppStatus>; checkedAt: string };
      setStatus(data.apps);
      setStatusAt(data.checkedAt);
    } catch {
      /* Status bleibt unbekannt */
    }
  }, []);

  const change = useCallback(
    async (action: "add" | "remove", email: string) => {
      if (!tokenRef.current || tokenRef.current.expiresAt < Date.now()) {
        expired();
        return { ok: false, error: "Anmeldung abgelaufen" };
      }
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({ action, email }),
      });
      const data = (await res.json().catch(() => ({}))) as { guests?: string[]; error?: string };
      if (res.status === 400) return { ok: false, error: "Das ist keine gültige E-Mail-Adresse." };
      if (res.status === 403) {
        expired();
        return { ok: false, error: "Anmeldung abgelaufen" };
      }
      if (!res.ok || !data.guests) return { ok: false, error: "Das hat nicht geklappt. Versuch es gleich noch einmal." };
      setGuests(data.guests);
      return { ok: true };
    },
    [expired],
  );

  const signIn = useCallback(async () => {
    setError(null);
    try {
      if (!clientRef.current) {
        const cfg = (await (await fetch("/api/config")).json()) as { clientId: string | null };
        if (!cfg.clientId) throw new Error("config");
        await loadGis();
        clientRef.current = window.google!.accounts.oauth2.initTokenClient({
          client_id: cfg.clientId,
          scope: "openid email profile",
          callback: (r) => {
            if (!r.access_token) {
              setError("Die Anmeldung wurde abgebrochen.");
              return;
            }
            const t = { accessToken: r.access_token, expiresAt: Date.now() + (r.expires_in || 3600) * 1000 };
            tokenRef.current = t;
            saveToken(t);
            setPhase("loading");
            reloadGuests();
          },
          error_callback: (e) => {
            setError(
              e.type === "popup_closed"
                ? "Das Anmeldefenster wurde geschlossen."
                : "Die Google-Anmeldung ließ sich nicht öffnen. Sind Pop-ups erlaubt?",
            );
          },
        });
      }
      clientRef.current.requestAccessToken({ prompt: "" });
    } catch {
      setError("Die Google-Anmeldung ist gerade nicht verfügbar.");
    }
  }, [reloadGuests]);

  const signOut = useCallback(() => {
    const t = tokenRef.current;
    tokenRef.current = null;
    saveToken(null);
    setGuests([]);
    setPhase("signedOut");
    if (t && window.google?.accounts?.oauth2) window.google.accounts.oauth2.revoke(t.accessToken);
  }, []);

  // Start: gespeichertes Token dieses Tabs weiterverwenden
  useEffect(() => {
    reloadStatus();
    const t = readToken();
    if (t) {
      tokenRef.current = t;
      reloadGuests();
    } else setPhase("signedOut");
  }, [reloadGuests, reloadStatus]);

  const value = useMemo<Ctx>(
    () => ({
      phase,
      error,
      signIn,
      signOut,
      guests,
      admin,
      guestsConfigured,
      reloadGuests,
      addGuest: (e) => change("add", e),
      removeGuest: (e) => change("remove", e),
      status,
      statusAt,
      reloadStatus,
      theme,
      setTheme,
    }),
    [phase, error, signIn, signOut, guests, admin, guestsConfigured, reloadGuests, change, status, statusAt, reloadStatus, theme, setTheme],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
