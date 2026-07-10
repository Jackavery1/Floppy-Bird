import { GAME_STATE } from './gameState.js';
import { syncShellViewport } from './shellViewport.js';

/** @param {string} state @param {Document | undefined} [doc] */
export function syncShellGameState(state, doc) {
    const root = (doc ?? (typeof document !== 'undefined' ? document : null))?.documentElement;
    if (!root) return;
    const partieActive =
        state === GAME_STATE.PLAYING || state === GAME_STATE.PAUSED || state === GAME_STATE.DYING;
    root.classList.toggle('partie-active', partieActive);
    if (state) root.dataset.gameState = state;
    else root.removeAttribute('data-game-state');
    syncShellViewport(state, doc ?? (typeof document !== 'undefined' ? document : undefined));
}
