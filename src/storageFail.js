/** Flag session : une écriture localStorage a échoué (quota, private mode…). */
let storageWriteFailed = false;

export function noteStorageWriteFailure() {
    storageWriteFailed = true;
}

/** @returns {boolean} true une seule fois après un échec d’écriture. */
export function consumeStorageWriteFailure() {
    if (!storageWriteFailed) return false;
    storageWriteFailed = false;
    return true;
}
