import { GAME_CONFIG, getDifficultyForRound } from './config.js';
import { getDailyChallengeSeed, getDailyChallengeGoal } from './dailyChallenge.js';
import { GAME_STATE } from './gameState.js';
import { loadHighScore } from './storage.js';
import {
    showTutorialForProgress,
    showHardcoreTutorialIfNeeded,
    showTrainingTutorialIfNeeded,
} from './tutorialProgress.js';
import { incrementRoundsStarted } from './tutorialStorage.js';
import { applyTrainingTimeScale } from './sceneBootstrap.js';
import { resetCoyoteTime } from './sceneCoyote.js';
import { resolvePlaySkin } from './playSkin.js';
import { applySkinPatternToDifficulty } from './skinPatterns.js';
import { Utils } from './utils.js';
import { ensurePipeTextures } from './textures/index.js';
import {
    cancelPipeSpawnTimer,
    scheduleFirstPipe,
    clearSpawnInvincibility,
    startSpawnInvincibility,
    onPipeSpawned,
} from './sceneRound.js';
import { preloadGameOverUI } from './uiGameOverLoader.js';
import { syncShellGameState } from './shellGameState.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @param {SceneContext} scene */
function clearRoundOverlays(scene) {
    scene.ui.clearOverlay('menu');
    scene.ui.clearOverlay('pause');
}

/** @param {SceneContext} scene @param {{ resetBird?: boolean }} [opts] */
export function beginRound(scene, { resetBird = false } = {}) {
    preloadGameOverUI();
    clearRoundOverlays(scene);
    cancelPipeSpawnTimer(scene);
    clearSpawnInvincibility(scene);
    scene.round.resetForRound();
    resetCoyoteTime(scene);

    const skinId = resolvePlaySkin(scene);
    scene.activeSkinId = skinId;

    if (scene.playMode === 'daily') {
        scene.dailyChallengeMode = true;
        scene.dailyGoal = getDailyChallengeGoal(scene.difficulty);
    } else {
        scene.dailyChallengeMode = false;
        scene.dailyGoal = 0;
    }

    if (resetBird) {
        incrementRoundsStarted();
        scene.bird.reset(GAME_CONFIG.bird.startX, GAME_CONFIG.centerY);
        scene.bird.setSkin(skinId);
    }

    scene.pipes.reset();
    scene.pipes.setSpawnHandler((count) => onPipeSpawned(scene, count));
    scene.round.gapJitterSeed = scene.dailyChallengeMode ? 0 : Utils.randomInt(1, 0x7fffffff);
    if (scene.dailyChallengeMode) {
        scene.pipes.setDailySeed(getDailyChallengeSeed());
    } else {
        scene.pipes.setDailySeed(null);
    }
    scene.pipes.setGapJitterSeed(scene.round.gapJitterSeed);

    let roundDiff = getDifficultyForRound(scene.difficulty, scene.hardcoreMode);
    if (scene.playMode === 'daily') {
        roundDiff = applySkinPatternToDifficulty(roundDiff, skinId);
    }
    scene.pipes.applyRoundDifficulty(roundDiff);
    scene.bird.applyDifficulty(roundDiff);

    const roundHigh = loadHighScore(scene.difficulty, scene.hardcoreMode, skinId);
    scene.ui.highScore = roundHigh;
    scene.round.roundHighScore = roundHigh;
    scene.ui.createScoreDisplay();
    scene.ui.createInGameControls({
        trainingMode: scene.trainingMode,
        hardcoreMode: scene.hardcoreMode,
        dailyMode: scene.playMode === 'daily',
        dailyGoal: scene.dailyGoal,
        activeSkinId: skinId,
        onPause: () => scene.togglePause(),
        onJump: () => scene.handlePrimaryAction(),
    });

    ensurePipeTextures(scene);
    scheduleFirstPipe(scene);

    if (!scene.hardcoreMode) {
        startSpawnInvincibility(scene);
    } else {
        const steps = GAME_CONFIG.round.hardcoreSpawnInvincibilitySteps;
        startSpawnInvincibility(scene, steps[0]);
    }
    applyTrainingTimeScale(scene);
    showTutorialForProgress(scene);
    showHardcoreTutorialIfNeeded(scene);
    showTrainingTutorialIfNeeded(scene);
    if (scene.dailyChallengeMode && scene.dailyGoal > 0) {
        scene.ui.showDailyGoalBrief(scene.dailyGoal);
    }
    if (scene.trainingMode) {
        scene.ghost.beginRound({ record: true });
    } else if (scene.playMode === 'daily') {
        scene.ghost.beginRound({ record: false });
    }

    scene.time.paused = false;
    scene.state = GAME_STATE.PLAYING;
    syncShellGameState(GAME_STATE.PLAYING);
}
