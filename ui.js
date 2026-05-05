const settingsModal = document.getElementById('settings-modal');

function toggleToolbar() {
    document.getElementById('toolbar').classList.toggle('collapsed');
}

function toggleFullscreen() {
    if (document.fullscreenElement === null) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function updateFullscreenIcon() {
    const enterIcon = document.getElementById('icon-fullscreen-enter');
    const exitIcon = document.getElementById('icon-fullscreen-exit');
    if (document.fullscreenElement === null) {
        enterIcon.classList.remove('hidden');
        exitIcon.classList.add('hidden');
    } else {
        enterIcon.classList.add('hidden');
        exitIcon.classList.remove('hidden');
    }
}

document.addEventListener('fullscreenchange', () => {
    updateFullscreenIcon();
});

function toggleSettings() {
    const isOpen = settingsModal.classList.contains('show');
    if (isOpen === true) {
        settingsModal.classList.remove('show');
    } else {
        document.getElementById('setting-font-size').value = getState('tw.fontSize');
        document.getElementById('toggle-line-numbers').checked = getState('tw.lineNumbers') === 'true';
        document.getElementById('toggle-monospace').checked = getState('tw.monospace') === 'true';
        document.getElementById('toggle-wide').checked = getState('tw.wideMode') === 'true';
        document.getElementById('toggle-tooltips').checked = getState('tw.tooltips') === 'true';
        document.getElementById('toggle-word-count').checked = getState('tw.wordCount') === 'true';
        for (const field of DIY_FIELDS) {
            syncDiyField(field, getState('tw.diy.' + field));
        }
        settingsModal.classList.add('show');
    }
}

function closeSettings() {
    settingsModal.classList.remove('show');
}

function closeSettingsOnOverlay(clickEvent) {
    if (clickEvent.target === settingsModal) {
        closeSettings();
    }
}

function toggleLineNumbers(checked) {
    const wrap = document.querySelector('.editor-wrap');
    if (checked === true) {
        setState('tw.lineNumbers', 'true');
        lineNumbers.style.display = 'block';
        wrap.classList.add('no-wrap');
    } else {
        setState('tw.lineNumbers', 'false');
        lineNumbers.style.display = 'none';
        wrap.classList.remove('no-wrap');
    }
}

function toggleMonospace(checked) {
    if (checked === true) {
        setState('tw.monospace', 'true');
        editor.classList.add('monospace-mode');
    } else {
        setState('tw.monospace', 'false');
        editor.classList.remove('monospace-mode');
    }
}

function toggleWideMode(checked) {
    const container = document.querySelector('.editor-container');
    if (checked === true) {
        setState('tw.wideMode', 'true');
        container.classList.add('wide');
    } else {
        setState('tw.wideMode', 'false');
        container.classList.remove('wide');
    }
}

function toggleTooltips(checked) {
    if (checked === true) {
        setState('tw.tooltips', 'true');
        document.body.classList.remove('no-tooltips');
    } else {
        setState('tw.tooltips', 'false');
        document.body.classList.add('no-tooltips');
    }
}

function toggleWordCount(checked) {
    const wordCountEl = document.getElementById('word-count');
    if (checked === true) {
        setState('tw.wordCount', 'true');
        wordCountEl.style.display = 'block';
    } else {
        setState('tw.wordCount', 'false');
        wordCountEl.style.display = 'none';
    }
}

function setFontSize(value) {
    const size = Math.max(8, Math.min(72, parseInt(value, 10)));
    setState('tw.fontSize', String(size));
    editor.style.fontSize = size + 'px';
    lineNumbers.style.fontSize = size + 'px';
    const viewContent = document.getElementById('view-mode');
    if (viewContent !== null) {
        viewContent.style.fontSize = size + 'px';
    }
}

editor.addEventListener('input', () => {
    setState('tw.editorText', editor.value);
    updateWordCount();
    updateLineNumbers();
});

editor.addEventListener('scroll', () => {
    lineNumbers.scrollTop = editor.scrollTop;
});

document.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.repeat === true) {
        return;
    }
    const modifierHeld = keyEvent.metaKey === true || keyEvent.ctrlKey === true;

    if (keyEvent.key === 'Tab' && keyEvent.target === editor) {
        keyEvent.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + '\t' + editor.value.substring(end);
        editor.selectionStart = start + 1;
        editor.selectionEnd = start + 1;
        setState('tw.editorText', editor.value);
        updateLineNumbers();
    }

    if (modifierHeld === true && keyEvent.key === 's') {
        keyEvent.preventDefault();
        saveFile();
    }
    if (modifierHeld === true && keyEvent.key === 'd') {
        keyEvent.preventDefault();
        toggleThemePicker();
    }
    if (modifierHeld === true && keyEvent.key === 'r') {
        keyEvent.preventDefault();
        toggleMode();
    }
});

document.addEventListener('click', (clickEvent) => {
    const picker = document.getElementById('theme-picker');
    if (picker.contains(clickEvent.target) === false) {
        document.getElementById('theme-picker-menu').classList.remove('show');
    }
});

(function init() {
    editor.value = getState('tw.editorText');

    const fontSize = getState('tw.fontSize');
    editor.style.fontSize = fontSize + 'px';
    lineNumbers.style.fontSize = fontSize + 'px';

    if (getState('tw.lineNumbers') === 'false') {
        lineNumbers.style.display = 'none';
    } else {
        document.querySelector('.editor-wrap').classList.add('no-wrap');
    }

    if (getState('tw.monospace') === 'true') {
        editor.classList.add('monospace-mode');
    }

    if (getState('tw.wideMode') === 'true') {
        document.querySelector('.editor-container').classList.add('wide');
    }

    if (getState('tw.tooltips') === 'false') {
        document.body.classList.add('no-tooltips');
    }

    if (getState('tw.wordCount') === 'false') {
        document.getElementById('word-count').style.display = 'none';
    }

    populatePickerIcons();
    applyTheme(getState('tw.theme'));

    const mode = getState('tw.mode');
    switch (mode) {
        case 'edit':
            updateModeIcon('edit');
            break;
        default:
            renderMode(mode);
            break;
    }

    updateWordCount();
    updateLineNumbers();

    editor.selectionStart = 0;
    editor.selectionEnd = 0;
    window.scrollTo(0, 0);
})();
