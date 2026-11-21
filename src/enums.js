import darkness from "./icons/darkness.svg?raw";
import dawn from "./icons/dawn.svg?raw";
import daylight from "./icons/daylight.svg?raw";
import diy from "./icons/diy.svg?raw";
import dusk from "./icons/dusk.svg?raw";

const Mode = Object.freeze({
  EDIT: "edit",
  VIEW: "view",
});

const DiyFields = Object.freeze(["bg", "text", "accent", "border"]);

const DiyStateKeys = Object.freeze({
  bg: "diyBg",
  text: "diyText",
  accent: "diyAccent",
  border: "diyBorder",
});

const Theme = Object.freeze({
  DAWN: "dawn",
  DAYLIGHT: "daylight",
  DUSK: "dusk",
  DARKNESS: "darkness",
  DIY: "diy",
});

const Themes = Object.values(Theme);

const ThemeClasses = Object.freeze({
  [Theme.DAYLIGHT]: "daylight-mode",
  [Theme.DAWN]: "dawn-mode",
  [Theme.DUSK]: "dusk-mode",
  [Theme.DARKNESS]: "darkness-mode",
  [Theme.DIY]: "diy-mode",
});

const ThemeIcons = Object.freeze({
  [Theme.DAYLIGHT]: daylight,
  [Theme.DAWN]: dawn,
  [Theme.DUSK]: dusk,
  [Theme.DARKNESS]: darkness,
  [Theme.DIY]: diy,
});

const Elements = Object.freeze({});

export {
  DiyFields,
  DiyStateKeys,
  Elements,
  Mode,
  Theme,
  ThemeClasses,
  ThemeIcons,
  Themes,
};
