import { cleanup, render, screen, within } from "@testing-library/react";
import { describe, vi, it, beforeEach, afterEach, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { TaskDetail } from "./task-detail";
import userEvent from "@testing-library/user-event";
/**
 * @vitest-environment jsdom
 */

const { mockState } = vi.hoisted(() => ({
  mockState: {
    tasks: [] as Array<{
      id: string;
      title: string;
      description: string;
      status: string;
      deadlineAt: string;
    }>,
    deleteTask: vi.fn(),
  },
}));
vi.mock("../stores/useTaskStore.ts", () => ({
  useTaskStore: (selector: (state: typeof mockState) => unknown) =>
    selector(mockState),
}));

const mockHandleDeleteTask = vi.fn();
vi.mock("../hooks/use-task.ts", () => ({
  useDeleteTask: () => ({
    handleDeleteTask: mockHandleDeleteTask,
  }),
}));

vi.mock("../containers/update-task.tsx", () => ({
  UpdateTask: () => <button>Mock update</button>,
}));

describe("task detail component", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockState.tasks = [];
  });

  it("should display 'No task has found' when no tasks existed", () => {
    render(<TaskDetail />);
    const message = screen.getByText("No task has found");
    expect(message).toBeInTheDocument();
  });

  it("should display task list if tasks existed", () => {
    mockState.tasks = [
      {
        id: "mockId1",
        title: "mock title 1",
        description: "",
        status: "PENDING",
        deadlineAt: "2026-12-03",
      },
      {
        id: "mockId2",
        title: "mock title 2",
        description: "mock description",
        status: "COMPLETED",
        deadlineAt: "2026-12-04",
      },
    ];

    render(<TaskDetail />);

    const row1 = screen.getByText("mock title 1").closest("tr");
    expect(row1).not.toBeNull();
    expect(within(row1!).getByText("PENDING")).toBeInTheDocument();
    expect(within(row1!).getByText("12/03/2026")).toBeInTheDocument();

    const row2 = screen.getByText("mock title 2").closest("tr");
    expect(row2).not.toBeNull();
    expect(within(row2!).getByText("COMPLETED")).toBeInTheDocument();
    expect(within(row2!).getByText("mock description")).toBeInTheDocument();
    expect(within(row2!).getByText("12/04/2026")).toBeInTheDocument();
  });

  it("should delete the task when click to button delete", async () => {
    const targetId = "task-to-delete-123";

    mockState.tasks = [
      {
        id: targetId,
        title: "Delete Me",
        description: "I should disappear",
        status: "PENDING",
        deadlineAt: "2026-12-03",
      },
    ];

    render(<TaskDetail />);
    const user = userEvent.setup();

    const deleteButton = screen.getByRole("button", { name: "Delete" });
    await user.click(deleteButton);
    expect(mockHandleDeleteTask).toHaveBeenCalledWith(targetId);
    expect(mockState.deleteTask).toHaveBeenCalledWith(targetId);
  });

  it("should render the mocked update component", () => {
    mockState.tasks = [
      {
        id: "mockId1",
        title: "mock title 1",
        description: "",
        status: "PENDING",
        deadlineAt: "2026-12-03",
      },
      {
        id: "mockId2",
        title: "mock title 2",
        description: "mock description",
        status: "COMPLETED",
        deadlineAt: "2026-12-04",
      },
    ];

    render(<TaskDetail />);
    expect(screen.getAllByText("Mock update")).toHaveLength(
      mockState.tasks.length,
    );
  });
});
