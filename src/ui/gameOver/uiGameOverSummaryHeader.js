import { DESIGN_TOKENS, hexVersPhaser, menuTextStyle } from '../../designTokens.js';
import { deathCauseLabel } from '../../device.js';
import { addCenteredText, DEPTH, FONT_SIZE_BADGE, FONT_TITLE } from '../shared/uiLayout.js';

/**
 * Titre GAME OVER, cause de mort et liseré du récap game over.
 * @param {import('phaser').Scene} scene
 * @param {number} cx
 * @param {(offset: number) => number} y
 * @param {{ deathCause: string|null }} opts
 */
export function buildGameOverSummaryHeader(scene, cx, y, opts) {
    const { deathCause } = opts;
    const elements = [];

    elements.push(
        addCenteredText(
            scene,
            cx,
            y(28),
            'GAME OVER',
            menuTextStyle({
                fontFamily: FONT_TITLE,
                fontSize: '14px',
                fill: DESIGN_TOKENS.texteGameOver,
                fontStyle: 'normal',
                stroke: DESIGN_TOKENS.contourGameOver,
            }),
            DEPTH.MENU_RAISED
        )
    );

    const deathLabel = deathCauseLabel(deathCause);
    if (deathLabel) {
        elements.push(
            addCenteredText(
                scene,
                cx,
                y(52),
                deathLabel,
                menuTextStyle({
                    fontSize: FONT_SIZE_BADGE,
                    fill: DESIGN_TOKENS.accentScoreHardcore,
                    fontStyle: 'italic',
                }),
                DEPTH.MENU_RAISED
            )
        );
    }

    elements.push(
        scene.add
            .rectangle(cx, y(42), 90, 2, hexVersPhaser(DESIGN_TOKENS.liseréGameOver), 0.8)
            .setDepth(DEPTH.MENU_RAISED)
    );

    return { elements, deathLabel };
}
