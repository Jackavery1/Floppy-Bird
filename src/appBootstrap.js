import { GAME_CONFIG } from './config.js';
import { computeLetterboxSize, getLetterboxViewport } from './viewport.js';

/** Seam Playwright : dev ou build explicite `VITE_ENABLE_TEST_SEAM=true` (jamais Pages prod). */
export function shouldInstallTestSeam() {
    return import.meta.env.DEV || import.meta.env.VITE_ENABLE_TEST_SEAM === 'true';
}

function loadTestSeam(game) {
    if (typeof window === 'undefined' || !shouldInstallTestSeam()) return;
    import('./testSeam.js').then(({ installTestSeam }) => installTestSeam(game));
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
        container.style.marginTop = `${offsetTop}px`;
        container.style.marginLeft = `${offsetLeft}px`;
    }

    return { targetW, targetH, offsetTop, offsetLeft };
}

export function hideLoadingScreen(doc = document) {
    doc.getElementById('loading')?.classList.add('hidden');
    doc.documentElement?.classList.add('game-ready');
}

export function attachViewportResize(game, resizeFn = resizeGameCanvas) {
    const handler = () => resizeFn(game);
    window.addEventListener('resize', handler);
    const vv = window.visualViewport;
    vv?.addEventListener('resize', handler);
    vv?.addEventListener('scroll', handler);
    return handler;
}

export function onGameReady(game, { resizeFn = resizeGameCanvas, doc = document } = {}) {
    resizeFn(game);
    attachViewportResize(game, resizeFn);
    loadTestSeam(game);
    hideLoadingScreen(doc);
}
