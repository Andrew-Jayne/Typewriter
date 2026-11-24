import { AspenKey, StateTree } from "aspen";
import { Mode, Theme } from "@/enums.js";
import {
  applyFocusMode,
  handleFontSizeChange,
  handleModeChange,
  handleMonospace,
  handleSettingsOpen,
  handleShowLineNumbers,
  handleThemeChange,
  handleThemePickerOpen,
  handleToolbarCollapsed,
  handleTooltips,
  handleWideMode,
  handleWordCount,
  syncFullscreenIcon,
  updateLineNumbers,
  updateWordCount,
} from "@/state_functions.js";
import { syncSettingsControls } from "@/ui.js";

class TypewriterState extends StateTree {
  namespace = "tw.";

  mode = new AspenKey({
    type: String,
    default: Mode.EDIT,
    allowed: Object.values(Mode),
    onUpdate: [handleModeChange, updateWordCount, updateLineNumbers],
  });

  theme = new AspenKey({
    type: String,
    default: Theme.DAYLIGHT,
    allowed: Object.values(Theme),
    bootMirror: true,
    onUpdate: [handleThemeChange],
  });

  editorText = new AspenKey({
    type: String,
    default: "",
    onUpdate: [updateWordCount, updateLineNumbers],
  });

  fileName = new AspenKey({
    type: String,
    default: "untitled.txt",
  });

  enableWideMode = new AspenKey({
    type: Boolean,
    default: false,
    onUpdate: [handleWideMode, syncSettingsControls],
  });

  showTooltips = new AspenKey({
    type: Boolean,
    default: true,
    onUpdate: [handleTooltips, syncSettingsControls],
  });

  showWordCount = new AspenKey({
    type: Boolean,
    default: true,
    onUpdate: [handleWordCount, syncSettingsControls],
  });

  diyBg = new AspenKey({
    type: String,
    default: "#faf9f5",
    bootMirror: true,
    onUpdate: [syncSettingsControls],
  });

  diyText = new AspenKey({
    type: String,
    default: "#141413",
    onUpdate: [syncSettingsControls],
  });

  diyAccent = new AspenKey({
    type: String,
    default: "#d97757",
    onUpdate: [syncSettingsControls],
  });

  diyBorder = new AspenKey({
    type: String,
    default: "#e8e6dc",
    onUpdate: [syncSettingsControls],
  });

  fontSize = new AspenKey({
    type: Number,
    default: 16,
    onUpdate: [handleFontSizeChange, syncSettingsControls],
  });

  showLineNumbers = new AspenKey({
    type: Boolean,
    default: false,
    onUpdate: [handleShowLineNumbers, syncSettingsControls],
  });

  useMonospace = new AspenKey({
    type: Boolean,
    default: false,
    onUpdate: [handleMonospace, syncSettingsControls],
  });

  fullscreen = new AspenKey({
    type: Boolean,
    default: false,
    persistent: false,
    onUpdate: [syncFullscreenIcon],
  });

  settingsOpen = new AspenKey({
    type: Boolean,
    default: false,
    persistent: false,
    onUpdate: [handleSettingsOpen],
  });

  themePickerOpen = new AspenKey({
    type: Boolean,
    default: false,
    persistent: false,
    onUpdate: [handleThemePickerOpen],
  });

  toolbarCollapsed = new AspenKey({
    type: Boolean,
    default: true,
    persistent: false,
    onUpdate: [handleToolbarCollapsed],
  });

  focusMode = new AspenKey({
    type: Boolean,
    default: false,
    persistent: false,
    onUpdate: [applyFocusMode, syncSettingsControls],
  });
}

export const state = await TypewriterState.create();
