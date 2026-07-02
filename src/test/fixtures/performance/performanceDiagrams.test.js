import { describe, expect, it } from "vitest";

import {
  LARGE_DIAGRAM_SIZES,
  createPerformanceDiagram,
  performanceDiagrams,
} from "./performanceDiagrams";
import { validateDiagramShape } from "../../../domain/diagramSchema";

describe("performance diagram fixtures", () => {
  it("provides deterministic 100, 500, and 1000 table diagrams", () => {
    expect(LARGE_DIAGRAM_SIZES).toEqual([100, 500, 1000]);

    for (const size of LARGE_DIAGRAM_SIZES) {
      const diagram = performanceDiagrams[size];
      const regenerated = createPerformanceDiagram(size);

      expect(validateDiagramShape(diagram)).toEqual({
        valid: true,
        errors: [],
      });
      expect(diagram).toEqual(regenerated);
      expect(diagram.diagramId).toBe(`performance-${size}-tables`);
      expect(diagram.tables).toHaveLength(size);
      expect(diagram.relationships).toHaveLength(size - 1);
      expect(diagram.tables[0]).toMatchObject({
        id: `perf-${size}-table-001`,
        name: `perf_${size}_table_001`,
        x: 0,
        y: 0,
      });
      expect(diagram.tables.at(-1)).toMatchObject({
        id: `perf-${size}-table-${String(size).padStart(3, "0")}`,
        name: `perf_${size}_table_${String(size).padStart(3, "0")}`,
      });
    }
  });

  it("keeps relationship endpoints valid for downstream canvas and export smoke", () => {
    const diagram = createPerformanceDiagram(500);
    const tableIds = new Set(diagram.tables.map((table) => table.id));
    const fieldIdsByTable = new Map(
      diagram.tables.map((table) => [
        table.id,
        new Set(table.fields.map((field) => field.id)),
      ]),
    );

    for (const relationship of diagram.relationships) {
      expect(tableIds.has(relationship.startTableId)).toBe(true);
      expect(tableIds.has(relationship.endTableId)).toBe(true);
      expect(
        fieldIdsByTable
          .get(relationship.startTableId)
          .has(relationship.startFieldId),
      ).toBe(true);
      expect(
        fieldIdsByTable.get(relationship.endTableId).has(relationship.endFieldId),
      ).toBe(true);
    }
  });
});
