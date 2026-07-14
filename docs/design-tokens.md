# Design tokens — Floppy Bird

Référence visuelle pour reprendre l’UI sans parcourir tout le code Phaser.

## Sources de vérité

| Couche | Fichier | Rôle |
|--------|---------|------|
| Jeu (Phaser) | `src/designTokens.js` | ~70 couleurs sémantiques + helpers typo (`hudTextStyle`, `menuTextStyle`, …) |
| Shell HTML | `style.css` (`:root`) | Fond, accent, polices, spacing CSS |
| Runtime | `src/shellTheme.js` | Sync tokens → CSS, `theme-color`, cycle jour/nuit, `prefers-contrast: more` |
| Layout | `src/uiLayoutConstants.js` | Grille 4 px, `MIN_TOUCH = 44`, coordonnées HUD/menu |

Les valeurs `:root` dans `style.css` sont synchronisées au chargement via `syncShellTheme()`.

## Palette principale

| Token | Hex | Usage |
|-------|-----|--------|
| `fondNuit` | `#1a1a2e` | Fond shell / nuit |
| `fondJour` | `#87ceeb` | Ciel jour |
| `accent` | `#fdd835` | Titres, focus, CTA jaune |
| `texteHud` | `#ffffff` | Score, HUD (contour noir obligatoire en jour) |
| `texteBoutonJaune` | sombre sur `#fdd835` | REJOUER, pills actives |

## Typographie

| Rôle | Police | Taille typique |
|------|--------|----------------|
| Titre arcade | Press Start 2P | 12 px min (auto-fit) |
| Corps menu / HUD | Segoe UI (Phaser) | 12–15 px |
| Score in-game | Segoe UI bold | 40 px + contour |
| Chargement shell | `--police-interface` | 14–16 px clamp |

## Spacing

Échelle 4 px : `xs=4`, `sm=8`, `md=12`, `lg=16`, `xl=24` (CSS + `SPACING` JS).

Zones tactiles : **minimum 44×44 px** (`MIN_TOUCH`) ; CTA primaires et **pause HUD** **48 px** (`MIN_CTA_TOUCH`).

## Référence visuelle

Page interactive (swatches, typo, spacing) :

```bash
npm run dev:tokens
```

Ouvre [`tokens.html`](../tokens.html) — même source que `src/designTokens.js`, sans lancer Phaser.

## Contraste (WCAG AA)

Paires critiques testées dans `tests/designTokens.test.js` :

- Texte HUD blanc + contour sur fond jour
- Boutons jaunes (`yellowChromeButtonTextStyle`)
- Badges daily / hardcore en mode jour

## Accessibilité visuelle clavier

- Overlay DOM `#a11y-controls` : focus-visible jaune (`style.css`)
- Boutons canvas pause / game over / HUD : focus clavier et survol souris unifiés via `bindUnifiedInteractiveFocus()` dans `src/uiDomAccessibilityControls.js`
- Autres pills menu : état focus via `src/uiDomAccessibilityFocusVisuals.js`

## Profondeur (z-order)

Voir `src/uiDepth.js` : monde → overlays menu → pause → HUD → effets.
