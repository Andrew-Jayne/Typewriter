import { Theme } from "@/enums.js";
import darkness from "./icons/darkness.svg?raw";
import dawn from "./icons/dawn.svg?raw";
import daylight from "./icons/daylight.svg?raw";
import diy from "./icons/diy.svg?raw";
import dusk from "./icons/dusk.svg?raw";

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
  [Theme.DAYLIGHT]: daylight,
  [Theme.DAWN]: dawn,
  [Theme.DUSK]: dusk,
  [Theme.DARKNESS]: darkness,
  [Theme.DIY]: diy,
};

export { THEME_CLASSES, THEMES, themeIcons };
