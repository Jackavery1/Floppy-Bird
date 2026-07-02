import { createBirdSpriteSheet } from './birdTextures.js';
import { birdAnimKey, SKIN_IDS } from '../skins/index.js';
import { createPipeSprites, ensurePipeTextures } from './pipeTextures.js';
import { createBackgroundSprite } from './backgroundTextures.js';
import { createCloudTexture } from './cloudTextures.js';
import { createStarTexture } from './starTextures.js';
import { createGroundTexture } from './groundTextures.js';

export { getBackgroundPeriod, resetBackgroundCache, getBackgroundCanvasColor } from './backgroundTextures.js';
export { GROUND_BLADE_H, GROUND_TILE_H } from './groundTextures.js';

export function preloadTextures(scene) {
    createPipeSprites(scene);
    createBackgroundSprite(scene);
    createCloudTexture(scene);
    createStarTexture(scene);
    createGroundTexture(scene);
    for (const skinId of SKIN_IDS) {
        createBirdSpriteSheet(scene, skinId);
    }
}

export { ensurePipeTextures };

/** @param {import('phaser').Scene} scene */
export function createBirdAnimations(scene) {
    for (const skinId of SKIN_IDS) {
        const texKey = `bird-sheet-${skinId}`;
        const animKey = birdAnimKey(skinId);
        if (scene.anims?.exists?.(animKey)) continue;
        scene.anims.create({
            key: animKey,
            frames: [
                { key: texKey, frame: 0 },
                { key: texKey, frame: 1 },
                { key: texKey, frame: 2 },
                { key: texKey, frame: 1 },
            ],
            frameRate: 10,
            repeat: 0,
        });
    }
}
