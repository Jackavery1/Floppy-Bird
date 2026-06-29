---
name: architecture
description: >-
  Audit architecture et qualité de code d'un jeu ou app (modularité, tests,
  dette technique). Note /20 avec comparatif versions précédentes. Utiliser quand
  l'utilisateur demande un audit architecture, qualité du code, structure du
  projet, maintenabilité ou testabilité. Catégorie audit.
---

# Audit architecture & code — /20

## Déclencheur

Un audit architecture **isolé** (pas le gameplay, la responsive ni la narration).

## Workflow

1. **Explorer** — `src/`, config build/test (Vite, Vitest, ESLint, CI), couverture, `package.json`
2. **Inventorier** — modules, lignes, god-objects, exclusions coverage
3. **Noter** — grille ci-dessous → moyenne arrondie /20
4. **Comparer** — tableau v-1 / v actuelle / Δ si audits antérieurs connus
5. **Rédiger** en français, concis, actionnable

## Grille de notation (/20)

| Critère | Poids indicatif |
|---------|-----------------|
| Modularité & séparation | ×1 |
| Lisibilité & conventions | ×1 |
| Testabilité & couverture | ×1 |
| Maintenabilité | ×1 |
| Extensibilité | ×1 |
| Robustesse (bugs latents, dette) | ×1 |

Moyenne des 6 sous-notes → **note /20** (arrondi 0,5).

## Points à vérifier

- Taille des fichiers (>300 L = signal)
- Orchestrateurs / god-objects
- Séparation domaine / UI / I/O / config
- Stratégie tests (unitaires, smoke, e2e, mocks)
- Fichiers exclus de coverage et pourquoi
- TODO/FIXME, code mort, imports orphelins
- Outillage (linter, CI, docs structure)

## Format de sortie

```markdown
# Audit architecture — [Projet] (vN)

**Note : X/20** (v précédente : Y/20, Δ …)

## Synthèse
[2–3 phrases]

## Points forts
| … |

## Points faibles
| Problème | Gravité | Impact note |

## Sous-notes
| Critère | v-1 | vN |

## Recommandations prioritaires
| Priorité | Action | Gain estimé |
```

## Règles

- Répondre en **français**
- Citer le code avec `startLine:endLine:filepath`
- Ne pas confondre avec audit gameplay, responsive ou narration
- Si pas d'audit précédent : indiquer « première baseline »
