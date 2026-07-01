import { GAME_CONFIG } from './config.js';
import { GAME_STATE } from './gameState.js';
import { playScoreFeedback } from './sceneRoundFeedback.js';
import { processMetaOnScore } from './metaProgress.js';
import { showAchievementToasts } from './uiMeta.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

export function shouldNotifyRecord(score, roundHighScore, recordNotified) {
    return !recordNotified && roundHighScore > 0 && score > roundHighScore;
}

/** @param {SceneContext} scene */
export function cancelPipeSpawnTimer(scene) {
    const { round } = scene;
    if (round.pipeSpawnTimer) {
        round.pipeSpawnTimer.remove(false);
        round.pipeSpawnTimer = null;
    }
}

/** @param {SceneContext} scene */
export function scheduleFirstPipe(scene) {
    cancelPipeSpawnTimer(scene);
    scene.round.pipeSpawnTimer = scene.time.delayedCall(GAME_CONFIG.round.pipeSpawnDelayMs, () => {
        scene.round.pipeSpawnTimer = null;
        if (scene.state === GAME_STATE.PLAYING) {
            scene.pipes.spawn();
        }
    });
}

/** @param {SceneContext} scene */
export function clearSpawnInvincibility(scene) {
    const { round } = scene;
    if (round.spawnInvincibleTimer) {
        round.spawnInvincibleTimer.remove(false);
        round.spawnInvincibleTimer = null;
    }
    round.spawnInvincible = false;
}

/** @param {SceneContext} scene @param {number} [durationMs] */
export function startSpawnInvincibility(scene, durationMs = GAME_CONFIG.round.spawnInvincibilityMs) {
    const { round } = scene;
    clearSpawnInvincibility(scene);
    round.spawnInvincible = true;
    round.spawnInvincibleTimer = scene.time.delayedCall(
        durationMs,
        () => {
            round.spawnInvincibleTimer = null;
            round.spawnInvincible = false;
        },
    );
}

/** @param {SceneContext} scene */
export function checkScorePipes(scene) {
    const { round } = scene;
    const birdX = scene.bird.x;
    scene.pipes.topPipes.forEach(pipe => {
        if (!pipe.scored && birdX > pipe.x + scene.pipes.pipeWidth / 2) {
            pipe.scored = true;
            round.score++;
            scene.ui.updateScore(round.score);
            scene.pipes.applySpeedForScore(round.score);
            playScoreFeedback(round.score);
            scene.scoreEffects.show(scene.bird.x, scene.bird.y);
            if (shouldNotifyRecord(round.score, round.roundHighScore, round.recordNotified)) {
                round.recordNotified = true;
                scene.ui.showRecordBroken();
            }
            showAchievementToasts(scene, processMetaOnScore(scene));
        }
    });
}
