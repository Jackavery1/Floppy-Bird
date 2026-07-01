import { describe, it, expect, vi, beforeEach } from 'vitest';
import { wireSceneBindings } from '../src/sceneBindings.js';

vi.mock('../src/uiMeta.js', () => ({
    showAchievementToasts: vi.fn(),
}));

describe('sceneBindings', () => {
    beforeEach(async () => {
        const { showAchievementToasts } = await import('../src/uiMeta.js');
        vi.mocked(showAchievementToasts).mockClear();
    });

    it('wireSceneBindings installe achievementNotifier', async () => {
        const { showAchievementToasts } = await import('../src/uiMeta.js');
        const scene = {};
        wireSceneBindings(scene);
        expect(typeof scene.achievementNotifier).toBe('function');
        scene.achievementNotifier([{ title: 'Test' }]);
        expect(showAchievementToasts).toHaveBeenCalledWith(scene, [{ title: 'Test' }]);
    });
});
