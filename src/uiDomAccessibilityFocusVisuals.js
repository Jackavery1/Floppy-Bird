import { DIFFICULTY } from './config.js';
import { DESIGN_TOKENS, hexVersPhaser } from './designTokens.js';
import { loadSelectedSkin } from './metaStorage.js';
import { bindAccessibilityFocus } from './uiDomAccessibilityControls.js';
import { refreshSkinsTab } from './uiMenuSkinsRefresh.js';
import { MENU_BTN_COLOR, MENU_BTN_HOVER, PAUSE_BTN_COLOR, PAUSE_BTN_HOVER } from './uiLayout.js';
import { drawDiffButtons } from './uiMenuLayout.js';

const DIFFICULTY_FOCUS_KEYS = Object.freeze({
    menuDiffEasy: DIFFICULTY.EASY,
    menuDiffNormal: DIFFICULTY.NORMAL,
    menuDiffHard: DIFFICULTY.HARD,
});

const DAILY_BTN_COLOR = hexVersPhaser(DESIGN_TOKENS.boutonDaily);
const DAILY_BTN_HOVER = hexVersPhaser(DESIGN_TOKENS.boutonDailyHover);
const SCORES_BTN_COLOR = hexVersPhaser(DESIGN_TOKENS.boutonScores);
const SCORES_BTN_HOVER = hexVersPhaser(DESIGN_TOKENS.boutonScoresHover);
const SKINS_BTN_COLOR = hexVersPhaser(DESIGN_TOKENS.boutonSkins);
const TAB_INACTIVE = hexVersPhaser(DESIGN_TOKENS.boutonPause);
const TAB_HOVER = hexVersPhaser(DESIGN_TOKENS.boutonMenuHover);

/** @param {keyof typeof import('./uiDomAccessibilityControlDefs.js').CONTROL_DEFS} key @param {import('phaser').GameObjects.Rectangle | null | undefined} bg @param {number} base @param {number} hover @param {number} [baseAlpha] @param {number} [hoverAlpha] */
function bindRectFillFocus(key, bg, base, hover, baseAlpha = 0.88, hoverAlpha = 0.88) {
    if (!bg?.setFillStyle) return;
    bindAccessibilityFocus(
        key,
        () => bg.setFillStyle(hover, hoverAlpha),
        () => bg.setFillStyle(base, baseAlpha)
    );
}

/** @param {keyof typeof import('./uiDomAccessibilityControlDefs.js').CONTROL_DEFS} key @param {(fill: number, alpha?: number) => void} paint @param {number} base @param {number} hover */
function bindGraphicsPaintFocus(key, paint, base, hover) {
    if (!paint) return;
    bindAccessibilityFocus(
        key,
        () => paint(hover, 0.95),
        () => paint(base, 0.9)
    );
}

/** @param {keyof typeof import('./uiDomAccessibilityControlDefs.js').CONTROL_DEFS} key @param {import('phaser').GameObjects.Text | null | undefined} label @param {number} [baseAlpha] */
function bindLabelAlphaFocus(key, label, baseAlpha = 0.92) {
    if (!label?.setAlpha) return;
    bindAccessibilityFocus(
        key,
        () => label.setAlpha(1),
        () => label.setAlpha(baseAlpha)
    );
}

/** @param {import('./ui.js').UI} ui */
function bindDifficultyFocusVisuals(ui) {
    for (const [key, diff] of Object.entries(DIFFICULTY_FOCUS_KEYS)) {
        bindAccessibilityFocus(
            /** @type {keyof typeof import('./uiDomAccessibilityControlDefs.js').CONTROL_DEFS} */ (
                key
            ),
            () => {
                ui._focusedDifficulty = diff;
                if (ui._menuLayout) {
                    drawDiffButtons(ui, ui._currentDifficulty, ui._menuLayout);
                }
            },
            () => {
                if (ui._focusedDifficulty !== diff) return;
                ui._focusedDifficulty = null;
                if (ui._menuLayout) {
                    drawDiffButtons(ui, ui._currentDifficulty, ui._menuLayout);
                }
            }
        );
    }
}

/** @param {import('./ui.js').UI} ui */
function bindOptionsTabFocusVisuals(ui) {
    const tabs = ui._optionsTabButtons;
    if (!tabs?.length) return;

    for (const { id, paint } of tabs) {
        const key = id === 'controls' ? 'menuOptionsTabControls' : 'menuOptionsTabPreferences';
        bindAccessibilityFocus(
            key,
            () => {
                if (ui._optionsActiveTab !== id) paint(TAB_HOVER, 0.88);
            },
            () => {
                if (ui._optionsActiveTab !== id) paint(TAB_INACTIVE, 0.78);
            }
        );
    }
}

/** @param {import('./ui.js').UI} ui */
export function bindMenuAccessibilityFocusVisuals(ui) {
    if (!ui) return;
    bindDifficultyFocusVisuals(ui);
    bindRectFillFocus('menuScores', ui._scoresBtnBg, SCORES_BTN_COLOR, MENU_BTN_HOVER);
    bindRectFillFocus('menuOptions', ui._optionsBtnBg, MENU_BTN_COLOR, MENU_BTN_HOVER);
    bindRectFillFocus('menuSkins', ui._skinsBtnBg, SKINS_BTN_COLOR, MENU_BTN_HOVER);
    bindRectFillFocus('menuDaily', ui._dailyBtnBg, DAILY_BTN_COLOR, DAILY_BTN_HOVER, 0.9, 0.95);
    bindAccessibilityFocus(
        'menuStart',
        () => ui._startText?.setScale?.(1.05),
        () => ui._startText?.setScale?.(1)
    );
}

/** @param {import('./ui.js').UI} ui */
function bindSkinCycleFocusVisuals(ui) {
    const accent = hexVersPhaser(DESIGN_TOKENS.accent);

    const highlight = () => {
        const selected = loadSelectedSkin();
        const cell = ui._skinCells?.find(({ skinId }) => skinId === selected);
        cell?.frame?.setStrokeStyle?.(3, accent);
    };

    const restore = () => {
        refreshSkinsTab(ui);
    };

    bindAccessibilityFocus('menuSkinsPrev', highlight, restore);
    bindAccessibilityFocus('menuSkinsNext', highlight, restore);
}

/** @param {import('./ui.js').UI} ui */
export function bindOptionsAccessibilityFocusVisuals(ui) {
    if (!ui) return;
    bindLabelAlphaFocus('menuTraining', ui._trainingLabel);
    bindLabelAlphaFocus('menuHardcore', ui._hardcoreLabel);
    bindLabelAlphaFocus('menuTrainingSpeed', ui._trainingSpeedLabel);
    bindLabelAlphaFocus('menuMute', ui._muteText, 1);
    bindOptionsTabFocusVisuals(ui);
    bindGraphicsPaintFocus('menuOptionsClose', ui._optionsClosePaint, MENU_BTN_COLOR, TAB_HOVER);
}

/** @param {import('./ui.js').UI} ui */
export function bindScoresAccessibilityFocusVisuals(ui) {
    if (!ui) return;
    bindGraphicsPaintFocus(
        'menuScoresClose',
        ui._scoresClosePaint,
        SCORES_BTN_COLOR,
        SCORES_BTN_HOVER
    );
}

/** @param {import('./ui.js').UI} ui */
export function bindSkinsAccessibilityFocusVisuals(ui) {
    if (!ui) return;
    bindGraphicsPaintFocus('menuSkinsClose', ui._skinsClosePaint, SKINS_BTN_COLOR, MENU_BTN_HOVER);
    bindSkinCycleFocusVisuals(ui);
}

/** @param {import('./ui.js').UI} ui */
export function bindPlayingAccessibilityFocusVisuals(ui) {
    if (!ui) return;
    bindAccessibilityFocus(
        'playJump',
        () => ui.scoreText?.setScale?.(1.08),
        () => ui.scoreText?.setScale?.(1)
    );
}

export { PAUSE_BTN_COLOR, PAUSE_BTN_HOVER };
