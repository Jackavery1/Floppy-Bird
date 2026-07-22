import { SPACING, UI_LAYOUT } from '../shared/uiLayout.js';

/** Marge sous le score HUD (68 + 18 = 86 sans badges). */
export const HUD_BANNER_SCORE_GAP = 18;
export const HUD_BANNER_BASE_Y = UI_LAYOUT.scoreHud + HUD_BANNER_SCORE_GAP;
export const HUD_BANNER_ROW_GAP = SPACING.xl - SPACING.xs;
const MAX_ROWS = 6;

/** @param {import('../core/ui.js').UI} [ui] */
export function resolveHudBannerBaseY(ui) {
    const scoreY = ui?._scoreHudY ?? UI_LAYOUT.scoreHud;
    return scoreY + HUD_BANNER_SCORE_GAP;
}

/** @param {import('../core/ui.js').UI} ui */
function ensureSlots(ui) {
    if (!ui._hudBannerSlots) ui._hudBannerSlots = Array(MAX_ROWS).fill(false);
    return ui._hudBannerSlots;
}

/** @param {import('../core/ui.js').UI} ui @returns {{ row: number, y: number }} */
export function acquireHudBannerSlot(ui) {
    const baseY = resolveHudBannerBaseY(ui);
    const slots = ensureSlots(ui);
    for (let row = 0; row < MAX_ROWS; row++) {
        if (!slots[row]) {
            slots[row] = true;
            return { row, y: baseY + row * HUD_BANNER_ROW_GAP };
        }
    }
    const row = MAX_ROWS - 1;
    return { row, y: baseY + row * HUD_BANNER_ROW_GAP };
}

/** @param {import('../core/ui.js').UI} ui @param {number} row */
export function releaseHudBannerSlot(ui, row) {
    const slots = ui._hudBannerSlots;
    if (slots && row >= 0 && row < slots.length) slots[row] = false;
}

/** @param {import('../core/ui.js').UI} ui */
export function resetHudBannerSlots(ui) {
    ui._hudBannerSlots = Array(MAX_ROWS).fill(false);
}

/** @param {import('../core/ui.js').UI} ui @param {string} key */
export function destroyHudBanner(ui, key) {
    const banner = ui[key];
    if (!banner) return;
    if (banner.__bannerRow != null) releaseHudBannerSlot(ui, banner.__bannerRow);
    banner.destroy();
    ui[key] = null;
}
