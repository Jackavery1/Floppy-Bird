import { GAME_CONFIG } from './config.js';

export function loadTrainingEnabled() {
    try {
        return localStorage.getItem(GAME_CONFIG.storage.training) === '1';
    } catch {
        return false;
    }
}

export function saveTrainingEnabled(enabled) {
    try {
        localStorage.setItem(GAME_CONFIG.storage.training, enabled ? '1' : '0');
    } catch { /* quota */ }
}
