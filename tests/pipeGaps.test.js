import { describe, it, expect, vi } from 'vitest';
import { GAME_CONFIG, getScriptedPipeGapY } from '../src/config.js';
import {
    smoothGapY,
    gapBounds,
    randomGapY,
    resolveNextGapY,
    effectiveGapDeltaCap,
    applyScriptedGapJitter,
} from '../src/pipeGaps.js';
import { Utils } from '../src/utils.js';

const NORMAL_PIPE_GAP = GAME_CONFIG.getDifficulty('normal').gap;

describe('pipeGaps', () => {
    describe('smoothGapY', () => {
        it('retourne la valeur brute sans historique', () => {
            expect(smoothGapY(200, null, 80, 48, 400)).toBe(200);
        });

        it('limite l’écart vertical entre gaps consécutifs', () => {
            expect(smoothGapY(200, 150, 80, 48, 400)).toBe(200);
            expect(smoothGapY(300, 150, 80, 48, 400)).toBe(230);
        });

        it('borne le résultat dans min/max', () => {
            expect(smoothGapY(10, null, 80, 48, 400)).toBe(48);
            expect(smoothGapY(500, null, 80, 48, 400)).toBe(400);
        });

        it('réduit le delta si deux déplacements consécutifs dans la même direction', () => {
            expect(smoothGapY(300, 150, 80, 48, 400, 72)).toBe(198);
        });
    });

    describe('effectiveGapDeltaCap', () => {
        it('conserve le plafond si la direction change', () => {
            expect(effectiveGapDeltaCap(80, 60, -40)).toBe(80);
        });

        it('réduit le plafond après un grand déplacement dans la même direction', () => {
            expect(effectiveGapDeltaCap(80, 72, 50)).toBe(48);
        });
    });

    describe('gapBounds', () => {
        it('respecte les marges de spawn', () => {
            const gap = NORMAL_PIPE_GAP;
            const { min, max } = gapBounds(gap);
            expect(min).toBe(GAME_CONFIG.pipes.spawnMarginY);
            expect(max).toBe(GAME_CONFIG.groundY - gap - GAME_CONFIG.pipes.spawnMarginY);
        });
    });

    describe('randomGapY', () => {
        it('utilise le RNG seedé en mode daily', () => {
            const rng = Utils.createSeededRandom(424242);
            const a = randomGapY(rng, NORMAL_PIPE_GAP);
            const b = randomGapY(Utils.createSeededRandom(424242), NORMAL_PIPE_GAP);
            expect(a).toBe(b);
        });
    });

    describe('resolveNextGapY', () => {
        it('applique la séquence scriptée en classique sans jitter', () => {
            const pipeGap = NORMAL_PIPE_GAP;
            const first = resolveNextGapY({
                gapIndex: 0,
                lastGapY: null,
                dailyRng: null,
                pipeGap,
                runScore: 0,
                gapJitterSeed: 0,
            });
            expect(first.gapY).toBe(getScriptedPipeGapY(0, pipeGap));
            expect(first.gapIndex).toBe(1);
        });

        it('jitter les gaps scriptés dans une fenêtre bornée', () => {
            const pipeGap = NORMAL_PIPE_GAP;
            const base = getScriptedPipeGapY(0, pipeGap);
            const jittered = applyScriptedGapJitter(base, 0, 4242, pipeGap);
            expect(jittered).toBeGreaterThanOrEqual(base - GAME_CONFIG.pipes.scriptedGapJitterPx);
            expect(jittered).toBeLessThanOrEqual(base + GAME_CONFIG.pipes.scriptedGapJitterPx);
        });

        it('ignore le script en mode daily', () => {
            const pipeGap = NORMAL_PIPE_GAP;
            const dailyRng = Utils.createSeededRandom(99);
            const result = resolveNextGapY({
                gapIndex: 0,
                lastGapY: null,
                dailyRng,
                pipeGap,
                runScore: 0,
            });
            expect(result.gapY).not.toBe(getScriptedPipeGapY(0, pipeGap));
        });

        it('lisse les gaps aléatoires après le script', () => {
            vi.spyOn(Utils, 'randomInt').mockReturnValue(400);
            const pipeGap = NORMAL_PIPE_GAP;
            const result = resolveNextGapY({
                gapIndex: 99,
                lastGapY: 200,
                dailyRng: null,
                pipeGap,
                runScore: 25,
            });
            expect(result.gapY).toBeLessThanOrEqual(280);
            expect(result.lastGapY).toBe(result.gapY);
            vi.restoreAllMocks();
        });
    });

    describe('sampleGapSequence (équité RNG)', () => {
        it('borne les deltas consécutifs au plafond de score', async () => {
            const { sampleGapSequence } = await import('../src/pipeGapSampling.js');
            const { maxObservedDelta, maxAllowedDelta, spread } = sampleGapSequence(32, {
                runScore: 15,
            });
            expect(maxObservedDelta).toBeLessThanOrEqual(maxAllowedDelta);
            expect(spread).toBeGreaterThan(0);
        });
    });
});
