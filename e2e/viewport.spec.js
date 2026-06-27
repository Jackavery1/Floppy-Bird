import { test, expect } from '@playwright/test';

const GAME_W = 288;
const GAME_H = 512;

test.describe('jeu chargé', () => {
    test('affiche le canvas et masque le chargement', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('#loading')).toHaveClass(/hidden/, { timeout: 15_000 });
        await expect(page.locator('#game-container canvas')).toBeVisible();
    });

    test('respecte le ratio interne 288×512', async ({ page }) => {
        await page.goto('/');
        const canvas = page.locator('#game-container canvas');
        await expect(canvas).toBeVisible({ timeout: 15_000 });
        const box = await canvas.boundingBox();
        expect(box).not.toBeNull();
        expect(box.width / box.height).toBeCloseTo(GAME_W / GAME_H, 1);
    });

    test('affiche l’aide paysage en viewport mobile landscape', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-mobile-landscape', 'mobile landscape uniquement');
        await page.goto('/');
        await expect(page.locator('#landscape-hint')).toBeVisible({ timeout: 15_000 });
    });
});
