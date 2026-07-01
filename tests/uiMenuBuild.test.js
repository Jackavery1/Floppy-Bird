import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UI } from '../src/ui.js';
import { DIFFICULTY } from '../src/config.js';
import { MIN_TOUCH, UI_LAYOUT } from '../src/uiLayout.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';

vi.mock('../src/motion.js', () => ({
    sceneTween: vi.fn(),
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
        scene = createBaseScene({ round: createRoundState(), trainingMode: false, hardcoreMode: false, dailyChallengeMode: true });
        ui = new UI(scene);
        ui._currentDifficulty = DIFFICULTY.NORMAL;
        ui.highScore = 42;
        elements = [];
        layout = { ...UI_LAYOUT.menu };
    });

    it('buildMenuHeader ajoute titre et record', async () => {
        const { buildMenuHeader } = await import('../src/uiMenuBuild.js');
        const title = buildMenuHeader(ui, elements, layout, DIFFICULTY.NORMAL, false);
        expect(title).toBeTruthy();
        expect(elements.length).toBeGreaterThanOrEqual(2);
        expect(ui._bestText).toBeTruthy();
        expect(ui._dailySubtitle).toBeUndefined();
    });

    it('buildMenuDifficulty crée un bouton par niveau', async () => {
        const { buildMenuDifficulty } = await import('../src/uiMenuBuild.js');
        buildMenuDifficulty(ui, elements, layout, DIFFICULTY.NORMAL);
        expect(ui._diffBtnLabels).toHaveLength(3);
        expect(ui._diffBtnGraphics).toBeTruthy();
    });

    it('buildMenuFooter ajoute start et hint', async () => {
        const { buildMenuFooter } = await import('../src/uiMenuBuild.js');
        const start = buildMenuFooter(ui, elements, layout);
        expect(start).toBe(ui._startText);
        expect(ui._hint1).toBeTruthy();
        expect(ui._muteHit).toBeUndefined();
    });

    it('buildMenuOptions crée le bouton et le panneau repliable', async () => {
        const { buildMenuOptions } = await import('../src/uiMenuOptions.js');
        buildMenuOptions(ui, elements, layout, false, false, true);
        expect(ui._optionsBtnLabel).toBeTruthy();
        expect(ui._optionsBtnHit).toBeTruthy();
        expect(ui._optionsBackdrop).toBeTruthy();
        expect(ui._trainingHit).toBeTruthy();
        const hits = scene.add.rectangle.mock.calls.filter(([, , , h]) => h === MIN_TOUCH);
        expect(hits.length).toBeGreaterThanOrEqual(4);
    });
});
