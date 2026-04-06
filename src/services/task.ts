import { axiosClient } from "./axios";

export interface ICreateTaskPayload {
  title: string;
  description?: string;
  deadlineAt: Date;
}
export const createTaskService = async (task: ICreateTaskPayload) => {
  return await axiosClient.post("/task", task);
};
