import { describe, it, expect, vi } from 'vitest';
import {
    preloadTextures,
    createBirdAnimations,
    ensureBirdTexture,
} from '../../src/textures/index.js';
import { createBirdSpriteSheet } from '../../src/textures/birdTextures.js';
import { createPipeSprites, ensurePipeTextures } from '../../src/textures/pipeTextures.js';
import { createCloudTexture } from '../../src/textures/cloudTextures.js';
import { createStarTexture } from '../../src/textures/starTextures.js';
import {
    createGroundTexture,
    GROUND_BLADE_H,
    GROUND_TILE_H,
} from '../../src/textures/groundTextures.js';
import {
    getBackgroundPeriod,
    resetBackgroundCache,
    createBackgroundSprite,
    getBackgroundCanvasColor,
} from '../../src/textures/backgroundTextures.js';
import { createTextureScene, createGraphicsMock } from '../helpers/phaserMock.js';
import { SKIN_IDS, birdAnimKey } from '../../src/skins/index.js';

function sceneWithGraphicsList() {
    const graphicsList = [];
    const scene = createTextureScene();
    const makeGraphics = () => {
        const g = createGraphicsMock();
        graphicsList.push(g);
        scene._graphics = g;
        return g;
    };
    scene.make.graphics = vi.fn(makeGraphics);
    scene.add = { graphics: vi.fn(makeGraphics) };
    scene._graphicsList = graphicsList;
    return scene;
}

describe('textures', () => {
    it('exporte les constantes sol', () => {
        expect(GROUND_BLADE_H).toBe(10);
        expect(GROUND_TILE_H).toBe(36);
    });

    it('getBackgroundPeriod retourne day ou night', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-06-27T10:00:00'));
        expect(getBackgroundPeriod()).toBe('day');
        vi.setSystemTime(new Date('2026-06-27T22:00:00'));
        expect(getBackgroundPeriod()).toBe('night');
        vi.useRealTimers();
        resetBackgroundCache();
    });

    it('createBirdSpriteSheet génère bird-sheet-classic', () => {
        const scene = createTextureScene();
        createBirdSpriteSheet(scene);
        expect(scene.make.graphics).toHaveBeenCalled();
        expect(scene._graphics.generateTexture).toHaveBeenCalledWith('bird-sheet-classic', 114, 28);
        expect(scene.textures.get('bird-sheet-classic').add).toHaveBeenCalledTimes(3);
    });

    it('createBirdSpriteSheet agrandit le canvas pour un skin à accessoire (casque, cornes...)', () => {
        const scene = createTextureScene();
        createBirdSpriteSheet(scene, 'armure');
        expect(scene._graphics.generateTexture).toHaveBeenCalledWith('bird-sheet-armure', 114, 34);
        // Le casque doit être dessiné en plus du corps de base (davantage d'appels fillRect).
        const classicScene = createTextureScene();
        createBirdSpriteSheet(classicScene, 'classic');
        expect(scene._graphics.fillRect.mock.calls.length).toBeGreaterThan(
            classicScene._graphics.fillRect.mock.calls.length
        );
    });

    it('createBirdSpriteSheet applique une opacité réduite pour le fantôme', () => {
        const scene = createTextureScene();
        createBirdSpriteSheet(scene, 'fantome');
        const alphas = scene._graphics.fillStyle.mock.calls.map((c) => c[1]);
        expect(alphas).toContain(0.72);
    });

    it('ensurePipeTextures ne régénère pas si les textures existent déjà', () => {
        const scene = createTextureScene();
        scene.textures._register('pipe-top', 64, 500);
        scene.textures._register('pipe-bottom', 64, 500);
        ensurePipeTextures(scene);
        expect(scene.add?.graphics ?? scene.make.graphics).not.toHaveBeenCalled();
    });

    it('createPipeSprites génère pipe-top et pipe-bottom', () => {
        const graphicsList = [];
        const scene = createTextureScene();
        scene.add = {
            graphics: vi.fn(() => {
                const g = createGraphicsMock();
                graphicsList.push(g);
                scene._graphics = g;
                return g;
            }),
        };
        createPipeSprites(scene);
        expect(scene.add.graphics).toHaveBeenCalledTimes(2);
        const keys = graphicsList.flatMap((g) => g.generateTexture.mock.calls.map((c) => c[0]));
        expect(keys).toContain('pipe-top');
        expect(keys).toContain('pipe-bottom');
    });

    it('createBackgroundSprite génère background et met en cache', () => {
        const scene = createTextureScene();
        createBackgroundSprite(scene);
        expect(scene._graphics.generateTexture).toHaveBeenCalledWith('background', 288, 512);
        scene._graphics.generateTexture.mockClear();
        createBackgroundSprite(scene);
        expect(scene._graphics.generateTexture).not.toHaveBeenCalled();
        resetBackgroundCache();
    });

    it('createBackgroundSprite dessine des étoiles la nuit seulement', () => {
        vi.useFakeTimers();
        const scene = createTextureScene();

        vi.setSystemTime(new Date('2026-06-27T22:00:00'));
        resetBackgroundCache();
        createBackgroundSprite(scene);
        const nightStars = scene._graphics.fillCircle.mock.calls.length;

        vi.setSystemTime(new Date('2026-06-27T10:00:00'));
        resetBackgroundCache();
        scene.textures.remove('background');
        createBackgroundSprite(scene);
        const dayStars = scene._graphics.fillCircle.mock.calls.length - nightStars;

        expect(nightStars).toBeGreaterThan(dayStars);
        vi.useRealTimers();
        resetBackgroundCache();
    });

    it('getBackgroundCanvasColor suit la période', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-06-27T10:00:00'));
        expect(getBackgroundCanvasColor()).toBe('#87ceeb');
        vi.setSystemTime(new Date('2026-06-27T22:00:00'));
        expect(getBackgroundCanvasColor()).toBe('#1a1a2e');
        vi.useRealTimers();
        resetBackgroundCache();
    });

    it('createCloudTexture génère cloud', () => {
        const scene = createTextureScene();
        createCloudTexture(scene);
        expect(scene._graphics.generateTexture).toHaveBeenCalledWith('cloud', 152, 70);
    });

    it('createStarTexture génère star', () => {
        const scene = createTextureScene();
        createStarTexture(scene);
        expect(scene._graphics.generateTexture).toHaveBeenCalledWith('star', 16, 16);
    });

    it('createGroundTexture génère ground', () => {
        const scene = createTextureScene();
        createGroundTexture(scene);
        expect(scene._graphics.generateTexture).toHaveBeenCalledWith('ground', 288, 36);
    });

    it('createBirdAnimations enregistre les animations via le barrel', () => {
        const created = [];
        const scene = sceneWithGraphicsList();
        scene.anims = {
            exists: vi.fn(() => false),
            create: vi.fn((cfg) => created.push(cfg.key)),
        };
        createBirdAnimations(scene);
        expect(created).toHaveLength(SKIN_IDS.length);
        expect(created[0]).toBe(birdAnimKey(SKIN_IDS[0]));
        expect(scene.anims.create).toHaveBeenCalledTimes(SKIN_IDS.length);
    });

    it('preloadTextures génère le monde et les skins initiaux seulement', () => {
        const scene = sceneWithGraphicsList();
        scene.anims = { exists: vi.fn(() => false), create: vi.fn() };
        preloadTextures(scene);
        const keys = scene._graphicsList.flatMap((g) =>
            g.generateTexture.mock.calls.map((c) => c[0])
        );
        const birdSheets = keys.filter((k) => k.startsWith('bird-sheet-'));
        expect(birdSheets).toEqual(['bird-sheet-classic']);
        expect(keys).toEqual(
            expect.arrayContaining([
                'pipe-top',
                'pipe-bottom',
                'background',
                'sun',
                'moon',
                'hills_far',
                'hills_near',
                'cloud',
                'star',
                'ground',
            ])
        );
        resetBackgroundCache();
    });

    it('ensureBirdTexture charge un skin à la demande', () => {
        const scene = sceneWithGraphicsList();
        scene.anims = { exists: vi.fn(() => false), create: vi.fn() };
        ensureBirdTexture(scene, 'neon');
        const keys = scene._graphicsList.flatMap((g) =>
            g.generateTexture.mock.calls.map((c) => c[0])
        );
        expect(keys).toContain('bird-sheet-neon');
        expect(scene.anims.create).toHaveBeenCalledWith(
            expect.objectContaining({ key: birdAnimKey('neon') })
        );
    });

    it('preloadTextures inclut le skin sélectionné hors classic', async () => {
        vi.resetModules();
        vi.doMock('../../src/metaStorage.js', () => ({
            loadSelectedSkin: () => 'ocean',
        }));
        const { preloadTextures: preloadAvecOcean } = await import('../../src/textures/index.js');
        const scene = sceneWithGraphicsList();
        scene.anims = { exists: vi.fn(() => false), create: vi.fn() };
        preloadAvecOcean(scene);
        const keys = scene._graphicsList.flatMap((g) =>
            g.generateTexture.mock.calls.map((c) => c[0])
        );
        const birdSheets = keys.filter((k) => k.startsWith('bird-sheet-'));
        expect(birdSheets.sort()).toEqual(['bird-sheet-classic', 'bird-sheet-ocean']);
        vi.doUnmock('../../src/metaStorage.js');
        vi.resetModules();
        resetBackgroundCache();
    });
});
