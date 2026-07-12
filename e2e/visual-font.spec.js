import { test, expect } from '@playwright/test';
import { waitForGameReady } from './helpers/gameCoords.mjs';
import { getTestState } from './helpers/testSeam.mjs';

test.describe('vérif visuelle police titre', () => {
    test('Press Start 2P chargée et labels difficulté a11y', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await waitForGameReady(page);
        await expect.poll(async () => getTestState(page)).toBe('menu');

        const fontReady = await page.evaluate(async () => {
            const fonts = document.fonts;
            if (!fonts?.load) return true;
            await fonts.load('12px "Press Start 2P"');
            return fonts.check('12px "Press Start 2P"');
        });
        expect(fontReady).toBe(true);

        await expect(page.locator('#a11y-diff-normal')).toHaveAttribute(
            'aria-label',
            /difficulté/i
        );
        await expect(page.locator('#a11y-diff-normal')).toHaveAttribute('aria-label', /touche 2/i);
    });
});
