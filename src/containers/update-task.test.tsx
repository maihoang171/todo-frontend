import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { UpdateTask } from "./update-task";
import type { ITask } from "../services/task";
import userEvent from "@testing-library/user-event";
/**
 * @vitest-environment jsdom
 */
const { mockHandleUpdateTask, updateTask } = vi.hoisted(() => ({
  mockHandleUpdateTask: vi.fn(),
  updateTask: vi.fn(),
}));
vi.mock("../hooks/use-task.ts", () => ({
  useUpdateTask: () => ({
    handleUpdateTask: mockHandleUpdateTask,
  }),
}));

vi.mock("../stores/useTaskStore.ts", () => ({
  useTaskStore: (
    selector: (state: { updateTask: typeof updateTask }) => unknown,
  ) => selector({ updateTask: updateTask }),
}));

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

describe("update task", () => {
  const mockTask = {
    id: "mockId",
    title: "mock title",
    description: "",
    status: "PENDING",
    deadlineAt: new Date("2026-12-31"),
  };

  afterEach(() => {
    cleanup();
  });
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call api and update task when successfully", async () => {
    render(<UpdateTask task={mockTask as ITask} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Edit" }));

    const dialog = document.getElementById(`update_task_modal_${mockTask.id}`);
    expect(dialog).toHaveAttribute("open");
    expect(openSpy).toHaveBeenCalled();

    const titleUpdate = screen.getByPlaceholderText("title");
    user.clear(titleUpdate);
    await user.type(titleUpdate, "title updated");

    await user.click(screen.getByRole("button", { name: "Update" }));

    const dataUpdate = {
      title: "title updated",
      description: "",
      status: "PENDING",
      deadlineAt: "2026-12-31",
    };
    expect(mockHandleUpdateTask).toHaveBeenCalledWith(mockTask.id, dataUpdate);

    expect(updateTask).toHaveBeenCalledWith(mockTask.id, {
      ...dataUpdate,
      deadlineAt: new Date(dataUpdate.deadlineAt),
    });
  });

  it("should do nothing if onSubmit is called without a selectedTaskId", () => {
    render(<UpdateTask task={mockTask as ITask} />);

    const form = document.querySelector("form");
    expect(form).not.toBeNull();

    fireEvent.submit(form!);
    expect(mockHandleUpdateTask).not.toHaveBeenCalled();
    expect(updateTask).not.toHaveBeenCalled();
  });

  it("should close modal when click close button", async () => {
    render(<UpdateTask task={mockTask as ITask} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Edit" }));
    await user.click(screen.getByRole("button", { name: "Close" }));

    const dialog = document.getElementById(`update_task_modal_${mockTask.id}`);
    expect(dialog).not.toHaveAttribute("open");
    expect(closeSpy).toHaveBeenCalled();
  });

  it("should close modal when press ESC", async () => {
    render(<UpdateTask task={mockTask as ITask} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Edit" }));
    await user.keyboard("{Escape}");

    const dialog = document.getElementById(`update_task_modal_${mockTask.id}`);
    expect(dialog).not.toHaveAttribute("open");
  });

  it("should show error when title is empty", async () => {
    render(<UpdateTask task={mockTask as ITask} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Edit" }));
    const titleInput = screen.getByPlaceholderText("title");
    await user.clear(titleInput);

    await user.click(screen.getByRole("button", { name: "Update" }));

    expect(mockHandleUpdateTask).not.toHaveBeenCalled();
    expect(await screen.findByText("title is required")).toBeInTheDocument();
  });

  it("should show error when deadline is sooner than today or invalid", async () => {
    render(<UpdateTask task={mockTask as ITask} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Edit" }));
    const deadlineAtInput = screen.getByPlaceholderText("deadline");
    await user.clear(deadlineAtInput);

    await user.click(screen.getByRole("button", { name: "Update" }));

    expect(mockHandleUpdateTask).not.toHaveBeenCalled();
    expect(await screen.findByText("deadline is required")).toBeInTheDocument();

    const dayInThePast = "2025-12-02";
    await user.type(deadlineAtInput, dayInThePast);
    expect(
      screen.getByText("deadline must equal to or later than today"),
    ).toBeInTheDocument();
  });
});
