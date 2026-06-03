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
    THEME: "tw.theme",
    EDITOR_TEXT: "tw.editorText",
    FILE_NAME: "tw.fileName",
    MODE: "tw.mode",
    FONT_SIZE: "tw.fontSize",
    SHOW_LINE_NUMBERS: "tw.showLineNumbers",
    USE_MONOSPACE: "tw.useMonospace",
    ENABLE_WIDE_MODE: "tw.enableWideMode",
    SHOW_TOOLTIPS: "tw.showTooltips",
    SHOW_WORD_COUNT: "tw.showWordCount",
    DIY_BG: "tw.diy.bg",
    DIY_TEXT: "tw.diy.text",
    DIY_ACCENT: "tw.diy.accent",
    DIY_BORDER: "tw.diy.border",
});

const DIY_STATE_KEY = Object.freeze({
    bg: StateKey.DIY_BG,
    text: StateKey.DIY_TEXT,
    accent: StateKey.DIY_ACCENT,
    border: StateKey.DIY_BORDER,
});
