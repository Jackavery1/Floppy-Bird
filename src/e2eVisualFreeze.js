let backgroundFrozen = false;

/** @param {boolean} [freeze] */
export function setE2eBackgroundFrozen(freeze = true) {
    backgroundFrozen = freeze;
}

export function isE2eBackgroundFrozen() {
    return backgroundFrozen;
}
