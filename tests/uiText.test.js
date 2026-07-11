import { describe, it, expect, vi } from 'vitest';
import {
    addCenteredText,
    addReliefText,
    diffLabelColor,
    fitLabelFontSize,
    fitTitleFontSize,
    applyFittedLabel,
    addFittedCenteredText,
} from '../src/uiText.js';
import { DESIGN_TOKENS } from '../src/designTokens.js';
import { DIFFICULTY } from '../src/config.js';
import { createBaseScene } from './helpers/phaserMock.js';

describe('uiText', () => {
    it('addCenteredText centre le texte', () => {
        const scene = createBaseScene();
        const label = addCenteredText(scene, 100, 50, 'Hi', { fontSize: '12px' }, 10);
        expect(label.setOrigin).toHaveBeenCalledWith(0.5, 0.5);
        expect(label.setDepth).toHaveBeenCalledWith(10);
    });

    it('addReliefText crée ombre et label', () => {
        const scene = createBaseScene();
        const { shadow, label } = addReliefText(
            scene,
            144,
            80,
            'T',
            { fontSize: '20px', fill: '#fff' },
            52
        );
        expect(shadow.setDepth).toHaveBeenCalledWith(51);
        expect(label.setDepth).toHaveBeenCalledWith(52);
    });

    it('diffLabelColor met le bouton actif en sombre sur fond jaune', () => {
        expect(diffLabelColor(DIFFICULTY.NORMAL, DIFFICULTY.NORMAL)).toBe(
            DESIGN_TOKENS.texteBoutonJaune
        );
    });

    it('fitLabelFontSize réduit jusqu’à tenir dans la largeur max', () => {
        const scene = createBaseScene();
        scene.make.text = vi.fn(({ style }) => ({
            width: style.fontSize === '12px' ? 200 : 80,
            destroy: vi.fn(),
        }));
        const size = fitLabelFontSize(scene, 'Long label', { fontSize: '12px' }, 100);
        expect(size).toBeLessThan(12);
    });

    it('fitTitleFontSize délègue à fitLabelFontSize', () => {
        const scene = createBaseScene();
        scene.make.text = vi.fn(() => ({ width: 50, destroy: vi.fn() }));
        expect(fitTitleFontSize(scene, 'Floppy Bird')).toBeGreaterThanOrEqual(10);
    });

    it('applyFittedLabel met à jour texte et taille', () => {
        const scene = createBaseScene();
        scene.make.text = vi.fn(() => ({ width: 50, destroy: vi.fn() }));
        const label = { setText: vi.fn(), setFontSize: vi.fn() };
        applyFittedLabel(scene, label, 'OK', { fontSize: '12px' }, 120);
        expect(label.setText).toHaveBeenCalledWith('OK');
        expect(label.setFontSize).toHaveBeenCalled();
    });

    it('addFittedCenteredText combine création et ajustement', () => {
        const scene = createBaseScene();
        scene.make.text = vi.fn(() => ({ width: 50, destroy: vi.fn() }));
        const label = addFittedCenteredText(scene, 10, 10, 'Fit', { fontSize: '12px' }, 5, 80);
        expect(label.setOrigin).toHaveBeenCalledWith(0.5, 0.5);
    });
});
