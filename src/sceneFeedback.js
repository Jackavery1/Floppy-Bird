import { SOUND, GAME_CONFIG } from './config.js';
import { DESIGN_TOKENS, hexVersPhaser } from './designTokens.js';
import { GAME_STATE } from './gameState.js';
import { playSound } from './audio.js';
import { hapticLight, hapticHeavy } from './haptics.js';
import { applyTrainingTimeScale } from './sceneBootstrap.js';
import { spawnDeathJuice, spawnScoreJuice } from './sceneJuice.js';
import { prefersReducedMotion, sceneCameraShake } from './motion.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

export function playJumpFeedback() {
    playSound(SOUND.JUMP);
    hapticLight();
}

/** @param {number} score @param {import('./sceneTypes.js').SceneContext} [scene] */
export function playScoreFeedback(score, scene = null) {
    playSound(SOUND.SCORE, score);
    if (score > 0 && score % 10 === 0) {
        hapticHeavy();
    } else {
        hapticLight();
    }
    if (!scene?.bird) return;
    scene.scoreEffects?.show(scene.bird.x, scene.bird.y);
    if (score > 0 && score % 10 === 0) {
        spawnScoreJuice(scene, scene.bird.x, scene.bird.y, score);
    }
}

/** @param {SceneContext} scene @param {'pipe' | 'ground' | 'ceiling'} [cause] */
export function playDeathImpactFeedback(scene, cause = 'pipe') {
    playSound(SOUND.GAME_OVER);
    hapticHeavy();
    scene.ui.hideInGameScore();
    const reducedMotion = prefersReducedMotion();
    if (cause === 'pipe') {
        sceneCameraShake(scene.cameras.main, 260, 0.022);
        scene.ui.showFlash(hexVersPhaser(DESIGN_TOKENS.accentScoreHardcore), 0.75);
        if (!reducedMotion) spawnDeathJuice(scene, scene.bird.x, scene.bird.y, 'pipe');
    } else if (cause === 'ground') {
        sceneCameraShake(scene.cameras.main, 180, 0.018);
        scene.ui.showFlash(hexVersPhaser(DESIGN_TOKENS.accentGap), 0.65);
        if (!reducedMotion) {
            spawnDeathJuice(scene, scene.bird.x, GAME_CONFIG.groundY - 20, 'ground');
        }
    } else {
        sceneCameraShake(scene.cameras.main, 150, 0.014);
        scene.ui.showFlash(hexVersPhaser(DESIGN_TOKENS.flashPlafond), 0.55);
        if (!reducedMotion) spawnDeathJuice(scene, scene.bird.x, 30, 'ceiling');
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
