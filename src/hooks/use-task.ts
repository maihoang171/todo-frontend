import { toast } from "sonner";
import { addTaskService } from "../services/task";
import { useState } from "react";
import axios from "axios";
import type { createTaskRequest } from "../utils/TaskSchema";

export const useAddTask = () => {
  const [error, setError] = useState("");
  const handleAddTask = async (payload: createTaskRequest) => {
    try {
      setError("");

      await addTaskService(payload);

      const message = "your new task has been created";

      toast.success(message, {
        position: "bottom-left",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Invalid input");
        } else {
          setError("An error occurred");
        }
      } else {
        setError("An unexpected error occurred");
      }

      const message = "can not create your new task. please try again";

      toast.error(message, {
        position: "bottom-left",
      });
    }
  };

  return {
    error,
    handleAddTask,
  };
};
