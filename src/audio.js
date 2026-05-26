import { GAME_CONFIG } from './config.js';
import { SOUND } from './gameConstants.js';

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

export function getVolume() {
    if (isMuted()) return 0;
    try {
        const raw = localStorage.getItem(GAME_CONFIG.storage.volume);
        const n = Number.parseFloat(raw ?? '');
        if (Number.isFinite(n) && n >= 0 && n <= 1) return n;
    } catch { /* quota */ }
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
    if (!isAudioAvailable()) return { volume: 0, label: 'indisponible' };
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
    return { volume: getVolume(), label: formatSoundLabel() };
}

export function formatSoundLabel() {
    if (!isAudioAvailable()) return 'indisponible';
    if (isMuted() || getVolume() === 0) return 'OFF';
    return `${Math.round(getVolume() * 100)} %`;
}

export function toggleMuted() {
    if (!isAudioAvailable()) return false;
    if (isMuted() || getVolume() === 0) {
        setMuted(false);
        setVolume(1);
    } else {
        setMuted(true);
    }
    return !isMuted();
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

export function playSound(soundName) {
    if (getVolume() === 0) return;
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();
        switch (soundName) {
            case SOUND.JUMP:      playJump(ctx);      break;
            case SOUND.SCORE:     playScore(ctx);     break;
            case SOUND.GAME_OVER: playGameOver(ctx);  break;
            case SOUND.GROUND:    playGround(ctx);    break;
        }
    } catch {
        audioUnavailable = true;
    }
}

function playJump(ctx) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(effectiveGain(0.2), ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
}

function playScore(ctx) {
    [{ delay: 0, freq: 660 }, { delay: 0.06, freq: 880 }].forEach(note => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = note.freq;
        gain.gain.setValueAtTime(effectiveGain(0.3), ctx.currentTime + note.delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.delay + 0.15);
        osc.start(ctx.currentTime + note.delay);
        osc.stop(ctx.currentTime + note.delay + 0.15);
    });
}

function playGameOver(ctx) {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.22);
    gain.gain.setValueAtTime(effectiveGain(0.35), t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc.start(t);
    osc.stop(t + 0.22);
}

function playGround(ctx) {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(95, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    gain.gain.setValueAtTime(effectiveGain(0.5), t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.start(t);
    osc.stop(t + 0.12);
}
