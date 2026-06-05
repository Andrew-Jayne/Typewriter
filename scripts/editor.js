/** Updates the line number gutter to match the editor content. */
function updateLineNumbers() {
  const TEXT = getState({ key: StateKey.EDITOR_TEXT });
  const lineNumEl = document.getElementById("line-numbers");
  if (lineNumEl === null) {
    return;
  }

  let nums = "";
  for (let idx = 1; idx <= TEXT.split("\n").length; idx++) {
    if (idx > 1) {
      nums += "\n";
    }
    nums += String(idx);
  }
  lineNumEl.textContent = nums;
}

/** Updates the word and character count display. */
function updateWordCount() {
  const text = getState({ key: StateKey.EDITOR_TEXT });
  const trimmed = text.trim();
  let word_count = 0;
  if (trimmed.length > 0) {
    word_count = trimmed.split(/\s+/).length;
  }
  document.getElementById("word-count").textContent =
    `${word_count} words · ${text.length} characters`;
}

/** Toggles between edit and view mode. */
function toggleMode() {
  const flashModeToggle = () => {
    const MODE_TOGGLE = document.getElementById("mode-toggle");
    MODE_TOGGLE.classList.add("flash");
    setTimeout(() => MODE_TOGGLE.classList.remove("flash"), 400);
  };
  switch (getState({ key: StateKey.MODE })) {
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

/** Clears the editor content after confirmation, resets to edit mode. */
function clearText() {
  if (getState({ key: StateKey.EDITOR_TEXT }).trim() === "") {
    return;
  }
  if (confirm("Are you sure you want to clear all text?") === true) {
    setState({ key: StateKey.EDITOR_TEXT, value: "" });
    setState({ key: StateKey.FILE_NAME, value: "untitled.txt" });
    setState({ key: StateKey.MODE, value: Mode.EDIT });
    updateWordCount();
    updateLineNumbers();
  }
}

/** Opens the file picker dialog. */
function openFile() {
  document.getElementById("file-input").click();
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
    const NORMALIZED = loadEvent.target.result
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");
    setState({ key: StateKey.EDITOR_TEXT, value: NORMALIZED });
    setState({ key: StateKey.MODE, value: Mode.EDIT });
    updateWordCount();
  };
  reader.readAsText(file);
  document.getElementById("file-input").value = "";
}

/** Prompts for a filename and downloads the editor content as a file. */
function saveFile() {
  const fileName = prompt("Save as:", getState({ key: StateKey.FILE_NAME }));
  if (fileName === null || fileName.trim().length === 0) {
    return;
  }
  setState({ key: StateKey.FILE_NAME, value: fileName.trim() });
  const BLOB = new Blob([getState({ key: StateKey.EDITOR_TEXT })], {
    type: "text/plain",
  });
  const url = URL.createObjectURL(BLOB);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = fileName.trim();
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}
