const editor = document.getElementById('editor');
const wordCount = document.getElementById('word-count');
const toast = document.getElementById('toast');
const themeToggle = document.getElementById('theme-toggle');
const fontSizeDisplay = document.getElementById('font-size-display');
const fileInput = document.getElementById('file-input');

let currentFontSize = 16;
let currentFileName = '';
let currentTheme = 'light';
let isViewMode = false;

const themeIcons = {
    light: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>`,
    warm: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
    </svg>`,
    'soft-dark': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>`,
    dark: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>`
};

const themeLabels = {
    light: 'Light mode',
    warm: 'Warm mode',
    'soft-dark': 'Soft dark mode',
    dark: 'Dark mode'
};

function markdownToHtml(markdown) {
    let html = markdown;

    html = html.replace(/^\### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^\## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');

    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

    html = html.replace(/^\> (.*?)$/gm, '<blockquote>$1</blockquote>');

    const lines = html.split('\n');
    let inList = false;
    let listHtml = '';
    let result = [];

    for (let line of lines) {
        if (/^[\-\*\+] /.test(line)) {
            if (!inList) {
                inList = true;
                listHtml = '<ul>\n';
            }
            listHtml += '<li>' + line.replace(/^[\-\*\+] /, '') + '</li>\n';
        } else {
            if (inList) {
                listHtml += '</ul>';
                result.push(listHtml);
                listHtml = '';
                inList = false;
            }
            if (line.trim()) {
                if (!line.startsWith('<')) result.push('<p>' + line + '</p>');
                else result.push(line);
            }
        }
    }
    if (inList) {
        listHtml += '</ul>';
        result.push(listHtml);
    }

    return result.join('\n');
}

function toggleViewMode() {
    isViewMode = !isViewMode;
    const container = document.querySelector('.editor-container');

    if (isViewMode) {
        const rendered = markdownToHtml(editor.value);
        const viewDiv = document.createElement('div');
        viewDiv.id = 'view-mode';
        viewDiv.className = 'view-content';
        viewDiv.innerHTML = rendered;

        editor.style.display = 'none';
        container.appendChild(viewDiv);
        toast.textContent = 'View mode';
    } else {
        const viewDiv = document.getElementById('view-mode');
        if (viewDiv) viewDiv.remove();
        editor.style.display = 'block';
        toast.textContent = 'Edit mode';
    }

    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 1500);
}

window.addEventListener('load', () => {
    const savedText = localStorage.getItem('editorText');
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedFontSize = localStorage.getItem('fontSize');

    if (savedText) {
        editor.value = savedText;
        updateWordCount();
    }

    applyTheme(savedTheme);

    if (savedFontSize) {
        currentFontSize = parseInt(savedFontSize);
        editor.style.fontSize = currentFontSize + 'px';
        fontSizeDisplay.textContent = currentFontSize + 'px';
    }
});

editor.addEventListener('input', () => {
    localStorage.setItem('editorText', editor.value);
    updateWordCount();
});

function updateWordCount() {
    const text = editor.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = editor.value.length;
    wordCount.textContent = `${words} words · ${chars} characters`;
}

function applyTheme(theme) {
    document.body.classList.remove('dark-mode', 'warm-mode', 'soft-dark-mode');

    currentTheme = theme;
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else if (theme === 'warm') {
        document.body.classList.add('warm-mode');
    } else if (theme === 'soft-dark') {
        document.body.classList.add('soft-dark-mode');
    }

    themeToggle.innerHTML = themeIcons[theme];
    themeToggle.title = themeLabels[theme];

    localStorage.setItem('theme', theme);
}

function cycleTheme() {
    const themes = ['light', 'warm', 'soft-dark', 'dark'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    applyTheme(nextTheme);
}

function changeFontSize(delta) {
    currentFontSize = Math.max(12, Math.min(24, currentFontSize + delta));
    editor.style.fontSize = currentFontSize + 'px';
    fontSizeDisplay.textContent = currentFontSize + 'px';
    localStorage.setItem('fontSize', currentFontSize);
}

function clearText() {
    if (editor.value.trim() === '' || confirm('Are you sure you want to clear all text?')) {
        editor.value = '';
        localStorage.removeItem('editorText');
        currentFileName = '';
        updateWordCount();
    }
}

function openFile() {
    fileInput.click();
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    currentFileName = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
        editor.value = e.target.result;
        localStorage.setItem('editorText', editor.value);
        updateWordCount();

        toast.textContent = `Opened: ${file.name}`;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            toast.textContent = 'File saved!';
        }, 2000);
    };
    reader.readAsText(file);

    fileInput.value = '';
}

function saveFile() {
    const text = editor.value;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    if (currentFileName) {
        a.download = currentFileName;
    } else {
        const date = new Date();
        const dateStr = date.toISOString().split('T')[0];
        a.download = `note-${dateStr}.md`;
    }

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        saveFile();
    }

    if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        cycleTheme();
    }

    if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
        e.preventDefault();
        toggleViewMode();
    }
});

updateWordCount();
