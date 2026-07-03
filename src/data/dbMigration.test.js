import { describe, expect, it, vi } from "vitest";

import {
  CURRENT_INDEXEDDB_VERSION,
  INDEXEDDB_VERSION_JUMP_NOTE,
  backfillStableIds,
  logSeedError,
} from "./dbMigration";

function createStore(rows) {
  return {
    toCollection() {
      return {
        async modify(callback) {
          rows.forEach(callback);
        },
      };
    },
  };
}

describe("IndexedDB migration helpers", () => {
  it("documents why the independent baseline starts at Dexie version 67", () => {
    expect(CURRENT_INDEXEDDB_VERSION).toBe(67);
    expect(INDEXEDDB_VERSION_JUMP_NOTE).toContain("independent refactor baseline");
    expect(INDEXEDDB_VERSION_JUMP_NOTE).toContain("no v1-v66 schema history");
  });

  it("backfills stable ids for legacy rows without overwriting existing ids", async () => {
    const randomUUID = vi
      .spyOn(crypto, "randomUUID")
      .mockReturnValueOnce("diagram-generated")
      .mockReturnValueOnce("template-generated");

    const diagrams = [
      { id: 1, name: "Legacy diagram" },
      { id: 2, name: "Existing diagram", diagramId: "diagram-existing" },
    ];
    const templates = [
      { id: 1, name: "Legacy template" },
      { id: 2, name: "Existing template", templateId: "template-existing" },
    ];

    await backfillStableIds({
      diagrams: createStore(diagrams),
      templates: createStore(templates),
    });

    expect(diagrams).toEqual([
      { id: 1, name: "Legacy diagram", diagramId: "diagram-generated" },
      { id: 2, name: "Existing diagram", diagramId: "diagram-existing" },
    ]);
    expect(templates).toEqual([
      { id: 1, name: "Legacy template", templateId: "template-generated" },
      { id: 2, name: "Existing template", templateId: "template-existing" },
    ]);
    expect(randomUUID).toHaveBeenCalledTimes(2);
  });

  it("logs seed errors only in development", () => {
    const error = new Error("seed failed");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    logSeedError(error, { dev: false });
    expect(consoleError).not.toHaveBeenCalled();

    logSeedError(error, { dev: true });
    expect(consoleError).toHaveBeenCalledWith(error);
  });
});
