import { describe, it, expect } from 'vitest';
import { buildGameOverSummaryMedal, medalColorForScore } from '../src/uiGameOverSummaryMedal.js';
import { MEDAILLE_COLORS_PHASER } from '../src/designTokens.js';
import { createBaseScene } from './helpers/phaserMock.js';

describe('uiGameOverSummaryMedal', () => {
    it('medalColorForScore retourne les paliers bronze, argent et or', () => {
        expect(medalColorForScore(3)).toBeNull();
        expect(medalColorForScore(6)).toBe(MEDAILLE_COLORS_PHASER.bronze);
        expect(medalColorForScore(12)).toBe(MEDAILLE_COLORS_PHASER.argent);
        expect(medalColorForScore(25)).toBe(MEDAILLE_COLORS_PHASER.or);
    });

    it('affiche la bannière nouveau record', () => {
        const scene = createBaseScene();
        const { elements, recordBadge } = buildGameOverSummaryMedal(scene, 144, 120, {
            finalScore: 30,
            isNewRecord: true,
        });
        expect(elements.length).toBe(2);
        expect(recordBadge).toBeTruthy();
    });

    it('affiche une médaille pour un score intermédiaire', () => {
        const scene = createBaseScene();
        const { elements, medal } = buildGameOverSummaryMedal(scene, 144, 120, {
            finalScore: 15,
            isNewRecord: false,
        });
        expect(elements.length).toBe(1);
        expect(medal).toBeTruthy();
    });

    it('n’affiche ni médaille ni bannière pour un score faible', () => {
        const scene = createBaseScene();
        const { elements, medal } = buildGameOverSummaryMedal(scene, 144, 120, {
            finalScore: 2,
            isNewRecord: false,
        });
        expect(elements).toHaveLength(0);
        expect(medal).toBeNull();
    });
});
