import { Utils } from './utils.js';
import { DESIGN_TOKENS } from './designTokens.js';

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
        width: 32,
        height: 23,
        startX: 50,
        gravity: 0.4,
        jumpPower: -6,
        maxFallSpeed: 10.5,
        /** Report du flap sur les prochains ticks physiques (3 frames ≈ 50 ms @ 60 FPS). */
        jumpBufferFrames: 3,
        /** Grâce après sortie de gap : protège tuyaux + plafond, pas le sol (choix design). */
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
        /** Variation ± px sur les gaps scriptés (classique) — seed par manche + ordre mélangé. */
        scriptedGapJitterPx: 10,
    },

    level: {
        pipeGaps: [150, 190, 230, 170, 210, 130, 250, 185],
    },

    round: {
        pipeSpawnDelayMs: 1300,
        spawnInvincibilityMs: 900,
        /** Plus court qu'en classique ; marge ≥400 ms avant le 1er tuyau (pipeSpawnDelayMs). */
        hardcoreSpawnInvincibilityMs: 620,
        speedBoostEvery: 10,
        speedBoostPercent: 0.03,
        /** Plafond d’accélération (+3 % / palier) — score 50+ sans montée supplémentaire. */
        speedBoostMaxBoosts: 5,
        /** Aperçu vitesse un point avant le 1er palier (+3 % à score 10). */
        speedBoostPreviewOffset: 1,
        gapTightenAfterScore: 25,
        /** Aperçu HUD N points avant l’escalade (gaps + vitesse). */
        difficultyPreviewOffset: 5,
        gapTightenEvery: 10,
        gapTightenStep: 9,
        streakMilestones: [10, 15, 20, 30, 40, 50],
        /** Seuil debug : mort avant cette durée (ms) depuis le début de manche. */
        earlyDeathMs: 30_000,
        deathSlowMoMs: 140,
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

    /**
     * Modificateur hardcore (classique uniquement ; le défi du jour le force OFF).
     * Gaps + cadence + physique — pas un simple +8 % de vitesse.
     */
    hardcore: {
        gravityMultiplier: 1.2,
        maxFallSpeedMultiplier: 1.12,
        speedMultiplier: 1.18,
        gapMult: 0.9,
        pipeIntervalMult: 0.9,
        jumpMult: 0.94,
        /** Coyote réduit vs classique (5 → 3). */
        coyoteTimeFrames: 3,
    },

    /** Modificateurs exclusifs défi du jour (classique inchangé). */
    daily: {
        gapMult: 0.92,
        speedMult: 1.06,
        pipeIntervalMult: 0.95,
        spawnInvincibilityMs: 800,
        /** Plancher / plafond des patterns skin trop permissifs. */
        minGravityMult: 0.92,
        maxJumpMult: 1.05,
        minSpeedMult: 1.04,
    },

    difficulties: {
        easy: {
            speed: 2.05,
            gap: 130,
            gravity: 0.33,
            jumpPower: -5.7,
            maxFallSpeed: 10.5,
            pipeInterval: 86,
        },
        normal: {
            speed: 2.95,
            gap: 104,
            gravity: 0.41,
            jumpPower: -6.02,
            maxFallSpeed: 11,
            pipeInterval: 71,
        },
        hard: {
            speed: 3.72,
            gap: 88,
            gravity: 0.47,
            jumpPower: -6.15,
            maxFallSpeed: 12.5,
            pipeInterval: 62,
        },
    },

    difficultyLabels: {
        easy: 'FACILE',
        normal: 'NORMAL',
        hard: 'DIFFICILE',
    },

    difficultyColors: {
        easy: DESIGN_TOKENS.difficulteFacile,
        normal: DESIGN_TOKENS.difficulteNormal,
        hard: DESIGN_TOKENS.difficulteDifficile,
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
        gap: Math.max(GAME_CONFIG.pipes.minPipeGap, Math.round(cfg.gap * hc.gapMult)),
        pipeInterval: Math.max(48, Math.round(cfg.pipeInterval * hc.pipeIntervalMult)),
        jumpPower: cfg.jumpPower * hc.jumpMult,
    };
}

export function getScriptedPipeGapY(index, pipeGap) {
    const gaps = GAME_CONFIG.level.pipeGaps;
    if (index >= gaps.length) return null;
    const margin = GAME_CONFIG.pipes.spawnMarginY;
    return Utils.clamp(gaps[index], margin, GAME_CONFIG.groundY - pipeGap - margin);
}
