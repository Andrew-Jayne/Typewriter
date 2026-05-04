const DEFAULTS = {
    'tw.theme': 'daylight',
    'tw.editorText': '',
    'tw.fileName': 'untitled.txt',
    'tw.mode': 'edit',
    'tw.fontSize': '16',
    'tw.lineNumbers': 'true',
    'tw.monospace': 'false',
    'tw.wideMode': 'false',
    'tw.diy.bg': '#faf9f5',
    'tw.diy.text': '#141413',
    'tw.diy.accent': '#d97757',
    'tw.diy.border': '#e8e6dc',
    'tw.diy.save': '#d97757'
};

function getState(key) {
    const stored = localStorage.getItem(key);
    if (stored !== null) {
        return stored;
    }
    return DEFAULTS[key];
}

function setState(key, value) {
    localStorage.setItem(key, value);
}
