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
    get centerX() {
        return this.width / 2;
    },
    get centerY() {
        return this.height / 2;
    },
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
        maxGapDelta: 72,
        minGapDelta: 48,
        minPipeGap: 72,
        consecutiveGapDeltaFactor: 0.6,
        consecutiveGapDeltaThreshold: 0.85,
        /** Variation ± px sur les gaps scriptés (classique) — une seed par manche. */
        scriptedGapJitterPx: 10,
    },

    level: {
        pipeGaps: [150, 190, 230, 170, 210, 130, 250, 185],
    },

    round: {
        pipeSpawnDelayMs: 1200,
        spawnInvincibilityMs: 900,
        hardcoreSpawnInvincibilitySteps: [700, 625, 550, 475, 425, 375, 325],
        speedBoostEvery: 10,
        speedBoostPercent: 0.03,
        /** Plafond d’accélération (+3 % / palier) — score 50+ sans montée supplémentaire. */
        speedBoostMaxBoosts: 5,
        /** Aperçu vitesse un point avant le 1er palier (+3 % à score 10). */
        speedBoostPreviewOffset: 1,
        gapTightenAfterScore: 20,
        /** Aperçu HUD N points avant l’escalade (gaps + vitesse). */
        difficultyPreviewOffset: 5,
        gapTightenEvery: 10,
        gapTightenStep: 8,
        streakMilestones: [10, 15, 20, 30, 40, 50],
        deathSlowMoMs: 80,
        deathSlowMoScale: 0.3,
    },

    training: {
        /** Ralenti par défaut (80 %) — mode pédagogique + fantôme. */
        timeScale: 0.8,
        /** Vitesses cyclables dans OPTIONS (entraînement). */
        timeScaleSteps: [0.6, 0.7, 0.8, 1],
        ghostAlpha: 0.35,
        sampleEveryFrames: 3,
    },

    hardcore: {
        gravityMultiplier: 1.12,
        maxFallSpeedMultiplier: 1.08,
        speedMultiplier: 1.08,
    },

    difficulties: {
        easy: {
            speed: 1.85,
            gap: 140,
            gravity: 0.3,
            jumpPower: -5.7,
            maxFallSpeed: 10,
            pipeInterval: 92,
        },
        normal: { speed: 2.75, gap: 112, pipeInterval: 76 },
        hard: {
            speed: 3.6,
            gap: 92,
            gravity: 0.45,
            jumpPower: -6.2,
            maxFallSpeed: 12,
            pipeInterval: 64,
        },
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
