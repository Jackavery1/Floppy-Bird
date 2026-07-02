import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildSkinsTab, showAchievementToasts } from '../src/uiMeta.js';
import { UI } from '../src/ui.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';
import { SKIN_IDS } from '../src/skins.js';

vi.mock('../src/motion.js', () => ({
    sceneTween: vi.fn(),
}));

vi.mock('../src/storage.js', () => ({
    loadHighScore: vi.fn(() => 0),
}));

vi.mock('../src/metaStorage.js', () => ({
    loadSelectedSkin: vi.fn(() => 'classic'),
    saveSelectedSkin: vi.fn(),
    loadUnlockedAchievements: vi.fn(() => []),
}));

describe('uiMeta', () => {
    let scene;
    let ui;

    beforeEach(() => {
        scene = createBaseScene({
            round: createRoundState(),
            trainingMode: false,
            hardcoreMode: false,
            bird: { setSkin: vi.fn() },
        });
        ui = new UI(scene);
        ui._optionsPanelElements = [];
    });

    it('buildSkinsTab ajoute une galerie pour chaque skin', () => {
        const elements = [];
        buildSkinsTab(ui, elements, ui._optionsPanelElements);
        expect(ui._skinCells).toHaveLength(SKIN_IDS.length);
        expect(ui._skinsCountLine).toBeTruthy();
        expect(elements.length).toBeGreaterThan(SKIN_IDS.length);
    });

    it('showAchievementToasts affiche un toast par succès', () => {
        showAchievementToasts(scene, [{ title: 'Premier vol' }]);
        expect(scene.add.text).toHaveBeenCalled();
    });
});
