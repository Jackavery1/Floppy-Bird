/**
 * Déclenche beforeinstallprompt après initPwaInstall (post waitForGameReady).
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<{ promptCalls: () => Promise<number> }>}
 */
export async function mockBeforeInstallPrompt(page) {
    await page.evaluate(() => {
        window.__PWA_PROMPT_CALLS__ = 0;
        const event = new Event('beforeinstallprompt', { cancelable: true, bubbles: true });
        Object.defineProperty(event, 'prompt', {
            value: async () => {
                window.__PWA_PROMPT_CALLS__ += 1;
            },
            configurable: true,
        });
        Object.defineProperty(event, 'userChoice', {
            value: Promise.resolve({ outcome: 'accepted' }),
            configurable: true,
        });
        window.dispatchEvent(event);
    });
    return {
        promptCalls: () => page.evaluate(() => window.__PWA_PROMPT_CALLS__ ?? 0),
    };
}
