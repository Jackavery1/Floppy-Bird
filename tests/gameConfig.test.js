import { describe, it, expect } from 'vitest';
import { GAME_CONFIG, getDifficultyForRound, getScriptedPipeGapY } from '../src/config.js';

describe('GAME_CONFIG dimensions', () => {
    it('expose le centre de l’écran', () => {
        expect(GAME_CONFIG.centerX).toBe(GAME_CONFIG.width / 2);
        expect(GAME_CONFIG.centerY).toBe(GAME_CONFIG.height / 2);
    });
});

describe('GAME_CONFIG.pipes', () => {
    it('n’utilise plus spacing (spawn par pipeInterval)', () => {
        expect(GAME_CONFIG.pipes.spacing).toBeUndefined();
        expect(GAME_CONFIG.pipes.width).toBe(40);
    });
});

describe('GAME_CONFIG.round', () => {
    it('retarde le premier tuyau et accorde une invincibilité au spawn', () => {
        expect(GAME_CONFIG.round.pipeSpawnDelayMs).toBeGreaterThanOrEqual(1000);
        expect(GAME_CONFIG.round.spawnInvincibilityMs).toBeGreaterThan(0);
    });

    it('laisse une marge post-invincibilité avant le premier tuyau', () => {
        const gap =
            GAME_CONFIG.round.pipeSpawnDelayMs - GAME_CONFIG.round.spawnInvincibilityMs;
        expect(gap).toBeGreaterThanOrEqual(300);
    });

    it('bufferise les sauts sur plusieurs frames', () => {
        expect(GAME_CONFIG.bird.jumpBufferFrames).toBeGreaterThanOrEqual(2);
    });

    it('hardcore : grace progressive sur 7 tuyaux avec paliers adoucis', () => {
        const steps = GAME_CONFIG.round.hardcoreSpawnInvincibilitySteps;
        expect(steps).toHaveLength(7);
        expect(steps[0]).toBe(700);
        expect(steps.at(-1)).toBe(325);
        expect(steps).toContain(425);
        expect(steps).toContain(375);
    });
});

describe('GAME_CONFIG.getDifficulty', () => {
    it('normal hérite de bird pour la gravité', () => {
        const n = GAME_CONFIG.getDifficulty('normal');
        expect(n.gravity).toBe(GAME_CONFIG.bird.gravity);
        expect(n.jumpPower).toBe(GAME_CONFIG.bird.jumpPower);
        expect(n.speed).toBe(2.85);
        expect(n.gap).toBe(108);
        expect(n.pipeInterval).toBe(74);
    });

    it('easy applique des overrides', () => {
        const e = GAME_CONFIG.getDifficulty('easy');
        expect(e.gravity).toBe(0.32);
        expect(e.gap).toBe(136);
        expect(e.pipeInterval).toBe(90);
    });

    it('retombe sur normal pour une clé invalide', () => {
        const x = GAME_CONFIG.getDifficulty('invalid');
        expect(x.speed).toBe(2.85);
    });
});

describe('getDifficultyForRound', () => {
    it('renforce gravité et vitesse en hardcore', () => {
        const normal = GAME_CONFIG.getDifficulty('normal');
        const hardcore = getDifficultyForRound('normal', true);
        expect(hardcore.gravity).toBeGreaterThan(normal.gravity);
        expect(hardcore.speed).toBeGreaterThan(normal.speed);
    });

    it('identique au mode normal sans hardcore', () => {
        expect(getDifficultyForRound('normal', false)).toEqual(GAME_CONFIG.getDifficulty('normal'));
    });
});

describe('GAME_CONFIG.level', () => {
    it('définit des pipeGaps scriptés', () => {
        expect(GAME_CONFIG.level.pipeGaps.length).toBeGreaterThan(0);
    });

    it('getScriptedPipeGapY borne les valeurs hors écran', () => {
        const gap = GAME_CONFIG.getDifficulty('normal').gap;
        const margin = GAME_CONFIG.pipes.spawnMarginY;
        const maxY = GAME_CONFIG.groundY - gap - margin;
        expect(getScriptedPipeGapY(0, gap)).toBeGreaterThanOrEqual(margin);
        expect(getScriptedPipeGapY(0, gap)).toBeLessThanOrEqual(maxY);
        expect(getScriptedPipeGapY(999, gap)).toBeNull();
    });

    it('pipeGaps scriptés valides pour chaque difficulté', () => {
        const margin = GAME_CONFIG.pipes.spawnMarginY;
        for (const key of ['easy', 'normal', 'hard']) {
            const gap = GAME_CONFIG.getDifficulty(key).gap;
            const maxY = GAME_CONFIG.groundY - gap - margin;
            GAME_CONFIG.level.pipeGaps.forEach((_, index) => {
                const y = getScriptedPipeGapY(index, gap);
                expect(y).not.toBeNull();
                expect(y).toBeGreaterThanOrEqual(margin);
                expect(y).toBeLessThanOrEqual(maxY);
            });
        }
    });
});
