import { StateLeaf, StateTree } from "aspen";
import { Mode, MonoFont, TextFont, Theme } from "@/enums.js";
import {
  applyFocusMode,
  handleFontSizeChange,
  handleModeChange,
  handleMonoFont,
  handleMonospace,
  handleSettingsOpen,
  handleShowLineNumbers,
  handleTextFont,
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

  mode = StateLeaf.string({
    default: Mode.EDIT,
    allowed: Object.values(Mode),
    onUpdate: [handleModeChange, updateWordCount, updateLineNumbers],
  });

  theme = StateLeaf.string({
    default: Theme.DAYLIGHT,
    allowed: Object.values(Theme),
    bootMirror: true,
    onUpdate: [handleThemeChange],
  });

  editorText = StateLeaf.string({
    default: "",
    onUpdate: [updateWordCount, updateLineNumbers],
  });

  fileName = StateLeaf.string({
    default: "untitled.txt",
  });

  enableWideMode = StateLeaf.boolean({
    default: false,
    onUpdate: [handleWideMode, syncSettingsControls],
  });

  showTooltips = StateLeaf.boolean({
    default: true,
    onUpdate: [handleTooltips, syncSettingsControls],
  });

  showWordCount = StateLeaf.boolean({
    default: true,
    onUpdate: [handleWordCount, syncSettingsControls],
  });

  diyBg = StateLeaf.string({
    default: "#faf9f5",
    bootMirror: true,
    onUpdate: [syncSettingsControls],
  });

  diyText = StateLeaf.string({
    default: "#141413",
    onUpdate: [syncSettingsControls],
  });

  diyAccent = StateLeaf.string({
    default: "#d97757",
    onUpdate: [syncSettingsControls],
  });

  diyBorder = StateLeaf.string({
    default: "#e8e6dc",
    onUpdate: [syncSettingsControls],
  });

  fontSize = StateLeaf.number({
    default: 16,
    onUpdate: [handleFontSizeChange, syncSettingsControls],
  });

  showLineNumbers = StateLeaf.boolean({
    default: false,
    onUpdate: [handleShowLineNumbers, syncSettingsControls],
  });

  useMonospace = StateLeaf.boolean({
    default: false,
    onUpdate: [handleMonospace, syncSettingsControls],
  });

  textFont = StateLeaf.string({
    default: TextFont.GEORGIA,
    allowed: Object.values(TextFont),
    onUpdate: [handleTextFont, syncSettingsControls],
  });

  monoFont = StateLeaf.string({
    default: MonoFont.CLASSIC,
    allowed: Object.values(MonoFont),
    onUpdate: [handleMonoFont, syncSettingsControls],
  });

  customTextFontName = StateLeaf.string({
    default: "",
    onUpdate: [syncSettingsControls],
  });

  customMonoFontName = StateLeaf.string({
    default: "",
    onUpdate: [syncSettingsControls],
  });

  fullscreen = StateLeaf.boolean({
    default: false,
    persistent: false,
    onUpdate: [syncFullscreenIcon],
  });

  settingsOpen = StateLeaf.boolean({
    default: false,
    persistent: false,
    onUpdate: [handleSettingsOpen],
  });

  themePickerOpen = StateLeaf.boolean({
    default: false,
    persistent: false,
    onUpdate: [handleThemePickerOpen],
  });

  toolbarCollapsed = StateLeaf.boolean({
    default: true,
    persistent: false,
    onUpdate: [handleToolbarCollapsed],
  });

  focusMode = StateLeaf.boolean({
    default: false,
    persistent: false,
    onUpdate: [applyFocusMode, syncSettingsControls],
  });
}

export const state = await TypewriterState.create();
