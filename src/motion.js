export function prefersReducedMotion() {
    if (typeof matchMedia === 'undefined') return false;
    return matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function sceneTween(scene, config) {
    if (prefersReducedMotion()) {
        return scene.tweens.add({
            ...config,
            duration: 0,
            repeat: 0,
            delay: 0,
            yoyo: false,
        });
    }
    return scene.tweens.add(config);
}
