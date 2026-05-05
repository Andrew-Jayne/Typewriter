/** Toggles the toolbar between collapsed (hamburger) and expanded states. */
function toggleToolbar() {
    document.getElementById('toolbar').classList.toggle('collapsed');
}

/**
 * @param {{ checked: boolean }} params
 */
function toggleFocusMode({ checked }) {
    const toolbar = document.getElementById('toolbar');
    if (checked === true) {
        toolbar.style.display = 'none';
    } else {
        toolbar.style.display = 'flex';
    }
}

/** Toggles browser fullscreen mode. */
function toggleFullscreen() {
    if (document.fullscreenElement === null) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

/** Swaps the fullscreen icon between enter/exit states. */
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

/** Opens or closes the settings modal, syncing all controls to current state. */
function toggleSettings() {
    const modal = document.getElementById('settings-modal');
    const isOpen = modal.classList.contains('show');
    if (isOpen === true) {
        modal.classList.remove('show');
    } else {
        const showLineNumbers = getState({ key: StateKey.LINE_NUMBERS });
        const showMonospace = getState({ key: StateKey.MONOSPACE });
        const showWideMode = getState({ key: StateKey.WIDE_MODE });
        const showTooltips = getState({ key: StateKey.TOOLTIPS });
        const showWordCount = getState({ key: StateKey.WORD_COUNT });

        document.getElementById('setting-font-size').value = getState({ key: StateKey.FONT_SIZE });
        document.getElementById('toggle-line-numbers').checked = showLineNumbers;
        document.getElementById('toggle-monospace').checked = showMonospace;
        document.getElementById('toggle-wide').checked = showWideMode;
        document.getElementById('toggle-tooltips').checked = showTooltips;
        document.getElementById('toggle-word-count').checked = showWordCount;
        document.getElementById('toggle-focus-mode').checked = document.getElementById('toolbar').style.display === 'none';
        for (const field of DIY_FIELDS) {
            syncDiyField({ field: field, hexValue: getState({ key: 'tw.diy.' + field }) });
        }
        modal.classList.add('show');
    }
}

/** Closes the settings modal. */
function closeSettings() {
    document.getElementById('settings-modal').classList.remove('show');
}

/**
 * @param {MouseEvent} clickEvent
 */
function closeSettingsOnOverlay(clickEvent) {
    const modal = document.getElementById('settings-modal');
    if (clickEvent.target === modal) {
        closeSettings();
    }
}

/** @param {{ checked: boolean }} params */
function toggleLineNumbers({ checked }) {
    setState({ key: StateKey.LINE_NUMBERS, value: checked });
}

/** @param {{ checked: boolean }} params */
function toggleMonospace({ checked }) {
    setState({ key: StateKey.MONOSPACE, value: checked });
}

/** @param {{ checked: boolean }} params */
function toggleWideMode({ checked }) {
    setState({ key: StateKey.WIDE_MODE, value: checked });
}

/** @param {{ checked: boolean }} params */
function toggleTooltips({ checked }) {
    setState({ key: StateKey.TOOLTIPS, value: checked });
}

/** @param {{ checked: boolean }} params */
function toggleWordCount({ checked }) {
    setState({ key: StateKey.WORD_COUNT, value: checked });
}

/** @param {{ value: string }} params */
function setFontSize({ value }) {
    const size = Math.max(8, Math.min(72, parseInt(value, 10)));
    setState({ key: StateKey.FONT_SIZE, value: String(size) });
}
