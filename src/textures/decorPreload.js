import { createPipeSprites } from './pipeTextures.js';
import { createCelestialTextures } from './celestialTextures.js';
import { createCloudTexture } from './cloudTextures.js';
import { createHillTextures } from './hillTextures.js';
import { createStarTexture } from './starTextures.js';

/** Textures décor (collines, nuages, tuyaux) — chunk Vite séparé, chargé après le monde minimal. */
export function preloadDecorTextures(scene) {
    createPipeSprites(scene);
    createCelestialTextures(scene);
    createHillTextures(scene);
    createCloudTexture(scene);
    createStarTexture(scene);
}
