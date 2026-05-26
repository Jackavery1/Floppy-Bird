import { describe, it, expect } from 'vitest';
import { Utils } from '../src/utils.js';

describe('Utils.checkCollision', () => {
    it('détecte un chevauchement', () => {
        const a = { x: 0, y: 0, width: 10, height: 10 };
        const b = { x: 5, y: 5, width: 10, height: 10 };
        expect(Utils.checkCollision(a, b)).toBe(true);
    });

    it('rejette des rectangles séparés', () => {
        const a = { x: 0, y: 0, width: 10, height: 10 };
        const b = { x: 20, y: 20, width: 10, height: 10 };
        expect(Utils.checkCollision(a, b)).toBe(false);
    });
});

describe('Utils.clamp', () => {
    it('borne une valeur', () => {
        expect(Utils.clamp(150, 100, 400)).toBe(150);
        expect(Utils.clamp(50, 100, 400)).toBe(100);
        expect(Utils.clamp(500, 100, 400)).toBe(400);
    });
});

describe('Utils.randomInt', () => {
    it('reste dans les bornes', () => {
        for (let i = 0; i < 50; i++) {
            const n = Utils.randomInt(10, 20);
            expect(n).toBeGreaterThanOrEqual(10);
            expect(n).toBeLessThanOrEqual(20);
        }
    });
});
