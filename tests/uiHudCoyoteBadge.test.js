import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBaseScene } from './helpers/phaserMock.js';
import { updateCoyoteHudBadge, destroyCoyoteHudBadge } from '../src/uiHudCoyoteBadge.js';

vi.mock('../src/uiHudBadgeLayout.js', () => ({
    layoutHudSecondaryBadges: vi.fn(),
}));

describe('uiHudCoyoteBadge', () => {
    let ui;
    let scene;

    beforeEach(() => {
        scene = createBaseScene();
        ui = { scene, _inGameControlElements: [] };
    });

    it('masque le badge quand inactif', () => {
        ui._coyoteHudBadge = { setVisible: vi.fn() };
        updateCoyoteHudBadge(ui, false);
        expect(ui._coyoteHudBadge.setVisible).toHaveBeenCalledWith(false);
    });

    it('crée et affiche le badge GRÂCE quand actif', () => {
        updateCoyoteHudBadge(ui, true);
        expect(ui._coyoteHudBadge).toBeTruthy();
        expect(ui._inGameControlElements).toContain(ui._coyoteHudBadge);
    });

    it('réutilise le badge existant', () => {
        updateCoyoteHudBadge(ui, true);
        const badge = ui._coyoteHudBadge;
        updateCoyoteHudBadge(ui, true);
        expect(ui._coyoteHudBadge).toBe(badge);
    });

    it('destroyCoyoteHudBadge nettoie le badge', () => {
        updateCoyoteHudBadge(ui, true);
        const destroy = vi.spyOn(ui._coyoteHudBadge, 'destroy');
        destroyCoyoteHudBadge(ui);
        expect(destroy).toHaveBeenCalled();
        expect(ui._coyoteHudBadge).toBeNull();
    });
});
