import { useEffect, useState } from 'react';
import { CANAL, NUMERO_PR, TITRE, VERSION } from '../env.ts';
import { stockage } from '../stockage-navigateur.ts';
import {
  decrementer,
  incrementer,
  lireEtat,
  remettreAZero,
  type Changement,
  type EtatCompteur,
} from '../core/compteur.ts';

// Clés du stockage local : « etat-compteur » depuis la v0.2.0, « compteur » (simple nombre) en v0.1.0.
const CLE_ETAT = 'etat-compteur';
const ANCIENNE_CLE = 'compteur';
// Délai pendant lequel un second appui confirme la remise à zéro.
const DELAI_CONFIRMATION_MS = 4000;

const LIBELLES: Record<Changement['operation'], string> = {
  plus: '+1',
  moins: '−1',
  remise: 'Remise à zéro',
};

const formatDate = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'medium' });

function chargerEtat(): EtatCompteur {
  return lireEtat(stockage.lire<unknown>(CLE_ETAT, null), stockage.lire<unknown>(ANCIENNE_CLE, null));
}

export function App() {
  const [etat, setEtat] = useState<EtatCompteur>(chargerEtat);
  const [confirmation, setConfirmation] = useState(false);

  // Sans second appui, la demande de confirmation s'annule d'elle-même.
  useEffect(() => {
    if (!confirmation) return;
    const minuteur = window.setTimeout(() => setConfirmation(false), DELAI_CONFIRMATION_MS);
    return () => window.clearTimeout(minuteur);
  }, [confirmation]);

  function appliquer(operation: (etat: EtatCompteur, date: string) => EtatCompteur) {
    const suivant = operation(etat, new Date().toISOString());
    if (suivant === etat) return;
    setEtat(suivant);
    stockage.ecrire(CLE_ETAT, suivant);
    stockage.effacer(ANCIENNE_CLE);
  }

  function remiseAZero() {
    if (!confirmation) {
      setConfirmation(true);
      return;
    }
    setConfirmation(false);
    appliquer(remettreAZero);
  }

  return (
    <div className="page">
      {CANAL === 'preview' && <div className="bandeau test">Version de test · PR n° {NUMERO_PR}</div>}
      {CANAL === 'recette' && <div className="bandeau recette">Recette · cumul des derniers développements</div>}
      {CANAL === 'dev' && <div className="bandeau dev">Développement local</div>}
      <main>
        <h1>{TITRE}</h1>

        <p className="bienvenue">
          <strong>Bienvenue !</strong> Comptez avec + et −, vos 10 derniers changements s'affichent dessous. Tout
          reste sur cet appareil, même sans réseau.
        </p>

        <p className="valeur" aria-live="polite" aria-label={`Compteur : ${etat.valeur}`}>
          {etat.valeur}
        </p>

        <div className="commandes">
          <button
            type="button"
            className="pas"
            onClick={() => appliquer(decrementer)}
            disabled={etat.valeur === 0}
            aria-label="Retirer 1"
          >
            −
          </button>
          <button type="button" className="pas" onClick={() => appliquer(incrementer)} aria-label="Ajouter 1">
            +
          </button>
        </div>

        <button
          type="button"
          className={confirmation ? 'remise a-confirmer' : 'remise'}
          onClick={remiseAZero}
          disabled={etat.valeur === 0}
        >
          {confirmation ? 'Confirmer la remise à zéro' : 'Remettre à zéro'}
        </button>

        <section className="historique" aria-label="Historique">
          <h2>Derniers changements</h2>
          {etat.historique.length === 0 ? (
            <p className="vide">Aucun changement pour l'instant.</p>
          ) : (
            <ol>
              {etat.historique.map((changement, rang) => (
                <li key={`${changement.date}-${rang}`}>
                  <span className={`operation ${changement.operation}`}>{LIBELLES[changement.operation]}</span>
                  <span className="nouvelle-valeur">→ {changement.valeur}</span>
                  <time dateTime={changement.date}>{formatDate.format(new Date(changement.date))}</time>
                </li>
              ))}
            </ol>
          )}
        </section>
      </main>
      <footer>Version {VERSION}</footer>
    </div>
  );
}
