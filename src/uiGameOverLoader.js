/** Chargement différé de l'écran game over (chunk Vite `ui-gameover`). */

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
        throw new Error('Game over UI not preloaded — call preloadGameOverUI() first');
    }
    return buildFn(...args);
}

/** @internal Tests uniquement */
export function resetGameOverUILoaderForTests() {
    buildFn = null;
    loadPromise = null;
}
