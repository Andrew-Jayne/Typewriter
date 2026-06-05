# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build

```bash
python compile.py
```

This inlines `main.css` and `main.js` into `main.html` and outputs a single self-contained file at `build/typewriter.html`. The build also injects the current git commit SHA as a `<meta name="version">` tag. No dependencies beyond Python 3.

## Development

Open `main.html` directly in a browser for development — it references the CSS and JS as separate files. The `build/` output is the distributable artifact.

## Architecture

TypeWriter is a single-page vanilla HTML/CSS/JS text editor. There is no framework, bundler, or package manager. It is designed to run from `file://` with no server.

- **main.html** — HTML shell with the editor layout (header, textarea, controls, toast, DIY theme modal)
- **main.css** — All styling including five theme variants via CSS custom properties and body class toggles
- **main.js** — All editor logic: localStorage-first state management, theme cycling, font size control, file open/save, word count, markdown-to-HTML view mode, DIY theme configuration, keyboard shortcuts (Cmd/Ctrl+S save, Cmd/Ctrl+D theme, Cmd/Ctrl+R view toggle)
- **compile.py** — Build script that regex-matches `<link>` and `<script>` tags to inline external files, injects git SHA

### Themes

Five themes applied via body classes; Daylight is the default (no class):

- **Daylight** — white/bright light theme (no body class)
- **Dawn** — warm light theme (`dawn-mode`)
- **Dusk** — warm dark mode (`dusk-mode`)
- **Darkness** — AMOLED black dark mode (`darkness-mode`)
- **DIY** — user-customizable theme (`diy-mode`) with colors stored in localStorage

### State Management

All state lives in localStorage under `tw.*` keys. The app reads state on load and renders from it. On any change, state is written to localStorage first, then the UI updates. There are no in-memory state variables — `getState(key)` and `setState(key, value)` are the sole interface.

Keys: `tw.theme`, `tw.fontSize`, `tw.editorText`, `tw.fileName`, `tw.viewMode`, `tw.diy.bg`, `tw.diy.text`, `tw.diy.accent`, `tw.diy.border`
