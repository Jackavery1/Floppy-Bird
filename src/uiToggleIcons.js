/** @param {import('phaser').GameObjects.Graphics} g @param {boolean} enabled */
export function drawTrainingToggleIcon(g, enabled) {
    g.clear();
    const s = 10;
    const half = s / 2;
    if (enabled) {
        g.fillStyle(0x42a5f5, 1);
        g.fillRect(-half, -half, s, s);
        g.fillStyle(0xe3f2fd, 1);
        g.fillRect(-half + 2, -half + 2, s - 4, s - 4);
    } else {
        g.lineStyle(2, 0xb0bec5, 1);
        g.strokeRect(-half, -half, s, s);
    }
}

/** @param {import('phaser').GameObjects.Graphics} g @param {boolean} enabled @param {boolean} unlocked */
export function drawHardcoreToggleIcon(g, enabled, unlocked) {
    g.clear();
    if (!unlocked) {
        g.fillStyle(0x78909c, 1);
        g.fillRect(-5, -1, 10, 7);
        g.fillRect(-6, -5, 12, 5);
        g.fillStyle(0x546e7a, 1);
        g.fillRect(-2, -3, 4, 3);
        return;
    }
    const s = 10;
    const half = s / 2;
    if (enabled) {
        g.fillStyle(0xe53935, 1);
        g.fillRect(-half, -half, s, s);
        g.fillStyle(0xffcdd2, 1);
        g.fillRect(-half + 2, -half + 2, s - 4, s - 4);
    } else {
        g.lineStyle(2, 0xb0bec5, 1);
        g.strokeRect(-half, -half, s, s);
    }
}
