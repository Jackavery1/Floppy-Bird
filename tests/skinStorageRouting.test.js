import { describe, it, expect } from 'vitest';
import { routedSkinId } from '../src/skinStorageRouting.js';

describe('skinStorageRouting', () => {
    it('routedSkinId retourne null pour un skin classique', () => {
        expect(routedSkinId('classic')).toBeNull();
        expect(routedSkinId('lavande')).toBeNull();
    });

    it('routedSkinId retourne l’id pour un skin spécial', () => {
        expect(routedSkinId('cosmos')).toBe('cosmos');
        expect(routedSkinId('neon')).toBe('neon');
    });
});
