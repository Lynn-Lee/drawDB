import { useCallback, useMemo, useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { defaultBlue } from "../../data/constants";
import {
  CanvasAreaLayer,
  CanvasNoteLayer,
  CanvasRelationshipLayer,
  CanvasTableLayer,
} from "./CanvasRenderLayer";

const tableRender = vi.fn();
const areaRender = vi.fn();
const noteRender = vi.fn();
const relationshipRender = vi.fn();

vi.mock("./Table", () => ({
  default: (props) => {
    tableRender(props);
    return <g data-testid={`table-${props.tableData.id}`} />;
  },
}));

vi.mock("./Area", () => ({
  default: (props) => {
    areaRender(props);
    return <g data-testid={`area-${props.data.id}`} />;
  },
}));

vi.mock("./Note", () => ({
  default: (props) => {
    noteRender(props);
    return <g data-testid={`note-${props.data.id}`} />;
  },
}));

vi.mock("./Relationship", () => ({
  default: (props) => {
    relationshipRender(props);
    return <g data-testid={`relationship-${props.data.id}`} />;
  },
}));

function RenderHarness({ nextTable }) {
  const [tick, setTick] = useState(0);
  const [table, setTable] = useState({
    id: "users",
    name: "users",
    x: 10,
    y: 20,
    color: defaultBlue,
    fields: [],
  });
  const area = useMemo(
    () => ({
      id: "area-1",
      name: "Core",
      x: 0,
      y: 0,
      width: 300,
      height: 180,
    }),
    [],
  );
  const note = useMemo(
    () => ({
      id: "note-1",
      title: "Note",
      x: 12,
      y: 24,
      height: 160,
    }),
    [],
  );
  const relationship = useMemo(
    () => ({ id: "rel-1", startTableId: "users", endTableId: "orgs" }),
    [],
  );
  const stableCallback = useCallback(() => {}, []);

  return (
    <>
      <button onClick={() => setTick((value) => value + 1)}>rerender</button>
      <button onClick={() => setTable(nextTable)}>change-table</button>
      <span data-testid="tick">{tick}</span>
      <svg>
        <CanvasAreaLayer
          area={area}
          setAreaResize={stableCallback}
          setAreaInitDimensions={stableCallback}
          onElementPointerDown={stableCallback}
        />
        <CanvasRelationshipLayer relationship={relationship} />
        <CanvasTableLayer
          table={table}
          setHoveredTable={stableCallback}
          handleGripField={stableCallback}
          setLinkingLine={stableCallback}
          onElementPointerDown={stableCallback}
        />
        <CanvasNoteLayer note={note} onElementPointerDown={stableCallback} />
      </svg>
    </>
  );
}

describe("Canvas render layer memoization", () => {
  it("does not redraw stable canvas nodes when parent state changes", () => {
    const nextTable = {
      id: "users",
      name: "accounts",
      x: 10,
      y: 20,
      color: defaultBlue,
      fields: [],
    };

    render(<RenderHarness nextTable={nextTable} />);

    expect(tableRender).toHaveBeenCalledTimes(1);
    expect(areaRender).toHaveBeenCalledTimes(1);
    expect(noteRender).toHaveBeenCalledTimes(1);
    expect(relationshipRender).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("rerender"));

    expect(tableRender).toHaveBeenCalledTimes(1);
    expect(areaRender).toHaveBeenCalledTimes(1);
    expect(noteRender).toHaveBeenCalledTimes(1);
    expect(relationshipRender).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("change-table"));

    expect(tableRender).toHaveBeenCalledTimes(2);
    expect(areaRender).toHaveBeenCalledTimes(1);
    expect(noteRender).toHaveBeenCalledTimes(1);
    expect(relationshipRender).toHaveBeenCalledTimes(1);
  });
});
