# Contribuer

## Développement local

```bash
npm install
npm run dev          # http://localhost:5173
npm test
npm run lint
npm run build
npm run test:e2e
```

Ne pas utiliser Live Server (port 5500) : il ne bundle pas Vite/Phaser.

## Icônes PWA

Générées avant chaque build de production :

```bash
npm run icons        # public/icons/
npm run icons:optimize
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
