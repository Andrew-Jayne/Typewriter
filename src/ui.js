import { Mode, StateKey } from "@/enums.js";
import { state } from "@/state.js";
import { syncDiyField } from "@/state_functions.js";
import { getElement, getInputElement } from "./utils.js";

function toggleToolbar() {
  getElement("toolbar").classList.toggle("collapsed");
}

function toggleFocusMode() {
  const toolbar = getElement("toolbar");
  switch (state[StateKey.FOCUS_MODE].read()) {
    case true:
      toolbar.style.display = "none";
      return;
    case false:
      toolbar.style.display = "flex";
      return;
  }
}

function toggleFullscreen() {
  switch (document.fullscreenElement === null) {
    case true:
      state[StateKey.FULLSCREEN].update(true);
      document.documentElement.requestFullscreen();
      return;
    case false:
      state[StateKey.FULLSCREEN].update(false);
      document.exitFullscreen();
      return;
  }
}

function syncSettingsControls() {
  getInputElement("setting-font-size").value = String(state[StateKey.FONT_SIZE].read());
  getInputElement("toggle-line-numbers").checked = state[StateKey.SHOW_LINE_NUMBERS].read();
  getInputElement("toggle-monospace").checked = state[StateKey.USE_MONOSPACE].read();
  getInputElement("toggle-wide").checked = state[StateKey.ENABLE_WIDE_MODE].read();
  getInputElement("toggle-tooltips").checked = state[StateKey.SHOW_TOOLTIPS].read();
  getInputElement("toggle-word-count").checked = state[StateKey.SHOW_WORD_COUNT].read();
  getInputElement("toggle-focus-mode").checked = state[StateKey.FOCUS_MODE].read();
  syncDiyField({ field: "bg", hexColor: state[StateKey.DIY_BG].read() });
  syncDiyField({ field: "text", hexColor: state[StateKey.DIY_TEXT].read() });
  syncDiyField({ field: "accent", hexColor: state[StateKey.DIY_ACCENT].read() });
  syncDiyField({ field: "border", hexColor: state[StateKey.DIY_BORDER].read() });
}

//this should move to the aspen state, either as a non persistent key or a perisitent one
function toggleSettings() {
  const modal = getElement("settings-modal");
  switch (modal.classList.contains("show")) {
    case true:
      modal.classList.remove("show");
      return;
    case false:
      syncSettingsControls();
      modal.classList.add("show");
      return;
  }
}

function closeSettings() {
  getElement("settings-modal").classList.remove("show");
}

function toggleThemePicker() {
  const themePickerMenu = getElement("theme-picker-menu");
  switch (themePickerMenu.classList.contains("show")) {
    case true:
      themePickerMenu.classList.remove("show");
      return;
    case false:
      updatePickerActiveState();
      themePickerMenu.classList.add("show");
  }
}

function updatePickerActiveState() {
  const theme = state[StateKey.THEME].read();
  const options = getElement("theme-picker-menu").querySelectorAll(".theme-option");
  for (const option of options) {
    if (option instanceof HTMLElement === false) continue;
    option.classList.toggle("active", option.dataset.theme === theme);
  }
}

/**
 * @param {string} theme
 */
function selectTheme(theme) {
  getElement("theme-picker-menu").classList.remove("show");
  state[StateKey.THEME].update(theme);
}

function toggleMode() {
  function flashModeToggle() {
    const modeToggle = getElement("mode-toggle");
    modeToggle.classList.add("flash");

    setTimeout(() => modeToggle.classList.remove("flash"), 400);
  }

  switch (state[StateKey.MODE].read()) {
    case Mode.EDIT:
      state[StateKey.MODE].update(Mode.VIEW);
      flashModeToggle();
      return;
    case Mode.VIEW:
      state[StateKey.MODE].update(Mode.EDIT);
      flashModeToggle();
      return;
  }
}

function clearText() {
  if (state[StateKey.EDITOR_TEXT].read().trim() === "") {
    return;
  }
  if (confirm("Are you sure you want to clear all text?") === true) {
    state[StateKey.EDITOR_TEXT].update("");
    state[StateKey.FILE_NAME].update("untitled.txt");
    state[StateKey.MODE].update(Mode.EDIT);
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
    state[StateKey.EDITOR_TEXT].update(text.replace(/\r\n?/g, "\n"));
    state[StateKey.FILE_NAME].update(file.name);
    state[StateKey.MODE].update(Mode.EDIT);
  } catch (error) {
    console.error(`Could not read ${file.name}`, error);
  } finally {
    input.value = "";
  }
}

function saveFile() {
  const fileName = prompt("Save as:", state[StateKey.FILE_NAME].read());
  if (fileName === null || fileName.trim().length === 0) {
    return;
  }
  state[StateKey.FILE_NAME].update(fileName.trim());
  const BLOB = new Blob([state[StateKey.EDITOR_TEXT].read()], {
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
  closeSettings,
  handleFileSelect,
  openFile,
  saveFile,
  selectTheme,
  toggleFocusMode,
  toggleFullscreen,
  toggleMode,
  toggleSettings,
  toggleThemePicker,
  toggleToolbar,
};
