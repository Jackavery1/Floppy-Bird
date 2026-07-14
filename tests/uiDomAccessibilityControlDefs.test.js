import { describe, it, expect } from 'vitest';
import { CONTROL_DEFS } from '../src/uiDomAccessibilityControlDefs.js';
import { PLAYING_CONTROL_DEFS } from '../src/uiDomAccessibilityControlDefsPlaying.js';
import { MENU_CONTROL_DEFS } from '../src/uiDomAccessibilityControlDefsMenu.js';
import { GAME_OVER_CONTROL_DEFS } from '../src/uiDomAccessibilityControlDefsGameOver.js';

describe('uiDomAccessibilityControlDefs', () => {
    it('agrège les définitions par contexte sans perte', () => {
        expect(Object.keys(CONTROL_DEFS).sort()).toEqual(
            [
                ...Object.keys(PLAYING_CONTROL_DEFS),
                ...Object.keys(MENU_CONTROL_DEFS),
                ...Object.keys(GAME_OVER_CONTROL_DEFS),
            ].sort()
        );
    });

    it('chaque définition expose id et label', () => {
        for (const def of Object.values(CONTROL_DEFS)) {
            expect(def.id).toMatch(/^a11y-/);
            expect(def.label.length).toBeGreaterThan(0);
        }
    });
});
