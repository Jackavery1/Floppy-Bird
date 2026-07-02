import { describe, it, expect } from 'vitest';
import { shade } from '../src/uiGameOverDecor.js';

describe('uiGameOverDecor', () => {
    it('shade assombrit une couleur hex', () => {
        expect(shade(0xFFFFFF, 0.5)).toBe(0x7F7F7F);
        expect(shade(0xFF0000, 1)).toBe(0xFF0000);
    });
});
