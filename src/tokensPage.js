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
    renderSpacing(root);
    renderCssVars(root);
}

if (typeof document !== 'undefined' && document.getElementById('tokens-app')) {
    mountTokensPage();
}
