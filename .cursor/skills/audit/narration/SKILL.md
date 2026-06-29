---
name: narration
description: >-
  Audit narration et histoire d'un jeu narratif (cutscenes, scènes, portraits,
  textes, cohérence, E2E campagne). Note /20 avec comparatif versions précédentes.
  Utiliser quand l'utilisateur demande un audit narration, narratif, histoire,
  cutscenes, dialogues, VERA ou campagne. Catégorie audit. Grille issue du
  projet Dernière Ligne (audit D).
---

# Audit narration & histoire — /20

## Déclencheur

Un audit narration **isolé** (pas l'architecture, le gameplay ni la responsive).

**Origine :** grille **Audit D** du projet [Dernière Ligne](https://github.com/joris/Derni-re-ligne) (Tetris narratif), sessions v2.5.18 → v2.5.34. Référence transcript : [baseline audits A–D](47d2f237-5494-438a-911e-78732504d076).

## Workflow

1. **Explorer** — modules histoire/cutscene, textes, assets PNG scènes, portraits, SW precache, API test E2E
2. **Cartographier** le flux : victoire monde → recap → cutscene → journal → carte
3. **Noter** — grille D1–D9 ci-dessous → moyenne arrondie /20
4. **Comparer** — v-1 / v actuelle / Δ
5. **Vérifier E2E** si présents : `e2e/audit-d-narratif.spec.mjs`, `e2e/histoire-*.spec.mjs`
6. **Rédiger** en français

## Grille de notation (/20) — 9 dimensions

| ID | Dimension | Points à évaluer |
|----|-----------|------------------|
| D1 | Pont scènes / humeurs | Lignes `{ scene, humeur }` propagées jusqu'au moteur cutscene ; transitions intra-cutscene |
| D2 | Annotations SCENES | Registre scènes documenté ; lazy-load des fonds rares |
| D3 | Registre PNG / SW | Precache SW cohérent ; pas de surcharge eager ; pipeline assets |
| D4 | Portraits & expressions | Canvas portraits, humeurs, anti-dalle ; voix boss alignées |
| D5 | Fragments VERA | Fragments post-monde par monde ; scène + texte attendus |
| D6 | Textes & cohérence | Marqueurs regex par monde ; accents ; cohérence éditoriale |
| D7 | Fin secrète / Trame / Paradoxe | Flags réconciliation ; fins secrètes testées ; ellipse éditoriale assumée |
| D8 | UI mobile histoire | Portraits, objectifs, overlays sans débordement sur mobile |
| D9 | E2E parcours histoire | Specs dédiées ; post-monde par monde ; cutscenes intermédiaires boss (D15) ; secrets narratifs |

Moyenne des 9 sous-notes → **note /20** (arrondi 0,1).

## Fichiers types (Dernière Ligne)

| Fichier | Rôle |
|---------|------|
| `e2e/audit-d-narratif.spec.mjs` | Scénarios audit narratif dédiés |
| `e2e/helpers-narratif.mjs` | Helpers victoire boss, humeurs portrait, pivot cutscene |
| `e2e/histoire-post-monde.spec.mjs` | Assertions scène + texte post-victoire (15 mondes) |
| `e2e/histoire-campagne.spec.mjs` | Parcours campagne, cutscenes intermédiaires |
| `js/histoire-cutscene-fonds.js` | Scènes actives cutscene |
| `js/portraits-cutscene-etat.js` | Humeurs portraits |
| `tests/histoire-textes.test.mjs` | Cohérence textes |
| `tests/corrections-audit.test.mjs` | `SCENES_POST_MONDE`, `MARQUEURS_NARRATIFS_POST_MONDE` |

## Métriques complémentaires

- Nombre de mondes / chapitres avec narratif post-victoire couvert
- E2E audit dédiés passants (ex. 22/22 en v2.5.34)
- Audio narratif par monde (si applicable)
- Campagne complète : narratif activé vs `sansNarratif: true` (dette si raccourci timeout)

## Format de sortie

```markdown
# Audit narration — [Projet] (vN)

**Note : X/20** (v précédente : Y/20, Δ …)

## Synthèse
[2–3 phrases]

## Sous-notes
| ID | Dimension | v-1 | vN | Évolution clé |

## Points forts / faibles
…

## Dette résiduelle
…

## Recommandations prioritaires
| Priorité | Action | Gain estimé |
```

## Règles

- Français
- Ne pas confondre avec audit gameplay (mécaniques Tetris) ni responsive (layout)
- Citer code / specs E2E quand pertinent
- Si pas d'audit précédent : indiquer « première baseline »
- Projet sans narration : signaler que la grille D ne s'applique pas
