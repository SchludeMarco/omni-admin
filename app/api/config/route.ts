import { retromindAdmin } from "@/lib/retromind";

export const dynamic = "force-dynamic";

// Öffentlich: die Google-Client-ID (dieselbe wie bei RetroMind) für den Login.
export async function GET() {
  try {
    const { data } = await retromindAdmin({ method: "GET", query: "view=gate" });
    return Response.json({ clientId: data.clientId ?? null, configured: !!data.configured });
  } catch {
    return Response.json({ clientId: null, configured: false }, { status: 502 });
  }
}
