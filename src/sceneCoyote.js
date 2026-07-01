import { GAME_CONFIG } from './config.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @param {SceneContext} scene @param {number} step */
export function updateCoyoteTime(scene, step) {
    const { round } = scene;
    const inGap = scene.pipes.isBirdInGap(scene.bird.getBounds());
    if (inGap) {
        round.coyoteFrames = GAME_CONFIG.bird.coyoteTimeFrames;
    } else if (round.coyoteFrames > 0) {
        round.coyoteFrames = Math.max(0, round.coyoteFrames - step);
    }
}

/** @param {SceneContext} scene */
export function resetCoyoteTime(scene) {
    scene.round.coyoteFrames = 0;
}

/** @param {SceneContext} scene */
export function hasCoyoteGrace(scene) {
    return scene.round.coyoteFrames > 0;
}
