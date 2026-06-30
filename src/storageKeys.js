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
    tutorialSeen: 'flappy-bird-tutorial-seen',
});

export function highScoreKey(difficulty, hardcore = false) {
    if (hardcore) return `${STORAGE_KEYS.highScorePrefix}hardcore-${difficulty}`;
    return `${STORAGE_KEYS.highScorePrefix}${difficulty}`;
}

export function leaderboardKey(difficulty, hardcore = false) {
    if (hardcore) return `${STORAGE_KEYS.leaderboardPrefix}hardcore-${difficulty}`;
    return `${STORAGE_KEYS.leaderboardPrefix}${difficulty}`;
}
