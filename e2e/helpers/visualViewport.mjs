/**
 * Mock visualViewport compatible Chromium et WebKit (patch in-place si l'objet existe).
 * @param {import('@playwright/test').Page} page
 * @param {{ width?: number, height?: number, offsetTop?: number, offsetLeft?: number, scale?: number }} props
 */
export async function mockVisualViewport(page, props = {}) {
    await page.evaluate((overrides) => {
        const noop = () => {};
        const base = {
            width: window.innerWidth,
            height: window.innerHeight,
            offsetTop: 0,
            offsetLeft: 0,
            scale: 1,
            addEventListener: noop,
            removeEventListener: noop,
        };
        const merged = { ...base, ...overrides };
        const vv = window.visualViewport;
        if (vv && typeof vv === 'object') {
            for (const [key, val] of Object.entries(merged)) {
                try {
                    Object.defineProperty(vv, key, {
                        configurable: true,
                        enumerable: true,
                        get: () => val,
                    });
                } catch {
                    // propriété non configurable — ignorer
                }
            }
            return;
        }
        Object.defineProperty(window, 'visualViewport', {
            configurable: true,
            value: merged,
        });
    }, props);
}

/** @param {import('@playwright/test').Page} page */
export async function dispatchViewportResize(page) {
    await page.evaluate(() => {
        window.dispatchEvent(new Event('resize'));
        window.visualViewport?.dispatchEvent?.(new Event('resize'));
    });
}

/**
 * Mesure centrage letterbox après mock visualViewport.
 * @param {import('@playwright/test').Page} page
 * @param {{ width: number, height: number, offsetTop?: number, offsetLeft?: number }} vv
 */
export async function readLetterboxMetrics(page, vv) {
    return page.evaluate((viewport) => {
        const canvas = document.querySelector('#game-container canvas');
        const container = document.getElementById('game-container');
        const box = canvas?.getBoundingClientRect();
        const cx = viewport.offsetLeft + viewport.width / 2;
        const cy = viewport.offsetTop + viewport.height / 2;
        const canvasCx = box ? box.left + box.width / 2 : 0;
        const canvasCy = box ? box.top + box.height / 2 : 0;
        return {
            top: parseFloat(getComputedStyle(container).top) || 0,
            canvasHeight: box?.height ?? 0,
            ratio: box && box.height > 0 ? box.width / box.height : 0,
            scale: window.visualViewport?.scale ?? 1,
            deltaX: Math.abs(canvasCx - cx),
            deltaY: Math.abs(canvasCy - cy),
        };
    }, vv);
}

/** @param {import('@playwright/test').Page} page */
export async function readJumpButtonAlignment(page) {
    return page.evaluate(() => {
        const canvas = document.querySelector('#game-container canvas')?.getBoundingClientRect();
        const jump = document.getElementById('a11y-jump')?.getBoundingClientRect();
        if (!canvas || !jump) return null;
        return {
            jumpW: jump.width,
            jumpH: jump.height,
            deltaX: Math.abs(jump.left + jump.width / 2 - (canvas.left + canvas.width / 2)),
            deltaY: Math.abs(jump.top + jump.height / 2 - (canvas.top + canvas.height / 2)),
        };
    });
}
