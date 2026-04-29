const DEFAULTS = {
    'tw.theme': 'daylight',
    'tw.editorText': '',
    'tw.fileName': 'untitled.txt',
    'tw.mode': 'edit',
    'tw.lineNumbers': 'true',
    'tw.monospace': 'false',
    'tw.diy.bg': '#faf9f5',
    'tw.diy.text': '#141413',
    'tw.diy.accent': '#d97757',
    'tw.diy.border': '#e8e6dc',
    'tw.diy.save': '#d97757'
};

function getState(key) {
    const stored = localStorage.getItem(key);
    if (stored !== null) {
        return stored;
    }
    return DEFAULTS[key];
}

function setState(key, value) {
    localStorage.setItem(key, value);
}

const THEMES = ['daylight', 'dawn', 'dusk', 'darkness', 'diy'];
const THEME_CLASSES = {
    daylight: null,
    dawn: 'dawn-mode',
    dusk: 'dusk-mode',
    darkness: 'darkness-mode',
    diy: 'diy-mode'
};

const themeIcons = {
    daylight: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>`,
    dawn: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 20h18" />
    </svg>`,
    dusk: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 19h18" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 16a5 5 0 0 0 5-5h-2.25M12 16a5 5 0 0 1-5-5h2.25M12 16v2" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v1.5m4.5.75-1.06 1.06M19 11h-1.5m-11 0H5m2.56-2.69L6.5 7.25" />
    </svg>`,
    darkness: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M16 4l.5 1 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5zM20 8l.5 1 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5z" />
    </svg>`,
    diy: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
    </svg>`
};

const themeLabels = {
    daylight: 'Daylight',
    dawn: 'Dawn',
    dusk: 'Dusk',
    darkness: 'Darkness',
    diy: 'DIY'
};

const editor = document.getElementById('editor');
const wordCount = document.getElementById('word-count');
const themeToggle = document.getElementById('theme-toggle');
const fileInput = document.getElementById('file-input');
const settingsModal = document.getElementById('settings-modal');
const themePickerMenu = document.getElementById('theme-picker-menu');
const lineNumbers = document.getElementById('line-numbers');

const MODES = ['edit', 'view'];

function updateLineNumbers() {
    const lines = editor.value.split('\n').length;
    let nums = '';
    for (let idx = 1; idx <= lines; idx++) {
        if (idx > 1) {
            nums += '\n';
        }
        nums += String(idx);
    }
    lineNumbers.textContent = nums;
}

function updateWordCount() {
    const text = editor.value.trim();
    let words = 0;
    if (text.length > 0) {
        words = text.split(/\s+/).length;
    }
    wordCount.textContent = `${words} words · ${editor.value.length} characters`;
}

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

    themeToggle.innerHTML = themeIcons[theme];
    themeToggle.title = themeLabels[theme];

    setState('tw.theme', theme);
}

function toggleThemePicker() {
    const isOpen = themePickerMenu.classList.contains('show');
    if (isOpen === true) {
        themePickerMenu.classList.remove('show');
    } else {
        updatePickerActiveState();
        themePickerMenu.classList.add('show');
    }
}

function updatePickerActiveState() {
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
    themePickerMenu.classList.remove('show');
    if (theme === 'diy') {
        applyTheme('diy');
        toggleSettings();
        return;
    }
    applyTheme(theme);

}

const DIY_FIELDS = ['bg', 'text', 'accent', 'border', 'save'];

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


function toggleSettings() {
    const isOpen = settingsModal.classList.contains('show');
    if (isOpen === true) {
        settingsModal.classList.remove('show');
    } else {
        document.getElementById('toggle-line-numbers').checked = getState('tw.lineNumbers') === 'true';
        document.getElementById('toggle-monospace').checked = getState('tw.monospace') === 'true';
        for (const field of DIY_FIELDS) {
            syncDiyField(field, getState('tw.diy.' + field));
        }
        settingsModal.classList.add('show');
    }
}

function closeSettings() {
    settingsModal.classList.remove('show');
}

function toggleLineNumbers(checked) {
    if (checked === true) {
        setState('tw.lineNumbers', 'true');
        lineNumbers.style.display = 'block';
    } else {
        setState('tw.lineNumbers', 'false');
        lineNumbers.style.display = 'none';
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


function clearText() {
    if (editor.value.trim() === '' || confirm('Are you sure you want to clear all text?') === true) {
        editor.value = '';
        setState('tw.editorText', '');
        setState('tw.fileName', 'untitled.txt');
        updateWordCount();
    }
}

function openFile() {
    fileInput.click();
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file === undefined) {
        return;
    }

    setState('tw.fileName', file.name);

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
        const normalized = loadEvent.target.result.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        editor.value = normalized;
        setState('tw.editorText', normalized);
        updateWordCount();

    };
    reader.readAsText(file);
    fileInput.value = '';
}

function saveFile() {
    const fileName = prompt('Save as:', getState('tw.fileName'));
    if (fileName === null || fileName.trim().length === 0) {
        return;
    }
    setState('tw.fileName', fileName.trim());
    const blob = new Blob([editor.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = fileName.trim();
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
}

function markdownToHtml(markdown) {
    return marked.parse(markdown, { breaks: true, gfm: true });
}

function updateModeIcon(mode) {
    const editIcon = document.getElementById('icon-edit-mode');
    const viewIcon = document.getElementById('icon-view-mode');
    const toggle = document.getElementById('mode-toggle');

    if (mode === 'view') {
        editIcon.classList.add('hidden');
        viewIcon.classList.remove('hidden');
        toggle.title = 'View mode';
    } else {
        editIcon.classList.remove('hidden');
        viewIcon.classList.add('hidden');
        toggle.title = 'Edit mode';
    }
}

function flashModeToggle() {
    const toggle = document.getElementById('mode-toggle');
    toggle.classList.add('flash');
    setTimeout(() => toggle.classList.remove('flash'), 400);
}

function toggleMode() {
    const current = getState('tw.mode');
    const next = MODES[(MODES.indexOf(current) + 1) % MODES.length];
    setState('tw.mode', next);
    renderMode(next);
    flashModeToggle();
}

function renderMode(mode) {
    const container = document.querySelector('.editor-container');
    const existing = document.getElementById('view-mode');

    if (existing !== null) {
        existing.remove();
    }

    if (mode === 'view') {
        const rendered = markdownToHtml(editor.value);
        const viewDiv = document.createElement('div');
        viewDiv.id = 'view-mode';
        viewDiv.className = 'view-content';
        viewDiv.innerHTML = rendered;
        container.appendChild(viewDiv);
        editor.style.display = 'none';
        lineNumbers.style.display = 'none';
    } else {
        editor.style.display = 'block';
        if (getState('tw.lineNumbers') === 'true') {
            lineNumbers.style.display = 'block';
        } else {
            lineNumbers.style.display = 'none';
        }
    }

    updateModeIcon(mode);
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
        themePickerMenu.classList.remove('show');
    }
});


(function init() {
    editor.value = getState('tw.editorText');

    populatePickerIcons();
    applyTheme(getState('tw.theme'));

    if (getState('tw.lineNumbers') === 'false') {
        lineNumbers.style.display = 'none';
    }

    if (getState('tw.monospace') === 'true') {
        editor.classList.add('monospace-mode');
    }

    const mode = getState('tw.mode');
    if (mode === 'edit') {
        updateModeIcon('edit');
    } else {
        renderMode(mode);
    }

    updateWordCount();
    updateLineNumbers();

    editor.selectionStart = 0;
    editor.selectionEnd = 0;
    window.scrollTo(0, 0);
})();
