const STATE_DEFAULTS = {
    [StateKey.THEME]: Theme.DAYLIGHT,
    [StateKey.EDITOR_TEXT]: '',
    [StateKey.FILE_NAME]: 'untitled.txt',
    [StateKey.MODE]: Mode.EDIT,
    [StateKey.FONT_SIZE]: '16',
    [StateKey.LINE_NUMBERS]: false,
    [StateKey.MONOSPACE]: false,
    [StateKey.WIDE_MODE]: false,
    [StateKey.TOOLTIPS]: true,
    [StateKey.WORD_COUNT]: true,
    [StateKey.DIY_BG]: '#faf9f5',
    [StateKey.DIY_TEXT]: '#141413',
    [StateKey.DIY_ACCENT]: '#d97757',
    [StateKey.DIY_BORDER]: '#e8e6dc',
    [StateKey.DIY_SAVE]: '#d97757'
};

/**
 * @param {{ key: string }} params
 * @returns {string|boolean|null}
 */
function getState({ key }) {
    const stored = localStorage.getItem(key);
    switch (stored) {
        case null:
            return STATE_DEFAULTS[key];
        case 'true':
            return true;
        case 'false':
            return false;
        case 'null':
            return null;
        default:
            return stored;
    }
}

/**
 * @param {{ key: string, value: string|boolean|null }} params
 */
function setState({ key, value }) {
    localStorage.setItem(key, String(value));

    switch (key) {
        case StateKey.LINE_NUMBERS: {
            const wrap = document.querySelector('.editor-wrap');
            switch (value) {
                case true:
                    document.getElementById('line-numbers').style.display = 'block';
                    wrap.classList.add('no-wrap');
                    return;
                case false:
                    document.getElementById('line-numbers').style.display = 'none';
                    wrap.classList.remove('no-wrap');
                    return;
            }
            return;
        }
        case StateKey.MONOSPACE:
            switch (value) {
                case true:
                    document.getElementById('editor').classList.add('monospace-mode');
                    return;
                case false:
                    document.getElementById('editor').classList.remove('monospace-mode');
                    return;
            }
            return;
        case StateKey.WIDE_MODE:
            switch (value) {
                case true:
                    document.querySelector('.editor-container').classList.add('wide');
                    return;
                case false:
                    document.querySelector('.editor-container').classList.remove('wide');
                    return;
            }
            return;
        case StateKey.TOOLTIPS:
            switch (value) {
                case true:
                    document.body.classList.remove('no-tooltips');
                    return;
                case false:
                    document.body.classList.add('no-tooltips');
                    return;
            }
            return;
        case StateKey.WORD_COUNT:
            switch (value) {
                case true:
                    document.getElementById('word-count').style.display = 'block';
                    return;
                case false:
                    document.getElementById('word-count').style.display = 'none';
                    return;
            }
            return;
        case StateKey.FONT_SIZE:
            switch (getState({ key: StateKey.MODE })) {
                case Mode.EDIT:
                    document.getElementById('editor').style.fontSize = value + 'px';
                    document.getElementById('line-numbers').style.fontSize = value + 'px';
                    return;
                case Mode.VIEW:
                    document.getElementById('view-mode').style.fontSize = value + 'px';
                    return;
            }
            return;
        case StateKey.MODE:
            updateRenderMode();
            return;
    }
}
