import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UI } from '../src/ui.js';
import { MIN_TOUCH, UI_LAYOUT } from '../src/uiLayout.js';
import { createBaseScene } from './helpers/phaserMock.js';

vi.mock('../src/motion.js', () => ({
    sceneTween: vi.fn(),
}));

describe('uiPause', () => {
    let scene;
    let ui;

    beforeEach(() => {
        scene = createBaseScene();
        ui = new UI(scene);
    });

    it('showPause retourne overlay et boutons avec zones tactiles', async () => {
        const { showPause } = await import('../src/uiPause.js');
        const onResume = vi.fn();
        const onMenu = vi.fn();
        const { elements } = showPause(ui, { onResume, onMenu });

        expect(elements.length).toBeGreaterThan(4);
        const rectangles = scene.add.rectangle.mock.calls;
        const pauseHits = rectangles.filter(
            ([, y, , h]) =>
                h === MIN_TOUCH &&
                (y === UI_LAYOUT.pause.resumeBtn || y === UI_LAYOUT.pause.menuBtn)
        );
        expect(pauseHits.length).toBe(2);
    });

    it('showPause appelle onResume au tap reprendre', async () => {
        const { showPause } = await import('../src/uiPause.js');
        const onResume = vi.fn();
        showPause(ui, { onResume, onMenu: vi.fn() });

        const resumeHit = scene.add.rectangle.mock.results.find(
            (r) => r.value?.on?.mock?.calls?.length
        )?.value;
        expect(resumeHit).toBeTruthy();
        const downHandler = resumeHit.on.mock.calls.find((c) => c[0] === 'pointerdown')?.[1];
        downHandler?.({}, {}, {}, { stopPropagation: vi.fn() });
        expect(onResume).toHaveBeenCalled();
    });
});
