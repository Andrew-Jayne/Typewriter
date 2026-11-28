import { parse } from "marked";
import {
  DiyFields,
  DiyStateKeys,
  Mode,
  Theme,
  ThemeClasses,
  ThemeIcons,
} from "@/enums.js";
import { state } from "@/state.js";
import { getElement, getInputElement, isKeyOf, isValueOf } from "./utils.js";

function applyDiyColors() {
  /**
   * @param {string} hexColor
   * @returns {boolean}
   */
  function isValidHexColor(hexColor) {
    return /^#[0-9a-fA-F]{6}$/.test(hexColor);
  }

  const body = document.body;
  for (const field of DiyFields) {
    if (!isKeyOf(DiyStateKeys, field)) {
      throw new Error(`Unknown DIY_FIELD "${field}"`);
    }
    const value = state[DiyStateKeys[field]].value;
    if (typeof value !== "string" || !isValidHexColor(value)) {
      throw new Error(`Invalid color for "${field}": ${value}`);
    }
    body.style.setProperty(`--diy-${field}`, value);
  }

  const bg = state.diyBg.value;
  const brightness =
    parseInt(bg.slice(1, 3), 16) * 0.299 +
    parseInt(bg.slice(3, 5), 16) * 0.587 +
    parseInt(bg.slice(5, 7), 16) * 0.114;

  let hoverShift = 15;
  if (brightness > 128) {
    hoverShift = -15;
  }

  const RED = Math.min(255, Math.max(0, parseInt(bg.slice(1, 3), 16) + hoverShift));
  const GREEN = Math.min(255, Math.max(0, parseInt(bg.slice(3, 5), 16) + hoverShift));
  const BLUE = Math.min(255, Math.max(0, parseInt(bg.slice(5, 7), 16) + hoverShift));

  body.style.setProperty("--diy-hover", `rgb(${RED},${GREEN},${BLUE})`);

  switch (brightness > 128) {
    case true:
      body.style.setProperty("--diy-mid-gray", "#8a8a8a");
      return;
    case false:
      body.style.setProperty("--diy-mid-gray", "#aaaaaa");
      return;
  }
}

function handleThemeChange() {
  const theme = state.theme.value;
  if (isValueOf(Theme, theme) === false) {
    throw new Error(`Unknown theme "${theme}"`);
  }

  getElement("theme-toggle").innerHTML = ThemeIcons[theme];
  document.body.classList.remove(...Object.values(ThemeClasses));
  document.body.classList.add(ThemeClasses[theme]);

  if (theme === Theme.DIY) {
    applyDiyColors();
  }
}

function handleShowLineNumbers() {
  if (state.mode.value === Mode.VIEW) {
    return;
  }
  const wrap = document.querySelector(".edit-mode");
  if (wrap === null) return;
  switch (state.showLineNumbers.value) {
    case true:
      getElement("line-numbers").style.display = "block";
      wrap.classList.add("no-wrap");
      return;
    case false:
      getElement("line-numbers").style.display = "none";
      wrap.classList.remove("no-wrap");
      return;
  }
}

function handleMonospace() {
  if (state.mode.value === Mode.VIEW) {
    return;
  }
  switch (state.useMonospace.value) {
    case true:
      getElement("editor").classList.add("monospace-mode");
      return;
    case false:
      getElement("editor").classList.remove("monospace-mode");
      return;
  }
}

function handleTextFont() {
  document.documentElement.dataset.font = state.textFont.value;
}

function handleMonoFont() {
  document.documentElement.dataset.monoFont = state.monoFont.value;
}

function handleWideMode() {
  switch (state.enableWideMode.value) {
    case true:
      getElement("typewriter-container").classList.add("wide");
      return;
    case false:
      getElement("typewriter-container").classList.remove("wide");
      return;
  }
}

function handleTooltips() {
  switch (state.showTooltips.value) {
    case true:
      document.body.classList.remove("no-tooltips");
      return;
    case false:
      document.body.classList.add("no-tooltips");
      return;
  }
}

function handleWordCount() {
  switch (state.showWordCount.value) {
    case true:
      getElement("word-count").style.display = "block";
      return;
    case false:
      getElement("word-count").style.display = "none";
      return;
  }
}

function handleFontSizeChange() {
  const font_size = `${state.fontSize.value}px`;
  switch (state.mode.value) {
    case Mode.EDIT:
      getElement("editor").style.fontSize = font_size;
      getElement("line-numbers").style.fontSize = font_size;
      return;
    case Mode.VIEW:
      getElement("view-mode").style.fontSize = font_size;
      return;
  }
}

/**
 * @param {string} text
 * @returns {Promise<string>}
 */
async function renderMarkdown(text) {
  return parse(text, { async: false, breaks: true, gfm: true });
}

const EDITOR_WRITE_DELAY_MS = 200;
/** @type {HTMLTextAreaElement | null} */
let pendingTextarea = null;
/** @type {ReturnType<typeof setTimeout> | undefined} */
let pendingTimer;

function discardPendingEditorText() {
  clearTimeout(pendingTimer);
  pendingTextarea = null;
}

function flushEditorText() {
  const textarea = pendingTextarea;
  discardPendingEditorText();
  if (textarea === null) return;
  state.editorText.update(textarea.value);
}

/**
 * @param {HTMLTextAreaElement} textarea
 */
function scheduleEditorText(textarea) {
  clearTimeout(pendingTimer);
  pendingTextarea = textarea;
  pendingTimer = setTimeout(flushEditorText, EDITOR_WRITE_DELAY_MS);
}

function handleModeChange() {
  flushEditorText();
  const container = getElement("typewriter-container");

  switch (state.mode.value) {
    case Mode.VIEW: {
      container.innerHTML = "";
      const viewDiv = document.createElement("div");
      viewDiv.id = "view-mode";
      viewDiv.className = "view-content";
      viewDiv.style.fontSize = `${state.fontSize.value}px`;
      container.appendChild(viewDiv);

      renderMarkdown(state.editorText.value)
        .then((html) => {
          viewDiv.innerHTML = html;
        })
        .catch((error) => {
          console.error(error);
          viewDiv.textContent = state.editorText.value;
        });

      getElement("icon-edit-mode").classList.add("hidden");
      getElement("icon-view-mode").classList.remove("hidden");
      getElement("mode-toggle").setAttribute("data-tooltip", "Switch to editor");
      return;
    }
    case Mode.EDIT:
      {
        /**
         * @param {Event} inputEvent
         */
        function handleEditorInput(inputEvent) {
          if (inputEvent.currentTarget instanceof HTMLTextAreaElement === false) return;
          scheduleEditorText(inputEvent.currentTarget);
        }

        /**
         * @param {Event} scrollEvent
         */
        function handleEditorScroll(scrollEvent) {
          if (scrollEvent.currentTarget instanceof HTMLTextAreaElement === false)
            return;
          getElement("line-numbers").scrollTop = scrollEvent.currentTarget.scrollTop;
        }

        const fontSize = state.fontSize.value;

        container.innerHTML = "";
        const wrap = document.createElement("div");
        wrap.className = "edit-mode";

        const lineNums = document.createElement("div");
        lineNums.className = "line-numbers";
        lineNums.id = "line-numbers";

        const textarea = document.createElement("textarea");
        textarea.id = "editor";
        textarea.placeholder = "Start writing...";
        textarea.spellcheck = true;
        textarea.value = state.editorText.value;
        textarea.style.fontSize = `${fontSize}px`;
        lineNums.style.fontSize = `${fontSize}px`;

        if (state.useMonospace.value === true) {
          textarea.classList.add("monospace-mode");
        }

        if (state.showLineNumbers.value === true) {
          wrap.classList.add("no-wrap");
        } else {
          lineNums.style.display = "none";
        }

        wrap.appendChild(lineNums);
        wrap.appendChild(textarea);
        container.appendChild(wrap);

        textarea.addEventListener("input", handleEditorInput);
        textarea.addEventListener("scroll", handleEditorScroll);

        getElement("icon-edit-mode").classList.remove("hidden");
        getElement("icon-view-mode").classList.add("hidden");
        getElement("mode-toggle").setAttribute("data-tooltip", "Switch to reader");
      }
      return;
  }
}

/**
 * @param {{ field: string, hexColor: string }} params
 */
function syncDiyField({ field, hexColor }) {
  getInputElement(`diy-${field}-hex`).value = hexColor;
  getInputElement(`diy-${field}-picker`).value = hexColor;
  document.body.style.setProperty(`--diy-${field}`, hexColor);
}

/**
 * @param {{ field: string, hexColor: string }} params
 */
function handleDiyPickerInput({ field, hexColor }) {
  if (isKeyOf(DiyStateKeys, field) === false) {
    throw new Error(`Unknown DIY_FIELD "${field}"`);
  }
  state[DiyStateKeys[field]].update(hexColor);
  state.theme.update(Theme.DIY);
}

/**
 * @param {{ field: string, rawInput: string }} params
 */
function handleDiyColorInput({ field, rawInput }) {
  const errorEl = getElement("diy-color-error");
  const hexMatch = rawInput
    .trim()
    .toLowerCase()
    .match(/^#?([0-9a-f]{6})$/);
  if (hexMatch === null) {
    errorEl.textContent = `Invalid hex color: ${rawInput}`;
    return;
  }
  errorEl.textContent = "";
  const hexColor = `#${hexMatch[1]}`;
  if (isKeyOf(DiyStateKeys, field) === false) {
    throw new Error(`Unknown DIY_FIELD "${field}"`);
  }
  state[DiyStateKeys[field]].update(hexColor);
  state.theme.update(Theme.DIY);
}

function syncFullscreenIcon() {
  const enterIcon = getElement("icon-fullscreen-enter");
  const exitIcon = getElement("icon-fullscreen-exit");
  switch (state.fullscreen.value) {
    case false:
      enterIcon.classList.remove("hidden");
      exitIcon.classList.add("hidden");
      return;
    case true:
      enterIcon.classList.add("hidden");
      exitIcon.classList.remove("hidden");
      return;
  }
}

function applyFocusMode() {
  const toolbar = getElement("toolbar");
  switch (state.focusMode.value) {
    case true:
      toolbar.style.display = "none";
      return;
    case false:
      toolbar.style.display = "flex";
      return;
  }
}

function handleSettingsOpen() {
  getElement("settings-modal").classList.toggle("show", state.settingsOpen.value);
}

function handleThemePickerOpen() {
  const isOpen = state.themePickerOpen.value;
  const menu = getElement("theme-picker-menu");
  if (isOpen === true) {
    const theme = state.theme.value;
    for (const option of menu.querySelectorAll(".theme-option")) {
      if (option instanceof HTMLElement === false) continue;
      option.classList.toggle("active", option.dataset.theme === theme);
    }
  }
  menu.classList.toggle("show", isOpen);
}

function handleToolbarCollapsed() {
  getElement("toolbar").classList.toggle("collapsed", state.toolbarCollapsed.value);
}

function updateLineNumbers() {
  if (
    state.showLineNumbers.value === true &&
    state.mode.value === Mode.EDIT
  ) {
    let nums = "";
    const LINE_COUNT = state.editorText.value.split("\n").length;
    for (let idx = 1; idx <= LINE_COUNT; idx++) {
      if (idx > 1) {
        nums += "\n";
      }
      nums += String(idx);
    }
    getElement("line-numbers").textContent = nums;
  }
}

function updateWordCount() {
  const numberFormat = new Intl.NumberFormat("en-US");
  const trimmed = state.editorText.value.trim();
  let word_count = 0;
  if (trimmed.length > 0) {
    word_count = trimmed.split(/\s+/).length; // WTF does this regex do?
  }
  getElement("word-count").textContent =
    `${numberFormat.format(word_count)} words · ${numberFormat.format(trimmed.length)} characters`;
}

export {
  applyFocusMode,
  discardPendingEditorText,
  flushEditorText,
  handleDiyColorInput,
  handleDiyPickerInput,
  handleFontSizeChange,
  handleModeChange,
  handleMonoFont,
  handleMonospace,
  handleSettingsOpen,
  handleShowLineNumbers,
  handleTextFont,
  handleThemeChange,
  handleThemePickerOpen,
  handleToolbarCollapsed,
  handleTooltips,
  handleWideMode,
  handleWordCount,
  syncDiyField,
  syncFullscreenIcon,
  updateLineNumbers,
  updateWordCount,
};
