import { describe, it, expect, vi } from 'vitest';
import { applySelectedSkin } from '../src/skins/skinSelection.js';

vi.mock('../src/metaStorage.js', () => ({
    saveSelectedSkin: vi.fn(),
}));

describe('skinSelection', () => {
    it('persiste et applique le skin sur l’oiseau', async () => {
        const { saveSelectedSkin } = await import('../src/metaStorage.js');
        const setSkin = vi.fn();
        const scene = { bird: { setSkin } };

        const id = applySelectedSkin(scene, 'cosmos');

        expect(id).toBe('cosmos');
        expect(saveSelectedSkin).toHaveBeenCalledWith('cosmos');
        expect(setSkin).toHaveBeenCalledWith('cosmos');
    });
});
