import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appendMetaMenu, showAchievementToasts } from '../src/uiMeta.js';
import { UI } from '../src/ui.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';

vi.mock('../src/motion.js', () => ({
    sceneTween: vi.fn(),
}));

vi.mock('../src/storage.js', () => ({
    loadHighScore: vi.fn(() => 0),
}));

describe('uiMeta', () => {
    let scene;
    let ui;

    beforeEach(() => {
        scene = createBaseScene({ round: createRoundState(), trainingMode: false, hardcoreMode: false });
        ui = new UI(scene);
    });

    it('appendMetaMenu ajoute skin et trophées', () => {
        const elements = [];
        const layout = { mute: 300 };
        appendMetaMenu(ui, elements, layout);
        expect(elements.length).toBeGreaterThanOrEqual(3);
        expect(ui._skinLabel).toBeTruthy();
        expect(ui._achLabel).toBeTruthy();
    });

    it('showAchievementToasts affiche un toast par succès', () => {
        showAchievementToasts(scene, [{ title: 'Premier vol' }]);
        expect(scene.add.text).toHaveBeenCalled();
    });
});
