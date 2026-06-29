import { GAME_CONFIG, SOUND } from './config.js';
import { GAME_STATE } from './gameState.js';
import { playSound } from './audio.js';
import { hapticLight } from './haptics.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

export function shouldNotifyRecord(score, roundHighScore, recordNotified) {
    return !recordNotified && roundHighScore > 0 && score > roundHighScore;
}

/** @param {SceneContext} scene */
export function cancelPipeSpawnTimer(scene) {
    if (scene._pipeSpawnTimer) {
        scene._pipeSpawnTimer.remove(false);
        scene._pipeSpawnTimer = null;
    }
}

/** @param {SceneContext} scene */
export function scheduleFirstPipe(scene) {
    cancelPipeSpawnTimer(scene);
    scene._pipeSpawnTimer = scene.time.delayedCall(GAME_CONFIG.round.pipeSpawnDelayMs, () => {
        scene._pipeSpawnTimer = null;
        if (scene.state === GAME_STATE.PLAYING) {
            scene.pipes.spawn();
        }
    });
}

/** @param {SceneContext} scene */
export function clearSpawnInvincibility(scene) {
    if (scene._spawnInvincibleTimer) {
        scene._spawnInvincibleTimer.remove(false);
        scene._spawnInvincibleTimer = null;
    }
    scene._spawnInvincible = false;
}

/** @param {SceneContext} scene */
export function startSpawnInvincibility(scene) {
    clearSpawnInvincibility(scene);
    scene._spawnInvincible = true;
    scene._spawnInvincibleTimer = scene.time.delayedCall(
        GAME_CONFIG.round.spawnInvincibilityMs,
        () => {
            scene._spawnInvincibleTimer = null;
            scene._spawnInvincible = false;
        },
    );
}

/** @param {SceneContext} scene */
export function checkScorePipes(scene) {
    const birdX = scene.bird.x;
    scene.pipes.topPipes.forEach(pipe => {
        if (!pipe.scored && birdX > pipe.x + scene.pipes.pipeWidth / 2) {
            pipe.scored = true;
            scene.score++;
            scene.ui.updateScore(scene.score);
            scene.pipes.applySpeedForScore(scene.score);
            playSound(SOUND.SCORE, scene.score);
            hapticLight();
            scene.scoreEffects.show(scene.bird.x, scene.bird.y);
            if (shouldNotifyRecord(scene.score, scene._roundHighScore, scene._recordNotified)) {
                scene._recordNotified = true;
                scene.ui.showRecordBroken();
            }
        }
    });
}
