import { GAME_CONFIG, getDifficultyForRound } from './config.js';
import { getDailyChallengeSeed } from './dailyChallenge.js';
import { GAME_STATE } from './gameState.js';
import { loadTutorialSeen } from './tutorialStorage.js';
import { applyTrainingTimeScale } from './sceneBootstrap.js';
import { resetCoyoteTime } from './sceneCoyote.js';
import { loadSelectedSkin } from './metaStorage.js';
import {
    cancelPipeSpawnTimer,
    scheduleFirstPipe,
    clearSpawnInvincibility,
    startSpawnInvincibility,
    onPipeSpawned,
} from './sceneRound.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @param {SceneContext} scene */
function clearPauseOverlay(scene) {
    scene.ui.clearOverlay('pause');
}

/** @param {SceneContext} scene @param {{ resetBird?: boolean }} [opts] */
export function beginRound(scene, { resetBird = false } = {}) {
    clearPauseOverlay(scene);
    cancelPipeSpawnTimer(scene);
    clearSpawnInvincibility(scene);
    scene.round.resetForRound();
    resetCoyoteTime(scene);
    scene.state = GAME_STATE.PLAYING;

    if (resetBird) {
        scene.bird.reset(GAME_CONFIG.bird.startX, GAME_CONFIG.centerY);
        scene.bird.setSkin(loadSelectedSkin());
    }

    scene.pipes.reset();
    scene.pipes.setSpawnHandler((count) => onPipeSpawned(scene, count));
    if (scene.dailyChallengeMode) {
        scene.pipes.setDailySeed(getDailyChallengeSeed());
    } else {
        scene.pipes.setDailySeed(null);
    }
    const roundDiff = getDifficultyForRound(scene.difficulty, scene.hardcoreMode);
    scene.pipes.applyRoundDifficulty(roundDiff);
    scene.bird.applyDifficulty(roundDiff);
    scene.ui.refreshHighScore(scene.difficulty, scene.hardcoreMode);
    scene.round.roundHighScore = scene.ui.highScore;
    scene.ui.createScoreDisplay();
    scene.ui.createInGameControls({
        trainingMode: scene.trainingMode,
        hardcoreMode: scene.hardcoreMode,
        onPause: () => scene.togglePause(),
    });
    if (!scene.hardcoreMode) {
        startSpawnInvincibility(scene);
    } else {
        const steps = GAME_CONFIG.round.hardcoreSpawnInvincibilitySteps;
        startSpawnInvincibility(scene, steps[0]);
    }
    scheduleFirstPipe(scene);
    applyTrainingTimeScale(scene);
    if (!loadTutorialSeen()) {
        scene.ui.showJumpTutorial();
    }
    if (scene.trainingMode) {
        scene.ghost.beginRound();
    }
}
