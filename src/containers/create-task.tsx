import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema, type createTaskRequest } from "../utils/taskSchema";
import { useCreateTask } from "../hooks/use-task";

interface CreateTaskProps {
  onSuccess: () => void;
}

export const CreateTask = ({ onSuccess }: CreateTaskProps) => {
  const { handleCreateTask } = useCreateTask();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<createTaskRequest>({
    resolver: zodResolver(createTaskSchema),
  });

  const createTaskModal = document.getElementById(
    "create_task_modal",
  ) as HTMLDialogElement;

  const openModal = () => {
    createTaskModal?.showModal();
  };

  const closeModal = () => {
    createTaskModal?.close();
  };

  const onSubmit = async (task: createTaskRequest) => {
    await handleCreateTask(task);
    reset();

    closeModal();
    onSuccess();
  };

  return (
    <>
      <button className="btn" onClick={() => openModal()}>
        Add new task
      </button>

      <dialog
        id="create_task_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create new task!</h3>
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
              <input
                className="input w-full"
                type="date"
                placeholder="deadlineAt"
                {...register("deadlineAt")}
              />
              {errors.deadlineAt && (
                <p className="text-red-500 mb-2">{errors.deadlineAt.message}</p>
              )}

              <div className="flex justify-center w-full gap-4">
                <button className="btn w-full flex-1">Add</button>
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
