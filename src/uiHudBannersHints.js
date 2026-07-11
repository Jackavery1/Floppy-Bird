import { hudBannerFill, hudTextStyle } from './designTokens.js';
import { coyoteHintText, coyoteLowGraceHintText } from './device.js';
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

/** @param {import('./ui.js').UI} ui @param {number} frames */
export function showCoyoteLowGraceHint(ui, frames) {
    showTransientBanner(
        ui,
        '_coyoteLowBanner',
        coyoteLowGraceHintText(frames),
        hudTextStyle({
            fontSize: '11px',
            fill: hudBannerFill('bannerCoyote'),
            fontStyle: 'bold',
        }),
        24,
        700,
        1200
    );
}
