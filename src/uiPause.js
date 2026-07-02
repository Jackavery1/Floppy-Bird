import { GAME_CONFIG } from './config.js';
import { pauseResumeHint } from './device.js';
import {
    addCenteredText,
    DEPTH,
    MENU_BTN_COLOR,
    MENU_BTN_HOVER,
    MIN_TOUCH,
    stopUiEvent,
    UI_LAYOUT,
} from './uiLayout.js';

export function showPause(ui, { onResume, onMenu }) {
    const { pause, menuBtn } = UI_LAYOUT;
    const overlay = ui.createOverlay(0.65, DEPTH.PAUSE_OVERLAY);
    const elements = [overlay];

    const pauseTitle = addCenteredText(ui.scene, GAME_CONFIG.centerX, pause.title,
        'PAUSE', { fontSize: '32px', fill: '#ffffff', fontStyle: 'bold' }, DEPTH.PAUSE_TITLE);
    elements.push(pauseTitle);

    const resumeGraphics = ui.scene.add.graphics().setDepth(DEPTH.PAUSE_BTN);
    elements.push(resumeGraphics);
    const resumeBtnY = pause.resumeBtn;
    const drawResume = (color) => {
        resumeGraphics.clear();
        resumeGraphics.fillStyle(color, 1);
        resumeGraphics.fillRoundedRect(
            GAME_CONFIG.centerX - menuBtn.width / 2,
            resumeBtnY - menuBtn.height / 2,
            menuBtn.width,
            menuBtn.height,
            menuBtn.radius,
        );
    };
    drawResume(MENU_BTN_COLOR);

    const resumeText = addCenteredText(ui.scene, GAME_CONFIG.centerX, resumeBtnY,
        'REPRENDRE', { fontSize: '13px', fill: '#ffffff', fontStyle: 'bold' }, DEPTH.PAUSE_BTN_LABEL);
    elements.push(resumeText);

    const resumeHit = ui.scene.add.rectangle(
        GAME_CONFIG.centerX, resumeBtnY, menuBtn.width, MIN_TOUCH, 0x000000, 0,
    );
    resumeHit.setDepth(DEPTH.PAUSE_HIT);
    resumeHit.setInteractive({ useHandCursor: true });
    resumeHit.on('pointerover', () => drawResume(MENU_BTN_HOVER));
    resumeHit.on('pointerout', () => drawResume(MENU_BTN_COLOR));
    resumeHit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        onResume();
    });
    elements.push(resumeHit);

    const menuGraphics = ui.scene.add.graphics().setDepth(DEPTH.PAUSE_BTN);
    elements.push(menuGraphics);
    const menuBtnY = pause.menuBtn;
    const drawMenu = (color) => {
        menuGraphics.clear();
        menuGraphics.fillStyle(color, 1);
        menuGraphics.fillRoundedRect(
            GAME_CONFIG.centerX - menuBtn.width / 2,
            menuBtnY - menuBtn.height / 2,
            menuBtn.width,
            menuBtn.height,
            menuBtn.radius,
        );
    };
    drawMenu(MENU_BTN_COLOR);

    const menuText = addCenteredText(ui.scene, GAME_CONFIG.centerX, menuBtnY,
        'MENU', { fontSize: '13px', fill: '#ffffff', fontStyle: 'bold' }, DEPTH.PAUSE_BTN_LABEL);
    elements.push(menuText);

    const menuHit = ui.scene.add.rectangle(
        GAME_CONFIG.centerX, menuBtnY, menuBtn.width, MIN_TOUCH, 0x000000, 0,
    );
    menuHit.setDepth(DEPTH.PAUSE_HIT);
    menuHit.setInteractive({ useHandCursor: true });
    menuHit.on('pointerover', () => drawMenu(MENU_BTN_HOVER));
    menuHit.on('pointerout', () => drawMenu(MENU_BTN_COLOR));
    menuHit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        onMenu();
    });
    elements.push(menuHit);

    elements.push(addCenteredText(ui.scene, GAME_CONFIG.centerX, pause.menuBtn + 40,
        pauseResumeHint(), { fontSize: '11px', fill: '#cccccc' }, DEPTH.PAUSE_TITLE));

    return { elements };
}
