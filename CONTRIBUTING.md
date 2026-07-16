# Contribuer

## Développement local

Commandes de base : [README.md](README.md) (`npm run dev`, `test`, `lint`, `format:check`, `build`).

### Ports de preview locale

| Commande | Port | Usage |
| -------- | ---- | ----- |
| `npm run dev` | **5173** | Dev Vite + HMR |
| `npm run preview` | **8000** | Preview manuelle après build |
| Playwright (`test:e2e*`) | **4173** | Serveur CI/local lancé par `playwright.config.js` |

Ne pas utiliser Live Server (port 5500) — les modules ES / Phaser ne se résolvent pas.

### Tests e2e (Playwright)

Après `npm install`, installer les navigateurs une fois :

```bash
npm run test:e2e:install
```

Puis lancer les tests. Playwright rebuild avec `VITE_ENABLE_TEST_SEAM=true` (seam d’assertion, absente du déploiement Pages) :

```bash
npm run test:e2e
```

Build e2e manuel (équivalent CI) :

```bash
# PowerShell
# PowerShell — après npm run build (évite double build Playwright)
$env:PLAYWRIGHT_SKIP_BUILD='1'; $env:BASE_PATH='/Floppy-Bird/'; npm run test:e2e:ci
```

#### Échec SSL en local (proxy d’entreprise)

Si `npm run test:e2e` ou `npx playwright install chromium` échoue avec `UNABLE_TO_VERIFY_LEAF_SIGNATURE` ou une erreur certificat :

1. Configurer npm avec le certificat racine corporate (`npm config set cafile …`) — voir section ci-dessous.
2. Relancer `npm run test:e2e:install`.
3. Les tests e2e tournent en CI GitHub sans ce problème ; en local, un réseau sans inspection TLS suffit souvent.

Serveur local : voir l’avertissement Live Server dans [README.md](README.md).

### Matrice viewports E2E (Playwright)

| Projet                      | Viewport       | Touch | Tests clés                                                                  |
| --------------------------- | -------------- | ----- | --------------------------------------------------------------------------- |
| `chromium-desktop`          | Desktop Chrome | non   | `keyboard.spec.js`, `gameplay-equity.spec.mjs`, `visual-font.spec.js`       |
| `chromium-mobile-portrait`  | 390×844        | oui   | `touch.spec.js`, `touchTargets.spec.js`, `keyboard.spec.js`, `tutorial.spec.mjs`, `gameplay-equity` |
| `chromium-mobile-landscape` | 844×390        | oui   | `viewport.spec.js`, `touch.spec.js`, `keyboard.spec.js` (smoke)             |
| `webkit-mobile-portrait`    | iPhone 13      | oui   | touch + chargement                                                          |
| `webkit-mobile-landscape`   | 844×390        | oui   | hint paysage                                                                |
| `webkit-tablet-portrait`    | 768×1024       | oui   | Safari iPad — ratio letterbox (`viewport.spec.js`)                          |
| `chromium-tablet-portrait`  | 768×1024       | oui   | `viewport.spec.js` ratio + resync a11y mid-game                               |
| `chromium-tablet-landscape` | 1024×768       | oui   | `viewport.spec.js` ratio + resync a11y mid-game, `keyboard.spec.js` (smoke) |

Comportements validés : letterbox 288×512, safe-area, pinch-zoom et zoom navigateur 200 % simulé (`viewport.spec.js`), resync des contrôles a11y après redimensionnement en partie (mobile portrait + tablette portrait/paysage, `viewport.spec.js`), ratio letterbox WebKit portrait (`viewport.spec.js`), classe `partie-active` + viewport `user-scalable=no` en jeu **tactile** (desktop : zoom navigateur conservé), PWA offline (`offline.spec.js`), cibles tactiles ≥ 44 px menu et panneaux / **48 px** pour CTA et pause (`touchTargets.spec.js`), scoring naturel (`natural-scoring.spec.mjs`), tutoriel (`tutorial.spec.mjs`), équité gameplay et métriques scores 15–25 (`gameplay-equity.spec.mjs`).

Matrice clavier détaillée (desktop vs mobile vs tablette) : [README.md — Matrice clavier et entrées](README.md#matrice-clavier-et-entrées).

#### Smoke deploy (CI)

Le job `e2e-smoke` gate le déploiement GitHub Pages sur **4 viewports** : `chromium-desktop`, `chromium-mobile-portrait`, `chromium-tablet-portrait`, `chromium-tablet-landscape` (voir `.github/workflows/ci.yml`).

Le job `e2e` (matrice complète) couvre **8 viewports**, incluant paysage mobile, WebKit iPad et tablettes Chromium.

```bash
npm run test:e2e:smoke   # smoke bloquant deploy (4 viewports : desktop, mobile portrait, tablette portrait/paysage)
```

#### Couverture Vitest

`npm run test:coverage` instrumente le code et peut être plus lent en local (surtout sous Windows). Les timeouts Vitest sont à 20 s ; en cas d’échec sporadique, relancer la commande. La CI Linux reste la référence.

#### PWA offline (e2e)

Le test « charge le jeu hors ligne après precache » utilise `expect.poll` (pas `waitForFunction` async — Promise truthy) et un timeout 120 s. Le precache Workbox ne doit pas doubler `includeAssets` + `globPatterns` (sinon `add-to-cache-list-conflicting-entries`). Reload via `location.reload` ; tolère `ERR_INTERNET_DISCONNECTED` Playwright Windows.

## Artefacts générés (ne pas committer)

Ces dossiers sont produits localement ou en CI et listés dans [`.gitignore`](.gitignore) :

| Dossier                               | Origine                                     |
| ------------------------------------- | ------------------------------------------- |
| `node_modules/`                       | `npm install`                               |
| `dist/`                               | `npm run build`                             |
| `dev-dist/`                           | service worker Vite PWA en mode dev         |
| `coverage/`                           | `npm run test:coverage`                     |
| `test-results/`, `playwright-report/` | `npm run test:e2e`                          |
| `public/vendor/`, `public/icons/`     | scripts build (copiés dans `dist/` en prod) |

Le déploiement GitHub Pages pousse **`dist/`** sur la branche **`gh-pages`** via CI — pas sur `main`.

Si `git status` les affiche encore, vérifie qu’ils ne sont pas forcés : `git check-ignore -v dist test-results node_modules`.

Pour supprimer localement les artefacts listés ci-dessus :

```bash
npm run clean
```

## Icônes PWA

Générées avant chaque build de production :

```bash
npm run icons           # génère public/icons/
npm run icons:optimize  # recompression PNG (exécuté en CI après icons)
npm run test:e2e:smoke   # smoke bloquant deploy (4 viewports)
npm run test:e2e:ci      # matrice complète 8 viewports
npm run measure         # tailles dist/ et assets (après npm run build)
```

### Mesure bundle

Après `npm run build`, `npm run measure` affiche JSON :

| Champ | Signification |
|-------|----------------|
| `distKo` | Taille totale `dist/` |
| `iconsKo` | `public/icons/` |
| `vendorPhaserKo` | Phaser externalisé |
| `appJsGzipKo` | Somme gzip des chunks JS app |
| `jsAssets` / `cssAssets` | Détail par fichier |

Référence locale : `scripts/bundle-baseline.json` — régénérer après un gain mesurable (`npm run build && npm run measure`).
Prod Pages : pas de chunk `testSeam` (tree-shake ; `VITE_ENABLE_TEST_SEAM` réservé e2e). Precache : `includeManifestIcons: false` évite le double listage des icônes déjà globs.

La CI exécute `npm run icons` puis `npm run icons:optimize` automatiquement.

`npm run cycles` détecte les imports circulaires dans `src/` (madge). Lighthouse CI : perf **informatif** (plancher conseillé 45, avertissement ⚠ sans échec) — seuils bloquants a11y / best-practices / seo (`scripts/lighthouse-ci.mjs`).

## Problème certificat npm

Si `npm install` échoue avec `UNABLE_TO_VERIFY_LEAF_SIGNATURE` ou une erreur SSL :

1. **Proxy d'entreprise** — demande le certificat racine à ton admin :
    ```bash
    npm config set cafile "C:\chemin\vers\corp-ca.pem"
    ```
2. **Réseau temporairement bloqué** — réessaie sur un autre réseau (partage 4G, VPN personnel).
3. **Contournement local uniquement** (non recommandé) :
    ```bash
    npm install --strict-ssl=false
    ```

## Build GitHub Pages

```powershell
$env:BASE_PATH="/Floppy-Bird/"; npm run icons; npm run build; npm run preview
```

Le job `deploy` pousse `dist/` sur **`gh-pages`** après **`check`** + **`lighthouse`** + **`e2e-smoke`** (4 viewports Chromium). La matrice e2e complète (**8 viewports**, job `e2e`) est **bloquante pour le statut CI / PR**, mais **ne gate pas** le déploiement Pages.

En CI, `PLAYWRIGHT_SKIP_BUILD=1` évite un double `npm run build` (build explicite dans le job, preview seul dans Playwright). En local, `npm run test:e2e` rebuild via `webServer` comme avant.

**Pages** (Settings → Pages) : source **GitHub Actions** (recommandé) ou branche **`gh-pages`** / **`/ (root)`** si tu utilises peaceiris.

## Conventions de code

- **Identifiants** : anglais pour modules, fonctions exportées et API Phaser (`showMenu`, `buildOptionsContent`) — stabilité des imports et alignement avec l’écosystème. **Ne pas renommer massivement** les identifiants existants sans raison fonctionnelle. Textes joueur et commentaires en français.
- **`SceneContext`** : contrat JSDoc dans `src/sceneTypes.js` — tout module `scene*` reçoit ce contexte ; ne pas accéder à la physique ou au storage depuis `ui*.js`. Résumé dans [ARCHITECTURE.md](ARCHITECTURE.md#contrat-scenecontext-srcscenetypesjs).
- **`TOUCH_TARGETS`** (`src/ui/shared/uiLayoutConstants.js`) : coordonnées jeu pour les tests e2e — chaque clé doit avoir une spec Playwright associée (`e2e/touch.spec.js`, `e2e/scoreHud.spec.js`).
- **Format** : Prettier sur `src/`, `tests/`, `e2e/`, `scripts/` (`npm run format` avant une PR si le diff touche plusieurs fichiers).
