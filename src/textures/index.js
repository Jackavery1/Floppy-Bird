import { createBirdSpriteSheet } from './birdTextures.js';
import { createPipeSprites } from './pipeTextures.js';
import { createBackgroundSprite } from './backgroundTextures.js';
import { createCloudTexture } from './cloudTextures.js';
import { createStarTexture } from './starTextures.js';
import { createGroundTexture } from './groundTextures.js';

export { getBackgroundPeriod, resetBackgroundCache } from './backgroundTextures.js';
export { GROUND_BLADE_H, GROUND_TILE_H } from './groundTextures.js';

export function preloadTextures(scene) {
    createBirdSpriteSheet(scene);
    createPipeSprites(scene);
    createBackgroundSprite(scene);
    createCloudTexture(scene);
    createStarTexture(scene);
    createGroundTexture(scene);
}
