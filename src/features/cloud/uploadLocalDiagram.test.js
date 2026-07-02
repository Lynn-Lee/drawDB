import { describe, expect, it, vi } from "vitest";

import { DB } from "../../data/constants";
import { uploadLocalDiagram } from "./uploadLocalDiagram";

describe("uploadLocalDiagram", () => {
  it("uploads a normalized diagram only when called explicitly", async () => {
    const repository = {
      saveCloudDiagram: vi.fn().mockResolvedValue({
        ok: true,
        diagram: {
          id: "cloud-1",
          modifiedAt: "2026-07-02T10:00:00.000Z",
          permission: "owner",
        },
      }),
    };

    const result = await uploadLocalDiagram({
      repository,
      diagram: {
        diagramId: "local-1",
        name: "Orders",
        database: DB.POSTGRES,
        tables: [{ id: 1, name: "orders", fields: [] }],
        references: [{ id: 2, sourceTableId: 1, targetTableId: 1 }],
      },
    });

    expect(repository.saveCloudDiagram).toHaveBeenCalledTimes(1);
    expect(repository.saveCloudDiagram).toHaveBeenCalledWith(
      expect.objectContaining({
        schemaVersion: expect.any(Number),
        diagramId: "local-1",
        name: "Orders",
        database: DB.POSTGRES,
        tables: [expect.objectContaining({ id: "1", name: "orders" })],
        relationships: [expect.objectContaining({ id: "2" })],
        pan: { x: 0, y: 0 },
        zoom: 1,
      }),
    );
    expect(result).toEqual({
      ok: true,
      cloudDiagramId: "cloud-1",
      modifiedAt: "2026-07-02T10:00:00.000Z",
      permission: "owner",
    });
  });

  it("returns a structured failure without mutating local save state", async () => {
    const setSaveState = vi.fn();
    const repository = {
      saveCloudDiagram: vi.fn().mockResolvedValue({
        ok: false,
        reason: "network-error",
        message: "offline",
      }),
    };

    const result = await uploadLocalDiagram({
      repository,
      diagram: { diagramId: "local-1", name: "Local only" },
      setSaveState,
    });

    expect(result).toEqual({
      ok: false,
      reason: "network-error",
      message: "offline",
    });
    expect(setSaveState).not.toHaveBeenCalled();
  });
});
