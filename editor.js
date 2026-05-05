const editor = document.getElementById('editor');
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
    const wordCount = document.getElementById('word-count');
    wordCount.textContent = `${words} words · ${editor.value.length} characters`;
}

function markdownToHtml(markdown) {
    return marked.parse(markdown, { breaks: true, gfm: true });
}

function updateModeIcon(mode) {
    const editIcon = document.getElementById('icon-edit-mode');
    const viewIcon = document.getElementById('icon-view-mode');
    const toggle = document.getElementById('mode-toggle');

    switch (mode) {
        case 'view':
            editIcon.classList.add('hidden');
            viewIcon.classList.remove('hidden');
            toggle.setAttribute('data-tooltip', 'Switch to editor');
            break;
        case 'edit':
            editIcon.classList.remove('hidden');
            viewIcon.classList.add('hidden');
            toggle.setAttribute('data-tooltip', 'Switch to reader');
            break;
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

    switch (mode) {
        case 'view': {
            const rendered = markdownToHtml(editor.value);
            const viewDiv = document.createElement('div');
            viewDiv.id = 'view-mode';
            viewDiv.className = 'view-content';
            viewDiv.style.fontSize = getState('tw.fontSize') + 'px';
            viewDiv.innerHTML = rendered;
            container.appendChild(viewDiv);
            editor.style.display = 'none';
            lineNumbers.style.display = 'none';
            break;
        }
        case 'edit':
            editor.style.display = 'block';
            if (getState('tw.lineNumbers') === 'true') {
                lineNumbers.style.display = 'block';
            } else {
                lineNumbers.style.display = 'none';
            }
            break;
    }

    updateModeIcon(mode);
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
    document.getElementById('file-input').click();
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
        updateLineNumbers();
    };
    reader.readAsText(file);
    document.getElementById('file-input').value = '';
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
