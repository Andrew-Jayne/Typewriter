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
    switch (key) {
        case StateKey.EDITOR_TEXT:
            localStorage.setItem(key, String(value));
            return;

        case StateKey.FILE_NAME:
            localStorage.setItem(key, String(value));
            return;

        case StateKey.THEME:
            localStorage.setItem(key, String(value));
            return;

        case StateKey.DIY_BG:
            localStorage.setItem(key, String(value));
            return;

        case StateKey.DIY_TEXT:
            localStorage.setItem(key, String(value));
            return;

        case StateKey.DIY_ACCENT:
            localStorage.setItem(key, String(value));
            return;

        case StateKey.DIY_BORDER:
            localStorage.setItem(key, String(value));
            return;

        case StateKey.DIY_SAVE:
            localStorage.setItem(key, String(value));
            return;

        case StateKey.LINE_NUMBERS: {
            const wrap = document.querySelector('.editor-wrap');
            switch (value) {
                case true:
                    localStorage.setItem(key, 'true');
                    document.getElementById('line-numbers').style.display = 'block';
                    wrap.classList.add('no-wrap');
                    return;
                case false:
                    localStorage.setItem(key, 'false');
                    document.getElementById('line-numbers').style.display = 'none';
                    wrap.classList.remove('no-wrap');
                    return;
                default:
                    throw new Error(key + ' requires a boolean, got: ' + value);
            }
        }
        case StateKey.MONOSPACE:
            switch (value) {
                case true:
                    localStorage.setItem(key, 'true');
                    document.getElementById('editor').classList.add('monospace-mode');
                    return;
                case false:
                    localStorage.setItem(key, 'false');
                    document.getElementById('editor').classList.remove('monospace-mode');
                    return;
                default:
                    throw new Error(key + ' requires a boolean, got: ' + value);
            }
        case StateKey.WIDE_MODE:
            switch (value) {
                case true:
                    localStorage.setItem(key, 'true');
                    document.querySelector('.editor-container').classList.add('wide');
                    return;
                case false:
                    localStorage.setItem(key, 'false');
                    document.querySelector('.editor-container').classList.remove('wide');
                    return;
                default:
                    throw new Error(key + ' requires a boolean, got: ' + value);
            }
        case StateKey.TOOLTIPS:
            switch (value) {
                case true:
                    localStorage.setItem(key, 'true');
                    document.body.classList.remove('no-tooltips');
                    return;
                case false:
                    localStorage.setItem(key, 'false');
                    document.body.classList.add('no-tooltips');
                    return;
                default:
                    throw new Error(key + ' requires a boolean, got: ' + value);
            }
        case StateKey.WORD_COUNT:
            switch (value) {
                case true:
                    localStorage.setItem(key, 'true');
                    document.getElementById('word-count').style.display = 'block';
                    return;
                case false:
                    localStorage.setItem(key, 'false');
                    document.getElementById('word-count').style.display = 'none';
                    return;
                default:
                    throw new Error(key + ' requires a boolean, got: ' + value);
            }
        case StateKey.FONT_SIZE:
            localStorage.setItem(key, String(value));
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
        case StateKey.MODE: {
            localStorage.setItem(key, String(value));
            const container = document.querySelector('.editor-container');
            switch (value) {
                case Mode.VIEW: {
                    document.getElementById('editor').style.display = 'none';
                    document.getElementById('line-numbers').style.display = 'none';
                    const viewDiv = document.createElement('div');
                    viewDiv.id = 'view-mode';
                    viewDiv.className = 'view-content';
                    viewDiv.style.fontSize = getState({ key: StateKey.FONT_SIZE }) + 'px';
                    viewDiv.innerHTML = marked.parse(document.getElementById('editor').value, { breaks: true, gfm: true });
                    container.appendChild(viewDiv);
                    updateModeIcon(value);
                    return;
                }
                case Mode.EDIT: {
                    document.getElementById('view-mode').remove();
                    document.getElementById('editor').style.display = 'block';
                    if (getState({ key: StateKey.LINE_NUMBERS }) === true) {
                        document.getElementById('line-numbers').style.display = 'block';
                    } else {
                        document.getElementById('line-numbers').style.display = 'none';
                    }
                    updateModeIcon(value);
                    return;
                }
            }
            return;
        }
        default:
            throw new Error('Invalid state key: ' + key);
    }
}
