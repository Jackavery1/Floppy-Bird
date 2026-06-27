---
name: game-dev-pm
description: >
  PM pour jeux indie 2D/3D : initialisation, phases de dev, revue de code, assets, évolution v1.x.
---

# Game Dev PM

## Workflow

1. **Init** — brief, stack, structure, README
2. **Phase 1** — boucle de jeu + input
3. **Phase 2** — mécaniques (collision, score, états)
4. **Phase 3** — polish (UI, sons, assets)
5. **Phase 4** — itération (bugs, features, versions)

## Stack (2D simple)

Phaser 3 recommandé. Babylon/Three pour 3D léger. Godot/Unity pour projets plus lourds.

## Structure type

```
index.html
README.md
src/          main, scène, entités, ui, utils
assets/       sprites, sons (Phase 3)
tests/
```

## Standards code

- Français pour noms et commentaires utiles
- Code simple et lisible, une classe = une responsabilité
- Commenter le *pourquoi*, pas l'évident

## Déclencheurs

Utiliser pour : nouveau jeu, debug, revue de code, assets, roadmap v1.1+.
