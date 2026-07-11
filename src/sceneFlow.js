import { GAME_CONFIG } from './config.js';
import {
    GAME_STATE,
    canChangeDifficulty,
    canHandlePrimaryAction,
    canReturnToMenu,
    shouldStartGameOnPrimary,
} from './gameState.js';
import {
    toggleTrainingMode,
    toggleHardcoreMode,
    cycleTrainingSpeed as cycleTrainingSpeedMode,
} from './sceneModeSettings.js';
import { saveTrainingEnabled } from './trainingStorage.js';
import { saveHardcoreEnabled } from './hardcoreStorage.js';
import { cancelPipeSpawnTimer, clearSpawnInvincibility } from './sceneRound.js';
import { resetCoyoteTime } from './sceneCoyote.js';
import { requestJump } from './sceneJumpBuffer.js';
import { beginRound } from './sceneBeginRound.js';
import { closeMenuPanelsForRoundStart, openMainMenu } from './sceneMenuSync.js';
import {
    enterPauseAccessibility,
    exitPauseAccessibility,
    hideAccessibilityForRoundStart,
} from './sceneA11ySync.js';
import { syncShellGameState } from './shellGameState.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @param {SceneContext} scene */
export function applyPlayingState(scene) {
    scene.state = GAME_STATE.PLAYING;
    scene.time.paused = false;
    syncShellGameState(GAME_STATE.PLAYING);
}

/** @param {SceneContext} scene */
export function applyPausedState(scene) {
    scene.state = GAME_STATE.PAUSED;
    scene.time.paused = true;
    syncShellGameState(GAME_STATE.PAUSED);
}

/** @param {SceneContext} scene */
export function resumeClock(scene) {
    scene.time.paused = false;
}

/** @param {SceneContext} scene */
function clearPauseOverlay(scene) {
    scene.ui.clearOverlay('pause');
    hideAccessibilityForRoundStart();
}

/** @param {SceneContext} scene */
export function showMenu(scene) {
    clearPauseOverlay(scene);
    openMainMenu(scene);
}

/** @param {SceneContext} scene */
export function startGame(scene) {
    scene.playMode = 'classic';
    scene.dailyChallengeMode = false;
    if (scene.state === GAME_STATE.MENU) {
        hideAccessibilityForRoundStart();
        closeMenuPanelsForRoundStart(scene);
        scene.ui.clearOverlay('menu');
        beginRound(scene, { resetBird: true });
    } else if (scene.state === GAME_STATE.GAME_OVER) {
        hideAccessibilityForRoundStart();
        scene.ui.clearOverlay('gameOver');
        beginRound(scene, { resetBird: true });
    }
}

/** @param {SceneContext} scene */
export function startDailyChallenge(scene) {
    if (scene.state !== GAME_STATE.MENU && scene.state !== GAME_STATE.GAME_OVER) return;
    scene.playMode = 'daily';
    scene.dailyChallengeMode = true;
    scene.trainingMode = false;
    saveTrainingEnabled(false);
    scene.hardcoreMode = false;
    saveHardcoreEnabled(false);
    if (scene.state === GAME_STATE.MENU) {
        hideAccessibilityForRoundStart();
        closeMenuPanelsForRoundStart(scene);
        scene.ui.clearOverlay('menu');
    } else {
        hideAccessibilityForRoundStart();
        scene.ui.clearOverlay('gameOver');
    }
    beginRound(scene, { resetBird: true });
}

/** @param {SceneContext} scene */
export function returnToMenu(scene) {
    if (!canReturnToMenu(scene.state)) return;
    resumeClock(scene);
    cancelPipeSpawnTimer(scene);
    clearSpawnInvincibility(scene);
    scene.round.jumpBufferFrames = 0;
    resetCoyoteTime(scene);
    clearPauseOverlay(scene);
    scene.ghost.finishRound(scene.round.score);
    scene.bird.reset(GAME_CONFIG.bird.startX, GAME_CONFIG.centerY);
    scene.pipes.reset();
    showMenu(scene);
}

/** @param {SceneContext} scene */
export function togglePause(scene) {
    if (scene.state === GAME_STATE.PLAYING) {
        applyPausedState(scene);
        const pauseUI = scene.ui.showPause({
            onResume: () => {
                if (scene.state === GAME_STATE.PAUSED) togglePause(scene);
            },
            onMenu: () => returnToMenu(scene),
        });
        scene.ui.setOverlay('pause', pauseUI.elements);
        enterPauseAccessibility(scene);
    } else if (scene.state === GAME_STATE.PAUSED) {
        applyPlayingState(scene);
        clearPauseOverlay(scene);
        exitPauseAccessibility(scene);
    }
}

/** @param {SceneContext} scene */
function restartFromPrimary(scene) {
    if (scene.state === GAME_STATE.GAME_OVER && scene.playMode === 'daily') {
        startDailyChallenge(scene);
        return;
    }
    startGame(scene);
}

/** @param {SceneContext} scene */
export function handlePrimaryAction(scene) {
    if (scene.state === GAME_STATE.PAUSED) {
        togglePause(scene);
        return;
    }
    if (!canHandlePrimaryAction(scene.state)) return;

    if (shouldStartGameOnPrimary(scene.state, scene.ui)) {
        restartFromPrimary(scene);
        requestJump(scene);
    } else if (scene.state === GAME_STATE.PLAYING) {
        requestJump(scene);
    }
}

/** @param {SceneContext} scene */
export function changeDifficulty(scene, difficulty) {
    if (!canChangeDifficulty(scene.state)) return;
    scene.difficulty = difficulty;
    scene.ui.updateDifficultyButtons(difficulty);
}

/** @param {SceneContext} scene */
export function toggleTraining(scene) {
    if (scene.state !== GAME_STATE.MENU) return;
    toggleTrainingMode(scene);
}

/** @param {SceneContext} scene */
export function toggleHardcore(scene) {
    if (scene.state !== GAME_STATE.MENU) return;
    toggleHardcoreMode(scene);
}

/** @param {SceneContext} scene */
export function cycleTrainingSpeed(scene) {
    if (scene.state !== GAME_STATE.MENU) return;
    cycleTrainingSpeedMode(scene);
}

/** @param {SceneContext} scene */
export function launchDailyChallenge(scene) {
    if (scene.state !== GAME_STATE.MENU && scene.state !== GAME_STATE.GAME_OVER) return;
    startDailyChallenge(scene);
}
