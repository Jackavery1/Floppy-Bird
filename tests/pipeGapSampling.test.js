import { describe, it, expect } from 'vitest';
import { GAME_CONFIG, getScriptedPipeGapY } from '../src/config.js';
import { sampleGapSequence } from '../src/pipeGapSampling.js';

const NORMAL_PIPE_GAP = GAME_CONFIG.getDifficulty('normal').gap;

describe('pipeGapSampling', () => {
    it('utilise le gap normal par défaut pour la séquence scriptée', () => {
        const { gaps } = sampleGapSequence(2, {
            runScore: 0,
            gapIndex: 0,
            lastGapY: null,
            gapJitterSeed: 0,
        });
        expect(gaps[0]).toBe(getScriptedPipeGapY(0, NORMAL_PIPE_GAP));
        expect(gaps[1]).toBe(getScriptedPipeGapY(1, NORMAL_PIPE_GAP));
    });
});
