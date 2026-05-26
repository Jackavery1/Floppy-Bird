# Floppy Bird — Design

## Mécanique
- Tap → saut ; gravité constante (ajustée par difficulté)
- Tuyaux infinis ; score +1 par tuyau passé
- Collision tuyau ou bord écran → mort

## Résolution
- Interne : **288×512** (ratio 9:16)
- Affichage : `resizeCanvas()` dans `main.js` (letterbox, sans déformation)

## Niveau (unique)
- Nom et 8 positions de gap dans `src/config.js` (`level.pipeGaps`)
- Puis spawn aléatoire (positions bornées par `getScriptedPipeGapY`)

## Difficultés (`getDifficulty` + `DIFFICULTY`)

Spawn : `pipeInterval` = frames équivalent 60 FPS entre chaque paire de tuyaux.

| Niveau | Vitesse | Écart | Gravité | Saut | Intervalle |
|--------|---------|-------|---------|------|------------|
| Facile | 1.85 | 142 | 0.30 | -5.7 | 92 |
| Normal | 2.7 | 112 | 0.38 | -6.1 | 76 |
| Difficile | 3.4 | 98 | 0.45 | -6.2 | 68 |

`pipeGaps` scriptés : `[150, 190, 230, 170, 210, 130, 250, 185]` (re-clampés par difficulté).

Physique : `step = (delta/1000) × 60` sur oiseau, tuyaux et sol.

## États (`GAME_STATE`)
`menu` → `playing` ↔ `paused` → `dying` → `gameover` → menu (M) ou rejouer

Règles : `gameStateRules.js`

## Game Over UI
- Overlay plein écran 75 % noir
- Panneau `GAME_OVER_PANEL` (24, 80, 240×340), bordure or
- Score HUD masqué (`hideInGameScore`)

## Technique
- Phaser 3 + Vite + ES modules
- PWA : vite-plugin-pwa / Workbox
- Sprites procéduraux ; sons Web Audio
- Son : cycle 100 % / 50 % / 25 % / muet ; label « indisponible » si pas de Web Audio
