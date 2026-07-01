# Contribuer

## Développement local

Voir les commandes essentielles dans [README.md](README.md). Détails ci-dessous :

```bash
npm install
npm test
npm run lint
npm run build
npm run test:e2e
```

### Tests e2e (Playwright)

Après `npm install`, installer les navigateurs Playwright une fois :

```bash
npx playwright install chromium
```

Puis lancer les tests (build preview automatique via `playwright.config.js`) :

```bash
npm run build
npm run test:e2e
```

#### Échec SSL en local (proxy d’entreprise)

Si `npm run test:e2e` ou `npx playwright install chromium` échoue avec `UNABLE_TO_VERIFY_LEAF_SIGNATURE` ou une erreur certificat :

1. Configurer npm avec le certificat racine corporate (`npm config set cafile …`) — voir section ci-dessous.
2. Relancer `npx playwright install chromium`.
3. Les tests e2e tournent en CI GitHub sans ce problème ; en local, un réseau sans inspection TLS suffit souvent.

Serveur local : voir l’avertissement Live Server dans [README.md](README.md).

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

Workflow : `.github/workflows/deploy.yml` — lint, test, build, e2e, déploiement `dist/`.
