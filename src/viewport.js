export function readSafeAreaInsets() {
    if (typeof document === 'undefined') {
        return { top: 0, right: 0, bottom: 0, left: 0 };
    }
    const body = document.body;
    if (!body) return { top: 0, right: 0, bottom: 0, left: 0 };
    const cs = getComputedStyle(body);
    return {
        top: Number.parseFloat(cs.paddingTop) || 0,
        right: Number.parseFloat(cs.paddingRight) || 0,
        bottom: Number.parseFloat(cs.paddingBottom) || 0,
        left: Number.parseFloat(cs.paddingLeft) || 0,
    };
}

export function computeLetterboxSize(windowW, windowH, gameW, gameH, insets = null) {
    const safe = insets ?? { top: 0, right: 0, bottom: 0, left: 0 };
    const availW = Math.max(1, windowW - safe.left - safe.right);
    const availH = Math.max(1, windowH - safe.top - safe.bottom);
    const ratio = gameW / gameH;
    if (availW / availH > ratio) {
        return {
            width: Math.floor(availH * ratio),
            height: Math.floor(availH),
        };
    }
    return {
        width: Math.floor(availW),
        height: Math.floor(availW / ratio),
    };
}

/** Position fixed du conteneur jeu dans le visualViewport (letterbox centré). */
export function computeLetterboxPosition(
    viewportW,
    viewportH,
    targetW,
    targetH,
    offsetTop = 0,
    offsetLeft = 0
) {
    return {
        left: offsetLeft + Math.max(0, (viewportW - targetW) / 2),
        top: offsetTop + Math.max(0, (viewportH - targetH) / 2),
    };
}

export function getViewportDimensions() {
    if (typeof window === 'undefined') {
        return { width: 0, height: 0, offsetTop: 0, offsetLeft: 0 };
    }
    const vv = window.visualViewport;
    if (vv) {
        return {
            width: vv.width,
            height: vv.height,
            offsetTop: vv.offsetTop,
            offsetLeft: vv.offsetLeft,
        };
    }
    return {
        width: window.innerWidth,
        height: window.innerHeight,
        offsetTop: 0,
        offsetLeft: 0,
    };
}

/**
 * Espace utile pour le letterbox : client du body (padding safe-area déjà appliqué en CSS).
 * Retombe sur visualViewport si le DOM n’est pas prêt.
 */
export function getLetterboxViewport() {
    if (typeof document === 'undefined') {
        return getViewportDimensions();
    }
    const body = document.body;
    const vv = window.visualViewport;
    const offsetTop = vv?.offsetTop ?? 0;
    const offsetLeft = vv?.offsetLeft ?? 0;
    if (body?.clientWidth > 0 && body?.clientHeight > 0) {
        const vvWidth = vv?.width ?? body.clientWidth;
        const vvHeight = vv?.height ?? body.clientHeight;
        return {
            width: Math.min(body.clientWidth, vvWidth),
            height: Math.min(body.clientHeight, vvHeight),
            offsetTop,
            offsetLeft,
        };
    }
    const dims = getViewportDimensions();
    const insets = readSafeAreaInsets();
    return {
        width: Math.max(1, dims.width - insets.left - insets.right),
        height: Math.max(1, dims.height - insets.top - insets.bottom),
        offsetTop: dims.offsetTop + insets.top,
        offsetLeft: dims.offsetLeft + insets.left,
    };
}
