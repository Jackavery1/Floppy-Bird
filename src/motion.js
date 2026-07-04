export function prefersReducedMotion() {
    if (typeof matchMedia === 'undefined') return false;
    return matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function tweenEndValue(prop) {
    if (prop == null) return undefined;
    if (typeof prop === 'object' && 'to' in prop) return prop.to;
    return prop;
}

export function sceneTween(scene, config) {
    if (!prefersReducedMotion()) {
        return scene.tweens.add(config);
    }
    const { targets, onComplete, alpha, y, x, scaleX, scaleY, ...rest } = config;
    const list = Array.isArray(targets) ? targets : targets ? [targets] : [];
    const endAlpha = tweenEndValue(alpha);
    const endY = tweenEndValue(y);
    const endX = tweenEndValue(x);
    const endScaleX = tweenEndValue(scaleX);
    const endScaleY = tweenEndValue(scaleY);
    for (const target of list) {
        if (!target) continue;
        if (endAlpha !== undefined) target.setAlpha?.(endAlpha);
        if (endY !== undefined) target.setY?.(endY);
        if (endX !== undefined) target.setX?.(endX);
        if (endScaleX !== undefined) {
            target.setScale?.(endScaleX, endScaleY ?? endScaleX);
        }
    }
    onComplete?.();
    return scene.tweens.add({
        ...rest,
        targets,
        duration: 0,
        repeat: 0,
        delay: 0,
        yoyo: false,
    });
}

/** Secousse caméra — ignorée si `prefers-reduced-motion`. */
export function sceneCameraShake(camera, duration, intensity) {
    if (prefersReducedMotion() || !camera?.shake) return;
    camera.shake(duration, intensity);
}
