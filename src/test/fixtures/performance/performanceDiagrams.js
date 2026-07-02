import { Cardinality, DB } from "../../../data/constants";
import { createDiagram, createField, createTable } from "../../../domain/diagramModel";

export const LARGE_DIAGRAM_SIZES = [100, 500, 1000];

const TABLES_PER_ROW = 20;
const TABLE_X_GAP = 280;
const TABLE_Y_GAP = 220;

const padTableNumber = (value) => String(value).padStart(3, "0");

const tableId = (size, index) =>
  `perf-${size}-table-${padTableNumber(index)}`;

const fieldId = (size, tableIndex, fieldName) =>
  `${tableId(size, tableIndex)}-${fieldName}`;

function createPerformanceTable(size, index) {
  const tableNumber = padTableNumber(index);
  const column = (index - 1) % TABLES_PER_ROW;
  const row = Math.floor((index - 1) / TABLES_PER_ROW);

  return createTable({
    id: tableId(size, index),
    name: `perf_${size}_table_${tableNumber}`,
    x: column * TABLE_X_GAP,
    y: row * TABLE_Y_GAP,
    fields: [
      createField({
        id: fieldId(size, index, "id"),
        name: "id",
        type: "integer",
        primary: true,
        notNull: true,
        increment: true,
      }),
      createField({
        id: fieldId(size, index, "name"),
        name: "name",
        type: "varchar(255)",
        notNull: true,
      }),
      createField({
        id: fieldId(size, index, "parent_id"),
        name: "parent_id",
        type: "integer",
        notNull: index > 1,
      }),
      createField({
        id: fieldId(size, index, "updated_at"),
        name: "updated_at",
        type: "timestamp",
        notNull: true,
      }),
    ],
    indices: [
      {
        id: `perf-${size}-idx-${tableNumber}-parent`,
        name: `idx_perf_${size}_${tableNumber}_parent_id`,
        fields: [fieldId(size, index, "parent_id")],
      },
    ],
  });
}

function createPerformanceRelationships(size) {
  return Array.from({ length: size - 1 }, (_, relationshipIndex) => {
    const childIndex = relationshipIndex + 2;
    const parentIndex = childIndex - 1;
    const relationshipNumber = padTableNumber(relationshipIndex + 1);

    return {
      id: `perf-${size}-relationship-${relationshipNumber}`,
      name: `fk_perf_${size}_${padTableNumber(childIndex)}_${padTableNumber(
        parentIndex,
      )}`,
      cardinality: Cardinality.MANY_TO_ONE,
      startTableId: tableId(size, childIndex),
      startFieldId: fieldId(size, childIndex, "parent_id"),
      endTableId: tableId(size, parentIndex),
      endFieldId: fieldId(size, parentIndex, "id"),
    };
  });
}

export function createPerformanceDiagram(size) {
  if (!LARGE_DIAGRAM_SIZES.includes(size)) {
    throw new Error(
      `Unsupported performance diagram size ${size}. Use ${LARGE_DIAGRAM_SIZES.join(
        ", ",
      )}.`,
    );
  }

  return createDiagram({
    diagramId: `performance-${size}-tables`,
    name: `Performance ${size} tables`,
    database: DB.GENERIC,
    tables: Array.from({ length: size }, (_, index) =>
      createPerformanceTable(size, index + 1),
    ),
    relationships: createPerformanceRelationships(size),
    pan: { x: 0, y: 0 },
    zoom: 0.6,
  });
}

export const performanceDiagrams = Object.freeze(
  Object.fromEntries(
    LARGE_DIAGRAM_SIZES.map((size) => [size, createPerformanceDiagram(size)]),
  ),
);
