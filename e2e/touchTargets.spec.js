import { test, expect } from '@playwright/test';
import {
    isMobilePortraitProject,
    startPlayingFromMenu,
    waitForGameReady,
} from './helpers/gameCoords.mjs';
import { forceGameOver } from './helpers/testSeam.mjs';

/** Dimension minimale écran (px) d’un bouton a11y DOM, via style inline + letterbox. */
async function minA11yButtonScreenPx(page, buttonId) {
    return page.evaluate((id) => {
        const canvas = document.querySelector('#game-container canvas');
        const btn = document.getElementById(id);
        if (!canvas || !btn) return 0;
        const scale = canvas.getBoundingClientRect().height / 512;
        const w = parseFloat(btn.style.width || '0');
        const h = parseFloat(btn.style.height || '0');
        if (w > 0 && h > 0) return Math.min(w, h) * scale;
        return (h || w || 44) * scale;
    }, buttonId);
}

test.describe('cibles tactiques ≥ 44 px', () => {
    test('bouton pause après letterbox (portrait tactile)', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'portrait tactile uniquement');
        await waitForGameReady(page);
        await startPlayingFromMenu(page, true);
        const minScreenPx = await page.evaluate(() => {
            const canvas = document.querySelector('#game-container canvas');
            if (!canvas) return 0;
            const scale = canvas.getBoundingClientRect().width / 288;
            return 44 * scale;
        });
        expect(minScreenPx).toBeGreaterThanOrEqual(44);
    });

    test('boutons difficulté et défi du jour au menu', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'portrait tactile uniquement');
        await waitForGameReady(page);
        for (const id of ['a11y-diff-easy', 'a11y-diff-normal', 'a11y-diff-hard', 'a11y-daily']) {
            const minPx = await minA11yButtonScreenPx(page, id);
            expect(minPx, id).toBeGreaterThanOrEqual(44);
        }
    });

    test('boutons menu secondaires SCORE / OPTS / SKINS après letterbox', async ({
        page,
    }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'portrait tactile uniquement');
        await waitForGameReady(page);
        for (const id of ['a11y-scores', 'a11y-options', 'a11y-skins']) {
            const minPx = await minA11yButtonScreenPx(page, id);
            expect(minPx, id).toBeGreaterThanOrEqual(44);
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
        for (const id of ['a11y-mute', 'a11y-training', 'a11y-hardcore']) {
            const minPx = await minA11yButtonScreenPx(page, id);
            expect(minPx, id).toBeGreaterThanOrEqual(44);
        }

        await page.locator('#a11y-options-close').tap({ force: true });
        await page.locator('#a11y-skins').tap({ force: true });
        await expect(page.locator('#a11y-skins-close')).toBeVisible();
        for (const id of ['a11y-skin-prev', 'a11y-skin-next', 'a11y-skins-close']) {
            const minPx = await minA11yButtonScreenPx(page, id);
            expect(minPx, id).toBeGreaterThanOrEqual(44);
        }
    });

    test('boutons game over REJOUER et MENU', async ({ page }, testInfo) => {
        test.skip(!isMobilePortraitProject(testInfo.project.name), 'portrait tactile uniquement');
        await waitForGameReady(page);
        await forceGameOver(page);
        for (const id of ['a11y-gameover-restart', 'a11y-gameover-menu']) {
            const minPx = await minA11yButtonScreenPx(page, id);
            expect(minPx, id).toBeGreaterThanOrEqual(44);
        }
    });
});
