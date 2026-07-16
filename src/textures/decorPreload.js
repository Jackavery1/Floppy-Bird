import { createCelestialTextures } from './celestialTextures.js';
import { createCloudTexture } from './cloudTextures.js';
import { createHillTextures } from './hillTextures.js';
import { createStarTexture } from './starTextures.js';

/** Décor (collines, nuages, céleste) — chunk Vite séparé ; tuyaux dans essential. */
export function preloadDecorTextures(scene) {
    createCelestialTextures(scene);
    createHillTextures(scene);
    createCloudTexture(scene);
    createStarTexture(scene);
}
