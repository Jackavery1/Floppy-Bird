---
name: gameplay
description: >-
  Audit gameplay d'un jeu (game feel, difficulté, feedback, équité, profondeur).
  Note /20 avec comparatif versions précédentes. Utiliser quand l'utilisateur
  demande un audit gameplay, game feel, mécaniques, boucle de jeu ou rejouabilité.
  Catégorie audit.
---

# Audit gameplay — /20

## Déclencheur

Un audit gameplay **isolé** (pas l'architecture, la responsive ni la narration).

## Workflow

1. **Explorer** — entités joueur, collisions, config difficulté, états jeu, audio/haptique, UI score
2. **Cartographier** la boucle : menu → jeu → mort → game over → rejouer
3. **Noter** — grille ci-dessous → moyenne arrondie /20
4. **Comparer** — v-1 / v actuelle / Δ
5. **Rédiger** en français

## Grille de notation (/20)

| Critère | Poids indicatif |
|---------|-----------------|
| Mécaniques core (saut, collision, score) | ×1 |
| Game feel (buffer, invincibilité, timing) | ×1 |
| Onboarding / courbe de difficulté | ×1 |
| Feedback (audio, haptique, visuel, juice) | ×1 |
| Cohérence des états (pause, mort, menu) | ×1 |
| Profondeur / rejouabilité | ×1 |

Moyenne des 6 sous-notes → **note /20**.

## Points à vérifier

- Buffer d'input, coyote time, invincibilité spawn
- Délai premier obstacle, escalade difficulté en run
- Hitboxes vs sprites (équité)
- RNG (gaps, spawns) — pics injustes
- Progression (niveaux, records, modes)
- Feedback mort / score / record
- Polish (animations mort, paliers, tutoriel implicite)

## Format de sortie

```markdown
# Audit gameplay — [Projet] (vN)

**Note : X/20** (v précédente : Y/20, Δ …)

## Boucle actuelle
[Schéma texte ou liste]

## Points forts / faibles
…

## Sous-notes
| Critère | v-1 | vN |

## Limites non bloquantes
…

## Recommandations prioritaires
| Priorité | Action | Gain estimé |
```

## Règles

- Français, citations code si utile
- Juger le **ressenti joueur**, pas la stack technique
- Ne pas inclure letterbox, PWA, touch targets (→ skill responsive)
