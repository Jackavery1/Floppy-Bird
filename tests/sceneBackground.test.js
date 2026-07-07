import { describe, it, expect, vi } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';
import { GAME_CONFIG } from '../src/config.js';
import {
    initClouds,
    initCelestial,
    updateClouds,
    createHills,
    updateHills,
    createGround,
    updateGround,
} from '../src/sceneBackground.js';
import { createBaseScene } from './helpers/phaserMock.js';

describe('sceneBackground', () => {
    it('initClouds crée 5 nuages', () => {
        const scene = createBaseScene();
        const clouds = initClouds(scene);
        expect(clouds).toHaveLength(5);
        expect(scene.add.sprite).toHaveBeenCalledTimes(5);
    });

    it('initCelestial crée un sprite soleil ou lune', () => {
        const scene = createBaseScene();
        const celestial = initCelestial(scene);
        expect(scene.add.sprite).toHaveBeenCalled();
        expect(celestial).toBe(scene._sprite);
    });

    it('createHills crée deux tileSprites parallax', () => {
        const scene = createBaseScene();
        const hills = createHills(scene);
        expect(scene.add.tileSprite).toHaveBeenCalledTimes(2);
        expect(hills.far).toBeTruthy();
        expect(hills.near).toBeTruthy();
    });

    it('updateClouds fait défiler et recycle les nuages', () => {
        const clouds = [{ x: -100, y: 80, _speed: 1 }];
        updateClouds(clouds);
        expect(clouds[0].x).toBe(GAME_CONFIG.width + 96);
    });

    it('updateHills défile en jeu et au menu', () => {
        const hills = {
            far: { tilePositionX: 0 },
            near: { tilePositionX: 0 },
        };
        updateHills(GAME_STATE.PLAYING, hills, 2, 1);
        expect(hills.far.tilePositionX).toBeCloseTo(0.36);
        expect(hills.near.tilePositionX).toBeCloseTo(0.84);
        hills.far.tilePositionX = 0;
        hills.near.tilePositionX = 0;
        updateHills(GAME_STATE.MENU, hills, 0, 1);
        expect(hills.far.tilePositionX).toBeCloseTo(0.0396);
        expect(hills.near.tilePositionX).toBeCloseTo(0.0924);
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
