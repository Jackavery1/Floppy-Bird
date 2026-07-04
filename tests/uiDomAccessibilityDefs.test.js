import { describe, it, expect } from 'vitest';
import {
    CONTROL_DEFS,
    MENU_CONTROL_KEYS,
    OPTIONS_CONTROL_KEYS,
    SKINS_PANEL_CONTROL_KEYS,
    GAME_OVER_CONTROL_KEYS,
} from '../src/uiDomAccessibilityDefs.js';

describe('uiDomAccessibilityDefs', () => {
    it('expose 18 contrôles avec id et label', () => {
        expect(Object.keys(CONTROL_DEFS)).toHaveLength(18);
        for (const def of Object.values(CONTROL_DEFS)) {
            expect(def.id).toMatch(/^a11y-/);
            expect(def.label.length).toBeGreaterThan(2);
            expect(def.x).toBeTypeOf('number');
            expect(def.y).toBeTypeOf('number');
        }
    });

    it('référence les clés menu, options, skins et game over', () => {
        for (const key of MENU_CONTROL_KEYS) {
            expect(CONTROL_DEFS[key]).toBeDefined();
        }
        for (const key of OPTIONS_CONTROL_KEYS) {
            expect(CONTROL_DEFS[key]).toBeDefined();
        }
        for (const key of SKINS_PANEL_CONTROL_KEYS) {
            expect(CONTROL_DEFS[key]).toBeDefined();
        }
        for (const key of GAME_OVER_CONTROL_KEYS) {
            expect(CONTROL_DEFS[key]).toBeDefined();
        }
    });

    it('menuHardcore a un libellé explicite', () => {
        expect(CONTROL_DEFS.menuHardcore.label).toBe('Mode hardcore');
    });
});
