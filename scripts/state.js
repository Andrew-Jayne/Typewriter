const state = new StateTree("tw.", {
  [StateKey.EDITOR_TEXT]: {
    type: "string",
    default: "",
    persistent: true,
  },
  [StateKey.FILE_NAME]: {
    type: "string",
    default: "untitled.txt",
    persistent: true,
  },
  [StateKey.ENABLE_WIDE_MODE]: {
    type: "boolean",
    default: false,
    persistent: true,
    onUpdate: [handleWideMode],
  },
  [StateKey.SHOW_TOOLTIPS]: {
    type: "boolean",
    default: true,
    persistent: true,
    onUpdate: [handleTooltips],
  },
  [StateKey.SHOW_WORD_COUNT]: {
    type: "boolean",
    default: true,
    persistent: true,
    onUpdate: [handleWordCount],
  },
  [StateKey.DIY_BG]: {
    type: "string",
    default: "#faf9f5",
    persistent: true,
  },
  [StateKey.DIY_TEXT]: {
    type: "string",
    default: "#141413",
    persistent: true,
  },
  [StateKey.DIY_ACCENT]: {
    type: "string",
    default: "#d97757",
    persistent: true,
  },
  [StateKey.DIY_BORDER]: {
    type: "string",
    default: "#e8e6dc",
    persistent: true,
  },
  [StateKey.THEME]: {
    type: "string",
    default: Theme.DAYLIGHT,
    persistent: true,
    allowed: [Theme.DAWN, Theme.DAYLIGHT, Theme.DUSK, Theme.DARKNESS, Theme.DIY],
    onUpdate: [handleThemeChange],
  },
  [StateKey.MODE]: {
    type: "string",
    default: Mode.EDIT,
    persistent: true,
    allowed: [Mode.EDIT, Mode.VIEW],
    onUpdate: [handleModeChange],
  },
  [StateKey.FONT_SIZE]: {
    type: "number",
    default: 16,
    persistent: true,
    onUpdate: [handleFontSizeChange],
  },
  [StateKey.SHOW_LINE_NUMBERS]: {
    type: "boolean",
    default: false,
    persistent: true,
    onUpdate: [handleShowLineNumbers],
  },
  [StateKey.USE_MONOSPACE]: {
    type: "boolean",
    default: false,
    persistent: true,
    onUpdate: [handleMonospace],
  },
});
