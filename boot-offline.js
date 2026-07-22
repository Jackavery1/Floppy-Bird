(function () {
    if (navigator.onLine !== false) return;
    if (navigator.serviceWorker && navigator.serviceWorker.controller) return;
    location.replace('offline.html');
})();
