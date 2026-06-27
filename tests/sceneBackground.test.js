import { describe, it, expect } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';
import { GAME_CONFIG } from '../src/config.js';
import { initClouds, updateClouds, createGround, updateGround } from '../src/sceneBackground.js';
import { createBaseScene } from './helpers/phaserMock.js';

describe('sceneBackground', () => {
    it('initClouds crée 5 nuages', () => {
        const scene = createBaseScene();
        const clouds = initClouds(scene);
        expect(clouds).toHaveLength(5);
        expect(scene.add.sprite).toHaveBeenCalledTimes(5);
    });

    it('updateClouds fait défiler et recycle les nuages', () => {
        const clouds = [{ x: -100, y: 80, _speed: 1 }];
        updateClouds(clouds);
        expect(clouds[0].x).toBe(GAME_CONFIG.width + 96);
    });

    it('createGround crée un tileSprite', () => {
        const scene = createBaseScene();
        const ground = createGround(scene);
        expect(scene.add.tileSprite).toHaveBeenCalled();
        expect(ground).toBe(scene._sprite);
    });

    it('updateGround défile en PLAYING', () => {
        const ground = { tilePositionX: 0 };
        updateGround(GAME_STATE.PLAYING, ground, 2, 1);
        expect(ground.tilePositionX).toBe(2);
    });

    it('updateGround fige en pause', () => {
        const ground = { tilePositionX: 5 };
        updateGround(GAME_STATE.PAUSED, ground, 2, 1);
        expect(ground.tilePositionX).toBe(5);
    });
});
