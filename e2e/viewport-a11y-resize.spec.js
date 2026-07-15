import { test, expect } from '@playwright/test';
import { expectGameState, startPlayingFromMenu, waitForGameReady } from './helpers/gameCoords.mjs';
import { readJumpButtonAlignment } from './helpers/visualViewport.mjs';

test.describe('contrôles a11y après redimensionnement', () => {
    test('recalcule en partie (mobile portrait)', async ({ page }, testInfo) => {
        test.skip(
            testInfo.project.name !== 'chromium-mobile-portrait',
            'mobile portrait uniquement'
        );
        await waitForGameReady(page);
        await startPlayingFromMenu(page, true);
        await expectGameState(page, 'playing');
        await expect(page.locator('#a11y-jump')).toBeVisible();

        await page.setViewportSize({ width: 360, height: 780 });
        await page.waitForTimeout(250);

        const alignment = await readJumpButtonAlignment(page);
        expect(alignment).not.toBeNull();
        expect(alignment.jumpW).toBeGreaterThanOrEqual(44);
        expect(alignment.jumpH).toBeGreaterThanOrEqual(44);
        expect(alignment.deltaX).toBeLessThan(24);
        expect(alignment.deltaY).toBeLessThan(24);
    });

    test('recalcule en partie (tablette portrait)', async ({ page }, testInfo) => {
        test.skip(
            testInfo.project.name !== 'chromium-tablet-portrait',
            'tablette portrait uniquement'
        );
        await waitForGameReady(page);
        await startPlayingFromMenu(page, true);
        await expectGameState(page, 'playing');
        await expect(page.locator('#a11y-jump')).toBeVisible();

        await page.setViewportSize({ width: 720, height: 960 });
        await page.waitForTimeout(250);

        const alignment = await readJumpButtonAlignment(page);
        expect(alignment).not.toBeNull();
        expect(alignment.jumpW).toBeGreaterThanOrEqual(44);
        expect(alignment.jumpH).toBeGreaterThanOrEqual(44);
        expect(alignment.deltaX).toBeLessThan(28);
        expect(alignment.deltaY).toBeLessThan(28);
    });

    test('recalcule en partie (tablette paysage)', async ({ page }, testInfo) => {
        test.skip(
            testInfo.project.name !== 'chromium-tablet-landscape',
            'tablette paysage uniquement'
        );
        await waitForGameReady(page);
        await startPlayingFromMenu(page, true);
        await expectGameState(page, 'playing');
        await expect(page.locator('#a11y-jump')).toBeVisible();

        await page.setViewportSize({ width: 900, height: 680 });
        await page.waitForTimeout(250);

        const alignment = await readJumpButtonAlignment(page);
        expect(alignment).not.toBeNull();
        expect(alignment.jumpW).toBeGreaterThanOrEqual(44);
        expect(alignment.jumpH).toBeGreaterThanOrEqual(44);
        expect(alignment.deltaX).toBeLessThan(32);
        expect(alignment.deltaY).toBeLessThan(32);
    });
});
