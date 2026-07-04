import { sceneTween } from './motion.js';
import { DESIGN_TOKENS, menuTextStyle } from './designTokens.js';
import { restartHintForMode, menuHint } from './device.js';
import { spawnConfetti } from './uiGameOverDecor.js';
import {
    addCenteredText,
    DEPTH,
    MENU_BTN_COLOR,
    MENU_BTN_HOVER,
    MIN_TOUCH,
    stopUiEvent,
    UI_LAYOUT,
} from './uiLayout.js';

/**
 * Pied de panneau game over : hint rejouer, bouton menu et animation d’apparition.
 * @param {import('phaser').Scene} scene
 * @param {import('./ui.js').UI} ui
 * @param {number} cx
 * @param {(offset: number) => number} y
 * @param {{ x: number, y: number, w: number, h: number }} P
 * @param {{ isDaily: boolean, fadeIn: boolean, finalScore: number, isNewRecord: boolean }} opts
 * @param {import('phaser').GameObjects.Text} scoreText
 */
export function buildGameOverActions(scene, ui, cx, y, _P, opts, _scoreText) {
    const { isDaily } = opts;
    const elements = [];

    elements.push(
        addCenteredText(
            scene,
            cx,
            y(252),
            restartHintForMode(isDaily),
            menuTextStyle({
                fontSize: '9px',
                fill: DESIGN_TOKENS.texteMenu,
                fontStyle: 'italic',
            }),
            DEPTH.MENU_RAISED
        )
    );

    const menuBtnY = y(285);
    const menuBtnShadow = scene.add.graphics().setDepth(DEPTH.MENU_RAISED);
    const { menuBtn } = UI_LAYOUT;
    menuBtnShadow.fillStyle(0x000000, 0.35);
    menuBtnShadow.fillRoundedRect(
        cx - menuBtn.width / 2,
        menuBtnY - menuBtn.height / 2 + 3,
        menuBtn.width,
        menuBtn.height,
        menuBtn.radius
    );
    ui._menuBtnGraphics = scene.add.graphics().setDepth(DEPTH.MENU_BTN_BG);
    ui.drawGameOverMenuButton(menuBtnY, MENU_BTN_COLOR);

    const menuBtnText = addCenteredText(
        scene,
        cx,
        menuBtnY,
        'MENU',
        menuTextStyle({
            fontSize: '13px',
            fill: DESIGN_TOKENS.texteMenu,
            fontStyle: 'bold',
        }),
        DEPTH.MENU_BTN_BG
    );

    const menuHitZone = scene.add.rectangle(cx, menuBtnY, menuBtn.width, MIN_TOUCH, 0x000000, 0);
    menuHitZone.setDepth(DEPTH.MENU_HIT);
    menuHitZone.setInteractive({ useHandCursor: true });
    menuHitZone.on('pointerover', () => ui.drawGameOverMenuButton(menuBtnY, MENU_BTN_HOVER));
    menuHitZone.on('pointerout', () => ui.drawGameOverMenuButton(menuBtnY, MENU_BTN_COLOR));
    menuHitZone.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        scene.returnToMenu();
    });

    elements.push(
        menuBtnShadow,
        ui._menuBtnGraphics,
        menuBtnText,
        menuHitZone,
        addCenteredText(
            scene,
            cx,
            y(308),
            menuHint(),
            menuTextStyle({ fontSize: '9px', fill: DESIGN_TOKENS.texteHintFaible }),
            DEPTH.MENU_RAISED
        )
    );

    return elements;
}

/** Animation d’apparition progressive du panneau game over. */
export function animateGameOverReveal(scene, elements, scoreText, finalScore, isNewRecord, cx, P) {
    elements.forEach((e) => e.setAlpha(0));
    sceneTween(scene, {
        targets: elements,
        alpha: 1,
        duration: 500,
        ease: 'Power2',
    });

    const counter = { v: 0 };
    sceneTween(scene, {
        targets: counter,
        v: finalScore,
        duration: 650,
        delay: 150,
        ease: 'Cubic.easeOut',
        onUpdate: () => scoreText.setText(String(Math.round(counter.v))),
        onComplete: () => scoreText.setText(String(finalScore)),
    });

    if (isNewRecord) {
        spawnConfetti(scene, cx, P.y - 6, elements);
    }
}
