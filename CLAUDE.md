# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build

```bash
python compile.py
```

This inlines `TypeWriter.css` and `TypeWriter.js` into `TypeWriter-dev.html` and outputs a single self-contained file at `build/TypeWriter.html`. No dependencies beyond Python 3.

## Development

Open `TypeWriter-dev.html` directly in a browser for development — it references the CSS and JS as separate files. The `build/` output is the distributable artifact.

## Architecture

TypeWriter is a single-page vanilla HTML/CSS/JS text editor. There is no framework, bundler, or package manager.

- **TypeWriter-dev.html** — HTML shell with the editor layout (header, textarea, controls, toast)
- **TypeWriter.css** — All styling including four theme variants (light, warm, soft-dark, dark) via CSS custom properties and body class toggles
- **TypeWriter.js** — All editor logic: theme cycling, font size control, file open/save, word count, localStorage persistence, markdown-to-HTML view mode, keyboard shortcuts (Cmd/Ctrl+S save, Cmd/Ctrl+D theme, Cmd/Ctrl+R view toggle)
- **compile.py** — Build script that regex-matches `<link>` and `<script>` tags to inline external files

Themes are applied by adding/removing body classes (`dark-mode`, `warm-mode`, `soft-dark-mode`); light is the default (no class). Each theme requires CSS rules for every styled element.
