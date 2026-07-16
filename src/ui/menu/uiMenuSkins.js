import { GAME_CONFIG } from '../../config.js';
import { buildMetaContext } from '../../metaContext.js';
import { applySelectedSkin } from '../../skins/skinSelection.js';
import { ensureBirdTextures } from '../../textures/index.js';
import {
    getSkin,
    listUnlockedSkins,
    SKIN_IDS,
    birdTextureKey,
    isSpecialSkin,
} from '../../skins/index.js';
import {
    DESIGN_TOKENS,
    hexVersPhaser,
    menuHomeTextStyle,
    menuTextStyle,
    panelChromeTextStyle,
} from '../../designTokens.js';
import {
    addCenteredText,
    DEPTH,
    FONT_SIZE_COMPACT,
    FONT_SIZE_HINT,
    MIN_TOUCH,
    stopUiEvent,
    UI_LAYOUT,
} from '../shared/uiLayout.js';
import { buildMenuToggleButton } from './uiMenuPanel.js';
import { refreshSkinsTab } from './uiMenuSkinsRefresh.js';

export { refreshSkinsTab } from './uiMenuSkinsRefresh.js';
export { cycleMenuSkin } from './uiMenuSkinCycle.js';

const SKINS_BTN_COLOR = hexVersPhaser(DESIGN_TOKENS.boutonSkins);
const SKINS_BTN_STROKE = hexVersPhaser(DESIGN_TOKENS.boutonSkinsStroke);

const SKIN_COLS = 4;
const SKIN_CELL_W = 54;
const SKIN_CELL_H = 56;
const SKIN_ROW_GAP = 10;

/**
 * @param {import('../core/ui.js').UI} ui
 * @param {import('phaser').GameObjects.GameObject[]} elements
 * @param {import('phaser').GameObjects.GameObject[]} panelElements
 */
export function buildSkinsTab(ui, elements, panelElements) {
    const scene = ui.scene;
    ensureBirdTextures(scene, SKIN_IDS);
    const panel = UI_LAYOUT.skinsPanel;
    ui._skinsTabElements = [];
    ui._skinCells = [];

    const title = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        panel.skinsTitle,
        'APPARENCE',
        panelChromeTextStyle({
            fontSize: '13px',
            fill: DESIGN_TOKENS.texteChargement,
            fontStyle: 'bold',
            stroke: DESIGN_TOKENS.contourSkins,
        }),
        DEPTH.PANEL_FRAME
    );
    panelElements.push(title);
    elements.push(title);
    ui._skinsTabElements.push(title);

    ui._skinsCountLine = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        panel.skinsSubtitle,
        '',
        menuHomeTextStyle({ fill: DESIGN_TOKENS.texteClair }),
        DEPTH.PANEL_FRAME
    );
    panelElements.push(ui._skinsCountLine);
    elements.push(ui._skinsCountLine);
    ui._skinsTabElements.push(ui._skinsCountLine);

    ui._skinsPatternLine = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        panel.skinsSubtitle + 18,
        '',
        menuHomeTextStyle({ fontSize: FONT_SIZE_COMPACT, fill: DESIGN_TOKENS.badgeDailySecondary }),
        DEPTH.PANEL_FRAME
    );
    panelElements.push(ui._skinsPatternLine);
    elements.push(ui._skinsPatternLine);
    ui._skinsTabElements.push(ui._skinsPatternLine);

    const gridLeft = GAME_CONFIG.centerX - ((SKIN_COLS - 1) * SKIN_CELL_W) / 2;

    SKIN_IDS.forEach((skinId, index) => {
        const col = index % SKIN_COLS;
        const row = Math.floor(index / SKIN_COLS);
        const cx = gridLeft + col * SKIN_CELL_W;
        const cy = panel.skinsRow1 + row * (SKIN_CELL_H + SKIN_ROW_GAP);

        const frame = scene.add.rectangle(
            cx,
            cy,
            46,
            46,
            hexVersPhaser(DESIGN_TOKENS.cadreSkinFond),
            0.9
        );
        frame.setStrokeStyle(2, hexVersPhaser(DESIGN_TOKENS.cadreSkinContour));
        frame.setDepth(DEPTH.PANEL_FRAME);
        panelElements.push(frame);
        elements.push(frame);
        ui._skinsTabElements.push(frame);

        const preview = scene.add.sprite(cx, cy - 2, birdTextureKey(skinId), 1);
        preview.setScale(1.35);
        preview.setDepth(DEPTH.PANEL_PREVIEW);
        panelElements.push(preview);
        elements.push(preview);
        ui._skinsTabElements.push(preview);

        const skin = getSkin(skinId);
        const nameLabel = addCenteredText(
            scene,
            cx,
            cy + 24,
            skin.label,
            menuTextStyle({ fontSize: FONT_SIZE_HINT, fill: DESIGN_TOKENS.texteSkinLabel }),
            DEPTH.PANEL_PREVIEW
        );
        panelElements.push(nameLabel);
        elements.push(nameLabel);
        ui._skinsTabElements.push(nameLabel);

        let recordLabel = null;
        if (isSpecialSkin(skinId)) {
            recordLabel = addCenteredText(
                scene,
                cx,
                cy + 34,
                '',
                menuTextStyle({ fontSize: FONT_SIZE_COMPACT, fill: DESIGN_TOKENS.accent }),
                DEPTH.PANEL_PREVIEW
            );
            panelElements.push(recordLabel);
            elements.push(recordLabel);
            ui._skinsTabElements.push(recordLabel);
        }

        const hit = scene.add.rectangle(cx, cy, MIN_TOUCH, MIN_TOUCH, 0x000000, 0);
        hit.setDepth(DEPTH.PANEL_TOP);
        hit.setInteractive({ useHandCursor: true });
        hit.on('pointerdown', (_p, _lx, _ly, event) => {
            stopUiEvent(event);
            const ctx = buildMetaContext(scene);
            const unlocked = listUnlockedSkins(ctx);
            if (!unlocked.includes(skinId)) return;
            applySelectedSkin(scene, skinId);
            refreshSkinsTab(ui);
        });
        panelElements.push(hit);
        elements.push(hit);
        ui._skinsTabElements.push(hit);

        ui._skinCells.push({ skinId, frame, preview, nameLabel, recordLabel, hit });
    });

    const closeBtn = buildMenuToggleButton(scene, elements, {
        cx: GAME_CONFIG.centerX,
        cy: panel.closeBtn,
        width: 160,
        depth: DEPTH.PANEL_FRAME,
        color: SKINS_BTN_COLOR,
        stroke: SKINS_BTN_STROKE,
        hoverColor: hexVersPhaser(DESIGN_TOKENS.boutonSkinsHover),
        labelText: '◂ RETOUR',
        labelStroke: DESIGN_TOKENS.contourSkins,
        rounded: true,
        focusKey: 'menuSkinsClose',
        onToggle: () => ui._skinsPanelController?.setOpen(false),
    });
    panelElements.push(closeBtn.bg, closeBtn.label, closeBtn.hit);
    ui._skinsTabElements.push(closeBtn.bg, closeBtn.label, closeBtn.hit);
    ui._skinsCloseHit = closeBtn.hit;
    ui._skinsClosePaint = closeBtn.paint;

    refreshSkinsTab(ui);
}
