import { SOUND } from './config.js';
import {
    getVolume,
    cycleSoundLevel as cycleVolumeLevel,
    formatSoundLabel as formatVolumeLabel,
} from './audioVolume.js';
import {
    getAudioContext,
    isAudioAvailable,
    markAudioUnavailable,
    resumeAudio,
} from './audioEngine.js';
import { playGameOver, playGround, playJump, playScore } from './audioSynthesis.js';

export { getVolume, setVolume, isMuted, setMuted } from './audioVolume.js';
export { isAudioAvailable, resumeAudio };

export function cycleSoundLevel() {
    if (!isAudioAvailable()) return;
    cycleVolumeLevel();
}

export function formatSoundLabel() {
    return formatVolumeLabel(isAudioAvailable());
}

export function playSound(soundName, score = 1) {
    if (getVolume() === 0) return;
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();
        switch (soundName) {
            case SOUND.JUMP:
                playJump(ctx);
                break;
            case SOUND.SCORE:
                playScore(ctx, score);
                break;
            case SOUND.GAME_OVER:
                playGameOver(ctx);
                break;
            case SOUND.GROUND:
                playGround(ctx);
                break;
        }
    } catch {
        markAudioUnavailable();
    }
}
