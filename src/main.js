import '../style.css';
import '../style-pwa.css';
import Phaser from 'phaser';
import { initGame, showBootFailure } from './phaserBootstrap.js';
import { ensureTitleFontLoaded, onGameReady } from './appBootstrap.js';
import { initPwaInstall } from './pwaInstall.js';

initPwaInstall();

(async () => {
    try {
        await ensureTitleFontLoaded();
        initGame(Phaser, onGameReady);
    } catch (err) {
        showBootFailure(err);
    }
})();
