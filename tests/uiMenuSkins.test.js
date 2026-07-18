import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildSkinsTab, refreshSkinsTab } from '../src/ui/menu/uiMenuSkins.js';
import { UI } from '../src/ui/core/ui.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';
import { SKIN_IDS } from '../src/skins/index.js';
import { DIFFICULTY } from '../src/config.js';

vi.mock('../src/motion.js', () => ({
    sceneTween: vi.fn(),
}));

vi.mock('../src/textures/index.js', () => ({
    ensureBirdTexture: vi.fn(),
    ensureBirdTextures: vi.fn(),
}));

vi.mock('../src/metaContext.js', () => ({
    buildMetaContext: vi.fn(() => ({
        unlockedSkinCount: 16,
    })),
}));

vi.mock('../src/highScores.js', () => ({
    loadHighScore: vi.fn((difficulty, hardcore, skinId) => {
        if (skinId === 'cosmos') return 22;
        return 0;
    }),
    loadBestScoreAny: vi.fn(() => 0),
    loadBestHardcoreScore: vi.fn(() => 0),
}));

vi.mock('../src/metaStorage.js', () => ({
    loadSelectedSkin: vi.fn(() => 'classic'),
    saveSelectedSkin: vi.fn(),
}));

vi.mock('../src/skins/index.js', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        listUnlockedSkins: vi.fn(() => actual.SKIN_IDS),
    };
});

describe('uiMenuSkins', () => {
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

    it('buildSkinsTab ajoute une galerie pour chaque skin', async () => {
        const { ensureBirdTextures } = await import('../src/textures/index.js');
        const elements = [];
        buildSkinsTab(ui, elements, ui._optionsPanelElements);
        expect(ensureBirdTextures).toHaveBeenCalledWith(scene, SKIN_IDS);
        expect(ui._skinCells).toHaveLength(SKIN_IDS.length);
        expect(ui._skinsCountLine).toBeTruthy();
        expect(ui._skinHint).toBeUndefined();
        expect(ui._skinCycleHint).toBeUndefined();
        expect(elements.length).toBeGreaterThan(SKIN_IDS.length);
    });

    it('refreshSkinsTab affiche le record des skins spéciaux débloqués', () => {
        const elements = [];
        buildSkinsTab(ui, elements, ui._optionsPanelElements);
        scene.difficulty = DIFFICULTY.NORMAL;
        scene.hardcoreMode = false;
        const cosmosCell = ui._skinCells.find((c) => c.skinId === 'cosmos');
        expect(cosmosCell?.recordLabel).toBeTruthy();
        refreshSkinsTab(ui);
        expect(cosmosCell.recordLabel.setText).toHaveBeenCalledWith('★ 22');
    });
});
