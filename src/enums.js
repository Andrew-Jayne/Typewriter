import darkness from "./icons/darkness.svg?raw";
import dawn from "./icons/dawn.svg?raw";
import daylight from "./icons/daylight.svg?raw";
import diy from "./icons/diy.svg?raw";
import dusk from "./icons/dusk.svg?raw";

const Mode = Object.freeze({
  EDIT: "edit",
  VIEW: "view",
});

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
  FULLSCREEN: "fullscreen",
  FOCUS_MODE: "focusMode",
});

const DIY_FIELDS = Object.freeze(["bg", "text", "accent", "border"]);
const DIY_STATE_KEY = Object.freeze({
  bg: StateKey.DIY_BG,
  text: StateKey.DIY_TEXT,
  accent: StateKey.DIY_ACCENT,
  border: StateKey.DIY_BORDER,
});

const Theme = Object.freeze({
  DAWN: "dawn",
  DAYLIGHT: "daylight",
  DUSK: "dusk",
  DARKNESS: "darkness",
  DIY: "diy",
});

const THEMES = Object.values(Theme);

const THEME_CLASSES = {
  [Theme.DAYLIGHT]: "daylight-mode",
  [Theme.DAWN]: "dawn-mode",
  [Theme.DUSK]: "dusk-mode",
  [Theme.DARKNESS]: "darkness-mode",
  [Theme.DIY]: "diy-mode",
};

const themeIcons = {
  [Theme.DAYLIGHT]: daylight,
  [Theme.DAWN]: dawn,
  [Theme.DUSK]: dusk,
  [Theme.DARKNESS]: darkness,
  [Theme.DIY]: diy,
};

export {
  DIY_FIELDS,
  DIY_STATE_KEY,
  Mode,
  StateKey,
  THEME_CLASSES,
  THEMES,
  Theme,
  themeIcons,
};
