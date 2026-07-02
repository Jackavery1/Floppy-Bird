import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { installTestSeam } from '../src/testSeam.js';
import { DEPTH } from '../src/uiDepth.js';

describe('testSeam', () => {
    beforeEach(() => {
        vi.stubGlobal('window', { __FLOPPY_TEST__: undefined });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('expose getScoreHud et bumpScore', () => {
        const scoreText = {
            visible: true,
            alpha: 1,
            y: 56,
            depth: DEPTH.SCORE_HUD,
            text: '0',
        };
        const ui = {
            scoreText,
            updateScore: vi.fn((n) => {
                scoreText.text = String(n);
            }),
        };
        const scene = {
            state: 'playing',
            round: { score: 0 },
            ui,
        };
        const game = {
            scene: { getScene: () => scene },
        };

        installTestSeam(game);

        expect(window.__FLOPPY_TEST__.getScoreHud()).toMatchObject({
            visible: true,
            text: '0',
            depth: DEPTH.SCORE_HUD,
        });

        window.__FLOPPY_TEST__.bumpScore(2);
        expect(scene.round.score).toBe(2);
        expect(ui.updateScore).toHaveBeenCalledWith(2);
        expect(scoreText.text).toBe('2');
    });
});
