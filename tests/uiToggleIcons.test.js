import { describe, it, expect } from 'vitest';
import { drawHardcoreToggleIcon, drawTrainingToggleIcon } from '../src/uiToggleIcons.js';

function makeGraphics() {
    const calls = [];
    return {
        clear: () => calls.push('clear'),
        fillStyle: () => {},
        fillRect: () => {},
        lineStyle: () => {},
        strokeRect: () => {},
        calls,
    };
}

describe('uiToggleIcons', () => {
    it('drawTrainingToggleIcon ne lève pas', () => {
        const g = makeGraphics();
        expect(() => drawTrainingToggleIcon(g, false)).not.toThrow();
        expect(() => drawTrainingToggleIcon(g, true)).not.toThrow();
    });

    it('drawHardcoreToggleIcon gère verrouillé et actif', () => {
        const g = makeGraphics();
        expect(() => drawHardcoreToggleIcon(g, false, false)).not.toThrow();
        expect(() => drawHardcoreToggleIcon(g, true, true)).not.toThrow();
    });
});
