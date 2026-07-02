# Floppy Bird — améliorations Game Over / Options / Skins

Patch : `floppy-bird-ameliorations.patch` (à appliquer avec `git apply floppy-bird-ameliorations.patch`
depuis la racine du repo, sur la même base que `main` sur GitHub).

Validé : `npm test` (260 tests, 59 fichiers, tous verts), `npm run lint` (aucune erreur),
`npx vite build` (build de prod OK), couverture globale 90.6 % lignes / 80.7 % branches
(seuils du projet : 75 % / 70 %).

## 1. Écran Game Over (`src/uiGameOver.js`)

- Plaque façon trophée : double liseré doré + petits chevrons dans les coins.
- Titre avec soulignement doré, score qui **s'anime en comptant** de 0 jusqu'au score final.
- Médaille (bronze/argent/or) avec anneau et halo interne au lieu d'un simple disque plat.
- Nouveau record : bandeau doré derrière le texte + **pluie de confettis** (12 petits carrés,
  couleurs variées, chute + rotation + fondu, ~1 à 1.4 s).
- Deux liserés fins séparant les blocs (record/score, classement/pied de page).
- Le n°1 du classement reçoit une couronne 👑 à la place de "1.".
- Bouton MENU : ombre portée pour donner un effet de profondeur.
- Respecte `prefers-reduced-motion` (désactive automatiquement les animations via `sceneTween`
  existant, rien à faire de plus).

## 2. Menu Options (`src/uiMenuOptions.js`, `src/uiLayout.js`, `src/device.js`)

- Le panneau est maintenant découpé en 3 sections avec petits en-têtes + liseré :
  **▸ MODE DE JEU** (défi du jour, entraînement, hardcore) · **▸ APPARENCE** (skin, trophées)
  · **▸ SON**.
- Chaque bascule a maintenant une puce couleur en préfixe de son texte (🟦/🟥/🟪 quand actif,
  ⬜ sinon) pour un repérage plus rapide, sans toucher à la taille des zones tactiles (toujours
  44 px min, cf. `MIN_TOUCH`).
- Le son affiche une icône 🔊/🔇/🔈 selon son état.
- **Aucune coordonnée de test e2e n'a changé de sémantique** : `TOUCH_TARGETS` reste dérivé de
  `UI_LAYOUT`, donc les tests Playwright (`e2e/touch.spec.js`, `e2e/viewport.spec.js`) restent
  valides tels quels. Le panneau est juste ~30 px plus haut pour loger les 3 en-têtes.

## 3. Nouveaux skins originaux (`src/skins.js`, `src/textures/birdTextures.js`)

Le générateur de texture (`birdTextures.js`) supporte maintenant un `accessory` optionnel par
skin : hauteur de canvas custom (pour les cornes/casques qui dépassent), décalage vertical du
corps, opacité globale, et une fonction `draw()` qui ajoute des formes par-dessus le corps de
base. Les 4 skins existants (classique/rubis/océan/forêt) sont inchangés au pixel près.

| Skin | Thème | Déblocage |
|---|---|---|
| Chevalier (`armure`) | casque à visière ouverte, cimier rouge, épaulières | Meilleur score **hardcore ≥ 15** (au-delà de Forêt) |
| Mushu (`mushu`) | dragon rouge/or, petites cornes, crête dorsale, moustaches | Score **≥ 15 dans les 3 difficultés** (facile + normal + difficile) |
| Fantôme (`fantome`) | corps translucide (alpha 0.72), yeux luminescents, traîne en lambeaux | Meilleur score **≥ 30** (au-delà d'Océan) |
| Néon (`neon`) | viseur et liserés cyberpunk sur fond sombre | **Débloquer tous les autres skins** (skin de prestige) |

- `SKIN_IDS` passe de 4 à 8 ; tout ce qui itère dessus (préchargement des textures, animations,
  achievements `unlockedSkinCount`) suit automatiquement, y compris le compteur "X/8" dans le
  menu (j'ai corrigé le "/4" qui était codé en dur dans `uiMeta.js`).
- Nouveau succès **"Légende néon"** dans `src/achievements.js` : débloquer les 8 skins.
- `metaContext.js` expose désormais `bestEasyScore` / `bestNormalScore` / `bestHardScore`
  (nécessaires pour Mushu), en plus de `bestScoreAny` / `bestHardcoreScore` déjà existants.
- Chaque skin a un champ `hint` (texte de condition de déblocage) déjà en place dans les données,
  prêt à être affiché si tu veux plus tard une vraie galerie de skins avec conditions visibles.

## Pistes pour la suite (non faites, pour ne pas surcharger ce patch)

- Une vraie "galerie de skins" (grille avec aperçus + hints de déblocage) plutôt que le simple
  cycle actuel bouton "APPARENCE".
- Un petit toast "nouveau skin débloqué !" au moment précis du déblocage (actuellement seul
  l'achievement associé, s'il existe, déclenche un toast).
- Étendre `e2e/` avec un scénario qui force un game over "nouveau record" pour capturer une
  capture d'écran de la pluie de confettis (utile en CI visuelle).
