export function hapticLight() {
    try {
        navigator.vibrate?.(12);
    } catch { /* unsupported */ }
}

export function hapticMedium() {
    try {
        navigator.vibrate?.(28);
    } catch { /* unsupported */ }
}
