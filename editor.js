/** Updates the line number gutter to match the editor content. */
function updateLineNumbers() {
    const lines = document.getElementById('editor').value.split('\n').length;
    let nums = '';
    for (let idx = 1; idx <= lines; idx++) {
        if (idx > 1) {
            nums += '\n';
        }
        nums += String(idx);
    }
    document.getElementById('line-numbers').textContent = nums;
}

/** Updates the word and character count display. */
function updateWordCount() {
    const editorEl = document.getElementById('editor');
    const text = editorEl.value.trim();
    let word_count = 0;
    if (text.length > 0) {
        word_count = text.split(/\s+/).length;
    }
    document.getElementById('word-count').textContent = `${word_count} words · ${editorEl.value.length} characters`;
}

/**
 * @param {string} mode - One of Mode enum values
 */
function updateModeIcon(mode) {
    const editIcon = document.getElementById('icon-edit-mode');
    const viewIcon = document.getElementById('icon-view-mode');
    const toggle = document.getElementById('mode-toggle');

    switch (mode) {
        case Mode.VIEW:
            editIcon.classList.add('hidden');
            viewIcon.classList.remove('hidden');
            toggle.setAttribute('data-tooltip', 'Switch to editor');
            return;
        case Mode.EDIT:
            editIcon.classList.remove('hidden');
            viewIcon.classList.add('hidden');
            toggle.setAttribute('data-tooltip', 'Switch to reader');
            return;
    }
}


/** Toggles between edit and view mode. */
function toggleMode() {
    const flashModeToggle = () => {
        const modeToggle = document.getElementById('mode-toggle');
        modeToggle.classList.add('flash');
        setTimeout(() => modeToggle.classList.remove('flash'), 400);
    };
    const current = getState({ key: StateKey.MODE });
    switch (current) {
        case Mode.EDIT:
            setState({ key: StateKey.MODE, value: Mode.VIEW });
            flashModeToggle();
            return;
        case Mode.VIEW:
            setState({ key: StateKey.MODE, value: Mode.EDIT });
            flashModeToggle();
            return;
    }
}

/** Renders the UI based on the current mode in state. */
function updateRenderMode() {
    const mode = getState({ key: StateKey.MODE });
    const container = document.querySelector('.editor-container');

    switch (mode) {
        case Mode.VIEW: {
            document.getElementById('editor').style.display = 'none';
            document.getElementById('line-numbers').style.display = 'none';
            const viewDiv = document.createElement('div');
            viewDiv.id = 'view-mode';
            viewDiv.className = 'view-content';
            viewDiv.style.fontSize = getState({ key: StateKey.FONT_SIZE }) + 'px';
            viewDiv.innerHTML = marked.parse(document.getElementById('editor').value, { breaks: true, gfm: true });
            container.appendChild(viewDiv);
            updateModeIcon(mode);
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
            updateModeIcon(mode);
            return;
        }
    }
}

/** Clears the editor content after confirmation, resets to edit mode. */
function clearText() {
    if (document.getElementById('editor').value.trim() === '') {
        return
    }
    if (confirm('Are you sure you want to clear all text?') === true) {
        document.getElementById('editor').value = '';
        setState({ key: StateKey.EDITOR_TEXT, value: '' });
        setState({ key: StateKey.FILE_NAME, value: 'untitled.txt' });
        setState({ key: StateKey.MODE, value: Mode.EDIT });
        updateWordCount();
        updateLineNumbers();
    }
}

/** Opens the file picker dialog. */
function openFile() {
    document.getElementById('file-input').click();
}

/**
 * @param {Event} event - The file input change event
 */
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file === undefined) {
        return;
    }

    setState({ key: StateKey.FILE_NAME, value: file.name });

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
        const normalized = loadEvent.target.result.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        document.getElementById('editor').value = normalized;
        setState({ key: StateKey.EDITOR_TEXT, value: normalized });
        updateWordCount();
        updateLineNumbers();
    };
    reader.readAsText(file);
    document.getElementById('file-input').value = '';
}

/** Prompts for a filename and downloads the editor content as a file. */
function saveFile() {
    const fileName = prompt('Save as:', getState({ key: StateKey.FILE_NAME }));
    if (fileName === null || fileName.trim().length === 0) {
        return;
    }
    setState({ key: StateKey.FILE_NAME, value: fileName.trim() });
    const blob = new Blob([document.getElementById('editor').value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = fileName.trim();
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
}
