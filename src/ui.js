import { Mode, StateKey } from "@/enums.js";
import { state } from "@/state.js";
import { syncDiyField } from "@/state_functions.js";
import { getElement, getInputElement } from "./utils.js";

function toggleToolbar() {
  getElement("toolbar").classList.toggle("collapsed");
}

function toggleFocusMode() {
  const toolbar = getElement("toolbar");
  switch (state.get(StateKey.FOCUS_MODE)) {
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
      state.set(StateKey.FULLSCREEN, true);
      document.documentElement.requestFullscreen();
      return;
    case false:
      state.set(StateKey.FULLSCREEN, false);
      document.exitFullscreen();
      return;
  }
}

function syncSettingsControls() {
  getInputElement("setting-font-size").value = String(state.get(StateKey.FONT_SIZE));
  getInputElement("toggle-line-numbers").checked = state.get(
    StateKey.SHOW_LINE_NUMBERS,
  );
  getInputElement("toggle-monospace").checked = state.get(StateKey.USE_MONOSPACE);
  getInputElement("toggle-wide").checked = state.get(StateKey.ENABLE_WIDE_MODE);
  getInputElement("toggle-tooltips").checked = state.get(StateKey.SHOW_TOOLTIPS);
  getInputElement("toggle-word-count").checked = state.get(StateKey.SHOW_WORD_COUNT);
  getInputElement("toggle-focus-mode").checked = state.get(StateKey.FOCUS_MODE);
  syncDiyField({ field: "bg", hexColor: state.get(StateKey.DIY_BG) });
  syncDiyField({ field: "text", hexColor: state.get(StateKey.DIY_TEXT) });
  syncDiyField({ field: "accent", hexColor: state.get(StateKey.DIY_ACCENT) });
  syncDiyField({ field: "border", hexColor: state.get(StateKey.DIY_BORDER) });
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
  const theme = state.get(StateKey.THEME);
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
  state.set(StateKey.THEME, theme);
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
