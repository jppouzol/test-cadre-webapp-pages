import { BASE } from './env.ts';
import { creerStockage, magasinMemoire, type Magasin } from './core/stockage.ts';

function magasinNavigateur(): Magasin {
  try {
    return window.localStorage;
  } catch {
    return magasinMemoire();
  }
}

// Stockage de l'application, cloisonné par chemin de publication.
export const stockage = creerStockage(BASE, magasinNavigateur());
