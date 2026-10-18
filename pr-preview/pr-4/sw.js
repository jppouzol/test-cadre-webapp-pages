// Service worker : l'application reste utilisable hors ligne après une première visite.
// Enregistré en production (/<dépôt>/) et en recette (/<dépôt>/recette/). Celui de la
// production ne prend jamais en charge la recette ni les versions de test, qui partagent
// son origine et vivent sous son chemin.
const VERSION_CACHE = 'v1';
const BASE = new URL('./', self.location).pathname;
// Les caches sont communs à toute l'origine : chaque instance ne touche qu'aux siens.
const CACHE = `${VERSION_CACHE}@${BASE}`;
const SOUS_SITES = ['pr-preview/', 'recette/'].map((dossier) => BASE + dossier);

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.add(BASE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((noms) =>
        Promise.all(noms.filter((nom) => nom.endsWith(`@${BASE}`) && nom !== CACHE).map((nom) => caches.delete(nom))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const requete = event.request;
  const url = new URL(requete.url);
  if (requete.method !== 'GET' || url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(BASE) || SOUS_SITES.some((chemin) => url.pathname.startsWith(chemin))) return;

  // Pages : le réseau d'abord, pour toujours servir la dernière version ; le cache hors ligne.
  if (requete.mode === 'navigate') {
    event.respondWith(
      fetch(requete)
        .then((reponse) => {
          const copie = reponse.clone();
          caches.open(CACHE).then((cache) => cache.put(BASE, copie));
          return reponse;
        })
        .catch(() => caches.match(BASE, { cacheName: CACHE })),
    );
    return;
  }

  // Fichiers (noms uniques à chaque construction) : le cache d'abord, mis à jour en arrière-plan.
  event.respondWith(
    caches.match(requete, { cacheName: CACHE }).then((enCache) => {
      const reseau = fetch(requete)
        .then((reponse) => {
          if (reponse.ok) {
            const copie = reponse.clone();
            caches.open(CACHE).then((cache) => cache.put(requete, copie));
          }
          return reponse;
        })
        .catch(() => enCache);
      return enCache || reseau;
    }),
  );
});
