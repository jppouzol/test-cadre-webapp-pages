import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ETAT_INITIAL,
  TAILLE_HISTORIQUE,
  decrementer,
  incrementer,
  lireEtat,
  remettreAZero,
} from '../src/core/compteur.ts';

const D1 = '2026-10-18T10:00:00.000Z';
const D2 = '2026-10-18T10:01:00.000Z';
const D3 = '2026-10-18T10:02:00.000Z';

test('+1 augmente la valeur et note le changement', () => {
  const etat = incrementer(ETAT_INITIAL, D1);
  assert.equal(etat.valeur, 1);
  assert.deepEqual(etat.historique, [{ operation: 'plus', valeur: 1, date: D1 }]);
});

test('−1 diminue la valeur', () => {
  const etat = decrementer(incrementer(incrementer(ETAT_INITIAL, D1), D2), D3);
  assert.equal(etat.valeur, 1);
  assert.deepEqual(etat.historique[0], { operation: 'moins', valeur: 1, date: D3 });
});

test('−1 à 0 ne change rien : plancher à 0, sans entrée dans l\'historique', () => {
  assert.equal(decrementer(ETAT_INITIAL, D1), ETAT_INITIAL);
});

test('la remise à zéro remet la valeur à 0 et se note', () => {
  const etat = remettreAZero(incrementer(incrementer(ETAT_INITIAL, D1), D2), D3);
  assert.equal(etat.valeur, 0);
  assert.deepEqual(etat.historique[0], { operation: 'remise', valeur: 0, date: D3 });
  assert.equal(etat.historique.length, 3);
});

test('la remise à zéro d\'un compteur déjà à 0 ne change rien', () => {
  assert.equal(remettreAZero(ETAT_INITIAL, D1), ETAT_INITIAL);
});

test('l\'historique garde les 10 derniers changements, les plus récents en premier', () => {
  let etat = ETAT_INITIAL;
  for (let i = 1; i <= 15; i++) etat = incrementer(etat, `2026-10-18T10:${String(i).padStart(2, '0')}:00.000Z`);
  assert.equal(etat.valeur, 15);
  assert.equal(etat.historique.length, TAILLE_HISTORIQUE);
  assert.equal(etat.historique[0].valeur, 15);
  assert.equal(etat.historique[TAILLE_HISTORIQUE - 1].valeur, 6);
});

test('les opérations ne modifient pas l\'état reçu', () => {
  const avant = incrementer(ETAT_INITIAL, D1);
  incrementer(avant, D2);
  assert.equal(avant.valeur, 1);
  assert.equal(avant.historique.length, 1);
});

test('lireEtat relit un état mémorisé', () => {
  const etat = incrementer(incrementer(ETAT_INITIAL, D1), D2);
  assert.deepEqual(lireEtat(JSON.parse(JSON.stringify(etat))), etat);
});

test('lireEtat reprend la valeur de la version 0.1.0', () => {
  assert.deepEqual(lireEtat(null, 7), { valeur: 7, historique: [] });
});

test('lireEtat préfère le nouvel état à l\'ancienne valeur', () => {
  const etat = incrementer(ETAT_INITIAL, D1);
  assert.deepEqual(lireEtat(etat, 7), etat);
});

test('lireEtat rend l\'état initial sur des données illisibles', () => {
  assert.deepEqual(lireEtat('n\'importe quoi'), ETAT_INITIAL);
  assert.deepEqual(lireEtat({ valeur: -3, historique: [] }), ETAT_INITIAL);
  assert.deepEqual(lireEtat(null, 'sept'), ETAT_INITIAL);
});

test('lireEtat écarte les changements mal formés', () => {
  const etat = lireEtat({
    valeur: 2,
    historique: [{ operation: 'plus', valeur: 2, date: D2 }, { operation: 'saut', valeur: 9, date: D1 }, 42],
  });
  assert.deepEqual(etat.historique, [{ operation: 'plus', valeur: 2, date: D2 }]);
});
