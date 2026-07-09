import { MIN_TOUCH, TOUCH_TARGETS, UI_LAYOUT } from './uiLayoutConstants.js';
import { GAME_CONFIG } from './config.js';

export const MENU_CONTROL_KEYS = Object.freeze([
    'menuDiffEasy',
    'menuDiffNormal',
    'menuDiffHard',
    'menuStart',
    'menuDaily',
    'menuScores',
    'menuOptions',
    'menuSkins',
]);

export const OPTIONS_TAB_CONTROL_KEYS = Object.freeze([
    'menuOptionsTabControls',
    'menuOptionsTabPreferences',
]);

export const OPTIONS_CONTROL_KEYS = Object.freeze([
    ...OPTIONS_TAB_CONTROL_KEYS,
    'menuTraining',
    'menuTrainingSpeed',
    'menuHardcore',
    'menuMute',
    'menuOptionsClose',
]);

export const SCORES_PANEL_CONTROL_KEYS = Object.freeze(['menuScoresClose']);

export const SKINS_PANEL_CONTROL_KEYS = Object.freeze([
    'menuSkinsPrev',
    'menuSkinsNext',
    'menuSkinsClose',
]);

export const GAME_OVER_CONTROL_KEYS = Object.freeze(['gameOverRestart', 'gameOverMenu']);

export const PLAYING_CONTROL_KEYS = Object.freeze(['pause', 'playJump']);

export const PAUSE_OVERLAY_CONTROL_KEYS = Object.freeze(['pauseResume', 'pauseMenu']);

export const CONTROL_DEFS = Object.freeze({
    pause: {
        id: 'a11y-pause',
        label: 'Mettre en pause',
        x: TOUCH_TARGETS.pauseButton.x,
        y: TOUCH_TARGETS.pauseButton.y,
        size: 44,
    },
    playJump: {
        id: 'a11y-jump',
        label: 'Sauter',
        x: GAME_CONFIG.centerX,
        y: GAME_CONFIG.centerY,
        width: MIN_TOUCH * 2,
        height: MIN_TOUCH * 2,
    },
    pauseResume: {
        id: 'a11y-resume',
        label: 'Reprendre la partie',
        x: TOUCH_TARGETS.pauseResume.x,
        y: TOUCH_TARGETS.pauseResume.y,
        size: 44,
    },
    pauseMenu: {
        id: 'a11y-menu',
        label: 'Retour au menu',
        x: TOUCH_TARGETS.pauseMenu.x,
        y: TOUCH_TARGETS.pauseMenu.y,
        size: 44,
    },
    menuStart: {
        id: 'a11y-start',
        label: 'Appuyer pour jouer',
        x: TOUCH_TARGETS.menuStart.x,
        y: TOUCH_TARGETS.menuStart.y,
        width: 240,
        height: MIN_TOUCH,
    },
    menuDaily: {
        id: 'a11y-daily',
        label: 'Défi du jour',
        x: TOUCH_TARGETS.menuDaily.x,
        y: TOUCH_TARGETS.menuDaily.y,
        width: 228,
        height: MIN_TOUCH,
    },
    menuScores: {
        id: 'a11y-scores',
        label: 'Scores',
        x: TOUCH_TARGETS.menuScores.x,
        y: TOUCH_TARGETS.menuScores.y,
        width: UI_LAYOUT.menu.menuBtnW,
        height: MIN_TOUCH,
    },
    menuOptions: {
        id: 'a11y-options',
        label: 'Options',
        x: TOUCH_TARGETS.menuOptions.x,
        y: TOUCH_TARGETS.menuOptions.y,
        width: UI_LAYOUT.menu.menuBtnW,
        height: MIN_TOUCH,
    },
    menuSkins: {
        id: 'a11y-skins',
        label: 'Skins',
        x: TOUCH_TARGETS.menuSkins.x,
        y: TOUCH_TARGETS.menuSkins.y,
        width: UI_LAYOUT.menu.menuBtnW,
        height: MIN_TOUCH,
    },
    menuDiffEasy: {
        id: 'a11y-diff-easy',
        label: 'Difficulté facile',
        x: TOUCH_TARGETS.menuDiffEasy.x,
        y: TOUCH_TARGETS.menuDiffEasy.y,
        width: UI_LAYOUT.diffBtn.width,
        height: MIN_TOUCH,
    },
    menuDiffNormal: {
        id: 'a11y-diff-normal',
        label: 'Difficulté normale',
        x: TOUCH_TARGETS.menuDiffNormal.x,
        y: TOUCH_TARGETS.menuDiffNormal.y,
        width: UI_LAYOUT.diffBtn.width,
        height: MIN_TOUCH,
    },
    menuDiffHard: {
        id: 'a11y-diff-hard',
        label: 'Difficulté difficile',
        x: TOUCH_TARGETS.menuDiffHard.x,
        y: TOUCH_TARGETS.menuDiffHard.y,
        width: UI_LAYOUT.diffBtn.width,
        height: MIN_TOUCH,
    },
    menuTraining: {
        id: 'a11y-training',
        label: 'Mode entraînement',
        x: TOUCH_TARGETS.menuTraining.x,
        y: TOUCH_TARGETS.menuTraining.y,
        width: 220,
        height: MIN_TOUCH,
    },
    menuTrainingSpeed: {
        id: 'a11y-training-speed',
        label: 'Vitesse entraînement',
        x: TOUCH_TARGETS.menuTrainingSpeed.x,
        y: TOUCH_TARGETS.menuTrainingSpeed.y,
        width: 220,
        height: MIN_TOUCH,
    },
    menuHardcore: {
        id: 'a11y-hardcore',
        label: 'Mode hardcore',
        x: TOUCH_TARGETS.menuHardcore.x,
        y: TOUCH_TARGETS.menuHardcore.y,
        width: 220,
        height: MIN_TOUCH,
    },
    menuOptionsTabControls: {
        id: 'a11y-options-tab-controls',
        label: 'Onglet contrôles',
        x: TOUCH_TARGETS.menuOptionsTabControls.x,
        y: TOUCH_TARGETS.menuOptionsTabControls.y,
        width: UI_LAYOUT.optionsPanel.tabBtnW,
        height: MIN_TOUCH,
    },
    menuOptionsTabPreferences: {
        id: 'a11y-options-tab-preferences',
        label: 'Onglet réglages',
        x: TOUCH_TARGETS.menuOptionsTabPreferences.x,
        y: TOUCH_TARGETS.menuOptionsTabPreferences.y,
        width: UI_LAYOUT.optionsPanel.tabBtnW,
        height: MIN_TOUCH,
    },
    menuMute: {
        id: 'a11y-mute',
        label: 'Volume sonore',
        x: TOUCH_TARGETS.menuMute.x,
        y: TOUCH_TARGETS.menuMute.y,
        width: 160,
        height: MIN_TOUCH,
    },
    menuSkinsPrev: {
        id: 'a11y-skin-prev',
        label: 'Skin précédent',
        x: TOUCH_TARGETS.menuSkinsPrev.x,
        y: TOUCH_TARGETS.menuSkinsPrev.y,
        width: MIN_TOUCH,
        height: MIN_TOUCH,
    },
    menuSkinsNext: {
        id: 'a11y-skin-next',
        label: 'Skin suivant',
        x: TOUCH_TARGETS.menuSkinsNext.x,
        y: TOUCH_TARGETS.menuSkinsNext.y,
        width: MIN_TOUCH,
        height: MIN_TOUCH,
    },
    menuOptionsClose: {
        id: 'a11y-options-close',
        label: 'Fermer les options',
        x: TOUCH_TARGETS.menuOptionsClose.x,
        y: TOUCH_TARGETS.menuOptionsClose.y,
        width: 160,
        height: MIN_TOUCH,
    },
    menuScoresClose: {
        id: 'a11y-scores-close',
        label: 'Fermer les scores',
        x: TOUCH_TARGETS.menuScoresClose.x,
        y: TOUCH_TARGETS.menuScoresClose.y,
        width: 160,
        height: MIN_TOUCH,
    },
    menuSkinsClose: {
        id: 'a11y-skins-close',
        label: 'Fermer les skins',
        x: TOUCH_TARGETS.menuSkinsClose.x,
        y: TOUCH_TARGETS.menuSkinsClose.y,
        width: 160,
        height: MIN_TOUCH,
    },
    gameOverRestart: {
        id: 'a11y-gameover-restart',
        label: 'Rejouer',
        x: TOUCH_TARGETS.gameOverRestart.x,
        y: TOUCH_TARGETS.gameOverRestart.y,
        width: 240,
        height: MIN_TOUCH,
    },
    gameOverMenu: {
        id: 'a11y-gameover-menu',
        label: 'Retour au menu',
        x: TOUCH_TARGETS.gameOverMenu.x,
        y: TOUCH_TARGETS.gameOverMenu.y,
        width: UI_LAYOUT.menuBtn.width,
        height: MIN_TOUCH,
    },
});
