const Mode = Object.freeze({
  EDIT: "edit",
  VIEW: "view",
});

const Theme = Object.freeze({
  DAWN: "dawn",
  DAYLIGHT: "daylight",
  DUSK: "dusk",
  DARKNESS: "darkness",
  DIY: "diy",
});

const DIY_FIELDS = Object.freeze(["bg", "text", "accent", "border"]);

const StateKey = Object.freeze({
  THEME: "theme",
  EDITOR_TEXT: "editorText",
  FILE_NAME: "fileName",
  MODE: "mode",
  FONT_SIZE: "fontSize",
  SHOW_LINE_NUMBERS: "showLineNumbers",
  USE_MONOSPACE: "useMonospace",
  ENABLE_WIDE_MODE: "enableWideMode",
  SHOW_TOOLTIPS: "showTooltips",
  SHOW_WORD_COUNT: "showWordCount",
  DIY_BG: "diy.bg",
  DIY_TEXT: "diy.text",
  DIY_ACCENT: "diy.accent",
  DIY_BORDER: "diy.border",
});

const DIY_STATE_KEY = Object.freeze({
  bg: StateKey.DIY_BG,
  text: StateKey.DIY_TEXT,
  accent: StateKey.DIY_ACCENT,
  border: StateKey.DIY_BORDER,
});
