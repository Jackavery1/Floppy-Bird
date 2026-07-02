import { saveHighScore, saveToLeaderboard } from './storage.js';
import { saveBestTrainingScore } from './trainingStorage.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/**
 * @typedef {{ entries: Array<{ score: number, id: string }>, highlightId: string | null }} LeaderboardData
 */

/**
 * @param {SceneContext} scene
 * @returns {{ isNewRecord: boolean, leaderboardData: LeaderboardData }}
 */
export function persistRoundScore(scene) {
    if (scene.trainingMode) {
        saveBestTrainingScore(scene.round.score);
        return {
            isNewRecord: false,
            leaderboardData: { entries: [], highlightId: null },
        };
    }
    if (scene.playMode === 'daily') {
        return {
            isNewRecord: false,
            leaderboardData: { entries: [], highlightId: null },
        };
    }

    const isNewRecord = scene.round.score > 0 && scene.round.score > scene.round.roundHighScore;
    scene.round.roundHighScore = saveHighScore(
        scene.round.score,
        scene.difficulty,
        scene.round.roundHighScore,
        scene.hardcoreMode,
    );
    const leaderboardData = saveToLeaderboard(
        scene.round.score,
        scene.difficulty,
        scene.hardcoreMode,
    );

    return { isNewRecord, leaderboardData };
}
