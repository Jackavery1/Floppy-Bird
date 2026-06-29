import { GAME_CONFIG } from './config.js';
import { computeLetterboxSize, getViewportDimensions, readSafeAreaInsets } from './viewport.js';

export function resizeGameCanvas(game) {
    const canvas = game?.canvas;
    if (!canvas) return null;

    const { width: windowW, height: windowH } = getViewportDimensions();
    const insets = readSafeAreaInsets();
    const { width: targetW, height: targetH } = computeLetterboxSize(
        windowW,
        windowH,
        GAME_CONFIG.width,
        GAME_CONFIG.height,
        insets,
    );

    canvas.width = GAME_CONFIG.width;
    canvas.height = GAME_CONFIG.height;
    canvas.style.width = `${targetW}px`;
    canvas.style.height = `${targetH}px`;
    return { targetW, targetH };
}

export function hideLoadingScreen(doc = document) {
    doc.getElementById('loading')?.classList.add('hidden');
    doc.documentElement?.classList.add('game-ready');
}

export function attachViewportResize(game, resizeFn = resizeGameCanvas) {
    const handler = () => resizeFn(game);
    window.addEventListener('resize', handler);
    window.visualViewport?.addEventListener('resize', handler);
    return handler;
}

export function onGameReady(game, { resizeFn = resizeGameCanvas, doc = document } = {}) {
    resizeFn(game);
    attachViewportResize(game, resizeFn);
    hideLoadingScreen(doc);
}
