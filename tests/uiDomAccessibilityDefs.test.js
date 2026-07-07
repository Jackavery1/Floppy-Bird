import { describe, it, expect } from 'vitest';
import {
    CONTROL_DEFS,
    MENU_CONTROL_KEYS,
    OPTIONS_CONTROL_KEYS,
    PLAYING_CONTROL_KEYS,
    PAUSE_OVERLAY_CONTROL_KEYS,
    SCORES_PANEL_CONTROL_KEYS,
    SKINS_PANEL_CONTROL_KEYS,
    GAME_OVER_CONTROL_KEYS,
} from '../src/uiDomAccessibilityDefs.js';

describe('uiDomAccessibilityDefs', () => {
    it('expose tous les contrôles avec id et label', () => {
        const keys = Object.keys(CONTROL_DEFS);
        const registries = [
            ...MENU_CONTROL_KEYS,
            ...OPTIONS_CONTROL_KEYS,
            ...SCORES_PANEL_CONTROL_KEYS,
            ...SKINS_PANEL_CONTROL_KEYS,
            ...GAME_OVER_CONTROL_KEYS,
            ...PLAYING_CONTROL_KEYS,
            ...PAUSE_OVERLAY_CONTROL_KEYS,
        ];
        expect(new Set(registries)).toEqual(new Set(keys));
        expect(keys.length).toBe(registries.length);
        for (const def of Object.values(CONTROL_DEFS)) {
            expect(def.id).toMatch(/^a11y-/);
            expect(def.label.length).toBeGreaterThan(2);
            expect(def.x).toBeTypeOf('number');
            expect(def.y).toBeTypeOf('number');
        }
    });

    it('référence les clés menu, options, scores, skins et game over', () => {
        for (const key of MENU_CONTROL_KEYS) {
            expect(CONTROL_DEFS[key]).toBeDefined();
        }
        for (const key of OPTIONS_CONTROL_KEYS) {
            expect(CONTROL_DEFS[key]).toBeDefined();
        }
        for (const key of SCORES_PANEL_CONTROL_KEYS) {
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
