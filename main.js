/** Initializes the app: wires up event listeners, restores state from localStorage, applies settings. */
function main() {
    /* Event listeners */

    document.getElementById('editor').addEventListener('input', () => {
        setState({ key: StateKey.EDITOR_TEXT, value: document.getElementById('editor').value });
        updateWordCount();
        updateLineNumbers();
    });

    document.getElementById('editor').addEventListener('scroll', () => {
        document.getElementById('line-numbers').scrollTop = document.getElementById('editor').scrollTop;
    });

    document.addEventListener('fullscreenchange', () => {
        updateFullscreenIcon();
    });

    document.addEventListener('keydown', (keyEvent) => {
        if (keyEvent.repeat === true) {
            return;
        }
        const modifierHeld = keyEvent.metaKey === true || keyEvent.ctrlKey === true;
        const editorEl = document.getElementById('editor');

        if (keyEvent.key === 'Tab' && keyEvent.target === editorEl) {
            keyEvent.preventDefault();
            const start = editorEl.selectionStart;
            const end = editorEl.selectionEnd;
            editorEl.value = editorEl.value.substring(0, start) + '\t' + editorEl.value.substring(end);
            editorEl.selectionStart = start + 1;
            editorEl.selectionEnd = start + 1;
            setState({ key: StateKey.EDITOR_TEXT, value: editorEl.value });
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
        if (modifierHeld === true && keyEvent.key === ',') {
            keyEvent.preventDefault();
            toggleSettings();
        }
    });

    document.addEventListener('click', (clickEvent) => {
        const picker = document.getElementById('theme-picker');
        if (picker.contains(clickEvent.target) === false) {
            document.getElementById('theme-picker-menu').classList.remove('show');
        }
    });

    /* Restore state */

    const editorEl = document.getElementById('editor');
    editorEl.value = getState({ key: StateKey.EDITOR_TEXT });

    const fontSize = getState({ key: StateKey.FONT_SIZE });
    editorEl.style.fontSize = fontSize + 'px';
    document.getElementById('line-numbers').style.fontSize = fontSize + 'px';

    const showLineNumbers = getState({ key: StateKey.LINE_NUMBERS });
    if (showLineNumbers === true) {
        document.querySelector('.editor-wrap').classList.add('no-wrap');
    } else {
        document.getElementById('line-numbers').style.display = 'none';
    }

    if (getState({ key: StateKey.MONOSPACE }) === true) {
        editorEl.classList.add('monospace-mode');
    }

    if (getState({ key: StateKey.WIDE_MODE }) === true) {
        document.querySelector('.editor-container').classList.add('wide');
    }

    if (getState({ key: StateKey.TOOLTIPS }) === false) {
        document.body.classList.add('no-tooltips');
    }

    if (getState({ key: StateKey.WORD_COUNT }) === false) {
        document.getElementById('word-count').style.display = 'none';
    }

    applyTheme(getState({ key: StateKey.THEME }));

    const initMode = getState({ key: StateKey.MODE });
    switch (initMode) {
        case Mode.EDIT:
            updateModeIcon(Mode.EDIT);
            break;
        case Mode.VIEW:
            setState({ key: StateKey.MODE, value: Mode.VIEW });
            break;
    }
    updateWordCount();
    updateLineNumbers();

    editorEl.selectionStart = 0;
    editorEl.selectionEnd = 0;
    window.scrollTo(0, 0);
}

main();
