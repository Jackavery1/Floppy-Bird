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
