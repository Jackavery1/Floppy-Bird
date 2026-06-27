import { GAME_CONFIG } from './config.js';
import { SOUND } from './config.js';

const VOLUME_STEPS = [1, 0.5, 0.25, 0];

let audioCtx = null;
let audioUnavailable = false;

function getAudioContextClass() {
    return globalThis.AudioContext || globalThis.webkitAudioContext;
}

function getAudioContext() {
    if (audioUnavailable) return null;
    if (!audioCtx) {
        try {
            const AudioCtx = getAudioContextClass();
            if (!AudioCtx) {
                audioUnavailable = true;
                return null;
            }
            audioCtx = new AudioCtx();
        } catch {
            audioUnavailable = true;
            return null;
        }
    }
    return audioCtx;
}

export function isAudioAvailable() {
    return !audioUnavailable && getAudioContextClass() != null;
}

function readStoredVolume() {
    try {
        return localStorage.getItem(GAME_CONFIG.storage.volume)
            ?? localStorage.getItem(GAME_CONFIG.storage.volumeLegacy);
    } catch {
        return null;
    }
}

export function getVolume() {
    if (isMuted()) return 0;
    const raw = readStoredVolume();
    const n = Number.parseFloat(raw ?? '');
    if (Number.isFinite(n) && n >= 0 && n <= 1) return n;
    return 1;
}

export function setVolume(level) {
    try {
        localStorage.setItem(GAME_CONFIG.storage.volume, String(level));
        if (level > 0) setMuted(false);
        else setMuted(true);
    } catch { /* quota */ }
}

export function isMuted() {
    try {
        return localStorage.getItem(GAME_CONFIG.storage.muted) === '1';
    } catch {
        return false;
    }
}

export function setMuted(muted) {
    try {
        localStorage.setItem(GAME_CONFIG.storage.muted, muted ? '1' : '0');
    } catch { /* quota */ }
}

function effectiveGain(peak) {
    return peak * getVolume();
}

/** Cycle 100 % → 50 % → 25 % → muet. */
export function cycleSoundLevel() {
    if (!isAudioAvailable()) return;
    const current = getVolume();
    const idx = VOLUME_STEPS.indexOf(current);
    const next = VOLUME_STEPS[(idx + 1) % VOLUME_STEPS.length];
    if (next === 0) {
        setMuted(true);
        setVolume(0);
    } else {
        setMuted(false);
        setVolume(next);
    }
}

export function formatSoundLabel() {
    if (!isAudioAvailable()) return 'indisponible';
    if (isMuted() || getVolume() === 0) return 'OFF';
    return `${Math.round(getVolume() * 100)} %`;
}

export function resumeAudio() {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        if (ctx.state === 'suspended') {
            return ctx.resume();
        }
    } catch {
        audioUnavailable = true;
    }
}

export function playSound(soundName, score = 1) {
    if (getVolume() === 0) return;
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();
        switch (soundName) {
            case SOUND.JUMP:      playJump(ctx);           break;
            case SOUND.SCORE:     playScore(ctx, score);   break;
            case SOUND.GAME_OVER: playGameOver(ctx);       break;
            case SOUND.GROUND:    playGround(ctx);         break;
        }
    } catch {
        audioUnavailable = true;
    }
}

function playTone(ctx, { type = 'sine', duration, peakGain, freqAt, freqRamp, delay = 0 }) {
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    if (freqRamp != null) {
        osc.frequency.setValueAtTime(freqAt, t);
        osc.frequency.exponentialRampToValueAtTime(freqRamp, t + duration);
    } else {
        osc.frequency.value = freqAt;
    }
    gain.gain.setValueAtTime(effectiveGain(peakGain), t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.start(t);
    osc.stop(t + duration);
}

function playJump(ctx) {
    playTone(ctx, { freqAt: 440, freqRamp: 880, duration: 0.08, peakGain: 0.2 });
}

function playScore(ctx, score = 1) {
    const boost = Math.min(score, 25) * 12;
    playTone(ctx, { freqAt: 660 + boost, duration: 0.15, peakGain: 0.3 });
    playTone(ctx, { freqAt: 880 + boost, duration: 0.15, peakGain: 0.3, delay: 0.06 });
}

function playGameOver(ctx) {
    playTone(ctx, { type: 'triangle', freqAt: 420, freqRamp: 90, duration: 0.22, peakGain: 0.35 });
}

function playGround(ctx) {
    playTone(ctx, { freqAt: 95, freqRamp: 45, duration: 0.12, peakGain: 0.5 });
}
