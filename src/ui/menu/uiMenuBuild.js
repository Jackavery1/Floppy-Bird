import { GAME_CONFIG } from '../../config.js';
import { DESIGN_TOKENS, menuHomeTextStyle, panelChromeTextStyle } from '../../designTokens.js';
import { firstRunMenuHintText } from '../../device.js';
import { prefersReducedMotion, sceneTween } from '../../motion.js';
import { loadRoundsStarted, loadTutorialComplete } from '../../tutorialStorage.js';
import {
    addCenteredText,
    DEPTH,
    FONT_SIZE_BANNER,
    FONT_SIZE_SMALL,
    MIN_CTA_TOUCH,
    stopUiEvent,
    UI_LAYOUT,
} from '../shared/uiLayout.js';

const START_HIT_WIDTH = 240;

export function buildMenuFirstRunHint(ui, elements, layout) {
    if (loadTutorialComplete() || loadRoundsStarted() > 0) return;
    ui._firstRunHint = addCenteredText(
        ui.scene,
        GAME_CONFIG.centerX,
        layout.hint1 ?? UI_LAYOUT.menu.hint1,
        firstRunMenuHintText(),
        menuHomeTextStyle({
            fontSize: FONT_SIZE_SMALL,
            fill: DESIGN_TOKENS.texteHintMenu,
            fontStyle: 'italic',
        }),
        DEPTH.MENU_PANEL
    );
    elements.push(ui._firstRunHint);
}

export function buildMenuFooter(ui, elements, layout) {
    ui._startText = addCenteredText(
        ui.scene,
        GAME_CONFIG.centerX,
        layout.start,
        'APPUYER POUR JOUER',
        panelChromeTextStyle({ fontSize: FONT_SIZE_BANNER }),
        DEPTH.MENU_PANEL
    );
    if (prefersReducedMotion()) {
        ui._startText.setAlpha(1);
    } else {
        sceneTween(ui.scene, {
            targets: ui._startText,
            alpha: 0,
            duration: 400,
            yoyo: true,
            repeat: -1,
            ease: 'Power0',
        });
    }
    elements.push(ui._startText);

    ui._startHit = ui.scene.add.rectangle(
        GAME_CONFIG.centerX,
        layout.start,
        START_HIT_WIDTH,
        MIN_CTA_TOUCH,
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

    return ui._startText;
}

export function playMenuIntroTween(ui, title) {
    const targets = [
        title,
        ui._menuTitleShadow,
        ui._startText,
        ui._firstRunHint,
        ui._scoresBtnLabel,
        ui._scoresBtnBg,
        ui._optionsBtnLabel,
        ui._optionsBtnBg,
        ui._skinsBtnLabel,
        ui._skinsBtnBg,
        ui._dailyBtnLabel,
        ui._dailyBtnBg,
        ui._dailyBtnSubtitle,
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
