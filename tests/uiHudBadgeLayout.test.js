import { describe, it, expect, vi } from 'vitest';
import { layoutHudSecondaryBadges } from '../src/uiHudBadgeLayout.js';

describe('uiHudBadgeLayout', () => {
    it('empile grâce et écart sous le score sans chevauchement', () => {
        const coyote = { visible: true, setY: vi.fn() };
        const gap = { visible: true, setY: vi.fn() };
        const ui = {
            scoreText: { y: 100 },
            _coyoteHudBadge: coyote,
            _gapHudBadge: gap,
        };
        layoutHudSecondaryBadges(ui);
        expect(coyote.setY).toHaveBeenCalledWith(122);
        expect(gap.setY).toHaveBeenCalledWith(136);
    });
});
