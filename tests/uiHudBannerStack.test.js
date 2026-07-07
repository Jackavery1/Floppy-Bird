import { describe, it, expect, beforeEach } from 'vitest';
import {
    acquireHudBannerSlot,
    releaseHudBannerSlot,
    resetHudBannerSlots,
    HUD_BANNER_BASE_Y,
    HUD_BANNER_ROW_GAP,
} from '../src/uiHudBannerStack.js';
import { UI } from '../src/ui.js';
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
});
