import { DIFFICULTY } from './config.js';
import { loadTrainingEnabled, loadTrainingTimeScale } from './trainingStorage.js';
import { loadHardcoreEnabled, saveHardcoreEnabled } from './hardcoreStorage.js';
import { loadBestScoreAny } from './highScores.js';
import { isHardcoreUnlocked } from './hardcoreUnlock.js';

export function createSceneModesState() {
    const difficulty = DIFFICULTY.NORMAL;
    const trainingMode = loadTrainingEnabled();
    let hardcoreMode = loadHardcoreEnabled();
    if (!isHardcoreUnlocked({ bestScoreAny: loadBestScoreAny() })) {
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
