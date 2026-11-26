import { APPS } from "@/lib/apps";

export const dynamic = "force-dynamic";

// Ist jede App erreichbar? Eine Gästetür (Weiterleitung oder 401) zählt als erreichbar.
async function ping(url: string) {
  const started = Date.now();
  try {
    const res = await fetch(url, { method: "GET", redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(6000) });
    return { online: res.status < 500, code: res.status, ms: Date.now() - started };
  } catch {
    return { online: false, code: 0, ms: Date.now() - started };
  }
}

export async function GET() {
  const results = await Promise.all(APPS.map(async (a) => [a.id, await ping(a.url)] as const));
  return Response.json(
    { checkedAt: new Date().toISOString(), apps: Object.fromEntries(results) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
