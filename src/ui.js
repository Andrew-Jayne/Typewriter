import { Mode } from "@/enums.js";
import { state } from "@/state.js";
import {
  discardPendingEditorText,
  flushEditorText,
  syncDiyField,
} from "@/state_functions.js";
import { getElement, getInputElement } from "./utils.js";

function toggleFullscreen() {
  switch (document.fullscreenElement === null) {
    case true:
      document.documentElement.requestFullscreen();
      return;
    case false:
      document.exitFullscreen();
      return;
  }
}

function handleFullscreenChange() {
  state.fullscreen.update(document.fullscreenElement !== null);
}

function syncSettingsControls() {
  getInputElement("setting-font-size").value = String(state.fontSize.read());
  getInputElement("toggle-line-numbers").checked = state.showLineNumbers.read();
  getInputElement("toggle-monospace").checked = state.useMonospace.read();
  getInputElement("toggle-wide").checked = state.enableWideMode.read();
  getInputElement("toggle-tooltips").checked = state.showTooltips.read();
  getInputElement("toggle-word-count").checked = state.showWordCount.read();
  getInputElement("toggle-focus-mode").checked = state.focusMode.read();
  syncDiyField({ field: "bg", hexColor: state.diyBg.read() });
  syncDiyField({ field: "text", hexColor: state.diyText.read() });
  syncDiyField({ field: "accent", hexColor: state.diyAccent.read() });
  syncDiyField({ field: "border", hexColor: state.diyBorder.read() });
}

/**
 * @param {string} theme
 */
function selectTheme(theme) {
  state.themePickerOpen.update(false);
  state.theme.update(theme);
}

function toggleMode() {
  function flashModeToggle() {
    const modeToggle = getElement("mode-toggle");
    modeToggle.classList.add("flash");

    setTimeout(() => modeToggle.classList.remove("flash"), 400);
  }

  switch (state.mode.read()) {
    case Mode.EDIT:
      state.mode.update(Mode.VIEW);
      flashModeToggle();
      return;
    case Mode.VIEW:
      state.mode.update(Mode.EDIT);
      flashModeToggle();
      return;
  }
}

function clearText() {
  flushEditorText();
  if (state.editorText.read().trim() === "") {
    return;
  }
  if (confirm("Are you sure you want to clear all text?") === true) {
    discardPendingEditorText();
    state.editorText.update("");
    state.fileName.update("untitled.txt");
    state.mode.update(Mode.EDIT);
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
    discardPendingEditorText();
    state.editorText.update(text.replace(/\r\n?/g, "\n"));
    state.fileName.update(file.name);
    state.mode.update(Mode.EDIT);
  } catch (error) {
    console.error(`Could not read ${file.name}`, error);
  } finally {
    input.value = "";
  }
}

function saveFile() {
  flushEditorText();
  const fileName = prompt("Save as:", state.fileName.read());
  if (fileName === null || fileName.trim().length === 0) {
    return;
  }
  state.fileName.update(fileName.trim());
  const BLOB = new Blob([state.editorText.read()], {
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
  handleFullscreenChange,
  openFile,
  saveFile,
  selectTheme,
  syncSettingsControls,
  toggleFullscreen,
  toggleMode,
};
