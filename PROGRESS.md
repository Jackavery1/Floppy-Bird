# Progression

## v1.4 — Architecture simplifiée

- Structure **plate** : 10 fichiers JS sous `src/` (plus de `services/`, `entities/`, `levels/`)
- **Supprimé** : `LevelManager`, `public/levels/`, `entityRegistry`, `InputController` (fusionné dans `GameScene`)
- **Renommé** : `assets.js` → `proceduralTextures.js` + `audio.js`
- Niveau unique : `GAME_CONFIG.level.pipeGaps` dans `config.js`
- `icons/` racine supprimé (seulement `public/icons/`)

## Commandes

| Commande | Usage |
|----------|--------|
| `npm run dev` | Développement |
| `npm run build` | Production + PWA |
| `npm test` | 9 tests Vitest |

## Nettoyage final

- Dossiers vides supprimés : `src/config/`, `entities/`, `input/`, `lib/`, `scenes/`, `services/`, `ui/`
- `getScriptedPipeGapY()` dans `config.js` (testable, utilisé par `pipes.js`)
- Icônes PWA versionnées dans `public/icons/` ; Phaser en chunk séparé (Vite)
