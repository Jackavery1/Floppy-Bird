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

## Dettes volontairement non traitées

| Élément | Raison |
|---------|--------|
| Façade UI (`ui/core/ui.js`) | God-object déjà découpé via `uiFacadeBind` ; refactor A5 non prioritaire |
| Deploy Pages = smoke only | Gate produit documentée : matrice 8 VP bloquante en PR, smoke en deploy |
| `style-src 'unsafe-inline'` | Nécessaire CSSOM (`shellTheme` / a11y / letterbox) — documenté ARCHITECTURE |
| Libellé mode « HARDCORE : … » (menu) | Nom de mode produit ; badge HUD / classement utilisent `HC` |

Dernière mise à jour : 2026-07-16 (v2.0.0 — P0–P2 + dettes audit UI/gameplay traitées).
