import { test, expect } from '@playwright/test';
import { TOUCH_TARGETS } from '../src/uiLayout.js';
import {
    enterPausedFromPlaying,
    expectGameState,
    isMobileLandscapeProject,
    openPauseFromPlaying,
    pointerGameCoord,
    projectUsesTouch,
    returnToMenuFromPause,
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
        await returnToMenuFromPause(page, usesTouch);
    });

    test('ouvre le panneau scores via tap', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-mobile-portrait', 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        const { menuScores } = TOUCH_TARGETS;
        await pointerGameCoord(page, menuScores.x, menuScores.y, usesTouch);
        await expect(page.locator('canvas')).toBeVisible();
    });

    test('change la difficulté via tap', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-mobile-portrait', 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        const { menuDiffHard } = TOUCH_TARGETS;
        await pointerGameCoord(page, menuDiffHard.x, menuDiffHard.y, usesTouch);
        await startPlayingFromMenu(page, usesTouch);
        await expectGameState(page, 'playing');
    });
});

test.describe('touch mobile landscape', () => {
    test('ouvre la pause via tap bouton en paysage', async ({ page }, testInfo) => {
        test.skip(!isMobileLandscapeProject(testInfo.project.name), 'mobile landscape uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page, { hideLandscapeHint: true });
        await enterPausedFromPlaying(page, usesTouch);
    });

    test('pause → reprendre via tap en paysage', async ({ page }, testInfo) => {
        test.skip(!isMobileLandscapeProject(testInfo.project.name), 'mobile landscape uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page, { hideLandscapeHint: true });
        await enterPausedFromPlaying(page, usesTouch);
        const { pauseResume } = TOUCH_TARGETS;
        await pointerGameCoord(page, pauseResume.x, pauseResume.y, usesTouch);
        await expectGameState(page, 'playing');
    });

    test('pause → menu via tap en paysage', async ({ page }, testInfo) => {
        test.skip(!isMobileLandscapeProject(testInfo.project.name), 'mobile landscape uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page, { hideLandscapeHint: true });
        await enterPausedFromPlaying(page, usesTouch);
        await returnToMenuFromPause(page, usesTouch);
    });
});
