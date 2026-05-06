/** Audits localStorage: removes orphaned keys, logs missing keys that will use defaults. */
function validateStorage() {
    const validKeys = new Set(Object.values(StateKey));

    for (let idx = 0; idx < localStorage.length; idx++) {
        const storedKey = localStorage.key(idx);
        if (storedKey.startsWith('tw.') === true && validKeys.has(storedKey) === false) {
            console.warn('Removing orphaned state key: ' + storedKey);
            localStorage.removeItem(storedKey);
        }
    }

    for (const key of validKeys) {
        if (localStorage.getItem(key) === null) {
            console.info('Using default for: ' + key);
        }
    }
}

/**
 * @param {string} hexColor
 * @returns {boolean}
 */
function isValidHexColor(hexColor) {
    return /^#[0-9a-fA-F]{6}$/.test(hexColor);
}

/**
 * @param {{ key: string, value: string }} params
 */
function validateAndStoreHexColor({ key, value }) {
    if (isValidHexColor(value) === false) {
        throw new Error(key + ' requires a valid hex color (#rrggbb), got: ' + value);
    }
    localStorage.setItem(key, value);
}

/**
 * @param {{ key: string, value: boolean }} params
 */
function validateAndStoreBool({ key, value }) {
    switch (value) {
        case true:
            localStorage.setItem(key, 'true');
            return;
        case false:
            localStorage.setItem(key, 'false');
            return;
        default:
            throw new Error(key + ' requires a boolean, got: ' + value);
    }
}

/**
 * @param {{ key: string, value: string|number }} params
 */
function validateAndStoreFontSize({ key, value }) {
    const size = parseInt(value, 10);
    if (Number.isInteger(size) === false || size < 8 || size > 128) {
        throw new Error(key + ' requires an integer between 8 and 128, got: ' + value);
    }
    localStorage.setItem(key, String(size));
}

/** Applies DIY custom color CSS variables from localStorage. */
function applyDiyColors() {
    const body = document.body;
    for (const field of DIY_FIELDS) {
        body.style.setProperty('--diy-' + field, getState({ key: DIY_STATE_KEY[field] }));
    }

    const bg = getState({ key: StateKey.DIY_BG });
    const brightness = parseInt(bg.slice(1, 3), 16) * 0.299 +
        parseInt(bg.slice(3, 5), 16) * 0.587 +
        parseInt(bg.slice(5, 7), 16) * 0.114;

    let hoverShift = 15;
    if (brightness > 128) {
        hoverShift = -15;
    }

    const red = Math.min(255, Math.max(0, parseInt(bg.slice(1, 3), 16) + hoverShift));
    const green = Math.min(255, Math.max(0, parseInt(bg.slice(3, 5), 16) + hoverShift));
    const blue = Math.min(255, Math.max(0, parseInt(bg.slice(5, 7), 16) + hoverShift));
    body.style.setProperty('--diy-hover', `rgb(${red},${green},${blue})`);

    switch (brightness > 128) {
        case true:
            body.style.setProperty('--diy-mid-gray', '#8a8a8a');
            return;
        case false:
            body.style.setProperty('--diy-mid-gray', '#aaaaaa');
            return;
    }
}

/**
 * @param {string} theme - One of Theme enum values
 */
function handleThemeChange(theme) {
    document.body.classList.remove('daylight-mode', 'dawn-mode', 'dusk-mode', 'darkness-mode', 'diy-mode');
    document.body.classList.add(THEME_CLASSES[theme]);
    if (theme === Theme.DIY) {
        applyDiyColors();
    }
    document.getElementById('theme-toggle').innerHTML = themeIcons[theme];
    document.getElementById('theme-toggle').setAttribute('data-tooltip', 'Select theme');
}

/**
 * @param {boolean} visible
 */
function handleShowLineNumbers(visible) {
    if (getState({ key: StateKey.MODE }) === Mode.VIEW) {
        return;
    }
    const wrap = document.querySelector('.edit-mode');
    switch (visible) {
        case true:
            document.getElementById('line-numbers').style.display = 'block';
            wrap.classList.add('no-wrap');
            return;
        case false:
            document.getElementById('line-numbers').style.display = 'none';
            wrap.classList.remove('no-wrap');
            return;
    }
}

/**
 * @param {boolean} enabled
 */
function handleMonospace(enabled) {
    if (getState({ key: StateKey.MODE }) === Mode.VIEW) {
        return;
    }
    switch (enabled) {
        case true:
            document.getElementById('editor').classList.add('monospace-mode');
            return;
        case false:
            document.getElementById('editor').classList.remove('monospace-mode');
            return;
    }
}

/**
 * @param {boolean} enabled
 */
function handleWideMode(enabled) {
    switch (enabled) {
        case true:
            document.getElementById('typewriter-container').classList.add('wide');
            return;
        case false:
            document.getElementById('typewriter-container').classList.remove('wide');
            return;
    }
}

/**
 * @param {boolean} visible
 */
function handleTooltips(visible) {
    switch (visible) {
        case true:
            document.body.classList.remove('no-tooltips');
            return;
        case false:
            document.body.classList.add('no-tooltips');
            return;
    }
}

/**
 * @param {boolean} visible
 */
function handleWordCount(visible) {
    switch (visible) {
        case true:
            document.getElementById('word-count').style.display = 'block';
            return;
        case false:
            document.getElementById('word-count').style.display = 'none';
            return;
    }
}

/**
 * @param {number|string} size - Font size in px
 */
function handleFontSizeChange(size) {
    const px = parseInt(size, 10) + 'px';
    switch (getState({ key: StateKey.MODE })) {
        case Mode.EDIT:
            document.getElementById('editor').style.fontSize = px;
            document.getElementById('line-numbers').style.fontSize = px;
            return;
        case Mode.VIEW:
            document.getElementById('view-mode').style.fontSize = px;
            return;
    }
}

/**
 * @param {string} mode - One of Mode enum values
 */
function handleModeChange(mode) {
    switch (mode) {
        case Mode.VIEW:
            renderViewMode();
            return;
        case Mode.EDIT:
            renderEditMode();
            return;
    }
}

/** Builds and renders the view mode UI. */
function renderViewMode() {
    const container = document.getElementById('typewriter-container');
    const editorText = getState({ key: StateKey.EDITOR_TEXT });
    const fontSize = getState({ key: StateKey.FONT_SIZE });

    container.innerHTML = '';
    const viewDiv = document.createElement('div');
    viewDiv.id = 'view-mode';
    viewDiv.className = 'view-content';
    viewDiv.style.fontSize = fontSize + 'px';
    viewDiv.innerHTML = marked.parse(editorText, { breaks: true, gfm: true });
    container.appendChild(viewDiv);
    document.getElementById('icon-edit-mode').classList.add('hidden');
    document.getElementById('icon-view-mode').classList.remove('hidden');
    document.getElementById('mode-toggle').setAttribute('data-tooltip', 'Switch to editor');
}

/** Builds and renders the edit mode UI. */
function renderEditMode() {
    const container = document.getElementById('typewriter-container');
    const editorText = getState({ key: StateKey.EDITOR_TEXT });
    const fontSize = getState({ key: StateKey.FONT_SIZE });

    container.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'edit-mode';

    const lineNums = document.createElement('div');
    lineNums.className = 'line-numbers';
    lineNums.id = 'line-numbers';

    const textarea = document.createElement('textarea');
    textarea.id = 'editor';
    textarea.placeholder = 'Start writing...';
    textarea.spellcheck = true;
    textarea.value = editorText;
    textarea.style.fontSize = fontSize + 'px';
    lineNums.style.fontSize = fontSize + 'px';

    if (getState({ key: StateKey.USE_MONOSPACE }) === true) {
        textarea.classList.add('monospace-mode');
    }

    const showLineNumbers = getState({ key: StateKey.SHOW_LINE_NUMBERS });
    if (showLineNumbers === true) {
        wrap.classList.add('no-wrap');
    } else {
        lineNums.style.display = 'none';
    }

    wrap.appendChild(lineNums);
    wrap.appendChild(textarea);
    container.appendChild(wrap);

    textarea.addEventListener('input', () => {
        setState({ key: StateKey.EDITOR_TEXT, value: textarea.value });
        updateWordCount();
        updateLineNumbers();
    });

    textarea.addEventListener('scroll', () => {
        lineNums.scrollTop = textarea.scrollTop;
    });

    document.getElementById('icon-edit-mode').classList.remove('hidden');
    document.getElementById('icon-view-mode').classList.add('hidden');
    document.getElementById('mode-toggle').setAttribute('data-tooltip', 'Switch to reader');
    updateLineNumbers();
}

/**
 * @param {{ field: string, hexColor: string }} params
 */
function syncDiyField({ field, hexColor }) {
    document.getElementById('diy-' + field + '-hex').value = hexColor;
    document.getElementById('diy-' + field + '-picker').value = hexColor;
    document.body.style.setProperty('--diy-' + field, hexColor);
}

/**
 * @param {{ field: string, hexColor: string }} params - From native color picker
 */
function handleDiyPickerInput({ field, hexColor }) {
    setState({ key: DIY_STATE_KEY[field], value: hexColor });
    syncDiyField({ field: field, hexColor: hexColor });
    setState({ key: StateKey.THEME, value: Theme.DIY });
}

/**
 * @param {{ field: string, rawInput: string }} params - From hex text input (onchange)
 */
function handleDiyColorInput({ field, rawInput }) {
    const errorEl = document.getElementById('diy-color-error');
    const trimmed = rawInput.trim().toLowerCase();
    const hexMatch = trimmed.match(/^#?([0-9a-f]{6})$/);
    if (hexMatch === null) {
        errorEl.textContent = 'Invalid hex color: ' + rawInput;
        return;
    }
    errorEl.textContent = '';
    const hexColor = '#' + hexMatch[1];
    setState({ key: DIY_STATE_KEY[field], value: hexColor });
    syncDiyField({ field: field, hexColor: hexColor });
    setState({ key: StateKey.THEME, value: Theme.DIY });
}
