/**
 * Service worker de PWA: cachea la aplicación, NO sus partidas personales.
 * Guardado = IndexedDB, no Cache Storage. No escribir tokens, sesiones ni JSON aquí.
 * Estrategia de lectura: red primero, caché como contingencia sin conexión.
 * Al cambiar recursos estáticos de forma incompatible, elevar el sufijo CACHE.
 */
// El identificador versiona únicamente la caché de recursos públicos.
const CACHE = 'tama-academico-shell-v9';
const SHELL = ['./','./index.html','./src/main.js','./src/ui/app.js','./src/ui/pet-animation.js','./src/styles.css','./src/core/commands.js','./src/core/state.js','./src/core/errors.js','./src/core/engine-needs.js','./src/core/engine-health.js','./src/core/game-coordinator.js','./src/core/engine-game.js','./src/core/persistence.js','./src/data/catalog.js','./src/data/stage-activities.js','./src/data/learning-path.js','./src/data/learning-sequences.js','./src/data/scene-world.js','./src/data/activity-extras.js','./src/data/pet-visuals.js','./pets/fisico.svg','./pets/biologia.svg','./pets/medicina.svg','./pets/humanidades.svg','./pets/sociales.svg','./pets/agro.svg','./pets/ingenieria.svg','./manifest.webmanifest','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png'];
// Precache de shell para abrir la interfaz tras una primera visita exitosa.
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
// Borra cachés antiguas de esta aplicación (cuidado si se añaden otras familias).
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k !== CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
// No interceptar escrituras ni peticiones externas; degradar a caché si falla red.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok){const copy=response.clone(); caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
    return response;
  }).catch(()=>caches.match(event.request).then(found=>found||caches.match('./index.html'))));
});
