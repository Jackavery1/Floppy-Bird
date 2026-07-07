import { GAME_CONFIG } from './config.js';
import { DESIGN_TOKENS, hexVersPhaser, hudTextStyle, menuTextStyle } from './designTokens.js';
import { addCenteredText, DEPTH, UI_LAYOUT } from './uiLayout.js';

/**
 * Crée la structure du menu options avec 3 sections: Réglages, Contrôles, Modes
 * @param {import('./ui.js').UI} ui
 * @param {import('phaser').GameObjects.GameObject[]} panelElements
 */
export function buildOptionsLayout(ui, panelElements) {
    const scene = ui.scene;
    const panel = UI_LAYOUT.optionsPanel;

    // Section: RÉGLAGES
    const reglagesTitle = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        panel.optionsFirst,
        '⚙️  RÉGLAGES',
        menuTextStyle({
            fontSize: '13px',
            fill: DESIGN_TOKENS.accentGap,
            fontStyle: 'bold',
        }),
        DEPTH.PANEL_FRAME
    );
    panelElements.push(reglagesTitle);
    ui._optionsTitles = ui._optionsTitles || [];
    ui._optionsTitles.push(reglagesTitle);

    const soundLabel = addCenteredText(
        scene,
        GAME_CONFIG.centerX - 60,
        panel.optionsFirst + 25,
        'Son',
        menuTextStyle({ fontSize: '11px', fill: DESIGN_TOKENS.texteClair }),
        DEPTH.PANEL_FRAME
    );
    panelElements.push(soundLabel);

    // Section: CONTRÔLES
    const controlesTitle = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        panel.optionsFirst + 60,
        '⌨️  CONTRÔLES',
        menuTextStyle({
            fontSize: '13px',
            fill: DESIGN_TOKENS.accentScoreHardcore,
            fontStyle: 'bold',
        }),
        DEPTH.PANEL_FRAME
    );
    panelElements.push(controlesTitle);
    ui._optionsTitles.push(controlesTitle);

    const controlsInfo = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        panel.optionsFirst + 85,
        'ESPACE / TAP • Sauter',
        menuTextStyle({ fontSize: '10px', fill: DESIGN_TOKENS.texteHintMenu }),
        DEPTH.PANEL_FRAME
    );
    panelElements.push(controlsInfo);

    // Section: MODES
    const modesTitle = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        panel.optionsFirst + 120,
        '🎮 MODES',
        menuTextStyle({
            fontSize: '13px',
            fill: DESIGN_TOKENS.texteChargement,
            fontStyle: 'bold',
        }),
        DEPTH.PANEL_FRAME
    );
    panelElements.push(modesTitle);
    ui._optionsTitles.push(modesTitle);

    const trainingLabel = addCenteredText(
        scene,
        GAME_CONFIG.centerX - 60,
        panel.optionsFirst + 145,
        'Entraînement',
        menuTextStyle({ fontSize: '11px', fill: DESIGN_TOKENS.texteClair }),
        DEPTH.PANEL_FRAME
    );
    panelElements.push(trainingLabel);

    const hardcoreLabel = addCenteredText(
        scene,
        GAME_CONFIG.centerX - 60,
        panel.optionsFirst + 165,
        'Hardcore',
        menuTextStyle({ fontSize: '11px', fill: DESIGN_TOKENS.accentScoreHardcore }),
        DEPTH.PANEL_FRAME
    );
    panelElements.push(hardcoreLabel);
}
