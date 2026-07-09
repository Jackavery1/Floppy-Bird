import { test, expect } from '@playwright/test';
import {
    isMobilePortraitProject,
    projectUsesTouch,
    startPlayingFromMenu,
    waitForGameReady,
} from './helpers/gameCoords.mjs';
import { getTutorialState } from './helpers/testSeam.mjs';

test.describe('tutoriel première partie', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => localStorage.clear());
    });

    test('démarre au step 0 sur profil vierge', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);

        const tutorial = await getTutorialState(page);
        expect(tutorial?.complete).toBe(false);
        expect(tutorial?.step).toBeGreaterThanOrEqual(0);
    });

    test('tutoriel actif en mobile portrait', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'mobile portrait uniquement');
        const usesTouch = projectUsesTouch(testInfo);
        await waitForGameReady(page);
        await startPlayingFromMenu(page, usesTouch);

        const tutorial = await getTutorialState(page);
        expect(tutorial?.complete).toBe(false);
    });
});
