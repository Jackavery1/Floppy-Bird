export { CONTROL_DEFS } from './uiDomAccessibilityControlDefs.js';

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

const OPTIONS_TAB_CONTROL_KEYS = Object.freeze([
    'menuOptionsTabControls',
    'menuOptionsTabPreferences',
]);

export const OPTIONS_CONTROL_KEYS = Object.freeze([
    ...OPTIONS_TAB_CONTROL_KEYS,
    'menuTraining',
    'menuTrainingSpeed',
    'menuHardcore',
    'menuMute',
    'menuHaptics',
    'menuOptionsClose',
]);

export const SCORES_PANEL_CONTROL_KEYS = Object.freeze(['menuScoresClose']);

export const SKINS_PANEL_CONTROL_KEYS = Object.freeze([
    'menuSkinsPrev',
    'menuSkinsNext',
    'menuSkinsClose',
]);

export const GAME_OVER_CONTROL_KEYS = Object.freeze(['gameOverRestart', 'gameOverMenu']);

export const PLAYING_CONTROL_KEYS = Object.freeze(['pause', 'playJump', 'playTutorialSkip']);

export const PAUSE_OVERLAY_CONTROL_KEYS = Object.freeze(['pauseResume', 'pauseMenu']);
