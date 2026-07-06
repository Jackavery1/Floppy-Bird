import { describe, it, expect } from 'vitest';
import { buildGameOverSummary } from '../src/uiGameOverSummary.js';
import { createBaseScene } from './helpers/phaserMock.js';

function makeUi(overrides = {}) {
    return {
        highScore: 20,
        _currentDifficulty: 'normal',
        ...overrides,
    };
}

describe('uiGameOverSummary', () => {
    it('affiche GAME OVER et le score', () => {
        const scene = createBaseScene();
        const ui = makeUi();
        const y = (offset) => 80 + offset;
        const { elements, scoreText } = buildGameOverSummary(scene, 144, y, ui, {
            finalScore: 12,
            fadeIn: false,
            isNewRecord: false,
            deathCause: null,
            hardcoreMode: false,
            dailyGoal: 0,
            activeSkinId: 'classic',
        });
        expect(elements.length).toBeGreaterThan(2);
        expect(scoreText).toBeTruthy();
        const texts = scene.add.text.mock.calls.map((call) => call[2]);
        expect(texts).toContain('GAME OVER');
    });

    it('affiche la cause de mort quand elle est fournie', () => {
        const scene = createBaseScene();
        const ui = makeUi();
        const y = (offset) => 80 + offset;
        buildGameOverSummary(scene, 144, y, ui, {
            finalScore: 5,
            fadeIn: false,
            isNewRecord: false,
            deathCause: 'pipe',
            hardcoreMode: false,
            dailyGoal: 0,
            activeSkinId: 'classic',
        });
        const texts = scene.add.text.mock.calls.map((call) => call[2]);
        expect(texts).toContain('Collision tuyau');
    });

    it('marque le récap daily sans objectif classique', () => {
        const scene = createBaseScene();
        const ui = makeUi();
        const y = (offset) => 80 + offset;
        const { isDaily } = buildGameOverSummary(scene, 144, y, ui, {
            finalScore: 8,
            fadeIn: false,
            isNewRecord: false,
            deathCause: null,
            hardcoreMode: false,
            dailyGoal: 10,
            activeSkinId: 'classic',
        });
        expect(isDaily).toBe(true);
    });
});
