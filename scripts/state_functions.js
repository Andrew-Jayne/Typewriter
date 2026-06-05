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
    body.style.setProperty(
      `--diy-${field}`,
      state.get(DIY_STATE_KEY[field]),
    );
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

  const RED = Math.min(
    255,
    Math.max(0, parseInt(bg.slice(1, 3), 16) + hoverShift),
  );
  const GREEN = Math.min(
    255,
    Math.max(0, parseInt(bg.slice(3, 5), 16) + hoverShift),
  );
  const BLUE = Math.min(
    255,
    Math.max(0, parseInt(bg.slice(5, 7), 16) + hoverShift),
  );

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
  document.body.classList.remove(
    "daylight-mode",
    "dawn-mode",
    "dusk-mode",
    "darkness-mode",
    "diy-mode",
  );
  document.body.classList.add(THEME_CLASSES[theme]);
  if (theme === Theme.DIY) {
    applyDiyColors();
  }
  document.getElementById("theme-toggle").innerHTML = themeIcons[theme];
  document
    .getElementById("theme-toggle")
    .setAttribute("data-tooltip", "Select theme");
}

function handleShowLineNumbers() {
  if (state.get(StateKey.MODE) === Mode.VIEW) {
    return;
  }
  const visible = state.get(StateKey.SHOW_LINE_NUMBERS);
  const wrap = document.querySelector(".edit-mode");
  switch (visible) {
    case true:
      document.getElementById("line-numbers").style.display = "block";
      wrap.classList.add("no-wrap");
      return;
    case false:
      document.getElementById("line-numbers").style.display = "none";
      wrap.classList.remove("no-wrap");
      return;
  }
}

function handleMonospace() {
  if (state.get(StateKey.MODE) === Mode.VIEW) {
    return;
  }
  const enabled = state.get(StateKey.USE_MONOSPACE);
  switch (enabled) {
    case true:
      document.getElementById("editor").classList.add("monospace-mode");
      return;
    case false:
      document.getElementById("editor").classList.remove("monospace-mode");
      return;
  }
}

function handleWideMode() {
  const enabled = state.get(StateKey.ENABLE_WIDE_MODE);
  switch (enabled) {
    case true:
      document.getElementById("typewriter-container").classList.add("wide");
      return;
    case false:
      document.getElementById("typewriter-container").classList.remove("wide");
      return;
  }
}

function handleTooltips() {
  const visible = state.get(StateKey.SHOW_TOOLTIPS);
  switch (visible) {
    case true:
      document.body.classList.remove("no-tooltips");
      return;
    case false:
      document.body.classList.add("no-tooltips");
      return;
  }
}

function handleWordCount() {
  const visible = state.get(StateKey.SHOW_WORD_COUNT);
  switch (visible) {
    case true:
      document.getElementById("word-count").style.display = "block";
      return;
    case false:
      document.getElementById("word-count").style.display = "none";
      return;
  }
}

function handleFontSizeChange() {
  const size = state.get(StateKey.FONT_SIZE);
  const px = `${size}px`;
  switch (state.get(StateKey.MODE)) {
    case Mode.EDIT:
      document.getElementById("editor").style.fontSize = px;
      document.getElementById("line-numbers").style.fontSize = px;
      return;
    case Mode.VIEW:
      document.getElementById("view-mode").style.fontSize = px;
      return;
  }
}

function handleModeChange() {
  switch (state.get(StateKey.MODE)) {
    case Mode.VIEW:
      renderViewMode();
      return;
    case Mode.EDIT:
      renderEditMode();
      return;
  }
}

function renderViewMode() {
  const container = document.getElementById("typewriter-container");

  container.innerHTML = "";
  const viewDiv = document.createElement("div");
  viewDiv.id = "view-mode";
  viewDiv.className = "view-content";
  viewDiv.style.fontSize = `${state.get(StateKey.FONT_SIZE)}px`;
  viewDiv.innerHTML = marked.parse(state.get(StateKey.EDITOR_TEXT), {
    breaks: true,
    gfm: true,
  });
  container.appendChild(viewDiv);
  document.getElementById("icon-edit-mode").classList.add("hidden");
  document.getElementById("icon-view-mode").classList.remove("hidden");
  document
    .getElementById("mode-toggle")
    .setAttribute("data-tooltip", "Switch to editor");
}

function renderEditMode() {
  const container = document.getElementById("typewriter-container");
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

  textarea.addEventListener("input", () => {
    state.set(StateKey.EDITOR_TEXT, textarea.value);
    updateWordCount();
    updateLineNumbers();
  });

  textarea.addEventListener("scroll", () => {
    lineNums.scrollTop = textarea.scrollTop;
  });

  document.getElementById("icon-edit-mode").classList.remove("hidden");
  document.getElementById("icon-view-mode").classList.add("hidden");
  document
    .getElementById("mode-toggle")
    .setAttribute("data-tooltip", "Switch to reader");
  updateLineNumbers();
}

/**
 * @param {{ field: string, hexColor: string }} params
 */
function syncDiyField({ field, hexColor }) {
  document.getElementById(`diy-${field}-hex`).value = hexColor;
  document.getElementById(`diy-${field}-picker`).value = hexColor;
  document.body.style.setProperty(`--diy-${field}`, hexColor);
}

/**
 * @param {{ field: string, hexColor: string }} params
 */
function handleDiyPickerInput({ field, hexColor }) {
  state.set(DIY_STATE_KEY[field], hexColor);
  syncDiyField({ field: field, hexColor: hexColor });
  state.set(StateKey.THEME, Theme.DIY);
}

/**
 * @param {{ field: string, rawInput: string }} params
 */
function handleDiyColorInput({ field, rawInput }) {
  const errorEl = document.getElementById("diy-color-error");
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
  state.set(DIY_STATE_KEY[field], hexColor);
  syncDiyField({ field: field, hexColor: hexColor });
  state.set(StateKey.THEME, Theme.DIY);
}
