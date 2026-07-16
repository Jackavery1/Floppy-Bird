import {
    DESIGN_TOKENS,
    hexVersPhaser,
    MEDAILLE_COLORS_PHASER,
    menuTextStyle,
} from '../../designTokens.js';
import { Utils } from '../../utils.js';
import { shade } from './uiGameOverDecor.js';
import { addCenteredText, DEPTH, FONT_SIZE_SMALL } from '../shared/uiLayout.js';

/** @param {number} finalScore */
export function medalColorForScore(finalScore) {
    if (finalScore > 20) return MEDAILLE_COLORS_PHASER.or;
    if (finalScore > 10) return MEDAILLE_COLORS_PHASER.argent;
    if (finalScore > 5) return MEDAILLE_COLORS_PHASER.bronze;
    return null;
}

/**
 * Bannière nouveau record ou médaille selon le score.
 * @param {import('phaser').Scene} scene
 * @param {number} cx
 * @param {number} medalY
 * @param {{ finalScore: number, isNewRecord: boolean }} opts
 */
export function buildGameOverSummaryMedal(scene, cx, medalY, opts) {
    const { finalScore, isNewRecord } = opts;
    const elements = [];

    if (isNewRecord) {
        const recordBanner = scene.add.graphics().setDepth(DEPTH.MENU_PANEL);
        recordBanner.fillStyle(hexVersPhaser(DESIGN_TOKENS.accentTitre), 0.16);
        recordBanner.fillRoundedRect(cx - 78, medalY - 9, 156, 18, 4);
        const recordBadge = addCenteredText(
            scene,
            cx,
            medalY,
            '★ NOUVEAU RECORD ★',
            menuTextStyle({
                fontSize: FONT_SIZE_SMALL,
                fill: DESIGN_TOKENS.accentTitre,
                fontStyle: 'bold',
                stroke: DESIGN_TOKENS.contourHud,
                strokeThickness: 1,
            }),
            DEPTH.MENU_RAISED
        );
        elements.push(recordBanner, recordBadge);
        return { elements, medal: null, recordBanner, recordBadge };
    }

    const medalColor = medalColorForScore(finalScore);
    if (medalColor === null) {
        return { elements, medal: null, recordBanner: null, recordBadge: null };
    }

    const mg = scene.add.graphics().setDepth(DEPTH.MENU_RAISED);
    mg.lineStyle(1.5, shade(medalColor, 1.25), 0.7);
    mg.strokeCircle(cx, medalY, 20);
    mg.fillStyle(medalColor, 1);
    mg.fillCircle(cx, medalY, 20);
    mg.fillStyle(shade(medalColor, 0.55), 1);
    mg.fillCircle(cx, medalY, 20 - 15);
    mg.fillStyle(hexVersPhaser(DESIGN_TOKENS.texteHud), 0.5);
    mg.fillPoints(Utils.makeStarPoints(cx, medalY, 12, 5.5), true);
    elements.push(mg);

    return { elements, medal: mg, recordBanner: null, recordBadge: null };
}
