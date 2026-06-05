/** Toggles the toolbar between collapsed (hamburger) and expanded states. */
function toggleToolbar() {
  document.getElementById("toolbar").classList.toggle("collapsed");
}

let focusModeActive = false;

/** Toggles focus mode — hides/shows the toolbar. Session-only, resets on refresh. */
function toggleFocusMode() {
  focusModeActive = focusModeActive === false;
  const toolbar = document.getElementById("toolbar");
  switch (focusModeActive) {
    case true:
      toolbar.style.display = "none";
      return;
    case false:
      toolbar.style.display = "flex";
      return;
  }
}

/** Toggles browser fullscreen mode. Icon update happens via fullscreenchange event. */
function toggleFullscreen() {
  switch (document.fullscreenElement === null) {
    case true:
      document.documentElement.requestFullscreen();
      return;
    case false:
      document.exitFullscreen();
      return;
  }
}

/** Called by fullscreenchange event — syncs icon to actual browser state. */
function syncFullscreenIcon() {
  const enterIcon = document.getElementById("icon-fullscreen-enter");
  const exitIcon = document.getElementById("icon-fullscreen-exit");
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

/** Syncs all settings controls to current state. */
function syncSettingsControls() {
  document.getElementById("setting-font-size").value = getState({
    key: StateKey.FONT_SIZE,
  });
  document.getElementById("toggle-line-numbers").checked = getState({
    key: StateKey.SHOW_LINE_NUMBERS,
  });
  document.getElementById("toggle-monospace").checked = getState({
    key: StateKey.USE_MONOSPACE,
  });
  document.getElementById("toggle-wide").checked = getState({
    key: StateKey.ENABLE_WIDE_MODE,
  });
  document.getElementById("toggle-tooltips").checked = getState({
    key: StateKey.SHOW_TOOLTIPS,
  });
  document.getElementById("toggle-word-count").checked = getState({
    key: StateKey.SHOW_WORD_COUNT,
  });
  document.getElementById("toggle-focus-mode").checked = focusModeActive;
  syncDiyField({ field: "bg", hexColor: getState({ key: StateKey.DIY_BG }) });
  syncDiyField({
    field: "text",
    hexColor: getState({ key: StateKey.DIY_TEXT }),
  });
  syncDiyField({
    field: "accent",
    hexColor: getState({ key: StateKey.DIY_ACCENT }),
  });
  syncDiyField({
    field: "border",
    hexColor: getState({ key: StateKey.DIY_BORDER }),
  });
}

/** Toggles the settings modal open/closed. */
function toggleSettings() {
  const modal = document.getElementById("settings-modal");
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

/** Closes the settings modal. */
function closeSettings() {
  document.getElementById("settings-modal").classList.remove("show");
}

/**
 * @param {MouseEvent} clickEvent
 */
function closeSettingsOnOverlay(clickEvent) {
  if (clickEvent.target === document.getElementById("settings-modal")) {
    closeSettings();
  }
}

/**
 * Inverts a boolean state key.
 * @param {{ key: string }} params
 */
function toggleBooleanState({ key }) {
  setState({ key: key, value: getState({ key: key }) === false });
}

/** @param {{ value: string }} params */
function setFontSize({ value }) {
  setState({ key: StateKey.FONT_SIZE, value: value });
}

/** Toggles the theme picker dropdown open/closed. */
function toggleThemePicker() {
  const themePickerMenu = document.getElementById("theme-picker-menu");
  switch (themePickerMenu.classList.contains("show")) {
    case true:
      themePickerMenu.classList.remove("show");
      return;
    case false:
      updatePickerActiveState();
      themePickerMenu.classList.add("show");
  }
}

/** Highlights the currently active theme in the picker menu. */
function updatePickerActiveState() {
  const options = document
    .getElementById("theme-picker-menu")
    .querySelectorAll(".theme-option");
  for (const option of options) {
    option.classList.remove("active");
  }
  const index = THEMES.indexOf(getState({ key: StateKey.THEME }));
  if (index >= 0) {
    options[index].classList.add("active");
  }
}

/**
 * @param {{ theme: string }} params
 */
function selectTheme({ theme }) {
  document.getElementById("theme-picker-menu").classList.remove("show");
  setState({ key: StateKey.THEME, value: theme });
}
