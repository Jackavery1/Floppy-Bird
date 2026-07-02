import { describe, it, expect } from 'vitest';
import { SKIN_ACCESSORIES } from '../src/skins/skinAccessories.js';

describe('skinAccessories', () => {
    it('expose un accessoire par skin spécial marqué', () => {
        expect(Object.keys(SKIN_ACCESSORIES).sort()).toEqual([
            'armure', 'cosmos', 'fantome', 'glace', 'mushu', 'neon', 'phoenix', 'tempete',
        ]);
    });

    it('chaque accessoire expose une fonction draw', () => {
        for (const key of Object.keys(SKIN_ACCESSORIES)) {
            expect(typeof SKIN_ACCESSORIES[key].draw).toBe('function');
        }
    });

    it('draw ne lève pas avec un graphics mock', () => {
        const g = {
            fillStyle: () => {},
            fillRect: () => {},
            fillPoints: () => {},
        };
        const palette = {
            body: 0xffffff, bodyHi: 0xeeeeee, wing: 0xcccccc,
            beak: 0xffaa00, beakDark: 0xcc8800,
            helmet: 0x888888, helmetHi: 0xaaaaaa, plume: 0xff0000,
            horn: 0xff0000, ridge: 0x00ff00, whisker: 0xffffff,
            glow: 0xffffff, wisp: 0xcccccc,
            visor: 0x00ffff, trim: 0xff00ff,
            flame: 0xff6600, ember: 0xff3300,
            crystal: 0xaaddff, shine: 0xffffff,
            cloud: 0x888888, bolt: 0xffff00,
            star: 0xffffff, ring: 0xccccff,
        };
        for (const key of Object.keys(SKIN_ACCESSORIES)) {
            expect(() => SKIN_ACCESSORIES[key].draw(g, 0, 0, 'mid', palette)).not.toThrow();
        }
    });
});
