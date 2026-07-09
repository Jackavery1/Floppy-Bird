import { test, expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { waitForGameReady } from './helpers/gameCoords.mjs';
import { getTestState } from './helpers/testSeam.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shotsDir = path.join(__dirname, '..', 'test-results', 'visual-font');

test.describe('vérif visuelle police titre', () => {
    test('menu et pause — screenshot après chargement font', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await page.screenshot({ path: path.join(shotsDir, 'menu.png'), fullPage: true });

        await page.keyboard.press('Space');
        await expect.poll(() => getTestState(page)).toBe('playing');
        await page.keyboard.press('Escape');
        await expect.poll(() => getTestState(page)).toBe('paused');
        await page.screenshot({ path: path.join(shotsDir, 'pause.png'), fullPage: true });

        const fontReady = await page.evaluate(async () => {
            const fonts = document.fonts;
            if (!fonts?.load) return true;
            await fonts.load('12px "Press Start 2P"');
            return fonts.check('12px "Press Start 2P"');
        });
        expect(fontReady).toBe(true);
    });
});
