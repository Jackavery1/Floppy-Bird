import { PLAYING_CONTROL_DEFS } from './uiDomAccessibilityControlDefsPlaying.js';
import { MENU_CONTROL_DEFS } from './uiDomAccessibilityControlDefsMenu.js';
import { GAME_OVER_CONTROL_DEFS } from './uiDomAccessibilityControlDefsGameOver.js';

/** Définitions géométriques et labels des boutons overlay a11y (#a11y-controls). */
export const CONTROL_DEFS = Object.freeze({
    ...PLAYING_CONTROL_DEFS,
    ...MENU_CONTROL_DEFS,
    ...GAME_OVER_CONTROL_DEFS,
});
