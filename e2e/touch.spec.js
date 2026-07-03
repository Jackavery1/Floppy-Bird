import { test, expect } from '@playwright/test';
import { TOUCH_TARGETS } from '../src/uiLayout.js';
import {
    enterPausedFromPlaying,
    expectGameState,
    isMobileLandscapeProject,
    isMobilePortraitProject,
    openPauseFromPlaying,
    pointerGameCoord,
    projectUsesTouch,
    returnToMenuFromPause,
    startPlayingFromMenu,
    waitForGameReady,
} from './helpers/gameCoords.mjs';

test.describe('touch mobile portrait', () => {
    test('ouvre la pause via tap sur le bouton pause', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);
        await openPauseFromPlaying(page, usesTouch);
    });

    test('pause → reprendre via tap', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await enterPausedFromPlaying(page, usesTouch);
        const { pauseResume } = TOUCH_TARGETS;
        await pointerGameCoord(page, pauseResume.x, pauseResume.y, usesTouch);
        await expectGameState(page, 'playing');
    });

    test('pause → menu via tap', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await enterPausedFromPlaying(page, usesTouch);
        await returnToMenuFromPause(page, usesTouch);
    });

    test('ouvre le panneau scores via tap', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        const { menuScores } = TOUCH_TARGETS;
        await pointerGameCoord(page, menuScores.x, menuScores.y, usesTouch);
        await expect
            .poll(() => page.evaluate(() => window.__FLOPPY_TEST__.getMenuPanels()?.scores))
            .toBe(true);
    });

    test('ouvre le panneau options via tap', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        const { menuOptions } = TOUCH_TARGETS;
        await pointerGameCoord(page, menuOptions.x, menuOptions.y, usesTouch);
        await expect
            .poll(() => page.evaluate(() => window.__FLOPPY_TEST__.getMenuPanels()?.options))
            .toBe(true);
    });

    test('ouvre le panneau skins via tap', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        const { menuSkins } = TOUCH_TARGETS;
        await pointerGameCoord(page, menuSkins.x, menuSkins.y, usesTouch);
        await expect
            .poll(() => page.evaluate(() => window.__FLOPPY_TEST__.getMenuPanels()?.skins))
            .toBe(true);
    });

    test('sélectionne la difficulté facile via tap', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        const { menuDiffEasy } = TOUCH_TARGETS;
        await pointerGameCoord(page, menuDiffEasy.x, menuDiffEasy.y, usesTouch);
        await expect
            .poll(() => page.evaluate(() => window.__FLOPPY_TEST__.getMenuPanels()?.difficulty))
            .toBe('easy');
    });

    test('sélectionne la difficulté normale via tap', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        const { menuDiffHard, menuDiffNormal } = TOUCH_TARGETS;
        await pointerGameCoord(page, menuDiffHard.x, menuDiffHard.y, usesTouch);
        await pointerGameCoord(page, menuDiffNormal.x, menuDiffNormal.y, usesTouch);
        await expect
            .poll(() => page.evaluate(() => window.__FLOPPY_TEST__.getMenuPanels()?.difficulty))
            .toBe('normal');
    });

    test('lance le défi du jour via tap', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        const { menuDaily } = TOUCH_TARGETS;
        await pointerGameCoord(page, menuDaily.x, menuDaily.y, usesTouch);
        await expectGameState(page, 'playing');
        await expect
            .poll(() =>
                page.evaluate(() => window.__FLOPPY_TEST__.getMenuPanels()?.dailyChallengeMode)
            )
            .toBe(true);
    });

    test('bascule entraînement via tap dans options', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        const { menuOptions, menuTraining } = TOUCH_TARGETS;
        await pointerGameCoord(page, menuOptions.x, menuOptions.y, usesTouch);
        await expect
            .poll(() => page.evaluate(() => window.__FLOPPY_TEST__.getMenuPanels()?.options))
            .toBe(true);
        await pointerGameCoord(page, menuTraining.x, menuTraining.y, usesTouch);
        await expect
            .poll(() => page.evaluate(() => window.__FLOPPY_TEST__.getMenuPanels()?.trainingMode))
            .toBe(true);
    });

    test('tape le contrôle son dans options', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        const { menuOptions, menuMute } = TOUCH_TARGETS;
        await pointerGameCoord(page, menuOptions.x, menuOptions.y, usesTouch);
        await pointerGameCoord(page, menuMute.x, menuMute.y, usesTouch);
        await expect
            .poll(() => page.evaluate(() => window.__FLOPPY_TEST__.getMenuPanels()?.options))
            .toBe(true);
    });

    test('tape le contrôle hardcore dans options', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        const { menuOptions, menuHardcore } = TOUCH_TARGETS;
        await pointerGameCoord(page, menuOptions.x, menuOptions.y, usesTouch);
        await pointerGameCoord(page, menuHardcore.x, menuHardcore.y, usesTouch);
        await expect
            .poll(() => page.evaluate(() => window.__FLOPPY_TEST__.getMenuPanels()?.options))
            .toBe(true);
    });

    test('change la difficulté via tap', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
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
