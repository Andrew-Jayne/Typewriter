import { StateKey } from "@/enums.js";
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
  getInputElement("setting-font-size").value = `${state.get(StateKey.FONT_SIZE)}p`;
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

export {
  closeSettings,
  selectTheme,
  toggleFocusMode,
  toggleFullscreen,
  toggleSettings,
  toggleThemePicker,
  toggleToolbar,
};
