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
        coyoteFramesAtDeath: null,
        deathCause: null,
        roundHighScore: 0,
        recordNotified: false,
        isNewRecord: false,
        dailyGoalCelebrated: false,

        resetForRound() {
            this.score = 0;
            this.jumpBufferFrames = 0;
            this.recordNotified = false;
            this.isNewRecord = false;
            this.dailyGoalCelebrated = false;
            this.coyoteFrames = 0;
            this.coyoteFramesAtDeath = null;
            this._wasInGap = false;
            this.deathCause = null;
            this.dyingFalling = false;
            this.dyingGrounded = false;
            this.leaderboardData = null;
            this._pipeSpawnWaitMs = 0;
        },

        resetDeathAnimation() {
            this.dyingFalling = false;
            this.dyingGrounded = false;
        },
    };
}
