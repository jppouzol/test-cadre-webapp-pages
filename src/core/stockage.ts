// Stockage local cloisonné. La production, chaque prévisualisation et le développement
// local partagent la même origine (<compte>.github.io) : chaque clé est préfixée par le
// chemin de publication, pour qu'un essai ne touche jamais aux données de production.

export type Magasin = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export type Stockage = {
  lire<T>(nom: string, defaut: T): T;
  ecrire(nom: string, valeur: unknown): void;
  effacer(nom: string): void;
};

export function creerStockage(base: string, magasin: Magasin): Stockage {
  return {
    lire<T>(nom: string, defaut: T): T {
      try {
        const brut = magasin.getItem(base + nom);
        return brut === null ? defaut : (JSON.parse(brut) as T);
      } catch {
        return defaut;
      }
    },
    ecrire(nom: string, valeur: unknown): void {
      try {
        magasin.setItem(base + nom, JSON.stringify(valeur));
      } catch {
        // Stockage plein ou refusé : l'application continue sans mémoriser.
      }
    },
    effacer(nom: string): void {
      try {
        magasin.removeItem(base + nom);
      } catch {
        // Rien à faire.
      }
    },
  };
}

// Magasin en mémoire : repli quand le navigateur refuse le stockage local, et outil de test.
export function magasinMemoire(): Magasin {
  const valeurs = new Map<string, string>();
  return {
    getItem: (cle) => valeurs.get(cle) ?? null,
    setItem: (cle, valeur) => {
      valeurs.set(cle, valeur);
    },
    removeItem: (cle) => {
      valeurs.delete(cle);
    },
  };
}
