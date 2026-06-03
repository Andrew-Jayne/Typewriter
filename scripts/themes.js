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
    [Theme.DAYLIGHT]: `{{icon:icons/daylight.svg}}`,
    [Theme.DAWN]: `{{icon:icons/dawn.svg}}`,
    [Theme.DUSK]: `{{icon:icons/dusk.svg}}`,
    [Theme.DARKNESS]: `{{icon:icons/darkness.svg}}`,
    [Theme.DIY]: `{{icon:icons/diy.svg}}`,
};
