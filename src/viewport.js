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

export function getViewportDimensions() {
    if (typeof window === 'undefined') {
        return { width: 0, height: 0 };
    }
    const vv = window.visualViewport;
    if (vv) {
        return { width: vv.width, height: vv.height };
    }
    return { width: window.innerWidth, height: window.innerHeight };
}
