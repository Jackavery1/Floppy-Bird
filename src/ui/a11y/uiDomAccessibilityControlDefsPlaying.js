import { MIN_CTA_TOUCH, TOUCH_TARGETS } from '../shared/uiLayoutConstants.js';
import { GAME_CONFIG } from '../../config.js';

/** Boutons overlay a11y — jeu en cours et pause. */
export const PLAYING_CONTROL_DEFS = Object.freeze({
    pause: {
        id: 'a11y-pause',
        label: 'Mettre en pause',
        x: TOUCH_TARGETS.pauseButton.x,
        y: TOUCH_TARGETS.pauseButton.y,
        size: MIN_CTA_TOUCH,
    },
    playJump: {
        id: 'a11y-jump',
        label: 'Sauter',
        x: GAME_CONFIG.centerX,
        y: GAME_CONFIG.centerY,
        width: MIN_CTA_TOUCH * 2,
        height: MIN_CTA_TOUCH * 2,
    },
    playTutorialSkip: {
        id: 'a11y-tutorial-skip',
        label: 'Passer le tutoriel',
        x: TOUCH_TARGETS.tutorialSkip.x,
        y: TOUCH_TARGETS.tutorialSkip.y,
        width: 140,
        height: MIN_CTA_TOUCH,
    },
    pauseResume: {
        id: 'a11y-resume',
        label: 'Reprendre la partie',
        x: TOUCH_TARGETS.pauseResume.x,
        y: TOUCH_TARGETS.pauseResume.y,
        size: MIN_CTA_TOUCH,
    },
    pauseMenu: {
        id: 'a11y-menu',
        label: 'Retour au menu',
        x: TOUCH_TARGETS.pauseMenu.x,
        y: TOUCH_TARGETS.pauseMenu.y,
        size: MIN_CTA_TOUCH,
    },
});
