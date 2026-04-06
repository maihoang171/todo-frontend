import { useState } from "react";
import { createTaskService } from "../services/task";
import type { createTaskRequest } from "../utils/TaskSchema";
import axios from "axios";
import { toast } from "sonner";

export const useCreateTask = () => {
  const [error, setError] = useState("");
  const handleCreateTask = async (task: createTaskRequest) => {
    try {
      setError("");
      await createTaskService({
        ...task,
        deadlineAt: new Date(task.deadlineAt),
      });

      toast.success("new task created successfully", {
        position: "bottom-left",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError("an error occurred");
      } else {
        setError("an unexpected error occurred");
      }

      toast.error("cannot create new task", {
        position: "bottom-left"
      })
    }
  };
  return { error, handleCreateTask };
};
