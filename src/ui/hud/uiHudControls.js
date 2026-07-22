import { hudBannerFill, hudTextStyle } from '../../designTokens.js';
import { GAME_CONFIG } from '../../config.js';
import { formatDailyHudLabel } from '../../dailyChallenge.js';
import { getSkinPattern } from '../../skinPatterns.js';
import { getSkin } from '../../skins/index.js';
import { jumpHint } from '../../device.js';
import {
    bindAccessibilityAction,
    bindUnifiedInteractiveFocus,
    hideAllAccessibilityControls,
    setAccessibilityControlLabel,
    setAccessibilityControlVisible,
} from '../a11y/uiDomAccessibilityControls.js';
import { syncAccessibilityLayer } from '../a11y/uiDomAccessibilityLayer.js';
import { bindPlayingAccessibilityFocusVisuals } from '../a11y/uiDomAccessibilityFocusVisuals.js';
import { drawPauseChrome } from '../shared/uiPhaserComponents.js';
import { PLAYING_CONTROL_KEYS } from '../a11y/uiDomAccessibilityDefs.js';
import { resetHudBannerSlots } from './uiHudBannerStack.js';
import {
    addCenteredText,
    DEPTH,
    FONT_SIZE_BADGE,
    FONT_SIZE_HINT,
    PAUSE_BTN_HIT,
    PAUSE_BTN_COLOR,
    PAUSE_BTN_HOVER,
    PAUSE_BTN_VISUAL,
    SPACING,
    stopUiEvent,
    UI_LAYOUT,
} from '../shared/uiLayout.js';
import { dismissJumpTutorial } from './uiHudTutorial.js';
import { showInGameScore } from './uiHudScore.js';

export function destroyInGameControls(ui) {
    ui._inGameControlElements.forEach((e) => e?.destroy());
    ui._inGameControlElements = [];
    ui._pauseBtnGraphics = null;
    ui._trainingBadge = null;
    ui._hardcoreBadge = null;
    ui._dailyBadge = null;
    ui._dailyPatternBadge = null;
    resetHudBannerSlots(ui);
    for (const key of PLAYING_CONTROL_KEYS) {
        setAccessibilityControlVisible(key, false);
    }
    dismissJumpTutorial(ui);
}

export function createInGameControls(
    ui,
    { trainingMode, hardcoreMode, dailyMode, dailyGoal, activeSkinId, onPause, onJump }
) {
    destroyInGameControls(ui);
    hideAllAccessibilityControls();
    const elements = [];
    const { playing } = UI_LAYOUT;
    let badgeY = playing.trainingBadgeY;

    if (dailyMode && dailyGoal > 0) {
        const skinLabel = activeSkinId ? getSkin(activeSkinId).label : '';
        const pattern = activeSkinId ? getSkinPattern(activeSkinId).tagline : '';
        ui._dailyBadge = addCenteredText(
            ui.scene,
            GAME_CONFIG.centerX,
            badgeY,
            `${formatDailyHudLabel(ui.scoreValue ?? 0, dailyGoal)} · ${skinLabel}`,
            hudTextStyle({
                fontSize: FONT_SIZE_BADGE,
                fill: hudBannerFill('badgeDaily'),
                fontStyle: 'bold',
            }),
            DEPTH.HUD_BADGE
        );
        elements.push(ui._dailyBadge);
        badgeY += SPACING.md;
        ui._dailyPatternBadge = addCenteredText(
            ui.scene,
            GAME_CONFIG.centerX,
            badgeY,
            pattern,
            hudTextStyle({
                fontSize: FONT_SIZE_HINT,
                fill: hudBannerFill('badgeDailySecondary'),
            }),
            DEPTH.HUD_BADGE
        );
        elements.push(ui._dailyPatternBadge);
        badgeY += SPACING.md;
    }

    if (trainingMode) {
        ui._trainingBadge = addCenteredText(
            ui.scene,
            GAME_CONFIG.centerX,
            badgeY,
            'ENTRAÎN. · sans record',
            hudTextStyle({
                fontSize: FONT_SIZE_BADGE,
                fill: hudBannerFill('badgeTraining'),
                fontStyle: 'bold',
            }),
            DEPTH.HUD_BADGE
        );
        elements.push(ui._trainingBadge);
        badgeY += SPACING.md;
    }

    if (hardcoreMode) {
        ui._hardcoreBadge = addCenteredText(
            ui.scene,
            GAME_CONFIG.centerX,
            badgeY,
            'HC',
            hudTextStyle({
                fontSize: FONT_SIZE_BADGE,
                fill: hudBannerFill('badgeHardcore'),
                fontStyle: 'bold',
            }),
            DEPTH.HUD_BADGE
        );
        elements.push(ui._hardcoreBadge);
        badgeY += SPACING.md;
    }

    const scoreY = badgeY > playing.trainingBadgeY ? badgeY + SPACING.md : UI_LAYOUT.scoreHud;
    ui._scoreHudY = scoreY;
    showInGameScore(ui, scoreY);

    ui._pauseBtnGraphics = ui.scene.add.graphics().setDepth(DEPTH.PAUSE_ICON);
    elements.push(ui._pauseBtnGraphics);
    drawPauseButton(ui, PAUSE_BTN_COLOR);

    const pauseHit = ui.scene.add.rectangle(
        playing.pauseBtnX,
        playing.pauseBtnY,
        PAUSE_BTN_HIT,
        PAUSE_BTN_HIT,
        0x000000,
        0
    );
    pauseHit.setDepth(DEPTH.PAUSE_ICON_HIT);
    pauseHit.setInteractive({ useHandCursor: true });
    bindUnifiedInteractiveFocus(
        'pause',
        () => drawPauseButton(ui, PAUSE_BTN_HOVER),
        () => drawPauseButton(ui, PAUSE_BTN_COLOR)
    ).attachHit(pauseHit);
    pauseHit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        onPause();
    });
    elements.push(pauseHit);

    bindAccessibilityAction('pause', onPause);
    setAccessibilityControlVisible('pause', true);
    bindPlayingAccessibilityFocusVisuals(ui);
    if (onJump) {
        bindAccessibilityAction('playJump', onJump);
        setAccessibilityControlVisible('playJump', true);
        setAccessibilityControlLabel('playJump', jumpHint());
    }
    syncAccessibilityLayer(ui.scene.game);

    ui._inGameControlElements = elements;
    return elements;
}

function drawPauseButton(ui, fillColor) {
    if (!ui._pauseBtnGraphics) return;
    drawPauseChrome(
        ui._pauseBtnGraphics,
        UI_LAYOUT.playing.pauseBtnX,
        UI_LAYOUT.playing.pauseBtnY,
        PAUSE_BTN_VISUAL,
        fillColor
    );
}
