import { renderHook, act } from "@testing-library/react";
import {
  useCreateTask,
  useDeleteTask,
  useFetchTasks,
  useUpdateTask,
} from "./use-task";
import { describe, it, vi, expect, beforeEach, type Mock } from "vitest";
import {
  createTaskService,
  deleteTaskService,
  fetchTasksService,
  updateTaskService,
} from "../services/task";
import { toast } from "sonner";

/**
 * @vitest-environment jsdom
 */

vi.mock("../services/task.ts", () => ({
  createTaskService: vi.fn(),
  fetchTasksService: vi.fn(),
  updateTaskService: vi.fn(),
  deleteTaskService: vi.fn(),
}));

const mockSetTasks = vi.fn();
vi.mock("../stores/useTaskStore.ts", () => ({
  useTaskStore: (selector: (state: { setTasks: typeof mockSetTasks }) => unknown) =>
    selector({ setTasks: mockSetTasks }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const ERROR_SCENARIOS = [
  [
    "exact backend error if axios error occurred",
    {
      isAxiosError: true,
      response: {
        data: {
          message: "Database connection failed",
        },
      },
    },
    "Database connection failed",
  ],
  [
    "default error from Server if axios error occurred but has no exact message",
    {
      isAxiosError: true,
      response: {
        data: {},
      },
    },
    "Server rejected the request",
  ],
  [
    "fallback message if the server crashes unexpectedly",
    new Error("Something completely crashes"),
    "An unexpected error occurred",
  ],
] as const;

describe("useCreateTask", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call API create task and show a message when successful", async () => {
    (createTaskService as Mock).mockResolvedValue({});

    const { result } = renderHook(() => useCreateTask());

    const mockTask = {
      title: "mock task",
      deadlineAt: "2026-05-10",
    };

    await act(async () => {
      await result.current.handleCreateTask(mockTask);
    });

    expect(createTaskService).toHaveBeenCalledWith({
      title: "mock task",
      deadlineAt: expect.any(Date),
    });

    expect(toast.success).toHaveBeenCalledWith(
      "new task created successfully",
      {
        position: "bottom-left",
      },
    );
  });

  it.each(ERROR_SCENARIOS)(
    "should return %s",
    async (_description, fakeError, expectedMessage) => {
      (createTaskService as Mock).mockRejectedValue(fakeError);

      const { result } = renderHook(() => useCreateTask());
      const mockData = { title: "test", deadlineAt: "2026-12-01" };
      await act(async () => await result.current.handleCreateTask(mockData));

      expect(toast.error).toHaveBeenCalledWith(expectedMessage, {
        position: "bottom-left",
      });
    },
  );
});

describe("useFetchTasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call api fetch tasks and show message when successfully", async () => {
    const mockResponse = {
      success: true,
      data: {
        tasks: [
          {
            id: "c80e2044-8c11-44f5-8504-107ef98f93cb",
            title: "1",
            description: "",
            deadlineAt: "2026-05-02T00:00:00.000Z",
            status: "COMPLETED",
            createdAt: "2026-04-09T13:42:35.965Z",
            updatedAt: "2026-04-09T14:01:31.461Z",
            deletedAt: null,
          },
        ],
        totalCount: 1,
        totalPages: 1,
      },
    };

    (fetchTasksService as Mock).mockResolvedValue({ data: mockResponse });
    const { result } = renderHook(() => useFetchTasks());

    await act(async () => await result.current.handleFetchTasks(1));

    expect(fetchTasksService).toHaveBeenCalledWith(1, 10);

    expect(mockSetTasks).toHaveBeenCalledWith(
      mockResponse.data.tasks,
      mockResponse.data.totalCount,
      mockResponse.data.totalPages,
    );
  });

  it.each(ERROR_SCENARIOS)(
    "should return %s",
    async (_description, fakeError, expectedMessage) => {
      (fetchTasksService as Mock).mockRejectedValue(fakeError);

      const { result } = renderHook(() => useFetchTasks());
      await act(async () => await result.current.handleFetchTasks(1));

      expect(toast.error).toHaveBeenCalledWith(expectedMessage, {
        position: "bottom-left",
      });
    },
  );
});

describe("useUpdateTask", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call api update task and show message when successfully", async () => {
    (updateTaskService as Mock).mockResolvedValue({});

    const { result } = renderHook(() => useUpdateTask());
    const mockId = "mockId";
    const mockData = {
      title: "test",
      deadlineAt: "2026-12-01",
      status: "PENDING",
    } as const;

    await act(
      async () => await result.current.handleUpdateTask(mockId, mockData),
    );

    expect(toast.success).toHaveBeenCalledWith("task updated successfully", {
      position: "bottom-left",
    });
  });

  it.each(ERROR_SCENARIOS)(
    "should return %s",
    async (_description, fakeError, expectedMessage) => {
      (updateTaskService as Mock).mockRejectedValue(fakeError);
      const { result } = renderHook(() => useUpdateTask());

      const mockId = "mockID";
      const mockData = {
        title: "test",
        deadlineAt: "2026-12-01",
        status: "PENDING",
      } as const;

      await act(
        async () => await result.current.handleUpdateTask(mockId, mockData),
      );
      expect(toast.error).toHaveBeenCalledWith(expectedMessage, {
        position: "bottom-left",
      });
    },
  );
});

describe("useDeleteTask", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call api delete task and show message when successfully", async () => {
    (deleteTaskService as Mock).mockResolvedValue({});
    const { result } = renderHook(() => useDeleteTask());

    const mockId = "mockId";
    await act(async () => await result.current.handleDeleteTask(mockId));

    expect(toast.success).toHaveBeenCalledWith("task deleted successfully", {
      position: "bottom-left",
    });
  });

  it.each(ERROR_SCENARIOS)(
    "should return %s",
    async (_description, fakeError, expectedMessage) => {
      (deleteTaskService as Mock).mockRejectedValue(fakeError);
      const { result } = renderHook(() => useDeleteTask());

      const mockId = "mockID";

      await act(async () => await result.current.handleDeleteTask(mockId));
      expect(toast.error).toHaveBeenCalledWith(expectedMessage, {
        position: "bottom-left",
      });
    },
  );
});
