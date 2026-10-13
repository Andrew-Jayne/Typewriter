import { Theme } from "@/enums.js";

const THEMES = [
  Theme.DAWN,
  Theme.DAYLIGHT,
  Theme.DUSK,
  Theme.DARKNESS,
  Theme.DIY,
];
const THEME_CLASSES = {
  [Theme.DAYLIGHT]: "daylight-mode",
  [Theme.DAWN]: "dawn-mode",
  [Theme.DUSK]: "dusk-mode",
  [Theme.DARKNESS]: "darkness-mode",
  [Theme.DIY]: "diy-mode",
};

const themeIcons = {
  [Theme.DAYLIGHT]: `<img src="/src/icons/daylight.svg" alt="">`,
  [Theme.DAWN]: `<img src="/src/icons/dawn.svg" alt="">`,
  [Theme.DUSK]: `<img src="/src/icons/dusk.svg" alt="">`,
  [Theme.DARKNESS]: `<img src="/src/icons/darkness.svg" alt="">`,
  [Theme.DIY]: `<img src="/src/icons/diy.svg" alt="">`,
};

export { THEME_CLASSES, themeIcons, THEMES };
