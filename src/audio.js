import { SOUND, GAME_CONFIG } from './config.js';
import {
    getVolume,
    cycleSoundLevel as cycleVolumeLevel,
    formatSoundLabel as formatVolumeLabel,
} from './audioVolume.js';

export { getVolume, setVolume, isMuted, setMuted } from './audioVolume.js';

export function cycleSoundLevel() {
    if (!isAudioAvailable()) return;
    cycleVolumeLevel();
}

const MASTER_GAIN = 0.82;
const ATTACK_SEC = 0.008;

let audioCtx = null;
let audioUnavailable = false;
let masterNode = null;

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
            masterNode = audioCtx.createGain();
            masterNode.gain.value = MASTER_GAIN;
            masterNode.connect(audioCtx.destination);
        } catch {
            audioUnavailable = true;
            return null;
        }
    }
    return audioCtx;
}

function getMasterNode(ctx) {
    if (!masterNode || masterNode.context !== ctx) {
        masterNode = ctx.createGain();
        masterNode.gain.value = MASTER_GAIN;
        masterNode.connect(ctx.destination);
    }
    return masterNode;
}

export function isAudioAvailable() {
    return !audioUnavailable && getAudioContextClass() != null;
}

export function formatSoundLabel() {
    return formatVolumeLabel(isAudioAvailable());
}

function effectiveGain(peak) {
    return peak * getVolume();
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
        audioUnavailable = true;
    }
}

function connectGain(ctx, gain) {
    gain.connect(getMasterNode(ctx));
}

function playTone(ctx, { type = 'sine', duration, peakGain, freqAt, freqRamp, delay = 0 }) {
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    connectGain(ctx, gain);
    osc.type = type;
    if (freqRamp != null) {
        osc.frequency.setValueAtTime(freqAt, t);
        osc.frequency.exponentialRampToValueAtTime(freqRamp, t + duration);
    } else {
        osc.frequency.value = freqAt;
    }
    const peak = effectiveGain(peakGain);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(peak, t + ATTACK_SEC);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.start(t);
    osc.stop(t + duration);
}

function playNoise(ctx, { duration, peakGain, filterFreq = 420, delay = 0 }) {
    const t = ctx.currentTime + delay;
    const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = filterFreq;
    const gain = ctx.createGain();
    src.connect(filter);
    filter.connect(gain);
    connectGain(ctx, gain);
    const peak = effectiveGain(peakGain);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(peak, t + ATTACK_SEC);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    src.start(t);
    src.stop(t + duration);
}

function playJump(ctx) {
    playTone(ctx, { type: 'sine', freqAt: 380, freqRamp: 920, duration: 0.09, peakGain: 0.22 });
    playTone(ctx, {
        type: 'triangle',
        freqAt: 520,
        freqRamp: 780,
        duration: 0.05,
        peakGain: 0.08,
        delay: 0.02,
    });
}

function isScoreMilestone(score) {
    return score > 0 && score % 10 === 0;
}

function isStreakMilestone(score) {
    return GAME_CONFIG.round.streakMilestones.includes(score);
}

export function getScoreToneType(score) {
    const variants = ['sine', 'triangle', 'square'];
    return variants[score % variants.length];
}

function playScore(ctx, score = 1) {
    const boost = Math.min(score, 25) * 12;
    const primaryType = getScoreToneType(score);
    const detune = (score % 5) * 8;
    playTone(ctx, {
        type: primaryType,
        freqAt: 660 + boost + detune,
        duration: 0.15,
        peakGain: 0.3,
    });
    playTone(ctx, {
        type: score % 2 === 0 ? 'sine' : 'triangle',
        freqAt: 880 + boost + detune,
        duration: 0.12,
        peakGain: 0.26,
        delay: 0.06,
    });
    if (isScoreMilestone(score)) {
        const tier = Math.floor(score / 10);
        playTone(ctx, {
            type: 'square',
            freqAt: 520 + tier * 35,
            freqRamp: 1040 + tier * 35,
            duration: 0.22,
            peakGain: 0.28,
            delay: 0.1,
        });
    } else if (isStreakMilestone(score)) {
        const idx = GAME_CONFIG.round.streakMilestones.indexOf(score);
        playTone(ctx, {
            type: 'triangle',
            freqAt: 740 + idx * 40,
            freqRamp: 980 + idx * 40,
            duration: 0.18,
            peakGain: 0.24,
            delay: 0.08,
        });
    }
}

function playGameOver(ctx) {
    playTone(ctx, { type: 'triangle', freqAt: 440, freqRamp: 80, duration: 0.28, peakGain: 0.32 });
    playTone(ctx, {
        type: 'sine',
        freqAt: 220,
        freqRamp: 55,
        duration: 0.35,
        peakGain: 0.18,
        delay: 0.08,
    });
}

function playGround(ctx) {
    playNoise(ctx, { duration: 0.14, peakGain: 0.45, filterFreq: 320 });
    playTone(ctx, {
        type: 'sine',
        freqAt: 110,
        freqRamp: 55,
        duration: 0.1,
        peakGain: 0.22,
        delay: 0.02,
    });
}
