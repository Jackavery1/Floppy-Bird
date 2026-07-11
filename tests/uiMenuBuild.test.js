import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UI } from '../src/ui.js';
import { DIFFICULTY } from '../src/config.js';
import { MIN_TOUCH, UI_LAYOUT } from '../src/uiLayout.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';

vi.mock('../src/motion.js', () => ({
    sceneTween: vi.fn(),
    prefersReducedMotion: vi.fn(() => false),
}));

vi.mock('../src/audio.js', () => ({
    cycleSoundLevel: vi.fn(),
    formatSoundLabel: vi.fn(() => '100 %'),
    isAudioAvailable: vi.fn(() => true),
}));

describe('uiMenuBuild', () => {
    let scene;
    let ui;
    let elements;
    let layout;

    beforeEach(() => {
        scene = createBaseScene({
            round: createRoundState(),
            trainingMode: false,
            hardcoreMode: false,
            dailyChallengeMode: true,
        });
        ui = new UI(scene);
        ui._currentDifficulty = DIFFICULTY.NORMAL;
        ui.highScore = 42;
        elements = [];
        layout = { ...UI_LAYOUT.menu };
    });

    it('buildMenuHeader ajoute le titre avec relief', async () => {
        const { buildMenuHeader } = await import('../src/uiMenuHeader.js');
        const title = buildMenuHeader(ui, elements, layout);
        expect(title).toBeTruthy();
        expect(ui._menuTitleShadow).toBeTruthy();
        expect(elements.length).toBeGreaterThanOrEqual(2);
        expect(ui._bestText).toBeUndefined();
    });

    it('buildMenuDifficulty crée un bouton par niveau', async () => {
        const { buildMenuDifficulty } = await import('../src/uiMenuHeader.js');
        buildMenuDifficulty(ui, elements, layout, DIFFICULTY.NORMAL);
        expect(ui._diffBtnLabels).toHaveLength(3);
        expect(ui._diffBtnGraphics).toBeTruthy();
    });

    it('buildMenuFooter ajoute start et zone tactile 44 px', async () => {
        const { buildMenuFooter } = await import('../src/uiMenuBuild.js');
        const start = buildMenuFooter(ui, elements, layout);
        expect(start).toBe(ui._startText);
        expect(ui._startHit).toBeTruthy();
        expect(ui._startHit.setDepth).toHaveBeenCalled();
        expect(scene.add.rectangle).toHaveBeenCalledWith(
            expect.any(Number),
            layout.start,
            240,
            MIN_TOUCH,
            expect.any(Number),
            expect.any(Number)
        );
        expect(ui._hint1).toBeUndefined();
        expect(ui._muteHit).toBeUndefined();
    });

    it('buildMenuOptions crée le bouton sans construire le panneau tant qu’il est fermé', async () => {
        const { buildMenuOptions } = await import('../src/uiMenuOptions.js');
        buildMenuOptions(ui, elements, layout);
        expect(ui._optionsBtnLabel).toBeTruthy();
        expect(ui._optionsBtnHit).toBeTruthy();
        expect(ui._optionsBackdrop).toBeFalsy();
        expect(ui._trainingHit).toBeFalsy();
        expect(ui._optionsPanelBuilt).toBe(false);
    });
});
