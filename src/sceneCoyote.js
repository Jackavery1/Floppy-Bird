import { GAME_CONFIG } from './config.js';
import { DESIGN_TOKENS, hexVersPhaser } from './designTokens.js';
import { GAME_STATE } from './gameState.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** Coyote time : recharge dans les gaps ; protège tuyaux et plafond (pas le sol). */
/** @param {SceneContext} scene @param {number} step */
export function updateCoyoteTime(scene, step) {
    const { round } = scene;
    const inGap = scene.pipes.isBirdInGap(scene.bird.getBounds());

    if (inGap) {
        const coyoteMax = scene.hardcoreMode
            ? (GAME_CONFIG.hardcore.coyoteTimeFrames ?? GAME_CONFIG.bird.coyoteTimeFrames)
            : GAME_CONFIG.bird.coyoteTimeFrames;
        round.coyoteFrames = coyoteMax;
    } else if (round.coyoteFrames > 0) {
        round.coyoteFrames = Math.max(0, round.coyoteFrames - step);
    }
}

/** @param {SceneContext} scene */
export function updateCoyoteVisual(scene) {
    const sprite = scene.bird?.sprite;
    if (!sprite) return;
    if (scene.state !== GAME_STATE.PLAYING || scene.round.spawnInvincible) {
        sprite.clearTint();
        return;
    }
    if (hasCoyoteGrace(scene)) {
        sprite.setTint(hexVersPhaser(DESIGN_TOKENS.teinteCoyoteActif));
    } else {
        sprite.clearTint();
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
