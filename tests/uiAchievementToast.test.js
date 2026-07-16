import { describe, it, expect, vi } from 'vitest';
import { showAchievementToasts } from '../src/ui/hud/uiAchievementToast.js';
import { UI } from '../src/ui/core/ui.js';
import { createBaseScene } from './helpers/phaserMock.js';

vi.mock('../src/motion.js', () => ({
    sceneTween: vi.fn(),
}));

describe('uiAchievementToast', () => {
    it('affiche un toast par succès sur des lignes distinctes', () => {
        const scene = createBaseScene();
        scene.ui = new UI(scene);
        showAchievementToasts(scene, [{ title: 'Premier vol' }, { title: 'Explorateur' }]);
        expect(scene.time.delayedCall).toHaveBeenCalledTimes(2);
        scene._delayedCalls.forEach((cb) => cb());
        expect(scene.add.text).toHaveBeenCalledTimes(2);
        const rows = scene.add.text.mock.results.map((r) => r.value.__bannerRow);
        expect(rows[0]).not.toBe(rows[1]);
    });
});
