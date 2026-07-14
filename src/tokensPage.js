import { DESIGN_TOKENS } from './designTokens.js';
import { MIN_TOUCH, MIN_CTA_TOUCH, SPACING } from './uiLayoutConstants.js';
import { syncShellTheme } from './shellTheme.js';

/** @param {unknown} value */
export function isHexColor(value) {
    return typeof value === 'string' && value.startsWith('#');
}

/** @param {Record<string, unknown>} tokens */
export function listColorTokens(tokens) {
    return Object.entries(tokens).filter(([, value]) => isHexColor(value));
}

/** @param {HTMLElement} root */
function renderColorGrid(root) {
    const section = document.createElement('section');
    section.className = 'tokens-section';
    section.innerHTML = '<h2>Palette</h2>';
    const grid = document.createElement('div');
    grid.className = 'tokens-grid';

    for (const [name, hex] of listColorTokens(DESIGN_TOKENS)) {
        const card = document.createElement('article');
        card.className = 'tokens-swatch';
        card.title = `Copier ${hex}`;
        card.tabIndex = 0;
        card.innerHTML = `
            <div class="tokens-swatch-color" style="background:${hex}"></div>
            <div class="tokens-swatch-meta">
                <strong>${name}</strong>
                <code>${hex}</code>
            </div>`;
        const copy = () => navigator.clipboard?.writeText(String(hex));
        card.addEventListener('click', copy);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                copy();
            }
        });
        grid.appendChild(card);
    }

    section.appendChild(grid);
    root.appendChild(section);
}

/** @param {HTMLElement} root */
function renderTypography(root) {
    const section = document.createElement('section');
    section.className = 'tokens-section';
    section.innerHTML = '<h2>Typographie</h2>';

    const samples = [
        {
            label: 'Titre arcade — policeTitre',
            className: 'tokens-type-title',
            text: 'FLOPPY BIRD',
        },
        {
            label: 'HUD in-game — policeInterface bold + contour',
            className: 'tokens-type-hud',
            text: 'Score 42',
        },
        {
            label: 'Corps menu — policeInterface',
            className: 'tokens-type-menu',
            text: 'APPUYER POUR JOUER',
        },
        {
            label: 'CTA jaune — texteBoutonJaune sur accent',
            className: 'tokens-type-cta',
            text: 'REJOUER',
        },
    ];

    for (const sample of samples) {
        const block = document.createElement('div');
        block.className = 'tokens-type-sample';
        block.innerHTML = `<div class="tokens-type-label">${sample.label}</div>`;
        const text = document.createElement('div');
        text.className = sample.className;
        text.textContent = sample.text;
        block.appendChild(text);
        section.appendChild(block);
    }

    root.appendChild(section);
}

/** États UI documentés pour la galerie tokens (référence visuelle, pas le canvas Phaser). */
export const UI_STATE_GALLERY = Object.freeze([
    {
        id: 'menu',
        title: 'Menu principal',
        description: 'Titre arcade, CTA 48 px, rangée difficulté, actions secondaires.',
    },
    {
        id: 'playing',
        title: 'Partie en cours',
        description:
            'Score HUD, bouton pause 48 px, zone saut tactile centrale. Primitives : uiPhaserComponents.js.',
    },
    {
        id: 'pause',
        title: 'Pause',
        description: 'Overlay semi-transparent, Reprendre et Retour menu.',
    },
    {
        id: 'gameover',
        title: 'Game over',
        description: 'Panneau score, record, CTA REJOUER 48 px.',
    },
]);

/** @param {HTMLElement} root */
function renderUiStatesGallery(root) {
    const section = document.createElement('section');
    section.className = 'tokens-section';
    section.innerHTML =
        '<h2>États UI jeu (référence)</h2><p class="tokens-type-label">Aperçu shell + design system Phaser (<code>uiPhaserComponents.js</code>) — snapshots e2e : menu, pause, game over.</p>';

    const grid = document.createElement('div');
    grid.className = 'tokens-ui-grid';

    for (const state of UI_STATE_GALLERY) {
        const card = document.createElement('article');
        card.className = `tokens-ui-card tokens-ui-card--${state.id}`;
        card.innerHTML = `
            <div class="tokens-ui-preview" aria-hidden="true"></div>
            <div class="tokens-ui-meta">
                <strong>${state.title}</strong>
                <p>${state.description}</p>
            </div>`;
        grid.appendChild(card);
    }

    section.appendChild(grid);
    root.appendChild(section);
}

/** @param {HTMLElement} root */
function renderSpacing(root) {
    const section = document.createElement('section');
    section.className = 'tokens-section';
    section.innerHTML = '<h2>Spacing & cibles tactiles</h2>';

    for (const [name, px] of Object.entries(SPACING)) {
        if (name === 'unit' || name === 'touch') continue;
        const row = document.createElement('div');
        row.className = 'tokens-spacing-row';
        row.innerHTML = `<span>${name}</span><div class="tokens-spacing-bar" style="width:${px}px"></div><code>${px}px</code>`;
        section.appendChild(row);
    }

    const touch = document.createElement('p');
    touch.className = 'tokens-type-label';
    touch.textContent = `MIN_TOUCH = ${MIN_TOUCH}px · MIN_CTA_TOUCH = ${MIN_CTA_TOUCH}px (CTA primaires)`;
    section.appendChild(touch);

    root.appendChild(section);
}

/** @param {HTMLElement} root */
function renderCssVars(root) {
    const section = document.createElement('section');
    section.className = 'tokens-section';
    section.innerHTML = '<h2>Variables CSS shell (:root)</h2>';
    const list = document.createElement('div');
    list.className = 'tokens-vars';
    const styles = getComputedStyle(document.documentElement);
    for (const name of [
        '--couleur-fond',
        '--couleur-accent',
        '--couleur-texte-hint',
        '--police-interface',
        '--police-titre',
        '--spacing-md',
        '--spacing-xl',
    ]) {
        const row = document.createElement('div');
        row.innerHTML = `<code>${name}</code> → ${styles.getPropertyValue(name).trim()}`;
        list.appendChild(row);
    }
    section.appendChild(list);
    root.appendChild(section);
}

function bindThemeToggle() {
    const night = document.getElementById('theme-night');
    const day = document.getElementById('theme-day');
    const apply = (theme) => {
        document.documentElement.dataset.theme = theme;
        night?.setAttribute('aria-pressed', theme === 'night' ? 'true' : 'false');
        day?.setAttribute('aria-pressed', theme === 'day' ? 'true' : 'false');
        syncShellTheme();
    };
    night?.addEventListener('click', () => apply('night'));
    day?.addEventListener('click', () => apply('day'));
}

function mountTokensPage() {
    const root = document.getElementById('tokens-app');
    if (!root) return;
    syncShellTheme();
    bindThemeToggle();
    renderColorGrid(root);
    renderTypography(root);
    renderUiStatesGallery(root);
    renderSpacing(root);
    renderCssVars(root);
}

if (typeof document !== 'undefined' && document.getElementById('tokens-app')) {
    mountTokensPage();
}
