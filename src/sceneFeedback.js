import { SOUND, GAME_CONFIG } from './config.js';
import { GAME_STATE } from './gameState.js';
import { playSound } from './audio.js';
import { hapticLight, hapticMedium } from './haptics.js';
import { applyTrainingTimeScale } from './sceneBootstrap.js';
import { prefersReducedMotion, sceneCameraShake } from './motion.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

export function playJumpFeedback() {
    playSound(SOUND.JUMP);
    hapticLight();
}

/** @param {number} score */
export function playScoreFeedback(score) {
    playSound(SOUND.SCORE, score);
    hapticLight();
}

/** @param {SceneContext} scene @param {'pipe' | 'ground' | 'ceiling'} [cause] */
export function playDeathImpactFeedback(scene, cause = 'pipe') {
    playSound(SOUND.GAME_OVER);
    hapticMedium();
    scene.ui.hideInGameScore();
    if (cause === 'pipe') {
        sceneCameraShake(scene.cameras.main, 200, 0.015);
        scene.ui.showFlash(0xffffff, 0.8);
    } else if (cause === 'ground') {
        sceneCameraShake(scene.cameras.main, 140, 0.012);
        scene.ui.showFlash(0xffcc80, 0.65);
    } else {
        sceneCameraShake(scene.cameras.main, 120, 0.01);
        scene.ui.showFlash(0xb3e5fc, 0.55);
    }
    applyDeathSlowMo(scene);
}

/** @param {SceneContext} scene */
function applyDeathSlowMo(scene) {
    const { deathSlowMoMs, deathSlowMoScale } = GAME_CONFIG.round;
    if (prefersReducedMotion()) {
        applyTrainingTimeScale(scene);
        return;
    }
    scene.time.timeScale = deathSlowMoScale;
    scene.time.delayedCall(deathSlowMoMs, () => {
        if (scene.state === GAME_STATE.DYING || scene.state === GAME_STATE.PLAYING) {
            applyTrainingTimeScale(scene);
        }
    });
}

export function playGroundImpactFeedback() {
    playSound(SOUND.GROUND);
    hapticLight();
}
