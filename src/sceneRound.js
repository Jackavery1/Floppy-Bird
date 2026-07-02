import { GAME_CONFIG } from './config.js';
import { GAME_STATE } from './gameState.js';
import { ensurePipeTextures } from './textures/pipeTextures.js';
import { playScoreFeedback } from './sceneRoundFeedback.js';
import { notifyAchievementUnlocks } from './metaAchievements.js';

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
    ensurePipeTextures(scene);
    const spawnWave = () => {
        scene.round.pipeSpawnTimer = null;
        if (scene.state !== GAME_STATE.PLAYING || !scene.pipes) return;
        scene.pipes.spawn();
    };
    scene.round.pipeSpawnTimer = scene.time.delayedCall(
        GAME_CONFIG.round.pipeSpawnDelayMs,
        spawnWave,
    );
}

/** Spawn immédiat (secours si le timer Phaser ne se déclenche pas). */
export function spawnPipeWave(scene) {
    if (scene.state !== GAME_STATE.PLAYING || !scene.pipes) return false;
    ensurePipeTextures(scene);
    scene.pipes.spawn();
    return scene.pipes.topPipes.length > 0;
}

/** @param {SceneContext} scene @param {number} deltaMs */
export function tickPipeSpawnFallback(scene, deltaMs) {
    if (scene.state !== GAME_STATE.PLAYING || !scene.pipes) return;
    if (scene.pipes._autoSpawnEnabled || scene.pipes.topPipes.length > 0) return;
    scene.round._pipeSpawnWaitMs = (scene.round._pipeSpawnWaitMs ?? 0) + deltaMs;
    if (scene.round._pipeSpawnWaitMs >= GAME_CONFIG.round.pipeSpawnDelayMs) {
        spawnPipeWave(scene);
    }
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
            if (scene.bird?.sprite) scene.bird.sprite.setAlpha(1);
        },
    );
}

/** @param {SceneContext} scene @param {number} pipeCount */
export function onPipeSpawned(scene, pipeCount) {
    if (!scene.hardcoreMode) return;
    const steps = GAME_CONFIG.round.hardcoreSpawnInvincibilitySteps;
    const idx = pipeCount - 1;
    if (idx < 0 || idx >= steps.length) return;
    startSpawnInvincibility(scene, steps[idx]);
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
            notifyAchievementUnlocks(scene);
        }
    });
}
