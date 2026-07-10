import { GAME_CONFIG } from './config.js';
import { syncShellTheme } from './shellTheme.js';
import { initAccessibilityLayer, syncAccessibilityLayer } from './uiDomAccessibility.js';
import {
    computeLetterboxSize,
    computeLetterboxPosition,
    getLetterboxViewport,
} from './viewport.js';

/** Seam Playwright : dev ou build explicite `VITE_ENABLE_TEST_SEAM=true` (jamais Pages prod). */
export function shouldInstallTestSeam() {
    return import.meta.env.DEV || import.meta.env.VITE_ENABLE_TEST_SEAM === 'true';
}

function loadTestSeam(game) {
    if (typeof window === 'undefined' || !shouldInstallTestSeam()) return;
    import('./testSeam.js').then(({ installTestSeam }) => installTestSeam(game));
}

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function ensureTitleFontLoaded(doc = document) {
    const fonts = doc?.fonts;
    if (!fonts?.load) return;
    await Promise.race([
        Promise.all([
            fonts.load('12px "Press Start 2P"'),
            fonts.load('16px "Press Start 2P"'),
            fonts.ready,
        ]),
        wait(1500),
    ]);
}

export function resizeGameCanvas(game) {
    const canvas = game?.canvas;
    if (!canvas) return null;

    const { width: windowW, height: windowH, offsetTop, offsetLeft } = getLetterboxViewport();
    const { width: targetW, height: targetH } = computeLetterboxSize(
        windowW,
        windowH,
        GAME_CONFIG.width,
        GAME_CONFIG.height
    );

    canvas.width = GAME_CONFIG.width;
    canvas.height = GAME_CONFIG.height;
    canvas.style.width = `${targetW}px`;
    canvas.style.height = `${targetH}px`;

    const container = canvas.parentElement;
    if (container) {
        const { left, top } = computeLetterboxPosition(
            windowW,
            windowH,
            targetW,
            targetH,
            offsetTop,
            offsetLeft
        );
        container.style.position = 'fixed';
        container.style.left = `${left}px`;
        container.style.top = `${top}px`;
        container.style.width = `${targetW}px`;
        container.style.height = `${targetH}px`;
        container.style.marginTop = '';
        container.style.marginLeft = '';
    }

    if (game) syncAccessibilityLayer(game);

    return { targetW, targetH, offsetTop, offsetLeft };
}

export function hideLoadingScreen(doc = document) {
    doc.getElementById('loading')?.classList.add('hidden');
    doc.documentElement?.classList.add('game-ready');
}

function attachViewportResize(game, resizeFn = resizeGameCanvas) {
    const handler = () => resizeFn(game);
    window.addEventListener('resize', handler);
    const vv = window.visualViewport;
    vv?.addEventListener('resize', handler);
    vv?.addEventListener('scroll', handler);
    if (vv && 'onscrollend' in vv) {
        vv.addEventListener('scrollend', handler);
    }
    return handler;
}

export function onGameReady(game, { resizeFn = resizeGameCanvas, doc = document } = {}) {
    const canvas = game?.canvas;
    if (canvas?.setAttribute) {
        canvas.setAttribute('tabindex', '0');
        canvas.setAttribute('role', 'application');
        canvas.setAttribute('aria-label', 'Floppy Bird — espace ou toucher pour jouer');
    }
    initAccessibilityLayer(doc);
    syncShellTheme(doc);
    resizeFn(game);
    attachViewportResize(game, resizeFn);
    loadTestSeam(game);
    hideLoadingScreen(doc);
}
