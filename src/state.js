import { AspenKey, StateTree } from "aspen";
import { Mode, Theme } from "@/enums.js";
import {
  applyFocusMode,
  handleFontSizeChange,
  handleModeChange,
  handleMonospace,
  handleShowLineNumbers,
  handleThemeChange,
  handleTooltips,
  handleWideMode,
  handleWordCount,
  syncFullscreenIcon,
  updateLineNumbers,
  updateWordCount,
} from "@/state_functions.js";

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
    onUpdate: [handleWideMode],
  });

  showTooltips = new AspenKey({
    type: Boolean,
    default: true,
    onUpdate: [handleTooltips],
  });

  showWordCount = new AspenKey({
    type: Boolean,
    default: true,
    onUpdate: [handleWordCount],
  });

  diyBg = new AspenKey({
    type: String,
    default: "#faf9f5",
  });

  diyText = new AspenKey({
    type: String,
    default: "#141413",
  });

  diyAccent = new AspenKey({
    type: String,
    default: "#d97757",
  });

  diyBorder = new AspenKey({
    type: String,
    default: "#e8e6dc",
  });

  fontSize = new AspenKey({
    type: Number,
    default: 16,
    onUpdate: [handleFontSizeChange],
  });

  showLineNumbers = new AspenKey({
    type: Boolean,
    default: false,
    onUpdate: [handleShowLineNumbers],
  });

  useMonospace = new AspenKey({
    type: Boolean,
    default: false,
    onUpdate: [handleMonospace],
  });

  fullscreen = new AspenKey({
    type: Boolean,
    default: false,
    persistent: false,
    onUpdate: [syncFullscreenIcon],
  });

  focusMode = new AspenKey({
    type: Boolean,
    default: false,
    persistent: false,
    onUpdate: [applyFocusMode],
  });
}

export const state = await TypewriterState.create();
