# Essai Webapp Pages — Spécifications

Document de référence du projet. Toute évolution du périmètre y est reportée, dans la même demande de fusion que le code concerné.

## Vision et objectif

Application d'essai du cadre Webapp Pages : un compteur mémorisé sur l'appareil, assez simple pour être vite construit, assez réel pour faire passer au cadre tout le cycle d'une évolution, de l'issue à la production.

## Principes directeurs

- Simplicité d'abord : une seule page, un minimum de boutons, utilisable d'une main sur téléphone.

## Utilisateurs et cas d'usage

Un utilisateur seul compte quelque chose au fil de la journée (des verres d'eau, des passages, des essais) et veut retrouver sa valeur et ses derniers changements en rouvrant l'application, même sans réseau.

## Supports visés

téléphone, tablette et PC. La mise en page et les essais sont conçus pour ces supports.

## Fonctionnalités

- Compteur affiché en grand, à 0 au premier lancement.
- Bouton « + » : ajoute 1.
- Bouton « − » : retire 1. Le compteur ne descend pas sous 0 : le bouton est désactivé à 0.
- Remise à zéro avec confirmation : un premier appui demande de confirmer, un second appui dans les secondes qui suivent remet le compteur à 0. Sans second appui, la demande s'annule d'elle-même. Désactivée quand le compteur est déjà à 0.
- Historique des 10 derniers changements, les plus récents en haut : opération (+1, −1, remise à zéro), nouvelle valeur, date et heure.
- La valeur et l'historique sont mémorisés sur l'appareil et retrouvés à la réouverture, y compris hors ligne. La valeur mémorisée par la version 0.1.0 est reprise.

## Hors périmètre

- Export et import des données en fichier : issue #3.
- Plusieurs compteurs, pas différent de 1, objectif à atteindre.

## Points ouverts

Aucun.
