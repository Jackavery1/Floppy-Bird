setTimeout(function () {
    var el = document.getElementById('loading');
    if (el && !el.classList.contains('hidden')) {
        el.innerHTML =
            'Impossible de charger le jeu.<br><br>' +
            'Recharge la page. Si le problème continue : WebGL/Canvas indisponible, ' +
            'ou en local utilise <strong>npm run dev</strong> (pas Live Server).<br>' +
            'Après build : <strong>npm run preview</strong>.';
    }
}, 6000);
