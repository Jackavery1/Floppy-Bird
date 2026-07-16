import { describe, it, expect } from 'vitest';
import { UI as uiFromIndex } from '../src/uiIndex.js';
import { UI as uiDirect } from '../src/ui/core/ui.js';

describe('uiIndex', () => {
    it('réexporte uniquement la façade UI', () => {
        expect(uiFromIndex).toBeTypeOf('function');
        expect(uiFromIndex).toBe(uiDirect);
    });
});
