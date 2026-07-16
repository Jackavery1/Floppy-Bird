import { DESIGN_TOKENS, hexVersPhaser } from '../../designTokens.js';
import { loadSelectedSkin } from '../../metaStorage.js';
import { DIFFICULTY } from '../../config.js';
import { drawDiffButtons } from '../menu/uiMenuLayout.js';
import {
    bindAccessibilityFocus,
    bindUnifiedInteractiveFocus,
} from './uiDomAccessibilityControls.js';
import { refreshSkinsTab } from '../menu/uiMenuSkinsRefresh.js';
import {
    MENU_BTN_COLOR,
    MENU_BTN_HOVER,
    PAUSE_BTN_COLOR,
    PAUSE_BTN_HOVER,
} from '../shared/uiLayout.js';

const SCORES_BTN_COLOR = hexVersPhaser(DESIGN_TOKENS.boutonScores);
const SCORES_BTN_HOVER = hexVersPhaser(DESIGN_TOKENS.boutonScoresHover);
const OPTIONS_BTN_HOVER = hexVersPhaser(DESIGN_TOKENS.boutonMenuHover);

/** @param {import('../core/ui.js').UI} ui */
function bindDifficultyFocusVisuals(ui) {
    if (!ui?._diffBtnLabels?.length) return;
    const keyFor = {
        [DIFFICULTY.EASY]: 'menuDiffEasy',
        [DIFFICULTY.NORMAL]: 'menuDiffNormal',
        [DIFFICULTY.HARD]: 'menuDiffHard',
    };
    for (const { diff, hitZone } of ui._diffBtnLabels) {
        const key = keyFor[diff];
        if (!key) continue;
        const onActive = () => {
            ui._hoveredDifficulty = diff;
            ui._focusedDifficulty = diff;
            drawDiffButtons(ui, ui._currentDifficulty, ui._menuLayout);
        };
        const onIdle = () => {
            ui._hoveredDifficulty = null;
            ui._focusedDifficulty = null;
            drawDiffButtons(ui, ui._currentDifficulty, ui._menuLayout);
        };
        bindUnifiedInteractiveFocus(key, onActive, onIdle).attachHit(hitZone);
    }
}

/** @param {import('../core/ui.js').UI} ui */
function bindMenuStartFocusVisuals(ui) {
    if (!ui?._startText) return;
    const onFocus = () => ui._startText?.setScale?.(1.05);
    const onBlur = () => ui._startText?.setScale?.(1);
    if (ui._startHit) {
        bindUnifiedInteractiveFocus('menuStart', onFocus, onBlur).attachHit(ui._startHit);
    } else {
        bindAccessibilityFocus('menuStart', onFocus, onBlur);
    }
}

/**
 * Focus clavier menu principal — complète bindUnifiedInteractiveFocus des boutons footer.
 * @param {import('../core/ui.js').UI} ui
 */
export function bindMenuAccessibilityFocusVisuals(ui) {
    if (!ui) return;
    bindMenuStartFocusVisuals(ui);
    bindDifficultyFocusVisuals(ui);
}

/** @param {import('../core/ui.js').UI} ui */
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

/**
 * Focus panneau options — onglets et toggles via bindUnifiedInteractiveFocus au build ;
 * re-lie le bouton fermer si le panneau vient d’être construit.
 * @param {import('../core/ui.js').UI} ui
 */
export function bindOptionsAccessibilityFocusVisuals(ui) {
    if (!ui?._optionsCloseHit || !ui._optionsClosePaint) return;
    bindUnifiedInteractiveFocus(
        'menuOptionsClose',
        () => ui._optionsClosePaint(OPTIONS_BTN_HOVER, 0.95),
        () => ui._optionsClosePaint(MENU_BTN_COLOR, 0.9)
    ).attachHit(ui._optionsCloseHit);
}

/**
 * Focus panneau scores — re-lie le bouton fermer après ouverture.
 * @param {import('../core/ui.js').UI} ui
 */
export function bindScoresAccessibilityFocusVisuals(ui) {
    if (!ui?._scoresCloseHit || !ui._scoresClosePaint) return;
    bindUnifiedInteractiveFocus(
        'menuScoresClose',
        () => ui._scoresClosePaint(SCORES_BTN_HOVER, 0.95),
        () => ui._scoresClosePaint(SCORES_BTN_COLOR, 0.9)
    ).attachHit(ui._scoresCloseHit);
}

/** @param {import('../core/ui.js').UI} ui */
export function bindSkinsAccessibilityFocusVisuals(ui) {
    if (!ui) return;
    bindSkinCycleFocusVisuals(ui);
}

/** @param {import('../core/ui.js').UI} ui */
export function bindPlayingAccessibilityFocusVisuals(ui) {
    if (!ui) return;
    bindAccessibilityFocus(
        'playJump',
        () => ui.scoreText?.setScale?.(1.08),
        () => ui.scoreText?.setScale?.(1)
    );
}

export { PAUSE_BTN_COLOR, PAUSE_BTN_HOVER, MENU_BTN_COLOR, MENU_BTN_HOVER };
