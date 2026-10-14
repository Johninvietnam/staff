// Service worker: makes the app installable and lets it open without signal.
// Bump VERSION whenever you upload a new index.html so phones pick up the update.
const VERSION = "ntb-v23";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./firebase-config.js",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Never touch live database / login traffic.
  if (url.hostname.endsWith("googleapis.com") && !url.hostname.startsWith("fonts.")) return;
  if (url.hostname.endsWith("firebaseio.com") || url.hostname.endsWith("firebaseapp.com")) return;
  const save = res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res; };
  // App files: try the network first (so updates arrive), fall back to the saved copy.
  if (url.origin === location.origin) {
    // "no-cache" asks GitHub for the newest copy every time (cheap: unchanged files aren't re-downloaded).
    e.respondWith(fetch(req.url, { cache: "no-cache", credentials: "same-origin" }).then(save)
      .catch(() => caches.match(req).then(m => m || caches.match("./index.html"))));
    return;
  }
  // Firebase SDK and fonts: use the saved copy, download once.
  if (url.hostname === "www.gstatic.com" || url.hostname.startsWith("fonts.")) {
    e.respondWith(caches.match(req).then(m => m || fetch(req).then(save)));
  }
});

// Tapping a notification opens (or focuses) the app.
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) { if ("focus" in c) return c.focus(); }
    return self.clients.openWindow("./");
  }));
});
