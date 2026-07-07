/** @param {import('./ui.js').UI} ui */
export function layoutHudSecondaryBadges(ui) {
    const base = (ui.scoreText?.y ?? ui._scoreHudY ?? 68) + 22;
    let y = base;
    if (ui._coyoteHudBadge?.visible) {
        ui._coyoteHudBadge.setY(y);
        y += 14;
    }
    if (ui._gapHudBadge?.visible) {
        ui._gapHudBadge.setY(y);
    }
}
