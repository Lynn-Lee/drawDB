import { describe, expect, it } from "vitest";

import { createDiagram, createTable } from "./diagramModel";
import { validateDiagramShape } from "./diagramSchema";

describe("validateDiagramShape", () => {
  it("accepts a normalized diagram", () => {
    const result = validateDiagramShape(
      createDiagram({
        diagramId: "local-1",
        name: "Local diagram",
        tables: [createTable({ id: "users", name: "users" })],
      }),
    );

    expect(result).toEqual({ valid: true, errors: [] });
  });

  it("rejects diagrams without a diagramId", () => {
    const result = validateDiagramShape({
      ...createDiagram({ diagramId: "local-1" }),
      diagramId: undefined,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual({
      path: "diagramId",
      message: "diagramId is required.",
    });
  });

  it("reports tables path when tables is not an array", () => {
    const result = validateDiagramShape({
      ...createDiagram({ diagramId: "local-1" }),
      tables: "users",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual({
      path: "tables",
      message: "tables must be an array.",
    });
  });

  it("rejects dangerous prototype keys in diagram content", () => {
    const diagram = {
      ...createDiagram({ diagramId: "local-1", name: "Local diagram" }),
      tables: [
        JSON.parse(
          '{"id":"users","name":"users","fields":[],"__proto__":{"polluted":true}}',
        ),
      ],
      constructor: { prototype: { polluted: true } },
    };

    const result = validateDiagramShape(diagram);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual({
      path: "tables.0.__proto__",
      message: "__proto__ is not allowed.",
    });
    expect(result.errors).toContainEqual({
      path: "constructor",
      message: "constructor is not allowed.",
    });
  });
});
