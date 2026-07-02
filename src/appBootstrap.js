import { GAME_CONFIG } from './config.js';
import { installTestSeam } from './testSeam.js';
import { computeLetterboxSize, getLetterboxViewport } from './viewport.js';

export function resizeGameCanvas(game) {
    const canvas = game?.canvas;
    if (!canvas) return null;

    const { width: windowW, height: windowH, offsetTop, offsetLeft } = getLetterboxViewport();
    const { width: targetW, height: targetH } = computeLetterboxSize(
        windowW,
        windowH,
        GAME_CONFIG.width,
        GAME_CONFIG.height,
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
    installTestSeam(game);
    hideLoadingScreen(doc);
}
