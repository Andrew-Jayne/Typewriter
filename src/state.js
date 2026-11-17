import { AspenKey, StateTree } from "aspen";
import { Mode, StateKey, Theme } from "@/enums.js";
import {
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

  [StateKey.MODE] = new AspenKey({
    type: String,
    default: Mode.EDIT,
    persistent: true,
    allowed: Object.values(Mode),
    onUpdate: [handleModeChange, updateWordCount, updateLineNumbers],
  });

  [StateKey.THEME] = new AspenKey({
    type: String,
    default: Theme.DAYLIGHT,
    persistent: true,
    allowed: Object.values(Theme),
    onUpdate: [handleThemeChange],
  });

  [StateKey.EDITOR_TEXT] = new AspenKey({
    type: String,
    default: "",
    persistent: true,
    onUpdate: [updateWordCount, updateLineNumbers],
  });

  [StateKey.FILE_NAME] = new AspenKey({
    type: String,
    default: "untitled.txt",
    persistent: true,
  });

  [StateKey.ENABLE_WIDE_MODE] = new AspenKey({
    type: Boolean,
    default: false,
    persistent: true,
    onUpdate: [handleWideMode],
  });

  [StateKey.SHOW_TOOLTIPS] = new AspenKey({
    type: Boolean,
    default: true,
    persistent: true,
    onUpdate: [handleTooltips],
  });

  [StateKey.SHOW_WORD_COUNT] = new AspenKey({
    type: Boolean,
    default: true,
    persistent: true,
    onUpdate: [handleWordCount],
  });

  [StateKey.DIY_BG] = new AspenKey({
    type: String,
    default: "#faf9f5",
    persistent: true,
  });

  [StateKey.DIY_TEXT] = new AspenKey({
    type: String,
    default: "#141413",
    persistent: true,
  });

  [StateKey.DIY_ACCENT] = new AspenKey({
    type: String,
    default: "#d97757",
    persistent: true,
  });

  [StateKey.DIY_BORDER] = new AspenKey({
    type: String,
    default: "#e8e6dc",
    persistent: true,
  });

  [StateKey.FONT_SIZE] = new AspenKey({
    type: Number,
    default: 16,
    persistent: true,
    onUpdate: [handleFontSizeChange],
  });

  [StateKey.SHOW_LINE_NUMBERS] = new AspenKey({
    type: Boolean,
    default: false,
    persistent: true,
    onUpdate: [handleShowLineNumbers],
  });

  [StateKey.USE_MONOSPACE] = new AspenKey({
    type: Boolean,
    default: false,
    persistent: true,
    onUpdate: [handleMonospace],
  });

  [StateKey.FULLSCREEN] = new AspenKey({
    type: Boolean,
    default: false,
    persistent: false,
    onUpdate: [syncFullscreenIcon],
  });

  [StateKey.FOCUS_MODE] = new AspenKey({
    type: Boolean,
    default: false,
    persistent: false,
    onUpdate: [syncFullscreenIcon],
  });
}

const state = await StateTree.create.call(TypewriterState, null);

export { state };
