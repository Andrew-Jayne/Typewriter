# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build

```bash
python compile.py
```

This inlines styles, external libraries, and scripts into `main.html` and outputs a single self-contained file at `build/typewriter.html`. The build also injects the current git commit SHA as a `<meta name="version">` tag and transforms ES module `export` statements into local bindings for inline script compatibility. No dependencies beyond Python 3.

## Development

Run `python compile.py` and open `build/typewriter.html` in a browser. The `main.html` file is a build template — it uses `{{placeholder}}` markers that compile.py resolves.

## Architecture

TypeWriter is a single-page vanilla HTML/CSS/JS text editor. There is no framework, bundler, or package manager. It is designed to run from `file://` with no server. All scripts are compiled into a single `<script type="module">` block.

- **main.html** — HTML template with `{{placeholder}}` markers for styles, scripts, templates, and icons
- **styles/** — CSS files including five theme variants via CSS custom properties and body class toggles
- **scripts/** — All editor logic split across modules: enums, state tree, state handlers, editor operations, UI controls, themes, and main entry point
- **external/** — Third-party libraries (Aspen state tree, marked.js markdown parser)
- **compile.py** — Build script that inlines all assets, transforms ES module exports, and injects git SHA

### Themes

Five themes applied via body classes; Daylight is the default (no class):

- **Daylight** — white/bright light theme (no body class)
- **Dawn** — warm light theme (`dawn-mode`)
- **Dusk** — warm dark mode (`dusk-mode`)
- **Darkness** — AMOLED black dark mode (`darkness-mode`)
- **DIY** — user-customizable theme (`diy-mode`) with colors stored in localStorage

### State Management

State is managed by [Aspen](https://github.com/Andrew-Jayne/Aspen) (`external/aspen.min.js`), a typed localStorage state tree. The tree is defined in `scripts/state.js` as a single `StateTree` instance with namespace `tw.`. Each key declares its type, default, persistence, allowed values, and `onUpdate` callbacks that fire on every `state.set()` and during `state.bootstrap()`.

- `state.get(StateKey.X)` / `state.set(StateKey.X, value)` — read/write state
- `state.bootstrap()` — fires all `onUpdate` callbacks to sync UI on load
- `state.validateStorage()` — cleans orphaned keys, migrates aliases

Keys are defined in `scripts/enums.js` via the `StateKey` enum. localStorage keys are prefixed `tw.` automatically by Aspen (e.g., `StateKey.THEME` = `"theme"` → localStorage key `"tw.theme"`).
