import { describe, it, expect, vi } from 'vitest';
import { preloadTextures } from '../../src/textures/index.js';
import { createBirdSpriteSheet } from '../../src/textures/birdTextures.js';
import { createPipeSprites } from '../../src/textures/pipeTextures.js';
import { createCloudTexture } from '../../src/textures/cloudTextures.js';
import { createStarTexture } from '../../src/textures/starTextures.js';
import { createGroundTexture, GROUND_BLADE_H, GROUND_TILE_H } from '../../src/textures/groundTextures.js';
import {
    getBackgroundPeriod,
    resetBackgroundCache,
    createBackgroundSprite,
} from '../../src/textures/backgroundTextures.js';
import { createTextureScene, createGraphicsMock } from '../helpers/phaserMock.js';

function sceneWithGraphicsList() {
    const graphicsList = [];
    const scene = createTextureScene();
    scene.make.graphics = vi.fn(() => {
        const g = createGraphicsMock();
        graphicsList.push(g);
        scene._graphics = g;
        return g;
    });
    scene._graphicsList = graphicsList;
    return scene;
}

describe('textures', () => {
    it('exporte les constantes sol', () => {
        expect(GROUND_BLADE_H).toBe(10);
        expect(GROUND_TILE_H).toBe(30);
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

    it('createBirdSpriteSheet génère bird-sheet', () => {
        const scene = createTextureScene();
        createBirdSpriteSheet(scene);
        expect(scene.make.graphics).toHaveBeenCalled();
        expect(scene._graphics.generateTexture).toHaveBeenCalledWith('bird-sheet', 114, 28);
        expect(scene.textures.get('bird-sheet').add).toHaveBeenCalledTimes(3);
    });

    it('createPipeSprites génère pipe-top et pipe-bottom', () => {
        const scene = sceneWithGraphicsList();
        createPipeSprites(scene);
        const keys = scene._graphicsList.flatMap(g =>
            g.generateTexture.mock.calls.map(c => c[0]),
        );
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
        expect(scene._graphics.generateTexture).toHaveBeenCalledWith('ground', 288, 30);
    });

    it('preloadTextures génère toutes les textures', () => {
        const scene = sceneWithGraphicsList();
        preloadTextures(scene);
        const keys = scene._graphicsList.flatMap(g =>
            g.generateTexture.mock.calls.map(c => c[0]),
        );
        expect(keys).toEqual(expect.arrayContaining([
            'bird-sheet', 'pipe-top', 'pipe-bottom', 'background', 'cloud', 'star', 'ground',
        ]));
        resetBackgroundCache();
    });
});
