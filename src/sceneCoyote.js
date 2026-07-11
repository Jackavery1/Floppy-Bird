import { GAME_CONFIG } from './config.js';
import { GAME_STATE } from './gameState.js';
import { loadCoyoteHintSeen, markCoyoteHintSeen } from './tutorialStorage.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** Grâce coyote : uniquement dans les gaps (tuyaux), pas sol/plafond — voir README. */
/** @param {SceneContext} scene @param {number} step */
export function updateCoyoteTime(scene, step) {
    const { round } = scene;
    const inGap = scene.pipes.isBirdInGap(scene.bird.getBounds());
    const wasInGap = round._wasInGap ?? false;

    if (wasInGap && !inGap && round.coyoteFrames > 0 && !loadCoyoteHintSeen()) {
        scene.ui.showCoyoteHint?.();
        markCoyoteHintSeen();
    }

    if (inGap) {
        round.coyoteFrames = GAME_CONFIG.bird.coyoteTimeFrames;
        round.coyoteLowWarnShown = false;
    } else if (round.coyoteFrames > 0) {
        round.coyoteFrames = Math.max(0, round.coyoteFrames - step);
        if (round.coyoteFrames > 0 && round.coyoteFrames <= 2 && !round.coyoteLowWarnShown) {
            scene.ui.showCoyoteLowGraceHint?.(round.coyoteFrames);
            round.coyoteLowWarnShown = true;
        }
    }

    round._wasInGap = inGap;
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
        sprite.setTint(0xffeeaa);
    } else {
        sprite.clearTint();
    }
}

/** @param {SceneContext} scene */
export function resetCoyoteTime(scene) {
    scene.round.coyoteFrames = 0;
    scene.round._wasInGap = false;
}

/** @param {SceneContext} scene */
export function hasCoyoteGrace(scene) {
    return scene.round.coyoteFrames > 0;
}
