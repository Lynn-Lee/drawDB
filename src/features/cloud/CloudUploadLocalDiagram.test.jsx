import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import CloudUploadLocalDiagram from "./CloudUploadLocalDiagram";

vi.mock("@douyinfe/semi-icons", () => ({
  IconCloudUploadStroked: function IconCloudUploadStroked() {
    return null;
  },
}));

vi.mock("@douyinfe/semi-ui", () => ({
  Button: function Button({ children, onClick, "aria-label": ariaLabel }) {
    return (
      <button type="button" aria-label={ariaLabel} onClick={onClick}>
        {children}
      </button>
    );
  },
  Modal: function Modal({
    children,
    title,
    visible,
    okText,
    onOk,
    onCancel,
  }) {
    if (!visible) {
      return null;
    }
    return (
      <div role="dialog" aria-label={title}>
        {children}
        <button type="button" onClick={onOk}>
          {okText}
        </button>
        <button type="button" onClick={onCancel}>
          cancel
        </button>
      </div>
    );
  },
}));

vi.mock("react-i18next", () => ({
  initReactI18next: {
    type: "3rdParty",
    init: vi.fn(),
  },
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("CloudUploadLocalDiagram", () => {
  it("requires explicit confirmation before sending diagram data", async () => {
    const upload = vi.fn().mockResolvedValue({
      ok: true,
      cloudDiagramId: "cloud-1",
    });

    render(
      <CloudUploadLocalDiagram
        enabled
        repository={{ saveCloudDiagram: vi.fn() }}
        diagram={{ diagramId: "local-1", name: "Orders" }}
        upload={upload}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "cloud_upload_local_diagram" }),
    );

    expect(upload).not.toHaveBeenCalled();
    expect(
      screen.getByText("cloud_upload_data_disclosure_description"),
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "cloud_upload_confirm" }),
    );

    expect(upload).toHaveBeenCalledWith({
      repository: { saveCloudDiagram: expect.any(Function) },
      diagram: { diagramId: "local-1", name: "Orders" },
    });
    expect(await screen.findByText("cloud_upload_success")).toBeInTheDocument();
  });

  it("shows failure without clearing the local diagram", async () => {
    const upload = vi.fn().mockResolvedValue({
      ok: false,
      reason: "unavailable",
      message: "Cloud unavailable",
    });

    render(
      <CloudUploadLocalDiagram
        enabled
        repository={{ saveCloudDiagram: vi.fn() }}
        diagram={{ diagramId: "local-1", name: "Orders" }}
        upload={upload}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "cloud_upload_local_diagram" }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "cloud_upload_confirm" }),
    );

    expect(await screen.findByText("Cloud unavailable")).toBeInTheDocument();
    expect(screen.getByText("cloud_upload_local_copy_preserved"));
  });

  it("stays hidden when cloud upload is not enabled", () => {
    render(
      <CloudUploadLocalDiagram
        enabled={false}
        repository={{ saveCloudDiagram: vi.fn() }}
        diagram={{ diagramId: "local-1" }}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "cloud_upload_local_diagram" }),
    ).not.toBeInTheDocument();
  });
});
