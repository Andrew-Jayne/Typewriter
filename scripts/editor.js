function updateLineNumbers() {
  const TEXT = state.get(StateKey.EDITOR_TEXT);
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

function updateWordCount() {
  const text = state.get(StateKey.EDITOR_TEXT);
  const trimmed = text.trim();
  let word_count = 0;
  if (trimmed.length > 0) {
    word_count = trimmed.split(/\s+/).length;
  }
  document.getElementById("word-count").textContent =
    `${word_count} words · ${text.length} characters`;
}

function toggleMode() {
  const flashModeToggle = () => {
    const MODE_TOGGLE = document.getElementById("mode-toggle");
    MODE_TOGGLE.classList.add("flash");
    setTimeout(() => MODE_TOGGLE.classList.remove("flash"), 400);
  };
  switch (state.get(StateKey.MODE)) {
    case Mode.EDIT:
      state.set(StateKey.MODE, Mode.VIEW);
      flashModeToggle();
      return;
    case Mode.VIEW:
      state.set(StateKey.MODE, Mode.EDIT);
      flashModeToggle();
      return;
  }
}

function clearText() {
  if (state.get(StateKey.EDITOR_TEXT).trim() === "") {
    return;
  }
  if (confirm("Are you sure you want to clear all text?") === true) {
    state.set(StateKey.EDITOR_TEXT, "");
    state.set(StateKey.FILE_NAME, "untitled.txt");
    state.set(StateKey.MODE, Mode.EDIT);
    updateWordCount();
    updateLineNumbers();
  }
}

function openFile() {
  document.getElementById("file-input").click();
}

/**
 * @param {Event} event
 */
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file === undefined) {
    return;
  }

  state.set(StateKey.FILE_NAME, file.name);

  const reader = new FileReader();
  reader.onload = (loadEvent) => {
    const NORMALIZED = loadEvent.target.result
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");
    state.set(StateKey.EDITOR_TEXT, NORMALIZED);
    state.set(StateKey.MODE, Mode.EDIT);
    updateWordCount();
  };
  reader.readAsText(file);
  document.getElementById("file-input").value = "";
}

function saveFile() {
  const fileName = prompt("Save as:", state.get(StateKey.FILE_NAME));
  if (fileName === null || fileName.trim().length === 0) {
    return;
  }
  state.set(StateKey.FILE_NAME, fileName.trim());
  const BLOB = new Blob([state.get(StateKey.EDITOR_TEXT)], {
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
