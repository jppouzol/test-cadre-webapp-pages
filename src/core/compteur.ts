// État du compteur et ses opérations. Fonctions pures : chacune rend un nouvel état.
// La date de chaque changement est fournie par l'appelant (texte ISO 8601).

export const TAILLE_HISTORIQUE = 10;

export type Operation = 'plus' | 'moins' | 'remise';

export type Changement = {
  operation: Operation;
  valeur: number;
  date: string;
};

export type EtatCompteur = {
  valeur: number;
  // Les plus récents en premier.
  historique: Changement[];
};

export const ETAT_INITIAL: EtatCompteur = { valeur: 0, historique: [] };

function changer(etat: EtatCompteur, operation: Operation, valeur: number, date: string): EtatCompteur {
  return {
    valeur,
    historique: [{ operation, valeur, date }, ...etat.historique].slice(0, TAILLE_HISTORIQUE),
  };
}

export function incrementer(etat: EtatCompteur, date: string): EtatCompteur {
  return changer(etat, 'plus', etat.valeur + 1, date);
}

// Le compteur ne descend pas sous 0 : à 0, l'état est rendu inchangé.
export function decrementer(etat: EtatCompteur, date: string): EtatCompteur {
  if (etat.valeur <= 0) return etat;
  return changer(etat, 'moins', etat.valeur - 1, date);
}

// Déjà à 0 : rien à remettre, l'état est rendu inchangé.
export function remettreAZero(etat: EtatCompteur, date: string): EtatCompteur {
  if (etat.valeur === 0) return etat;
  return changer(etat, 'remise', 0, date);
}

function estOperation(valeur: unknown): valeur is Operation {
  return valeur === 'plus' || valeur === 'moins' || valeur === 'remise';
}

function estValeur(valeur: unknown): valeur is number {
  return typeof valeur === 'number' && Number.isInteger(valeur) && valeur >= 0;
}

function estChangement(valeur: unknown): valeur is Changement {
  if (typeof valeur !== 'object' || valeur === null) return false;
  const c = valeur as Record<string, unknown>;
  return estOperation(c.operation) && estValeur(c.valeur) && typeof c.date === 'string';
}

// Reconstitue un état à partir de ce qui a été mémorisé. Accepte l'ancien format de la
// version 0.1.0 (un simple nombre) ; toute donnée illisible rend l'état initial.
export function lireEtat(brut: unknown, ancienneValeur: unknown = null): EtatCompteur {
  if (typeof brut === 'object' && brut !== null) {
    const e = brut as Record<string, unknown>;
    if (estValeur(e.valeur) && Array.isArray(e.historique)) {
      return {
        valeur: e.valeur,
        historique: e.historique.filter(estChangement).slice(0, TAILLE_HISTORIQUE),
      };
    }
  }
  if (estValeur(ancienneValeur)) return { valeur: ancienneValeur, historique: [] };
  return ETAT_INITIAL;
}
