import { GAME_CONFIG } from './config.js';
import { DESIGN_TOKENS, hexVersPhaser, hudTextStyle } from './designTokens.js';
import { coyoteHintText, hardcoreInvincibilityHintText } from './device.js';
import { sceneTween } from './motion.js';
import { addCenteredText, DEPTH } from './uiLayout.js';
import {
    acquireHudBannerSlot,
    destroyHudBanner,
    releaseHudBannerSlot,
} from './uiHudBannerStack.js';

function showTransientBanner(ui, key, text, style, fadeOffset = 18, holdMs = 500, fadeMs = 1200) {
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

export function showRecordBroken(ui) {
    showTransientBanner(
        ui,
        '_recordBanner',
        'NOUVEAU RECORD !',
        hudTextStyle({
            fontSize: '16px',
            fill: DESIGN_TOKENS.accent,
            fontStyle: 'bold',
        }),
        18
    );
}

export function showDifficultyEscalation(ui) {
    showTransientBanner(
        ui,
        '_escalationBanner',
        'GAPS RESSERRÉS',
        hudTextStyle({
            fontSize: '13px',
            fill: DESIGN_TOKENS.bannerEscalation,
            fontStyle: 'bold',
        })
    );
    showFlash(ui, hexVersPhaser(DESIGN_TOKENS.bannerEscalation), 0.22);
}

export function showScoreStreak(ui, score) {
    const labels = {
        10: 'SÉRIE ×10',
        15: 'EN FEU !',
        20: 'SÉRIE ×20',
        30: 'INCROYABLE !',
        40: 'LÉGENDE !',
        50: 'MAÎTRE !',
    };
    const label = labels[score] ?? `SÉRIE ×${score}`;
    showTransientBanner(
        ui,
        '_streakBanner',
        label,
        hudTextStyle({
            fontSize: '14px',
            fill: DESIGN_TOKENS.bannerStreak,
            fontStyle: 'bold',
        })
    );
}

export function showDailyGoalBrief(ui, goal) {
    showTransientBanner(
        ui,
        '_dailyBriefBanner',
        `OBJECTIF : ${goal} pts`,
        hudTextStyle({
            fontSize: '13px',
            fill: DESIGN_TOKENS.badgeDaily,
            fontStyle: 'bold',
        })
    );
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

export function showSpeedBoostPreview(ui) {
    const at = GAME_CONFIG.round.speedBoostEvery;
    const speedPct = Math.round(GAME_CONFIG.round.speedBoostPercent * 100);
    showTransientBanner(
        ui,
        '_speedBoostPreviewBanner',
        `VITESSE +${speedPct}% au score ${at}`,
        hudTextStyle({
            fontSize: '11px',
            fill: DESIGN_TOKENS.bannerStreak,
            fontStyle: 'bold',
        })
    );
}

export function showDifficultyEscalationPreview(ui) {
    const at = GAME_CONFIG.round.gapTightenAfterScore;
    const step = GAME_CONFIG.round.gapTightenStep;
    const speedPct = Math.round(GAME_CONFIG.round.speedBoostPercent * 100);
    showTransientBanner(
        ui,
        '_escalationPreviewBanner',
        `GAPS ↓ + VITESSE +${speedPct}% au score ${at} (−${step}px)`,
        hudTextStyle({
            fontSize: '11px',
            fill: DESIGN_TOKENS.accentGap,
            fontStyle: 'bold',
        })
    );
}

export function showCoyoteHint(ui) {
    showTransientBanner(
        ui,
        '_coyoteHintBanner',
        coyoteHintText(),
        hudTextStyle({
            fontSize: '13px',
            fill: DESIGN_TOKENS.bannerCoyote,
            fontStyle: 'bold',
        }),
        22,
        900,
        1800
    );
}

export function showHardcoreInvincibilityHint(ui, durationMs) {
    destroyHudBanner(ui, '_hardcoreInvBanner');
    showTransientBanner(
        ui,
        '_hardcoreInvBanner',
        hardcoreInvincibilityHintText(durationMs),
        hudTextStyle({
            fontSize: '11px',
            fill: DESIGN_TOKENS.badgeHardcore,
            fontStyle: 'bold',
        })
    );
}

export function showFlash(ui, color = hexVersPhaser(DESIGN_TOKENS.texteHud), alpha = 0.8) {
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
