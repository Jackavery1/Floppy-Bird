import { describe, it, expect } from 'vitest';
import { buildGameOverSummaryScore } from '../src/ui/gameOver/uiGameOverSummaryScore.js';
import { getSkin } from '../src/skins/index.js';
import { createBaseScene } from './helpers/phaserMock.js';

function makeUi(overrides = {}) {
    return {
        highScore: 20,
        _currentDifficulty: 'normal',
        ...overrides,
    };
}

describe('uiGameOverSummaryScore', () => {
    it('affiche le score final et le meilleur record classique', () => {
        const scene = createBaseScene();
        const ui = makeUi();
        const y = (offset) => 80 + offset;
        const { scoreText, elements } = buildGameOverSummaryScore(scene, 144, y, ui, {
            finalScore: 12,
            fadeIn: false,
            isNewRecord: false,
            hardcoreMode: false,
            dailyGoal: 10,
            isDaily: false,
            special: false,
            activeSkin: getSkin('classic'),
        });
        expect(scoreText).toBeTruthy();
        expect(elements.length).toBe(4);
        const texts = scene.add.text.mock.calls.map((call) => call[2]);
        expect(texts).toContain('POINTS');
        expect(texts).toContain('12');
        expect(texts).toContain('20');
    });

    it('marque un défi daily réussi ou raté', () => {
        const scene = createBaseScene();
        const ui = makeUi();
        const y = (offset) => 80 + offset;
        buildGameOverSummaryScore(scene, 144, y, ui, {
            finalScore: 10,
            fadeIn: false,
            isNewRecord: false,
            hardcoreMode: false,
            dailyGoal: 10,
            isDaily: true,
            special: false,
            activeSkin: getSkin('classic'),
        });
        const texts = scene.add.text.mock.calls.map((call) => call[2]);
        expect(texts).toContain('✓ RÉUSSI');
        expect(texts).toContain('OBJECTIF DU JOUR · hors TOP 5 classique');
    });

    it('initialise le compteur à 0 en fadeIn', () => {
        const scene = createBaseScene();
        const ui = makeUi();
        const y = (offset) => 80 + offset;
        const { scoreText } = buildGameOverSummaryScore(scene, 144, y, ui, {
            finalScore: 8,
            fadeIn: true,
            isNewRecord: false,
            hardcoreMode: false,
            dailyGoal: 0,
            isDaily: false,
            special: false,
            activeSkin: getSkin('classic'),
        });
        expect(scoreText.setText).toBeDefined();
        const scoreCall = scene.add.text.mock.calls.find((call) => call[2] === '0');
        expect(scoreCall).toBeTruthy();
    });
});
