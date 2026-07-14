import { test, expect } from '@playwright/test';
import { startPlayingFromMenu, waitForGameReady, projectUsesTouch } from './helpers/gameCoords.mjs';
import { probeAudio, probeHaptics, waitForTestSeamReady } from './helpers/testSeam.mjs';

test.describe('audio smoke', () => {
    test('playSound ne marque pas l’audio indisponible', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await waitForTestSeamReady(page);
        const usesTouch = projectUsesTouch(testInfo);
        await startPlayingFromMenu(page, usesTouch);

        const result = await probeAudio(page);
        expect(result?.available).toBe(true);
    });

    test('haptics ne lève pas si vibrate absent', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium-desktop', 'desktop uniquement');
        await waitForGameReady(page);
        await waitForTestSeamReady(page);

        const result = await probeHaptics(page);
        expect(result).toMatchObject({ supported: expect.any(Boolean) });
    });
});
