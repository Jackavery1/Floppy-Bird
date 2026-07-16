/**
 * Barrel public UI — point d’entrée façade (`sceneSetup` importe `UI` depuis ici).
 *
 * **Contrat façade `UI` (`ui/core/ui.js`)**
 * - Rôle : orchestrateur Phaser lié à `SceneContext` (menu, HUD, pause, game over).
 * - Import prod : `import { UI } from './uiIndex.js'` — éviter d’importer la façade hors tests.
 * - Logique : déléguer aux modules sous `src/ui/{menu,hud,gameOver,a11y,shared}/` ; pas de gameplay.
 * - Extension : implémenter dans le sous-module, enregistrer dans `uiFacadeBind.js` si la scène en a besoin.
 *
 * Carte détaillée : [ARCHITECTURE.md § UI](ARCHITECTURE.md#6-ui-architecture).
 * @module uiIndex
 */

/** Façade principale Phaser */
export { UI } from './ui/core/index.js';
