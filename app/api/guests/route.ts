import { retromindAdmin } from "@/lib/retromind";

export const dynamic = "force-dynamic";

const auth = (req: Request) => req.headers.get("authorization");

// Gästeliste lesen (nur Marco – RetroMind prüft das Token).
export async function GET(req: Request) {
  try {
    const { status, data } = await retromindAdmin({ method: "GET", query: "view=guests", auth: auth(req) });
    return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "upstream" }, { status: 502 });
  }
}

// Gast hinzufügen, entfernen oder seine Apps ändern:
// { action: "add" | "remove" | "apps", email, apps?: string[] | null }  (null = alle Apps)
const ACTIONS: Record<string, string> = { add: "guestAdd", remove: "guestRemove", apps: "guestApps" };

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { action?: string; email?: string; apps?: unknown };
  const action = ACTIONS[body.action || ""];
  if (!action || typeof body.email !== "string") return Response.json({ error: "bad_request" }, { status: 400 });
  const apps = Array.isArray(body.apps) ? body.apps.map(String) : null;
  try {
    const { status, data } = await retromindAdmin({
      method: "POST",
      body: { action, email: body.email, apps },
      auth: auth(req),
    });
    return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "upstream" }, { status: 502 });
  }
}
