const Mode = Object.freeze({
    EDIT: 'edit',
    VIEW: 'view'
});

const Theme = Object.freeze({
    DAWN: 'dawn',
    DAYLIGHT: 'daylight',
    DUSK: 'dusk',
    DARKNESS: 'darkness',
    DIY: 'diy'
});

const DIY_FIELDS = Object.freeze(['bg', 'text', 'accent', 'border', 'save']);

const StateKey = Object.freeze({
    THEME: 'tw.theme',
    EDITOR_TEXT: 'tw.editorText',
    FILE_NAME: 'tw.fileName',
    MODE: 'tw.mode',
    FONT_SIZE: 'tw.fontSize',
    LINE_NUMBERS: 'tw.lineNumbers',
    MONOSPACE: 'tw.monospace',
    WIDE_MODE: 'tw.wideMode',
    TOOLTIPS: 'tw.tooltips',
    WORD_COUNT: 'tw.wordCount',
    DIY_BG: 'tw.diy.bg',
    DIY_TEXT: 'tw.diy.text',
    DIY_ACCENT: 'tw.diy.accent',
    DIY_BORDER: 'tw.diy.border',
    DIY_SAVE: 'tw.diy.save'
});
