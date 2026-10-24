import { Mode, StateKey } from "@/enums.js";
import { state } from "@/state.js";
import { getElement } from "./utils.js";

function updateLineNumbers() {
  const lineNumEl = document.getElementById("line-numbers");
  if (lineNumEl === null) {
    return;
  }

  const TEXT = state.get(StateKey.EDITOR_TEXT);
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
  const trimmed = state.get(StateKey.EDITOR_TEXT).trim();
  let word_count = 0;
  if (trimmed.length > 0) {
    word_count = trimmed.split(/\s+/).length;
  }
  getElement("word-count").textContent =
    `${word_count} words · ${trimmed.length} characters`;
}

function toggleMode() {
  function flashModeToggle() {
    const modeToggle = getElement("mode-toggle");
    modeToggle.classList.add("flash");

    setTimeout(() => modeToggle.classList.remove("flash"), 400);
  }

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
  }
}

function openFile() {
  getElement("file-input").click();
}

/**
 * @param {Event} event
 */
async function handleFileSelect(event) {
  if (event.currentTarget instanceof HTMLInputElement === false) return;
  const input = event.currentTarget;
  if (input.files === null) return;
  const file = input.files.item(0);
  if (file === null) return;

  try {
    const text = await file.text();
    state.set(StateKey.EDITOR_TEXT, text.replace(/\r\n?/g, "\n"));
    state.set(StateKey.FILE_NAME, file.name);
    state.set(StateKey.MODE, Mode.EDIT);
  } catch (error) {
    console.error(`Could not read ${file.name}`, error);
  } finally {
    input.value = "";
  }
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

export {
  clearText,
  handleFileSelect,
  openFile,
  saveFile,
  toggleMode,
  updateLineNumbers,
  updateWordCount,
};
