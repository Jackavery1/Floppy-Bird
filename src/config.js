import { Utils } from './utils.js';

export const SOUND = Object.freeze({
    JUMP: 'jump',
    SCORE: 'score',
    GAME_OVER: 'gameover',
    GROUND: 'ground',
});

export const DIFFICULTY = Object.freeze({
    EASY: 'easy',
    NORMAL: 'normal',
    HARD: 'hard',
});

export const DIFFICULTY_ORDER = Object.freeze([
    DIFFICULTY.EASY,
    DIFFICULTY.NORMAL,
    DIFFICULTY.HARD,
]);

export const GAME_CONFIG = {
    width: 288,
    height: 512,
    get centerX() { return this.width / 2; },
    get centerY() { return this.height / 2; },
    groundY: 498,
    debug: typeof location !== 'undefined' && new URLSearchParams(location.search).has('debug'),

    bird: {
        width: 28,
        height: 20,
        startX: 50,
        gravity: 0.38,
        jumpPower: -6.1,
        maxFallSpeed: 10,
        jumpBufferFrames: 4,
        coyoteTimeFrames: 5,
    },

    pipes: {
        width: 40,
        bodyWidth: 28,
        capMargin: 24,
        spawnMarginY: 48,
        maxGapDelta: 80,
        minGapDelta: 40,
        minPipeGap: 72,
    },

    level: {
        pipeGaps: [150, 190, 230, 170, 210, 130, 250, 185],
    },

    round: {
        pipeSpawnDelayMs: 1200,
        spawnInvincibilityMs: 900,
        hardcoreSpawnInvincibilitySteps: [700, 625, 550, 475, 400, 325],
        speedBoostEvery: 10,
        speedBoostPercent: 0.03,
        gapTightenAfterScore: 20,
        gapTightenEvery: 10,
        gapTightenStep: 8,
    },

    training: {
        timeScale: 0.65,
        ghostAlpha: 0.35,
        sampleEveryFrames: 3,
    },

    hardcore: {
        gravityMultiplier: 1.12,
        maxFallSpeedMultiplier: 1.08,
        speedMultiplier: 1.08,
    },

    difficulties: {
        easy:   { speed: 1.85, gap: 142, gravity: 0.30, jumpPower: -5.7, maxFallSpeed: 10, pipeInterval: 92 },
        normal: { speed: 2.7, gap: 112, pipeInterval: 76 },
        hard:   { speed: 3.4, gap: 98, gravity: 0.45, jumpPower: -6.2, maxFallSpeed: 12, pipeInterval: 68 },
    },

    difficultyLabels: {
        easy: 'FACILE',
        normal: 'NORMAL',
        hard: 'DIFFICILE',
    },

    difficultyColors: {
        easy: '#88ff88',
        normal: '#ffff00',
        hard: '#ff8888',
    },

    getDifficulty(key) {
        const base = this.bird;
        const overrides = this.difficulties[key] || this.difficulties.normal;
        return {
            speed: overrides.speed,
            gap: overrides.gap,
            gravity: overrides.gravity ?? base.gravity,
            jumpPower: overrides.jumpPower ?? base.jumpPower,
            maxFallSpeed: overrides.maxFallSpeed ?? base.maxFallSpeed,
            pipeInterval: overrides.pipeInterval ?? 90,
        };
    },
};

export function getDifficultyForRound(difficulty, hardcore = false) {
    const cfg = GAME_CONFIG.getDifficulty(difficulty);
    if (!hardcore) return cfg;
    const hc = GAME_CONFIG.hardcore;
    return {
        ...cfg,
        gravity: cfg.gravity * hc.gravityMultiplier,
        maxFallSpeed: cfg.maxFallSpeed * hc.maxFallSpeedMultiplier,
        speed: cfg.speed * hc.speedMultiplier,
    };
}

export function getScriptedPipeGapY(index, pipeGap) {
    const gaps = GAME_CONFIG.level.pipeGaps;
    if (index >= gaps.length) return null;
    const margin = GAME_CONFIG.pipes.spawnMarginY;
    return Utils.clamp(gaps[index], margin, GAME_CONFIG.groundY - pipeGap - margin);
}
