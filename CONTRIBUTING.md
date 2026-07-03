# Contribuer

## Développement local

Commandes de base : [README.md](README.md) (`npm run dev`, `test`, `lint`, `format:check`, `build`).

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
$env:VITE_ENABLE_TEST_SEAM='true'; $env:BASE_PATH='/Floppy-Bird/'; npm run build; npm run test:e2e:ci
```

#### Échec SSL en local (proxy d’entreprise)

Si `npm run test:e2e` ou `npx playwright install chromium` échoue avec `UNABLE_TO_VERIFY_LEAF_SIGNATURE` ou une erreur certificat :

1. Configurer npm avec le certificat racine corporate (`npm config set cafile …`) — voir section ci-dessous.
2. Relancer `npm run test:e2e:install`.
3. Les tests e2e tournent en CI GitHub sans ce problème ; en local, un réseau sans inspection TLS suffit souvent.

Serveur local : voir l’avertissement Live Server dans [README.md](README.md).

## Artefacts générés (ne pas committer)

Ces dossiers sont produits localement ou en CI et listés dans [`.gitignore`](.gitignore) :

| Dossier | Origine |
|---------|---------|
| `node_modules/` | `npm install` |
| `dist/` | `npm run build` |
| `coverage/` | `npm run test:coverage` |
| `test-results/`, `playwright-report/` | `npm run test:e2e` |
| `public/vendor/`, `public/icons/` | scripts build (copiés dans `dist/` en prod) |

Le déploiement GitHub Pages pousse **`dist/`** sur la branche **`gh-pages`** via CI — pas sur `main`.

Si `git status` les affiche encore, vérifie qu’ils ne sont pas forcés : `git check-ignore -v dist test-results node_modules`.

## Icônes PWA

Générées avant chaque build de production :

```bash
npm run icons        # public/icons/ (optionnel : npm run icons:optimize)
```

La CI exécute `npm run icons` automatiquement.

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

Le job `deploy` du workflow CI pousse `dist/` sur **`gh-pages`** à chaque push sur `main`.

**Pages** (Settings → Pages) : source **GitHub Actions** (recommandé) ou branche **`gh-pages`** / **`/ (root)`** si tu utilises peaceiris.

## Conventions de code

- **Identifiants** : anglais pour modules, fonctions exportées et API Phaser (`showMenu`, `buildOptionsContent`) — stabilité des imports et alignement avec l’écosystème. **Ne pas renommer massivement** les identifiants existants sans raison fonctionnelle. Textes joueur et commentaires en français.
- **`TOUCH_TARGETS`** (`src/uiLayoutConstants.js`) : coordonnées jeu pour les tests e2e — chaque clé doit avoir une spec Playwright associée (`e2e/touch.spec.js`, `e2e/scoreHud.spec.js`).
- **Format** : Prettier sur `src/`, `tests/`, `e2e/`, `scripts/` (`npm run format` avant une PR si le diff touche plusieurs fichiers).
