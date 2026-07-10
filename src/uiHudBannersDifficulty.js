import { GAME_CONFIG } from './config.js';
import { DESIGN_TOKENS, hexVersPhaser, hudBannerFill, hudTextStyle } from './designTokens.js';
import { showFlash, showTransientBanner } from './uiHudBannerCore.js';

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
            fill: hudBannerFill('bannerEscalation'),
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
            fill: hudBannerFill('bannerStreak'),
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
            fill: hudBannerFill('badgeDaily'),
            fontStyle: 'bold',
        })
    );
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
            fill: hudBannerFill('bannerStreak'),
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
            fill: hudBannerFill('accentGap'),
            fontStyle: 'bold',
        })
    );
}
