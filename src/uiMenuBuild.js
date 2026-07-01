import { GAME_CONFIG, DIFFICULTY_ORDER } from './config.js';
import { cycleSoundLevel, formatSoundLabel, isAudioAvailable } from './audio.js';
import {
    jumpHint,
    modesHintLine,
    trainingToggleLabel,
    hardcoreToggleLabel,
} from './device.js';
import { getDailyChallengeLabel } from './dailyChallenge.js';
import { sceneTween } from './motion.js';
import {
    addCenteredText,
    diffButtonCenter,
    diffLabelColor,
    fitTitleFontSize,
    GAME_TITLE,
    MIN_TOUCH,
    modesAccordionLabel,
    stopUiEvent,
    UI_LAYOUT,
} from './uiLayout.js';
import { bestScoreLabel, drawDiffButtons, applyMenuLayout } from './uiMenuLayout.js';

export function buildMenuHeader(ui, elements, layout, difficulty, hardcoreMode) {
    const titleSize = fitTitleFontSize(ui.scene, GAME_TITLE);
    const title = addCenteredText(ui.scene, GAME_CONFIG.centerX, layout.title, GAME_TITLE, {
        fontSize: `${titleSize}px`,
        fill: '#FDD835',
        fontStyle: 'bold',
        stroke: '#E65100',
        strokeThickness: 3,
    }, 51);
    elements.push(title);

    ui._bestText = addCenteredText(ui.scene, GAME_CONFIG.centerX, layout.best,
        `${bestScoreLabel(difficulty, hardcoreMode)} : ${ui.highScore}`,
        { fontSize: '14px', fill: '#ffffff' }, 51);
    elements.push(ui._bestText);

    elements.push(addCenteredText(ui.scene, GAME_CONFIG.centerX, layout.daily,
        getDailyChallengeLabel(), { fontSize: '9px', fill: '#aaaaaa' }, 51));

    return title;
}

export function buildMenuModes(ui, elements, layout, trainingMode, hardcoreMode) {
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
}

export function buildMenuDifficulty(ui, elements, layout, difficulty) {
    const { diffBtn } = UI_LAYOUT;
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
}

export function buildMenuFooter(ui, elements, layout) {
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
        `SON : ${formatSoundLabel(isAudioAvailable())}`, { fontSize: '11px', fill: '#cccccc' }, 52);
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
            ui._muteText.setText(`SON : ${formatSoundLabel(isAudioAvailable())}`);
        });
    }
    elements.push(ui._muteHit);

    return ui._startText;
}

export function playMenuIntroTween(ui, title) {
    [title, ui._bestText, ui._trainingLabel, ui._hardcoreLabel, ui._startText].forEach(el => el.setAlpha(0));
    sceneTween(ui.scene, {
        targets: [title, ui._bestText, ui._trainingLabel, ui._hardcoreLabel, ui._startText],
        alpha: 1,
        duration: 400,
        stagger: 80,
        ease: 'Power2',
    });
}
