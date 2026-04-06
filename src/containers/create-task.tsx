import { useAddTask } from "../hooks/use-task";
import { createTaskSchema, type createTaskRequest } from "../utils/TaskSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const CreateTask = () => {
  const { error: serverError, handleAddTask } = useAddTask();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createTaskRequest>({
    resolver: zodResolver(createTaskSchema),
  });

  const onSubmit = async (data: createTaskRequest) => {
    await handleAddTask(data);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-2 m-5"
      >
        <input
          className="input"
          type="text"
          required
          placeholder="title"
          {...register("title")}
        />
        {errors.title && <p className="text-red-500 mb-1.5">{errors.title.message}</p>}

        <input
          className="input"
          type="text"
          placeholder="description"
          {...register("description")}
        />

        <input
          className="input"
          type="date"
          required
          placeholder="deadline date"
          {...register("deadlineAt")}
        />
        {errors.deadlineAt && <p className="text-red-500 mb-1.5">{errors.deadlineAt.message}</p>}

        <button className="btn btn-primary">Add new task</button>
        {serverError && <p className="text-red-500 mb-1.5">{serverError}</p>}
      </form>
    </>
  );
};

export default CreateTask;
