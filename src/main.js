import { FontSlot, Mode, MonoFont, TextFont, Themes } from "@/enums.js";
import { loadStoredFonts, removeCustomFont, saveCustomFont } from "@/fonts.js";
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
import { getElement, isValueOf } from "./utils.js";

/**
 * @param {KeyboardEvent} keyEvent
 */
function handleKeydown(keyEvent) {
  if (keyEvent.repeat === true) {
    return;
  }
  const modifierHeld = keyEvent.metaKey === true || keyEvent.ctrlKey === true;
  if (keyEvent.key === "Tab" && state.mode.value === Mode.EDIT) {
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
  const match = Themes.find((candidate) => candidate === theme);
  if (match === undefined) return;
  selectTheme(match);
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
 * @param {Event} changeEvent
 */
function handleTextFontInput(changeEvent) {
  if (changeEvent.currentTarget instanceof HTMLSelectElement === false) return;
  const value = changeEvent.currentTarget.value;
  if (isValueOf(TextFont, value) === false) return;
  state.textFont.update(value);
}

/**
 * @param {Event} changeEvent
 */
function handleMonoFontInput(changeEvent) {
  if (changeEvent.currentTarget instanceof HTMLSelectElement === false) return;
  const value = changeEvent.currentTarget.value;
  if (isValueOf(MonoFont, value) === false) return;
  state.monoFont.update(value);
}

/**
 * @param {import("@/enums.js").FontSlotName} slot
 * @param {string} fileName empty string clears the custom font
 */
function setCustomFont(slot, fileName) {
  switch (slot) {
    case FontSlot.TEXT:
      state.customTextFontName.update(fileName);
      if (fileName !== "") {
        state.textFont.update(TextFont.CUSTOM);
      } else if (state.textFont.value === TextFont.CUSTOM) {
        state.textFont.update(TextFont.GEORGIA);
      }
      return;
    case FontSlot.MONO:
      state.customMonoFontName.update(fileName);
      if (fileName !== "") {
        state.monoFont.update(MonoFont.CUSTOM);
      } else if (state.monoFont.value === MonoFont.CUSTOM) {
        state.monoFont.update(MonoFont.CLASSIC);
      }
      return;
  }
}

/**
 * @param {unknown} error
 */
function showFontError(error) {
  const errorEl = getElement("custom-font-error");
  if (error instanceof Error) {
    errorEl.textContent = error.message;
  } else {
    errorEl.textContent = String(error);
  }
}

/**
 * @param {MouseEvent} clickEvent
 */
function handleUploadFontClick(clickEvent) {
  if (clickEvent.currentTarget instanceof HTMLElement === false) return;
  const slot = clickEvent.currentTarget.dataset.slot;
  if (isValueOf(FontSlot, slot) === false) return;
  getElement(`file-${slot}-font`).click();
}

/**
 * @param {Event} changeEvent
 */
async function handleFontFileSelect(changeEvent) {
  if (changeEvent.currentTarget instanceof HTMLInputElement === false) return;
  const input = changeEvent.currentTarget;
  const slot = input.dataset.slot;
  if (isValueOf(FontSlot, slot) === false) return;
  if (input.files === null) return;
  const file = input.files.item(0);
  if (file === null) return;

  getElement("custom-font-error").textContent = "";
  try {
    await saveCustomFont(slot, file);
    setCustomFont(slot, file.name);
  } catch (error) {
    showFontError(error);
  } finally {
    input.value = "";
  }
}

/**
 * @param {MouseEvent} clickEvent
 */
async function handleRemoveFontClick(clickEvent) {
  if (clickEvent.currentTarget instanceof HTMLElement === false) return;
  const slot = clickEvent.currentTarget.dataset.slot;
  if (isValueOf(FontSlot, slot) === false) return;

  getElement("custom-font-error").textContent = "";
  try {
    await removeCustomFont(slot);
    setCustomFont(slot, "");
  } catch (error) {
    showFontError(error);
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
  getElement("setting-text-font").addEventListener("change", handleTextFontInput);
  getElement("setting-mono-font").addEventListener("change", handleMonoFontInput);
  for (const slot of Object.values(FontSlot)) {
    getElement(`btn-upload-${slot}-font`).addEventListener("click", handleUploadFontClick);
    getElement(`btn-remove-${slot}-font`).addEventListener("click", handleRemoveFontClick);
    getElement(`file-${slot}-font`).addEventListener("change", handleFontFileSelect);
  }
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
  const loadedFonts = await loadStoredFonts();
  state.bootstrap();
  for (const slot of Object.values(FontSlot)) {
    if (loadedFonts.has(slot) === false) {
      setCustomFont(slot, "");
    }
  }
  window.scrollTo(0, 0);
}

main();
