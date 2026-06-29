---
name: nettoyage
description: >-
  Nettoyage de code et documentation : supprimer le mort, factoriser les
  doublons, alléger les docs, fusionner ou découper des modules si cela
  simplifie, sans changer le comportement. Utiliser quand l'utilisateur demande
  nettoyage, cleanup, simplifier, minimiser les documents, factoriser, alléger
  le dépôt ou « comme dans les autres discussions ».
---

# Nettoyage code & docs

## Déclencheur

Session de **ménage** (pas un audit /20, pas une nouvelle feature).

Invocation : `/nettoyage`

## Principes

1. **Zéro régression fonctionnelle** — gameplay, UX, API publique inchangés
2. **Diff minimal** — ne pas « améliorer » au passage sans lien direct au ménage
3. **Prouver avant supprimer** — grep références, imports, CI
4. **Valider après** — tests unitaires + build (+ e2e si présents)
5. **Français** dans les bilans

## Workflow

### Phase 1 — Explorer (readonly)

- Inventorier : code mort, doublons, fichiers/doc redondants, générés versionnés
- Chercher : `TODO`, `FIXME`, exports/imports orphelins, assets non référencés
- Repérer : docs qui répètent le README, tables auto-générées dans git
- **Ne pas toucher** : `dist/`, `coverage/`, `node_modules/`, secrets

### Phase 2 — Code

| Action | Exemples |
|--------|----------|
| Supprimer code mort | fonctions jamais appelées, constantes inutilisées, stubs vides |
| Fusionner doublons | constantes → module parent ; règles → fichier domaine |
| Extraire helpers | logique répétée 3+ fois, helpers E2E partagés |
| Simplifier sur-ingénierie | abstraction inutile → code linéaire si plus lisible |
| Centraliser | constantes partagées, états de test |
| Specs E2E | scénarios déclaratifs ; helpers dans `helpers-*.mjs` |
| **Refactor structurel** | fusion ou découpe de modules **autorisée** si lisibilité/maintenabilité gagnent sans changer le comportement |

**Éviter** : nouveau pattern sans gain clair, commentaires évidents

### Phase 3 — Documentation

| Action | Règle |
|--------|-------|
| Supprimer | meta-docs redondants (QUICKSTART, CODE_STANDARDS, DESIGN, PROGRESS, INDEX…) |
| Fusionner | contenu utile → **un** README projet |
| Renvoyer | détails (npm, PR, breakpoints) → `CONTRIBUTING.md` |
| Alléger CHANGELOG | sections fusionnées, pas de doublon |
| Docs générées | **jamais > 50 lignes versionnées** ; détail complet → artefact build/dist uniquement |
| En-têtes CSS/JS | une ligne « voir CONTRIBUTING » si besoin |

**Cible** : 1 README racine (léger) + 1 README projet + CONTRIBUTING optionnel

### Phase 4 — Qualité

```bash
npm test
npm run lint          # si présent
npm run build         # si présent
npm run test:e2e      # si présent et raisonnable
```

**Formatage** : Prettier (ou `format:check` du projet) **uniquement sur les fichiers modifiés**, pas sur tout le dépôt.

### Phase 5 — Bilan

```markdown
# Nettoyage — [Projet]

## Bilan chiffré
- X fichiers supprimés / Y fusionnés
- +… / −… lignes (approx.)

## Code
| Action | Fichier(s) | Détail |

## Documentation
| Avant | Après |

## Validation
- Tests : …/…
- Build / lint : OK / échec

## Non touché (volontaire)
- …
```

## Hors scope

- Audit /20 (→ skills `audit/*`)
- Nouvelles features ou changement gameplay volontaire
- Renommages massifs sans lien au ménage
- Suppression de tests « gênants »
- Commit/push sauf demande explicite

## Références

Patterns validés : Floppy Bird, Dernière Ligne, Portfolio (sessions 2025–2026).
