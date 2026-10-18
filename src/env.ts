// Contexte d'exécution de l'application, fixé à la construction.
export const TITRE = 'Essai Webapp Pages';

// prod : release publiée · recette : cumul des fusions dans main · preview : une demande de fusion.
export type Canal = 'prod' | 'recette' | 'preview' | 'dev';

export const CANAL: Canal = import.meta.env.VITE_CANAL ?? 'dev';
export const NUMERO_PR: string = import.meta.env.VITE_PR ?? '';
// Une release porte son étiquette (v1.2.0) ; les autres versions, le début du commit.
const versionBrute: string = import.meta.env.VITE_VERSION ?? 'locale';
export const VERSION: string = versionBrute.startsWith('v') ? versionBrute : versionBrute.slice(0, 7);
// Chemin de publication, terminé par « / » : sert aussi de préfixe au stockage local.
export const BASE: string = import.meta.env.BASE_URL;
