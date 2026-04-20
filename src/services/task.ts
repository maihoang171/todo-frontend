import { axiosClient } from "./axios";
import { type statusRequest } from "../utils/taskSchema";
export interface ICreateTaskPayload {
  title: string;
  description?: string;
  deadlineAt: Date;
}

export const createTaskService = async (task: ICreateTaskPayload) => {
  return await axiosClient.post("/task", task);
};

export interface IFetchTasksResponse {
  success: boolean;
  data: {
    tasks: ITask[];
    totalCount: number;
    totalPages: number;
  };
}
export interface ITask {
  id: string;
  title: string;
  description?: string;
  status: string;
  deadlineAt: Date;
  createdAt: Date;
  deletedAt: Date;
  updatedAt: Date;
}

export const fetchTasksService = async (page: number, limit: number) => {
  return await axiosClient.get("/task", {
    params: { page, limit },
  });
};

export const deleteTaskService = async (id: string) => {
  return await axiosClient.delete(`/task/${id}`);
};

export interface IUpdateTaskPayload {
  title: string;
  description?: string;
  status: statusRequest;
  deadlineAt: Date;
}

export const updateTaskService = async (
  id: string,
  task: Pick<ITask, "title" | "description" | "status" | "deadlineAt">,
) => {
  return await axiosClient.patch(`/task/${id}`, task);
};
