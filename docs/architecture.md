# Essai Webapp Pages — Architecture technique

Ce document traduit les [spécifications](specifications.md) en choix techniques. Il est tenu à jour dans les demandes de fusion qui modifient l'architecture.

## Synthèse

Application web statique, sans serveur, en TypeScript et React, construite avec Vite et publiée sur GitHub Pages.

## Organisation du code

- `src/core` : logique métier, sans dépendance au navigateur ni à React, couverte par les tests de `tests/`.
  - `src/core/compteur.ts` : état du compteur (valeur et historique des 10 derniers changements) et ses opérations, sous forme de fonctions pures qui rendent un nouvel état. La date de chaque changement est fournie par l'appelant, ce qui rend les tests déterministes.
- `src/ui` : interface React.
- `src/env.ts` : canal (production, recette, version de test, développement), version et chemin de publication, fixés à la construction.
- `src/stockage-navigateur.ts` et `src/core/stockage.ts` : stockage local cloisonné par chemin de publication.
- `src/pwa.ts` et `public/sw.js` : fonctionnement hors ligne, en production et en recette.

## Publication

- Chaque demande de fusion : tests, vérification des types et construction (`ci.yml`), puis version de test sur `/test-cadre-webapp-pages/pr-preview/pr-<N>/` (`preview.yml`), retirée à la fermeture.
- Chaque fusion dans `main` : recette sur `/test-cadre-webapp-pages/recette/` (`ci.yml`).
- Chaque release publiée : production à la racine (`release.yml`), en préservant `recette/` et `pr-preview/`.
- GitHub Pages sert la branche `gh-pages`.

## Registre des décisions

| Date | Décision | Raison |
| --- | --- | --- |
| 2026-10-19 | Message de bienvenue fixe, dans l'interface seule (`src/ui`), sans état ni stockage | Toujours affiché et jamais fermé : aucune logique à tester dans `src/core` |
| 2026-10-18 | État du compteur mémorisé sous la clé `etat-compteur`, l'ancienne clé `compteur` (simple nombre) étant reprise à la première lecture | Conserver la valeur des utilisateurs de la version 0.1.0 |
| 2026-10-18 | Historique limité aux 10 derniers changements, tronqué à l'écriture | Stockage borné, page simple ; un historique complet viendra avec l'export (issue #3) si besoin |
| 2026 | Projet démarré à partir du cadre Webapp Pages | Méthode et socle technique communs aux projets construits avec ce cadre |
