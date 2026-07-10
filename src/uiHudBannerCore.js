import { GAME_CONFIG } from './config.js';
import { DESIGN_TOKENS, hexVersPhaser, hudTextStyle } from './designTokens.js';
import { prefersReducedMotion, sceneTween } from './motion.js';
import { addCenteredText, DEPTH } from './uiLayout.js';
import { acquireHudBannerSlot, releaseHudBannerSlot } from './uiHudBannerStack.js';

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
            releaseHudBannerSlot(ui, slot.row);
            banner.destroy();
            if (ui[key] === banner) ui[key] = null;
        },
    });
    return banner;
}

export function showDailyGoalReached(ui) {
    if (ui._dailyGoalBanner) return;
    const slot = acquireHudBannerSlot(ui);
    const y = slot.y;
    const banner = addCenteredText(
        ui.scene,
        GAME_CONFIG.centerX,
        y,
        'OBJECTIF ATTEINT !',
        hudTextStyle({
            fontSize: '15px',
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
            releaseHudBannerSlot(ui, slot.row);
            banner.destroy();
            if (ui._dailyGoalBanner === banner) ui._dailyGoalBanner = null;
        },
    });
    showFlash(ui);
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
