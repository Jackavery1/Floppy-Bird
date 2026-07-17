import { test, expect } from '@playwright/test';
import {
    expectGameState,
    isMobilePortraitProject,
    projectUsesTouch,
    startPlayingFromMenu,
    waitForGameReady,
} from './helpers/gameCoords.mjs';
import {
    getLastDeathMetrics,
    getMenuPanels,
    getTutorialState,
    triggerDeath,
} from './helpers/testSeam.mjs';

test.describe('tutoriel première partie', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => localStorage.clear());
    });

    test('démarre au step 0 sur profil vierge', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await expect(page.locator('#ui-announcer')).toContainText(/Première partie/i);
        const menu = await getMenuPanels(page);
        expect(menu?.firstRunHintVisible).toBe(true);
        expect(menu?.firstRunHintText).toMatch(/ESPACE|TAP/i);
        await startPlayingFromMenu(page, usesTouch);

        const tutorial = await getTutorialState(page);
        expect(tutorial?.complete).toBe(false);
        expect(tutorial?.step).toBeGreaterThanOrEqual(0);
    });

    test('first-run hint visible en mobile portrait', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        await waitForGameReady(page);
        await expect(page.locator('#ui-announcer')).toContainText(/Première partie/i);
        const menu = await getMenuPanels(page);
        expect(menu?.firstRunHintVisible).toBe(true);
        expect(menu?.firstRunHintText).toMatch(/TAP/i);
    });

    test('tutoriel actif en mobile portrait', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);

        const tutorial = await getTutorialState(page);
        expect(tutorial?.complete).toBe(false);
    });

    test('skip tutoriel via a11y hors zone jump (mobile)', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);
        await expect(page.locator('#a11y-tutorial-skip')).toBeVisible({ timeout: 5_000 });
        const skipBox = await page.locator('#a11y-tutorial-skip').boundingBox();
        const jumpBox = await page.locator('#a11y-jump').boundingBox();
        expect(skipBox).toBeTruthy();
        expect(jumpBox).toBeTruthy();
        expect(skipBox.y).toBeGreaterThanOrEqual(jumpBox.y + jumpBox.height - 1);
        await page.locator('#a11y-tutorial-skip').tap({ force: true });
        await expect.poll(async () => (await getTutorialState(page))?.complete).toBe(true);
    });

    test('première mort enregistre earlyDeath sur profil vierge', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await startPlayingFromMenu(page, false);
        await triggerDeath(page, 'pipe');
        await expectGameState(page, 'gameover', 15_000);
        const death = await getLastDeathMetrics(page);
        expect(death).toMatchObject({
            cause: 'pipe',
            score: 0,
            isEarlyDeath: true,
            beforeFirstPipe: true,
        });
        expect(death.elapsedMs).toBeGreaterThan(0);
        expect(death.elapsedMs).toBeLessThan(30_000);
    });
});
