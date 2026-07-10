import { hudBannerFill, hudTextStyle } from './designTokens.js';
import { coyoteHintText, hardcoreInvincibilityHintText } from './device.js';
import { destroyHudBanner } from './uiHudBannerStack.js';
import { showTransientBanner } from './uiHudBannerCore.js';

export function showCoyoteHint(ui) {
    showTransientBanner(
        ui,
        '_coyoteHintBanner',
        coyoteHintText(),
        hudTextStyle({
            fontSize: '13px',
            fill: hudBannerFill('bannerCoyote'),
            fontStyle: 'bold',
        }),
        22,
        900,
        1800
    );
}

export function showHardcoreInvincibilityHint(ui, durationMs, pipeIndex = 1) {
    destroyHudBanner(ui, '_hardcoreInvBanner');
    showTransientBanner(
        ui,
        '_hardcoreInvBanner',
        hardcoreInvincibilityHintText(durationMs, pipeIndex),
        hudTextStyle({
            fontSize: '11px',
            fill: hudBannerFill('badgeHardcore'),
            fontStyle: 'bold',
        }),
        18,
        500,
        1800
    );
}
