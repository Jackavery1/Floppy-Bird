import { describe, it, expect, vi } from 'vitest';
import { showAchievementToasts } from '../src/uiAchievementToast.js';
import { createBaseScene } from './helpers/phaserMock.js';

vi.mock('../src/motion.js', () => ({
    sceneTween: vi.fn(),
}));

describe('uiAchievementToast', () => {
    it('affiche un toast par succès', () => {
        const scene = createBaseScene();
        showAchievementToasts(scene, [{ title: 'Premier vol' }, { title: 'Explorateur' }]);
        expect(scene.add.text).toHaveBeenCalledTimes(2);
    });
});
