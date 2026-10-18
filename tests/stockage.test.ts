import test from 'node:test';
import assert from 'node:assert/strict';
import { creerStockage, magasinMemoire } from '../src/core/stockage.ts';

test('production et prévisualisation ne partagent pas leurs données', () => {
  const magasin = magasinMemoire();
  const production = creerStockage('/appli/', magasin);
  const previsualisation = creerStockage('/appli/pr-preview/pr-3/', magasin);
  production.ecrire('compteur', 5);
  assert.equal(previsualisation.lire('compteur', 0), 0);
  assert.equal(production.lire('compteur', 0), 5);
});

test('une valeur illisible rend la valeur par défaut', () => {
  const magasin = magasinMemoire();
  magasin.setItem('/appli/compteur', '{pas du JSON');
  assert.equal(creerStockage('/appli/', magasin).lire('compteur', 0), 0);
});

test('effacer retire la valeur', () => {
  const stockage = creerStockage('/appli/', magasinMemoire());
  stockage.ecrire('compteur', 2);
  stockage.effacer('compteur');
  assert.equal(stockage.lire('compteur', 0), 0);
});
