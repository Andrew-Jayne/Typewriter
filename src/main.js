import { Mode, StateKey } from "@/enums.js";
import { buildIcons } from "@/icons.js";
import { state } from "@/state.js";
import { handleDiyColorInput, handleDiyPickerInput } from "@/state_functions.js";
import {
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
} from "@/ui.js";
import { getElement, isStateKey } from "./utils.js";

/**
 * @param {KeyboardEvent} keyEvent
 */
function handleKeydown(keyEvent) {
  if (keyEvent.repeat === true) {
    return;
  }
  const modifierHeld = keyEvent.metaKey === true || keyEvent.ctrlKey === true;
  if (keyEvent.key === "Tab" && state[StateKey.MODE].read() === Mode.EDIT) {
    keyEvent.preventDefault();
    const textarea = getElement("typewriter-container").querySelector("textarea");
    if (textarea === undefined || textarea === null) {
      throw new Error("Element #typewriter-container#textarea is missing");
    }
    const start = textarea.selectionStart;
    textarea.value =
      textarea.value.substring(0, start) +
      "\t" +
      textarea.value.substring(textarea.selectionEnd);
    textarea.selectionStart = start + 1;
    textarea.selectionEnd = start + 1;
    state[StateKey.EDITOR_TEXT].update(textarea.value);
  }

  if (modifierHeld === true && keyEvent.key === "s") {
    keyEvent.preventDefault();
    saveFile();
  }
  if (modifierHeld === true && keyEvent.key === "d") {
    keyEvent.preventDefault();
    toggleThemePicker();
  }
  if (modifierHeld === true && keyEvent.key === "r") {
    keyEvent.preventDefault();
    toggleMode();
  }
  if (modifierHeld === true && keyEvent.key === ",") {
    keyEvent.preventDefault();
    toggleSettings();
  }
}

/**
 * @param {MouseEvent} clickEvent
 */
function handleThemePickerClick(clickEvent) {
  if (clickEvent.target instanceof Node === false) return;
  if (getElement("theme-picker").contains(clickEvent.target) === false) {
    getElement("theme-picker-menu").classList.remove("show");
  }
}

/**
 * @param {MouseEvent} clickEvent
 */
function handleThemeOptionClick(clickEvent) {
  if (clickEvent.currentTarget instanceof HTMLElement === false) return;
  const theme = clickEvent.currentTarget.dataset.theme;
  if (theme === undefined) return;
  selectTheme(theme);
}
/**
 * @param {MouseEvent} clickEvent
 */
function handleSettingsModalClick(clickEvent) {
  if (clickEvent.target === getElement("settings-modal")) {
    closeSettings();
  }
}

/**
 * @param {Event} changeEvent
 */
function handleFontSizeInput(changeEvent) {
  if (changeEvent.currentTarget instanceof HTMLInputElement === false) return;
  state[StateKey.FONT_SIZE].update(parseInt(changeEvent.currentTarget.value, 10));
}

/**
 * @param {Event} changeEvent
 */
function handleStateToggleChange(changeEvent) {
  if (changeEvent.currentTarget instanceof HTMLElement === false) return;
  const key = changeEvent.currentTarget.dataset.stateKey;
  if (key === undefined) return;
  if (isStateKey(key) === false) return;

  switch (state[key].read()) {
    case true:
      state[key].update(false);
      break;
    case false:
      state[key].update(true);
      break;
    default:
      throw new Error(`State "${key}" is not a boolean`);
  }
}

/**
 * @param {Event} inputEvent
 */
function handleDiyPickerChange(inputEvent) {
  if (inputEvent.currentTarget instanceof HTMLInputElement === false) return;
  const field = inputEvent.currentTarget.dataset.field;
  if (field === undefined) return;

  handleDiyPickerInput({
    field: field,
    hexColor: inputEvent.currentTarget.value,
  });
}

/**
 * @param {Event} changeEvent
 */
function handleDiyHexChange(changeEvent) {
  if (changeEvent.currentTarget instanceof HTMLInputElement === false) return;
  const field = changeEvent.currentTarget.dataset.field;
  if (field === undefined) return;

  handleDiyColorInput({
    field: field,
    rawInput: changeEvent.currentTarget.value,
  });
}

function addAllEventListerners() {
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("click", handleThemePickerClick);

  getElement("toolbar-open").addEventListener("click", toggleToolbar);
  getElement("toolbar-close").addEventListener("click", toggleToolbar);
  getElement("btn-open").addEventListener("click", openFile);
  getElement("btn-clear").addEventListener("click", clearText);
  getElement("btn-save").addEventListener("click", saveFile);
  getElement("mode-toggle").addEventListener("click", toggleMode);
  getElement("theme-toggle").addEventListener("click", toggleThemePicker);
  getElement("btn-settings").addEventListener("click", toggleSettings);
  getElement("btn-fullscreen").addEventListener("click", toggleFullscreen);
  getElement("file-input").addEventListener("change", handleFileSelect);

  for (const option of document.querySelectorAll(".theme-option[data-theme]")) {
    if (option instanceof HTMLElement === false) continue;
    option.addEventListener("click", handleThemeOptionClick);
  }

  getElement("settings-modal").addEventListener("click", handleSettingsModalClick);
  getElement("btn-close-settings").addEventListener("click", closeSettings);
  getElement("setting-font-size").addEventListener("change", handleFontSizeInput);
  getElement("toggle-focus-mode").addEventListener("change", toggleFocusMode);

  for (const toggle of document.querySelectorAll("[data-state-key]")) {
    toggle.addEventListener("change", handleStateToggleChange);
  }

  for (const picker of document.querySelectorAll(".settings-swatch[data-field]")) {
    picker.addEventListener("input", handleDiyPickerChange);
  }

  for (const input of document.querySelectorAll(".settings-color-input[data-field]")) {
    input.addEventListener("change", handleDiyHexChange);
  }
}

async function main() {
  addAllEventListerners();
  buildIcons();
  await state.validateStorage();
  state.bootstrap();
  window.scrollTo(0, 0);
}

main();
