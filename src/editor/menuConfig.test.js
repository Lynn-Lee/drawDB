import { describe, expect, it } from "vitest";

import {
  EDITOR_HOTKEYS,
  EDITOR_MENU_CATEGORIES,
  getEditorMenuItem,
  isEditorMenuItemDisabled,
} from "./menuConfig";

describe("menuConfig", () => {
  it("exposes discoverable menu names and shortcut descriptions", () => {
    expect(EDITOR_MENU_CATEGORIES.map((category) => category.id)).toEqual([
      "file",
      "edit",
      "view",
      "settings",
      "help",
    ]);

    expect(getEditorMenuItem("file", "open")).toMatchObject({
      labelKey: "open",
      shortcut: "Ctrl+O",
      hotkey: "mod+o",
    });
    expect(getEditorMenuItem("edit", "undo")).toMatchObject({
      labelKey: "undo",
      shortcut: "Ctrl+Z",
      hotkey: "mod+z",
    });
    expect(getEditorMenuItem("view", "show_grid")).toMatchObject({
      labelKey: "show_grid",
      shortcut: "Ctrl+Shift+G",
      hotkey: "mod+shift+g",
    });
  });

  it("keeps read-only and history disabled conditions testable", () => {
    expect(
      isEditorMenuItemDisabled("file", "save", {
        readOnly: true,
        undoCount: 1,
        redoCount: 1,
      }),
    ).toBe(true);
    expect(
      isEditorMenuItemDisabled("edit", "undo", {
        readOnly: false,
        undoCount: 0,
        redoCount: 1,
      }),
    ).toBe(true);
    expect(
      isEditorMenuItemDisabled("edit", "redo", {
        readOnly: false,
        undoCount: 1,
        redoCount: 0,
      }),
    ).toBe(true);
    expect(
      isEditorMenuItemDisabled("edit", "copy", {
        readOnly: true,
        undoCount: 0,
        redoCount: 0,
      }),
    ).toBe(false);
  });

  it("keeps hotkey registrations aligned with menu shortcuts", () => {
    expect(EDITOR_HOTKEYS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "save",
          keys: "mod+s",
          action: "save",
          shortcut: "Ctrl+S",
        }),
        expect.objectContaining({
          id: "save_as",
          keys: "mod+shift+s",
          action: "saveDiagramAs",
          shortcut: "Ctrl+Shift+S",
        }),
        expect.objectContaining({
          id: "toggle_dbml_editor",
          keys: "alt+e",
          action: "toggleDBMLEditor",
          shortcut: "Alt+E",
        }),
      ]),
    );
  });
});
