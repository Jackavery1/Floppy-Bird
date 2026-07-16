import { test, expect } from '@playwright/test';
import { TOUCH_TARGETS } from '../src/ui/shared/uiLayout.js';
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
import { getMenuPanels, getOptionsPanel } from './helpers/testSeam.mjs';

test.describe('touch mobile portrait', () => {
    test('ouvre la pause via tap sur le bouton pause', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);
        await openPauseFromPlaying(page, usesTouch);
    });

    test('ouvre la pause via bouton a11y DOM', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);
        await expect(page.locator('#a11y-pause')).toBeVisible();
        await page.locator('#a11y-pause').tap({ force: true });
        await expectGameState(page, 'paused');
    });

    test('masque les boutons menu pendant la partie', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await page.locator('#a11y-options').tap({ force: true });
        await expect(page.locator('#a11y-options-close')).toBeVisible();
        await page.locator('#a11y-options-close').tap({ force: true });
        await startPlayingFromMenu(page, usesTouch);
        await expect(page.locator('#a11y-options')).toBeHidden();
        await expect(page.locator('#a11y-jump')).toBeVisible();
        await expect(page.locator('#a11y-pause')).toBeVisible();
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

    test('pause → reprendre via bouton a11y DOM', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await enterPausedFromPlaying(page, usesTouch);
        await expect(page.locator('#a11y-resume')).toBeVisible();
        await page.locator('#a11y-resume').tap({ force: true });
        await expectGameState(page, 'playing');
    });

    test('pause → menu via tap', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await enterPausedFromPlaying(page, usesTouch);
        await returnToMenuFromPause(page, usesTouch);
    });

    test('pause → menu via bouton a11y DOM', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await enterPausedFromPlaying(page, usesTouch);
        await expect(page.locator('#a11y-menu')).toBeVisible();
        await page.locator('#a11y-menu').tap({ force: true });
        await expectGameState(page, 'menu');
    });

    test('ouvre le panneau scores via tap', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        const { menuScores } = TOUCH_TARGETS;
        await pointerGameCoord(page, menuScores.x, menuScores.y, usesTouch);
        await expect.poll(() => getMenuPanels(page).then((p) => p?.scores)).toBe(true);
    });

    test('le bouton RETOUR referme le panneau scores (sans repasser par la rangée du menu)', async ({
        page,
    }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        const { menuScores, menuScoresClose } = TOUCH_TARGETS;
        await pointerGameCoord(page, menuScores.x, menuScores.y, usesTouch);
        await expect.poll(() => getMenuPanels(page).then((p) => p?.scores)).toBe(true);
        await pointerGameCoord(page, menuScoresClose.x, menuScoresClose.y, usesTouch);
        await expect.poll(() => getMenuPanels(page).then((p) => p?.scores)).toBe(false);
    });

    test('ouvre le panneau options via tap', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        const { menuOptions } = TOUCH_TARGETS;
        await pointerGameCoord(page, menuOptions.x, menuOptions.y, usesTouch);
        await expect.poll(() => getMenuPanels(page).then((p) => p?.options)).toBe(true);
    });

    test('ouvre le panneau skins via tap', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        const { menuSkins } = TOUCH_TARGETS;
        await pointerGameCoord(page, menuSkins.x, menuSkins.y, usesTouch);
        await expect.poll(() => getMenuPanels(page).then((p) => p?.skins)).toBe(true);
    });

    test('sélectionne la difficulté facile via tap', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        const { menuDiffEasy } = TOUCH_TARGETS;
        await pointerGameCoord(page, menuDiffEasy.x, menuDiffEasy.y, usesTouch);
        await expect.poll(() => getMenuPanels(page).then((p) => p?.difficulty)).toBe('easy');
    });

    test('sélectionne la difficulté normale via tap', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        const { menuDiffHard, menuDiffNormal } = TOUCH_TARGETS;
        await pointerGameCoord(page, menuDiffHard.x, menuDiffHard.y, usesTouch);
        await pointerGameCoord(page, menuDiffNormal.x, menuDiffNormal.y, usesTouch);
        await expect.poll(() => getMenuPanels(page).then((p) => p?.difficulty)).toBe('normal');
    });

    test('lance le défi du jour via tap', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        const { menuDaily } = TOUCH_TARGETS;
        await pointerGameCoord(page, menuDaily.x, menuDaily.y, usesTouch);
        await expectGameState(page, 'playing');
        await expect.poll(() => getMenuPanels(page).then((p) => p?.dailyChallengeMode)).toBe(true);
    });

    test('bascule entraînement via tap dans options', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        const { menuOptions, menuTraining } = TOUCH_TARGETS;
        await pointerGameCoord(page, menuOptions.x, menuOptions.y, usesTouch);
        await expect.poll(() => getMenuPanels(page).then((p) => p?.options)).toBe(true);
        await pointerGameCoord(page, menuTraining.x, menuTraining.y, usesTouch);
        await expect.poll(() => getMenuPanels(page).then((p) => p?.trainingMode)).toBe(true);
    });

    test('tape le contrôle son dans options', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        const { menuOptions, menuMute } = TOUCH_TARGETS;
        await pointerGameCoord(page, menuOptions.x, menuOptions.y, usesTouch);
        await pointerGameCoord(page, menuMute.x, menuMute.y, usesTouch);
        await expect.poll(() => getMenuPanels(page).then((p) => p?.options)).toBe(true);
    });

    test('active hardcore via onglet REGL dans options', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        await page.addInitScript(() => {
            localStorage.setItem('flappy-bird-high-score-normal', '15');
        });
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        const { menuOptions, menuHardcore, menuOptionsTabPreferences } = TOUCH_TARGETS;

        await pointerGameCoord(page, menuOptions.x, menuOptions.y, usesTouch);
        await expect
            .poll(() => getOptionsPanel(page))
            .toMatchObject({ open: true, tab: 'preferences', preferences: true });

        await pointerGameCoord(
            page,
            menuOptionsTabPreferences.x,
            menuOptionsTabPreferences.y,
            usesTouch
        );
        await expect
            .poll(() => getOptionsPanel(page))
            .toMatchObject({ tab: 'preferences', preferences: true });

        expect(await getMenuPanels(page).then((p) => p?.hardcoreMode)).toBe(false);

        await pointerGameCoord(page, menuHardcore.x, menuHardcore.y, usesTouch);
        await expect.poll(() => getMenuPanels(page)).toMatchObject({ hardcoreMode: true });
    });

    test('navigue les onglets Options puis ferme sans bleed contrôles', async ({
        page,
    }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        const { menuOptions, menuOptionsTabControls, menuOptionsTabPreferences, menuOptionsClose } =
            TOUCH_TARGETS;

        await pointerGameCoord(page, menuOptions.x, menuOptions.y, usesTouch);
        await expect
            .poll(() => getOptionsPanel(page))
            .toMatchObject({ open: true, tab: 'preferences', preferences: true });

        await pointerGameCoord(page, menuOptionsTabControls.x, menuOptionsTabControls.y, usesTouch);
        await expect
            .poll(() => getOptionsPanel(page))
            .toMatchObject({
                open: true,
                tab: 'controls',
                controls: true,
                preferences: false,
            });

        await pointerGameCoord(
            page,
            menuOptionsTabPreferences.x,
            menuOptionsTabPreferences.y,
            usesTouch
        );
        await expect
            .poll(() => getOptionsPanel(page))
            .toMatchObject({
                tab: 'preferences',
                controls: false,
                preferences: true,
            });

        await pointerGameCoord(page, menuOptionsClose.x, menuOptionsClose.y, usesTouch);
        await expect
            .poll(() => getOptionsPanel(page))
            .toMatchObject({
                open: false,
                controls: false,
                preferences: false,
            });
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
