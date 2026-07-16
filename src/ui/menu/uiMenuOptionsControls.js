import { GAME_CONFIG } from '../../config.js';
import { optionsControlRows } from '../../device.js';
import {
    DESIGN_TOKENS,
    hexVersPhaser,
    menuHomeTextStyle,
    panelChromeTextStyle,
} from '../../designTokens.js';
import { addCenteredText, DEPTH, FONT_SIZE_BODY, UI_LAYOUT } from '../shared/uiLayout.js';
import { beginOptionsSection } from './uiMenuOptionsSection.js';
import { drawPanelPillButton } from './uiMenuPanelChrome.js';

const BADGE_FILL = hexVersPhaser(DESIGN_TOKENS.boutonPause);
const BADGE_STROKE = hexVersPhaser(DESIGN_TOKENS.boutonOptionsStroke);
const LIST_STROKE = hexVersPhaser(DESIGN_TOKENS.boutonOptionsStroke);

/** @param {string} key */
function keyBadgeWidth(key) {
    const compact = key.replace(/\s/g, '');
    if (compact.length <= 2) return 36;
    if (compact.length <= 4) return 48;
    return Math.min(68, compact.length * 9 + 14);
}

/**
 * @param {import('phaser').Scene} scene
 * @param {number} cx
 * @param {number} cy
 * @param {string} key
 */
function buildKeyBadge(scene, cx, cy, key) {
    const w = keyBadgeWidth(key);
    const h = 22;
    const bg = scene.add.graphics();
    drawPanelPillButton(bg, cx, cy, w, h, BADGE_FILL, 0.82, BADGE_STROKE, 0.52, 5);
    const label = addCenteredText(
        scene,
        cx,
        cy,
        key,
        menuHomeTextStyle({
            fontSize: FONT_SIZE_BODY,
            fill: DESIGN_TOKENS.accentTitre,
            fontStyle: 'bold',
            stroke: DESIGN_TOKENS.contourOptions,
        }),
        DEPTH.PANEL_FRAME + 1
    );
    return [bg, label];
}

/** @param {import('../core/ui.js').UI} ui @param {import('phaser').GameObjects.GameObject[]} elements */
export function buildControlsSection(ui, _elements) {
    const scene = ui.scene;
    const panel = UI_LAYOUT.optionsPanel;
    const { add } = beginOptionsSection(ui, scene, '_optionsControlsElements');
    const rows = optionsControlRows();
    const rowGap = panel.controlsGap;
    const firstY = panel.controlsFirst;
    const listTop = firstY - rowGap / 2 - 6;
    const listH = rows.length * rowGap + 10;

    const title = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        panel.controlsTitle,
        'CONTRÔLES',
        panelChromeTextStyle({
            fontSize: FONT_SIZE_BODY,
            fill: DESIGN_TOKENS.accentTitre,
            fontStyle: 'bold',
            stroke: DESIGN_TOKENS.accentTitreContour,
        }),
        DEPTH.PANEL_FRAME
    );
    add(title);

    const titleRule = scene.add.graphics();
    titleRule.lineStyle(1, BADGE_STROKE, 0.45);
    titleRule.lineBetween(
        GAME_CONFIG.centerX - 88,
        panel.controlsTitle + 14,
        GAME_CONFIG.centerX + 88,
        panel.controlsTitle + 14
    );
    add(titleRule);

    const listBg = scene.add.graphics();
    const bgX = GAME_CONFIG.centerX - panel.w / 2 + 14;
    listBg.fillStyle(BADGE_FILL, 0.2);
    listBg.fillRoundedRect(bgX, listTop, panel.w - 28, listH, 8);
    listBg.lineStyle(1, LIST_STROKE, 0.32);
    listBg.strokeRoundedRect(bgX, listTop, panel.w - 28, listH, 8);
    add(listBg);

    const keyColX = GAME_CONFIG.centerX - 72;
    const actionColX = GAME_CONFIG.centerX - 38;

    rows.forEach((row, index) => {
        const y = firstY + index * rowGap;
        const [badgeBg, badgeLabel] = buildKeyBadge(scene, keyColX, y, row.key);
        add(badgeBg, badgeLabel);

        const action = scene.add.text(actionColX, y, row.action, {
            ...menuHomeTextStyle({
                fontSize: FONT_SIZE_BODY,
                fill: DESIGN_TOKENS.texteClair,
            }),
        });
        action.setOrigin(0, 0.5);
        add(action);
    });
}
