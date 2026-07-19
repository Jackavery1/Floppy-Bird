---
name: bugs
description: >-
  Diagnostiquer et corriger des bugs : reproduire, observer les vraies données,
  isoler la cause, corriger avec diff minimal, valider sans régression, documenter
  l'apprentissage. Utiliser quand l'utilisateur signale un bug, une erreur, une
  régression, un échec CI/déploiement, un comportement « ça marche en local mais
  pas en prod », PWA bloquée, ou demande de déboguer.
---

# Bugs — diagnostic & correction

## Déclencheur

Session de **correction de bug** (pas audit /20, pas feature, pas nettoyage opportuniste).

Invocation : `/bugs`

## Principes

1. **Comprendre avant de coder** — lire message d'erreur, stack trace, écart attendu / observé
2. **Reproduire de façon fiable** — même environnement que l'utilisateur (dev, build, CI, mobile)
3. **Observer les vraies données** — logs, réseau, état runtime ; pas de correctif au hasard
4. **Diff minimal** — corriger la cause racine, pas les symptômes en cascade
5. **Valider le scénario initial + voisins** — tests existants, build prod si pertinent
6. **Apprentissage** — une phrase sur l'erreur + bonne pratique à retenir
7. **Français** dans les explications à l'utilisateur

## Workflow

### Phase 1 — Clarifier

- Reformuler : **attendu** vs **observé**
- Noter : environnement (OS, navigateur, PWA, CI, GitHub Pages, `npm run dev` vs `npm run build`)
- Lire stack trace / logs CI / annotations GitHub Actions
- Vérifier si le correctif est déjà en local mais **non poussé** (`git status`, `origin/main`)

### Phase 2 — Reproduire

| Contexte | Commande / action |
|----------|-------------------|
| Dev | `npm run dev` |
| Build prod local | `npm run build` puis `npx vite preview --host 127.0.0.1 --port 4173` |
| GitHub Pages | `BASE_PATH=/Nom-Repo/ npm run build` (PowerShell : `$env:BASE_PATH="/Nom-Repo/"`) |
| Tests | `npm test`, `npm run test:e2e` |
| CI | lire le job en échec (souvent `e2e`, `lint`, `deploy`) |

Si non reproductible : isoler (version minimale, un seul test Playwright, désactiver parallélisme).

### Phase 3 — Observer

Checklist rapide selon le type :

**Web / Vite / PWA**
- Console navigateur : imports npm non résolus en prod ?
- `dist/index.html` : chemins `base` cohérents (`./` vs `/Repo/`) ?
- Service worker : ancienne version en cache sur mobile ?
- `page.goto` bloqué par SW → `waitUntil: 'domcontentloaded'`

**CI / déploiement**
- Le job `deploy` dépend de **`check` + `lighthouse` + `e2e`** (matrice 8 viewports) — `e2e-smoke` reste un signal rapide PR
- Build prod avec le bon `BASE_PATH` (`/Nom-Repo/`) ?
- Pages : branche **`gh-pages`**, dossier **`/ (root)`** — pas `main`

**Jeux (Phaser, canvas)**
- Texte UI sur canvas → pas de `getByText` Playwright ; utiliser une test seam (`window.__TEST__`)
- Dev OK / prod KO → souvent build ou assets externes (`vendor/`)

**Données**
- Vérifier corps de requête, types, état, props — pas supposer

### Phase 4 — Isoler la cause

Ordre de vérification fréquent :

1. Config / env (`BASE_PATH`, variables shell persistantes)
2. Ordre chargement (script global avant module ES)
3. Chemins absolus vs relatifs
4. Cache (PWA, CDN, navigateur)
5. Tests ou workflow qui bloquent le déploiement sans bug utilisateur visible
6. Régression récente (`git log`, `git diff` sur fichiers suspects)

### Phase 5 — Corriger

- Montrer le code modifié et **pourquoi** l'erreur survenait
- Rester dans le scope du bug
- Pas de commentaires évidents ; tests utiles seulement s'ils verrouillent le comportement corrigé
- Commit **uniquement** si l'utilisateur le demande

### Phase 6 — Valider

```bash
npm test
npm run lint          # si présent
npm run build         # avec BASE_PATH si GitHub Pages
npm run test:e2e      # si présent
```

Rejouer le scénario utilisateur. Vérifier les cas proches (pas de régression).

### Phase 7 — Bilan

```markdown
# Bug — [résumé court]

## Problème
Attendu : …
Observé : …

## Cause
…

## Correction
…

## Validation
- …

## À retenir
**Erreur :** …
**Pratique :** …
```

## Pièges courants (ce dépôt)

| Symptôme | Cause fréquente |
|----------|-----------------|
| « Impossible de charger le jeu » en prod/PWA | Bundle avec `import "phaser"` ; shim + script `vendor/phaser.min.js` |
| Localhost OK, GitHub Pages KO | Correctif non poussé ; ou CI deploy en échec |
| PWA mobile bloquée après fix | Cache service worker — vider données site / réinstaller PWA |
| `npm run preview` échoue sous Windows | Préférer `npx vite preview --host 127.0.0.1 --port 4173` |
| E2E matrice rouge | Bloque le deploy Pages (`e2e` dans `needs`) |
| E2E matrice rouge | Bloque le deploy Pages (`e2e` dans `needs`) |
| E2E smoke rouge | Signal PR rapide ; ne remplace pas la gate `e2e` |
| E2E rouge, site OK | Vérifier si le dernier deploy a tourné avant le rouge ; `deploy.needs` inclut `e2e` |

## Hors scope

- Refactor large non lié au bug
- Audit /20 (→ `audit/*`)
- Nettoyage général (→ `maintenance/nettoyage`)
- Nouvelle feature déguisée en fix

## Références projet

- Workflow CI + deploy : `.github/workflows/ci.yml`
- Build Pages : `CONTRIBUTING.md` (section GitHub Pages)
- Config base : `vite.config.js`, `BASE_PATH`
