import { DEPTH } from '../shared/uiLayout.js';

/** @param {import('phaser').GameObjects.GameObject[] | undefined} section @param {boolean} visible */
export function setOptionsSectionVisible(section, visible) {
    if (!section?.length) return;
    for (const el of section) {
        el?.setVisible?.(visible);
        if (!visible) el?.setAlpha?.(1);
    }
}

/**
 * Conteneur Phaser pour un onglet Options — masquage atomique de toute la section.
 * @param {import('../core/ui.js').UI} ui
 * @param {import('phaser').Scene} scene
 * @param {'_optionsControlsElements' | '_optionsSettingsElements'} sectionKey
 */
export function beginOptionsSection(ui, scene, sectionKey) {
    const container = scene.add.container(0, 0);
    container.setDepth(DEPTH.PANEL_FRAME);
    container.setVisible(false);
    ui._optionsPanelRoot?.add(container);

    const section = (ui[sectionKey] = [container]);
    ui._optionsPanelElements.push(container);

    return {
        container,
        /** @param {...import('phaser').GameObjects.GameObject} objs */
        add(...objs) {
            container.add(...objs);
            for (const obj of objs) section.push(obj);
        },
    };
}
