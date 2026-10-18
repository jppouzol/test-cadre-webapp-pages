# Essai Webapp Pages

Application d'essai du cadre Webapp Pages

## Utiliser

L'application est en ligne sur <https://jppouzol.github.io/test-cadre-webapp-pages/>. Elle fonctionne dans un navigateur (téléphone, tablette et PC) et s'installe comme une application ; après une première visite, elle reste utilisable sans réseau.

## Développer

Prérequis : Node.js 22.18 ou plus récent, et Git.

- `npm install` : installer les dépendances
- `npm run dev` : application en local, rechargée à chaque modification
- `npm test` : tests de la logique métier
- `npm run typecheck` : vérification des types
- `npm run build` : version de production dans `dist/`

## Cycle de développement

Chaque évolution part d'une issue et passe par une branche et une demande de fusion. La publication se fait en trois étages :

- version de test de chaque demande de fusion : `https://jppouzol.github.io/test-cadre-webapp-pages/pr-preview/pr-<N>/` ;
- recette, mise à jour à chaque fusion dans `main` : `https://jppouzol.github.io/test-cadre-webapp-pages/recette/` ;
- production, mise à jour à chaque release : `https://jppouzol.github.io/test-cadre-webapp-pages/`.

## Documentation

Les [spécifications](docs/specifications.md) et l'[architecture](docs/architecture.md) sont les documents de référence. Elles sont mises à jour dans les mêmes demandes de fusion que le code.

## Licence

Code sous licence [MIT](LICENSE).
