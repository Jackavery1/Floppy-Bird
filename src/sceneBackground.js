import { GAME_CONFIG } from './config.js';
import { shouldScrollGround } from './gameState.js';
import { GROUND_BLADE_H, GROUND_TILE_H } from './proceduralTextures.js';

export function initClouds(scene) {
    const clouds = [];
    for (let i = 0; i < 5; i++) {
        const x = (i / 5) * GAME_CONFIG.width + Math.random() * 60;
        const y = 60 + Math.random() * 160;
        const cloud = scene.add.sprite(x, y, 'cloud');
        cloud.setDepth(1);
        cloud.setAlpha(0.88);
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

export function createGround(scene) {
    const gY = GAME_CONFIG.groundY;
    const centerY = gY - GROUND_BLADE_H + GROUND_TILE_H / 2;
    const groundSprite = scene.add.tileSprite(
        GAME_CONFIG.centerX,
        centerY,
        GAME_CONFIG.width,
        GROUND_TILE_H,
        'ground',
    );
    groundSprite.setDepth(8);
    return groundSprite;
}

export function updateGround(state, groundSprite, pipeSpeed, step = 1) {
    if (shouldScrollGround(state) && groundSprite) {
        groundSprite.tilePositionX += pipeSpeed * step;
    }
}
