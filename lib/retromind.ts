// Server-seitig: Omni Admin spricht mit der Admin-Schnittstelle von RetroMind.
// Die prüft selbst, dass das Google-Token zu Marco gehört – Omni Admin braucht
// dafür keine eigenen Geheimnisse.

export const RETROMIND_URL = (process.env.RETROMIND_URL || "https://retromind.vercel.app").replace(/\/$/, "");

export async function retromindAdmin(init: { method: "GET" | "POST"; query?: string; body?: unknown; auth?: string | null }) {
  const res = await fetch(`${RETROMIND_URL}/api/admin${init.query ? `?${init.query}` : ""}`, {
    method: init.method,
    headers: {
      ...(init.auth ? { Authorization: init.auth } : {}),
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}
