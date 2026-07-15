import { describe, it, expect } from 'vitest';
import { UI } from '../src/ui/index.js';
import { UI as UiFromIndex } from '../src/uiIndex.js';
import { announceAccessibility } from '../src/ui/a11y/index.js';
import { buildMuteControls } from '../src/ui/menu/index.js';
import { UI_LAYOUT } from '../src/ui/shared/index.js';

describe('ui barrels', () => {
    it('exporte la façade UI depuis ui/index et uiIndex', () => {
        expect(UI).toBe(UiFromIndex);
        expect(typeof UI).toBe('function');
    });

    it('réexporte les domaines menu, a11y et shared', () => {
        expect(typeof announceAccessibility).toBe('function');
        expect(typeof buildMuteControls).toBe('function');
        expect(UI_LAYOUT).toBeTruthy();
    });
});
