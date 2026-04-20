import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { type updateTaskRequest, updateTaskSchema } from "../utils/taskSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateTask } from "../hooks/use-task";
import type { ITask } from "../services/task";
import { useState } from "react";
import { useTaskStore } from "../stores/useTaskStore";

interface UpdateTaskProps {
  task: ITask;
}

export const UpdateTask = ({ task }: UpdateTaskProps) => {
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const { handleUpdateTask } = useUpdateTask();

  const updateTaskInStore = useTaskStore((state) => state.updateTask);

  const updateTaskModal = document.getElementById(
    `update_task_modal_${task.id}`,
  ) as HTMLDialogElement;

  const showModal = () => {
    updateTaskModal?.showModal();
  };

  const handleUpdate = (task: ITask) => {
    setSelectedTaskId(task.id);

    reset({
      title: task.title,
      description: task.description || "",
      status: task.status as updateTaskRequest["status"],
      deadlineAt: format(new Date(task.deadlineAt), "yyyy-MM-dd"),
    });
    showModal();
  };

  const closeModal = () => {
    updateTaskModal?.close();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<updateTaskRequest>({ resolver: zodResolver(updateTaskSchema) });

  const onSubmit = async (data: updateTaskRequest) => {
    await handleUpdateTask(selectedTaskId, data);
    reset();
    updateTaskInStore(selectedTaskId, {
      ...data,
      deadlineAt: new Date(data.deadlineAt),
    });

    closeModal();
  };

  return (
    <>
      <button className="btn bg-amber-300" onClick={() => handleUpdate(task)}>
        Edit
      </button>

      <dialog
        id={`update_task_modal_${task.id}`}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update task!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form
              className="w-full flex flex-col gap-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                className="input w-full"
                type="text"
                placeholder="title"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-red-500 mb-2">{errors.title.message}</p>
              )}

              <input
                className="input w-full"
                type="text"
                placeholder="description"
                {...register("description")}
              />

              <select
                defaultValue="Status"
                className="select w-full"
                {...register("status")}
              >
                <option disabled={true}>Status</option>
                <option value={"PENDING"}>Pending</option>
                <option value={"IN_PROGRESS"}>In progress</option>
                <option value={"COMPLETED"}>Completed</option>
              </select>

              <input
                className="input w-full"
                type="date"
                placeholder="deadline"
                {...register("deadlineAt")}
              />
              {errors.deadlineAt && (
                <p className="text-red-500 mb-2">{errors.deadlineAt.message}</p>
              )}

              <div className="flex justify-center w-full gap-4">
                <button className="btn w-full flex-1">Update</button>
                <button
                  type="button"
                  className="btn w-full flex-1"
                  onClick={() => closeModal()}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};
