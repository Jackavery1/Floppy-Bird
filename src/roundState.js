/** État mutable d'une manche (score, timers, mort, persistance locale). */
export function createRoundState() {
    return {
        score: 0,
        dyingFalling: false,
        dyingGrounded: false,
        leaderboardData: null,
        pipeSpawnTimer: null,
        jumpBufferFrames: 0,
        spawnInvincible: false,
        spawnInvincibleTimer: null,
        coyoteFrames: 0,
        deathCause: null,
        roundHighScore: 0,
        recordNotified: false,
        isNewRecord: false,
        dailyGoalCelebrated: false,
        startedAt: 0,
        lastDeathMetrics: null,

        resetForRound() {
            this.score = 0;
            this.jumpBufferFrames = 0;
            this.recordNotified = false;
            this.isNewRecord = false;
            this.dailyGoalCelebrated = false;
            this.coyoteFrames = 0;
            this.deathCause = null;
            this.dyingFalling = false;
            this.dyingGrounded = false;
            this.leaderboardData = null;
            this._pipeSpawnWaitMs = 0;
            this.startedAt = 0;
            this.lastDeathMetrics = null;
        },

        resetDeathAnimation() {
            this.dyingFalling = false;
            this.dyingGrounded = false;
        },
    };
}
