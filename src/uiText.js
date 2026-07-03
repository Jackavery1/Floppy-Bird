import { GAME_CONFIG } from './config.js';
import { FONT, FONT_TITLE, PANEL_TEXT_MAX_WIDTH, TITLE_MAX_WIDTH } from './uiLayoutConstants.js';

export function addCenteredText(scene, x, y, text, style, depth) {
    const label = scene.add.text(x, y, text, { fontFamily: FONT, ...style });
    label.setOrigin(0.5, 0.5);
    label.setDepth(depth);
    return label;
}

/**
 * Texte centré avec ombre portée (relief). Retourne { shadow, label }.
 * @param {import('phaser').Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {string} text
 * @param {Phaser.Types.GameObjects.Text.TextStyle} style
 * @param {number} depth profondeur du label principal (l’ombre est depth - 1)
 * @param {{ dx?: number, dy?: number, fill?: string, alpha?: number }} [relief]
 */
export function addReliefText(scene, x, y, text, style, depth, relief = {}) {
    const dx = relief.dx ?? 3;
    const dy = relief.dy ?? 3;
    const shadowFill = relief.fill ?? '#1a1a2e';
    const shadowAlpha = relief.alpha ?? 0.55;
    const base = { fontFamily: FONT, ...style };

    const shadow = scene.add.text(x + dx, y + dy, text, {
        ...base,
        fill: shadowFill,
        stroke: undefined,
        strokeThickness: 0,
    });
    shadow.setOrigin(0.5, 0.5);
    shadow.setAlpha(shadowAlpha);
    shadow.setDepth(depth - 1);

    const label = scene.add.text(x, y, text, base);
    label.setOrigin(0.5, 0.5);
    label.setDepth(depth);

    return { shadow, label };
}

export function diffLabelColor(difficulty, diff) {
    if (difficulty === diff) return '#000000';
    return GAME_CONFIG.difficultyColors[diff] ?? '#ffffff';
}

export function fitTitleFontSize(scene, text, maxWidth = TITLE_MAX_WIDTH) {
    return fitLabelFontSize(
        scene,
        text,
        {
            fontFamily: FONT_TITLE,
            fontSize: '22px',
            fontStyle: 'normal',
            stroke: '#E65100',
            strokeThickness: 3,
        },
        maxWidth,
        10,
        1
    );
}

export function fitLabelFontSize(
    scene,
    text,
    style,
    maxWidth = PANEL_TEXT_MAX_WIDTH,
    minSize = 8,
    step = 1
) {
    const baseSize = parseInt(String(style.fontSize ?? '12px'), 10) || 12;
    let fontSize = baseSize;
    while (fontSize >= minSize) {
        const probe = scene.make.text({
            x: 0,
            y: 0,
            text,
            style: {
                fontFamily: FONT,
                ...style,
                fontSize: `${fontSize}px`,
            },
            add: false,
        });
        if (probe.width <= maxWidth) {
            probe.destroy();
            return fontSize;
        }
        probe.destroy();
        fontSize -= step;
    }
    return minSize;
}

export function applyFittedLabel(scene, label, text, style, maxWidth = PANEL_TEXT_MAX_WIDTH) {
    const fontSize = fitLabelFontSize(scene, text, style, maxWidth);
    label.setText(text);
    label.setFontSize?.(fontSize);
}

export function addFittedCenteredText(
    scene,
    x,
    y,
    text,
    style,
    depth,
    maxWidth = PANEL_TEXT_MAX_WIDTH
) {
    const label = addCenteredText(scene, x, y, text, style, depth);
    applyFittedLabel(scene, label, text, style, maxWidth);
    return label;
}
