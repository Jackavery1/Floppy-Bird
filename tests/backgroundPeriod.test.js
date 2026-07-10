import { describe, it, expect } from 'vitest';
import { getBackgroundPeriod } from '../src/backgroundPeriod.js';

describe('backgroundPeriod', () => {
    it('retourne day entre 6h et 20h', () => {
        expect(getBackgroundPeriod(new Date('2026-07-10T12:00:00'))).toBe('day');
    });

    it('retourne night hors plage jour', () => {
        expect(getBackgroundPeriod(new Date('2026-07-10T22:00:00'))).toBe('night');
        expect(getBackgroundPeriod(new Date('2026-07-10T05:00:00'))).toBe('night');
    });
});
