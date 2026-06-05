function toggleToolbar() {
  document.getElementById("toolbar").classList.toggle("collapsed");
}

let focusModeActive = false;

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

function syncSettingsControls() {
  document.getElementById("setting-font-size").value = state.get(
    StateKey.FONT_SIZE,
  );
  document.getElementById("toggle-line-numbers").checked = state.get(
    StateKey.SHOW_LINE_NUMBERS,
  );
  document.getElementById("toggle-monospace").checked = state.get(
    StateKey.USE_MONOSPACE,
  );
  document.getElementById("toggle-wide").checked = state.get(
    StateKey.ENABLE_WIDE_MODE,
  );
  document.getElementById("toggle-tooltips").checked = state.get(
    StateKey.SHOW_TOOLTIPS,
  );
  document.getElementById("toggle-word-count").checked = state.get(
    StateKey.SHOW_WORD_COUNT,
  );
  document.getElementById("toggle-focus-mode").checked = focusModeActive;
  syncDiyField({ field: "bg", hexColor: state.get(StateKey.DIY_BG) });
  syncDiyField({ field: "text", hexColor: state.get(StateKey.DIY_TEXT) });
  syncDiyField({ field: "accent", hexColor: state.get(StateKey.DIY_ACCENT) });
  syncDiyField({ field: "border", hexColor: state.get(StateKey.DIY_BORDER) });
}

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

function closeSettings() {
  document.getElementById("settings-modal").classList.remove("show");
}

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

function updatePickerActiveState() {
  const options = document
    .getElementById("theme-picker-menu")
    .querySelectorAll(".theme-option");
  for (const option of options) {
    option.classList.remove("active");
  }
  const index = THEMES.indexOf(state.get(StateKey.THEME));
  if (index >= 0) {
    options[index].classList.add("active");
  }
}

function selectTheme({ theme }) {
  document.getElementById("theme-picker-menu").classList.remove("show");
  state.set(StateKey.THEME, theme);
}
