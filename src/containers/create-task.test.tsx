import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateTask } from "./create-task";
import "@testing-library/jest-dom/vitest";
/**
 * @vitest-environment jsdom
 */

const { mockHandleCreateTask } = vi.hoisted(() => ({
  mockHandleCreateTask: vi.fn(),
}));

vi.mock("../hooks/use-task.ts", () => ({
  useCreateTask: () => ({
    handleCreateTask: mockHandleCreateTask,
  }),
}));

const onSuccess = vi.fn();

const openSpy = vi.fn();
const closeSpy = vi.fn();
HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute("open", "true");
  openSpy();
  this.setAttribute("tabindex", "-1");
  this.focus();

  this.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") {
        this.close();
      }
    },
    { once: true },
  );
};

HTMLDialogElement.prototype.close = function () {
  this.removeAttribute("open");
  closeSpy();
};

describe("create task", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("should call api and close modal when success", async () => {
    render(<CreateTask onSuccess={onSuccess} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Add new task" }));

    await user.type(screen.getByPlaceholderText("title"), "new task");
    await user.type(screen.getByPlaceholderText("deadlineAt"), "2026-12-31");

    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(mockHandleCreateTask).toHaveBeenCalledWith({
      title: "new task",
      description: "",
      deadlineAt: "2026-12-31",
    });

    expect(onSuccess).toHaveBeenCalled();

    const dialog = document.getElementById("create_task_modal");
    expect(dialog).not.toHaveAttribute("open");
  });

  it("should show error when input value is invalid", async () => {
    render(<CreateTask onSuccess={onSuccess} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Add new task" }));
    await user.click(screen.getByRole("button", { name: "Add" }));

    const dialog = document.getElementById("create_task_modal");
    expect(dialog).toHaveAttribute("open");
    expect(openSpy).toHaveBeenCalled();
    expect(await screen.findByText("title is required")).toBeInTheDocument();
    expect(await screen.findByText("deadline is required")).toBeInTheDocument();
  });

  it("should close dialog when clock close button", async () => {
    render(<CreateTask onSuccess={onSuccess} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Add new task" }));
    await user.click(screen.getByRole("button", { name: "Close" }));

    const dialog = document.getElementById("create_task_modal");
    expect(dialog).not.toHaveAttribute("open");
    expect(closeSpy).toHaveBeenCalled();
  });

  it("should close dialog when press ESC", async () => {
    render(<CreateTask onSuccess={onSuccess} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Add new task" }));

    await user.keyboard("{Escape}");
    await waitFor(() => {
      const dialog = document.getElementById("create_task_modal");
      expect(dialog).not.toHaveAttribute("open");
    });
  });
});
