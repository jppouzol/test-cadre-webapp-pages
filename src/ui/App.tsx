import { useState } from 'react';
import { CANAL, NUMERO_PR, TITRE, VERSION } from '../env.ts';
import { stockage } from '../stockage-navigateur.ts';

// Application minimale du modèle : à remplacer par la vraie application.
// Le compteur montre le stockage local cloisonné : production, recette et versions de test ont chacune le leur.
export function App() {
  const [compteur, setCompteur] = useState(() => stockage.lire('compteur', 0));

  function incrementer() {
    const suivant = compteur + 1;
    setCompteur(suivant);
    stockage.ecrire('compteur', suivant);
  }

  return (
    <div className="page">
      {CANAL === 'preview' && <div className="bandeau test">Version de test · PR n° {NUMERO_PR}</div>}
      {CANAL === 'recette' && <div className="bandeau recette">Recette · cumul des derniers développements</div>}
      {CANAL === 'dev' && <div className="bandeau dev">Développement local</div>}
      <main>
        <h1>{TITRE}</h1>
        <button type="button" onClick={incrementer}>
          Compteur : {compteur}
        </button>
      </main>
      <footer>Version {VERSION}</footer>
    </div>
  );
}
