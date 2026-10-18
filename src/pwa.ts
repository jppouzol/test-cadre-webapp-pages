import { BASE, CANAL } from './env.ts';

// Le service worker est enregistré en production et en recette, pas en version de test :
// une version de test doit toujours montrer la dernière construction, sans cache.
export function enregistrerServiceWorker(): void {
  if ((CANAL !== 'prod' && CANAL !== 'recette') || !('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${BASE}sw.js`).catch(() => {
      // Pas de mode hors ligne : l'application fonctionne quand même en ligne.
    });
  });
}
