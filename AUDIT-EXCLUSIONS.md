# Exclusions audit — Floppy Bird

Ce fichier liste les éléments **volontairement exclus** des critères d’audit (architecture, couverture, dette).  
Les agents d’audit **ne doivent pas** les signaler comme points faibles, dette résiduelle ou recommandations.

## Couverture Vitest (`vite.config.js`)

| Fichier | Raison |
|---------|--------|
| `src/phaser-shim.js` | Alias build vendor Phaser — pas de logique applicative |
| `src/testSeam.js` | API Playwright E2E uniquement (`VITE_ENABLE_TEST_SEAM`) |
| `src/skins/skinIds.js` | Constantes d’identifiants |
| `src/skins/skinTypes.js` | Typedef JSDoc sans runtime |
| `src/sceneTypes.js` | Contrat JSDoc `SceneContext` — documenté, non exécuté |
| `src/tokensPage.js` | Page doc design tokens (`tokens.html`) — rendu navigateur, non logique jeu |
| `src/testSeam/gameplaySeam.js` | Seam Playwright — couvert par tests e2e et `tests/gameplaySeam.test.js` |
| `src/testSeam/metaSeam.js` | Seam Playwright métadonnées / progression |
| `src/testSeam/uiSeam.js` | Seam Playwright navigation UI |
| `src/testSeam/coreSeam.js` | Seam Playwright état scène de base |

## Choix produit / responsive

| Élément | Raison |
|---------|--------|
| Overlay paysage mobile (`#landscape-hint`) | Choix de design : portrait recommandé sur mobile coarse pointer (hauteur ≤ 520 px). Testé en e2e ; ne pas modifier sans décision produit. |
| Icônes PWA (`public/icons/`) | Générées au build via `npm run icons` — absentes du dépôt source par intention. |

## Seuils CI (référence, non exclus)

- Statements / lines : **94 %**
- Branches : **82 %**
- Functions : **91 %**

## Dettes résolues (2026-07-19)

| Élément | Résolution |
|---------|------------|
| Façade UI | Helpers overlay extraits (`uiOverlayHelpers.js`) ; `showGameOver(opts)` objet unique |
| Deploy Pages | Gate `deploy.needs` = `check` + `lighthouse` + **`e2e`** (matrice 8 VP) |
| CSP styles | `style-src-elem 'self'` (feuilles via `<link>` — compatible Vite/dev) + `style-src-attr 'unsafe-inline'` (letterbox / a11y) ; thème via `data-theme` sans CSSOM |
| Libellé HARDCORE menu | Unifié `HC · …` (aligné badge / scores) |
| Format Prettier WIP | `highScores.js`, `pipeSpawn.js` + tests alignés |
| Score HUD jour fill AA | `accentTitreJour` `#7A3500` (≥4,5:1 sur `fondJour`) |
| Jump buffer equity | `jumpBufferFrames` 2 → **3** (~50 ms @ 60 FPS) |
| Dual buffer saut | `bird.bufferJump` / `_jumpBuffered` retirés — `processJumpBuffer` appelle `bird.jump()` |
| Façade overlays | `clearOverlay` / `createOverlay` / boutons GO liés via `uiFacadeBind` (plus de pass-through `ui.js`) |
| Contraste jour × high-contrast | `--couleur-texte-chargement` jour `#0d47a1` sous `data-contrast-high` / `prefers-contrast` |
| Jump buffer equity (v2) | `jumpBufferFrames` 3 → **6** (~100 ms @ 60 FPS, guideline equity) |
| Feedback mort / paliers | `hapticHeavy` pattern `[40,24,40]` (mort + score ×10) |
| Typo corps menu | `FONT_SIZE_BODY` aligné 13 px (`FONT_SIZE_HINT`) |
| Bannières HUD | Ancrage sous `_scoreHudY` (plus de chevauchement badges) |
| Spacing options/scores | `controlsGap` / tabs / `scoresGap` alignés `SPACING` |
| Hover cellules skins | `pointerover` stroke `accentHover` |
| Tutoriel score | `SCORE_TUTORIAL_HOLD_MS` (plus de magique 2800) |
| FPS debug | `DESIGN_TOKENS.texteHud` |
| Docs escalade | README : gap tighten tous les 10 pts après 25 |

Dernière mise à jour : 2026-07-22 (dettes soft post-audit 20/20).
