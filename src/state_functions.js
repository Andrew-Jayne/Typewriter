import {
  DIY_FIELDS,
  DIY_STATE_KEY,
  Mode,
  StateKey,
  THEME_CLASSES,
  Theme,
  themeIcons,
} from "@/enums.js";
import { state } from "@/state.js";
import { getElement, getInputElement, isKeyOf, isValueOf } from "./utils.js";

/**
 * @param {string} hexColor
 * @returns {boolean}
 */
function isValidHexColor(hexColor) {
  return /^#[0-9a-fA-F]{6}$/.test(hexColor);
}

function applyDiyColors() {
  const body = document.body;
  for (const field of DIY_FIELDS) {
    if (isKeyOf(DIY_STATE_KEY, field) === false) {
      throw new Error(`Unknown DIY_FIELD "${field}"`);
    }
    body.style.setProperty(`--diy-${field}`, state.get(DIY_STATE_KEY[field]));
  }

  const bg = state.get(StateKey.DIY_BG);
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
  const theme = state.get(StateKey.THEME);
  if (isValueOf(Theme, theme) === false) {
    throw new Error(`Unknown theme "${theme}"`);
  }

  getElement("theme-toggle").innerHTML = themeIcons[theme];
  document.body.classList.remove(...Object.values(THEME_CLASSES));
  document.body.classList.add(THEME_CLASSES[theme]);

  if (theme === Theme.DIY) {
    applyDiyColors();
  }
}

function handleShowLineNumbers() {
  if (state.get(StateKey.MODE) === Mode.VIEW) {
    return;
  }
  const wrap = document.querySelector(".edit-mode");
  if (wrap === null) return;
  switch (state.get(StateKey.SHOW_LINE_NUMBERS)) {
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
  if (state.get(StateKey.MODE) === Mode.VIEW) {
    return;
  }
  switch (state.get(StateKey.USE_MONOSPACE)) {
    case true:
      getElement("editor").classList.add("monospace-mode");
      return;
    case false:
      getElement("editor").classList.remove("monospace-mode");
      return;
  }
}

function handleWideMode() {
  switch (state.get(StateKey.ENABLE_WIDE_MODE)) {
    case true:
      getElement("typewriter-container").classList.add("wide");
      return;
    case false:
      getElement("typewriter-container").classList.remove("wide");
      return;
  }
}

function handleTooltips() {
  switch (state.get(StateKey.SHOW_TOOLTIPS)) {
    case true:
      document.body.classList.remove("no-tooltips");
      return;
    case false:
      document.body.classList.add("no-tooltips");
      return;
  }
}

function handleWordCount() {
  switch (state.get(StateKey.SHOW_WORD_COUNT)) {
    case true:
      getElement("word-count").style.display = "block";
      return;
    case false:
      getElement("word-count").style.display = "none";
      return;
  }
}

function handleFontSizeChange() {
  const px = `${state.get(StateKey.FONT_SIZE)}px`;
  switch (state.get(StateKey.MODE)) {
    case Mode.EDIT:
      getElement("editor").style.fontSize = px;
      getElement("line-numbers").style.fontSize = px;
      return;
    case Mode.VIEW:
      getElement("view-mode").style.fontSize = px;
      return;
  }
}

/**
 * @param {string} text
 * @returns {Promise<string>}
 */
async function renderMarkdown(text) {
  const { parse } = await import("marked");
  return parse(text, { async: false, breaks: true, gfm: true });
}

function handleModeChange() {
  const container = getElement("typewriter-container");

  switch (state.get(StateKey.MODE)) {
    case Mode.VIEW: {
      container.innerHTML = "";
      const viewDiv = document.createElement("div");
      viewDiv.id = "view-mode";
      viewDiv.className = "view-content";
      viewDiv.style.fontSize = `${state.get(StateKey.FONT_SIZE)}px`;
      container.appendChild(viewDiv);

      renderMarkdown(state.get(StateKey.EDITOR_TEXT))
        .then((html) => {
          viewDiv.innerHTML = html;
        })
        .catch((error) => {
          console.error(error);
          viewDiv.textContent = state.get(StateKey.EDITOR_TEXT);
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
          state.set(StateKey.EDITOR_TEXT, inputEvent.currentTarget.value);
        }

        /**
         * @param {Event} scrollEvent
         */
        function handleEditorScroll(scrollEvent) {
          if (scrollEvent.currentTarget instanceof HTMLTextAreaElement === false)
            return;
          getElement("line-numbers").scrollTop = scrollEvent.currentTarget.scrollTop;
        }

        const fontSize = state.get(StateKey.FONT_SIZE);

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
        textarea.value = state.get(StateKey.EDITOR_TEXT);
        textarea.style.fontSize = `${fontSize}px`;
        lineNums.style.fontSize = `${fontSize}px`;

        if (state.get(StateKey.USE_MONOSPACE) === true) {
          textarea.classList.add("monospace-mode");
        }

        if (state.get(StateKey.SHOW_LINE_NUMBERS) === true) {
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
  if (isKeyOf(DIY_STATE_KEY, field) === false) {
    throw new Error(`Unknown DIY_FIELD "${field}"`);
  }
  state.set(DIY_STATE_KEY[field], hexColor);
  syncDiyField({ field: field, hexColor: hexColor });
  state.set(StateKey.THEME, Theme.DIY);
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
  if (isKeyOf(DIY_STATE_KEY, field) === false) {
    throw new Error(`Unknown DIY_FIELD "${field}"`);
  }
  state.set(DIY_STATE_KEY[field], hexColor);
  syncDiyField({ field: field, hexColor: hexColor });
  state.set(StateKey.THEME, Theme.DIY);
}

function syncFullscreenIcon() {
  const enterIcon = getElement("icon-fullscreen-enter");
  const exitIcon = getElement("icon-fullscreen-exit");
  switch (document.fullscreenElement === null) {
    case true:
      enterIcon.classList.remove("hidden");
      exitIcon.classList.add("hidden");
      return;
    case false:
      enterIcon.classList.add("hidden");
      exitIcon.classList.remove("hidden");
      return;
  }
}

export {
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
};
