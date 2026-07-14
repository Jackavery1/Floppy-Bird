# Design tokens — Floppy Bird

Référence visuelle pour reprendre l’UI sans parcourir tout le code Phaser.

## Sources de vérité

| Couche | Fichier | Rôle |
|--------|---------|------|
| Jeu (Phaser) | `src/designTokens.js` | ~70 couleurs sémantiques + helpers typo (`hudTextStyle`, `menuTextStyle`, …) |
| Shell HTML | `public/shell-tokens.css` + `style.css` | Fond, accent, polices, spacing CSS (import partagé) |
| Source JS shell | `src/shellTokenDefaults.js` | Fallbacks CSS + overrides `prefers-contrast: more` (test `shellTokenSync.test.js`) |
| Pages statiques | `public/offline-page.css` | Fallback hors-ligne (utilise `shell-tokens.css`) |
| Runtime | `src/shellTheme.js` | Sync tokens → CSS, `theme-color`, cycle jour/nuit, `prefers-contrast: more` |
| Layout | `src/uiLayoutConstants.js` | Grille 4 px, `MIN_TOUCH = 44`, coordonnées HUD/menu |

Les valeurs `:root` vivent dans `public/shell-tokens.css` (importées par `style.css`), dérivées de `shellTokenDefaults.js`, et sont resynchronisées au chargement via `syncShellTheme()`.

Classes shell référencées : verrouillées par `tests/cssShellClasses.test.js` (pas de CSS orphelin dans `style.css`).

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

### Stratégie mode jour

Le fond ciel (`fondJour` `#87ceeb`) est clair : le texte HUD blanc seul **ne passe pas** AA (ratio < 4,5:1). La stratégie retenue :

1. **Contour noir systématique** sur tout texte HUD (`hudTextStyle()` → `stroke` + épaisseur 4 px en jour).
2. **Contraste mesuré sur le contour**, pas sur le fill blanc — validé dans `tests/designTokens.test.js`.
3. **Assombrissement des bannières** en jour via `hudBannerFill()` pour les fonds semi-opaques.
4. **`prefers-contrast: more`** : épaisseur contour +3 px, accent renforcé (`shellTheme.js` + `style.css`).

Ne pas retirer le contour en mode jour sans recalculer les ratios.

### Paires critiques testées

- Texte HUD blanc + contour sur fond jour
- Boutons jaunes (`yellowChromeButtonTextStyle`)
- Badges daily / hardcore en mode jour
- Texte secondaire menu et game over

## Accessibilité visuelle clavier

- Overlay DOM `#a11y-controls` : focus-visible jaune (`style.css`)
- **Tactile** (`@media (pointer: coarse)`) : outline 3 px + halo 6 px sur `.a11y-btn` et canvas
- **`prefers-contrast: more`** : bordures focus renforcées (`style.css`)
- Boutons canvas pause / game over / HUD : focus clavier et survol souris unifiés via `bindUnifiedInteractiveFocus()` dans `src/uiDomAccessibilityControls.js`
- Autres pills menu : état focus via `src/uiDomAccessibilityFocusVisuals.js`

## Feedback gameplay (HUD)

| Signal | Token / module | Rôle |
|--------|----------------|------|
| Coyote actif | `teinteCoyoteActif` (`#FFD54F`) | Teinte sprite oiseau hors gap (`sceneCoyote.js`) |
| Game over chargement | `showGameOverLoading` | Overlay + panneau squelette + pulse alpha (`uiHudBannerCore.js`) |

## Profondeur (z-order)

Voir `src/uiDepth.js` : monde → overlays menu → pause → HUD → effets.
