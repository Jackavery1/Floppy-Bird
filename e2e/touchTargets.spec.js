import { test, expect } from '@playwright/test';
import {
    enterPausedFromPlaying,
    isMobilePortraitProject,
    startPlayingFromMenu,
    waitForGameReady,
} from './helpers/gameCoords.mjs';
import { forceGameOver } from './helpers/testSeam.mjs';

/** Dimension minimale écran (px) d’un bouton a11y DOM (styles déjà en CSS px). */
async function minA11yButtonScreenPx(page, buttonId) {
    return page.evaluate((id) => {
        const btn = document.getElementById(id);
        if (!btn || btn.hidden) return 0;
        const rect = btn.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            return Math.min(rect.width, rect.height);
        }
        const w = parseFloat(btn.style.width || '0');
        const h = parseFloat(btn.style.height || '0');
        return Math.min(w || 0, h || 0) || 0;
    }, buttonId);
}

test.describe('cibles tactiques ≥ 44 px', () => {
    test('bouton pause après letterbox (portrait tactile)', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'portrait tactile uniquement');
        await waitForGameReady(page);
        await startPlayingFromMenu(page, true);
        await expect(page.locator('#a11y-pause')).toBeVisible();
        expect(await minA11yButtonScreenPx(page, 'a11y-pause')).toBeGreaterThanOrEqual(48);
    });

    test('boutons difficulté et défi du jour au menu', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'portrait tactile uniquement');
        await waitForGameReady(page);
        for (const id of ['a11y-diff-easy', 'a11y-diff-normal', 'a11y-diff-hard']) {
            const minPx = await minA11yButtonScreenPx(page, id);
            expect(minPx, id).toBeGreaterThanOrEqual(44);
        }
        expect(await minA11yButtonScreenPx(page, 'a11y-daily')).toBeGreaterThanOrEqual(48);
    });

    test('boutons menu secondaires SCORES / OPT. / SKINS après letterbox', async ({
        page,
    }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'portrait tactile uniquement');
        await waitForGameReady(page);
        for (const id of ['a11y-scores', 'a11y-options', 'a11y-skins']) {
            const minPx = await minA11yButtonScreenPx(page, id);
            expect(minPx, id).toBeGreaterThanOrEqual(48);
        }
    });

    test('boutons panneaux options et skins après ouverture', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'portrait tactile uniquement');
        await waitForGameReady(page);

        await page.locator('#a11y-options').tap({ force: true });
        await expect(page.locator('#a11y-options-close')).toBeVisible();
        for (const id of [
            'a11y-options-close',
            'a11y-options-tab-controls',
            'a11y-options-tab-preferences',
        ]) {
            const minPx = await minA11yButtonScreenPx(page, id);
            expect(minPx, id).toBeGreaterThanOrEqual(44);
        }

        await page.locator('#a11y-options-tab-preferences').tap({ force: true });
        for (const id of ['a11y-mute', 'a11y-training', 'a11y-hardcore', 'a11y-training-speed']) {
            const minPx = await minA11yButtonScreenPx(page, id);
            expect(minPx, id).toBeGreaterThanOrEqual(44);
        }

        await page.locator('#a11y-options-close').tap({ force: true });
        await page.locator('#a11y-scores').tap({ force: true });
        await expect(page.locator('#a11y-scores-close')).toBeVisible();
        expect(await minA11yButtonScreenPx(page, 'a11y-scores-close')).toBeGreaterThanOrEqual(44);
        await page.locator('#a11y-scores-close').tap({ force: true });

        await page.locator('#a11y-skins').tap({ force: true });
        await expect(page.locator('#a11y-skins-close')).toBeVisible();
        for (const id of ['a11y-skin-prev', 'a11y-skin-next', 'a11y-skins-close']) {
            const minPx = await minA11yButtonScreenPx(page, id);
            expect(minPx, id).toBeGreaterThanOrEqual(44);
        }
    });

    test('boutons pause / menu en jeu', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'portrait tactile uniquement');
        await waitForGameReady(page);
        await enterPausedFromPlaying(page, true);
        await expect(page.locator('#a11y-resume')).toBeVisible();
        for (const id of ['a11y-resume', 'a11y-menu']) {
            const minPx = await minA11yButtonScreenPx(page, id);
            expect(minPx, id).toBeGreaterThanOrEqual(48);
        }
    });

    test('CTA primaires ≥ 48 px (démarrer, sauter, rejouer)', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'portrait tactile uniquement');
        await waitForGameReady(page);
        for (const id of ['a11y-start']) {
            const minPx = await minA11yButtonScreenPx(page, id);
            expect(minPx, id).toBeGreaterThanOrEqual(48);
        }

        await startPlayingFromMenu(page, true);
        const jumpPx = await minA11yButtonScreenPx(page, 'a11y-jump');
        expect(jumpPx).toBeGreaterThanOrEqual(48);

        await forceGameOver(page);
        const restartPx = await minA11yButtonScreenPx(page, 'a11y-gameover-restart');
        expect(restartPx).toBeGreaterThanOrEqual(48);
    });

    test('boutons game over REJOUER et MENU', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'portrait tactile uniquement');
        await waitForGameReady(page);
        await forceGameOver(page);
        for (const id of ['a11y-gameover-restart', 'a11y-gameover-menu']) {
            const minPx = await minA11yButtonScreenPx(page, id);
            expect(minPx, id).toBeGreaterThanOrEqual(48);
        }
    });
});
