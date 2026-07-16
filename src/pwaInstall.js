/** CTA d’installation PWA via beforeinstallprompt (Chrome / Edge / Android). */

/** @typedef {Event & { prompt: () => Promise<void>, userChoice: Promise<{ outcome: string }> }} BeforeInstallPromptEvent */

/** @type {BeforeInstallPromptEvent | null} */
let deferredPrompt = null;

/** @param {Window & typeof globalThis} [win] */
function isStandaloneDisplay(win = typeof window !== 'undefined' ? window : undefined) {
    if (!win) return false;
    if (win.matchMedia?.('(display-mode: standalone)').matches) return true;
    return /** @type {{ standalone?: boolean }} */ (win.navigator).standalone === true;
}

/** @param {Document} [doc] */
function installButton(doc = document) {
    return doc.getElementById('pwa-install');
}

/** @param {boolean} visible @param {Document} [doc] */
function setInstallVisible(visible, doc = document) {
    const btn = installButton(doc);
    if (!btn) return;
    btn.hidden = !visible;
    btn.setAttribute('aria-hidden', visible ? 'false' : 'true');
}

/**
 * @param {Document} [doc]
 * @param {Window & typeof globalThis} [win]
 */
export function syncPwaInstallVisibility(
    doc = document,
    win = typeof window !== 'undefined' ? window : undefined
) {
    setInstallVisible(Boolean(deferredPrompt) && !isStandaloneDisplay(win), doc);
}

/**
 * Branche le bouton #pwa-install et écoute beforeinstallprompt.
 * @param {Window & typeof globalThis} [win]
 * @param {Document} [doc]
 */
export function initPwaInstall(
    win = typeof window !== 'undefined' ? window : undefined,
    doc = typeof document !== 'undefined' ? document : undefined
) {
    if (!win || !doc) return () => {};
    const btn = installButton(doc);
    if (!btn || isStandaloneDisplay(win)) {
        setInstallVisible(false, doc);
        return () => {};
    }

    const onBeforeInstall = (event) => {
        event.preventDefault();
        deferredPrompt = /** @type {BeforeInstallPromptEvent} */ (event);
        syncPwaInstallVisibility(doc, win);
    };

    const onAppInstalled = () => {
        deferredPrompt = null;
        setInstallVisible(false, doc);
    };

    const onClick = async () => {
        if (!deferredPrompt) return;
        const promptEvent = deferredPrompt;
        deferredPrompt = null;
        setInstallVisible(false, doc);
        try {
            await promptEvent.prompt();
            await promptEvent.userChoice;
        } catch {
            /* prompt annulé ou indisponible */
        }
    };

    win.addEventListener('beforeinstallprompt', onBeforeInstall);
    win.addEventListener('appinstalled', onAppInstalled);
    btn.addEventListener('click', onClick);
    syncPwaInstallVisibility(doc, win);

    return () => {
        win.removeEventListener('beforeinstallprompt', onBeforeInstall);
        win.removeEventListener('appinstalled', onAppInstalled);
        btn.removeEventListener('click', onClick);
    };
}

/** Réinitialise l’état module (tests). */
export function resetPwaInstallStateForTests() {
    deferredPrompt = null;
}
