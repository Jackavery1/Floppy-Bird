import { describe, it, expect } from 'vitest';
import { buildGameOverLeaderboard } from '../src/ui/gameOver/uiGameOverLeaderboard.js';
import { createBaseScene } from './helpers/phaserMock.js';

describe('uiGameOverLeaderboard', () => {
    it('affiche le récap daily sans TOP 5', () => {
        const scene = createBaseScene();
        const y = (offset) => 100 + offset;
        const elements = buildGameOverLeaderboard(scene, {
            cx: 144,
            y,
            entries: [],
            highlightId: null,
            isDaily: true,
            dailyGoal: 10,
            finalScore: 8,
            special: false,
            hardcoreMode: false,
            activeSkin: { label: 'Classic' },
        });
        expect(elements.length).toBe(2);
    });

    it('affiche le TOP 5 avec pastilles de skin en mode classique', () => {
        const scene = createBaseScene();
        const y = (offset) => 100 + offset;
        const elements = buildGameOverLeaderboard(scene, {
            cx: 144,
            y,
            entries: [
                { score: 12, id: 'a', skinId: 'ruby' },
                { score: 8, id: 'b', skinId: 'classic' },
            ],
            highlightId: 'a',
            isDaily: false,
            dailyGoal: 0,
            finalScore: 12,
            special: false,
            hardcoreMode: false,
            activeSkin: { label: 'Classic' },
        });
        expect(elements.length).toBeGreaterThan(4);
        expect(scene.add.text.mock.calls.some((c) => c[2] === '— CLASSEMENT · 5 —')).toBe(true);
    });

    it('affiche le titre classement HC en hardcore', () => {
        const scene = createBaseScene();
        const y = (offset) => 100 + offset;
        buildGameOverLeaderboard(scene, {
            cx: 144,
            y,
            entries: [{ score: 5, id: 'a', skinId: 'classic' }],
            highlightId: 'a',
            isDaily: false,
            dailyGoal: 0,
            finalScore: 5,
            special: false,
            hardcoreMode: true,
            activeSkin: { label: 'Classic' },
        });
        expect(scene.add.text.mock.calls.some((c) => c[2] === '— CLASSEMENT HC —')).toBe(true);
    });
});
