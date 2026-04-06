import { axiosClient } from "./axios";
import { type createTaskRequest } from "../utils/TaskSchema";

export const addTaskService = async (payload: createTaskRequest) => {
  return await axiosClient.post("/task", payload);
};
