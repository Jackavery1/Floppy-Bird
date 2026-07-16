import { describe, it, expect } from 'vitest';
import { UI as UiFromIndex } from '../src/uiIndex.js';
import { UI as UiFromCore } from '../src/ui/core/index.js';

describe('ui façade', () => {
    it('exporte la façade UI depuis uiIndex et ui/core', () => {
        expect(UiFromIndex).toBe(UiFromCore);
        expect(typeof UiFromIndex).toBe('function');
    });
});
