import { GAME_CONFIG, DIFFICULTY_ORDER } from './config.js';
import { cycleSoundLevel, formatSoundLabel, isAudioAvailable } from './audio.js';
import { loadHighScore } from './storage.js';
import {
    isCoarsePointer,
    jumpHint,
    modesHintLine,
    trainingToggleLabel,
    hardcoreToggleLabel,
} from './device.js';
import { getDailyChallengeLabel } from './dailyChallenge.js';
import { sceneTween } from './motion.js';
import {
    addCenteredText,
    computeMenuLayout,
    diffButtonCenter,
    diffLabelColor,
    DIFF_BTN_ACTIVE,
    DIFF_BTN_HOVER,
    DIFF_BTN_IDLE,
    fitTitleFontSize,
    GAME_TITLE,
    MIN_TOUCH,
    modesAccordionLabel,
    stopUiEvent,
    UI_LAYOUT,
} from './uiLayout.js';
import { destroyInGameControls } from './uiHud.js';

function drawDiffButtons(ui, difficulty, layout) {
    if (!ui._diffBtnGraphics) return;
    const g = ui._diffBtnGraphics;
    g.clear();

    const { diffBtn } = UI_LAYOUT;
    const diffY = layout.difficulty;

    DIFFICULTY_ORDER.forEach((diff, i) => {
        const bx = diffBtn.x[i];
        const by = diffY - diffBtn.height / 2;
        if (difficulty === diff) {
            g.fillStyle(DIFF_BTN_ACTIVE, 1);
        } else if (ui._hoveredDifficulty === diff) {
            g.fillStyle(DIFF_BTN_HOVER.color, DIFF_BTN_HOVER.alpha);
        } else {
            g.fillStyle(DIFF_BTN_IDLE.color, DIFF_BTN_IDLE.alpha);
        }
        g.fillRoundedRect(bx, by, diffBtn.width, diffBtn.height, diffBtn.radius);
    });
}

function applyMenuLayout(ui, difficulty, trainingMode, hardcoreMode) {
    const layout = computeMenuLayout(isCoarsePointer(), ui._modesExpanded);
    ui._menuLayout = layout;

    if (ui._modesHeader) {
        ui._modesHeader.setVisible(layout.compact);
        ui._modesHeader.setY(layout.modesHeader);
        ui._modesHeader.setText(modesAccordionLabel(layout.modesExpanded, trainingMode, hardcoreMode));
    }
    if (ui._modesHeaderHit) {
        ui._modesHeaderHit.setVisible(layout.compact);
        ui._modesHeaderHit.setY(layout.modesHeader);
    }

    const showModes = !layout.compact || layout.modesExpanded;
    if (ui._trainingLabel) {
        ui._trainingLabel.setVisible(showModes);
        if (showModes && layout.training != null) ui._trainingLabel.setY(layout.training);
    }
    if (ui._trainingHit) {
        ui._trainingHit.setVisible(showModes);
        if (showModes && layout.training != null) ui._trainingHit.setY(layout.training);
    }
    if (ui._hardcoreLabel) {
        ui._hardcoreLabel.setVisible(showModes);
        if (showModes && layout.hardcore != null) ui._hardcoreLabel.setY(layout.hardcore);
    }
    if (ui._hardcoreHit) {
        ui._hardcoreHit.setVisible(showModes);
        if (showModes && layout.hardcore != null) ui._hardcoreHit.setY(layout.hardcore);
    }

    drawDiffButtons(ui, difficulty, layout);
    ui._diffBtnLabels?.forEach(({ label, diff, hitZone }, i) => {
        label.setY(layout.difficulty);
        label.setColor(diffLabelColor(ui._currentDifficulty, diff));
        hitZone.setY(layout.difficulty);
        hitZone.x = diffButtonCenter(i);
    });

    ui._startText?.setY(layout.start);
    ui._hint1?.setY(layout.hint1);
    ui._hint2?.setY(layout.hint2);
    ui._muteText?.setY(layout.mute);
    ui._muteHit?.setY(layout.mute);
}

export function showMenu(ui, difficulty, trainingMode, hardcoreMode) {
    if (ui.scoreText) {
        ui.scoreText.destroy();
        ui.scoreText = null;
    }
    destroyInGameControls(ui);

    ui._currentDifficulty = difficulty;
    ui._modesExpanded = !isCoarsePointer();
    ui.highScore = loadHighScore(difficulty);
    const elements = [];
    const layout = computeMenuLayout(isCoarsePointer(), ui._modesExpanded);
    ui._menuLayout = layout;
    const { diffBtn } = UI_LAYOUT;

    const overlay = ui.createOverlay(0.22, 50);
    elements.push(overlay);

    const titleSize = fitTitleFontSize(ui.scene, GAME_TITLE);
    const title = addCenteredText(ui.scene, GAME_CONFIG.centerX, layout.title, GAME_TITLE, {
        fontSize: `${titleSize}px`,
        fill: '#FDD835',
        fontStyle: 'bold',
        stroke: '#E65100',
        strokeThickness: 3,
    }, 51);
    elements.push(title);

    const bestText = addCenteredText(ui.scene, GAME_CONFIG.centerX, layout.best,
        `MEILLEUR (${GAME_CONFIG.difficultyLabels[difficulty]}) : ${ui.highScore}`,
        { fontSize: '14px', fill: '#ffffff' }, 51);
    elements.push(bestText);

    const dailyText = addCenteredText(ui.scene, GAME_CONFIG.centerX, layout.daily,
        getDailyChallengeLabel(), { fontSize: '9px', fill: '#aaaaaa' }, 51);
    elements.push(dailyText);

    ui._modesHeader = addCenteredText(ui.scene, GAME_CONFIG.centerX, layout.modesHeader ?? layout.training,
        modesAccordionLabel(layout.modesExpanded, trainingMode, hardcoreMode), {
            fontSize: '10px',
            fill: '#cccccc',
            fontStyle: 'bold',
        }, 51);
    ui._modesHeader.setVisible(layout.compact);
    elements.push(ui._modesHeader);

    ui._modesHeaderHit = ui.scene.add.rectangle(
        GAME_CONFIG.centerX, layout.modesHeader ?? layout.training, 220, MIN_TOUCH, 0x000000, 0,
    );
    ui._modesHeaderHit.setDepth(54);
    ui._modesHeaderHit.setVisible(layout.compact);
    ui._modesHeaderHit.setInteractive({ useHandCursor: true });
    ui._modesHeaderHit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        ui._modesExpanded = !ui._modesExpanded;
        applyMenuLayout(ui, ui._currentDifficulty, ui.scene.trainingMode, ui.scene.hardcoreMode);
    });
    elements.push(ui._modesHeaderHit);

    ui._trainingLabel = addCenteredText(ui.scene, GAME_CONFIG.centerX, layout.training ?? layout.modesHeader,
        trainingToggleLabel(trainingMode), {
            fontSize: '11px',
            fill: trainingMode ? '#81D4FA' : '#888888',
            fontStyle: 'bold',
        }, 51);
    elements.push(ui._trainingLabel);

    ui._trainingHit = ui.scene.add.rectangle(
        GAME_CONFIG.centerX, layout.training ?? layout.modesHeader, 200, MIN_TOUCH, 0x000000, 0,
    );
    ui._trainingHit.setDepth(54);
    ui._trainingHit.setInteractive({ useHandCursor: true });
    ui._trainingHit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        ui.scene.toggleTraining();
    });
    elements.push(ui._trainingHit);

    ui._hardcoreLabel = addCenteredText(ui.scene, GAME_CONFIG.centerX, layout.hardcore ?? layout.training,
        hardcoreToggleLabel(hardcoreMode), {
            fontSize: '11px',
            fill: hardcoreMode ? '#FF8A80' : '#888888',
            fontStyle: 'bold',
        }, 51);
    elements.push(ui._hardcoreLabel);

    ui._hardcoreHit = ui.scene.add.rectangle(
        GAME_CONFIG.centerX, layout.hardcore ?? layout.training, 200, MIN_TOUCH, 0x000000, 0,
    );
    ui._hardcoreHit.setDepth(54);
    ui._hardcoreHit.setInteractive({ useHandCursor: true });
    ui._hardcoreHit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        ui.scene.toggleHardcore();
    });
    elements.push(ui._hardcoreHit);

    ui._diffBtnGraphics = ui.scene.add.graphics().setDepth(52);
    elements.push(ui._diffBtnGraphics);
    drawDiffButtons(ui, difficulty, layout);

    ui._diffBtnLabels = [];
    DIFFICULTY_ORDER.forEach((diff, i) => {
        const btnCx = diffButtonCenter(i);
        const label = addCenteredText(ui.scene, btnCx, layout.difficulty,
            GAME_CONFIG.difficultyLabels[diff], {
                fontSize: '9px',
                fill: diffLabelColor(ui._currentDifficulty, diff),
                fontStyle: 'bold',
            }, 53);
        elements.push(label);

        const hitZone = ui.scene.add.rectangle(
            btnCx, layout.difficulty, diffBtn.width, MIN_TOUCH, 0x000000, 0,
        );
        hitZone.setDepth(54);
        hitZone.setInteractive({ useHandCursor: true });
        hitZone.on('pointerover', () => {
            ui._hoveredDifficulty = diff;
            drawDiffButtons(ui, ui._currentDifficulty, ui._menuLayout);
        });
        hitZone.on('pointerout', () => {
            ui._hoveredDifficulty = null;
            drawDiffButtons(ui, ui._currentDifficulty, ui._menuLayout);
        });
        hitZone.on('pointerdown', (_p, _lx, _ly, event) => {
            stopUiEvent(event);
            ui.scene.changeDifficulty(diff);
        });
        ui._diffBtnLabels.push({ label, diff, hitZone });
        elements.push(hitZone);
    });

    ui._startText = addCenteredText(ui.scene, GAME_CONFIG.centerX, layout.start,
        'APPUYER POUR JOUER', { fontSize: '14px', fill: '#ffffff' }, 51);
    sceneTween(ui.scene, {
        targets: ui._startText,
        alpha: 0,
        duration: 400,
        yoyo: true,
        repeat: -1,
        ease: 'Power0',
    });
    elements.push(ui._startText);

    ui._hint1 = addCenteredText(ui.scene, GAME_CONFIG.centerX, layout.hint1,
        jumpHint(), { fontSize: '11px', fill: '#ffffff' }, 52);
    elements.push(ui._hint1);

    ui._hint2 = addCenteredText(ui.scene, GAME_CONFIG.centerX, layout.hint2,
        modesHintLine(), { fontSize: '10px', fill: '#ffffff' }, 52);
    elements.push(ui._hint2);

    ui._muteText = addCenteredText(ui.scene, GAME_CONFIG.centerX, layout.mute,
        `SON : ${formatSoundLabel()}`, { fontSize: '11px', fill: '#cccccc' }, 52);
    elements.push(ui._muteText);

    ui._muteHit = ui.scene.add.rectangle(
        GAME_CONFIG.centerX, layout.mute, 140, MIN_TOUCH, 0x000000, 0,
    );
    ui._muteHit.setDepth(54);
    if (isAudioAvailable()) {
        ui._muteHit.setInteractive({ useHandCursor: true });
        ui._muteHit.on('pointerdown', (_p, _lx, _ly, event) => {
            stopUiEvent(event);
            cycleSoundLevel();
            ui._muteText.setText(`SON : ${formatSoundLabel()}`);
        });
    }
    elements.push(ui._muteHit);

    applyMenuLayout(ui, difficulty, trainingMode, hardcoreMode);

    [title, bestText, ui._trainingLabel, ui._hardcoreLabel, ui._startText].forEach(el => el.setAlpha(0));
    sceneTween(ui.scene, {
        targets: [title, bestText, ui._trainingLabel, ui._hardcoreLabel, ui._startText],
        alpha: 1,
        duration: 400,
        stagger: 80,
        ease: 'Power2',
    });

    return elements;
}

export function updateTrainingLabel(ui, trainingMode) {
    if (ui._trainingLabel) {
        ui._trainingLabel.setText(trainingToggleLabel(trainingMode));
        ui._trainingLabel.setColor(trainingMode ? '#81D4FA' : '#888888');
    }
    if (ui._modesHeader && ui._menuLayout?.compact) {
        ui._modesHeader.setText(modesAccordionLabel(
            ui._modesExpanded,
            trainingMode,
            ui.scene.hardcoreMode,
        ));
    }
}

export function updateHardcoreLabel(ui, hardcoreMode) {
    if (ui._hardcoreLabel) {
        ui._hardcoreLabel.setText(hardcoreToggleLabel(hardcoreMode));
        ui._hardcoreLabel.setColor(hardcoreMode ? '#FF8A80' : '#888888');
    }
    if (ui._modesHeader && ui._menuLayout?.compact) {
        ui._modesHeader.setText(modesAccordionLabel(
            ui._modesExpanded,
            ui.scene.trainingMode,
            hardcoreMode,
        ));
    }
}

export function updateDifficultyButtons(ui, difficulty) {
    ui._currentDifficulty = difficulty;
    ui.highScore = loadHighScore(difficulty);
    ui._hoveredDifficulty = null;
    drawDiffButtons(ui, difficulty, ui._menuLayout ?? UI_LAYOUT.menu);

    ui._diffBtnLabels.forEach(({ label, diff }) => {
        label.setColor(diffLabelColor(difficulty, diff));
    });
}

export function refreshHighScore(ui, difficulty) {
    ui._currentDifficulty = difficulty;
    ui.highScore = loadHighScore(difficulty);
}
