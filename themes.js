const THEMES = ['dawn', 'daylight', 'dusk', 'darkness', 'diy'];
const THEME_CLASSES = {
    daylight: null,
    dawn: 'dawn-mode',
    dusk: 'dusk-mode',
    darkness: 'darkness-mode',
    diy: 'diy-mode'
};

const themeIcons = {
    daylight: `{{icon:icons/daylight.svg}}`,
    dawn: `{{icon:icons/dawn.svg}}`,
    dusk: `{{icon:icons/dusk.svg}}`,
    darkness: `{{icon:icons/darkness.svg}}`,
    diy: `{{icon:icons/diy.svg}}`
};

const themeLabels = {
    daylight: 'Daylight',
    dawn: 'Dawn',
    dusk: 'Dusk',
    darkness: 'Darkness',
    diy: 'DIY'
};

const DIY_FIELDS = ['bg', 'text', 'accent', 'border', 'save'];

function applyDiyColors() {
    const body = document.body;
    body.style.setProperty('--diy-bg', getState('tw.diy.bg'));
    body.style.setProperty('--diy-text', getState('tw.diy.text'));
    body.style.setProperty('--diy-accent', getState('tw.diy.accent'));
    body.style.setProperty('--diy-border', getState('tw.diy.border'));
    body.style.setProperty('--diy-save', getState('tw.diy.save'));

    const bg = getState('tw.diy.bg');
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

function applyTheme(theme) {
    document.body.classList.remove('dawn-mode', 'dusk-mode', 'darkness-mode', 'diy-mode');

    const cls = THEME_CLASSES[theme];
    if (cls !== null) {
        document.body.classList.add(cls);
    }

    if (theme === 'diy') {
        applyDiyColors();
    }

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.innerHTML = themeIcons[theme];
    themeToggle.setAttribute('data-tooltip', 'Select theme');

    setState('tw.theme', theme);
}

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

function updatePickerActiveState() {
    const themePickerMenu = document.getElementById('theme-picker-menu');
    const current = getState('tw.theme');
    const options = themePickerMenu.querySelectorAll('.theme-option');
    for (const option of options) {
        option.classList.remove('active');
    }
    const index = THEMES.indexOf(current);
    if (index >= 0) {
        options[index].classList.add('active');
    }
}

function populatePickerIcons() {
    for (const theme of THEMES) {
        const iconEl = document.getElementById('icon-' + theme);
        if (iconEl !== null) {
            iconEl.innerHTML = themeIcons[theme];
        }
    }
}

function selectTheme(theme) {
    const themePickerMenu = document.getElementById('theme-picker-menu');
    themePickerMenu.classList.remove('show');
    applyTheme(theme);
}

function parseColorToHex(value) {
    const hexMatch = value.trim().toLowerCase().match(/^#?([0-9a-f]{6})$/);
    if (hexMatch !== null) {
        return '#' + hexMatch[1];
    }
    return null;
}

function syncDiyField(field, hexValue) {
    document.getElementById('diy-' + field + '-hex').value = hexValue;
    document.getElementById('diy-' + field + '-picker').value = hexValue;
    document.body.style.setProperty('--diy-' + field, hexValue);
}

function handleDiyPickerInput(field, value) {
    setState('tw.diy.' + field, value);
    syncDiyField(field, value);
    applyTheme('diy');
}

function handleDiyColorInput(field, value) {
    const hex = parseColorToHex(value);
    if (hex !== null) {
        setState('tw.diy.' + field, hex);
        document.getElementById('diy-' + field + '-picker').value = hex;
        document.body.style.setProperty('--diy-' + field, hex);
        applyTheme('diy');
    }
}
