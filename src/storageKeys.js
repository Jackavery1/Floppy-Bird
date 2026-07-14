export const STORAGE_KEYS = Object.freeze({
    highScore: 'flappy-bird-high-score',
    highScorePrefix: 'flappy-bird-high-score-',
    leaderboard: 'flappy-bird-leaderboard',
    leaderboardPrefix: 'flappy-bird-leaderboard-',
    muted: 'flappy-bird-muted',
    volume: 'flappy-bird-volume',
    volumeLegacy: 'flappy-bird-sound-level',
    ghost: 'flappy-bird-ghost',
    training: 'flappy-bird-training',
    hardcore: 'flappy-bird-hardcore',
    dailyCompletion: 'flappy-bird-daily-completion',
    dailyStats: 'flappy-bird-daily-stats',
    trainingBest: 'flappy-bird-training-best',
    tutorialSeen: 'flappy-bird-tutorial-seen',
    tutorialProgress: 'floppy-bird-tutorial-progress',
    hardcoreTutorialSeen: 'floppy-bird-hardcore-tutorial-seen',
    trainingTutorialSeen: 'floppy-bird-training-tutorial-seen',
    trainingTimeScale: 'floppy-bird-training-time-scale',
    roundsStarted: 'floppy-bird-rounds-started',
    meta: 'floppy-bird-meta',
});

export function highScoreKey(difficulty, hardcore = false, skinId = null) {
    const base = hardcore
        ? `${STORAGE_KEYS.highScorePrefix}hardcore-${difficulty}`
        : `${STORAGE_KEYS.highScorePrefix}${difficulty}`;
    return skinId ? `${base}-skin-${skinId}` : base;
}

export function leaderboardKey(difficulty, hardcore = false, skinId = null) {
    const base = hardcore
        ? `${STORAGE_KEYS.leaderboardPrefix}hardcore-${difficulty}`
        : `${STORAGE_KEYS.leaderboardPrefix}${difficulty}`;
    return skinId ? `${base}-skin-${skinId}` : base;
}

export function trainingBestKey(skinId = null) {
    return skinId ? `${STORAGE_KEYS.trainingBest}-skin-${skinId}` : STORAGE_KEYS.trainingBest;
}
