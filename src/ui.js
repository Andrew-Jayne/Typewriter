import { FontSlot, Mode } from "@/enums.js";
import { state } from "@/state.js";
import {
  discardPendingEditorText,
  flushEditorText,
  syncDiyField,
} from "@/state_functions.js";
import { getElement, getInputElement, getSelectElement } from "./utils.js";

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

/**
 * @param {import("@/enums.js").FontSlotName} slot
 * @param {string} fileName
 */
function syncCustomFontControls(slot, fileName) {
  const hasFont = fileName !== "";
  const option = getElement(`option-${slot}-custom`);
  if (option instanceof HTMLOptionElement === false) {
    throw new Error(`Element #option-${slot}-custom is not an option`);
  }
  option.disabled = hasFont === false;
  const nameEl = getElement(`custom-${slot}-font-name`);
  if (hasFont === true) {
    option.textContent = `Custom (${fileName})`;
    nameEl.textContent = fileName;
  } else {
    option.textContent = "Custom (upload below)";
    nameEl.textContent = "No custom font";
  }
  const removeButton = getElement(`btn-remove-${slot}-font`);
  if (removeButton instanceof HTMLButtonElement === false) {
    throw new Error(`Element #btn-remove-${slot}-font is not a button`);
  }
  removeButton.disabled = hasFont === false;
}

function syncSettingsControls() {
  getInputElement("setting-font-size").value = String(state.fontSize.value);
  getInputElement("toggle-line-numbers").checked = state.showLineNumbers.value;
  getInputElement("toggle-monospace").checked = state.useMonospace.value;
  getSelectElement("setting-text-font").value = state.textFont.value;
  getSelectElement("setting-mono-font").value = state.monoFont.value;
  syncCustomFontControls(FontSlot.TEXT, state.customTextFontName.value);
  syncCustomFontControls(FontSlot.MONO, state.customMonoFontName.value);
  getInputElement("toggle-wide").checked = state.enableWideMode.value;
  getInputElement("toggle-tooltips").checked = state.showTooltips.value;
  getInputElement("toggle-word-count").checked = state.showWordCount.value;
  getInputElement("toggle-focus-mode").checked = state.focusMode.value;
  syncDiyField({ field: "bg", hexColor: state.diyBg.value });
  syncDiyField({ field: "text", hexColor: state.diyText.value });
  syncDiyField({ field: "accent", hexColor: state.diyAccent.value });
  syncDiyField({ field: "border", hexColor: state.diyBorder.value });
}

/**
 * @param {import("@/enums.js").ThemeName} theme
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

  switch (state.mode.value) {
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
  if (state.editorText.value.trim() === "") {
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
  const fileName = prompt("Save as:", state.fileName.value);
  if (fileName === null || fileName.trim().length === 0) {
    return;
  }
  state.fileName.update(fileName.trim());
  const BLOB = new Blob([state.editorText.value], {
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
