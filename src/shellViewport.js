import { GAME_STATE } from './gameState.js';
import { isCoarsePointer } from './device.js';

const VIEWPORT_MENU =
    'width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes, viewport-fit=cover, interactive-widget=resizes-content';
const VIEWPORT_GAME_TOUCH =
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content';

/** @param {string} state */
export function viewportContentForState(state) {
    const partieActive =
        state === GAME_STATE.PLAYING ||
        state === GAME_STATE.PAUSED ||
        state === GAME_STATE.DYING;
    if (!partieActive) return VIEWPORT_MENU;
    if (!isCoarsePointer()) return VIEWPORT_MENU;
    return VIEWPORT_GAME_TOUCH;
}

/** @param {string} state @param {Document | undefined} [doc] */
export function syncShellViewport(state, doc) {
    const root = doc ?? (typeof document !== 'undefined' ? document : null);
    const meta = root?.querySelector?.('meta[name="viewport"]');
    if (!meta) return;
    meta.setAttribute('content', viewportContentForState(state));
}
