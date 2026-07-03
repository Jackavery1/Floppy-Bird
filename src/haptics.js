export function hapticLight() {
    try {
        navigator.vibrate?.(12);
    } catch {
        /* non pris en charge */
    }
}

export function hapticMedium() {
    try {
        navigator.vibrate?.(28);
    } catch {
        /* non pris en charge */
    }
}
