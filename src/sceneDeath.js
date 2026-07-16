import { GAME_CONFIG } from './config.js';
import { GAME_STATE, canTriggerDeath } from './gameState.js';
import { frameStep } from './sceneBootstrap.js';
import { persistRoundScore } from './roundScore.js';
import { notifyEndOfRoundAchievements } from './metaAchievements.js';
import { playDeathImpactFeedback, playGroundImpactFeedback } from './sceneFeedback.js';
import { saveDailyCompletion } from './dailyChallengeProgress.js';
import { getDailyChallengeSkin } from './dailyChallenge.js';
import { announceDeathStarted, openGameOverAccessibility } from './sceneA11ySync.js';
import { syncShellGameState } from './shellGameState.js';
import { preloadGameOverUI } from './ui/gameOver/uiGameOverLoader.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @param {SceneContext} scene @param {'pipe' | 'ground' | 'ceiling'} [cause] */
export function triggerDeath(scene, cause = 'pipe') {
    if (!canTriggerDeath(scene.state)) return;
    scene.state = GAME_STATE.DYING;
    syncShellGameState(GAME_STATE.DYING);
    announceDeathStarted(cause, scene.round.score ?? 0);
    scene.round.deathCause = cause;
    const startedAt = scene.round.startedAt ?? 0;
    const now = scene.time?.now ?? 0;
    scene.round.lastDeathMetrics = {
        cause,
        score: scene.round.score ?? 0,
        elapsedMs: startedAt > 0 ? Math.max(0, now - startedAt) : 0,
        isEarlyDeath:
            startedAt > 0 ? Math.max(0, now - startedAt) < GAME_CONFIG.round.earlyDeathMs : false,
        beforeFirstPipe: (scene.round.score ?? 0) === 0,
    };
    scene.round.resetDeathAnimation();

    playDeathImpactFeedback(scene, cause);
    scene.bird.velocityY = 0;
    scene.ghost.finishRound(scene.round.score);

    const { isNewRecord, leaderboardData } = persistRoundScore(scene);
    scene.round.isNewRecord = isNewRecord;
    scene.round.leaderboardData = leaderboardData;

    scene.time.delayedCall(166, () => {
        if (scene.state === GAME_STATE.DYING) {
            scene.round.dyingFalling = true;
        }
    });
}

/** @param {SceneContext} scene */
export function updateDying(scene) {
    const { round } = scene;
    if (!round.dyingFalling || round.dyingGrounded) return;

    const step = frameStep(scene);
    scene.bird.applyFall(step, 'death');

    if (scene.bird.y + GAME_CONFIG.bird.height / 2 >= GAME_CONFIG.groundY) {
        scene.bird.y = GAME_CONFIG.groundY - GAME_CONFIG.bird.height / 2;
        scene.bird.sprite.setPosition(scene.bird.x, scene.bird.y);
        round.dyingGrounded = true;
        finishDying(scene);
    }
}

function finishDying(scene) {
    const { round } = scene;
    playGroundImpactFeedback();
    if (scene.playMode === 'daily' && scene.dailyGoal > 0) {
        saveDailyCompletion({
            goal: scene.dailyGoal,
            score: round.score,
            difficulty: scene.difficulty,
            skinId: scene.activeSkinId ?? getDailyChallengeSkin(),
        });
    }
    notifyEndOfRoundAchievements(scene);
    scene.ui.highScore = round.roundHighScore;
    scene.ui.showGameOverLoading?.();
    preloadGameOverUI().then(() => {
        scene.ui.hideGameOverLoading?.();
        if (scene.state !== GAME_STATE.DYING && scene.state !== GAME_STATE.GAME_OVER) return;
        scene.state = GAME_STATE.GAME_OVER;
        syncShellGameState(GAME_STATE.GAME_OVER);
        const { elements } = scene.ui.showGameOver(
            round.score,
            round.leaderboardData,
            true,
            round.isNewRecord,
            scene.hardcoreMode,
            scene.playMode === 'daily' ? scene.dailyGoal : 0,
            scene.activeSkinId ?? 'classic',
            round.deathCause
        );
        scene.ui.setOverlay('gameOver', elements);
        openGameOverAccessibility(scene, {
            score: round.score,
            isDaily: scene.playMode === 'daily',
        });
    });
}
