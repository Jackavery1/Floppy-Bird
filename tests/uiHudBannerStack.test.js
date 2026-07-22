import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    acquireHudBannerSlot,
    releaseHudBannerSlot,
    resetHudBannerSlots,
    destroyHudBanner,
    HUD_BANNER_BASE_Y,
    HUD_BANNER_ROW_GAP,
    HUD_BANNER_SCORE_GAP,
} from '../src/ui/hud/uiHudBannerStack.js';
import { UI } from '../src/ui/core/ui.js';
import { createBaseScene } from './helpers/phaserMock.js';

describe('uiHudBannerStack', () => {
    let ui;

    beforeEach(() => {
        ui = new UI(createBaseScene());
    });

    it('alloue des lignes distinctes pour chaque bannière', () => {
        const a = acquireHudBannerSlot(ui);
        const b = acquireHudBannerSlot(ui);
        expect(a.y).toBe(HUD_BANNER_BASE_Y);
        expect(b.y).toBe(HUD_BANNER_BASE_Y + HUD_BANNER_ROW_GAP);
        expect(a.row).not.toBe(b.row);
    });

    it('ancre les bannières sous le score HUD dynamique', () => {
        ui._scoreHudY = 96;
        const a = acquireHudBannerSlot(ui);
        expect(a.y).toBe(96 + HUD_BANNER_SCORE_GAP);
    });

    it('libère une ligne pour réutilisation', () => {
        const a = acquireHudBannerSlot(ui);
        releaseHudBannerSlot(ui, a.row);
        const b = acquireHudBannerSlot(ui);
        expect(b.row).toBe(a.row);
        expect(b.y).toBe(a.y);
    });

    it('resetHudBannerSlots vide toutes les lignes', () => {
        acquireHudBannerSlot(ui);
        acquireHudBannerSlot(ui);
        resetHudBannerSlots(ui);
        const next = acquireHudBannerSlot(ui);
        expect(next.y).toBe(HUD_BANNER_BASE_Y);
    });

    it('réutilise la dernière ligne quand toutes les lignes sont occupées', () => {
        for (let i = 0; i < 6; i++) acquireHudBannerSlot(ui);
        const overflow = acquireHudBannerSlot(ui);
        expect(overflow.row).toBe(5);
        expect(overflow.y).toBe(HUD_BANNER_BASE_Y + 5 * HUD_BANNER_ROW_GAP);
    });

    it('destroyHudBanner libère la ligne et efface la référence', () => {
        const slot = acquireHudBannerSlot(ui);
        const banner = { __bannerRow: slot.row, destroy: vi.fn() };
        ui._testBanner = banner;
        destroyHudBanner(ui, '_testBanner');
        expect(banner.destroy).toHaveBeenCalled();
        expect(ui._testBanner).toBeNull();
        const reused = acquireHudBannerSlot(ui);
        expect(reused.row).toBe(slot.row);
    });

    it('destroyHudBanner ignore une bannière absente', () => {
        expect(() => destroyHudBanner(ui, '_missingBanner')).not.toThrow();
    });
});
