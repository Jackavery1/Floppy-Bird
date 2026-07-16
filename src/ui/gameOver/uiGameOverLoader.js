/** Chargement différé de l'écran game over (import dynamique → chunk `ui-gameover`). */

let buildFn = null;
let loadPromise = null;

/** Précharge le module game over (idempotent). */
export function preloadGameOverUI() {
    if (buildFn) return Promise.resolve(buildFn);
    if (!loadPromise) {
        loadPromise = import('./uiGameOver.js').then((m) => {
            buildFn = m.buildGameOverUI;
            return buildFn;
        });
    }
    return loadPromise;
}

/** @type {typeof import('./uiGameOver.js').buildGameOverUI} */
export function buildGameOverUI(...args) {
    if (!buildFn) {
        throw new Error('UI game over non préchargée — appeler preloadGameOverUI() d’abord');
    }
    return buildFn(...args);
}

/** @internal Tests uniquement */
export function resetGameOverUILoaderForTests() {
    buildFn = null;
    loadPromise = null;
}
