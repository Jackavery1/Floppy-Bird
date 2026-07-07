import { GAME_CONFIG } from './config.js';
import { shouldAnimateBackground, shouldScrollGround } from './gameState.js';
import {
    GROUND_BLADE_H,
    GROUND_TILE_H,
    getBackgroundPeriod,
    HILLS_FAR_H,
    HILLS_NEAR_H,
} from './textures/index.js';
import { createCelestialSprite } from './textures/celestialTextures.js';
import { DEPTH } from './uiDepth.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

const MENU_HILL_SPEED = 0.22;

/** @param {SceneContext} scene */
export function initClouds(scene) {
    const isNight = getBackgroundPeriod() === 'night';
    const clouds = [];
    for (let i = 0; i < 5; i++) {
        const x = (i / 5) * GAME_CONFIG.width + Math.random() * 60;
        const y = 60 + Math.random() * 160;
        const cloud = scene.add.sprite(x, y, 'cloud');
        cloud.setDepth(DEPTH.CLOUDS);
        cloud.setAlpha(isNight ? 0.62 : 0.94);
        cloud.setTint(isNight ? 0xb0bec5 : 0xffffff);
        cloud._speed = 0.3 + Math.random() * 0.2;
        clouds.push(cloud);
    }
    return clouds;
}

export function updateClouds(clouds) {
    for (const cloud of clouds) {
        cloud.x -= cloud._speed;
        if (cloud.x < -96) {
            cloud.x = GAME_CONFIG.width + 96;
            cloud.y = 60 + Math.random() * 160;
        }
    }
}

/** @param {SceneContext} scene */
export function initCelestial(scene) {
    const sprite = createCelestialSprite(scene);
    sprite.setDepth(DEPTH.CELESTIAL);
    return sprite;
}

/** @param {SceneContext} scene */
export function createHills(scene) {
    const groundTop = GAME_CONFIG.groundY - GROUND_BLADE_H;
    const cx = GAME_CONFIG.centerX;

    const far = scene.add.tileSprite(cx, groundTop - 10, GAME_CONFIG.width, HILLS_FAR_H, 'hills_far');
    far.setOrigin(0.5, 1);
    far.setDepth(DEPTH.HILLS_FAR);

    const near = scene.add.tileSprite(cx, groundTop, GAME_CONFIG.width, HILLS_NEAR_H, 'hills_near');
    near.setOrigin(0.5, 1);
    near.setDepth(DEPTH.HILLS_NEAR);

    return { far, near };
}

/**
 * @param {string} state
 * @param {{ far: import('phaser').GameObjects.TileSprite, near: import('phaser').GameObjects.TileSprite } | null} hills
 * @param {number} pipeSpeed
 * @param {number} [step]
 */
export function updateHills(state, hills, pipeSpeed, step = 1) {
    if (!shouldAnimateBackground(state) || !hills) return;
    const scroll = shouldScrollGround(state) ? pipeSpeed : MENU_HILL_SPEED;
    hills.far.tilePositionX += scroll * 0.18 * step;
    hills.near.tilePositionX += scroll * 0.42 * step;
}

/** @param {SceneContext} scene */
export function createGround(scene) {
    const gY = GAME_CONFIG.groundY;
    const centerY = gY - GROUND_BLADE_H + GROUND_TILE_H / 2;
    const groundSprite = scene.add.tileSprite(
        GAME_CONFIG.centerX,
        centerY,
        GAME_CONFIG.width,
        GROUND_TILE_H,
        'ground'
    );
    groundSprite.setDepth(DEPTH.GROUND);
    return groundSprite;
}

export function updateGround(state, groundSprite, pipeSpeed, step = 1) {
    if (shouldScrollGround(state) && groundSprite) {
        groundSprite.tilePositionX += pipeSpeed * step;
    }
}
