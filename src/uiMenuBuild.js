import { GAME_CONFIG } from './config.js';
import { menuControlsHint } from './device.js';
import { sceneTween } from './motion.js';
import { addCenteredText, DEPTH, MIN_TOUCH, stopUiEvent } from './uiLayout.js';

const START_HIT_WIDTH = 240;

export function buildMenuFooter(ui, elements, layout) {
    ui._startText = addCenteredText(
        ui.scene,
        GAME_CONFIG.centerX,
        layout.start,
        'APPUYER POUR JOUER',
        { fontSize: '14px', fill: '#ffffff' },
        DEPTH.MENU_PANEL
    );
    sceneTween(ui.scene, {
        targets: ui._startText,
        alpha: 0,
        duration: 400,
        yoyo: true,
        repeat: -1,
        ease: 'Power0',
    });
    elements.push(ui._startText);

    ui._startHit = ui.scene.add.rectangle(
        GAME_CONFIG.centerX,
        layout.start,
        START_HIT_WIDTH,
        MIN_TOUCH,
        0x000000,
        0
    );
    ui._startHit.setDepth(DEPTH.MENU_HIT);
    ui._startHit.setInteractive({ useHandCursor: true });
    ui._startHit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        ui.scene.handlePrimaryAction();
    });
    elements.push(ui._startHit);
    ui._hint1 = addCenteredText(
        ui.scene,
        GAME_CONFIG.centerX,
        layout.hint1,
        menuControlsHint(),
        {
            fontSize: '10px',
            fill: '#B0BEC5',
            stroke: '#0d1117',
            strokeThickness: 2,
            align: 'center',
        },
        DEPTH.MENU_RAISED
    );
    elements.push(ui._hint1);

    return ui._startText;
}

export function playMenuIntroTween(ui, title) {
    const targets = [
        title,
        ui._menuTitleShadow,
        ui._startText,
        ui._scoresBtnLabel,
        ui._scoresBtnBg,
        ui._optionsBtnLabel,
        ui._optionsBtnBg,
        ui._skinsBtnLabel,
        ui._skinsBtnBg,
        ui._dailyBtnLabel,
        ui._dailyBtnBg,
        ui._dailyMenuSubtitle,
    ];
    targets.forEach((el) => el?.setAlpha(0));
    sceneTween(ui.scene, {
        targets: targets.filter(Boolean),
        alpha: 1,
        duration: 400,
        stagger: 60,
        ease: 'Power2',
    });
}
