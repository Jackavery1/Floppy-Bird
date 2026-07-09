import { DEPTH } from './uiLayout.js';

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
 * @param {import('./ui.js').UI} ui
 * @param {import('phaser').Scene} scene
 * @param {import('phaser').GameObjects.GameObject[]} elements
 * @param {'_optionsControlsElements' | '_optionsSettingsElements'} sectionKey
 */
export function beginOptionsSection(ui, scene, elements, sectionKey) {
    const container = scene.add.container(0, 0);
    container.setDepth(DEPTH.PANEL_FRAME);
    container.setVisible(false);

    const section = (ui[sectionKey] = [container]);
    elements.push(container);
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
