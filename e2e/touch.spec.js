import { test } from '@playwright/test';
import { TOUCH_TARGETS } from '../src/uiLayout.js';
import {
    enterPausedFromPlaying,
    expectGameState,
    openPauseFromPlaying,
    pointerGameCoord,
    projectUsesTouch,
    startPlayingFromMenu,
    waitForGameReady,
} from './helpers/gameCoords.mjs';

test.describe('touch mobile portrait', () => {
    test('ouvre la pause via tap sur le bouton pause', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-mobile-portrait', 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);
        await openPauseFromPlaying(page, usesTouch);
    });

    test('pause → reprendre via tap', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-mobile-portrait', 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await enterPausedFromPlaying(page, usesTouch);
        const { pauseResume } = TOUCH_TARGETS;
        await pointerGameCoord(page, pauseResume.x, pauseResume.y, usesTouch);
        await expectGameState(page, 'playing');
    });

    test('pause → menu via tap', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-mobile-portrait', 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await enterPausedFromPlaying(page, usesTouch);
        const { pauseMenu } = TOUCH_TARGETS;
        await pointerGameCoord(page, pauseMenu.x, pauseMenu.y, usesTouch);
        await expectGameState(page, 'menu');
    });
});

test.describe('touch mobile landscape', () => {
    test('ouvre la pause via tap bouton en paysage', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-mobile-landscape', 'mobile landscape uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await enterPausedFromPlaying(page, usesTouch);
    });

    test('pause → reprendre via tap en paysage', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-mobile-landscape', 'mobile landscape uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await enterPausedFromPlaying(page, usesTouch);
        const { pauseResume } = TOUCH_TARGETS;
        await pointerGameCoord(page, pauseResume.x, pauseResume.y, usesTouch);
        await expectGameState(page, 'playing');
    });
});
