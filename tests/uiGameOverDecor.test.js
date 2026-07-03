import { describe, it, expect } from 'vitest';
import { shade } from '../src/uiGameOverDecor.js';

describe('uiGameOverDecor', () => {
    it('shade assombrit une couleur hex', () => {
        expect(shade(0xffffff, 0.5)).toBe(0x7f7f7f);
        expect(shade(0xff0000, 1)).toBe(0xff0000);
    });
});
