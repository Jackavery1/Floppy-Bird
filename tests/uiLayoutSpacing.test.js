import { describe, it, expect } from 'vitest';
import { SPACING, MIN_TOUCH } from '../src/ui/shared/uiLayout.js';

describe('uiLayout spacing', () => {
    it('expose une grille spacing cohérente', () => {
        expect(SPACING.unit).toBe(4);
        expect(SPACING.sm).toBe(SPACING.unit * 2);
        expect(SPACING.touch).toBe(MIN_TOUCH);
    });
});
