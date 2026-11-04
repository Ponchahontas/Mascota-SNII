/** Service worker: cachea solo recursos propios y nunca guarda datos privados. */
const CACHE = 'tama-academico-shell-v3';
const SHELL = ['./','./index.html','./src/main.js','./src/ui/app.js','./src/styles.css','./src/core/commands.js','./src/core/state.js','./src/core/errors.js','./src/core/engine-needs.js','./src/core/game-coordinator.js','./src/core/engine-game.js','./src/core/persistence.js','./src/data/catalog.js','./src/data/stage-activities.js','./src/data/pet-visuals.js','./pets/fisico.svg','./pets/biologia.svg','./pets/medicina.svg','./pets/humanidades.svg','./pets/sociales.svg','./pets/agro.svg','./pets/ingenieria.svg','./manifest.webmanifest','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k !== CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok){const copy=response.clone(); caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
    return response;
  }).catch(()=>caches.match(event.request).then(found=>found||caches.match('./index.html'))));
});
