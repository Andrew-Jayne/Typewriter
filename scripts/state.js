const STATE_DEFAULTS = {
    [StateKey.THEME]: Theme.DAYLIGHT,
    [StateKey.EDITOR_TEXT]: "",
    [StateKey.FILE_NAME]: "untitled.txt",
    [StateKey.MODE]: Mode.EDIT,
    [StateKey.FONT_SIZE]: 16,
    [StateKey.SHOW_LINE_NUMBERS]: false,
    [StateKey.USE_MONOSPACE]: false,
    [StateKey.ENABLE_WIDE_MODE]: false,
    [StateKey.SHOW_TOOLTIPS]: true,
    [StateKey.SHOW_WORD_COUNT]: true,
    [StateKey.DIY_BG]: "#faf9f5",
    [StateKey.DIY_TEXT]: "#141413",
    [StateKey.DIY_ACCENT]: "#d97757",
    [StateKey.DIY_BORDER]: "#e8e6dc",
};

/**
 * @param {{ key: string }} params
 * @returns {string|boolean|number|null}
 */
function getState({ key }) {
    const stored = localStorage.getItem(key);
    switch (stored) {
        case null:
            return STATE_DEFAULTS[key];
        case "true":
            return true;
        case "false":
            return false;
        case "null":
            return null;
        default:
            switch (key) {
                case StateKey.FONT_SIZE:
                    return parseInt(stored, 10);
                default:
                    return stored;
            }
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
            handleThemeChange(value);
            return;
        case StateKey.DIY_BG:
        case StateKey.DIY_TEXT:
        case StateKey.DIY_ACCENT:
        case StateKey.DIY_BORDER:
            validateAndStoreHexColor({ key: key, value: value });
            return;
        case StateKey.SHOW_LINE_NUMBERS:
            validateAndStoreBool({ key: key, value: value });
            handleShowLineNumbers(value);
            return;
        case StateKey.USE_MONOSPACE:
            validateAndStoreBool({ key: key, value: value });
            handleMonospace(value);
            return;
        case StateKey.ENABLE_WIDE_MODE:
            validateAndStoreBool({ key: key, value: value });
            handleWideMode(value);
            return;
        case StateKey.SHOW_TOOLTIPS:
            validateAndStoreBool({ key: key, value: value });
            handleTooltips(value);
            return;
        case StateKey.SHOW_WORD_COUNT:
            validateAndStoreBool({ key: key, value: value });
            handleWordCount(value);
            return;
        case StateKey.FONT_SIZE:
            validateAndStoreFontSize({ key: key, value: value });
            handleFontSizeChange(value);
            return;
        case StateKey.MODE:
            localStorage.setItem(key, String(value));
            handleModeChange(value);
            return;
        default:
            throw new Error("Invalid state key: " + key);
    }
}
