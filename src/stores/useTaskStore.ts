import { create } from "zustand";
import type { ITask } from "../services/task";

interface TaskState {
  tasks: ITask[] | [];
  totalCount: number;
  totalPages: number;
  setTasks: (data: ITask[], totalCount: number, totalPages: number) => void;
  updateTask: (taskId: string, updatedTask: Partial<ITask>) => void;
  deleteTask: (taskId: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  totalCount: 0,
  totalPages: 0,
  setTasks: (data, totalCount, totalPages) =>
    set({ tasks: data, totalCount, totalPages }),
  updateTask: (taskId, updatedTask) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, ...updatedTask } : t,
      ),
    }));
  },
  deleteTask: (taskId) => {
    set((state) => {
      const totalCount = state.totalCount - 1;
      const limit = 10;

      return {
        tasks: state.tasks.filter((t) => t.id !== taskId),
        totalCount: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      };
    });
  },
}));
