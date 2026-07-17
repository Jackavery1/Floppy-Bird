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
        const gap = GAME_CONFIG.round.pipeSpawnDelayMs - GAME_CONFIG.round.spawnInvincibilityMs;
        expect(gap).toBeGreaterThanOrEqual(400);
    });

    it('reporte le saut au prochain tick physique', () => {
        expect(GAME_CONFIG.bird.jumpBufferFrames).toBe(1);
    });

    it('hardcore : marge post-invincibilité avant premier tuyau', () => {
        const gap =
            GAME_CONFIG.round.pipeSpawnDelayMs - GAME_CONFIG.round.hardcoreSpawnInvincibilityMs;
        expect(gap).toBeGreaterThanOrEqual(400);
    });

    it('hardcore : invincibilité initiale 620 ms (marge ≥400 ms avant 1er tuyau)', () => {
        expect(GAME_CONFIG.round.hardcoreSpawnInvincibilityMs).toBe(620);
        expect(GAME_CONFIG.round.spawnInvincibilityMs).toBe(900);
    });
});

describe('GAME_CONFIG.getDifficulty', () => {
    it('normal applique speed/gap/intervalle renforcés', () => {
        const n = GAME_CONFIG.getDifficulty('normal');
        expect(n.gravity).toBe(0.41);
        expect(n.jumpPower).toBe(-6.02);
        expect(n.speed).toBe(2.95);
        expect(n.gap).toBe(104);
        expect(n.pipeInterval).toBe(71);
    });

    it('easy reste plus permissif que normal, mais plus exigeant qu’avant', () => {
        const e = GAME_CONFIG.getDifficulty('easy');
        const n = GAME_CONFIG.getDifficulty('normal');
        expect(e.gravity).toBe(0.33);
        expect(e.gap).toBe(130);
        expect(e.pipeInterval).toBe(86);
        expect(e.speed).toBe(2.05);
        expect(e.gap).toBeGreaterThan(n.gap);
        expect(e.speed).toBeLessThan(n.speed);
        expect(e.pipeInterval).toBeGreaterThan(n.pipeInterval);
    });

    it('hard reste inchangé et plus serré que normal', () => {
        const n = GAME_CONFIG.getDifficulty('normal');
        const h = GAME_CONFIG.getDifficulty('hard');
        expect(h.speed).toBe(3.72);
        expect(h.gap).toBe(88);
        expect(h.pipeInterval).toBe(62);
        expect(h.gap).toBeLessThan(n.gap);
        expect(h.speed).toBeGreaterThan(n.speed);
    });

    it('retombe sur normal pour une clé invalide', () => {
        const x = GAME_CONFIG.getDifficulty('invalid');
        expect(x.speed).toBe(2.95);
    });
});

describe('getDifficultyForRound', () => {
    it('renforce physique, gaps et cadence en hardcore', () => {
        const normal = GAME_CONFIG.getDifficulty('normal');
        const hardcore = getDifficultyForRound('normal', true);
        expect(hardcore.gravity).toBeGreaterThan(normal.gravity);
        expect(hardcore.speed).toBeGreaterThan(normal.speed);
        expect(hardcore.gap).toBeLessThan(normal.gap);
        expect(hardcore.pipeInterval).toBeLessThan(normal.pipeInterval);
        expect(Math.abs(hardcore.jumpPower)).toBeLessThan(Math.abs(normal.jumpPower));
    });

    it('normal hardcore dépasse la difficulté Difficile classique sur plusieurs axes', () => {
        const hard = GAME_CONFIG.getDifficulty('hard');
        const normalHc = getDifficultyForRound('normal', true);
        expect(normalHc.gravity).toBeGreaterThan(hard.gravity);
        expect(normalHc.gap).toBeLessThanOrEqual(hard.gap + 8);
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
