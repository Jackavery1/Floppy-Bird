import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildMuteControls } from '../src/uiMenuOptionsMute.js';
import { UI } from '../src/ui.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';
import { cycleSoundLevel, formatSoundLabel, isAudioAvailable } from '../src/audio.js';
import { bindAccessibilityAction } from '../src/uiDomAccessibilityControls.js';

vi.mock('../src/audio.js', () => ({
    cycleSoundLevel: vi.fn(),
    formatSoundLabel: vi.fn(() => '100 %'),
    isAudioAvailable: vi.fn(() => true),
}));

vi.mock('../src/uiDomAccessibilityControls.js', () => ({
    bindAccessibilityAction: vi.fn(),
    bindUnifiedInteractiveFocus: vi.fn(() => ({
        attachHit: vi.fn(),
    })),
}));

describe('uiMenuOptionsMute', () => {
    let scene;
    let ui;
    let added;

    beforeEach(() => {
        vi.mocked(isAudioAvailable).mockReturnValue(true);
        vi.mocked(formatSoundLabel).mockReturnValue('100 %');
        scene = createBaseScene({ round: createRoundState() });
        ui = new UI(scene);
        added = [];
        buildMuteControls(ui, (...objs) => added.push(...objs), 200);
    });

    it('affiche le libellé son avec icône', () => {
        expect(ui._muteText).toBeTruthy();
        const textCall = scene.add.text.mock.calls.find(([, , content]) =>
            String(content).includes('SON')
        );
        expect(textCall?.[2]).toBe('🔊 SON · 100 %');
        expect(ui._muteHit.setInteractive).toHaveBeenCalled();
    });

    it('cycle le volume au clic quand l’audio est disponible', () => {
        const handlers = ui._muteHit.on.mock.calls.filter(([event]) => event === 'pointerdown');
        expect(handlers.length).toBeGreaterThan(0);
        handlers[0][1](null, null, null, { stopPropagation: vi.fn() });
        expect(cycleSoundLevel).toHaveBeenCalled();
        expect(ui._muteText.setText).toHaveBeenCalledWith('🔊 SON · 100 %');
        expect(bindAccessibilityAction).toHaveBeenCalledWith('menuMute', expect.any(Function));
    });

    it('invoke le callback a11y menuMute', () => {
        const bindCall = vi
            .mocked(bindAccessibilityAction)
            .mock.calls.find(([key]) => key === 'menuMute');
        expect(bindCall).toBeTruthy();
        bindCall[1]();
        expect(cycleSoundLevel).toHaveBeenCalled();
    });

    it('n’active pas l’interaction quand l’audio est indisponible', () => {
        vi.mocked(isAudioAvailable).mockReturnValue(false);
        vi.mocked(formatSoundLabel).mockReturnValue('indisponible');
        const localScene = createBaseScene({ round: createRoundState() });
        const localUi = new UI(localScene);
        buildMuteControls(localUi, () => {}, 200);
        const textCall = localScene.add.text.mock.calls.find(([, , content]) =>
            String(content).includes('SON')
        );
        expect(textCall?.[2]).toBe('🔈 SON · indisponible');
        expect(localUi._muteHit.setInteractive).not.toHaveBeenCalled();
    });
});
