import { describe, it, expect, vi, beforeEach } from 'vitest';
import { wireSceneBindings } from '../src/sceneBindings.js';

vi.mock('../src/uiAchievementToast.js', () => ({
    showAchievementToasts: vi.fn(),
}));

describe('sceneBindings', () => {
    beforeEach(async () => {
        const { showAchievementToasts } = await import('../src/uiAchievementToast.js');
        vi.mocked(showAchievementToasts).mockClear();
    });

    it('wireSceneBindings installe achievementNotifier', async () => {
        const { showAchievementToasts } = await import('../src/uiAchievementToast.js');
        const scene = {};
        wireSceneBindings(scene);
        expect(typeof scene.achievementNotifier).toBe('function');
        scene.achievementNotifier([{ title: 'Test' }]);
        expect(showAchievementToasts).toHaveBeenCalledWith(scene, [{ title: 'Test' }]);
    });
});
