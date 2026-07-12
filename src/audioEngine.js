import { getVolume } from './audioVolume.js';

const MASTER_GAIN = 0.82;

let audioCtx = null;
let audioUnavailable = false;
let masterNode = null;

function getAudioContextClass() {
    return globalThis.AudioContext || globalThis.webkitAudioContext;
}

export function getAudioContext() {
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

export function getMasterNode(ctx) {
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

export function markAudioUnavailable() {
    audioUnavailable = true;
}

export function effectiveGain(peak) {
    return peak * getVolume();
}

export function connectGain(ctx, gain) {
    gain.connect(getMasterNode(ctx));
}

export function resumeAudio() {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        if (ctx.state === 'suspended') {
            return ctx.resume();
        }
    } catch {
        markAudioUnavailable();
    }
}
