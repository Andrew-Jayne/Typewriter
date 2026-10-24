import clear from "./icons/clear.svg?raw";
import closeMenu from "./icons/close-menu.svg?raw";
import darkness from "./icons/darkness.svg?raw";
import dawn from "./icons/dawn.svg?raw";
import daylight from "./icons/daylight.svg?raw";
import diy from "./icons/diy.svg?raw";
import dusk from "./icons/dusk.svg?raw";
import editMode from "./icons/edit-mode.svg?raw";
import fullscreenEnter from "./icons/fullscreen-enter.svg?raw";
import fullscreenExit from "./icons/fullscreen-exit.svg?raw";
import hamburger from "./icons/hamburger.svg?raw";
import openFile from "./icons/open-file.svg?raw";
import save from "./icons/save.svg?raw";
import settings from "./icons/settings.svg?raw";
import viewMode from "./icons/view-mode.svg?raw";
import { isKeyOf } from "./utils.js";

const ICONS = Object.freeze({
  clear: clear,
  "close-menu": closeMenu,
  darkness: darkness,
  dawn: dawn,
  daylight: daylight,
  diy: diy,
  dusk: dusk,
  "edit-mode": editMode,
  "fullscreen-enter": fullscreenEnter,
  "fullscreen-exit": fullscreenExit,
  hamburger: hamburger,
  "open-file": openFile,
  save: save,
  settings: settings,
  "view-mode": viewMode,
});

function buildIcons() {
  for (const element of document.querySelectorAll("[data-icon]")) {
    if (element instanceof HTMLElement === false) continue;
    const name = element.dataset.icon;
    if (isKeyOf(ICONS, name) === false) {
      console.warn(`Missing icon: ${name}`);
      continue;
    }
    element.innerHTML = ICONS[name];
  }
}

export { buildIcons, ICONS };
