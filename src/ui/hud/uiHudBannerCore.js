import { GAME_CONFIG } from '../../config.js';
import { DESIGN_TOKENS, hexVersPhaser, hudTextStyle } from '../../designTokens.js';
import { hapticMedium } from '../../haptics.js';
import { drawGameOverPanelFrame, drawPlaqueCorners } from '../shared/uiGameOverChrome.js';
import { announceAccessibility } from '../a11y/uiDomAccessibilityControls.js';
import { prefersReducedMotion, sceneTween } from '../../motion.js';
import {
    addCenteredText,
    DEPTH,
    FONT_SIZE_BANNER,
    FONT_SIZE_CHROME,
    GAME_OVER_PANEL,
    gameOverMenuBtnY,
    gameOverRestartBtnY,
    MIN_CTA_TOUCH,
    UI_LAYOUT,
} from '../shared/uiLayout.js';
import { acquireHudBannerSlot, destroyHudBanner } from './uiHudBannerStack.js';

export function showTransientBanner(
    ui,
    key,
    text,
    style,
    fadeOffset = 18,
    holdMs = 500,
    fadeMs = 1200
) {
    if (ui[key]) return;
    const slot = acquireHudBannerSlot(ui);
    const y = slot.y;
    const banner = addCenteredText(
        ui.scene,
        GAME_CONFIG.centerX,
        y,
        text,
        style,
        DEPTH.RECORD_BANNER
    );
    banner.__bannerRow = slot.row;
    ui[key] = banner;
    sceneTween(ui.scene, {
        targets: banner,
        scaleX: { from: 0.85, to: 1.05 },
        scaleY: { from: 0.85, to: 1.05 },
        duration: 180,
        yoyo: true,
        repeat: 1,
        ease: 'Back.easeOut',
    });
    sceneTween(ui.scene, {
        targets: banner,
        alpha: { from: 1, to: 0 },
        y: y - fadeOffset,
        duration: fadeMs,
        delay: holdMs,
        ease: 'Power2',
        onComplete: () => {
            destroyHudBanner(ui, key);
        },
    });
    return banner;
}

export function showDailyGoalReached(ui) {
    if (ui._dailyGoalBanner) return;
    hapticMedium();
    const slot = acquireHudBannerSlot(ui);
    const y = slot.y;
    const banner = addCenteredText(
        ui.scene,
        GAME_CONFIG.centerX,
        y,
        'OBJECTIF ATTEINT !',
        hudTextStyle({
            fontSize: FONT_SIZE_BANNER,
            fill: DESIGN_TOKENS.bannerSuccess,
            fontStyle: 'bold',
        }),
        DEPTH.RECORD_BANNER
    );
    banner.__bannerRow = slot.row;
    ui._dailyGoalBanner = banner;
    sceneTween(ui.scene, {
        targets: banner,
        scaleX: { from: 0.85, to: 1.05 },
        scaleY: { from: 0.85, to: 1.05 },
        duration: 180,
        yoyo: true,
        repeat: 1,
        ease: 'Back.easeOut',
    });
    sceneTween(ui.scene, {
        targets: banner,
        alpha: { from: 1, to: 0 },
        y: y - 18,
        duration: 1200,
        delay: 700,
        ease: 'Power2',
        onComplete: () => {
            destroyHudBanner(ui, '_dailyGoalBanner');
        },
    });
    showFlash(ui);
}

export function showGameOverLoading(ui) {
    if (ui._gameOverLoadingText) return;
    const scene = ui.scene;
    const P = GAME_OVER_PANEL;
    const cx = P.x + P.w / 2;
    const skeletonFill = hexVersPhaser(DESIGN_TOKENS.texteHintMenu);

    ui._gameOverLoadingOverlay = scene.add
        .rectangle(
            GAME_CONFIG.centerX,
            GAME_CONFIG.centerY,
            GAME_CONFIG.width,
            GAME_CONFIG.height,
            hexVersPhaser(DESIGN_TOKENS.texteHud),
            0.55
        )
        .setDepth(DEPTH.OVERLAY_DIM);

    const panel = scene.add.graphics().setDepth(DEPTH.MENU_PANEL);
    drawGameOverPanelFrame(panel, P, {
        fillAlpha: 0.82,
        strokeAlpha: 0.55,
        innerStrokeAlpha: 0,
    });
    drawPlaqueCorners(panel, P);
    ui._gameOverLoadingPanel = panel;

    const skeleton = scene.add.graphics().setDepth(DEPTH.PANEL_FRAME);
    skeleton.fillStyle(skeletonFill, 0.22);
    skeleton.fillRoundedRect(cx - 70, P.y + 22, 140, 18, 4);
    skeleton.fillRoundedRect(cx - 36, P.y + 88, 72, 72, 8);
    skeleton.fillRoundedRect(cx - 50, P.y + 178, 100, 22, 4);
    skeleton.fillRoundedRect(
        cx - MIN_CTA_TOUCH,
        gameOverRestartBtnY(P) - MIN_CTA_TOUCH / 2,
        MIN_CTA_TOUCH * 2,
        MIN_CTA_TOUCH,
        8
    );
    skeleton.fillRoundedRect(
        cx - UI_LAYOUT.menuBtn.width / 2,
        gameOverMenuBtnY(P) - MIN_CTA_TOUCH / 2,
        UI_LAYOUT.menuBtn.width,
        MIN_CTA_TOUCH,
        UI_LAYOUT.menuBtn.radius
    );
    ui._gameOverLoadingSkeleton = skeleton;

    ui._gameOverLoadingText = addCenteredText(
        ui.scene,
        GAME_CONFIG.centerX,
        GAME_CONFIG.centerY,
        'Chargement…',
        hudTextStyle({
            fontSize: FONT_SIZE_CHROME,
            fill: DESIGN_TOKENS.texteHintMenu,
            fontStyle: 'bold',
        }),
        DEPTH.RECORD_BANNER + 1
    );
    ui._gameOverLoadingText.setAlpha(0.85);
    announceAccessibility('Chargement de l’écran de fin…');

    const pulseTargets = [ui._gameOverLoadingText, skeleton];
    if (!prefersReducedMotion()) {
        ui._gameOverLoadingTween = sceneTween(ui.scene, {
            targets: pulseTargets,
            alpha: 0.45,
            duration: 550,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });
    }
}

export function hideGameOverLoading(ui) {
    ui._gameOverLoadingTween?.stop?.();
    ui._gameOverLoadingTween = null;
    ui._gameOverLoadingOverlay?.destroy();
    ui._gameOverLoadingOverlay = null;
    ui._gameOverLoadingPanel?.destroy();
    ui._gameOverLoadingPanel = null;
    ui._gameOverLoadingSkeleton?.destroy();
    ui._gameOverLoadingSkeleton = null;
    if (!ui._gameOverLoadingText) return;
    ui._gameOverLoadingText.destroy();
    ui._gameOverLoadingText = null;
}

export function showFlash(ui, color = hexVersPhaser(DESIGN_TOKENS.texteHud), alpha = 0.8) {
    if (prefersReducedMotion()) return;
    const flash = ui.scene.add.rectangle(
        GAME_CONFIG.centerX,
        GAME_CONFIG.centerY,
        GAME_CONFIG.width,
        GAME_CONFIG.height,
        color,
        alpha
    );
    flash.setDepth(DEPTH.FLASH);
    sceneTween(ui.scene, {
        targets: flash,
        alpha: { from: alpha, to: 0 },
        duration: 166,
        ease: 'Power1',
        onComplete: () => flash.destroy(),
    });
}
