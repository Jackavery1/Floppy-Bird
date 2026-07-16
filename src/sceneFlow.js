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
import { openMainMenu } from './sceneMenuSync.js';
import { skipDyingToGameOver } from './sceneDeath.js';
import {
    clearPauseOverlay,
    enterPauseOverlay,
    exitGameOverForRound,
    exitMenuForRound,
    resumeFromPauseOverlay,
} from './sceneFlowOverlays.js';

export { applyPausedState, applyPlayingState } from './sceneFlowOverlays.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @param {SceneContext} scene */
export function resumeClock(scene) {
    scene.time.paused = false;
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
        exitMenuForRound(scene);
        beginRound(scene, { resetBird: true });
    } else if (scene.state === GAME_STATE.GAME_OVER) {
        exitGameOverForRound(scene);
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
        exitMenuForRound(scene);
    } else {
        exitGameOverForRound(scene);
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
        enterPauseOverlay(scene, {
            onResume: () => {
                if (scene.state === GAME_STATE.PAUSED) togglePause(scene);
            },
            onMenu: () => returnToMenu(scene),
        });
    } else if (scene.state === GAME_STATE.PAUSED) {
        resumeFromPauseOverlay(scene);
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
    if (scene.state === GAME_STATE.DYING) {
        skipDyingToGameOver(scene);
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
