import { DIFFICULTY, DIFFICULTY_ORDER } from './config.js';
import { loadTrainingEnabled, loadTrainingTimeScale } from './trainingStorage.js';
import { loadHardcoreEnabled, saveHardcoreEnabled } from './hardcoreStorage.js';
import { loadHighScore } from './storage.js';
import { isHardcoreUnlocked } from './hardcoreUnlock.js';

function bootstrapMetaContext() {
    let bestScoreAny = 0;
    for (const diff of DIFFICULTY_ORDER) {
        bestScoreAny = Math.max(bestScoreAny, loadHighScore(diff, false));
    }
    return { bestScoreAny };
}

export function createSceneModesState() {
    const difficulty = DIFFICULTY.NORMAL;
    const trainingMode = loadTrainingEnabled();
    let hardcoreMode = loadHardcoreEnabled();
    if (!isHardcoreUnlocked(bootstrapMetaContext())) {
        hardcoreMode = false;
        saveHardcoreEnabled(false);
    }
    if (trainingMode && hardcoreMode) {
        hardcoreMode = false;
        saveHardcoreEnabled(false);
    }
    return {
        difficulty,
        trainingMode,
        trainingTimeScale: loadTrainingTimeScale(),
        hardcoreMode,
        playMode: 'classic',
        dailyChallengeMode: false,
        activeSkinId: 'classic',
        dailyGoal: 0,
    };
}
