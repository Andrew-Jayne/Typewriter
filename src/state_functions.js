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
    const value = state[DiyStateKeys[field]].read();
    if (typeof value !== "string" || !isValidHexColor(value)) {
      throw new Error(`Invalid color for "${field}": ${value}`);
    }
    body.style.setProperty(`--diy-${field}`, value);
  }

  const bg = state.diyBg.read();
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
  const theme = state.theme.read();
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
  if (state.mode.read() === Mode.VIEW) {
    return;
  }
  const wrap = document.querySelector(".edit-mode");
  if (wrap === null) return;
  switch (state.showLineNumbers.read()) {
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
  if (state.mode.read() === Mode.VIEW) {
    return;
  }
  switch (state.useMonospace.read()) {
    case true:
      getElement("editor").classList.add("monospace-mode");
      return;
    case false:
      getElement("editor").classList.remove("monospace-mode");
      return;
  }
}

function handleWideMode() {
  switch (state.enableWideMode.read()) {
    case true:
      getElement("typewriter-container").classList.add("wide");
      return;
    case false:
      getElement("typewriter-container").classList.remove("wide");
      return;
  }
}

function handleTooltips() {
  switch (state.showTooltips.read()) {
    case true:
      document.body.classList.remove("no-tooltips");
      return;
    case false:
      document.body.classList.add("no-tooltips");
      return;
  }
}

function handleWordCount() {
  switch (state.showWordCount.read()) {
    case true:
      getElement("word-count").style.display = "block";
      return;
    case false:
      getElement("word-count").style.display = "none";
      return;
  }
}

function handleFontSizeChange() {
  const font_size = `${state.fontSize.read()}px`;
  switch (state.mode.read()) {
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

  switch (state.mode.read()) {
    case Mode.VIEW: {
      container.innerHTML = "";
      const viewDiv = document.createElement("div");
      viewDiv.id = "view-mode";
      viewDiv.className = "view-content";
      viewDiv.style.fontSize = `${state.fontSize.read()}px`;
      container.appendChild(viewDiv);

      renderMarkdown(state.editorText.read())
        .then((html) => {
          viewDiv.innerHTML = html;
        })
        .catch((error) => {
          console.error(error);
          viewDiv.textContent = state.editorText.read();
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

        const fontSize = state.fontSize.read();

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
        textarea.value = state.editorText.read();
        textarea.style.fontSize = `${fontSize}px`;
        lineNums.style.fontSize = `${fontSize}px`;

        if (state.useMonospace.read() === true) {
          textarea.classList.add("monospace-mode");
        }

        if (state.showLineNumbers.read() === true) {
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
  switch (state.fullscreen.read()) {
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
  switch (state.focusMode.read()) {
    case true:
      toolbar.style.display = "none";
      return;
    case false:
      toolbar.style.display = "flex";
      return;
  }
}

function updateLineNumbers() {
  if (
    state.showLineNumbers.read() === true &&
    state.mode.read() === Mode.EDIT
  ) {
    let nums = "";
    const LINE_COUNT = state.editorText.read().split("\n").length;
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
  const trimmed = state.editorText.read().trim();
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
  handleMonospace,
  handleShowLineNumbers,
  handleThemeChange,
  handleTooltips,
  handleWideMode,
  handleWordCount,
  syncDiyField,
  syncFullscreenIcon,
  updateLineNumbers,
  updateWordCount,
};
