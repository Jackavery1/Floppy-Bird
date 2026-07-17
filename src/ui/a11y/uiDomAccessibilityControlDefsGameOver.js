import { MIN_CTA_TOUCH, TOUCH_TARGETS, UI_LAYOUT } from '../shared/uiLayoutConstants.js';

/** Boutons overlay a11y — écran game over. */
export const GAME_OVER_CONTROL_DEFS = Object.freeze({
    gameOverRestart: {
        id: 'a11y-gameover-restart',
        label: 'Rejouer',
        x: TOUCH_TARGETS.gameOverRestart.x,
        y: TOUCH_TARGETS.gameOverRestart.y,
        width: 240,
        height: MIN_CTA_TOUCH,
    },
    gameOverMenu: {
        id: 'a11y-gameover-menu',
        label: 'Retour au menu',
        x: TOUCH_TARGETS.gameOverMenu.x,
        y: TOUCH_TARGETS.gameOverMenu.y,
        width: UI_LAYOUT.menuBtn.width,
        height: MIN_CTA_TOUCH,
    },
});
