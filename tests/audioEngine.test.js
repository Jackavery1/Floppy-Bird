import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

function createMockContext() {
    const gainNode = {
        gain: { value: 0 },
        connect: vi.fn(),
        context: null,
    };
    const ctx = {
        state: 'running',
        destination: {},
        resume: vi.fn().mockResolvedValue(undefined),
        createGain: vi.fn(() => {
            const node = { ...gainNode, context: ctx };
            return node;
        }),
    };
    gainNode.context = ctx;
    return ctx;
}

describe('audioEngine', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('getAudioContext retourne null sans AudioContext', async () => {
        vi.stubGlobal('AudioContext', undefined);
        vi.stubGlobal('webkitAudioContext', undefined);
        const { getAudioContext, isAudioAvailable } = await import('../src/audioEngine.js');

        expect(getAudioContext()).toBeNull();
        expect(isAudioAvailable()).toBe(false);
    });

    it('getAudioContext crée le contexte et le nœud master', async () => {
        const mockCtx = createMockContext();
        vi.stubGlobal(
            'AudioContext',
            vi.fn(() => mockCtx)
        );
        const { getAudioContext, getMasterNode } = await import('../src/audioEngine.js');

        const ctx = getAudioContext();
        expect(ctx).toBe(mockCtx);
        expect(mockCtx.createGain).toHaveBeenCalled();
        expect(getMasterNode(ctx).connect).toHaveBeenCalledWith(mockCtx.destination);
    });

    it('getAudioContext marque indisponible si la création échoue', async () => {
        vi.stubGlobal(
            'AudioContext',
            vi.fn(() => {
                throw new Error('blocked');
            })
        );
        const { getAudioContext, isAudioAvailable } = await import('../src/audioEngine.js');

        expect(getAudioContext()).toBeNull();
        expect(isAudioAvailable()).toBe(false);
    });

    it('getMasterNode recrée le gain si le contexte change', async () => {
        const mockCtxA = createMockContext();
        const mockCtxB = createMockContext();
        vi.stubGlobal(
            'AudioContext',
            vi.fn(() => mockCtxA)
        );
        const { getAudioContext, getMasterNode } = await import('../src/audioEngine.js');

        getAudioContext();
        const first = getMasterNode(mockCtxA);
        const second = getMasterNode(mockCtxB);

        expect(second).not.toBe(first);
        expect(mockCtxB.createGain).toHaveBeenCalled();
    });

    it('resumeAudio reprend un contexte suspendu', async () => {
        const mockCtx = createMockContext();
        mockCtx.state = 'suspended';
        vi.stubGlobal(
            'AudioContext',
            vi.fn(() => mockCtx)
        );
        const { getAudioContext, resumeAudio } = await import('../src/audioEngine.js');

        getAudioContext();
        await resumeAudio();

        expect(mockCtx.resume).toHaveBeenCalled();
    });

    it('resumeAudio ignore un contexte déjà actif', async () => {
        const mockCtx = createMockContext();
        vi.stubGlobal(
            'AudioContext',
            vi.fn(() => mockCtx)
        );
        const { getAudioContext, resumeAudio } = await import('../src/audioEngine.js');

        getAudioContext();
        await resumeAudio();

        expect(mockCtx.resume).not.toHaveBeenCalled();
    });

    it('resumeAudio marque indisponible si resume lève une erreur synchrone', async () => {
        const mockCtx = createMockContext();
        mockCtx.state = 'suspended';
        mockCtx.resume.mockImplementation(() => {
            throw new Error('gesture required');
        });
        vi.stubGlobal(
            'AudioContext',
            vi.fn(() => mockCtx)
        );
        const { getAudioContext, resumeAudio, isAudioAvailable } =
            await import('../src/audioEngine.js');

        getAudioContext();
        resumeAudio();

        expect(isAudioAvailable()).toBe(false);
    });

    it('markAudioUnavailable bloque les appels suivants', async () => {
        const mockCtx = createMockContext();
        const Ctx = vi.fn(() => mockCtx);
        vi.stubGlobal('AudioContext', Ctx);
        const { getAudioContext, markAudioUnavailable } = await import('../src/audioEngine.js');

        getAudioContext();
        markAudioUnavailable();

        expect(getAudioContext()).toBeNull();
        expect(Ctx).toHaveBeenCalledTimes(1);
    });

    it('effectiveGain applique le volume courant', async () => {
        vi.stubGlobal('localStorage', {
            getItem: vi.fn(() => null),
            setItem: vi.fn(),
        });
        const { effectiveGain } = await import('../src/audioEngine.js');

        expect(effectiveGain(0.5)).toBe(0.5);
    });

    it('connectGain branche le gain sur le master', async () => {
        const mockCtx = createMockContext();
        vi.stubGlobal(
            'AudioContext',
            vi.fn(() => mockCtx)
        );
        const { getAudioContext, connectGain } = await import('../src/audioEngine.js');
        const gain = { connect: vi.fn() };

        getAudioContext();
        connectGain(mockCtx, gain);

        expect(gain.connect).toHaveBeenCalled();
    });
});
