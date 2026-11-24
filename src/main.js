import { Mode } from "@/enums.js";
import { buildIcons } from "@/icons.js";
import { state } from "@/state.js";
import {
  discardPendingEditorText,
  flushEditorText,
  handleDiyColorInput,
  handleDiyPickerInput,
} from "@/state_functions.js";
import {
  clearText,
  handleFileSelect,
  openFile,
  saveFile,
  selectTheme,
  handleFullscreenChange,
  toggleFullscreen,
  toggleMode,
} from "@/ui.js";
import { getElement } from "./utils.js";

/**
 * @param {KeyboardEvent} keyEvent
 */
function handleKeydown(keyEvent) {
  if (keyEvent.repeat === true) {
    return;
  }
  const modifierHeld = keyEvent.metaKey === true || keyEvent.ctrlKey === true;
  if (keyEvent.key === "Tab" && state.mode.read() === Mode.EDIT) {
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
    state.editorText.update(textarea.value);
    discardPendingEditorText();
  }

  if (modifierHeld === true && keyEvent.key === "s") {
    keyEvent.preventDefault();
    saveFile();
  }
  if (modifierHeld === true && keyEvent.key === "d") {
    keyEvent.preventDefault();
    state.themePickerOpen.toggle();
  }
  if (modifierHeld === true && keyEvent.key === "r") {
    keyEvent.preventDefault();
    toggleMode();
  }
  if (modifierHeld === true && keyEvent.key === ",") {
    keyEvent.preventDefault();
    state.settingsOpen.toggle();
  }
}

/**
 * @param {MouseEvent} clickEvent
 */
function handleThemePickerClick(clickEvent) {
  if (clickEvent.target instanceof Node === false) return;
  if (getElement("theme-picker").contains(clickEvent.target) === false) {
    state.themePickerOpen.update(false);
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
    state.settingsOpen.update(false);
  }
}

/**
 * @param {Event} changeEvent
 */
function handleFontSizeInput(changeEvent) {
  if (changeEvent.currentTarget instanceof HTMLInputElement === false) return;
  state.fontSize.update(parseInt(changeEvent.currentTarget.value, 10));
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

  getElement("toolbar-open").addEventListener("click", () => state.toolbarCollapsed.toggle());
  getElement("toolbar-close").addEventListener("click", () => state.toolbarCollapsed.toggle());
  getElement("btn-open").addEventListener("click", openFile);
  getElement("btn-clear").addEventListener("click", clearText);
  getElement("btn-save").addEventListener("click", saveFile);
  getElement("mode-toggle").addEventListener("click", toggleMode);
  getElement("theme-toggle").addEventListener("click", () => state.themePickerOpen.toggle());
  getElement("btn-settings").addEventListener("click", () => state.settingsOpen.toggle());
  getElement("btn-fullscreen").addEventListener("click", toggleFullscreen);
  getElement("file-input").addEventListener("change", handleFileSelect);

  for (const option of document.querySelectorAll(".theme-option[data-theme]")) {
    if (option instanceof HTMLElement === false) continue;
    option.addEventListener("click", handleThemeOptionClick);
  }

  getElement("settings-modal").addEventListener("click", handleSettingsModalClick);
  getElement("btn-close-settings").addEventListener("click", () => state.settingsOpen.update(false));
  getElement("setting-font-size").addEventListener("change", handleFontSizeInput);
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  window.addEventListener("pagehide", flushEditorText);
  document.addEventListener("visibilitychange", flushEditorText);

  const toggles = {
    "toggle-line-numbers": state.showLineNumbers,
    "toggle-monospace": state.useMonospace,
    "toggle-wide": state.enableWideMode,
    "toggle-tooltips": state.showTooltips,
    "toggle-word-count": state.showWordCount,
    "toggle-focus-mode": state.focusMode,
  };
  for (const [id, key] of Object.entries(toggles)) {
    getElement(id).addEventListener("change", () => key.toggle());
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
