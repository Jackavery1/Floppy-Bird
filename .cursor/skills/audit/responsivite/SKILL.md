---
name: responsivite
description: >-
  Audit responsivité et UX mobile/desktop d'un jeu web (letterbox, safe-area,
  touch, PWA, e2e). Note /20 avec comparatif versions précédentes. Utiliser quand
  l'utilisateur demande un audit responsive, mobile, tactile, viewport, PWA ou
  adaptation écran. Catégorie audit.
---

# Audit responsivité — /20

## Déclencheur

Un audit responsive **isolé** (pas l'architecture, le gameplay ni la narration).

## Workflow

1. **Explorer** — `viewport`, CSS, `index.html`, layout UI, device hints, PWA manifest, e2e viewport
2. **Tester mentalement** desktop, mobile portrait, paysage, PWA standalone
3. **Noter** — grille ci-dessous → moyenne arrondie /20
4. **Comparer** — v-1 / v actuelle / Δ
5. **Rédiger** en français

## Grille de notation (/20)

| Critère | Poids indicatif |
|---------|-----------------|
| Letterbox / scaling | ×1 |
| Expérience tactile (zones 44px, pause menu) | ×1 |
| PWA & offline | ×1 |
| Desktop / clavier | ×1 |
| Safe area & encoches (viewport-fit=cover) | ×1 |
| Tests e2e / CI multi-viewports | ×1 |

Moyenne des 6 sous-notes → **note /20**.

## Points à vérifier

- Résolution interne fixe + letterbox CSS
- `viewport-fit=cover`, `safe-area-inset`, `visualViewport`
- `touch-action`, scroll/zoom bloqués en jeu
- Boutons pause/menu accessibles au touch (pas clavier seul)
- Hint paysage : bloquant ou informatif
- Chargement : masqué au `ready`, erreur si pas de bundler (Live Server vs Vite)
- PWA : manifest, SW, orientation, theme-color cohérent
- e2e : desktop + mobile portrait + paysage en CI

## Piège fréquent

**Live Server ≠ Vite** : si `index.html` charge `/src/main.js` en module, Live Server ne bundle pas → écran « Chargement… » infini. Vérifier que le README recommande `npm run dev`.

## Format de sortie

```markdown
# Audit responsivité — [Projet] (vN)

**Note : X/20** (v précédente : Y/20, Δ …)

## Comportement par device
| Device | v-1 | vN |

## Sous-notes
| Critère | v-1 | vN |

## Points faibles restants
| Problème | Impact |

## Recommandations prioritaires
| Priorité | Action | Gain estimé |
```

## Règles

- Français
- Ne pas inclure la profondeur gameplay (→ skill gameplay)
- Mentionner explicitement si tests e2e absents ou CI desktop-only
