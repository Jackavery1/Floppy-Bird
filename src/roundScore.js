import { saveHighScore } from './highScores.js';
import { saveToLeaderboard } from './storage.js';
import { saveBestTrainingScore } from './trainingStorage.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/**
 * @typedef {{ entries: Array<{ score: number, id: string, skinId?: string }>, highlightId: string | null }} LeaderboardData
 */

/**
 * @param {SceneContext} scene
 * @returns {{ isNewRecord: boolean, leaderboardData: LeaderboardData }}
 */
export function persistRoundScore(scene) {
    const skinId = scene.activeSkinId ?? 'classic';
    if (scene.trainingMode) {
        saveBestTrainingScore(scene.round.score, skinId);
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
        skinId
    );
    const leaderboardData = saveToLeaderboard(
        scene.round.score,
        scene.difficulty,
        scene.hardcoreMode,
        skinId
    );
    const topEntry = leaderboardData.entries[0]?.score ?? 0;
    if (topEntry > scene.round.roundHighScore) {
        scene.round.roundHighScore = saveHighScore(
            topEntry,
            scene.difficulty,
            scene.round.roundHighScore,
            scene.hardcoreMode,
            skinId
        );
    }

    return { isNewRecord, leaderboardData };
}
