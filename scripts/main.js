/** Initializes the app: validates storage, wires up event listeners, restores state. */
function main() {
    validateStorage();

    /* Event listeners */

    document.addEventListener('fullscreenchange', () => {
        syncFullscreenIcon();
    });

    document.addEventListener('keydown', (keyEvent) => {
        if (keyEvent.repeat === true) {
            return;
        }
        const modifierHeld = keyEvent.metaKey === true || keyEvent.ctrlKey === true;
        if (keyEvent.key === 'Tab' && getState({ key: StateKey.MODE }) === Mode.EDIT) {
            keyEvent.preventDefault();
            const textarea = document.getElementById('typewriter-container').querySelector('textarea');
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            textarea.value = textarea.value.substring(0, start) + '\t' + textarea.value.substring(end);
            textarea.selectionStart = start + 1;
            textarea.selectionEnd = start + 1;
            setState({ key: StateKey.EDITOR_TEXT, value: textarea.value });
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

    setState({ key: StateKey.ENABLE_WIDE_MODE, value: getState({ key: StateKey.ENABLE_WIDE_MODE }) });
    setState({ key: StateKey.SHOW_TOOLTIPS, value: getState({ key: StateKey.SHOW_TOOLTIPS }) });
    setState({ key: StateKey.SHOW_WORD_COUNT, value: getState({ key: StateKey.SHOW_WORD_COUNT }) });
    setState({ key: StateKey.THEME, value: getState({ key: StateKey.THEME }) });
    setState({ key: StateKey.MODE, value: getState({ key: StateKey.MODE }) });

    updateWordCount();
    window.scrollTo(0, 0);
}

main();
