function main() {
  state.validateStorage();

  document.addEventListener("fullscreenchange", () => {
    syncFullscreenIcon();
  });

  document.addEventListener("keydown", (keyEvent) => {
    if (keyEvent.repeat === true) {
      return;
    }
    const modifierHeld = keyEvent.metaKey === true || keyEvent.ctrlKey === true;
    if (
      keyEvent.key === "Tab" &&
      state.get(StateKey.MODE) === Mode.EDIT
    ) {
      keyEvent.preventDefault();
      const textarea = document
        .getElementById("typewriter-container")
        .querySelector("textarea");
      const start = textarea.selectionStart;
      textarea.value =
        textarea.value.substring(0, start) +
        "\t" +
        textarea.value.substring(textarea.selectionEnd);
      textarea.selectionStart = start + 1;
      textarea.selectionEnd = start + 1;
      state.set(StateKey.EDITOR_TEXT, textarea.value);
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
  });

  document.addEventListener("click", (clickEvent) => {
    if (
      document.getElementById("theme-picker").contains(clickEvent.target) ===
      false
    ) {
      document.getElementById("theme-picker-menu").classList.remove("show");
    }
  });

  document.getElementById("toolbar-open").addEventListener("click", toggleToolbar);
  document.getElementById("toolbar-close").addEventListener("click", toggleToolbar);
  document.getElementById("btn-open").addEventListener("click", openFile);
  document.getElementById("btn-clear").addEventListener("click", clearText);
  document.getElementById("btn-save").addEventListener("click", saveFile);
  document.getElementById("mode-toggle").addEventListener("click", toggleMode);
  document.getElementById("theme-toggle").addEventListener("click", toggleThemePicker);
  document.getElementById("btn-settings").addEventListener("click", toggleSettings);
  document.getElementById("btn-fullscreen").addEventListener("click", toggleFullscreen);
  document.getElementById("file-input").addEventListener("change", handleFileSelect);

  for (const option of document.querySelectorAll(".theme-option[data-theme]")) {
    option.addEventListener("click", () => {
      selectTheme({ theme: option.dataset.theme });
    });
  }

  document.getElementById("settings-modal").addEventListener("click", (clickEvent) => {
    if (clickEvent.target === document.getElementById("settings-modal")) {
      closeSettings();
    }
  });
  document.getElementById("btn-close-settings").addEventListener("click", closeSettings);
  document.getElementById("setting-font-size").addEventListener("change", (event) => {
    state.set(StateKey.FONT_SIZE, parseInt(event.target.value, 10));
  });
  document.getElementById("toggle-focus-mode").addEventListener("change", toggleFocusMode);

  for (const toggle of document.querySelectorAll("[data-state-key]")) {
    toggle.addEventListener("change", () => {
      const key = toggle.dataset.stateKey;
      state.set(key, state.get(key) === false);
    });
  }

  for (const picker of document.querySelectorAll(".settings-swatch[data-field]")) {
    picker.addEventListener("input", () => {
      handleDiyPickerInput({ field: picker.dataset.field, hexColor: picker.value });
    });
  }

  for (const input of document.querySelectorAll(".settings-color-input[data-field]")) {
    input.addEventListener("change", () => {
      handleDiyColorInput({ field: input.dataset.field, rawInput: input.value });
    });
  }

  state.bootstrap();

  updateWordCount();
  window.scrollTo(0, 0);
}

main();
