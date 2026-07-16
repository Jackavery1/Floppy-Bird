import { GAME_CONFIG } from '../../config.js';
import { formatDailyStartBanner } from '../../dailyChallenge.js';
import { DESIGN_TOKENS, hexVersPhaser, hudBannerFill, hudTextStyle } from '../../designTokens.js';
import { hapticMedium } from '../../haptics.js';
import {
    FONT_SIZE_BODY,
    FONT_SIZE_CHROME,
    FONT_SIZE_EMPHASIS,
    FONT_SIZE_HINT,
    FONT_SIZE_SMALL,
} from '../shared/uiLayoutConstants.js';
import { showFlash, showTransientBanner } from './uiHudBannerCore.js';

export function showRecordBroken(ui) {
    hapticMedium();
    showTransientBanner(
        ui,
        '_recordBanner',
        'NOUVEAU RECORD !',
        hudTextStyle({
            fontSize: FONT_SIZE_EMPHASIS,
            fill: DESIGN_TOKENS.accent,
            fontStyle: 'bold',
        }),
        18
    );
}

export function showDifficultyEscalation(ui) {
    hapticMedium();
    showTransientBanner(
        ui,
        '_escalationBanner',
        'GAPS RESSERRÉS',
        hudTextStyle({
            fontSize: FONT_SIZE_HINT,
            fill: hudBannerFill('bannerEscalation'),
            fontStyle: 'bold',
        })
    );
    showFlash(ui, hexVersPhaser(DESIGN_TOKENS.bannerEscalation), 0.22);
}

export function showScoreStreak(ui, score) {
    hapticMedium();
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
            fontSize: FONT_SIZE_CHROME,
            fill: hudBannerFill('bannerStreak'),
            fontStyle: 'bold',
        })
    );
}

/** @param {import('../core/ui.js').UI} ui @param {number} goal @param {{ skinLabel?: string, patternTag?: string }} [brief] */
export function showDailyGoalBrief(ui, goal, brief = {}) {
    showTransientBanner(
        ui,
        '_dailyBriefBanner',
        formatDailyStartBanner({ ...brief, goal }),
        hudTextStyle({
            fontSize: FONT_SIZE_BODY,
            fill: hudBannerFill('badgeDaily'),
            fontStyle: 'bold',
            align: 'center',
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
            fontSize: FONT_SIZE_SMALL,
            fill: hudBannerFill('bannerStreak'),
            fontStyle: 'bold',
        })
    );
}

export function showDifficultyEscalationPreview(ui) {
    const at = GAME_CONFIG.round.gapTightenAfterScore;
    const step = GAME_CONFIG.round.gapTightenStep;
    showTransientBanner(
        ui,
        '_escalationPreviewBanner',
        `GAPS ↓ au score ${at} (−${step}px)`,
        hudTextStyle({
            fontSize: FONT_SIZE_SMALL,
            fill: hudBannerFill('accentGap'),
            fontStyle: 'bold',
        })
    );
}
