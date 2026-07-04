import { describe, it, expect, vi } from 'vitest';
import { DIFFICULTY } from '../src/config.js';
import { updateGapHudBadge, destroyGapHudBadge } from '../src/uiHudGapBadge.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';
import { UI } from '../src/ui.js';

vi.mock('../src/motion.js', () => ({ sceneTween: vi.fn() }));

describe('uiHudGapBadge', () => {
    it('masque le badge avant le seuil de resserrement', () => {
        const ui = new UI(
            createBaseScene({
                difficulty: DIFFICULTY.NORMAL,
                hardcoreMode: false,
                round: createRoundState(),
            })
        );
        ui.scoreText = { y: 68, setVisible: vi.fn(), setText: vi.fn(), setY: vi.fn() };
        ui._gapHudBadge = { setVisible: vi.fn() };

        updateGapHudBadge(ui, 19);

        expect(ui._gapHudBadge.setVisible).toHaveBeenCalledWith(false);
    });

    it('affiche l’écart effectif à partir du score 20', () => {
        const scene = createBaseScene({
            difficulty: DIFFICULTY.NORMAL,
            hardcoreMode: false,
            round: createRoundState(),
        });
        const ui = new UI(scene);
        ui.scoreText = { y: 68 };
        ui._inGameControlElements = [];

        updateGapHudBadge(ui, 20);

        expect(ui._gapHudBadge).toBeTruthy();
        expect(ui._gapHudBadge.setText).toHaveBeenCalledWith('ÉCART 112px');
        expect(ui._inGameControlElements).toContain(ui._gapHudBadge);
    });

    it('destroyGapHudBadge nettoie le badge', () => {
        const ui = { _gapHudBadge: { destroy: vi.fn() } };
        destroyGapHudBadge(ui);
        expect(ui._gapHudBadge).toBeNull();
    });
});
