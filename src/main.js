import Phaser from 'phaser';
import { initGame } from './phaserBootstrap.js';
import { onGameReady } from './appBootstrap.js';

initGame(Phaser, onGameReady);
