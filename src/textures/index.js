import { createBirdSpriteSheet } from './birdTextures.js';
import { birdAnimKey } from '../skins/index.js';
import { loadSelectedSkin } from '../metaStorage.js';
import { createPipeSprites, ensurePipeTextures } from './pipeTextures.js';
import { createBackgroundSprite } from './backgroundTextures.js';
import { createCelestialTextures } from './celestialTextures.js';
import { createCloudTexture } from './cloudTextures.js';
import { createHillTextures } from './hillTextures.js';
import { createStarTexture } from './starTextures.js';
import { createGroundTexture } from './groundTextures.js';

export {
    getBackgroundPeriod,
    resetBackgroundCache,
    getBackgroundCanvasColor,
} from './backgroundTextures.js';
export { GROUND_BLADE_H, GROUND_TILE_H } from './groundTextures.js';
export { HILLS_FAR_H, HILLS_NEAR_H } from './hillTextures.js';
export { CELESTIAL_ANCHOR } from './celestialTextures.js';

function initialBirdSkinIds() {
    const selected = loadSelectedSkin();
    return selected === 'classic' ? ['classic'] : ['classic', selected];
}

/** @param {import('phaser').Scene} scene @param {string} skinId */
function ensureBirdAnimation(scene, skinId) {
    const texKey = `bird-sheet-${skinId}`;
    const animKey = birdAnimKey(skinId);
    if (scene.anims?.exists?.(animKey)) return;
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

/** @param {import('phaser').Scene} scene @param {string} skinId */
export function ensureBirdTexture(scene, skinId) {
    createBirdSpriteSheet(scene, skinId);
    ensureBirdAnimation(scene, skinId);
}

/** @param {import('phaser').Scene} scene @param {readonly string[]} skinIds */
export function ensureBirdTextures(scene, skinIds) {
    for (const skinId of skinIds) {
        ensureBirdTexture(scene, skinId);
    }
}

export function preloadTextures(scene) {
    createPipeSprites(scene);
    createBackgroundSprite(scene);
    createCelestialTextures(scene);
    createHillTextures(scene);
    createCloudTexture(scene);
    createStarTexture(scene);
    createGroundTexture(scene);
    ensureBirdTextures(scene, initialBirdSkinIds());
}

export { ensurePipeTextures };

