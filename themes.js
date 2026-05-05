const THEMES = [Theme.DAWN, Theme.DAYLIGHT, Theme.DUSK, Theme.DARKNESS, Theme.DIY];
const THEME_CLASSES = {
    [Theme.DAYLIGHT]: 'daylight-mode',
    [Theme.DAWN]: 'dawn-mode',
    [Theme.DUSK]: 'dusk-mode',
    [Theme.DARKNESS]: 'darkness-mode',
    [Theme.DIY]: 'diy-mode'
};

const themeIcons = {
    [Theme.DAYLIGHT]: `{{icon:icons/daylight.svg}}`,
    [Theme.DAWN]: `{{icon:icons/dawn.svg}}`,
    [Theme.DUSK]: `{{icon:icons/dusk.svg}}`,
    [Theme.DARKNESS]: `{{icon:icons/darkness.svg}}`,
    [Theme.DIY]: `{{icon:icons/diy.svg}}`
};

/** Applies DIY custom color CSS variables from localStorage. */
function applyDiyColors() {
    const body = document.body;
    for (const field of DIY_FIELDS) {
        body.style.setProperty('--diy-' + field, getState({ key: 'tw.diy.' + field }));
    }

    const bg = getState({ key: 'tw.diy.bg' });
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

    if (brightness > 128) {
        body.style.setProperty('--diy-mid-gray', '#8a8a8a');
    } else {
        body.style.setProperty('--diy-mid-gray', '#aaaaaa');
    }
}

/**
 * @param {string} theme - One of Theme enum values
 */
function applyTheme(theme) {
    document.body.classList.remove('daylight-mode', 'dawn-mode', 'dusk-mode', 'darkness-mode', 'diy-mode');
    document.body.classList.add(THEME_CLASSES[theme]);

    if (theme === Theme.DIY) {
        applyDiyColors();
    }

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.innerHTML = themeIcons[theme];
    themeToggle.setAttribute('data-tooltip', 'Select theme');

    setState({ key: StateKey.THEME, value: theme });
}

/** Toggles the theme picker dropdown open/closed. */
function toggleThemePicker() {
    const themePickerMenu = document.getElementById('theme-picker-menu');
    const isOpen = themePickerMenu.classList.contains('show');
    if (isOpen === true) {
        themePickerMenu.classList.remove('show');
    } else {
        updatePickerActiveState();
        themePickerMenu.classList.add('show');
    }
}

/** Highlights the currently active theme in the picker menu. */
function updatePickerActiveState() {
    const themePickerMenu = document.getElementById('theme-picker-menu');
    const current = getState({ key: StateKey.THEME });
    const options = themePickerMenu.querySelectorAll('.theme-option');
    for (const option of options) {
        option.classList.remove('active');
    }
    const index = THEMES.indexOf(current);
    if (index >= 0) {
        options[index].classList.add('active');
    }
}

/**
 * @param {{ theme: string }} params
 */
function selectTheme({ theme }) {
    const themePickerMenu = document.getElementById('theme-picker-menu');
    themePickerMenu.classList.remove('show');
    applyTheme(theme);
}

/**
 * @param {string} value - Hex color string to parse
 * @returns {string|null} Normalized hex string (#rrggbb) or null if invalid
 */
function parseColorToHex(value) {
    const hexMatch = value.trim().toLowerCase().match(/^#?([0-9a-f]{6})$/);
    if (hexMatch !== null) {
        return '#' + hexMatch[1];
    }
    return null;
}

/**
 * @param {{ field: string, hexValue: string }} params
 */
function syncDiyField({ field, hexValue }) {
    document.getElementById('diy-' + field + '-hex').value = hexValue;
    document.getElementById('diy-' + field + '-picker').value = hexValue;
    document.body.style.setProperty('--diy-' + field, hexValue);
}

/**
 * @param {{ field: string, value: string }} params
 */
function handleDiyPickerInput({ field, value }) {
    setState({ key: 'tw.diy.' + field, value: value });
    syncDiyField({ field: field, hexValue: value });
    applyTheme(Theme.DIY);
}

/**
 * @param {{ field: string, value: string }} params
 */
function handleDiyColorInput({ field, value }) {
    const hex = parseColorToHex(value);
    if (hex !== null) {
        setState({ key: 'tw.diy.' + field, value: hex });
        document.getElementById('diy-' + field + '-picker').value = hex;
        document.body.style.setProperty('--diy-' + field, hex);
        applyTheme(Theme.DIY);
    }
}
