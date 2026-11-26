// Minimaler Service Worker, damit sich Omni Admin als App installieren lässt.
// Er speichert nichts zwischen: alle Anfragen gehen direkt ans Netz.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request));
});
