import {
  createTaskService,
  deleteTaskService,
  fetchTasksService,
  updateTaskService,
} from "../services/task";
import type { createTaskRequest, updateTaskRequest } from "../utils/taskSchema";
import axios from "axios";
import { toast } from "sonner";
import { useTaskStore } from "../stores/useTaskStore";

export const useCreateTask = () => {
  const handleCreateTask = async (task: createTaskRequest) => {
    try {
      await createTaskService({
        ...task,
        deadlineAt: new Date(task.deadlineAt),
      });

      toast.success("new task created successfully", {
        position: "bottom-left",
      });
    } catch (error) {
      const errMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Server rejected the request"
        : "An unexpected error occurred";

      toast.error(errMessage, {
        position: "bottom-left",
      });
    }
  };
  return { handleCreateTask };
};

export const useFetchTasks = () => {
  const pageLimit = 10;
  const setTasks = useTaskStore((state) => state.setTasks);

  const handleFetchTasks = async (currentPage: number) => {
    try {
      const res = await fetchTasksService(currentPage, pageLimit);

      setTasks(
        res.data.data.tasks,
        res.data.data.totalCount,
        res.data.data.totalPages,
      );
    } catch (error) {
      const errMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Server rejected the request"
        : "An unexpected error occurred";

      toast.error(errMessage, { position: "bottom-left" });
    }
  };

  return { handleFetchTasks };
};

export const useUpdateTask = () => {
  const handleUpdateTask = async (id: string, task: updateTaskRequest) => {
    try {
      await updateTaskService(id, {
        ...task,
        deadlineAt: new Date(task.deadlineAt),
      });

      toast.success("task updated successfully", { position: "bottom-left" });
    } catch (error) {
      const errMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Server rejected the request"
        : "An unexpected error occurred";

      toast.error(errMessage, { position: "bottom-left" });
    }
  };
  return { handleUpdateTask };
};

export const useDeleteTask = () => {
  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTaskService(id);

      toast.success("task deleted successfully", { position: "bottom-left" });
    } catch (error) {
      const errMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || "Server rejected the request"
        : "An unexpected error occurred";
      toast.error(errMessage, { position: "bottom-left" });
    }
  };
  return { handleDeleteTask };
};
